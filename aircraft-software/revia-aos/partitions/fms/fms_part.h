/* Revia FMS — flight management partition entry points. */
#ifndef FMS_PART_H
#define FMS_PART_H

#include "aos_partition.h"

aos_ret_t fms_part_init(aos_part_mode_t start_mode);
aos_ret_t fms_part_step(aos_time_us_t window_start_us);

#endif /* FMS_PART_H */
