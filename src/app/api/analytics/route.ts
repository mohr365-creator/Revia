import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { cookies } from "next/headers";

export const runtime = "nodejs";

function authorized(): boolean {
  const password = process.env.ANALYTICS_PASSWORD;
  if (!password) return false;
  return cookies().get("analytics_auth")?.value === password;
}

export async function GET(_req: NextRequest) {
  if (!authorized()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [summary, topPages, topReferrers, topCountries, utms, dailyViews, recentEvents] =
      await Promise.all([
        sql`
          SELECT
            COUNT(*)::int                                                              AS total_views,
            COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')::int       AS views_7d,
            COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days')::int      AS views_30d,
            COUNT(DISTINCT session_id)::int                                            AS unique_sessions,
            COUNT(DISTINCT session_id) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')::int
                                                                                       AS unique_sessions_7d
          FROM page_views
        `,
        sql`
          SELECT path, COUNT(*)::int AS views
          FROM page_views
          GROUP BY path
          ORDER BY views DESC
          LIMIT 15
        `,
        sql`
          SELECT
            CASE WHEN referrer IS NULL OR referrer = '' THEN 'Direct' ELSE referrer END AS referrer,
            COUNT(*)::int AS views
          FROM page_views
          GROUP BY 1
          ORDER BY views DESC
          LIMIT 10
        `,
        sql`
          SELECT COALESCE(country, 'Unknown') AS country, COUNT(*)::int AS views
          FROM page_views
          GROUP BY country
          ORDER BY views DESC
          LIMIT 10
        `,
        sql`
          SELECT
            utm_source,
            COALESCE(utm_medium, '—')   AS utm_medium,
            COALESCE(utm_campaign, '—') AS utm_campaign,
            COUNT(*)::int AS views
          FROM page_views
          WHERE utm_source IS NOT NULL
          GROUP BY utm_source, utm_medium, utm_campaign
          ORDER BY views DESC
          LIMIT 10
        `,
        sql`
          SELECT
            TO_CHAR(DATE(created_at), 'YYYY-MM-DD') AS date,
            COUNT(*)::int AS views
          FROM page_views
          WHERE created_at > NOW() - INTERVAL '30 days'
          GROUP BY DATE(created_at)
          ORDER BY date
        `,
        sql`
          SELECT event_name, path, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI') AS created_at
          FROM events
          ORDER BY created_at DESC
          LIMIT 25
        `,
      ]);

    return NextResponse.json({
      summary: summary.rows[0],
      top_pages: topPages.rows,
      top_referrers: topReferrers.rows,
      top_countries: topCountries.rows,
      utms: utms.rows,
      daily_views: dailyViews.rows,
      recent_events: recentEvents.rows,
    });
  } catch (err) {
    console.error("[/api/analytics]", err);
    return NextResponse.json({ error: "Database error — is POSTGRES_URL set?" }, { status: 500 });
  }
}
