# ATA 22 — Autoflight

Function: autopilot servo commands, flight director, autothrottle,
yaw damper. Hosted on FCC modules alongside (but partitioned from)
the primary flight control laws.
Make/Buy: MAKE.
DAL: A (autoland, if pursued) / B baseline.
Backbone: subscribes FMS guidance + air data; publishes servo cmds.
Compliance anchors: 25.1329, AC 25.1329-1C; AC 120-28D if CAT III.
Status: placeholder.
