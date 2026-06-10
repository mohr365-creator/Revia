/*
 * Application-partition robustness tests, exercised by direct
 * invocation under an impersonated partition context against the real
 * R-100 configuration.
 *
 * @verifies AOS-SRS-101 (fixed-size typed messages within port limits)
 * @verifies AOS-SRS-116 (FCS failsafe on pilot command-path loss)
 * @verifies AOS-SRS-121 (single stale-data annunciation per episode)
 */
#include <string.h>

#include "ut.h"
#include "aos_internal.h"
#include "aos_hal.h"
#include "module_config.h"
#include "revia_msgs.h"
#include "fcs_part.h"
#include "disp_part.h"
#include "hal_host.h"

static msg_surf_t read_port_surf(const char *name)
{
    msg_surf_t surf;
    aos_port_id_t p = 0u;
    size_t len = 0u;
    bool fresh = false;

    (void)memset(&surf, 0, sizeof(surf));
    UT_CHECK(aos_port_lookup(name, &p) == AOS_OK);
    UT_CHECK(aos_sampling_read(p, &surf, sizeof(surf),
                               &len, &fresh) == AOS_OK);
    return surf;
}

void suite_apps(void)
{
    const aos_module_config_t *cfg = revia_module_config();

    (void)printf("suite: application partitions\n");

    UT_CASE("ICD messages all fit configured port sizes", "AOS-SRS-101");
    UT_CHECK(sizeof(msg_adc_t) <= AOS_MAX_MSG_BYTES);
    UT_CHECK(sizeof(msg_pilot_t) <= AOS_MAX_MSG_BYTES);
    UT_CHECK(sizeof(msg_surf_t) <= AOS_MAX_MSG_BYTES);
    UT_CHECK(sizeof(msg_nav_t) <= AOS_MAX_MSG_BYTES);
    UT_CHECK(sizeof(msg_eicas_t) <= AOS_MAX_MSG_BYTES);

    UT_CASE("FCS commands neutral surfaces when pilot path is lost",
            "AOS-SRS-116");
    aos_kernel_reset_for_test();
    hal_host_reset();
    UT_CHECK(aos_kernel_init(cfg) == AOS_OK);
    /* Run the FCS directly, before the IOM has ever published: both
     * input ports are empty -> command path lost. */
    aos_sched_set_current_for_test((aos_part_id_t)REVIA_PART_FCS);
    UT_CHECK(fcs_part_init(AOS_PART_COLD_START) == AOS_OK);
    UT_CHECK(fcs_part_step(aos_hal_now_us()) == AOS_OK);
    aos_sched_set_current_for_test(AOS_PART_ID_NONE);
    {
        const msg_surf_t surf = read_port_surf("DISP_SURF_IN");

        UT_CHECK(surf.law_mode == (uint8_t)FCS_LAW_FAILSAFE);
        UT_CHECK(surf.elev_deg == 0.0f);
    }

    UT_CASE("stale flight-control data annunciated exactly once",
            "AOS-SRS-121");
    aos_kernel_reset_for_test();
    hal_host_reset();
    UT_CHECK(aos_kernel_init(cfg) == AOS_OK);
    {
        msg_surf_t surf;
        msg_eicas_t eicas;
        aos_port_id_t p_surf_src = 0u;
        aos_port_id_t p_eicas_dst = 0u;
        size_t len = 0u;

        (void)memset(&surf, 0, sizeof(surf));
        surf.law_mode = (uint8_t)FCS_LAW_NORMAL;
        UT_CHECK(aos_port_lookup("FCS_SURF_OUT", &p_surf_src) == AOS_OK);
        UT_CHECK(aos_port_lookup("MAINT_EICAS_IN", &p_eicas_dst)
                 == AOS_OK);
        /* Kernel context seeds the surface channel, then lets it age
         * past the 120 ms refresh period. */
        UT_CHECK(aos_sampling_write(p_surf_src, &surf, sizeof(surf))
                 == AOS_OK);
        hal_host_consume_us(200000u);

        aos_sched_set_current_for_test((aos_part_id_t)REVIA_PART_DISP);
        UT_CHECK(disp_part_init(AOS_PART_COLD_START) == AOS_OK);
        UT_CHECK(disp_part_step(aos_hal_now_us()) == AOS_OK);
        UT_CHECK(disp_part_step(aos_hal_now_us()) == AOS_OK);
        UT_CHECK(disp_part_step(aos_hal_now_us()) == AOS_OK);
        aos_sched_set_current_for_test(AOS_PART_ID_NONE);

        /* Exactly one caution queued despite three stale frames. */
        UT_CHECK(aos_queuing_receive(p_eicas_dst, &eicas, sizeof(eicas),
                                     &len) == AOS_OK);
        UT_CHECK(eicas.level == (uint8_t)EICAS_CAUTION);
        UT_CHECK(aos_queuing_receive(p_eicas_dst, &eicas, sizeof(eicas),
                                     &len) == AOS_E_EMPTY);
    }
}
