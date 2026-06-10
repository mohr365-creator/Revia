/*
 * Flight-control monitor (MON lane) tests. The monitor is exercised
 * both in the closed loop (no nuisance trips) and by direct injection
 * of invariant-violating COM outputs onto its input channels.
 *
 * @verifies AOS-SRS-160 (envelope invariants)
 * @verifies AOS-SRS-161 (trip latching and persistence)
 * @verifies AOS-SRS-162 (reversion / silent-COM detection)
 * @verifies AOS-SRS-163 (trip annunciation, once per episode)
 * @verifies AOS-HLR-042 (module instance identity)
 */
#include <string.h>

#include "ut.h"
#include "aos_internal.h"
#include "aos_hal.h"
#include "module_config.h"
#include "revia_msgs.h"
#include "mon_part.h"
#include "disp_part.h"
#include "hal_host.h"

static aos_port_id_t port(const char *name)
{
    aos_port_id_t p = 0u;

    UT_CHECK(aos_port_lookup(name, &p) == AOS_OK);
    return p;
}

/* Feed one frame of (adc, surf) onto the monitor's input channels and
 * step it, advancing the virtual clock by one nominal frame. */
static msg_mon_t mon_frame(const msg_adc_t *adc, const msg_surf_t *surf)
{
    msg_mon_t out;
    size_t len = 0u;
    bool fresh = false;

    hal_host_consume_us(50000u);
    if (adc != NULL)
    {
        UT_CHECK(aos_sampling_write(port("IOM_ADC_MON_OUT"),
                                    adc, sizeof(*adc)) == AOS_OK);
    }
    if (surf != NULL)
    {
        UT_CHECK(aos_sampling_write(port("FCS_SURF_MON_OUT"),
                                    surf, sizeof(*surf)) == AOS_OK);
    }

    aos_sched_set_current_for_test((aos_part_id_t)REVIA_PART_MON);
    UT_CHECK(mon_part_step(aos_hal_now_us()) == AOS_OK);
    aos_sched_set_current_for_test(AOS_PART_ID_NONE);

    (void)memset(&out, 0, sizeof(out));
    UT_CHECK(aos_sampling_read(port("DISP_MON_IN"), &out, sizeof(out),
                               &len, &fresh) == AOS_OK);
    return out;
}

static void mon_setup(void)
{
    aos_kernel_reset_for_test();
    hal_host_reset();
    UT_CHECK(aos_kernel_init(revia_module_config()) == AOS_OK);
    aos_sched_set_current_for_test((aos_part_id_t)REVIA_PART_MON);
    UT_CHECK(mon_part_init(AOS_PART_COLD_START) == AOS_OK);
    aos_sched_set_current_for_test(AOS_PART_ID_NONE);
}

static msg_adc_t adc_good(void)
{
    msg_adc_t adc;

    (void)memset(&adc, 0, sizeof(adc));
    adc.ias_kt = 250.0f;
    adc.alpha_deg = 3.0f;
    adc.valid = MSG_ADC_VALID_ALL;
    return adc;
}

static msg_surf_t surf_normal(float elev)
{
    msg_surf_t surf;

    (void)memset(&surf, 0, sizeof(surf));
    surf.elev_deg = elev;
    surf.law_mode = (uint8_t)FCS_LAW_NORMAL;
    return surf;
}

