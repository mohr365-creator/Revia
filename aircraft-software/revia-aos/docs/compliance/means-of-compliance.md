# Means of Compliance Matrix

Document: REV-AOS-MOC-001 rev A — DRAFT (program-level anchors;
project-specific issue papers and special conditions to be added at
program launch). Consumed by `tools/compliance/export_compliance.py`
for the certification dashboard; keep the table format machine-stable.

| Regulation | Subject | Means of compliance | Primary standard(s) |
|---|---|---|---|
| 14 CFR 25.1309 | Equipment, systems, installations safety | AC 25.1309-1B safety assessment; FHA/PSSA/SSA | ARP4761A, ARP4754B |
| 14 CFR 25.1301 | Function and installation | Qualification + intended-function verification | DO-160G |
| 14 CFR 21.20 / 21.97 | Type design data, changes | Configuration management of life-cycle data | SCMP (REV-AOS-SCMP-001) |
| Software (all DALs) | Airborne software assurance | AC 20-115D | DO-178C, DO-330, DO-331, DO-332, DO-333 |
| AOS kernel reuse | Reusable software component | AC 20-148 RSC package: kernel + verification data certified once, reused per LRU and across the R-50/R-100 family | DO-178C |
| IMA platform | Modules, partitioning, roles | AC 20-170; partitioning analysis; module acceptance | DO-297 |
| Development assurance | System/aircraft level processes | AC 20-174 | ARP4754A (program practices per ARP4754B) |
| Airborne electronic hardware | FCC/IOM/RDC custom hardware | AC 20-152A | DO-254 |
| 14 CFR 25.1319 | Equipment, systems, network information security | Security risk assessment, protection, continuing airworthiness | DO-326A, DO-356A, DO-355 |
| Aeronautical databases | FMS navigation data | AC 20-153B | DO-200B |
| 14 CFR 25.1322 | Flight crew alerting (EICAS) | AC 25.1322-1 | — |
| Displays | Electronic flight displays | AC 25-11B | — |
| 14 CFR 25.1329 | Flight guidance system | AC 25.1329-1C | — |
| 14 CFR 25.1316/1317 | Lightning / HIRF | Qualification + system-level assessment | DO-160G sections 22/20 |
| COTS: weather radar | ATA 34 surveillance | TSO-C63e article + installation approval | DO-178C/DO-254 (supplier data) |
| COTS: TCAS II | ATA 34 surveillance | TSO-C119e | — |
| COTS: ATC transponder | ATA 34 surveillance | TSO-C112e | — |
| COTS: radio altimeter | ATA 34 navigation | TSO-C87a | — |
| COTS: GNSS | ATA 34 navigation | TSO-C145e / TSO-C146e | — |
| Part 121 ops data | Continuing airworthiness reporting | §121.373 program fed by CMC/MAINT fault data | — |
