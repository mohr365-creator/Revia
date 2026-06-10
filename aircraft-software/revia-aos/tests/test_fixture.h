/*
 * Shared test fixture: a small two-partition module configuration the
 * suites mutate to exercise validation and kernel behaviour.
 */
#ifndef TEST_FIXTURE_H
#define TEST_FIXTURE_H

#include "aos_kernel.h"

/* Mutable copy of a minimal valid configuration. Call fx_reset() to
 * restore it (and kernel + HAL state) before each case. */
typedef struct
{
    aos_part_desc_t parts[4];
    aos_port_desc_t ports[8];
    aos_window_t    windows[6];
    aos_hm_policy_t hm_part[4];
    aos_module_config_t cfg;
} fixture_t;

extern fixture_t fx;

void fx_reset(void);

/* Fixture partition behaviour knobs (apply to partition 0, "P0"). */
extern aos_ret_t    fx_p0_step_ret;     /* returned by P0 step          */
extern aos_dur_us_t fx_p0_consume_us;   /* virtual time burned per step */
extern uint32_t     fx_p0_steps;        /* step invocation counter      */
extern uint32_t     fx_p0_inits;        /* init invocation counter      */

#endif /* TEST_FIXTURE_H */
