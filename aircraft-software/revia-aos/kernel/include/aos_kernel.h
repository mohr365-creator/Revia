/*
 * Revia AOS — kernel lifecycle
 *
 * @satisfies AOS-HLR-040 (configuration validation before NORMAL mode)
 * @satisfies AOS-HLR-041 (deterministic cold start)
 */
#ifndef AOS_KERNEL_H
#define AOS_KERNEL_H

#include "aos_types.h"
#include "aos_partition.h"
#include "aos_port.h"
#include "aos_sched.h"
#include "aos_health.h"

/* Complete static module configuration, assembled in
 * config/module_config.c and passed to aos_kernel_init exactly once. */
typedef struct
{
    const aos_part_desc_t *parts;
    uint8_t                part_count;
    const aos_port_desc_t *ports;
    uint8_t                port_count;
    const aos_window_t    *windows;
    uint8_t                window_count;
    aos_dur_us_t           major_frame_us;
    const aos_hm_policy_t *hm_partition;   /* one per partition          */
    aos_hm_policy_t        hm_module;      /* module-level policy        */
    aos_part_id_t          maint_part;     /* partition allowed HM reads */
    /* Module identity: the same AOS binary is instantiated on many
     * LRUs; each instance is identified by its configuration (e.g.
     * "R100-FCC1-COM"). Used to tag maintenance/HM data and network
     * traffic with the originating LRU and lane. (AOS-HLR-042) */
    const char            *module_id;
} aos_module_config_t;

/* Validate the configuration exhaustively (limits, window overlap and
 * fit, port routing, name uniqueness, HM table sanity), then cold-start
 * every partition. On any configuration fault: AOS_E_CONFIG and the
 * module-level HM action for AOS_ERR_CONFIG is applied — the module
 * never enters NORMAL mode with an invalid configuration. */
aos_ret_t aos_kernel_init(const aos_module_config_t *cfg);

/* Read-only access to the active configuration (NULL before init). */
const aos_module_config_t *aos_kernel_config(void);

/* Test/simulation support: tear down kernel state so init can run
 * again in the same process. Compiled out of flight builds. */
#ifdef AOS_HOST_BUILD
void aos_kernel_reset_for_test(void);
#endif

#endif /* AOS_KERNEL_H */
