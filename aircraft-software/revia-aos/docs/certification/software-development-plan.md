# Software Development Plan (SDP)

Document: REV-AOS-SDP-001 rev A — DRAFT

## 1. Standards

- Requirements standard: REV-AOS-SRS conventions (unique immutable IDs,
  "shall" form, one testable assertion per requirement).
- Design standard: architecture.md conventions (static architecture,
  no dynamic structural behaviour, explicit data/control coupling).
- Code standard: `software-code-standard.md` (MISRA C:2012-aligned
  DAL A profile).

## 2. Life cycle

Waterfall-with-iterations per CSCI: requirements → design → code →
integration, with verification running continuously against the
baselined artifacts. Transition criteria:

| Into | Criteria |
|---|---|
| Design | HLRs reviewed, allocated to CSCIs, FHA-consistent DALs |
| Code | Architecture reviewed; interfaces frozen in ICD |
| Integration | Unit verification complete; code review closed |
| Baseline | All tests pass; traceability complete; QA audit clean |

## 3. Development environment

- Host verification build: C99, `-Wall -Wextra -Werror -pedantic`
  (see `Makefile`).
- Flight build (program launch): qualified/verified toolchain for the
  target flight computer; identical sources, target HAL, MPU-backed
  space partitioning; deterministic link map under CM.
- Static analysis (program launch): MISRA checker + sound analyzer
  (e.g. absence-of-runtime-error analysis) on every change.

## 4. Traceability

Bidirectional: requirement ↔ code via `@satisfies`, requirement ↔ test
via `@verifies`; `tools/trace/gen_trace.py` regenerates
`docs/requirements/trace-matrix.md`; review gates reject orphan code
or untraced requirements.

## 5. CSCI structure

kernel (DAL A), IOM (A), FCS (A), DISP (B), FMS (C), MAINT (D),
module configuration (parameter data item, verified to the highest
DAL it serves: A).
