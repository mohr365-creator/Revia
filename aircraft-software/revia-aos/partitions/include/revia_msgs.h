/*
 * Revia aircraft — inter-partition message definitions (ICD extract)
 *
 * Authoritative definition lives in the Interface Control Document
 * REV-ICD-001; sizes and units here must match it. All structures are
 * fixed-size, no pointers, no padding assumptions beyond natural
 * alignment (verified by static assertions in module_config.c).
 *
 * @satisfies AOS-SRS-101 (typed, versioned inter-partition messages)
 */
#ifndef REVIA_MSGS_H
#define REVIA_MSGS_H

#include <stdint.h>
#include <stdbool.h>

/* Air-data / inertial reference snapshot (IOM -> FCS), 100 Hz source. */
#define MSG_ADC_VALID_IAS    (1u << 0)
#define MSG_ADC_VALID_ALPHA  (1u << 1)
#define MSG_ADC_VALID_PITCH  (1u << 2)
#define MSG_ADC_VALID_RATE   (1u << 3)
#define MSG_ADC_VALID_ALL    (0x0Fu)

typedef struct
{
    float    ias_kt;          /* indicated airspeed                [kt]  */
    float    alpha_deg;       /* angle of attack                   [deg] */
    float    pitch_deg;       /* pitch attitude                    [deg] */
    float    pitch_rate_dps;  /* body pitch rate                   [deg/s] */
    float    alt_ft;          /* pressure altitude                 [ft]  */
    uint32_t valid;           /* MSG_ADC_VALID_* bitmask                 */
} msg_adc_t;

/* Pilot inceptor command (IOM -> FCS). */
typedef struct
{
    float pitch_cmd_dps;      /* commanded pitch rate              [deg/s] */
    bool  ap_engaged;         /* autopilot engaged flag                   */
} msg_pilot_t;

/* Surface command (FCS -> actuators / DISP / IOM model). */
typedef enum
{
    FCS_LAW_NORMAL   = 0,     /* full envelope protection                */
    FCS_LAW_DIRECT   = 1,     /* degraded: stick-to-surface, no protect. */
    FCS_LAW_FAILSAFE = 2      /* surfaces to neutral                     */
} fcs_law_mode_t;

typedef struct
{
    float   elev_deg;         /* elevator command (+TED nose down) [deg] */
    uint8_t law_mode;         /* fcs_law_mode_t                          */
    uint8_t alpha_prot;       /* 1 if alpha protection active            */
} msg_surf_t;

/* Navigation solution (FMS -> DISP). */
typedef struct
{
    double  lat_deg;
    double  lon_deg;
    float   gs_kt;            /* ground speed                      [kt]  */
    float   trk_deg;          /* track, true                       [deg] */
    char    wpt_id[8];        /* active waypoint identifier              */
} msg_nav_t;

/* Crew-alerting message (DISP -> MAINT recorder). */
typedef enum
{
    EICAS_ADVISORY = 0,
    EICAS_CAUTION  = 1,
    EICAS_WARNING  = 2
} eicas_level_t;

typedef struct
{
    uint8_t level;            /* eicas_level_t                           */
    char    text[48];
} msg_eicas_t;

/* Flight-control monitor status (MON -> DISP).
 * The monitor is the dissimilar lane of the COM/MON pair: it checks
 * safety invariants of the COM output against independently routed
 * sensor data and latches a trip on persistent violation. */
#define MON_FLAG_AUTHORITY  (1u << 0)  /* surface beyond authority     */
#define MON_FLAG_SLEW       (1u << 1)  /* surface rate beyond limit    */
#define MON_FLAG_REVERSION  (1u << 2)  /* normal law on invalid data   */
#define MON_FLAG_ALPHA      (1u << 3)  /* no nose-down beyond max alpha */
#define MON_FLAG_NO_DATA    (1u << 4)  /* COM output channel silent    */

typedef struct
{
    uint8_t  trip;            /* 1 once latched (persists)              */
    uint8_t  flags;           /* MON_FLAG_* of the current frame        */
    uint32_t violation_count; /* total violating frames observed        */
} msg_mon_t;

#endif /* REVIA_MSGS_H */
