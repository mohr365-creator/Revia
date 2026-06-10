/*
 * Revia AOS — partition management
 *
 * A partition is a statically configured application container with
 * its own memory region, schedule windows, ports, and health-monitor
 * policy. Partition descriptors live in the module configuration
 * (config/module_config.c) and are immutable at runtime.
 *
 * @satisfies AOS-HLR-010 (space partitioning)
 * @satisfies AOS-HLR-011 (partition operating modes)
 */
#ifndef AOS_PARTITION_H
#define AOS_PARTITION_H

#include "aos_types.h"
#include "aos_limits.h"

/* Partition operating mode (ARINC 653 OPERATING_MODE_TYPE subset). */
typedef enum
{
    AOS_PART_IDLE         = 0, /* not scheduled; outputs invalidated   */
    AOS_PART_COLD_START   = 1, /* init from power-on state             */
    AOS_PART_WARM_START   = 2, /* re-init, retained context permitted  */
    AOS_PART_NORMAL       = 3  /* operational; step() called per window */
} aos_part_mode_t;

/* Design assurance level of the hosted application (informative for
 * scheduling audits and the maintenance partition; the kernel applies
 * identical robust partitioning regardless of DAL). */
typedef enum
{
    AOS_DAL_A = 0,
    AOS_DAL_B = 1,
    AOS_DAL_C = 2,
    AOS_DAL_D = 3,
    AOS_DAL_E = 4
} aos_dal_t;

/* Partition entry points, supplied by the hosted application.
 *  init : called once on COLD_START / WARM_START, inside the
 *         partition's first window after the mode change.
 *  step : called once per scheduled window in NORMAL mode; must
 *         return before the window budget expires (watchdog-bounded).
 * Both run in the partition's memory-protection context. */
typedef aos_ret_t (*aos_part_init_fn)(aos_part_mode_t start_mode);
typedef aos_ret_t (*aos_part_step_fn)(aos_time_us_t window_start_us);

/* Immutable partition descriptor (one per partition, in ROM/config). */
typedef struct
{
    char              name[AOS_MAX_PART_NAME];
    aos_dal_t         dal;
    aos_part_init_fn  init;
    aos_part_step_fn  step;
    /* Static memory region owned by the partition (host build: bounds
     * are asserted; flight build: programmed into the MPU). */
    void             *region_base;
    size_t            region_bytes;
} aos_part_desc_t;

/* Current mode of a partition. */
aos_ret_t aos_partition_get_mode(aos_part_id_t part, aos_part_mode_t *mode_out);

/* Request a mode transition. Applications may only set their OWN mode
 * (ARINC 653 SET_PARTITION_MODE); the health monitor may set any.
 * Legal app transitions: NORMAL->IDLE, COLD/WARM_START->NORMAL. */
aos_ret_t aos_partition_set_mode(aos_part_id_t part, aos_part_mode_t mode);

/* Identity of the partition currently scheduled (AOS_PART_ID_NONE if
 * the kernel/slack window is active). */
aos_part_id_t aos_partition_current(void);

#endif /* AOS_PARTITION_H */
