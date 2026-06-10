/* Revia FCS — partition entry points (registered in module_config.c). */
#ifndef FCS_PART_H
#define FCS_PART_H

#include "aos_partition.h"

aos_ret_t fcs_part_init(aos_part_mode_t start_mode);
aos_ret_t fcs_part_step(aos_time_us_t window_start_us);

#endif /* FCS_PART_H */
