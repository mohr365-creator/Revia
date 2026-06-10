/* Revia IOM — I/O manager partition entry points. */
#ifndef IOM_PART_H
#define IOM_PART_H

#include "aos_partition.h"
#include "aos_port.h"

aos_ret_t iom_part_init(aos_part_mode_t start_mode);
aos_ret_t iom_part_step(aos_time_us_t window_start_us);

/* IOM partition state (lives in the partition's memory region).
 * Published here so host scenarios and tests inject pilot commands
 * and sensor failures through one authoritative definition; flight
 * builds have no writer outside the partition (MPU-enforced). */
typedef struct
{
    float         pitch_deg;
    float         pitch_rate_dps;
    float         alpha_deg;
    float         elev_deg;        /* last surface command received   */
    aos_time_us_t t_prev_us;
    bool          have_prev;
    aos_port_id_t p_adc_out;
    aos_port_id_t p_adc_mon_out;
    aos_port_id_t p_pilot_out;
    aos_port_id_t p_surf_in;
    /* Scenario injection (host builds: pilot inceptors / failures). */
    float         cmd_pitch_dps;
    bool          fail_adc;
} iom_state_t;

#endif /* IOM_PART_H */
