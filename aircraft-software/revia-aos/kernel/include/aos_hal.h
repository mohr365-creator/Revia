/*
 * Revia AOS — hardware abstraction layer (HAL) interface
 *
 * The kernel is target-independent; each target (flight computer,
 * host simulator) provides exactly one implementation of this
 * interface. Flight targets back aos_hal_protect_* with the MMU/MPU;
 * the host simulator checks bounds in software.
 *
 * @satisfies AOS-HLR-020  (kernel isolated from hardware behind a HAL)
 */
#ifndef AOS_HAL_H
#define AOS_HAL_H

#include "aos_types.h"

/* Monotonic time since cold start. Must never decrease (AOS-HLR-021). */
aos_time_us_t aos_hal_now_us(void);

/* Idle until the absolute time 't' (no-op if already past). Flight
 * targets sleep/halt until the tick; the host simulator advances its
 * virtual clock, keeping tests deterministic. (AOS-HLR-021) */
void aos_hal_advance_to(aos_time_us_t t);

/* Arm the hardware watchdog to fire after 'budget' microseconds unless
 * re-armed. Used to bound every partition window (AOS-HLR-022). */
void aos_hal_watchdog_arm(aos_dur_us_t budget_us);
void aos_hal_watchdog_disarm(void);

/* Switch memory-protection context to the given partition; only that
 * partition's configured region is writable until the next switch.
 * AOS_PART_ID_NONE selects the kernel context. (AOS-HLR-010) */
void aos_hal_protect_select(aos_part_id_t part);

/* Drive the module to its configured safe state: command surfaces /
 * outputs to fail-safe values and halt partition scheduling. Never
 * returns on flight targets; the host simulator records the event and
 * longjmps back to the test harness. (AOS-HLR-031) */
void aos_hal_safe_state(uint32_t reason_code);

#endif /* AOS_HAL_H */
