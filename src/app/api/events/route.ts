import { NextResponse } from "next/server";
import { sql, type EventLog } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const events = (await sql`
      SELECT id, ts, actor, message FROM event_log
      ORDER BY ts DESC LIMIT 50
    `) as EventLog[];
    return NextResponse.json({ events });
  } catch (error) {
    console.error("[api/events]", error);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}
