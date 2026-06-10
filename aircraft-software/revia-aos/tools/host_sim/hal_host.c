/*
 * Revia AOS — host HAL implementation (verification build only)
 *
 * @satisfies AOS-HLR-021 (monotonic time base — host realization;
 *            each flight target's HAL satisfies it independently)
 */
#include <stdio.h>
#include <stdlib.h>

#include "aos_hal.h"
#include "hal_host.h"

static aos_time_us_t s_now_us;
static uint32_t      s_wd_arms;
static bool          s_wd_armed;
static jmp_buf      *s_safe_env;
static bool          s_safe_hit;
static uint32_t      s_safe_reason;
static uint32_t      s_protect_selects;
static aos_part_id_t s_protect_current = AOS_PART_ID_NONE;

void hal_host_reset(void)
{
    s_now_us      = 0u;
    s_wd_arms     = 0u;
    s_wd_armed    = false;
    s_safe_env    = NULL;
    s_safe_hit    = false;
    s_safe_reason = 0u;
    s_protect_selects = 0u;
    s_protect_current = AOS_PART_ID_NONE;
}

aos_time_us_t aos_hal_now_us(void)
{
    return s_now_us;
}

void aos_hal_advance_to(aos_time_us_t t)
{
    if (t > s_now_us)
    {
        s_now_us = t;
    }
}

void hal_host_consume_us(aos_dur_us_t us)
{
    s_now_us += (aos_time_us_t)us;
}

void aos_hal_watchdog_arm(aos_dur_us_t budget_us)
{
    (void)budget_us;
    s_wd_arms++;
    s_wd_armed = true;
}

void aos_hal_watchdog_disarm(void)
{
    s_wd_armed = false;
}

uint32_t hal_host_watchdog_arm_count(void)
{
    return s_wd_arms;
}

void aos_hal_protect_select(aos_part_id_t part)
{
    /* Host build: hardware MPU programming has no host analogue; the
     * selection sequence is recorded for verification. */
    if (part != AOS_PART_ID_NONE)
    {
        s_protect_selects++;
    }
    s_protect_current = part;
}

uint32_t hal_host_protect_select_count(void)
{
    return s_protect_selects;
}

aos_part_id_t hal_host_protect_current(void)
{
    return s_protect_current;
}

void aos_hal_safe_state(uint32_t reason_code)
{
    s_safe_hit    = true;
    s_safe_reason = reason_code;

    if (s_safe_env != NULL)
    {
        jmp_buf *env = s_safe_env;

        s_safe_env = NULL;
        longjmp(*env, 1);
    }
    (void)fprintf(stderr,
                  "AOS SAFE STATE (reason=%u) — halting host process\n",
                  reason_code);
    exit(EXIT_FAILURE);
}

void hal_host_expect_safe_state(jmp_buf *env)
{
    s_safe_env = env;
}

bool hal_host_safe_state_hit(uint32_t *reason_out)
{
    if (reason_out != NULL)
    {
        *reason_out = s_safe_reason;
    }
    return s_safe_hit;
}
