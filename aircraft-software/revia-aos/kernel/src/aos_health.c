/*
 * Revia AOS — health monitor implementation
 *
 * @satisfies AOS-HLR-030 (fault detection and response)
 * @satisfies AOS-HLR-031 (module safe state)
 * @satisfies AOS-HLR-032 (fault recording for maintenance)
 */
#include <string.h>

#include "aos_internal.h"
#include "aos_hal.h"

static aos_hm_event_t s_log[AOS_MAX_HM_EVENTS];
static uint32_t       s_count;
static uint32_t       s_lost;

void aos_hm_reset_state(void)
{
    (void)memset(s_log, 0, sizeof(s_log));
    s_count = 0u;
    s_lost  = 0u;
}

static void record(aos_part_id_t part, aos_err_id_t err,
                   aos_hm_action_t action, uint32_t detail)
{
    if (s_count < AOS_MAX_HM_EVENTS)
    {
        s_log[s_count].t_us   = aos_hal_now_us();
        s_log[s_count].part   = part;
        s_log[s_count].err    = err;
        s_log[s_count].action = action;
        s_log[s_count].detail = detail;
        s_count++;
    }
    else
    {
        /* Log saturated: preserve the first-fault snapshot, count the
         * loss (AOS-HLR-032). */
        s_lost++;
    }
}

aos_ret_t aos_hm_raise(aos_part_id_t part, aos_err_id_t err, uint32_t detail)
{
    aos_ret_t ret = AOS_OK;
    aos_hm_action_t action = AOS_HM_SAFE_STATE;

    if (aos_g_cfg == NULL)
    {
        /* Fault before configuration: only safe response is shutdown. */
        aos_hal_safe_state((uint32_t)err);
        ret = AOS_E_STATE;
    }
    else if (err >= AOS_ERR_COUNT)
    {
        ret = AOS_E_PARAM;
    }
    else
    {
        /* A partition may raise errors only against itself; the kernel
         * (current == NONE) may attribute to any partition or module. */
        const aos_part_id_t caller = aos_partition_current();

        if ((caller != AOS_PART_ID_NONE) && (caller != part))
        {
            ret = AOS_E_ACCESS;
        }
        else if ((part != AOS_PART_ID_NONE) &&
                 (part >= aos_g_cfg->part_count))
        {
            ret = AOS_E_RANGE;
        }
        else
        {
            if (part == AOS_PART_ID_NONE)
            {
                action = aos_g_cfg->hm_module.action[err];
            }
            else
            {
                action = aos_g_cfg->hm_partition[part].action[err];
            }

            record(part, err, action, detail);

            switch (action)
            {
                case AOS_HM_LOG:
                    break;
                case AOS_HM_IDLE:
                    aos_g_mode[part] = AOS_PART_IDLE;
                    break;
                case AOS_HM_WARM_RESTART:
                    aos_g_mode[part] = AOS_PART_WARM_START;
                    break;
                case AOS_HM_COLD_RESTART:
                    aos_g_mode[part] = AOS_PART_COLD_START;
                    (void)memset(aos_g_cfg->parts[part].region_base, 0,
                                 aos_g_cfg->parts[part].region_bytes);
                    break;
                case AOS_HM_SAFE_STATE:
                default:
                    aos_hal_safe_state((uint32_t)err);
                    break;
            }
        }
    }
    return ret;
}

aos_ret_t aos_hm_read_event(uint32_t idx, aos_hm_event_t *ev_out)
{
    aos_ret_t ret = AOS_OK;
    const aos_part_id_t caller = aos_partition_current();

    if ((aos_g_cfg == NULL) || (ev_out == NULL))
    {
        ret = AOS_E_PARAM;
    }
    else if ((caller != AOS_PART_ID_NONE) &&
             (caller != aos_g_cfg->maint_part))
    {
        /* Fault data restricted to the maintenance partition. */
        ret = AOS_E_ACCESS;
    }
    else if (idx >= s_count)
    {
        ret = AOS_E_RANGE;
    }
    else
    {
        *ev_out = s_log[idx];
    }
    return ret;
}

aos_ret_t aos_hm_stats(uint32_t *count_out, uint32_t *lost_out)
{
    aos_ret_t ret = AOS_OK;

    if ((count_out == NULL) || (lost_out == NULL))
    {
        ret = AOS_E_PARAM;
    }
    else
    {
        *count_out = s_count;
        *lost_out  = s_lost;
    }
    return ret;
}
