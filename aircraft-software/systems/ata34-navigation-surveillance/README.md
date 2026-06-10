# ATA 34 — Navigation & Surveillance

Function: air data + inertial reference (ADIRU), radio nav, GNSS,
weather radar, TCAS, transponder, TAWS.
Make/Buy: BUY nearly all sensors as TSO articles — weather radar
(TSO-C63e), TCAS II (TSO-C119e), transponder (TSO-C112e), radio
altimeter (TSO-C87a), GNSS (TSO-C145e/C146e), TAWS (TSO-C151d),
ADIRU (supplier DAL A). MAKE the sensor fusion / source selection
partition (IOM hosts it) and all gateway containment.
DAL: A (air data selection), per-article otherwise.
Backbone: every article enters via RDC/gateway with ICD enforcement
(range/rate/staleness) so COTS faults are detected input failures.
Compliance anchors: 25.1303/25.1326; TSOs above; AC 20-138D (GNSS).
Status: placeholder folders per article; IOM source-selection stub
exists (revia-aos/partitions/iom).
