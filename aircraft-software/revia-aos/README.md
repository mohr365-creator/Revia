# Revia AOS — Aircraft Operating System

A time- and space-partitioned real-time operating system kernel for the
Revia family of transport-category aircraft, following the ARINC 653
(APEX) partitioning model and developed toward DO-178C **Design
Assurance Level A** objectives.

> See [`../README.md`](../README.md) for certification status. This code
> is not certified and must not be flown.

## Architecture

Revia AOS implements robust partitioning per DO-297 / ARINC 653:

- **Time partitioning** — a fixed, statically configured *major frame*
  divided into partition windows. The schedule is decided at
  configuration time, never at runtime (`config/module_config.c`).
- **Space partitioning** — each partition declares a static memory
  region; the kernel enforces that ports and partition state never
  alias another partition's region. (On target hardware this is backed
  by the MMU/MPU; the host build checks bounds in software.)
- **Inter-partition communication** — ARINC 653 *sampling ports*
  (latest-value, with validity/age semantics) and *queuing ports*
  (FIFO, bounded). Channels are statically routed in the module
  configuration.
- **Health monitoring** — a three-level (process / partition / module)
  health monitor with statically configured responses: LOG, RESTART
  (warm/cold), IDLE the partition, or SAFE-STATE the module.
- **Deterministic time** — monotonic microsecond time base, watchdog
  per partition window, frame overrun detection.

```
aircraft-software/revia-aos/
  kernel/include/      public kernel API (aos_*.h)
  kernel/src/          kernel implementation
  config/              static module configuration (schedule, ports, HM tables)
  partitions/          hosted applications (one directory per partition)
    iom/               I/O manager — sensor/bus acquisition (DAL A)
    fcs/               flight control COM lane — pitch law (DAL A)
    mon/               flight control MON lane — dissimilar monitor (DAL A)
    disp/              display/EICAS data concentrator (DAL B)
    fms/               flight management system stub (DAL C)
    maint/             central maintenance computer (DAL D)
  tests/               requirements-based unit/integration tests (@verifies tags)
  tools/host_sim/      POSIX host simulator: runs the real kernel + partitions
  docs/                requirements, architecture, certification plans
```

## Partition schedule (default module configuration)

Major frame: **50 ms** (20 Hz). All windows statically allocated
(`config/module_config.c`):

| Window | Partition | Offset | Duration | DAL |
|---|---|---|---|---|
| 0 | IOM (I/O manager) | 0 ms | 5 ms | A |
| 1 | FCS (flight control, COM lane) | 5 ms | 10 ms | A |
| 2 | MON (flight control monitor, dissimilar lane) | 15 ms | 5 ms | A |
| 3 | DISP (display/EICAS) | 20 ms | 10 ms | B |
| 4 | FMS (flight mgmt) | 30 ms | 10 ms | C |
| 5 | MAINT (maintenance) | 40 ms | 5 ms | D |
| 6 | *kernel slack / HM* | 45 ms | 5 ms | — |

The MON window directly follows the COM window so every surface
command is checked against the envelope invariants in the frame it is
produced (COM/MON dissimilarity — see
[`../ARCHITECTURE.md`](../ARCHITECTURE.md) §1).

## Build & test (host simulation)

The kernel is target-independent; `tools/host_sim` provides a POSIX
port layer so the real kernel, configuration, and partitions run on a
development machine for requirements-based testing.

```bash
cd aircraft-software/revia-aos
make            # builds kernel + partitions + simulator + tests
make test       # runs the requirements-based test suite
make sim        # runs the host simulator for 200 major frames
python3 tools/trace/gen_trace.py   # regenerates the traceability matrix
```

Toolchain for flight builds (not included here) would be a qualified
compiler for the target (e.g. PowerPC e500/e6500 or Cortex-A53-based
flight computer) under DO-330 tool qualification where credit is taken.

## Coding standard

`docs/certification/software-code-standard.md`. Highlights (MISRA
C:2012-aligned, DAL A profile):

- C99, freestanding-compatible; no `malloc`/`free` after init (none at all in-kernel)
- No recursion; all loops statically bounded
- Fixed-width types only (`uint32_t`, …); no implicit conversions
- All functions single-exit; all return codes checked
- No interrupts disabled longer than one schedule tick
- Every kernel source item tagged `@satisfies <REQ-ID>`; every test
  tagged `@verifies <REQ-ID>`
