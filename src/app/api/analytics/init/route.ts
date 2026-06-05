import { NextRequest, NextResponse } from "next/server";
import { initSchema } from "@/lib/db";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(_req: NextRequest) {
  const cookieStore = cookies();
  const password = process.env.ANALYTICS_PASSWORD;
  const auth = cookieStore.get("analytics_auth")?.value;

  if (!password || auth !== password) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await initSchema();
    return NextResponse.json({ ok: true, message: "Schema ready." });
  } catch (err) {
    console.error("[/api/analytics/init]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
