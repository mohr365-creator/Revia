# Revia Aircraft Software

Software for the Revia family of aircraft (R-50, R-100, and Phase 2
narrowbody program), intended for operation under 14 CFR Part 121 on
aircraft type-certificated under 14 CFR Part 25.

## Contents

| Directory | Description |
|---|---|
| [`revia-aos/`](revia-aos/) | Revia Aircraft Operating System — ARINC 653-style partitioned real-time operating system, developed to DO-178C Design Assurance Level A objectives |

## ⚠️ Certification status

**This software is NOT certified.** No software is "Part 25 certified" on
its own: certification applies to an *aircraft type design*, and airborne
software gains certification credit only as part of that type design,
through a process governed by the certifying authority (FAA/EASA) and
described in DO-178C / ED-12C (invoked via AC 20-115D).

This codebase is developed *toward* those objectives. It is structured so
that a real certification program could adopt it:

- **Plans** (PSAC, SDP, SVP, SCMP, SQAP) — `revia-aos/docs/certification/`
- **Standards** (requirements, design, code) — `revia-aos/docs/certification/`
- **Requirements with unique IDs** — `revia-aos/docs/requirements/`
- **Bidirectional traceability** — requirement IDs are tagged in source
  (`@satisfies`) and in tests (`@verifies`)
- **DAL A-oriented code**: no dynamic memory after initialization, no
  recursion, bounded loops, fixed-width types, single point of exit,
  defensive checks on all external inputs

Before any flight use, the software must complete (at minimum): full
MC/DC structural coverage analysis, requirements-based testing on the
target hardware, tool qualification (DO-330), stage-of-involvement
reviews with the authority, and conformity under an approved quality
system (14 CFR 21.137).

## Regulatory context

| Document | Role |
|---|---|
| 14 CFR Part 25 | Airworthiness standards: transport category airplanes |
| 14 CFR Part 121 | Operating requirements: domestic, flag, supplemental |
| 14 CFR 25.1309 / AC 25.1309-1B | Equipment, systems, and installations — safety assessment |
| DO-178C / ED-12C | Software considerations in airborne systems certification |
| DO-330 | Software tool qualification considerations |
| DO-297 | Integrated Modular Avionics (IMA) development and certification |
| ARINC 653 | Avionics application software standard interface (APEX) |
| ARINC 664 / AFDX | Avionics full-duplex switched Ethernet (target data network) |
| SAE ARP4754B / ARP4761A | Development and safety assessment of aircraft systems |
