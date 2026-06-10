/*
 * Revia AOS — minimal requirements-based test harness
 *
 * Every test case carries a @verifies tag naming the requirement(s)
 * it covers; the traceability matrix (docs/requirements/trace-matrix.md)
 * is generated from these tags.
 */
#ifndef UT_H
#define UT_H

#include <stdio.h>

extern int ut_checks;
extern int ut_failures;

#define UT_CASE(name, verifies) \
    (void)printf("  CASE %-44s [%s]\n", (name), (verifies))

#define UT_CHECK(cond) \
    do { \
        ut_checks++; \
        if (!(cond)) { \
            ut_failures++; \
            (void)printf("    FAIL %s:%d  %s\n", \
                         __FILE__, __LINE__, #cond); \
        } \
    } while (0)

/* Suite entry points. */
void suite_foundations(void);
void suite_config(void);
void suite_ports(void);
void suite_health(void);
void suite_sched(void);
void suite_fcs_law(void);
void suite_apps(void);
void suite_mon(void);
void suite_integration(void);

#endif /* UT_H */
