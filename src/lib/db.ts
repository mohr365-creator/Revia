// Requires POSTGRES_URL env var (Vercel Postgres or any compatible Postgres).
// Run POST /api/analytics/init once to create the tables.
import { sql } from "@vercel/postgres";

export { sql };

export async function initSchema(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS page_views (
      id        BIGSERIAL PRIMARY KEY,
      path      TEXT        NOT NULL,
      referrer  TEXT,
      utm_source   TEXT,
      utm_medium   TEXT,
      utm_campaign TEXT,
      country   TEXT,
      city      TEXT,
      session_id TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS pv_created_at ON page_views(created_at)`;
  await sql`CREATE INDEX IF NOT EXISTS pv_path       ON page_views(path)`;
  await sql`CREATE INDEX IF NOT EXISTS pv_session    ON page_views(session_id)`;

  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id         BIGSERIAL PRIMARY KEY,
      event_name TEXT NOT NULL,
      path       TEXT NOT NULL,
      properties JSONB,
      session_id TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS ev_created_at  ON events(created_at)`;
  await sql`CREATE INDEX IF NOT EXISTS ev_event_name  ON events(event_name)`;
}
