/* Revia MAINT — central maintenance partition entry points. */
#ifndef MAINT_PART_H
#define MAINT_PART_H

#include "aos_partition.h"
#include "aos_types.h"

aos_ret_t maint_part_init(aos_part_mode_t start_mode);
aos_ret_t maint_part_step(aos_time_us_t window_start_us);

/* Maintenance summary, exposed for ground tools / host simulator. */
typedef struct
{
    uint32_t eicas_advisory;
    uint32_t eicas_caution;
    uint32_t eicas_warning;
    uint32_t hm_events_seen;
} maint_summary_t;

/* Copy of the live summary (valid after at least one MAINT window). */
aos_ret_t maint_get_summary(maint_summary_t *out);

#endif /* MAINT_PART_H */
