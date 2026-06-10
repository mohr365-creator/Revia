/*
 * Revia AOS — host HAL (POSIX development/verification build)
 *
 * Implements aos_hal.h with a deterministic virtual clock so
 * requirements-based tests are timing-exact and fast. Not part of any
 * flight build.
 */
#ifndef HAL_HOST_H
#define HAL_HOST_H

#include <setjmp.h>
#include "aos_types.h"

/* Reset virtual time and recorded HAL state (tests). */
void hal_host_reset(void);

/* Simulate CPU time consumed by the running partition (tests use this
 * to provoke window/frame overruns). */
void hal_host_consume_us(aos_dur_us_t us);

/* Safe-state capture: if a jmp_buf is registered, aos_hal_safe_state
 * records the reason and longjmps to it; otherwise the process exits.
 * Returns the recorded reason of the most recent safe-state entry. */
void hal_host_expect_safe_state(jmp_buf *env);
bool hal_host_safe_state_hit(uint32_t *reason_out);

/* Watchdog introspection (tests verify every window was bounded). */
uint32_t hal_host_watchdog_arm_count(void);

/* Memory-protection context introspection (tests verify the kernel
 * selects each partition's context exactly once per executed window
 * and returns to the kernel context afterwards). */
uint32_t      hal_host_protect_select_count(void);
aos_part_id_t hal_host_protect_current(void);

#endif /* HAL_HOST_H */