void suite_mon(void)
{
    msg_mon_t mon;
    msg_adc_t adc;
    msg_surf_t surf;
    uint32_t i;

    (void)printf("suite: flight-control monitor (MON lane)\n");

    UT_CASE("module instance identity required and exposed",
            "AOS-HLR-042");
    mon_setup();
    UT_CHECK(aos_kernel_config()->module_id != NULL);
    UT_CHECK(strcmp(aos_kernel_config()->module_id, "R100-FCC1-COM")
             == 0);

    UT_CASE("closed loop runs with no nuisance trip", "AOS-SRS-160");
    aos_kernel_reset_for_test();
    hal_host_reset();
    UT_CHECK(aos_kernel_init(revia_module_config()) == AOS_OK);
    for (i = 0u; i < 100u; i++)
    {
        UT_CHECK(aos_sched_run_major_frame() == AOS_OK);
    }
    {
        size_t len = 0u;
        bool fresh = false;

        (void)memset(&mon, 0, sizeof(mon));
        UT_CHECK(aos_sampling_read(port("DISP_MON_IN"), &mon,
                                   sizeof(mon), &len, &fresh) == AOS_OK);
        UT_CHECK(mon.trip == 0u);
        UT_CHECK(mon.violation_count == 0u);
    }

    UT_CASE("authority violation detected and latched after 3 frames",
            "AOS-SRS-161");
    mon_setup();
    adc = adc_good();
    surf = surf_normal(30.0f);          /* beyond ±25° authority */
    mon = mon_frame(&adc, &surf);
    UT_CHECK((mon.flags & MON_FLAG_AUTHORITY) != 0u);
    UT_CHECK(mon.trip == 0u);            /* 1st frame: not yet     */
    mon = mon_frame(&adc, &surf);
    UT_CHECK(mon.trip == 0u);            /* 2nd frame: not yet     */
    mon = mon_frame(&adc, &surf);
    UT_CHECK(mon.trip == 1u);            /* 3rd frame: latched     */

    UT_CASE("latched trip persists after data returns to normal",
            "AOS-SRS-161");
    /* Use the reversion violation here so recovery itself is benign
     * (a surface jump back to neutral would violate slew — which the
     * monitor would rightly flag). */
    mon_setup();
    adc = adc_good();
    adc.valid = 0u;                      /* invalid air data...    */
    surf = surf_normal(0.0f);            /* ...but law says NORMAL */
    mon = mon_frame(&adc, &surf);
    UT_CHECK((mon.flags & MON_FLAG_REVERSION) != 0u);
    mon = mon_frame(&adc, &surf);
    mon = mon_frame(&adc, &surf);
    UT_CHECK(mon.trip == 1u);
    adc = adc_good();                    /* condition clears       */
    mon = mon_frame(&adc, &surf);
    UT_CHECK(mon.flags == 0u);
    UT_CHECK(mon.trip == 1u);            /* still latched          */

    UT_CASE("warm restart preserves the trip; cold start clears it",
            "AOS-SRS-161");
    aos_sched_set_current_for_test((aos_part_id_t)REVIA_PART_MON);
    UT_CHECK(mon_part_init(AOS_PART_WARM_START) == AOS_OK);
    aos_sched_set_current_for_test(AOS_PART_ID_NONE);
    mon = mon_frame(&adc, &surf);
    UT_CHECK(mon.trip == 1u);
    aos_sched_set_current_for_test((aos_part_id_t)REVIA_PART_MON);
    UT_CHECK(mon_part_init(AOS_PART_COLD_START) == AOS_OK);
    aos_sched_set_current_for_test(AOS_PART_ID_NONE);
    mon = mon_frame(&adc, &surf);
    UT_CHECK(mon.trip == 0u);

    UT_CASE("transient violation (< 3 frames) does not trip",
            "AOS-SRS-161");
    mon_setup();
    adc = adc_good();
    adc.valid = 0u;
    surf = surf_normal(0.0f);
    mon = mon_frame(&adc, &surf);        /* violation frame 1      */
    mon = mon_frame(&adc, &surf);        /* violation frame 2      */
    adc = adc_good();                    /* recovers on frame 3    */
    mon = mon_frame(&adc, &surf);
    UT_CHECK(mon.flags == 0u);
    UT_CHECK(mon.trip == 0u);

    UT_CASE("slew violation detected", "AOS-SRS-160");
    mon_setup();
    adc = adc_good();
    surf = surf_normal(0.0f);
    mon = mon_frame(&adc, &surf);
    surf = surf_normal(10.0f);           /* 10° in 50 ms = 200°/s  */
    mon = mon_frame(&adc, &surf);
    UT_CHECK((mon.flags & MON_FLAG_SLEW) != 0u);

    UT_CASE("missed alpha protection detected", "AOS-SRS-160");
    mon_setup();
    adc = adc_good();
    adc.alpha_deg = 16.0f;               /* beyond never-exceed    */
    surf = surf_normal(-1.0f);           /* still commanding up    */
    mon = mon_frame(&adc, &surf);
    UT_CHECK((mon.flags & MON_FLAG_ALPHA) != 0u);

    UT_CASE("normal law on invalid air data flagged", "AOS-SRS-162");
    mon_setup();
    adc = adc_good();
    adc.valid = 0u;
    surf = surf_normal(0.0f);
    mon = mon_frame(&adc, &surf);
    UT_CHECK((mon.flags & MON_FLAG_REVERSION) != 0u);

    UT_CASE("silent COM output channel flagged", "AOS-SRS-162");
    mon_setup();
    adc = adc_good();
    mon = mon_frame(&adc, NULL);         /* COM never published    */
    UT_CHECK((mon.flags & MON_FLAG_NO_DATA) != 0u);

    UT_CASE("trip annunciated as warning exactly once per episode",
            "AOS-SRS-163");
    mon_setup();
    aos_sched_set_current_for_test((aos_part_id_t)REVIA_PART_DISP);
    UT_CHECK(disp_part_init(AOS_PART_COLD_START) == AOS_OK);
    aos_sched_set_current_for_test(AOS_PART_ID_NONE);
    adc = adc_good();
    surf = surf_normal(30.0f);
    for (i = 0u; i < 5u; i++)
    {
        mon = mon_frame(&adc, &surf);    /* latches on frame 3     */
    }
    UT_CHECK(mon.trip == 1u);
    {
        msg_eicas_t eicas;
        size_t len = 0u;
        bool got_trip_warning = false;
        uint32_t trip_warnings = 0u;

        /* Give DISP fresh surf data too, then step it repeatedly:
         * the trip warning must appear exactly once. */
        UT_CHECK(aos_sampling_write(port("FCS_SURF_OUT"), &surf,
                                    sizeof(surf)) == AOS_OK);
        aos_sched_set_current_for_test((aos_part_id_t)REVIA_PART_DISP);
        UT_CHECK(disp_part_step(aos_hal_now_us()) == AOS_OK);
        UT_CHECK(disp_part_step(aos_hal_now_us()) == AOS_OK);
        UT_CHECK(disp_part_step(aos_hal_now_us()) == AOS_OK);
        aos_sched_set_current_for_test(AOS_PART_ID_NONE);

        while (aos_queuing_receive(port("MAINT_EICAS_IN"), &eicas,
                                   sizeof(eicas), &len) == AOS_OK)
        {
            if (strcmp(eicas.text, "FLT CTRL MON TRIP") == 0)
            {
                got_trip_warning = true;
                trip_warnings++;
                UT_CHECK(eicas.level == (uint8_t)EICAS_WARNING);
            }
        }
        UT_CHECK(got_trip_warning);
        UT_CHECK(trip_warnings == 1u);
    }
}
