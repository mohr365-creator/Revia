/*
 * Revia FCS — pitch-axis control law (DAL A)
 *
 * Pure, side-effect-free computation so the law can be verified in
 * isolation against the control-law requirements (AOS-SRS-110..115).
 * Partition glue (ports, mode logic) lives in fcs_main.c.
 */
#ifndef FCS_LAW_H
#define FCS_LAW_H

#include <stdbool.h>
#include "revia_msgs.h"

/* Certified envelope constants (REV-FCS-ENV-001). */
#define FCS_ELEV_LIMIT_DEG      25.0f   /* surface authority            */
#define FCS_ELEV_RATE_DPS       40.0f   /* surface slew limit           */
#define FCS_ALPHA_PROT_DEG      12.0f   /* protection onset             */
#define FCS_ALPHA_MAX_DEG       15.0f   /* never-exceed alpha           */
#define FCS_CMD_LIMIT_DPS       10.0f   /* pilot pitch-rate authority   */

typedef struct
{
    float integ_deg;          /* integrator state                       */
    float elev_prev_deg;      /* last commanded surface (for slew)      */
} fcs_law_state_t;

typedef struct
{
    float pitch_cmd_dps;      /* pilot/AP commanded pitch rate          */
    float pitch_rate_dps;     /* measured body pitch rate               */
    float alpha_deg;          /* measured angle of attack               */
    bool  data_valid;         /* false -> direct law                    */
} fcs_law_in_t;

typedef struct
{
    float          elev_deg;
    fcs_law_mode_t mode;
    bool           alpha_prot_active;
} fcs_law_out_t;

void fcs_law_reset(fcs_law_state_t *st);

/* One control-law frame; dt_s is the elapsed time since the previous
 * frame (bounded by caller to [0.001, 0.1] s). */
fcs_law_out_t fcs_law_step(const fcs_law_in_t *in,
                           fcs_law_state_t *st, float dt_s);

#endif /* FCS_LAW_H */
