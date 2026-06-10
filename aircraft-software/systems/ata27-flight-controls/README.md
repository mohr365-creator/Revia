# ATA 27 — Flight Controls

Function: primary flight control laws (pitch/roll/yaw), high-lift
control, spoilers; COM/MON channel architecture with dissimilar
monitor lane and (system-level) AOS-independent backup path.
Make/Buy: MAKE laws + monitor (this repository:
revia-aos/partitions/fcs and /mon); BUY actuator electronics (ACE)
firmware to DAL A from actuation supplier.
DAL: A.
LRUs: FCC x3, each COM+MON dissimilar lanes (see ARCHITECTURE.md §1-2).
Backbone: ADC/inceptor in from IOM; surface commands out to ACEs;
status to DISP/MAINT.
Compliance anchors: 25.671/25.672/25.1309; AC 25.1309-1B CCA/CMA.
Status: IMPLEMENTED (pitch axis baseline + dissimilar monitor);
roll/yaw, high-lift, and ACE ICDs are future work.
