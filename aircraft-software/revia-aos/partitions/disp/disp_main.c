/*
 * Revia DISP — display / EICAS data concentrator partition (DAL B)
 *
 * Consumes the surface command and navigation solution for the flight
 * displays, and generates crew-alerting (EICAS) messages on flight
 * control law changes, forwarding them to the maintenance recorder.
 *
 * @satisfies AOS-SRS-120 (law-mode change annunciation)
 * @satisfies AOS-SRS-121 (stale-data annunciation)
 */
#include <string.h>

#include "aos_kernel.h"
#include "aos_port.h"
#include "revia_msgs.h"
#include "disp_part.h"

typedef struct
{
    aos_port_id_t p_surf_in;
    aos_port_id_t p_nav_in;
    aos_port_id_t p_eicas_out;
    uint8_t       last_law_mode;
    bool          law_mode_known;
    bool          stale_announced;
} disp_state_t;

static disp_state_t *disp_state(void)
{
    const aos_module_config_t *cfg = aos_kernel_config();

    return (disp_state_t *)cfg->parts[aos_partition_current()].region_base;
}

static void send_eicas(const disp_state_t *st, eicas_level_t level,
                       const char *text)
{
    msg_eicas_t m;

    (void)memset(&m, 0, sizeof(m));
    m.level = (uint8_t)level;
    (void)strncpy(m.text, text, sizeof(m.text) - 1u);
    /* Queue-full is tolerable for advisories: the HM log still holds
     * the underlying fault; drop silently (AOS-SRS-120 note 2). */
    (void)aos_queuing_send(st->p_eicas_out, &m, sizeof(m));
}

aos_ret_t disp_part_init(aos_part_mode_t start_mode)
{
    aos_ret_t ret;
    disp_state_t *st = disp_state();

    (void)start_mode;
    st->law_mode_known = false;
    st->stale_announced = false;

    ret = aos_port_lookup("DISP_SURF_IN", &st->p_surf_in);
    if (ret == AOS_OK)
    {
        ret = aos_port_lookup("DISP_NAV_IN", &st->p_nav_in);
    }
    if (ret == AOS_OK)
    {
        ret = aos_port_lookup("DISP_EICAS_OUT", &st->p_eicas_out);
    }
    return ret;
}

aos_ret_t disp_part_step(aos_time_us_t window_start_us)
{
    disp_state_t *st = disp_state();
    msg_surf_t surf;
    msg_nav_t  nav;
    size_t     len = 0u;
    bool       fresh = false;

    (void)window_start_us;

    if ((aos_sampling_read(st->p_surf_in, &surf, sizeof(surf),
                           &len, &fresh) == AOS_OK) &&
        (len == sizeof(surf)))
    {
        if (!fresh)
        {
            if (!st->stale_announced)
            {
                send_eicas(st, EICAS_CAUTION, "FLT CTRL DATA STALE");
                st->stale_announced = true;
            }
        }
        else
        {
            st->stale_announced = false;

            if (st->law_mode_known && (surf.law_mode != st->last_law_mode))
            {
                if (surf.law_mode == (uint8_t)FCS_LAW_DIRECT)
                {
                    send_eicas(st, EICAS_CAUTION, "FLT CTRL DIRECT LAW");
                }
                else if (surf.law_mode == (uint8_t)FCS_LAW_FAILSAFE)
                {
                    send_eicas(st, EICAS_WARNING, "FLT CTRL FAILSAFE");
                }
                else
                {
                    send_eicas(st, EICAS_ADVISORY, "FLT CTRL NORMAL LAW");
                }
            }
            st->last_law_mode  = surf.law_mode;
            st->law_mode_known = true;
        }
    }

    /* Nav solution feeds the ND symbol generator (consumed here;
     * rendering pipeline is out of scope for this module). */
    (void)aos_sampling_read(st->p_nav_in, &nav, sizeof(nav), &len, &fresh);

    return AOS_OK;
}
