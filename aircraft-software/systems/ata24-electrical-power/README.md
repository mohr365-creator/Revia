# ATA 24 — Electrical Power Generation & Distribution

Function: engine/APU generator control (GCU), bus power control and
transfer (BPCU), primary/secondary distribution, load shedding,
battery/RAT/emergency power.
Make/Buy: MAKE GCU/BPCU control partitions (AOS instances); BUY
generators, contactors, TRUs, battery chargers (supplier firmware to
allocated DAL).
DAL: A for load-shed and essential-bus transfer logic (loss of all
electrical = catastrophic); B for normal generation control.
LRUs: GCU x4 (one per generator), BPCU x2 (dual-lane).
Backbone: publishes bus states and shed levels (consumed by ECS,
galley, IFE); subscribes engine state, flight phase.
Compliance anchors: 25.1351/25.1353/25.1355/25.1363; 25.1309.
Status: placeholder — load-shed table + bus logic are next code targets.
