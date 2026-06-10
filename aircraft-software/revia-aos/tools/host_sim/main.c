/*
 * Revia AOS — host simulator
 *
 * Runs the real kernel, configuration, and partitions on a virtual
 * clock; injects a pilot pitch doublet and an air-data failure, and
 * prints the closed-loop response plus health-monitor/maintenance
 * summaries. Verification support only — not flight software.
 */
#include <stdio.h>
#include <string.h>

#include "aos_kernel.h"
#include "module_config.h"
#include "iom_part.h"
#include "maint_part.h"
#include "hal_host.h"
#include "revia_msgs.h"

int main(void)
{
    const aos_module_config_t *cfg = revia_module_config();
    iom_state_t *iom;
    uint32_t frame;
    int rc = 0;

    hal_host_reset();

    if (aos_kernel_init(cfg) != AOS_OK)
    {
        (void)fprintf(stderr, "configuration rejected\n");
        rc = 1;
    }
    else
    {
        aos_port_id_t p_surf = 0u;

        (void)aos_port_lookup("DISP_SURF_IN", &p_surf);
        iom = (iom_state_t *)cfg->parts[REVIA_PART_IOM].region_base;

        (void)printf("Revia AOS host simulation — R-100 baseline, "
                     "major frame %u us\n", (unsigned)cfg->major_frame_us);
        (void)printf("%6s %10s %10s %10s %6s %5s\n",
                     "frame", "q[deg/s]", "alpha[deg]", "elev[deg]",
                     "law", "prot");

        for (frame = 0u; frame < 200u; frame++)
        {
            /* Scenario: pitch-up doublet frames 20-60, then release;
             * air-data failure frames 120-160 (expect DIRECT law). */
            iom->cmd_pitch_dps =
                ((frame >= 20u) && (frame < 60u)) ? 3.0f : 0.0f;
            iom->fail_adc = ((frame >= 120u) && (frame < 160u));

            if (aos_sched_run_major_frame() != AOS_OK)
            {
                (void)fprintf(stderr,
                              "frame %u: major frame overrun\n",
                              (unsigned)frame);
                rc = 1;
                break;
            }

            if ((frame % 20u) == 0u)
            {
                msg_surf_t surf;
                size_t len = 0u;
                bool fresh = false;

                (void)memset(&surf, 0, sizeof(surf));
                /* Kernel context may read any port (host inspection). */
                (void)aos_sampling_read(p_surf, &surf, sizeof(surf),
                                        &len, &fresh);
                (void)printf("%6u %10.3f %10.3f %10.3f %6u %5u\n",
                             (unsigned)frame,
                             (double)iom->pitch_rate_dps,
                             (double)iom->alpha_deg,
                             (double)iom->elev_deg,
                             (unsigned)surf.law_mode,
                             (unsigned)surf.alpha_prot);
            }
        }

        {
            maint_summary_t sum;
            uint32_t hm_count = 0u;
            uint32_t hm_lost = 0u;

            (void)memset(&sum, 0, sizeof(sum));
            (void)maint_get_summary(&sum);
            (void)aos_hm_stats(&hm_count, &hm_lost);

            (void)printf("\nmaintenance summary after %u frames:\n",
                         (unsigned)aos_sched_frame_count());
            (void)printf("  EICAS  advisory=%u caution=%u warning=%u\n",
                         (unsigned)sum.eicas_advisory,
                         (unsigned)sum.eicas_caution,
                         (unsigned)sum.eicas_warning);
            (void)printf("  HM     events=%u lost=%u (maint saw %u)\n",
                         (unsigned)hm_count, (unsigned)hm_lost,
                         (unsigned)sum.hm_events_seen);
        }
    }
    return rc;
}
