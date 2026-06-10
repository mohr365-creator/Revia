# ATA 21 — Environmental Control System

Function: air conditioning packs, cabin pressurization, bleed/electric
air management, equipment cooling, cabin temperature zones.
Make/Buy: MAKE control software (pack + pressurization partitions on
ECS controllers); BUY pack hardware, valves, outflow valves (supplier
ACE-class firmware to allocated DAL).
DAL: B (pressurization control: loss + misleading = hazardous);
manual pressurization backup lane independent of auto lane.
LRUs: ECS controller x2 (dual-lane AOS instances), RDC-attached valve
and sensor effectors.
Backbone: publishes pack/pressurization status; subscribes to
electrical load-shed status (pack shed) and WOW/flight phase.
Compliance anchors: 25.831/25.841/25.1309; DO-160G; AC 25-22.
Status: placeholder — requirements and partition stubs are future work.
