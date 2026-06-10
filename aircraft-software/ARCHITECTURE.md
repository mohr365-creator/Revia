# Revia Aircraft Systems Architecture — Solution Note

Document: REV-SYS-ARCH-001 rev A — engineering note for program scaling
Scope: whole-aircraft avionics & systems architecture; dissimilarity
strategy; means of compliance; supplier/COTS integration; certification
dashboard integration.

---

## 1. The core idea: one platform, many instances, dissimilar where it counts

Revia AOS is the **aircraft-wide computing platform** — the "nervous
system." It is developed once, as a single configuration-controlled
product, and **instantiated on every computing LRU on the airplane**
with a per-LRU configuration (the kernel enforces this: every instance
must declare its identity, e.g. `R100-FCC1-COM` — see AOS-HLR-042).
Application partitions (flight controls, ECS control, electrical load
management, displays…) are hosted on those instances per a module
integration plan, exactly as DO-297 IMA envisions.

This answers the "singular OS on several LRUs" question directly —
**yes, one OS product** — but with a critical caveat:

> **Replication is not dissimilarity.** Running identical software on
> five LRUs protects against *random hardware failure* (a 25.1309
> probabilistic argument). It provides **zero** protection against a
> *software development error*, because the error is faithfully
> replicated on every LRU. Development-error protection comes from
> DO-178C assurance first, and from **architectural dissimilarity**
> where a single residual error could be catastrophic.

### 1.1 The four-layer defense (what we do, layer by layer)

| Layer | Mechanism | Common mode addressed | Status in codebase |
|---|---|---|---|
| 1 | DO-178C DAL A process on COM software | Development errors (primary mitigation) | Process scaffolding in place (plans, trace, tests) |
| 2 | **COM/MON pairs**: dissimilar monitor software per channel | Residual COM design/coding error | **Implemented** — `revia-aos/partitions/mon/` |
| 3 | Dissimilar lanes: COM and MON on different processors + toolchains; channel pairs (FCC1/2/3) may mix lane hardware | Compiler, CPU errata, single-clock/power common modes | Deployment-level (see §2); enabled by the HAL boundary |
| 4 | Dissimilar backup path independent of the AOS (direct-law analog/simplex path through actuator electronics) | AOS kernel itself as a common-mode item | System-level design requirement REV-SYS-BKP-001 (open) |

**Layer 2 is now demonstrated in code.** The MON partition
(`partitions/mon/mon_main.c`) is the dissimilar lane of the flight
control COM/MON pair, governed by design rule **REV-DIS-001**:

