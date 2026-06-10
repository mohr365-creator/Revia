# Software Verification Plan (SVP)

Document: REV-AOS-SVP-001 rev A — DRAFT

## 1. Verification methods

| Objective | Method |
|---|---|
| Requirements correctness/consistency | Peer review against SRS standard |
| Code compliance | Review + static analysis against code standard |
| HLR compliance of code | Requirements-based testing (tests/, `@verifies` tags) |
| Robust partitioning | Partitioning analysis (DO-297) + fault-injection tests (HM suites) |
| Timing | Host: virtual-clock determinism tests; Target: WCET analysis + on-target window measurements |
| Structural coverage (DAL A) | Statement, decision, MC/DC on target build — **not yet performed** |
| Data/control coupling | Coupling analysis — **not yet performed** |

## 2. Test environment

Host verification build runs the real kernel/partitions on a virtual
clock (`tools/host_sim/hal_host.c`), making timing tests exact and
repeatable. `make test` executes the full requirements-based suite;
any failure fails the build. Target testing (program launch) reruns
the identical suite on the flight computer through the target HAL,
plus hardware-specific cases (MPU traps, watchdog hardware, bus I/O).

## 3. Test case rules

- Every test case names the requirement(s) it verifies (`@verifies`).
- Normal-range and robustness (abnormal-input) cases per DO-178C
  §6.4.2: invalid parameters, out-of-range IDs, saturated queues/logs,
  timing overruns, configuration faults are all exercised.
- Independence: DAL A verification activities are performed/reviewed
  by persons other than the developers of the item (program-launch
  staffing; not demonstrable in-repository).

## 4. Current status

Host suite: 6 suites, 489 checks, 0 failures (see CI output).
Coverage analysis, WCET, and on-target campaigns: open program work.
