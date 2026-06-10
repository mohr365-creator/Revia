# Software Configuration Management Plan (SCMP)

Document: REV-AOS-SCMP-001 rev A — DRAFT

## 1. Configuration identification

Every life-cycle data item carries a document ID (REV-AOS-…) and lives
in this repository under git. Source baselines are annotated tags
(`aos-baseline-<n>`); the flight executable is identified by
(tag, toolchain ID, build options, link map hash).

## 2. Change control

- All changes via reviewed merge requests; no direct pushes to
  baselined branches.
- Problem reports (PR) and change requests (CR) tracked in the program
  ALM; every merge references its PR/CR.
- Class 1 changes (affecting certified behaviour, interfaces, or
  plans) require CCB approval; Class 2 (editorial) require reviewer
  approval only.

## 3. Baselines, archive, retrieval

Baselines are immutable tags plus released build artifacts archived
redundantly (program archive + escrow). Any baseline must be exactly
reproducible: sources, tools, and build instructions are all under CM
(DO-178C §7.2.7).

## 4. Control categories

CC1 (full change control): plans, standards, requirements, design,
source, configuration data, verification cases/procedures/results.
CC2: working notes, analyses in progress.
