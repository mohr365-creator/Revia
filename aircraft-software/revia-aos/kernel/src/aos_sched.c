/*
 * Revia AOS — time-partitioned cyclic scheduler
 *
 * @satisfies AOS-HLR-015 (static cyclic schedule)
 * @satisfies AOS-HLR-016 (window overrun detection)
 * @satisfies AOS-HLR-022 (watchdog bounds every window)
 */
#include "aos_internal.h"
#include "aos_hal.h"

aos_part_id_t   aos_g_current = AOS_PART_ID_NONE;
static uint32_t s_frame_count;

void aos_sched_reset_state(void)
{
    aos_g_current = AOS_PART_ID_NONE;
    s_frame_count = 0u;
}

aos_part_id_t aos_partition_current(void)
{
    return aos_g_current;
}

uint32_t aos_sched_frame_count(void)
{
    return s_frame_count;
}

/* Execute one partition window: select protection context, dispatch
 * init or step per the partition mode, enforce the budget. */
static void run_window(const aos_window_t *w, aos_time_us_t frame_start)
{
    const aos_time_us_t w_start = frame_start + (aos_time_us_t)w->offset_us;
    const aos_time_us_t w_end   = w_start + (aos_time_us_t)w->duration_us;

    aos_hal_advance_to(w_start);

    if (w->part != AOS_PART_ID_NONE)
    {
        const aos_part_desc_t *p = &aos_g_cfg->parts[w->part];
        const aos_part_mode_t mode = aos_g_mode[w->part];

        if (mode != AOS_PART_IDLE)
        {
            aos_ret_t app_ret = AOS_OK;

            aos_hal_watchdog_arm(w->duration_us);
            aos_hal_protect_select(w->part);
            aos_g_current = w->part;

            if ((mode == AOS_PART_COLD_START) ||
                (mode == AOS_PART_WARM_START))
            {
                app_ret = p->init(mode);
                if (app_ret == AOS_OK)
                {
                    aos_g_mode[w->part] = AOS_PART_NORMAL;
                }
            }
            else /* AOS_PART_NORMAL */
            {
                app_ret = p->step(w_start);
            }

            aos_g_current = AOS_PART_ID_NONE;
            aos_hal_protect_select(AOS_PART_ID_NONE);
            aos_hal_watchdog_disarm();

            if (app_ret != AOS_OK)
            {
                (void)aos_hm_raise(w->part, AOS_ERR_APP,
                                   (uint32_t)app_ret);
            }
            if (aos_hal_now_us() > w_end)
            {
                /* Budget exceeded: configured partition response
                 * (AOS-HLR-016). */
                (void)aos_hm_raise(w->part, AOS_ERR_DEADLINE,
                                   (uint32_t)(aos_hal_now_us() - w_end));
            }
        }
    }

    aos_hal_advance_to(w_end);
}

aos_ret_t aos_sched_run_major_frame(void)
{
    aos_ret_t ret = AOS_OK;

    if (aos_g_cfg == NULL)
    {
        ret = AOS_E_STATE;
    }
    else
    {
        const aos_time_us_t frame_start = aos_hal_now_us();
        const aos_time_us_t frame_end =
            frame_start + (aos_time_us_t)aos_g_cfg->major_frame_us;
        uint8_t i;

        for (i = 0u; i < aos_g_cfg->window_count; i++)
        {
            run_window(&aos_g_cfg->windows[i], frame_start);
        }

        if (aos_hal_now_us() > frame_end)
        {
            /* The frame itself overran: module-level fault. */
            (void)aos_hm_raise(AOS_PART_ID_NONE, AOS_ERR_FRAME_OVERRUN,
                               (uint32_t)(aos_hal_now_us() - frame_end));
            ret = AOS_E_TIMING;
        }
        else
        {
            aos_hal_advance_to(frame_end);
        }
        s_frame_count++;
    }
    return ret;
}

#ifdef AOS_HOST_BUILD
void aos_sched_set_current_for_test(aos_part_id_t part)
{
    aos_g_current = part;
}
#endif
