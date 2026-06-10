/*
 * Revia AOS — common types and return codes
 *
 * Component : kernel
 * Standard  : DO-178C DAL A profile (see docs/certification/software-code-standard.md)
 *
 * @satisfies AOS-HLR-001  (fixed-width types only; no platform-dependent widths)
 * @satisfies AOS-HLR-002  (every kernel service reports an explicit status)
 */
#ifndef AOS_TYPES_H
#define AOS_TYPES_H

#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

/* Kernel service return codes. Every kernel entry point returns one of
 * these; callers are required to check it (enforced by code review and
 * static analysis, rule RAC-12). */
typedef enum
{
    AOS_OK              = 0,  /* service completed                         */
    AOS_E_PARAM         = 1,  /* invalid argument                          */
    AOS_E_STATE         = 2,  /* service illegal in current mode/state     */
    AOS_E_CONFIG        = 3,  /* static configuration table is invalid     */
    AOS_E_RANGE         = 4,  /* index/identifier out of configured range  */
    AOS_E_FULL          = 5,  /* bounded resource exhausted (e.g. queue)   */
    AOS_E_EMPTY         = 6,  /* nothing available (e.g. queue empty)      */
    AOS_E_STALE         = 7,  /* sampling data older than refresh period   */
    AOS_E_SIZE          = 8,  /* message size exceeds configured maximum   */
    AOS_E_TIMING        = 9,  /* deadline / window overrun detected        */
    AOS_E_ACCESS        = 10  /* partition not authorized for resource     */
} aos_ret_t;

/* Monotonic time in microseconds since module cold start. 64-bit:
 * does not wrap within aircraft service life (~584,000 years). */
typedef uint64_t aos_time_us_t;

/* Duration in microseconds (32-bit: max ~71.6 min, far above any
 * configurable window or refresh period; validated at config check). */
typedef uint32_t aos_dur_us_t;

/* Statically assigned identifiers (indices into configuration tables). */
typedef uint8_t  aos_part_id_t;   /* partition identifier  */
typedef uint8_t  aos_port_id_t;   /* comm. port identifier */

/* Sentinel meaning "no partition" (e.g. kernel context). */
#define AOS_PART_ID_NONE  ((aos_part_id_t)0xFFu)

#endif /* AOS_TYPES_H */
