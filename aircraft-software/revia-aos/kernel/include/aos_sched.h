/*
 * Revia AOS — time-partitioned scheduler
 *
 * Fixed cyclic schedule: a major frame of statically configured
 * partition windows, repeated indefinitely. No priorities, no
 * preemption between partitions, no runtime schedule changes
 * (AOS-HLR-015): worst-case timing is decided entirely at
 * configuration time and verified by analysis.
 *
 * @satisfies AOS-HLR-015 (static cyclic schedule)
 * @satisfies AOS-HLR-016 (window overrun detection)
 */
#ifndef AOS_SCHED_H
#define AOS_SCHED_H

#include "aos_types.h"
#include "aos_limits.h"

/* One window of the major frame (module configuration). */
typedef struct
{
    aos_part_id_t part;          /* AOS_PART_ID_NONE = kernel/slack    */
    aos_dur_us_t  offset_us;     /* from major frame start             */
    aos_dur_us_t  duration_us;   /* window budget (watchdog-bounded)   */
} aos_window_t;

/* Execute exactly one major frame: run every window in configured
 * order, enforcing each budget. Returns AOS_E_TIMING if the frame
 * overran (after the HM has been notified). Called in a loop by the
 * kernel main on flight targets, and by tests/simulator directly. */
aos_ret_t aos_sched_run_major_frame(void);

/* Frame counter since entering NORMAL mode (telemetry/maintenance). */
uint32_t aos_sched_frame_count(void);

#endif /* AOS_SCHED_H */
