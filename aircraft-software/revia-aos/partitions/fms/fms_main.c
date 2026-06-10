/*
 * Revia FMS — flight management partition (DAL C)
 *
 * Baseline stub: advances a great-circle-free linear track through a
 * small static flight plan and publishes the navigation solution.
 * (LNAV/VNAV guidance, performance, and the navigation database
 * loader are separate CSCIs in the program plan, REV-SDP §3.2.)
 *
 * @satisfies AOS-SRS-130 (navigation solution publication)
 */
#include <string.h>

#include "aos_kernel.h"
#include "aos_port.h"
#include "revia_msgs.h"
#include "fms_part.h"

typedef struct
{
    double  lat_deg;
    double  lon_deg;
    char    id[8];
} fms_wpt_t;

/* Static demonstration plan: severed regional route, MSP area. */
static const fms_wpt_t k_plan[] =
{
    { 44.8848, -93.2223, "KMSP" },
    { 45.5440, -94.0520, "KSTC" },
    { 46.8369, -92.1936, "KDLH" }
};
#define FMS_PLAN_LEN  (sizeof(k_plan) / sizeof(k_plan[0]))
#define FMS_GS_KT     280.0f
#define FMS_DEG_PER_S (FMS_GS_KT / 3600.0f / 60.0f)  /* ~deg lat per s */

typedef struct
{
    double        lat_deg;
    double        lon_deg;
    uint32_t      active_wpt;
    aos_time_us_t t_prev_us;
    bool          have_prev;
    aos_port_id_t p_nav_out;
} fms_state_t;

static fms_state_t *fms_state(void)
{
    const aos_module_config_t *cfg = aos_kernel_config();

    return (fms_state_t *)cfg->parts[aos_partition_current()].region_base;
}

aos_ret_t fms_part_init(aos_part_mode_t start_mode)
{
    fms_state_t *st = fms_state();

    (void)start_mode;
    st->lat_deg    = k_plan[0].lat_deg;
    st->lon_deg    = k_plan[0].lon_deg;
    st->active_wpt = 1u;
    st->have_prev  = false;

    return aos_port_lookup("FMS_NAV_OUT", &st->p_nav_out);
}

aos_ret_t fms_part_step(aos_time_us_t window_start_us)
{
    fms_state_t *st = fms_state();
    msg_nav_t nav;
    double dt_s;

    if (st->have_prev && (window_start_us > st->t_prev_us))
    {
        dt_s = (double)(window_start_us - st->t_prev_us) * 1.0e-6;
    }
    else
    {
        dt_s = 0.05;
    }
    st->t_prev_us = window_start_us;
    st->have_prev = true;

    /* Linear step toward the active waypoint (flat-earth stub). */
    if (st->active_wpt < FMS_PLAN_LEN)
    {
        const fms_wpt_t *w = &k_plan[st->active_wpt];
        const double dlat = w->lat_deg - st->lat_deg;
        const double dlon = w->lon_deg - st->lon_deg;
        const double dist = (dlat * dlat) + (dlon * dlon);
        const double step = (double)FMS_DEG_PER_S * dt_s;

        if (dist < (step * step))
        {
            st->lat_deg = w->lat_deg;
            st->lon_deg = w->lon_deg;
            st->active_wpt++;
        }
        else if (dist > 0.0)
        {
            /* Bounded Newton-free normalization: scale by 1/sqrt via
             * two-iteration approximation is overkill here; the stub
             * moves along the dominant axis proportionally. */
            const double mag = (dlat < 0.0 ? -dlat : dlat) +
                               (dlon < 0.0 ? -dlon : dlon);

            st->lat_deg += step * (dlat / mag);
            st->lon_deg += step * (dlon / mag);
        }
        else
        {
            st->active_wpt++;
        }
    }

    (void)memset(&nav, 0, sizeof(nav));
    nav.lat_deg = st->lat_deg;
    nav.lon_deg = st->lon_deg;
    nav.gs_kt   = FMS_GS_KT;
    nav.trk_deg = 0.0f;
    if (st->active_wpt < FMS_PLAN_LEN)
    {
        (void)strncpy(nav.wpt_id, k_plan[st->active_wpt].id,
                      sizeof(nav.wpt_id) - 1u);
    }
    else
    {
        (void)strncpy(nav.wpt_id, "----", sizeof(nav.wpt_id) - 1u);
    }

    return aos_sampling_write(st->p_nav_out, &nav, sizeof(nav));
}
