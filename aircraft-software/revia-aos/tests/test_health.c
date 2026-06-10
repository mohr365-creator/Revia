/*
 * Health-monitor tests.
 *
 * @verifies AOS-HLR-030 (configured fault responses)
 * @verifies AOS-HLR-031 (module safe state)
 * @verifies AOS-HLR-032 (fault recording, first-fault preservation)
 */
#include <setjmp.h>

#include "ut.h"
#include "test_fixture.h"
#include "aos_internal.h"
#include "hal_host.h"

void suite_health(void)
{
    aos_part_mode_t mode;

    (void)printf("suite: health monitor\n");

    UT_CASE("LOG action records without mode change", "AOS-HLR-030");
    fx_reset();
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_OK);
    UT_CHECK(aos_hm_raise(0u, AOS_ERR_APP, 42u) == AOS_OK);
    UT_CHECK(aos_partition_get_mode(0u, &mode) == AOS_OK);
    UT_CHECK(mode == AOS_PART_COLD_START);  /* unchanged (pre-NORMAL) */
    {
        uint32_t count = 0u;
        uint32_t lost = 0u;
        aos_hm_event_t ev;

        UT_CHECK(aos_hm_stats(&count, &lost) == AOS_OK);
        UT_CHECK(count == 1u);
        UT_CHECK(lost == 0u);
        UT_CHECK(aos_hm_read_event(0u, &ev) == AOS_OK);
        UT_CHECK(ev.err == AOS_ERR_APP);
        UT_CHECK(ev.detail == 42u);
        UT_CHECK(ev.action == AOS_HM_LOG);
    }

    UT_CASE("IDLE action idles the partition", "AOS-HLR-030");
    fx_reset();
    fx.hm_part[0].action[AOS_ERR_DEADLINE] = AOS_HM_IDLE;
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_OK);
    UT_CHECK(aos_hm_raise(0u, AOS_ERR_DEADLINE, 0u) == AOS_OK);
    UT_CHECK(aos_partition_get_mode(0u, &mode) == AOS_OK);
    UT_CHECK(mode == AOS_PART_IDLE);

    UT_CASE("WARM_RESTART action re-initializes partition",
            "AOS-HLR-030");
    fx_reset();
    fx.hm_part[0].action[AOS_ERR_APP] = AOS_HM_WARM_RESTART;
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_OK);
    UT_CHECK(aos_sched_run_major_frame() == AOS_OK);  /* P0 -> NORMAL */
    UT_CHECK(fx_p0_inits == 1u);
    UT_CHECK(aos_hm_raise(0u, AOS_ERR_APP, 0u) == AOS_OK);
    UT_CHECK(aos_partition_get_mode(0u, &mode) == AOS_OK);
    UT_CHECK(mode == AOS_PART_WARM_START);
    UT_CHECK(aos_sched_run_major_frame() == AOS_OK);  /* re-inits     */
    UT_CHECK(fx_p0_inits == 2u);

    UT_CASE("SAFE_STATE action enters module safe state",
            "AOS-HLR-031");
    fx_reset();
    fx.hm_part[0].action[AOS_ERR_MEM_VIOLATION] = AOS_HM_SAFE_STATE;
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_OK);
    {
        jmp_buf env;
        uint32_t reason = 0u;

        if (setjmp(env) == 0)
        {
            hal_host_expect_safe_state(&env);
            (void)aos_hm_raise(0u, AOS_ERR_MEM_VIOLATION, 0u);
            UT_CHECK(false);
        }
        UT_CHECK(hal_host_safe_state_hit(&reason));
        UT_CHECK(reason == (uint32_t)AOS_ERR_MEM_VIOLATION);
    }

    UT_CASE("log saturation preserves first faults", "AOS-HLR-032");
    fx_reset();
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_OK);
    {
        uint32_t i;
        uint32_t count = 0u;
        uint32_t lost = 0u;
        aos_hm_event_t ev;

        for (i = 0u; i < (AOS_MAX_HM_EVENTS + 10u); i++)
        {
            UT_CHECK(aos_hm_raise(0u, AOS_ERR_APP, i) == AOS_OK);
        }
        UT_CHECK(aos_hm_stats(&count, &lost) == AOS_OK);
        UT_CHECK(count == AOS_MAX_HM_EVENTS);
        UT_CHECK(lost == 10u);
        UT_CHECK(aos_hm_read_event(0u, &ev) == AOS_OK);
        UT_CHECK(ev.detail == 0u);   /* first fault retained */
    }

    UT_CASE("partition cannot raise against another partition",
            "AOS-HLR-030");
    fx_reset();
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_OK);
    aos_sched_set_current_for_test(1u);
    UT_CHECK(aos_hm_raise(0u, AOS_ERR_APP, 0u) == AOS_E_ACCESS);
    aos_sched_set_current_for_test(AOS_PART_ID_NONE);

    UT_CASE("HM log restricted to maintenance partition",
            "AOS-HLR-032");
    fx_reset();
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_OK);
    UT_CHECK(aos_hm_raise(0u, AOS_ERR_APP, 1u) == AOS_OK);
    {
        aos_hm_event_t ev;

        aos_sched_set_current_for_test(0u);   /* not maint (P1 is) */
        UT_CHECK(aos_hm_read_event(0u, &ev) == AOS_E_ACCESS);
        aos_sched_set_current_for_test(1u);   /* maint partition   */
        UT_CHECK(aos_hm_read_event(0u, &ev) == AOS_OK);
        aos_sched_set_current_for_test(AOS_PART_ID_NONE);
    }
}
