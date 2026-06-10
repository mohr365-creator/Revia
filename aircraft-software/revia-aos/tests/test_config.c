/*
 * Configuration-validation tests.
 *
 * @verifies AOS-HLR-040 (configuration validated before NORMAL mode)
 * @verifies AOS-HLR-015 (schedule consistency rules)
 */
#include <string.h>
#include <setjmp.h>

#include "ut.h"
#include "test_fixture.h"
#include "aos_internal.h"
#include "hal_host.h"

void suite_config(void)
{
    (void)printf("suite: configuration validation\n");

    UT_CASE("valid configuration accepted", "AOS-HLR-040");
    fx_reset();
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_OK);
    UT_CHECK(aos_kernel_config() == &fx.cfg);

    UT_CASE("overlapping windows rejected", "AOS-HLR-015");
    fx_reset();
    fx.windows[1].offset_us = 2000u;   /* overlaps window 0 (0..3000) */
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_E_CONFIG);
    UT_CHECK(aos_kernel_config() == NULL);

    UT_CASE("window beyond major frame rejected", "AOS-HLR-015");
    fx_reset();
    fx.windows[2].duration_us = 9000u; /* 6000+9000 > 10000 */
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_E_CONFIG);

    UT_CASE("window for unknown partition rejected", "AOS-HLR-040");
    fx_reset();
    fx.windows[0].part = 7u;
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_E_CONFIG);

    UT_CASE("duplicate partition name rejected", "AOS-HLR-040");
    fx_reset();
    (void)strncpy(fx.parts[1].name, "P0", AOS_MAX_PART_NAME - 1u);
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_E_CONFIG);

    UT_CASE("duplicate port name rejected", "AOS-HLR-040");
    fx_reset();
    (void)strncpy(fx.ports[2].name, "S_SRC", AOS_MAX_PORT_NAME - 1u);
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_E_CONFIG);

    UT_CASE("non-mutual channel peers rejected", "AOS-HLR-040");
    fx_reset();
    fx.ports[1].peer = 2u;             /* S_DST claims Q_SRC as peer */
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_E_CONFIG);

    UT_CASE("mismatched channel message size rejected", "AOS-HLR-040");
    fx_reset();
    fx.ports[1].max_msg_bytes = 32u;
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_E_CONFIG);

    UT_CASE("null entry point rejected", "AOS-HLR-040");
    fx_reset();
    fx.parts[0].step = NULL;
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_E_CONFIG);

    UT_CASE("config fault triggers configured safe state", "AOS-HLR-031");
    fx_reset();
    fx.windows[1].offset_us = 0u;
    fx.cfg.hm_module.action[AOS_ERR_CONFIG] = AOS_HM_SAFE_STATE;
    {
        jmp_buf env;
        uint32_t reason = 0u;

        if (setjmp(env) == 0)
        {
            hal_host_expect_safe_state(&env);
            (void)aos_kernel_init(&fx.cfg);
            UT_CHECK(false);  /* must not reach: safe state expected */
        }
        UT_CHECK(hal_host_safe_state_hit(&reason));
        UT_CHECK(reason == (uint32_t)AOS_ERR_CONFIG);
    }
}
