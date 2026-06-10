/*
 * Revia AOS — module configuration, R-100 baseline (REV-CFG-R100-001)
 *
 * THIS FILE IS CONFIGURATION DATA. In the certified process it is
 * generated/reviewed against the module integration plan (DO-297) and
 * verified by the configuration validation in aos_kernel_init plus
 * the scheduling analysis in docs/architecture.md §timing.
 *
 * @satisfies AOS-HLR-015 (schedule fixed at configuration time)
 * @satisfies AOS-SRS-150 (R-100 baseline module layout)
 */
#include "module_config.h"

#include "fcs_part.h"
#include "iom_part.h"
#include "disp_part.h"
#include "fms_part.h"
#include "maint_part.h"
#include "revia_msgs.h"

/* Compile-time checks (C99-compatible static assertion). */
#define CFG_STATIC_ASSERT(name, cond) \
    typedef char cfg_assert_##name[(cond) ? 1 : -1]

CFG_STATIC_ASSERT(adc_fits,   sizeof(msg_adc_t)   <= AOS_MAX_MSG_BYTES);
CFG_STATIC_ASSERT(pilot_fits, sizeof(msg_pilot_t) <= AOS_MAX_MSG_BYTES);
CFG_STATIC_ASSERT(surf_fits,  sizeof(msg_surf_t)  <= AOS_MAX_MSG_BYTES);
CFG_STATIC_ASSERT(nav_fits,   sizeof(msg_nav_t)   <= AOS_MAX_MSG_BYTES);
CFG_STATIC_ASSERT(eicas_fits, sizeof(msg_eicas_t) <= AOS_MAX_MSG_BYTES);

/* --- partition memory regions (statically allocated, 8-aligned) ----- */

#define REGION_WORDS  64u  /* 512 bytes per partition */

static uint64_t s_region_iom[REGION_WORDS];
static uint64_t s_region_fcs[REGION_WORDS];
static uint64_t s_region_disp[REGION_WORDS];
static uint64_t s_region_fms[REGION_WORDS];
static uint64_t s_region_maint[REGION_WORDS];

/* --- partition table ------------------------------------------------- */

static const aos_part_desc_t s_parts[REVIA_PART_COUNT] =
{
    { "IOM",   AOS_DAL_A, iom_part_init,   iom_part_step,
      s_region_iom,   sizeof(s_region_iom)   },
    { "FCS",   AOS_DAL_A, fcs_part_init,   fcs_part_step,
      s_region_fcs,   sizeof(s_region_fcs)   },
    { "DISP",  AOS_DAL_B, disp_part_init,  disp_part_step,
      s_region_disp,  sizeof(s_region_disp)  },
    { "FMS",   AOS_DAL_C, fms_part_init,   fms_part_step,
      s_region_fms,   sizeof(s_region_fms)   },
    { "MAINT", AOS_DAL_D, maint_part_init, maint_part_step,
      s_region_maint, sizeof(s_region_maint) }
};

/* --- major frame: 50 ms / 20 Hz -------------------------------------- */

#define MS(x) ((aos_dur_us_t)((x) * 1000u))

static const aos_window_t s_windows[] =
{
    { REVIA_PART_IOM,   MS(0),  MS(5)  },
    { REVIA_PART_FCS,   MS(5),  MS(10) },
    { REVIA_PART_DISP,  MS(15), MS(10) },
    { REVIA_PART_FMS,   MS(25), MS(15) },
    { REVIA_PART_MAINT, MS(40), MS(5)  },
    { AOS_PART_ID_NONE, MS(45), MS(5)  }   /* kernel slack / HM window */
};

/* --- communication channels ------------------------------------------ */

/* Refresh periods: a consumer treats data older than ~2.4 frames as
 * stale (allows one missed producer window plus jitter). */
#define REFRESH_2F  ((aos_dur_us_t)120000u)
#define REFRESH_5F  ((aos_dur_us_t)250000u)

