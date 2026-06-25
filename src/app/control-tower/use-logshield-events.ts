"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { generateEvent, generateStats } from "@/lib/logshield/realtime";
import { recentEvents, dashboardStats } from "@/lib/logshield/mock-data";

type EventItem = (typeof recentEvents)[0];
type Stats = typeof dashboardStats;

export function useLogshieldEvents(maxItems = 15) {
  const [events, setEvents] = useState<EventItem[]>(
    recentEvents.slice(0, maxItems) as EventItem[],
  );
  const [stats, setStats] = useState<Stats>(dashboardStats);
  const [newAlertCount, setNewAlertCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tick = useCallback(() => {
    const evt = generateEvent() as EventItem;
    setEvents((prev) => [evt, ...prev].slice(0, maxItems));
    setStats(generateStats());
    if (evt.severity === "critical" || evt.severity === "high") {
      setNewAlertCount((n) => n + 1);
    }
  }, [maxItems]);

  useEffect(() => {
    const schedule = () => {
      const delay = Math.random() * 3000 + 2500;
      intervalRef.current = setTimeout(() => {
        tick();
        schedule();
      }, delay);
    };
    schedule();
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [tick]);

  const clearAlerts = useCallback(() => setNewAlertCount(0), []);

  return { events, stats, newAlertCount, clearAlerts };
}
