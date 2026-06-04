"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

type TrackFn = (name: string, properties?: Record<string, unknown>) => void;

const Ctx = createContext<TrackFn>(() => {});

export function useTrackEvent(): TrackFn {
  return useContext(Ctx);
}

function sessionId(): string {
  if (typeof window === "undefined") return "";
  const KEY = "revia_sid";
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(KEY, id);
  }
  return id;
}

async function ship(payload: Record<string, unknown>): Promise<void> {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Analytics must never break the site.
  }
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lastPath = useRef("");

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    const sid = sessionId();
    const rawRef = document.referrer;
    // Exclude self-referrals so internal navigation doesn't pollute referrer data.
    const referrer =
      rawRef && !rawRef.startsWith(window.location.origin) ? rawRef : null;
    const params = new URLSearchParams(window.location.search);

    ship({
      type: "pageview",
      path: pathname,
      referrer,
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
      session_id: sid,
    });
  }, [pathname]);

  const track = useCallback<TrackFn>((name, properties) => {
    ship({
      type: "event",
      event_name: name,
      path: pathname,
      properties: properties ?? {},
      session_id: sessionId(),
    });
  }, [pathname]);

  return <Ctx.Provider value={track}>{children}</Ctx.Provider>;
}
