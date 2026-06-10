/*
 * Foundational requirement tests (type model, static storage, HAL
 * contract, space-partitioning hooks, cold-start determinism).
 *
 * @verifies AOS-HLR-001 (fixed-width type model)
 * @verifies AOS-HLR-002 (explicit, distinct status codes)
 * @verifies AOS-HLR-003 (static limits define all storage)
 * @verifies AOS-HLR-010 (protection context per executed window)
 * @verifies AOS-HLR-020 (kernel time observable only through HAL)
 * @verifies AOS-HLR-021 (monotonic non-decreasing time base)
 * @verifies AOS-HLR-041 (cold start zeroizes partition regions)
 */
#include <string.h>

#include "ut.h"
#include "test_fixture.h"
#include "aos_internal.h"
#include "aos_hal.h"
#include "hal_host.h"

void suite_foundations(void)
{
    (void)printf("suite: foundations\n");

    UT_CASE("interface types have the specified widths", "AOS-HLR-001");
    UT_CHECK(sizeof(aos_time_us_t) == 8u);
    UT_CHECK(sizeof(aos_dur_us_t) == 4u);
    UT_CHECK(sizeof(aos_part_id_t) == 1u);
    UT_CHECK(sizeof(aos_port_id_t) == 1u);

    UT_CASE("status codes are distinct and explicit", "AOS-HLR-002");
    fx_reset();
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_OK);
    {
        uint8_t buf[16];
        size_t len = 0u;
        bool fresh = false;

        /* The same service reports different failures distinctly. */
        UT_CHECK(aos_sampling_read(1u, buf, sizeof(buf), &len, &fresh)
                 == AOS_E_EMPTY);
        UT_CHECK(aos_sampling_read(99u, buf, sizeof(buf), &len, &fresh)
                 == AOS_E_RANGE);
        UT_CHECK(aos_sampling_read(1u, NULL, 0u, &len, &fresh)
                 == AOS_E_PARAM);
    }

    UT_CASE("configured limits bound every kernel table", "AOS-HLR-003");
    fx_reset();
    fx.cfg.part_count = (uint8_t)(AOS_MAX_PARTITIONS + 1u);
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_E_CONFIG);
    fx_reset();
    fx.cfg.window_count = (uint8_t)(AOS_MAX_WINDOWS + 1u);
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_E_CONFIG);
    fx_reset();
    fx.ports[0].max_msg_bytes = (uint16_t)(AOS_MAX_MSG_BYTES + 1u);
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_E_CONFIG);

    UT_CASE("protection context selected per executed window",
            "AOS-HLR-010");
    fx_reset();
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_OK);
    UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
    UT_CHECK(hal_host_protect_select_count() == 2u);   /* P0 + P1 */
    UT_CHECK(hal_host_protect_current() == AOS_PART_ID_NONE);

    UT_CASE("HAL time base is monotonic non-decreasing", "AOS-HLR-021");
    fx_reset();
    {
        const aos_time_us_t t0 = aos_hal_now_us();

        aos_hal_advance_to(t0 + 500u);
        UT_CHECK(aos_hal_now_us() == (t0 + 500u));
        aos_hal_advance_to(t0);            /* into the past: no-op  */
        UT_CHECK(aos_hal_now_us() == (t0 + 500u));
    }

    UT_CASE("kernel timing driven entirely by HAL clock", "AOS-HLR-020");
    fx_reset();
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_OK);
    {
        const aos_time_us_t t0 = aos_hal_now_us();

        UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
        /* Virtual clock alone advanced the frame: proof the kernel
         * has no other time source on this build. */
        UT_CHECK(aos_hal_now_us() == (t0 + fx.cfg.major_frame_us));
    }

    UT_CASE("cold restart zeroizes the partition region", "AOS-HLR-041");
    fx_reset();
    fx.hm_part[0].action[AOS_ERR_STACK] = AOS_HM_COLD_RESTART;
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_OK);
    UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
    {
        uint8_t *region = (uint8_t *)fx.parts[0].region_base;
        size_t i;
        bool all_zero = true;

        (void)memset(region, 0xA5, fx.parts[0].region_bytes);
        UT_CHECK(aos_hm_raise(0u, AOS_ERR_STACK, 0u) == AOS_OK);
        for (i = 0u; i < fx.parts[0].region_bytes; i++)
        {
            if (region[i] != 0u)
            {
                all_zero = false;
            }
        }
        UT_CHECK(all_zero);
    }
}
