/*
 * FCS pitch-law unit tests (pure function, no kernel).
 *
 * @verifies AOS-SRS-110 (rate-command tracking sense)
 * @verifies AOS-SRS-111 (surface authority limit)
 * @verifies AOS-SRS-112 (surface slew limit)
 * @verifies AOS-SRS-113 (alpha protection)
 * @verifies AOS-SRS-114 (direct law on invalid data)
 * @verifies AOS-SRS-115 (integrator anti-windup)
 */
#include <math.h>

#include "ut.h"
#include "fcs_law.h"

#define DT 0.05f

static fcs_law_in_t in_level(void)
{
    fcs_law_in_t in;

    in.pitch_cmd_dps  = 0.0f;
    in.pitch_rate_dps = 0.0f;
    in.alpha_deg      = 3.0f;
    in.data_valid     = true;
    return in;
}

void suite_fcs_law(void)
{
    fcs_law_state_t st;
    fcs_law_in_t in;
    fcs_law_out_t out;
    int i;

    (void)printf("suite: FCS pitch law\n");

    UT_CASE("nose-up command drives elevator trailing-edge up",
            "AOS-SRS-110");
    fcs_law_reset(&st);
    in = in_level();
    in.pitch_cmd_dps = 5.0f;
    out = fcs_law_step(&in, &st, DT);
    UT_CHECK(out.elev_deg < 0.0f);
    UT_CHECK(out.mode == FCS_LAW_NORMAL);

    UT_CASE("zero error holds surface near neutral", "AOS-SRS-110");
    fcs_law_reset(&st);
    in = in_level();
    in.pitch_cmd_dps  = 2.0f;
    in.pitch_rate_dps = 2.0f;
    out = fcs_law_step(&in, &st, DT);
    UT_CHECK(fabsf(out.elev_deg) < 0.5f);

    UT_CASE("surface never exceeds authority limit", "AOS-SRS-111");
    fcs_law_reset(&st);
    in = in_level();
    in.pitch_cmd_dps  = 10.0f;
    in.pitch_rate_dps = -50.0f;   /* huge error */
    for (i = 0; i < 100; i++)
    {
        out = fcs_law_step(&in, &st, DT);
        UT_CHECK(fabsf(out.elev_deg) <= FCS_ELEV_LIMIT_DEG);
    }
    UT_CHECK(fabsf(out.elev_deg) == FCS_ELEV_LIMIT_DEG);

    UT_CASE("surface motion respects slew limit", "AOS-SRS-112");
    fcs_law_reset(&st);
    in = in_level();
    in.pitch_cmd_dps = 10.0f;
    out = fcs_law_step(&in, &st, DT);
    UT_CHECK(fabsf(out.elev_deg) <= (FCS_ELEV_RATE_DPS * DT) + 1.0e-4f);

    UT_CASE("alpha protection overrides nose-up demand", "AOS-SRS-113");
    fcs_law_reset(&st);
    in = in_level();
    in.pitch_cmd_dps = 10.0f;            /* pilot pulling   */
    in.alpha_deg = FCS_ALPHA_PROT_DEG + 2.0f;
    for (i = 0; i < 50; i++)
    {
        out = fcs_law_step(&in, &st, DT);
    }
    UT_CHECK(out.alpha_prot_active);
    UT_CHECK(out.elev_deg > 0.0f);       /* trailing-edge down = nose down */

    UT_CASE("protection inactive below onset", "AOS-SRS-113");
    fcs_law_reset(&st);
    in = in_level();
    in.alpha_deg = FCS_ALPHA_PROT_DEG - 0.5f;
    out = fcs_law_step(&in, &st, DT);
    UT_CHECK(!out.alpha_prot_active);

    UT_CASE("invalid data reverts to direct law", "AOS-SRS-114");
    fcs_law_reset(&st);
    in = in_level();
    in.data_valid = false;
    in.pitch_cmd_dps = 4.0f;
    out = fcs_law_step(&in, &st, DT);
    UT_CHECK(out.mode == FCS_LAW_DIRECT);
    UT_CHECK(out.elev_deg < 0.0f);       /* same command sense */

    UT_CASE("integrator clamps under sustained error", "AOS-SRS-115");
    fcs_law_reset(&st);
    in = in_level();
    in.pitch_cmd_dps  = 10.0f;
    in.pitch_rate_dps = 0.0f;
    for (i = 0; i < 2000; i++)
    {
        out = fcs_law_step(&in, &st, DT);
    }
    /* With anti-windup, releasing the command must unwind quickly:
     * within 2 s the surface crosses back through neutral. */
    in.pitch_cmd_dps  = 0.0f;
    in.pitch_rate_dps = 0.0f;
    for (i = 0; i < 40; i++)
    {
        out = fcs_law_step(&in, &st, DT);
    }
    UT_CHECK(fabsf(out.elev_deg) < FCS_ELEV_LIMIT_DEG);
    UT_CHECK(fabsf(st.integ_deg) <= 8.0f + 1.0e-4f);
}
