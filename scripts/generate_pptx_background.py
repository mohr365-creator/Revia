#!/usr/bin/env python3
"""Generate a 1920x1080 PNG background matching the Revia website design."""

from PIL import Image, ImageDraw

W, H = 1920, 1080
SCALE = 4          # supersample factor — render 4× then downscale for AA
RW, RH = W * SCALE, H * SCALE

# Brand colors
NAVY = (15, 27, 60)     # #0f1b3c
AMBER = (232, 149, 86)  # #e89556


def bezier_points(p0, p1, p2, steps=1200):
    """Quadratic Bezier curve from p0 through control p1 to p2."""
    pts = []
    for i in range(steps + 1):
        t = i / steps
        x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0]
        y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1]
        pts.append((x, y))
    return pts


def sc(pt):
    """Scale from SVG 1440×900 space → render canvas space."""
    return (pt[0] * RW / 1440, pt[1] * RH / 900)


# Curves from the website: (start, control, end)
curves = [
    ((120, 700), (500, 300), (1300, 220)),
    ((200, 820), (700, 500), (1200, 640)),
    ((80, 400),  (600, 120), (1380, 540)),
    ((300, 200), (800, 600), (1320, 760)),
]

for opacity, suffix, lw in [(0.18, "subtle", 2), (0.45, "vivid", 3)]:
    img = Image.new("RGB", (RW, RH), NAVY)
    draw = ImageDraw.Draw(img)

    line_color = tuple(int(NAVY[c] + (AMBER[c] - NAVY[c]) * opacity) for c in range(3))

    # Line width and dot radius in render-space
    rlw = lw * SCALE
    r = rlw * 4   # city dot radius

    for p0, ctrl, p2 in curves:
        sp0, sctrl, sp2 = sc(p0), sc(ctrl), sc(p2)
        pts = bezier_points(sp0, sctrl, sp2)
        draw.line(pts, fill=line_color, width=rlw)
        for cx, cy in (sp0, sp2):
            draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=line_color)

    # Downscale with LANCZOS for smooth anti-aliased result
    out = img.resize((W, H), Image.LANCZOS)
    out_path = f"/home/user/Revia/revia-background-{suffix}.png"
    out.save(out_path, "PNG", optimize=True)
    print(f"Saved: {out_path}  ({W}x{H})")
