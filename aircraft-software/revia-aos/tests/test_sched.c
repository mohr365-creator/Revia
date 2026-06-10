/*
 * Scheduler tests.
 *
 * @verifies AOS-HLR-015 (cyclic schedule, all windows every frame)
 * @verifies AOS-HLR-016 (window overrun -> configured HM action)
 * @verifies AOS-HLR-022 (watchdog armed for every executed window)
 * @verifies AOS-HLR-011 (cold start -> init -> NORMAL sequencing)
 */
#include "ut.h"
#include "test_fixture.h"
#include "aos_internal.h"
#include "aos_hal.h"
#include "hal_host.h"

void suite_sched(void)
{
    aos_part_mode_t mode;

    (void)printf("suite: scheduler\n");

    UT_CASE("first frame initializes partitions into NORMAL",
            "AOS-HLR-011");
    fx_reset();
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_OK);
    UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
    UT_CHECK(fx_p0_inits == 1u);
    UT_CHECK(fx_p0_steps == 0u);   /* init window, no step yet */
    UT_CHECK(aos_partition_get_mode(0u, &mode) == AOS_OK);
    UT_CHECK(mode == AOS_PART_NORMAL);

    UT_CASE("subsequent frames step each partition once",
            "AOS-HLR-015");
    UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
    UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
    UT_CHECK(fx_p0_steps == 2u);
    UT_CHECK(aos_sched_frame_count() == 3u);

    UT_CASE("frame time advances by exactly one major frame",
            "AOS-HLR-015");
    fx_reset();
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_OK);
    {
        const aos_time_us_t t0 = aos_hal_now_us();

        UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
        UT_CHECK(aos_hal_now_us() == (t0 + 10000u));
    }

    UT_CASE("watchdog armed for every executed window", "AOS-HLR-022");
    fx_reset();
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_OK);
    UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
    UT_CHECK(hal_host_watchdog_arm_count() == 2u);  /* P0 + P1 */

    UT_CASE("idle partitions are not dispatched", "AOS-HLR-011");
    fx_reset();
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_OK);
    UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
    UT_CHECK(aos_partition_set_mode(0u, AOS_PART_IDLE) == AOS_OK);
    UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
    UT_CHECK(fx_p0_steps == 0u);

    UT_CASE("window overrun raises DEADLINE with configured action",
            "AOS-HLR-016");
    fx_reset();
    fx.hm_part[0].action[AOS_ERR_DEADLINE] = AOS_HM_IDLE;
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_OK);
    UT_CHECK(aos_sched_run_major_frame() == AOS_OK);  /* init frame */
    fx_p0_consume_us = 5000u;   /* budget is 3000 us */
    UT_CHECK(aos_sched_run_major_frame() == AOS_OK);  /* slack absorbs */
    UT_CHECK(aos_partition_get_mode(0u, &mode) == AOS_OK);
    UT_CHECK(mode == AOS_PART_IDLE);
    {
        uint32_t count = 0u;
        uint32_t lost = 0u;
        aos_hm_event_t ev;

        UT_CHECK(aos_hm_stats(&count, &lost) == AOS_OK);
        UT_CHECK(count >= 1u);
        UT_CHECK(aos_hm_read_event(0u, &ev) == AOS_OK);
        UT_CHECK(ev.err == AOS_ERR_DEADLINE);
        UT_CHECK(ev.part == 0u);
    }

    UT_CASE("frame overrun reported as module-level timing fault",
            "AOS-HLR-016");
    fx_reset();
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_OK);
    UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
    fx_p0_consume_us = 12000u;  /* exceeds the whole 10 ms frame */
    UT_CHECK(aos_sched_run_major_frame() == AOS_E_TIMING);

    UT_CASE("application step error routed to HM as APP error",
            "AOS-HLR-030");
    fx_reset();
    fx.hm_part[0].action[AOS_ERR_APP] = AOS_HM_IDLE;
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_OK);
    UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
    fx_p0_step_ret = AOS_E_STATE;
    UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
    UT_CHECK(aos_partition_get_mode(0u, &mode) == AOS_OK);
    UT_CHECK(mode == AOS_PART_IDLE);
}