static const aos_port_desc_t s_ports[] =
{
    /* 0 */ { "IOM_ADC_OUT",        AOS_PORT_SAMPLING, AOS_PORT_SOURCE,
              REVIA_PART_IOM,   (uint16_t)sizeof(msg_adc_t),   0u, 0u, 1u },
    /* 1 */ { "FCS_ADC_IN",         AOS_PORT_SAMPLING, AOS_PORT_DESTINATION,
              REVIA_PART_FCS,   (uint16_t)sizeof(msg_adc_t),   0u, REFRESH_2F, 0u },
    /* 2 */ { "IOM_PILOT_OUT",      AOS_PORT_SAMPLING, AOS_PORT_SOURCE,
              REVIA_PART_IOM,   (uint16_t)sizeof(msg_pilot_t), 0u, 0u, 3u },
    /* 3 */ { "FCS_PILOT_IN",       AOS_PORT_SAMPLING, AOS_PORT_DESTINATION,
              REVIA_PART_FCS,   (uint16_t)sizeof(msg_pilot_t), 0u, REFRESH_2F, 2u },
    /* 4 */ { "FCS_SURF_OUT",       AOS_PORT_SAMPLING, AOS_PORT_SOURCE,
              REVIA_PART_FCS,   (uint16_t)sizeof(msg_surf_t),  0u, 0u, 5u },
    /* 5 */ { "DISP_SURF_IN",       AOS_PORT_SAMPLING, AOS_PORT_DESTINATION,
              REVIA_PART_DISP,  (uint16_t)sizeof(msg_surf_t),  0u, REFRESH_2F, 4u },
    /* 6 */ { "FCS_SURF_MODEL_OUT", AOS_PORT_SAMPLING, AOS_PORT_SOURCE,
              REVIA_PART_FCS,   (uint16_t)sizeof(msg_surf_t),  0u, 0u, 7u },
    /* 7 */ { "IOM_SURF_IN",        AOS_PORT_SAMPLING, AOS_PORT_DESTINATION,
              REVIA_PART_IOM,   (uint16_t)sizeof(msg_surf_t),  0u, REFRESH_2F, 6u },
    /* 8 */ { "FMS_NAV_OUT",        AOS_PORT_SAMPLING, AOS_PORT_SOURCE,
              REVIA_PART_FMS,   (uint16_t)sizeof(msg_nav_t),   0u, 0u, 9u },
    /* 9 */ { "DISP_NAV_IN",        AOS_PORT_SAMPLING, AOS_PORT_DESTINATION,
              REVIA_PART_DISP,  (uint16_t)sizeof(msg_nav_t),   0u, REFRESH_5F, 8u },
    /*10 */ { "DISP_EICAS_OUT",     AOS_PORT_QUEUING,  AOS_PORT_SOURCE,
              REVIA_PART_DISP,  (uint16_t)sizeof(msg_eicas_t), 8u, 0u, 11u },
    /*11 */ { "MAINT_EICAS_IN",     AOS_PORT_QUEUING,  AOS_PORT_DESTINATION,
              REVIA_PART_MAINT, (uint16_t)sizeof(msg_eicas_t), 8u, 0u, 10u }
};

/* --- health-monitor policy -------------------------------------------- */
/* action[err] indexed by aos_err_id_t:
 *   APP, DEADLINE, MEM_VIOLATION, ILLEGAL_SVC, STACK, CONFIG, FRAME    */

static const aos_hm_policy_t s_hm_part[REVIA_PART_COUNT] =
{
    /* IOM: flight-critical I/O — restart fast, escalate on memory. */
    { { AOS_HM_WARM_RESTART, AOS_HM_WARM_RESTART, AOS_HM_COLD_RESTART,
        AOS_HM_WARM_RESTART, AOS_HM_COLD_RESTART, AOS_HM_SAFE_STATE,
        AOS_HM_SAFE_STATE } },
    /* FCS: flight-critical — same policy as IOM. */
    { { AOS_HM_WARM_RESTART, AOS_HM_WARM_RESTART, AOS_HM_COLD_RESTART,
        AOS_HM_WARM_RESTART, AOS_HM_COLD_RESTART, AOS_HM_SAFE_STATE,
        AOS_HM_SAFE_STATE } },
    /* DISP: essential — restart; never takes the module down. */
    { { AOS_HM_WARM_RESTART, AOS_HM_WARM_RESTART, AOS_HM_COLD_RESTART,
        AOS_HM_WARM_RESTART, AOS_HM_COLD_RESTART, AOS_HM_COLD_RESTART,
        AOS_HM_LOG } },
    /* FMS: non-essential for continued safe flight — idle on repeat
     * faults is acceptable; start with restart. */
    { { AOS_HM_WARM_RESTART, AOS_HM_WARM_RESTART, AOS_HM_IDLE,
        AOS_HM_WARM_RESTART, AOS_HM_IDLE, AOS_HM_IDLE,
        AOS_HM_LOG } },
    /* MAINT: idle on any fault — it must never disturb the module. */
    { { AOS_HM_IDLE, AOS_HM_IDLE, AOS_HM_IDLE,
        AOS_HM_IDLE, AOS_HM_IDLE, AOS_HM_IDLE,
        AOS_HM_LOG } }
};

static const aos_module_config_t s_cfg =
{
    s_parts,
    (uint8_t)REVIA_PART_COUNT,
    s_ports,
    (uint8_t)(sizeof(s_ports) / sizeof(s_ports[0])),
    s_windows,
    (uint8_t)(sizeof(s_windows) / sizeof(s_windows[0])),
    MS(50),                     /* major frame */
    s_hm_part,
    /* Module-level policy: invalid configuration or unattributable
     * fault -> safe state; frame overrun is logged on first occurrence
     * (the scheduler also reports AOS_E_TIMING to the kernel main,
     * which escalates on recurrence — see tools/host_sim/main.c). */
    { { AOS_HM_SAFE_STATE, AOS_HM_SAFE_STATE, AOS_HM_SAFE_STATE,
        AOS_HM_SAFE_STATE, AOS_HM_SAFE_STATE, AOS_HM_SAFE_STATE,
        AOS_HM_LOG } },
    (aos_part_id_t)REVIA_PART_MAINT
};

const aos_module_config_t *revia_module_config(void)
{
    return &s_cfg;
}
