/*
 * Module integration tests: the real R-100 configuration, all five
 * partitions, closed loop through kernel channels.
 *
 * @verifies AOS-SRS-150 (R-100 baseline module integration)
 * @verifies AOS-SRS-100 (IOM publishes validated air data each frame)
 * @verifies AOS-SRS-102 (validity cleared on acquisition fault)
 * @verifies AOS-SRS-114 (direct-law reversion, end to end)
 * @verifies AOS-SRS-120 (law-change EICAS annunciation, end to end)
 * @verifies AOS-SRS-130 (FMS navigation solution publication)
 * @verifies AOS-SRS-140 (maintenance fault data collection)
 */
#include <string.h>

#include "ut.h"
#include "aos_internal.h"
#include "module_config.h"
#include "maint_part.h"
#include "revia_msgs.h"
#include "hal_host.h"

/* Host-only view of the IOM region (prefix of iom_state_t). */
typedef struct
{
    float         pitch_deg;
    float         pitch_rate_dps;
    float         alpha_deg;
    float         elev_deg;
    aos_time_us_t t_prev_us;
    bool          have_prev;
    aos_port_id_t p_adc_out;
    aos_port_id_t p_pilot_out;
    aos_port_id_t p_surf_in;
    float         cmd_pitch_dps;
    bool          fail_adc;
} iom_view_t;

static msg_surf_t read_surf(void)
{
    msg_surf_t surf;
    aos_port_id_t p = 0u;
    size_t len = 0u;
    bool fresh = false;

    (void)memset(&surf, 0, sizeof(surf));
    UT_CHECK(aos_port_lookup("DISP_SURF_IN", &p) == AOS_OK);
    UT_CHECK(aos_sampling_read(p, &surf, sizeof(surf),
                               &len, &fresh) == AOS_OK);
    return surf;
}

void suite_integration(void)
{
    const aos_module_config_t *cfg = revia_module_config();
    iom_view_t *iom;
    uint32_t frame;

    (void)printf("suite: R-100 module integration\n");

    UT_CASE("baseline configuration accepted and started",
            "AOS-SRS-150");
    aos_kernel_reset_for_test();
    hal_host_reset();
    UT_CHECK(aos_kernel_init(cfg) == AOS_OK);
    iom = (iom_view_t *)cfg->parts[REVIA_PART_IOM].region_base;

    UT_CASE("all partitions reach NORMAL within two frames",
            "AOS-SRS-150");
    UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
    UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
    {
        aos_part_id_t p;

        for (p = 0u; p < (aos_part_id_t)REVIA_PART_COUNT; p++)
        {
            aos_part_mode_t mode = AOS_PART_IDLE;

            UT_CHECK(aos_partition_get_mode(p, &mode) == AOS_OK);
            UT_CHECK(mode == AOS_PART_NORMAL);
        }
    }

    UT_CASE("IOM publishes fresh, fully valid air data", "AOS-SRS-100");
    {
        msg_adc_t adc;
        aos_port_id_t p = 0u;
        size_t len = 0u;
        bool fresh = false;

        (void)memset(&adc, 0, sizeof(adc));
        UT_CHECK(aos_port_lookup("FCS_ADC_IN", &p) == AOS_OK);
        UT_CHECK(aos_sampling_read(p, &adc, sizeof(adc),
                                   &len, &fresh) == AOS_OK);
        UT_CHECK(fresh);
        UT_CHECK((adc.valid & MSG_ADC_VALID_ALL) == MSG_ADC_VALID_ALL);
    }

    UT_CASE("FMS publishes an advancing navigation solution",
            "AOS-SRS-130");
    {
        msg_nav_t nav1;
        msg_nav_t nav2;
        aos_port_id_t p = 0u;
        size_t len = 0u;
        bool fresh = false;

        (void)memset(&nav1, 0, sizeof(nav1));
        (void)memset(&nav2, 0, sizeof(nav2));
        UT_CHECK(aos_port_lookup("DISP_NAV_IN", &p) == AOS_OK);
        UT_CHECK(aos_sampling_read(p, &nav1, sizeof(nav1),
                                   &len, &fresh) == AOS_OK);
        UT_CHECK(fresh);
        UT_CHECK(nav1.wpt_id[0] != '\0');
        for (frame = 0u; frame < 20u; frame++)
        {
            UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
        }
        UT_CHECK(aos_sampling_read(p, &nav2, sizeof(nav2),
                                   &len, &fresh) == AOS_OK);
        UT_CHECK((nav1.lat_deg != nav2.lat_deg) ||
                 (nav1.lon_deg != nav2.lon_deg));
    }

    UT_CASE("air-data fault clears validity bits at the source",
            "AOS-SRS-102");
    {
        msg_adc_t adc;
        aos_port_id_t p = 0u;
        size_t len = 0u;
        bool fresh = false;

        iom->fail_adc = true;
        UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
        (void)memset(&adc, 0, sizeof(adc));
        UT_CHECK(aos_port_lookup("FCS_ADC_IN", &p) == AOS_OK);
        UT_CHECK(aos_sampling_read(p, &adc, sizeof(adc),
                                   &len, &fresh) == AOS_OK);
        UT_CHECK(adc.valid == 0u);
        iom->fail_adc = false;
        UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
    }

    UT_CASE("closed loop: doublet produces bounded, damped response",
            "AOS-SRS-150");
    iom->cmd_pitch_dps = 3.0f;
    for (frame = 0u; frame < 40u; frame++)
    {
        UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
    }
    UT_CHECK(iom->pitch_rate_dps > 0.5f);   /* responding nose-up   */
    iom->cmd_pitch_dps = 0.0f;
    for (frame = 0u; frame < 100u; frame++)
    {
        UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
    }
    UT_CHECK(iom->pitch_rate_dps < 1.0f);   /* settled              */
    UT_CHECK(iom->pitch_rate_dps > -1.0f);
    UT_CHECK(read_surf().law_mode == (uint8_t)FCS_LAW_NORMAL);

    UT_CASE("air-data loss reverts FCS to direct law end-to-end",
            "AOS-SRS-114");
    iom->fail_adc = true;
    for (frame = 0u; frame < 5u; frame++)
    {
        UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
    }
    UT_CHECK(read_surf().law_mode == (uint8_t)FCS_LAW_DIRECT);

    UT_CASE("recovery returns to normal law", "AOS-SRS-114");
    iom->fail_adc = false;
    for (frame = 0u; frame < 5u; frame++)
    {
        UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
    }
    UT_CHECK(read_surf().law_mode == (uint8_t)FCS_LAW_NORMAL);

    UT_CASE("law changes annunciated and recorded by maintenance",
            "AOS-SRS-120");
    {
        maint_summary_t sum;

        (void)memset(&sum, 0, sizeof(sum));
        UT_CHECK(maint_get_summary(&sum) == AOS_OK);
        /* DIRECT entry -> caution; NORMAL recovery -> advisory. */
        UT_CHECK(sum.eicas_caution >= 1u);
        UT_CHECK(sum.eicas_advisory >= 1u);
    }

    UT_CASE("no health-monitor events in nominal operation",
            "AOS-SRS-140");
    {
        uint32_t count = 99u;
        uint32_t lost = 99u;

        UT_CHECK(aos_hm_stats(&count, &lost) == AOS_OK);
        UT_CHECK(count == 0u);
        UT_CHECK(lost == 0u);
    }
}
