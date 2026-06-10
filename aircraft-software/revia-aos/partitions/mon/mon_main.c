/*
 * Revia MON — flight-control monitor partition (DAL A, dissimilar lane)
 *
 * DISSIMILARITY RULE (REV-DIS-001): this partition is the MON lane of
 * the flight-control COM/MON pair. It shall NOT share design, code, or
 * derived data with the COM lane (partitions/fcs). It is written from
 * the safety invariants ("the surface shall never...") rather than the
 * control-law design, by checking, not computing: no gains, no
 * integrators, no law modes of its own. On a flight channel the two
 * lanes additionally run on dissimilar processors with dissimilar
 * toolchains; a latched trip removes the channel's actuator authority
 * via the actuator-electronics enable discrete (here: published status
 * consumed by DISP and recorded by MAINT).
 *
 * Inputs arrive on channels routed independently of the COM lane's
 * inputs (separate ports from IOM and FCS source ports).
 *
 * @satisfies AOS-SRS-160 (envelope invariants checked every frame)
 * @satisfies AOS-SRS-161 (persistent violation latches a trip)
 * @satisfies AOS-SRS-162 (reversion-consistency check)
 */
#include <string.h>

#include "aos_kernel.h"
#include "aos_port.h"
#include "revia_msgs.h"
#include "mon_part.h"

/* Invariant limits: from the safety requirements (REV-FCS-ENV-001),
 * deliberately restated here rather than included from the COM lane,
 * with monitoring tolerances added. */
#define MON_AUTH_LIMIT_DEG   25.5f   /* 25.0 certified + tolerance     */
#define MON_SLEW_LIMIT_DPS   50.0f   /* 40.0 certified + tolerance     */
#define MON_ALPHA_MAX_DEG    15.0f   /* never-exceed alpha             */
#define MON_NOSE_DOWN_MIN    0.25f   /* required TED-down beyond alpha */
#define MON_TRIP_FRAMES      3u      /* consecutive frames to latch    */
#define MON_VALID_ALL        0x0Fu   /* restated from ICD, not shared  */

typedef struct
{
    float         elev_prev_deg;
    bool          have_prev;
    bool          tripped;
    uint8_t       consec;
    uint32_t      violations;
    aos_time_us_t t_prev_us;
    aos_port_id_t p_adc_in;
    aos_port_id_t p_surf_in;
    aos_port_id_t p_status_out;
} mon_state_t;

static mon_state_t *mon_state(void)
{
    const aos_module_config_t *cfg = aos_kernel_config();

    return (mon_state_t *)cfg->parts[aos_partition_current()].region_base;
}

aos_ret_t mon_part_init(aos_part_mode_t start_mode)
{
    aos_ret_t ret;
    mon_state_t *st = mon_state();

    /* A monitor restart must not silently clear a latched trip: only
     * COLD start (maintenance action / power cycle) resets it. */
    if (start_mode == AOS_PART_COLD_START)
    {
        st->tripped = false;
        st->violations = 0u;
    }
    st->have_prev = false;
    st->consec = 0u;

    ret = aos_port_lookup("MON_ADC_IN", &st->p_adc_in);
    if (ret == AOS_OK)
    {
        ret = aos_port_lookup("MON_SURF_IN", &st->p_surf_in);
    }
    if (ret == AOS_OK)
    {
        ret = aos_port_lookup("MON_STATUS_OUT", &st->p_status_out);
    }
    return ret;
}

aos_ret_t mon_part_step(aos_time_us_t window_start_us)
{
    mon_state_t *st = mon_state();
    msg_adc_t  adc;
    msg_surf_t surf;
    msg_mon_t  out;
    size_t     len = 0u;
    bool       adc_fresh = false;
    bool       surf_fresh = false;
    bool       adc_ok;
    bool       surf_ok;
    uint8_t    flags = 0u;
    float      dt_s;

    (void)memset(&adc, 0, sizeof(adc));
    (void)memset(&surf, 0, sizeof(surf));
    (void)memset(&out, 0, sizeof(out));

    adc_ok = (aos_sampling_read(st->p_adc_in, &adc, sizeof(adc),
                                &len, &adc_fresh) == AOS_OK) &&
             (len == sizeof(adc)) && adc_fresh;

    surf_ok = (aos_sampling_read(st->p_surf_in, &surf, sizeof(surf),
                                 &len, &surf_fresh) == AOS_OK) &&
              (len == sizeof(surf)) && surf_fresh;

    if (st->have_prev && (window_start_us > st->t_prev_us))
    {
        dt_s = (float)(window_start_us - st->t_prev_us) * 1.0e-6f;
    }
    else
    {
        dt_s = 0.05f;
    }
    st->t_prev_us = window_start_us;

    if (!surf_ok)
    {
        /* COM lane silent or stale while the monitor is running. */
        flags |= MON_FLAG_NO_DATA;
        st->have_prev = false;
    }
    else
    {
        /* Invariant 1: surface authority (AOS-SRS-160). */
        if ((surf.elev_deg > MON_AUTH_LIMIT_DEG) ||
            (surf.elev_deg < -MON_AUTH_LIMIT_DEG))
        {
            flags |= MON_FLAG_AUTHORITY;
        }

        /* Invariant 2: surface slew (AOS-SRS-160). */
        if (st->have_prev && (dt_s > 0.0f))
        {
            const float rate =
                (surf.elev_deg - st->elev_prev_deg) / dt_s;

            if ((rate > MON_SLEW_LIMIT_DPS) ||
                (rate < -MON_SLEW_LIMIT_DPS))
            {
                flags |= MON_FLAG_SLEW;
            }
        }
        st->elev_prev_deg = surf.elev_deg;
        st->have_prev = true;

        if (adc_ok)
        {
            /* Invariant 3: reversion consistency — normal law claimed
             * while required air data is invalid (AOS-SRS-162). */
            if (((adc.valid & MON_VALID_ALL) != MON_VALID_ALL) &&
                (surf.law_mode == (uint8_t)FCS_LAW_NORMAL))
            {
                flags |= MON_FLAG_REVERSION;
            }

            /* Invariant 4: beyond never-exceed alpha the surface must
             * command nose-down (TED down, positive) (AOS-SRS-160). */
            if (((adc.valid & MON_VALID_ALL) == MON_VALID_ALL) &&
                (adc.alpha_deg > MON_ALPHA_MAX_DEG) &&
                (surf.elev_deg < MON_NOSE_DOWN_MIN))
            {
                flags |= MON_FLAG_ALPHA;
            }
        }
    }

    if (flags != 0u)
    {
        st->violations++;
        if (st->consec < 255u)
        {
            st->consec++;
        }
        if (st->consec >= MON_TRIP_FRAMES)
        {
            st->tripped = true;   /* latched (AOS-SRS-161) */
        }
    }
    else
    {
        st->consec = 0u;
    }

    out.trip            = st->tripped ? 1u : 0u;
    out.flags           = flags;
    out.violation_count = st->violations;

    return aos_sampling_write(st->p_status_out, &out, sizeof(out));
}
