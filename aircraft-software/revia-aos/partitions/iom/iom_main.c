/*
 * Revia IOM — I/O manager partition (DAL A)
 *
 * On the aircraft this partition owns the ARINC 664 end system and
 * sensor buses, publishing validated air data and inceptor positions
 * to consumers. In the host build it additionally runs a small
 * longitudinal airframe model driven by the FCS surface command, so
 * the control loop closes end-to-end through real kernel channels.
 *
 * @satisfies AOS-SRS-100 (validated sensor publication)
 * @satisfies AOS-SRS-102 (source data marked invalid on acquisition fault)
 */
#include <string.h>

#include "aos_kernel.h"
#include "aos_port.h"
#include "revia_msgs.h"
#include "iom_part.h"

/* Toy short-period model constants (host verification only). */
#define MODEL_M_ELEV   (-0.6f)  /* pitch accel per deg elevator [1/s^2] */
#define MODEL_M_Q      (-0.8f)  /* pitch damping                [1/s]   */
#define MODEL_M_ALPHA  (-0.5f)  /* static stability             [1/s^2] */
#define MODEL_TRIM_ALPHA  3.0f  /* trim angle of attack         [deg]   */

static iom_state_t *iom_state(void)
{
    const aos_module_config_t *cfg = aos_kernel_config();

    return (iom_state_t *)cfg->parts[aos_partition_current()].region_base;
}

aos_ret_t iom_part_init(aos_part_mode_t start_mode)
{
    aos_ret_t ret;
    iom_state_t *st = iom_state();

    (void)start_mode;
    st->alpha_deg = MODEL_TRIM_ALPHA;
    st->have_prev = false;

    ret = aos_port_lookup("IOM_ADC_OUT", &st->p_adc_out);
    if (ret == AOS_OK)
    {
        ret = aos_port_lookup("IOM_ADC_MON_OUT", &st->p_adc_mon_out);
    }
    if (ret == AOS_OK)
    {
        ret = aos_port_lookup("IOM_PILOT_OUT", &st->p_pilot_out);
    }
    if (ret == AOS_OK)
    {
        ret = aos_port_lookup("IOM_SURF_IN", &st->p_surf_in);
    }
    return ret;
}

aos_ret_t iom_part_step(aos_time_us_t window_start_us)
{
    iom_state_t *st = iom_state();
    msg_surf_t  surf;
    msg_adc_t   adc;
    msg_pilot_t pilot;
    size_t      len = 0u;
    bool        fresh = false;
    float       dt_s;
    aos_ret_t   r1;
    aos_ret_t   r2;

    /* Latest surface command (absent on the very first frames). */
    if ((aos_sampling_read(st->p_surf_in, &surf, sizeof(surf),
                           &len, &fresh) == AOS_OK) &&
        (len == sizeof(surf)) && fresh)
    {
        st->elev_deg = surf.elev_deg;
    }

    if (st->have_prev && (window_start_us > st->t_prev_us))
    {
        dt_s = (float)(window_start_us - st->t_prev_us) * 1.0e-6f;
    }
    else
    {
        dt_s = 0.05f;
    }
    st->t_prev_us = window_start_us;
    st->have_prev = true;

    /* Integrate the short-period model (host verification only;
     * flight builds replace this with bus acquisition). */
    {
        const float q_dot =
            (MODEL_M_ELEV * st->elev_deg) +
            (MODEL_M_Q * st->pitch_rate_dps) +
            (MODEL_M_ALPHA * (st->alpha_deg - MODEL_TRIM_ALPHA));

        st->pitch_rate_dps += q_dot * dt_s;
        st->pitch_deg      += st->pitch_rate_dps * dt_s;
        st->alpha_deg      += st->pitch_rate_dps * dt_s * 0.8f;
    }

    (void)memset(&adc, 0, sizeof(adc));
    adc.ias_kt         = 250.0f;
    adc.alpha_deg      = st->alpha_deg;
    adc.pitch_deg      = st->pitch_deg;
    adc.pitch_rate_dps = st->pitch_rate_dps;
    adc.alt_ft         = 15000.0f;
    /* AOS-SRS-102: validity reflects acquisition health. */
    adc.valid = st->fail_adc ? 0u : MSG_ADC_VALID_ALL;

    (void)memset(&pilot, 0, sizeof(pilot));
    pilot.pitch_cmd_dps = st->cmd_pitch_dps;
    pilot.ap_engaged    = false;

    /* The monitor lane receives air data on its own channel so a COM
     * routing fault cannot blind the monitor (REV-DIS-001). */
    r1 = aos_sampling_write(st->p_adc_out, &adc, sizeof(adc));
    r2 = aos_sampling_write(st->p_pilot_out, &pilot, sizeof(pilot));
    if (aos_sampling_write(st->p_adc_mon_out, &adc, sizeof(adc))
        != AOS_OK)
    {
        r1 = AOS_E_STATE;
    }

    return ((r1 == AOS_OK) && (r2 == AOS_OK)) ? AOS_OK : AOS_E_STATE;
}
