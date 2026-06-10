# Plan for Software Aspects of Certification (PSAC)

Document: REV-AOS-PSAC-001 rev A — **DRAFT, not submitted**
Applicant: Revia (program: R-100 transport category airplane)
Authority: FAA (anticipated; EASA validation planned)

> Status note: this PSAC is a program-startup draft. It has not been
> submitted to or accepted by any authority. No certification credit
> exists for any artifact in this repository.

## 1. System overview

Revia AOS is the partitioned operating system for the R-100 integrated
modular avionics (IMA) modules, hosting applications from DAL A (flight
controls) to DAL D (maintenance). The aircraft will be type
certificated under 14 CFR Part 25 and operated under Part 121.
System development follows ARP4754B; safety assessment per ARP4761A and
AC 25.1309-1B; IMA roles and responsibilities per DO-297.

## 2. Software overview

| CSCI | DAL | Basis |
|---|---|---|
| AOS kernel (partitioning, scheduling, ports, HM) | A | Supports DAL A functions; failure could prevent continued safe flight |
| FCS partition (pitch control law) | A | Catastrophic failure condition (loss of control) |
| IOM partition (sensor/bus I/O) | A | Feeds FCS |
| DISP partition (EICAS/displays) | B | Hazardous (misleading primary flight information) |
| FMS partition | C | Major |
| MAINT partition | D | Minor |

DAL assignment derives from the functional hazard assessment
REV-FHA-001 (system level, outside this repository).

## 3. Certification considerations

- **Means of compliance**: DO-178C (AC 20-115D), DO-297 for the IMA
  platform, DO-330 for qualified tools.
- **Robust partitioning**: partitioning analysis per DO-297 §3.5 /
  CAST-2 will demonstrate that no hosted application can affect
  another's time, space, or resources (kernel HLRs 010–016).
- **Parameter data items**: the module configuration
  (`config/module_config.c`) is treated as a DO-178C §2.5.1 parameter
  data item with its own verification (validated structurally by
  AOS-HLR-040 logic plus configuration review).
- **Deactivated code**: host-simulation code (`AOS_HOST_BUILD`) is
  excluded from flight builds by construction; build evidence will
  show its absence from the executable object code.

## 4. Software life cycle

Processes per the SDP; verification per the SVP; configuration
management per the SCMP; quality assurance per the SQAP (all in this
directory). Transition criteria are defined in each plan.

## 5. Software life-cycle data

All DO-178C Table A data items will be produced. In-repository today:
requirements (AOS-SRS), design/architecture (architecture.md), source,
test cases/procedures/results (tests/, CI log), traceability
(trace-matrix.md, generated). To be produced on program launch:
PR/CR records in the program ALM, structural-coverage analyses (MC/DC
at DAL A), WCET analyses on target, data/control coupling analyses.

## 6. Schedule (program-level placeholder)

Stage of involvement reviews (SOI-1 planning … SOI-4 final) to be
proposed at program launch.

## 7. Additional considerations

- **Tool qualification**: the traceability generator
  (`tools/trace/gen_trace.py`) is a verification-support tool whose
  output is independently reviewed → TQL-5 criteria; the compiler for
  flight builds will be qualified or its output verified per DO-178C
  §4.4.2.
- **Previously developed software**: none; all software developed new
  for this program.
- **Multiple-version dissimilar software**: not claimed.
