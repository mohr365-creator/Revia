/*
 * Revia FCS — flight control partition (DAL A)
 *
 * Per-window sequence: read air data and pilot command, run the pitch
 * law, publish the surface command (to the actuator/display channel
 * and to the IOM airframe model channel). Sensor staleness or
 * incomplete validity reverts to direct law; loss of the command port
 * reverts to failsafe (surfaces neutral).
 *
 * @satisfies AOS-SRS-110..115 (via fcs_law)
 * @satisfies AOS-SRS-116 (failsafe on command-path loss)
 */
#include <string.h>

#include "aos_kernel.h"
#include "aos_port.h"
#include "revia_msgs.h"
#include "fcs_law.h"
#include "fcs_part.h"

typedef struct
{
    fcs_law_state_t law;
    aos_port_id_t   p_adc_in;
    aos_port_id_t   p_pilot_in;
    aos_port_id_t   p_surf_out;
    aos_port_id_t   p_surf_model_out;
    aos_time_us_t   t_prev_us;
    bool            have_prev;
} fcs_state_t;

/* Partition state lives in the partition's configured memory region. */
static fcs_state_t *fcs_state(void)
{
    const aos_module_config_t *cfg = aos_kernel_config();

    return (fcs_state_t *)cfg->parts[aos_partition_current()].region_base;
}

aos_ret_t fcs_part_init(aos_part_mode_t start_mode)
{
    aos_ret_t ret;
    fcs_state_t *st = fcs_state();

    (void)start_mode;  /* cold and warm start are identical for FCS:
                        * the law always restarts from neutral. */
    fcs_law_reset(&st->law);
    st->have_prev = false;

    ret = aos_port_lookup("FCS_ADC_IN", &st->p_adc_in);
    if (ret == AOS_OK)
    {
        ret = aos_port_lookup("FCS_PILOT_IN", &st->p_pilot_in);
    }
    if (ret == AOS_OK)
    {
        ret = aos_port_lookup("FCS_SURF_OUT", &st->p_surf_out);
    }
    if (ret == AOS_OK)
    {
        ret = aos_port_lookup("FCS_SURF_MODEL_OUT", &st->p_surf_model_out);
    }
    return ret;
}

aos_ret_t fcs_part_step(aos_time_us_t window_start_us)
{
    fcs_state_t *st = fcs_state();
    msg_adc_t   adc;
    msg_pilot_t pilot;
    msg_surf_t  surf;
    size_t      len = 0u;
    bool        adc_fresh = false;
    bool        pilot_fresh = false;
    bool        adc_ok;
    bool        pilot_ok;
    float       dt_s;

    (void)memset(&adc, 0, sizeof(adc));
    (void)memset(&pilot, 0, sizeof(pilot));
    (void)memset(&surf, 0, sizeof(surf));

    adc_ok = (aos_sampling_read(st->p_adc_in, &adc, sizeof(adc),
                                &len, &adc_fresh) == AOS_OK) &&
             (len == sizeof(adc)) && adc_fresh &&
             ((adc.valid & MSG_ADC_VALID_ALL) == MSG_ADC_VALID_ALL);

    pilot_ok = (aos_sampling_read(st->p_pilot_in, &pilot, sizeof(pilot),
                                  &len, &pilot_fresh) == AOS_OK) &&
               (len == sizeof(pilot)) && pilot_fresh;

    if (st->have_prev && (window_start_us > st->t_prev_us))
    {
        dt_s = (float)(window_start_us - st->t_prev_us) * 1.0e-6f;
    }
    else
    {
        dt_s = 0.05f;  /* first frame: nominal frame period */
    }
    st->t_prev_us = window_start_us;
    st->have_prev = true;

    if (!pilot_ok)
    {
        /* AOS-SRS-116: no valid command path -> surfaces neutral. */
        fcs_law_reset(&st->law);
        surf.elev_deg   = 0.0f;
        surf.law_mode   = (uint8_t)FCS_LAW_FAILSAFE;
        surf.alpha_prot = 0u;
    }
    else
    {
        fcs_law_in_t in;
        fcs_law_out_t out;

        in.pitch_cmd_dps  = pilot.pitch_cmd_dps;
        in.pitch_rate_dps = adc.pitch_rate_dps;
        in.alpha_deg      = adc.alpha_deg;
        in.data_valid     = adc_ok;

        out = fcs_law_step(&in, &st->law, dt_s);
        surf.elev_deg   = out.elev_deg;
        surf.law_mode   = (uint8_t)out.mode;
        surf.alpha_prot = out.alpha_prot_active ? 1u : 0u;
    }

    /* Publish to both consumers; a failure on either is an
     * application-level fault for the HM. */
    {
        aos_ret_t r1 = aos_sampling_write(st->p_surf_out,
                                          &surf, sizeof(surf));
        aos_ret_t r2 = aos_sampling_write(st->p_surf_model_out,
                                          &surf, sizeof(surf));

        return ((r1 == AOS_OK) && (r2 == AOS_OK)) ? AOS_OK : AOS_E_STATE;
    }
}
