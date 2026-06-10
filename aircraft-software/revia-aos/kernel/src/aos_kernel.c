/*
 * Revia AOS — kernel lifecycle and configuration validation
 *
 * @satisfies AOS-HLR-040 (exhaustive configuration validation)
 * @satisfies AOS-HLR-041 (deterministic cold start)
 * @satisfies AOS-HLR-011 (partition operating modes)
 */
#include <string.h>

#include "aos_internal.h"
#include "aos_hal.h"

const aos_module_config_t *aos_g_cfg = NULL;
aos_part_mode_t aos_g_mode[AOS_MAX_PARTITIONS];

/* --- validation helpers -------------------------------------------- */

static bool name_ok(const char *s, size_t cap)
{
    size_t i;
    bool terminated = false;

    for (i = 0u; i < cap; i++)
    {
        if (s[i] == '\0')
        {
            terminated = true;
            break;
        }
    }
    return terminated && (s[0] != '\0');
}

static aos_ret_t check_partitions(const aos_module_config_t *cfg)
{
    aos_ret_t ret = AOS_OK;
    uint8_t i;
    uint8_t j;

    if ((cfg->part_count == 0u) || (cfg->part_count > AOS_MAX_PARTITIONS) ||
        (cfg->parts == NULL) || (cfg->hm_partition == NULL))
    {
        ret = AOS_E_CONFIG;
    }

    for (i = 0u; (ret == AOS_OK) && (i < cfg->part_count); i++)
    {
        const aos_part_desc_t *p = &cfg->parts[i];

        if (!name_ok(p->name, AOS_MAX_PART_NAME) ||
            (p->init == NULL) || (p->step == NULL) ||
            (p->region_base == NULL) || (p->region_bytes == 0u))
        {
            ret = AOS_E_CONFIG;
        }
        for (j = 0u; (ret == AOS_OK) && (j < i); j++)
        {
            if (strncmp(p->name, cfg->parts[j].name, AOS_MAX_PART_NAME) == 0)
            {
                ret = AOS_E_CONFIG;  /* duplicate partition name */
            }
        }
    }
    return ret;
}

static aos_ret_t check_schedule(const aos_module_config_t *cfg)
{
    aos_ret_t ret = AOS_OK;
    uint8_t i;
    aos_dur_us_t prev_end = 0u;

    if ((cfg->window_count == 0u) || (cfg->window_count > AOS_MAX_WINDOWS) ||
        (cfg->windows == NULL) || (cfg->major_frame_us == 0u))
    {
        ret = AOS_E_CONFIG;
    }

    for (i = 0u; (ret == AOS_OK) && (i < cfg->window_count); i++)
    {
        const aos_window_t *w = &cfg->windows[i];

        if (w->duration_us == 0u)
        {
            ret = AOS_E_CONFIG;
        }
        else if ((w->part != AOS_PART_ID_NONE) && (w->part >= cfg->part_count))
        {
            ret = AOS_E_CONFIG;  /* window assigned to unknown partition */
        }
        else if (w->offset_us < prev_end)
        {
            ret = AOS_E_CONFIG;  /* windows overlap or are out of order */
        }
        else if ((w->offset_us + w->duration_us) > cfg->major_frame_us)
        {
            ret = AOS_E_CONFIG;  /* window exceeds the major frame */
        }
        else
        {
            prev_end = w->offset_us + w->duration_us;
        }
    }
    return ret;
}

static aos_ret_t check_ports_basic(const aos_module_config_t *cfg)
{
    aos_ret_t ret = AOS_OK;
    uint8_t i;
    uint8_t j;

    if ((cfg->port_count > AOS_MAX_PORTS) ||
        ((cfg->port_count > 0u) && (cfg->ports == NULL)))
    {
        ret = AOS_E_CONFIG;
    }

    for (i = 0u; (ret == AOS_OK) && (i < cfg->port_count); i++)
    {
        const aos_port_desc_t *p = &cfg->ports[i];

        if (!name_ok(p->name, AOS_MAX_PORT_NAME) ||
            (p->owner >= cfg->part_count) ||
            (p->max_msg_bytes == 0u) ||
            (p->max_msg_bytes > AOS_MAX_MSG_BYTES) ||
            ((p->kind == AOS_PORT_QUEUING) &&
             ((p->queue_depth == 0u) || (p->queue_depth > AOS_MAX_QUEUE_DEPTH))))
        {
            ret = AOS_E_CONFIG;
        }
        for (j = 0u; (ret == AOS_OK) && (j < i); j++)
        {
            if (strncmp(p->name, cfg->ports[j].name, AOS_MAX_PORT_NAME) == 0)
            {
                ret = AOS_E_CONFIG;  /* duplicate port name */
            }
        }
    }
    return ret;
}

