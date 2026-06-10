/*
 * Revia AOS — health monitor (HM)
 *
 * Three-level health monitoring per ARINC 653 / DO-297:
 *   process level   — hosted application raises errors it can scope
 *   partition level — kernel-detected faults attributable to one
 *                     partition (window overrun, illegal service,
 *                     memory violation) -> configured partition action
 *   module level    — faults that compromise the module (config
 *                     invalid, frame overrun, HM table fault)
 *                     -> configured module action, up to SAFE_STATE
 *
 * Every event is timestamped and recorded in a bounded log readable by
 * the maintenance partition (CMC) for Part 121 continuing-airworthiness
 * data collection.
 *
 * @satisfies AOS-HLR-030 (fault detection and response)
 * @satisfies AOS-HLR-031 (module safe state)
 * @satisfies AOS-HLR-032 (fault recording for maintenance)
 */
#ifndef AOS_HEALTH_H
#define AOS_HEALTH_H

#include "aos_types.h"
#include "aos_limits.h"

/* Error identifiers (kernel-detected and application-raised). */
typedef enum
{
    AOS_ERR_APP            = 0,  /* application-raised error            */
    AOS_ERR_DEADLINE       = 1,  /* partition window/deadline overrun   */
    AOS_ERR_MEM_VIOLATION  = 2,  /* write outside partition region      */
    AOS_ERR_ILLEGAL_SVC    = 3,  /* service call illegal in this state  */
    AOS_ERR_STACK          = 4,  /* stack guard breached                */
    AOS_ERR_CONFIG         = 5,  /* configuration table invalid         */
    AOS_ERR_FRAME_OVERRUN  = 6,  /* major frame timing breached         */
    AOS_ERR_COUNT          = 7
} aos_err_id_t;

/* Configured recovery action. */
typedef enum
{
    AOS_HM_LOG          = 0, /* record only                             */
    AOS_HM_IDLE         = 1, /* idle the faulting partition             */
    AOS_HM_WARM_RESTART = 2, /* warm-restart the faulting partition     */
    AOS_HM_COLD_RESTART = 3, /* cold-restart the faulting partition     */
    AOS_HM_SAFE_STATE   = 4  /* module safe state (aos_hal_safe_state)  */
} aos_hm_action_t;

/* One row of the HM table: action for (partition, error). The module
 * configuration provides a table per partition plus a module-level
 * row for errors with no attributable partition. */
typedef struct
{
    aos_hm_action_t action[AOS_ERR_COUNT];
} aos_hm_policy_t;

/* Recorded event (bounded log, oldest overwritten last-in-wins is NOT
 * used: when full, new events increment 'lost' counter instead, so
 * the first-fault snapshot is preserved for investigation). */
typedef struct
{
    aos_time_us_t  t_us;
    aos_part_id_t  part;        /* AOS_PART_ID_NONE for module level   */
    aos_err_id_t   err;
    aos_hm_action_t action;     /* action that was taken               */
    uint32_t       detail;      /* error-specific detail code          */
} aos_hm_event_t;

/* Raise an error against the current partition (application use) or a
 * specific partition / module level (kernel use). Applies the
 * configured action before returning (unless the action terminated
 * the caller's window). */
aos_ret_t aos_hm_raise(aos_part_id_t part, aos_err_id_t err, uint32_t detail);

/* Read event log entry 'idx' (0 = oldest). AOS_E_RANGE past the end.
 * Restricted to the maintenance-authorized partition. */
aos_ret_t aos_hm_read_event(uint32_t idx, aos_hm_event_t *ev_out);

/* Number of recorded events and number lost to log saturation. */
aos_ret_t aos_hm_stats(uint32_t *count_out, uint32_t *lost_out);

#endif /* AOS_HEALTH_H */
