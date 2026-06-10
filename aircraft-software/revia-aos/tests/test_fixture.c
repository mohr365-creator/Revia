#include <string.h>

#include "test_fixture.h"
#include "aos_internal.h"
#include "hal_host.h"

fixture_t fx;

aos_ret_t    fx_p0_step_ret;
aos_dur_us_t fx_p0_consume_us;
uint32_t     fx_p0_steps;
uint32_t     fx_p0_inits;

static uint64_t s_region0[32];
static uint64_t s_region1[32];

static aos_ret_t p0_init(aos_part_mode_t m)
{
    (void)m;
    fx_p0_inits++;
    return AOS_OK;
}

static aos_ret_t p0_step(aos_time_us_t t)
{
    (void)t;
    fx_p0_steps++;
    if (fx_p0_consume_us > 0u)
    {
        hal_host_consume_us(fx_p0_consume_us);
    }
    return fx_p0_step_ret;
}

static aos_ret_t p1_init(aos_part_mode_t m)
{
    (void)m;
    return AOS_OK;
}

static aos_ret_t p1_step(aos_time_us_t t)
{
    (void)t;
    return AOS_OK;
}

void fx_reset(void)
{
    uint8_t i;

    aos_kernel_reset_for_test();
    hal_host_reset();
    fx_p0_step_ret    = AOS_OK;
    fx_p0_consume_us  = 0u;
    fx_p0_steps       = 0u;
    fx_p0_inits       = 0u;

    (void)memset(&fx, 0, sizeof(fx));

    /* Partitions */
    (void)strncpy(fx.parts[0].name, "P0", AOS_MAX_PART_NAME - 1u);
    fx.parts[0].dal = AOS_DAL_A;
    fx.parts[0].init = p0_init;
    fx.parts[0].step = p0_step;
    fx.parts[0].region_base = s_region0;
    fx.parts[0].region_bytes = sizeof(s_region0);

    (void)strncpy(fx.parts[1].name, "P1", AOS_MAX_PART_NAME - 1u);
    fx.parts[1].dal = AOS_DAL_C;
    fx.parts[1].init = p1_init;
    fx.parts[1].step = p1_step;
    fx.parts[1].region_base = s_region1;
    fx.parts[1].region_bytes = sizeof(s_region1);

    /* Channels: P0 sampling -> P1, P0 queuing -> P1 */
    (void)strncpy(fx.ports[0].name, "S_SRC", AOS_MAX_PORT_NAME - 1u);
    fx.ports[0].kind = AOS_PORT_SAMPLING;
    fx.ports[0].dir = AOS_PORT_SOURCE;
    fx.ports[0].owner = 0u;
    fx.ports[0].max_msg_bytes = 16u;
    fx.ports[0].peer = 1u;

    (void)strncpy(fx.ports[1].name, "S_DST", AOS_MAX_PORT_NAME - 1u);
    fx.ports[1].kind = AOS_PORT_SAMPLING;
    fx.ports[1].dir = AOS_PORT_DESTINATION;
    fx.ports[1].owner = 1u;
    fx.ports[1].max_msg_bytes = 16u;
    fx.ports[1].refresh_us = 100000u;
    fx.ports[1].peer = 0u;

    (void)strncpy(fx.ports[2].name, "Q_SRC", AOS_MAX_PORT_NAME - 1u);
    fx.ports[2].kind = AOS_PORT_QUEUING;
    fx.ports[2].dir = AOS_PORT_SOURCE;
    fx.ports[2].owner = 0u;
    fx.ports[2].max_msg_bytes = 16u;
    fx.ports[2].queue_depth = 3u;
    fx.ports[2].peer = 3u;

    (void)strncpy(fx.ports[3].name, "Q_DST", AOS_MAX_PORT_NAME - 1u);
    fx.ports[3].kind = AOS_PORT_QUEUING;
    fx.ports[3].dir = AOS_PORT_DESTINATION;
    fx.ports[3].owner = 1u;
    fx.ports[3].max_msg_bytes = 16u;
    fx.ports[3].queue_depth = 3u;
    fx.ports[3].peer = 2u;

    /* Schedule: 10 ms frame, P0 then P1, slack at the end. */
    fx.windows[0].part = 0u;
    fx.windows[0].offset_us = 0u;
    fx.windows[0].duration_us = 3000u;
    fx.windows[1].part = 1u;
    fx.windows[1].offset_us = 3000u;
    fx.windows[1].duration_us = 3000u;
    fx.windows[2].part = AOS_PART_ID_NONE;
    fx.windows[2].offset_us = 6000u;
    fx.windows[2].duration_us = 4000u;

    /* HM: default everything to LOG so tests opt in to actions. */
    for (i = 0u; i < 4u; i++)
    {
        uint8_t e;

        for (e = 0u; e < (uint8_t)AOS_ERR_COUNT; e++)
        {
            fx.hm_part[i].action[e] = AOS_HM_LOG;
        }
    }

    fx.cfg.parts = fx.parts;
    fx.cfg.part_count = 2u;
    fx.cfg.ports = fx.ports;
    fx.cfg.port_count = 4u;
    fx.cfg.windows = fx.windows;
    fx.cfg.window_count = 3u;
    fx.cfg.major_frame_us = 10000u;
    fx.cfg.hm_partition = fx.hm_part;
    {
        uint8_t e;

        for (e = 0u; e < (uint8_t)AOS_ERR_COUNT; e++)
        {
            fx.cfg.hm_module.action[e] = AOS_HM_LOG;
        }
    }
    fx.cfg.maint_part = 1u;
}
