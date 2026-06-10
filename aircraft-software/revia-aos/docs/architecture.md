# Revia AOS — Software Design Description (architecture)

Document: REV-AOS-SDD-001 rev A

## 1. Static architecture

```
 ┌────────────────────────── module (one flight computer) ─────────────────────────┐
 │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐                │
 │  │ IOM (A) │  │ FCS (A) │  │ DISP (B)│  │ FMS (C) │  │MAINT (D)│   partitions   │
 │  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘                │
 │  ─────┴────────────┴── APEX-style services ──┴────────────┴─────                │
 │  ┌──────────────────────────────────────────────────────────────┐               │
 │  │ kernel: scheduler · ports · health monitor · partition mgmt  │               │
 │  └──────────────────────────────┬───────────────────────────────┘               │
 │  ┌──────────────────────────────┴───────────────────────────────┐               │
 │  │ HAL: clock · watchdog · MPU · safe-state                     │               │
 │  └──────────────────────────────────────────────────────────────┘               │
 └──────────────────────────────────────────────────────────────────────────────────┘
```

Data flow (all via statically routed kernel channels):

```
IOM ──ADC──────▶ FCS ──SURF──────▶ DISP ──EICAS(Q)──▶ MAINT
IOM ──PILOT────▶ FCS ──SURF_MODEL▶ IOM   (host model loop-closure)
FMS ──NAV──────▶ DISP
```

## 2. Timing

Major frame 50 ms (20 Hz). Window budgets (module_config.c) include
≥30 % margin over host-measured execution and a 5 ms kernel slack
window; flight WCET substantiation is open program work. Overruns:
window → partition-level HM (restart policy), frame → module-level HM.

## 3. Failure management

Failure handling is table-driven (HM policies in the configuration),
so behaviour is reviewable as data rather than scattered logic:
flight-critical partitions restart (warm, then cold via escalation
policy at integration), DISP restarts without module impact, FMS may
idle, MAINT idles on any fault. Unattributable faults and
configuration faults drive the module safe state, which the HAL is
required to make terminal (surfaces to fail-safe; redundant channel
assumes control — channel redundancy management is the flight-control
system architecture's responsibility, outside this module).

## 4. Design decisions of record

- **Cyclic executive, no priorities** — worst-case behaviour is fully
  determined by a reviewable table; removes an entire class of
  scheduling-analysis obligations (DO-178C §6.3.3 timing).
- **Storage at the channel source, access via descriptor peer** — one
  copy per channel, no allocation, O(1) every operation.
- **First-fault-preserving HM log** — saturation keeps the earliest
  events: the first fault is the diagnostic one.
- **Single `step()` per window** (no intra-partition processes in this
  baseline) — ARINC 653 process scheduling can be layered later
  without kernel changes; baseline keeps DAL A surface minimal.
- **Host build runs the real kernel on a virtual clock** — timing
  tests are exact (no flake), and the identical suite reruns on target.
