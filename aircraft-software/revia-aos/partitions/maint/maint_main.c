/*
 * Revia MAINT — central maintenance computer partition (DAL D)
 *
 * Drains the EICAS recorder queue and polls the kernel health-monitor
 * log (this partition is the configured maintenance partition), keeping
 * tallies for the airline's continuing-airworthiness program
 * (Part 121 §121.373 mechanical reliability data).
 *
 * @satisfies AOS-SRS-140 (fault data collection)
 */
#include <string.h>

#include "aos_kernel.h"
#include "aos_port.h"
#include "aos_health.h"
#include "revia_msgs.h"
#include "maint_part.h"

#define MAINT_MAX_DRAIN_PER_WINDOW  8u  /* bounded work per window */

typedef struct
{
    maint_summary_t summary;
    uint32_t        hm_read_idx;
    aos_port_id_t   p_eicas_in;
} maint_state_t;

static maint_state_t *maint_region(void)
{
    const aos_module_config_t *cfg = aos_kernel_config();

    return (maint_state_t *)
        cfg->parts[cfg->maint_part].region_base;
}

aos_ret_t maint_part_init(aos_part_mode_t start_mode)
{
    maint_state_t *st = maint_region();

    (void)start_mode;
    (void)memset(&st->summary, 0, sizeof(st->summary));
    st->hm_read_idx = 0u;

    return aos_port_lookup("MAINT_EICAS_IN", &st->p_eicas_in);
}

aos_ret_t maint_part_step(aos_time_us_t window_start_us)
{
    maint_state_t *st = maint_region();
    msg_eicas_t m;
    size_t len = 0u;
    uint32_t n;
    uint32_t hm_count = 0u;
    uint32_t hm_lost = 0u;

    (void)window_start_us;

    /* Bounded drain of the crew-alert recorder queue. */
    for (n = 0u; n < MAINT_MAX_DRAIN_PER_WINDOW; n++)
    {
        if (aos_queuing_receive(st->p_eicas_in, &m, sizeof(m),
                                &len) != AOS_OK)
        {
            break;
        }
        if (m.level == (uint8_t)EICAS_WARNING)
        {
            st->summary.eicas_warning++;
        }
        else if (m.level == (uint8_t)EICAS_CAUTION)
        {
            st->summary.eicas_caution++;
        }
        else
        {
            st->summary.eicas_advisory++;
        }
    }

    /* Poll new HM events (bounded by the same per-window budget). */
    if (aos_hm_stats(&hm_count, &hm_lost) == AOS_OK)
    {
        for (n = 0u; (n < MAINT_MAX_DRAIN_PER_WINDOW) &&
                     (st->hm_read_idx < hm_count); n++)
        {
            aos_hm_event_t ev;

            if (aos_hm_read_event(st->hm_read_idx, &ev) == AOS_OK)
            {
                st->summary.hm_events_seen++;
            }
            st->hm_read_idx++;
        }
    }

    return AOS_OK;
}

aos_ret_t maint_get_summary(maint_summary_t *out)
{
    aos_ret_t ret = AOS_OK;

    if ((out == NULL) || (aos_kernel_config() == NULL))
    {
        ret = AOS_E_PARAM;
    }
    else
    {
        *out = maint_region()->summary;
    }
    return ret;
}
