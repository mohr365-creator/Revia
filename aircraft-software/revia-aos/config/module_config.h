/*
 * Revia AOS — module configuration, R-100 baseline (REV-CFG-R100-001)
 */
#ifndef MODULE_CONFIG_H
#define MODULE_CONFIG_H

#include "aos_kernel.h"

/* Partition identifiers (indices into the partition table). */
enum
{
    REVIA_PART_IOM   = 0,
    REVIA_PART_FCS   = 1,
    REVIA_PART_DISP  = 2,
    REVIA_PART_FMS   = 3,
    REVIA_PART_MAINT = 4,
    REVIA_PART_COUNT = 5
};

/* The complete static configuration for this module. */
const aos_module_config_t *revia_module_config(void);

#endif /* MODULE_CONFIG_H */
