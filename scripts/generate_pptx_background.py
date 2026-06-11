#!/usr/bin/env python3
"""Generate a 1920x1080 PNG background matching the Revia website design."""

from PIL import Image, ImageDraw
import math


W, H = 1920, 1080

# Brand colors
NAVY = (15, 27, 60)     # #0f1b3c
AMBER = (232, 149, 86)  # #e89556


def bezier_points(p0, p1, p2, steps=400):
    """Quadratic Bezier curve from p0 through control p1 to p2."""
    pts = []
    for i in range(steps + 1):
        t = i / steps
        x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0]
        y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1]
        pts.append((x, y))
    return pts


def scale(pt, sx, sy):
    return (pt[0] * sx, pt[1] * sy)


# SVG viewBox is 1440x900 — scale to 1920x1080
sx = W / 1440
sy = H / 900

# Curves from the website: "M x0 y0 Q cx cy x1 y1"
curves = [
    ((120, 700), (500, 300), (1300, 220)),
    ((200, 820), (700, 500), (1200, 640)),
    ((80, 400),  (600, 120), (1380, 540)),
    ((300, 200), (800, 600), (1320, 760)),
]

img = Image.new("RGB", (W, H), NAVY)
draw = ImageDraw.Draw(img)

def draw_city(draw, cx, cy, r_outer, r_inner, line_color, navy):
    """Solid filled circle city marker."""
    draw.ellipse([cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer], fill=line_color)


for opacity, suffix, lw in [(0.18, "subtle", 2), (0.45, "vivid", 3)]:
    img = Image.new("RGB", (W, H), NAVY)
    draw = ImageDraw.Draw(img)

    line_color = tuple(
        int(NAVY[c] + (AMBER[c] - NAVY[c]) * opacity) for c in range(3)
    )

    # City dot sizes scale with line weight
    r_outer = lw * 4
    r_inner = lw * 2

    for p0, ctrl, p2 in curves:
        sp0  = scale(p0,  sx, sy)
        sctrl = scale(ctrl, sx, sy)
        sp2  = scale(p2,  sx, sy)
        pts = bezier_points(sp0, sctrl, sp2)
        draw.line(pts, fill=line_color, width=lw)
        # City circles at both endpoints
        for cx, cy in (sp0, sp2):
            draw_city(draw, cx, cy, r_outer, r_inner, line_color, NAVY)

    out_path = f"/home/user/Revia/revia-background-{suffix}.png"
    img.save(out_path, "PNG", optimize=True)
    print(f"Saved: {out_path}  ({W}x{H})")
