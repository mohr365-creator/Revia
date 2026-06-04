import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { LoginForm } from "./LoginForm";
import { logout } from "./actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics — Revia",
  robots: { index: false, follow: false },
};

// Always fresh — no caching for analytics.
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Summary = {
  total_views: number;
  views_7d: number;
  views_30d: number;
  unique_sessions: number;
  unique_sessions_7d: number;
};
type PageRow = { path: string; views: number };
type RefRow = { referrer: string; views: number };
type CountryRow = { country: string; views: number };
type UtmRow = { utm_source: string; utm_medium: string; utm_campaign: string; views: number };
type DayRow = { date: string; views: number };
type EventRow = { event_name: string; path: string; created_at: string };

type AnalyticsData = {
  summary: Summary;
  top_pages: PageRow[];
  top_referrers: RefRow[];
  top_countries: CountryRow[];
  utms: UtmRow[];
  daily_views: DayRow[];
  recent_events: EventRow[];
};

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

async function fetchAnalytics(): Promise<AnalyticsData | null> {
  try {
    const [summary, topPages, topReferrers, topCountries, utms, dailyViews, recentEvents] =
      await Promise.all([
        sql<Summary>`
          SELECT
            COUNT(*)::int                                                              AS total_views,
            COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')::int       AS views_7d,
            COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days')::int      AS views_30d,
            COUNT(DISTINCT session_id)::int                                            AS unique_sessions,
            COUNT(DISTINCT session_id) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')::int
                                                                                       AS unique_sessions_7d
          FROM page_views
        `,
        sql<PageRow>`
          SELECT path, COUNT(*)::int AS views
          FROM page_views
          GROUP BY path ORDER BY views DESC LIMIT 15
        `,
        sql<RefRow>`
          SELECT
            CASE WHEN referrer IS NULL OR referrer = '' THEN 'Direct' ELSE referrer END AS referrer,
            COUNT(*)::int AS views
          FROM page_views
          GROUP BY 1 ORDER BY views DESC LIMIT 10
        `,
        sql<CountryRow>`
          SELECT COALESCE(country, 'Unknown') AS country, COUNT(*)::int AS views
          FROM page_views
          GROUP BY country ORDER BY views DESC LIMIT 10
        `,
        sql<UtmRow>`
          SELECT
            utm_source,
            COALESCE(utm_medium, '—')   AS utm_medium,
            COALESCE(utm_campaign, '—') AS utm_campaign,
            COUNT(*)::int AS views
          FROM page_views
          WHERE utm_source IS NOT NULL
          GROUP BY utm_source, utm_medium, utm_campaign ORDER BY views DESC LIMIT 10
        `,
        sql<DayRow>`
          SELECT
            TO_CHAR(DATE(created_at), 'YYYY-MM-DD') AS date,
            COUNT(*)::int AS views
          FROM page_views
          WHERE created_at > NOW() - INTERVAL '30 days'
          GROUP BY DATE(created_at) ORDER BY date
        `,
        sql<EventRow>`
          SELECT event_name, path, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI') AS created_at
          FROM events ORDER BY created_at DESC LIMIT 25
        `,
      ]);

    return {
      summary: summary.rows[0] ?? {
        total_views: 0, views_7d: 0, views_30d: 0, unique_sessions: 0, unique_sessions_7d: 0,
      },
      top_pages: topPages.rows,
      top_referrers: topReferrers.rows,
      top_countries: topCountries.rows,
      utms: utms.rows,
      daily_views: dailyViews.rows,
      recent_events: recentEvents.rows,
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------

function Card({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-cream/10 bg-white/5 p-5">
      <p className="text-xs font-medium uppercase tracking-eyebrow text-cream/50">{label}</p>
      <p className="mt-2 font-serif text-3xl text-amber">{value.toLocaleString()}</p>
      {sub && <p className="mt-1 text-xs text-cream/40">{sub}</p>}
    </div>
  );
}

function Table({
  heads,
  rows,
}: {
  heads: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-cream/10">
            {heads.map((h) => (
              <th
                key={h}
                className="pb-3 text-left text-xs font-medium uppercase tracking-eyebrow text-cream/40"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-cream/5 last:border-0">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`py-2.5 pr-4 ${
                    j === row.length - 1
                      ? "text-right font-medium tabular-nums text-amber"
                      : "max-w-[200px] truncate text-cream/80"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={heads.length} className="py-6 text-center text-cream/30">
                No data yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function BarChart({ data }: { data: DayRow[] }) {
  const max = Math.max(...data.map((d) => d.views), 1);
  return (
    <div className="flex h-28 items-end gap-px overflow-hidden">
      {data.map((d) => {
        const pct = Math.round((d.views / max) * 100);
        const day = d.date.slice(5); // MM-DD
        return (
          <div
            key={d.date}
            title={`${d.date}: ${d.views.toLocaleString()} views`}
            className="group relative flex flex-1 flex-col items-center justify-end"
          >
            <div
              className="w-full rounded-t bg-amber/60 transition-all group-hover:bg-amber"
              style={{ height: `${pct}%` }}
            />
            {data.length <= 14 && (
              <span className="mt-1 block text-[9px] text-cream/30 rotate-45 origin-left">
                {day}
              </span>
            )}
          </div>
        );
      })}
      {data.length === 0 && (
        <p className="m-auto text-sm text-cream/30">No views in last 30 days.</p>
      )}
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-medium uppercase tracking-eyebrow text-cream/50 mb-4">
      {children}
    </h2>
  );
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

function Dashboard({ data }: { data: AnalyticsData }) {
  const { summary, top_pages, top_referrers, top_countries, utms, daily_views, recent_events } =
    data;

  return (
    <div className="min-h-screen bg-navy px-6 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-eyebrow text-amber">Revia</p>
            <h1 className="mt-1 font-serif text-3xl text-cream">Traffic Insights</h1>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border border-cream/20 px-4 py-2 text-xs text-cream/60 transition-colors hover:border-cream/40 hover:text-cream"
            >
              Sign out
            </button>
          </form>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
          <Card label="Total views" value={summary.total_views} />
          <Card label="Views (30 d)" value={summary.views_30d} />
          <Card label="Views (7 d)" value={summary.views_7d} />
          <Card label="Sessions (all)" value={summary.unique_sessions} />
          <Card label="Sessions (7 d)" value={summary.unique_sessions_7d} />
        </div>

        {/* Daily trend */}
        <div className="rounded-2xl border border-cream/10 bg-white/5 p-6">
          <SectionHeader>Daily views — last 30 days</SectionHeader>
          <BarChart data={daily_views} />
        </div>

        {/* Pages + Referrers */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-cream/10 bg-white/5 p-6">
            <SectionHeader>Top pages</SectionHeader>
            <Table
              heads={["Path", "Views"]}
              rows={top_pages.map((r) => [r.path, r.views])}
            />
          </div>
          <div className="rounded-2xl border border-cream/10 bg-white/5 p-6">
            <SectionHeader>Top referrers</SectionHeader>
            <Table
              heads={["Source", "Views"]}
              rows={top_referrers.map((r) => [r.referrer, r.views])}
            />
          </div>
        </div>

        {/* Countries + UTM */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-cream/10 bg-white/5 p-6">
            <SectionHeader>Top countries</SectionHeader>
            <Table
              heads={["Country", "Views"]}
              rows={top_countries.map((r) => [r.country, r.views])}
            />
          </div>
          <div className="rounded-2xl border border-cream/10 bg-white/5 p-6">
            <SectionHeader>UTM campaigns</SectionHeader>
            <Table
              heads={["Source", "Medium", "Campaign", "Views"]}
              rows={utms.map((r) => [r.utm_source, r.utm_medium, r.utm_campaign, r.views])}
            />
          </div>
        </div>

        {/* Recent events */}
        <div className="rounded-2xl border border-cream/10 bg-white/5 p-6">
          <SectionHeader>Recent CTA events</SectionHeader>
          <Table
            heads={["Event", "Page", "Time"]}
            rows={recent_events.map((r) => [r.event_name, r.path, r.created_at])}
          />
        </div>

        {/* Init helper */}
        <p className="text-center text-xs text-cream/25">
          First time? Run{" "}
          <code className="rounded bg-white/5 px-1 py-0.5">
            POST /api/analytics/init
          </code>{" "}
          to create the database tables.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function AnalyticsPage() {
  const cookieStore = cookies();
  const password = process.env.ANALYTICS_PASSWORD;
  const auth = cookieStore.get("analytics_auth")?.value;
  const isAuthed = password && auth === password;

  if (!isAuthed) {
    return <LoginForm />;
  }

  const data = await fetchAnalytics();

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-serif text-2xl text-cream">Database not reachable.</p>
        <p className="max-w-md text-sm text-cream/60">
          Make sure <code className="rounded bg-white/5 px-1">POSTGRES_URL</code> is set, then
          run{" "}
          <code className="rounded bg-white/5 px-1">POST /api/analytics/init</code> to create
          the schema.
        </p>
      </div>
    );
  }

  return <Dashboard data={data} />;
}
