import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type,
      path,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
      event_name,
      properties,
      session_id,
    } = body as Record<string, string | Record<string, unknown>>;

    if (!path || !session_id || typeof path !== "string" || typeof session_id !== "string") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Vercel injects geo headers on production; gracefully absent in dev.
    const country = req.headers.get("x-vercel-ip-country") ?? null;
    const city = req.headers.get("x-vercel-ip-city") ?? null;

    if (type === "pageview") {
      const ref = typeof referrer === "string" ? referrer || null : null;
      const src = typeof utm_source === "string" ? utm_source || null : null;
      const med = typeof utm_medium === "string" ? utm_medium || null : null;
      const cmp = typeof utm_campaign === "string" ? utm_campaign || null : null;

      await sql`
        INSERT INTO page_views (path, referrer, utm_source, utm_medium, utm_campaign, country, city, session_id)
        VALUES (${path}, ${ref}, ${src}, ${med}, ${cmp}, ${country}, ${city}, ${session_id})
      `;
    } else if (type === "event" && typeof event_name === "string" && event_name) {
      const props = properties && typeof properties === "object" ? properties : {};
      await sql`
        INSERT INTO events (event_name, path, properties, session_id)
        VALUES (${event_name}, ${path}, ${JSON.stringify(props)}, ${session_id})
      `;
    } else {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Never let analytics break the site
    console.error("[/api/track]", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
