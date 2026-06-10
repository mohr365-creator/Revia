/* Revia MON — flight-control monitor partition entry points. */
#ifndef MON_PART_H
#define MON_PART_H

#include "aos_partition.h"

aos_ret_t mon_part_init(aos_part_mode_t start_mode);
aos_ret_t mon_part_step(aos_time_us_t window_start_us);

#endif /* MON_PART_H */
