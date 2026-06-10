/*
 * Revia AOS — requirements-based test runner (host build).
 */
#include <stdio.h>

#include "ut.h"

int ut_checks;
int ut_failures;

int main(void)
{
    (void)printf("Revia AOS requirements-based test suite\n");
    (void)printf("=======================================\n");

    suite_foundations();
    suite_config();
    suite_ports();
    suite_health();
    suite_sched();
    suite_fcs_law();
    suite_apps();
    suite_mon();
    suite_integration();

    (void)printf("=======================================\n");
    (void)printf("%d checks, %d failures\n", ut_checks, ut_failures);

    return (ut_failures == 0) ? 0 : 1;
}