- It shares **no code or design data** with the COM lane: it is written
  from the *safety invariants* ("the surface shall never exceed ±25°,
  never slew faster than 40°/s, must push when α exceeds 15°, must not
  claim normal law on invalid data"), not from the control-law design.
- It **checks rather than computes** — no gains, no integrators —
  so a conceptual error in the law design cannot be replicated in it.
- Its inputs arrive on **independently routed channels** (separate
  ports from the IOM), so a COM-side routing fault cannot blind it.
- A trip **latches** (3 consecutive violating frames), survives warm
  restart, annunciates as a warning, and on a flight channel removes
  that channel's actuator authority via the actuator-electronics
  enable discrete. Channel redundancy (another FCC) then carries on.
- On the aircraft, COM and MON additionally run on **dissimilar
  processors with dissimilar compilers** (e.g. COM: PowerPC e6500/
  qualified GCC; MON: Cortex-A53/qualified LLVM). The AOS HAL boundary
  (`aos_hal.h`) is exactly what makes this cheap: the same kernel and
  partition source builds per-lane with no design change.
- At program scale, MON-lane software is produced by a **separate team
  with managed independence** (no shared design reviews below the
  requirements level), which is auditable by SQA.

### 1.2 What about the AOS itself as a common mode?

The kernel is deliberately small (4 source files, no dynamic behavior)
to make the strongest available arguments practical:

- **Formal verification** of the partitioning invariants (DO-333
  formal-methods supplement gives certification credit). The static
  scheduler and table-driven HM were designed to be provable.
- Layer 4 (backup path that does not run the AOS) bounds the residual
  risk: even a kernel error leaves a flyable airplane.
- Single-source kernel on dissimilar hardware lanes mitigates
  toolchain/CPU common modes without forking the kernel itself.

We explicitly do **not** plan N-version programming of whole
applications (industry experience: cost is enormous and failure
independence is weaker than hoped); targeted monitor dissimilarity plus
a simple backup path is the proven pattern (A320/A330/B777 lineage).

---

## 2. LRU deployment map (R-100 baseline)

Every box below runs the same AOS executable + its own configuration.

| LRU (qty) | Lanes | Hosted partitions | DAL |
|---|---|---|---|
| FCC 1/2/3 (3) | COM + MON (dissimilar CPUs) | FCS laws (COM), FCS monitor (MON), autoflight servos | A |
| IOM cabinet L/R (2) | dual | sensor/bus acquisition, RDC gateways, data concentration | A |
| Display unit (4) + EICAS (1) | single | DISP partitions, symbol generators | B |
| FMS (2) | single | FMS, performance, nav DB loader | C |
| ECS controller (2) | dual | pack control, pressurization (auto+manual lanes), bleed mgmt | B |
| Electrical GCU (per gen, 4) + BPCU (2) | dual | power generation control, bus power transfer, load shed | A (load shed) / B |
| CMC (1) | single | MAINT, ACMS, data loader | D |
| Remote data concentrators (≈12) | — | thin AOS profile: I/O scan + AFDX end system only | per signal |

Effectors (actuators, valves, contactors, fuel pumps) attach to RDCs or
smart actuator electronics; **end-effector software** (ACE firmware,
valve controllers) is supplier-furnished to our DAL requirements and
integrated under the DO-297 supplier process — see §4.

## 3. The backbone: extending AOS ports across the airplane

The AOS port model is the aircraft-wide communication abstraction:

- **On-module**: ports are routed by the module configuration (today's
  implementation).
- **Off-module**: each sampling/queuing channel maps 1:1 onto an
  **ARINC 664 part 7 (AFDX) virtual link** — same publisher/subscriber
  semantics, same message contracts from the ICD, with the VL's BAG
  (bandwidth allocation gap) playing the role the schedule window plays
  on-module. Dual redundant switched networks (A/B) carry every VL.
- A **network gateway partition** (planned `partitions/net/`) owns each
  module's end system; applications never see the difference between a
  local and a remote port. This keeps partition code location-
  independent — partitions can be re-hosted between LRUs by
  configuration change, which is the IMA payoff.
- Determinism story stays uniform: time partitioning on the module
  (windows) + bandwidth partitioning on the wire (BAGs) + space
  partitioning in memory (MPU) = the three resources DO-297 robust
  partitioning must cover.

This is the "neural net" intent made concrete: every system —
flight controls, ECS, electrical, fuel, gear — publishes and consumes
typed messages on one partitioned fabric, with cross-functional
behavior (e.g. load-shed informing ECS pack shedding informing
generator loading) expressed as ordinary channel subscriptions in
reviewable configuration tables, not point-to-point wiring.

## 4. Make / buy and COTS supplier integration

Folder structure: `systems/ataXX-*/` — one folder per ATA-chapter
domain, each with its README stating function, DAL, make/buy, LRUs,
backbone interfaces, and compliance anchors. Buy-side items integrate
through three gates:

1. **TSO authorization** where a TSO exists (weather radar TSO-C63e,
   TCAS II TSO-C119e, transponder TSO-C112e, radio altimeter TSO-C87a,
   GNSS TSO-C145e/C146e…) — the article arrives with its own approval;
   we substantiate *installation* under the type certificate.
2. **Supplier DO-178C/DO-254 data** to the DAL we allocate (ARP4754B
   development assurance flows the requirement down); their SAS/HAS
   and problem-report history come into our certification data set.
3. **Interface containment**: every COTS box talks to the backbone
   through an RDC or gateway partition that enforces the ICD (range,
   rate, staleness checks at the boundary) — a COTS failure is a
   detected input failure, never a partition-level fault.

## 5. Means of compliance

Full regulation-by-regulation table: `docs/compliance/means-of-compliance.md`
(in `revia-aos/`). Summary of the established MoC set we anchor to:

- **AC 25.1309-1B** — system safety assessment methodology (with
  ARP4761A); drives DAL allocation and the dissimilarity decisions §1.
- **AC 20-115D** → DO-178C + supplements (DO-330 tools, DO-331 MBD,
  DO-332 OO, DO-333 formal methods).
- **AC 20-170** → DO-297 IMA modules and platform acceptance.
- **AC 20-174** → ARP4754A development assurance (program follows
  ARP4754B practices; AC reference governs).
- **AC 20-152A** → DO-254 for the FCC/IOM/RDC hardware and any custom
  airborne electronic hardware.
- **AC 20-148** — reusable software component: this is the AOS kernel's
  certification strategy. The kernel + its verification data are
  packaged once as an RSC and reused across every LRU instance and,
  later, across the R-50/R-100/narrowbody family — certify once,
  integrate many times.
- **§25.1319 + DO-326A/DO-356A/DO-355** — airworthiness security
  (network protection for the backbone, dataload, field-loadable
  software and maintenance ports).
- **AC 20-153B / DO-200B** — aeronautical databases (FMS nav data).
- Domain ACs as applicable: AC 25-11B (displays), AC 25.1329-1C
  (flight guidance), DO-160G (environmental qualification of every LRU).

## 6. Certification dashboard integration

The repository now emits a **machine-readable compliance export** for
the certification dashboard tooling:

- `revia-aos/tools/compliance/export_compliance.py` produces
  `revia-aos/docs/compliance/compliance-export.json` on every build
  (CI regenerates and fails on drift), containing:
  - every requirement (ID, text) from the SRS,
  - its implementing source files (`@satisfies`) and verifying test
    cases (`@verifies`, with case names),
  - the means-of-compliance table rows,
  - suite/check counts and trace-gap status.
- The dashboard ingests this JSON per build/baseline to render live
  compliance posture (objective coverage, trace gaps, test status)
  instead of hand-maintained spreadsheets. As the program adds
  structural-coverage and review records, they join the same export.

## 7. What stays open (honest list)

- Layer-4 backup path definition (REV-SYS-BKP-001) — system design.
- Network gateway partition + AFDX end-system model in code.
- ECS / electrical control partitions (folders and requirements stubs
  exist; control law content is domain work).
- FHA/PSSA artifacts — the DAL table in the PSAC is asserted, not yet
  derived in-repo.
- MC/DC coverage, WCET on target, tool qualification — as already
  listed in the SVP.
