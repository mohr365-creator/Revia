/*
 * Revia AOS — kernel-internal interfaces
 *
 * Shared between kernel translation units and white-box requirements
 * tests. Not part of the application (APEX) interface.
 */
#ifndef AOS_INTERNAL_H
#define AOS_INTERNAL_H

#include "aos_kernel.h"

/* Active configuration; NULL until aos_kernel_init succeeds far enough
 * to pin it. Owned by aos_kernel.c. */
extern const aos_module_config_t *aos_g_cfg;

/* Per-partition operating mode. Owned by aos_kernel.c. */
extern aos_part_mode_t aos_g_mode[AOS_MAX_PARTITIONS];

/* Partition whose window is currently executing. Owned by aos_sched.c. */
extern aos_part_id_t aos_g_current;

/* Subsystem state reset, used by cold start and host-build tests. */
void aos_port_reset_state(void);
void aos_hm_reset_state(void);
void aos_sched_reset_state(void);

/* Validate port routing of the pinned configuration (called from
 * aos_kernel_init). Returns AOS_OK or AOS_E_CONFIG. */
aos_ret_t aos_port_config_check(void);

#ifdef AOS_HOST_BUILD
/* Tests only: impersonate a partition for direct service-call tests. */
void aos_sched_set_current_for_test(aos_part_id_t part);
#endif

#endif /* AOS_INTERNAL_H */