/* --- lifecycle ------------------------------------------------------ */

aos_ret_t aos_kernel_init(const aos_module_config_t *cfg)
{
    aos_ret_t ret = AOS_OK;
    uint8_t i;

    if (cfg == NULL)
    {
        /* No configuration at all: nothing to consult for policy;
         * the module must not run. */
        aos_hal_safe_state((uint32_t)AOS_ERR_CONFIG);
        ret = AOS_E_CONFIG;
    }
    else
    {
        ret = check_partitions(cfg);
        if (ret == AOS_OK)
        {
            ret = check_schedule(cfg);
        }
        if (ret == AOS_OK)
        {
            ret = check_ports_basic(cfg);
        }
        if ((ret == AOS_OK) &&
            (cfg->maint_part != AOS_PART_ID_NONE) &&
            (cfg->maint_part >= cfg->part_count))
        {
            ret = AOS_E_CONFIG;
        }

        if (ret == AOS_OK)
        {
            aos_g_cfg = cfg;
            ret = aos_port_config_check();   /* routing needs pinned cfg */
        }

        if (ret == AOS_OK)
        {
            aos_port_reset_state();
            aos_hm_reset_state();
            aos_sched_reset_state();
            for (i = 0u; i < cfg->part_count; i++)
            {
                aos_g_mode[i] = AOS_PART_COLD_START;
                (void)memset(cfg->parts[i].region_base, 0,
                             cfg->parts[i].region_bytes);
            }
        }
        else
        {
            aos_g_cfg = NULL;
            if (cfg->hm_module.action[AOS_ERR_CONFIG] == AOS_HM_SAFE_STATE)
            {
                aos_hal_safe_state((uint32_t)AOS_ERR_CONFIG);
            }
        }
    }
    return ret;
}

const aos_module_config_t *aos_kernel_config(void)
{
    return aos_g_cfg;
}

/* --- partition mode services ---------------------------------------- */

aos_ret_t aos_partition_get_mode(aos_part_id_t part, aos_part_mode_t *mode_out)
{
    aos_ret_t ret = AOS_OK;

    if ((aos_g_cfg == NULL) || (mode_out == NULL))
    {
        ret = AOS_E_STATE;
    }
    else if (part >= aos_g_cfg->part_count)
    {
        ret = AOS_E_RANGE;
    }
    else
    {
        *mode_out = aos_g_mode[part];
    }
    return ret;
}

aos_ret_t aos_partition_set_mode(aos_part_id_t part, aos_part_mode_t mode)
{
    aos_ret_t ret = AOS_OK;
    aos_part_id_t caller = aos_partition_current();

    if (aos_g_cfg == NULL)
    {
        ret = AOS_E_STATE;
    }
    else if (part >= aos_g_cfg->part_count)
    {
        ret = AOS_E_RANGE;
    }
    else if ((caller != AOS_PART_ID_NONE) && (caller != part))
    {
        /* Applications may only change their own mode (AOS-HLR-011).
         * The kernel/HM (caller == NONE) may change any. */
        ret = AOS_E_ACCESS;
    }
    else
    {
        const aos_part_mode_t cur = aos_g_mode[part];
        bool legal;

        if (caller == AOS_PART_ID_NONE)
        {
            legal = true;            /* HM-directed transition */
        }
        else
        {
            legal = ((cur == AOS_PART_NORMAL) && (mode == AOS_PART_IDLE)) ||
                    (((cur == AOS_PART_COLD_START) ||
                      (cur == AOS_PART_WARM_START)) &&
                     (mode == AOS_PART_NORMAL));
        }

        if (legal)
        {
            aos_g_mode[part] = mode;
            if ((mode == AOS_PART_COLD_START) && (caller == AOS_PART_ID_NONE))
            {
                (void)memset(aos_g_cfg->parts[part].region_base, 0,
                             aos_g_cfg->parts[part].region_bytes);
            }
        }
        else
        {
            ret = AOS_E_STATE;
        }
    }
    return ret;
}

#ifdef AOS_HOST_BUILD
void aos_kernel_reset_for_test(void)
{
    aos_g_cfg = NULL;
    (void)memset(aos_g_mode, 0, sizeof(aos_g_mode));
    aos_port_reset_state();
    aos_hm_reset_state();
    aos_sched_reset_state();
}
#endif
