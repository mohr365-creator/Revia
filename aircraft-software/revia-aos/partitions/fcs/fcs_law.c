/*
 * Revia FCS — pitch-axis control law implementation (DAL A)
 *
 * Rate-command/attitude-hold inner loop with angle-of-attack
 * protection. All outputs are clamped to certified envelope constants;
 * the law is total (defined for every input, including invalid data).
 *
 * @satisfies AOS-SRS-110 (pitch-rate command tracking)
 * @satisfies AOS-SRS-111 (surface authority limit)
 * @satisfies AOS-SRS-112 (surface slew limit)
 * @satisfies AOS-SRS-113 (alpha protection)
 * @satisfies AOS-SRS-114 (direct law on invalid data)
 * @satisfies AOS-SRS-115 (integrator anti-windup)
 */
#include "fcs_law.h"

/* Loop gains (REV-FCS-GAIN-001, frozen for this baseline). */
#define KP            0.80f   /* proportional, deg surface per deg/s err */
#define KI            0.30f   /* integral                                */
#define K_ALPHA       2.50f   /* protection: deg surface per deg over    */
#define INTEG_LIMIT   8.0f    /* anti-windup clamp [deg]                 */
#define K_DIRECT      1.20f   /* direct-law stick-to-surface gain        */

static float clampf(float v, float lo, float hi)
{
    float r = v;

    if (v < lo)
    {
        r = lo;
    }
    else if (v > hi)
    {
        r = hi;
    }
    else
    {
        /* in range */
    }
    return r;
}

void fcs_law_reset(fcs_law_state_t *st)
{
    st->integ_deg     = 0.0f;
    st->elev_prev_deg = 0.0f;
}

fcs_law_out_t fcs_law_step(const fcs_law_in_t *in,
                           fcs_law_state_t *st, float dt_s)
{
    fcs_law_out_t out;
    const float dt = clampf(dt_s, 0.001f, 0.1f);
    float elev;

    out.alpha_prot_active = false;

    if (!in->data_valid)
    {
        /* AOS-SRS-114: degraded sensors -> direct law, integrator
         * frozen and washed out so reversion is transient-free. */
        out.mode = FCS_LAW_DIRECT;
        st->integ_deg = 0.0f;
        elev = -K_DIRECT *
               clampf(in->pitch_cmd_dps, -FCS_CMD_LIMIT_DPS,
                      FCS_CMD_LIMIT_DPS);
    }
    else
    {
        float cmd = clampf(in->pitch_cmd_dps, -FCS_CMD_LIMIT_DPS,
                           FCS_CMD_LIMIT_DPS);

        out.mode = FCS_LAW_NORMAL;

        /* AOS-SRS-113: above the protection onset, the law commands
         * nose-down proportional to alpha excursion, overriding any
         * nose-up pilot demand; pilot retains nose-down authority. */
        if (in->alpha_deg > FCS_ALPHA_PROT_DEG)
        {
            const float over = in->alpha_deg - FCS_ALPHA_PROT_DEG;
            const float prot_cmd = -K_ALPHA * over;

            out.alpha_prot_active = true;
            if (prot_cmd < cmd)
            {
                cmd = prot_cmd;
            }
            st->integ_deg = 0.0f;   /* no integration against protection */
        }

        {
            const float err = cmd - in->pitch_rate_dps;

            if (!out.alpha_prot_active)
            {
                /* AOS-SRS-115: integrate only inside the envelope,
                 * clamped (anti-windup). */
                st->integ_deg = clampf(st->integ_deg + (KI * err * dt),
                                       -INTEG_LIMIT, INTEG_LIMIT);
            }
            /* Sign convention: positive elevator = trailing edge down
             * = nose down, so the surface opposes positive rate error
             * with a negative deflection. */
            elev = -((KP * err) + st->integ_deg);
        }
    }

    /* AOS-SRS-112: slew limit. */
    {
        const float max_step = FCS_ELEV_RATE_DPS * dt;

        elev = clampf(elev, st->elev_prev_deg - max_step,
                      st->elev_prev_deg + max_step);
    }

    /* AOS-SRS-111: authority limit — applied last, unconditionally. */
    elev = clampf(elev, -FCS_ELEV_LIMIT_DEG, FCS_ELEV_LIMIT_DEG);

    st->elev_prev_deg = elev;
    out.elev_deg = elev;
    return out;
}
