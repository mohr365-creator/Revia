/* Revia IOM — I/O manager partition entry points. */
#ifndef IOM_PART_H
#define IOM_PART_H

#include "aos_partition.h"

aos_ret_t iom_part_init(aos_part_mode_t start_mode);
aos_ret_t iom_part_step(aos_time_us_t window_start_us);

#endif /* IOM_PART_H */
