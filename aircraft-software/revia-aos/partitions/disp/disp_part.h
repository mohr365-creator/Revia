/* Revia DISP — display/EICAS data concentrator entry points. */
#ifndef DISP_PART_H
#define DISP_PART_H

#include "aos_partition.h"

aos_ret_t disp_part_init(aos_part_mode_t start_mode);
aos_ret_t disp_part_step(aos_time_us_t window_start_us);

#endif /* DISP_PART_H */
