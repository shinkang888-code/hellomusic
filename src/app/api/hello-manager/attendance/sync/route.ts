import { NextRequest, NextResponse } from "next/server";
import {
  logAttendanceSync,
  upsertAttendanceBatch,
  type SyncAttendanceInput,
  type AttendanceEventType,
} from "@/lib/attendance-db";
import { createHmac, timingSafeEqual } from "crypto";

export const dynamic = "force-dynamic";

const EVENTS = new Set<AttendanceEventType>([
  "check_in",
  "check_out",
  "meeting_start",
  "meeting_end",
]);

function syncSecret(): string {
  return (
    process.env.HELLO_SYNC_SECRET ||
    process.env.HELLO_SSO_SECRET ||
    process.env.AUTH_SECRET ||
    ""
  );
}

function verifySyncAuth(req: NextRequest): boolean {
  const secret = syncSecret();
  if (!secret) return false;
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : header;
  if (!token) return false;
  const expected = createHmac("sha256", secret)
    .update("hello-attendance-sync")
    .digest("base64url");
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

type SyncBody = {
  date?: string;
  records?: Array<{
    memberId?: string;
    external_member_id?: string;
    name?: string;
    member_name?: string;
    role?: string;
    member_role?: string;
    employeeSlug?: string;
    employee_slug?: string;
    event?: string;
    event_type?: string;
    at?: string;
    recorded_at?: string;
  }>;
};

/** HelloManager → lc_aca 등·퇴원 동기화 웹훅 */
export async function POST(req: NextRequest) {
  if (!verifySyncAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as SyncBody;
    const raw = body.records ?? [];
    if (raw.length === 0) {
      return NextResponse.json({ error: "records required" }, { status: 400 });
    }

    const records: SyncAttendanceInput[] = [];
    for (const r of raw) {
      const event = (r.event_type ?? r.event) as AttendanceEventType;
      if (!EVENTS.has(event)) continue;
      const id = r.external_member_id ?? r.memberId;
      const name = r.member_name ?? r.name;
      if (!id || !name) continue;
      records.push({
        external_member_id: id,
        member_name: name,
        member_role: r.member_role ?? r.role ?? "student",
        employee_slug: r.employee_slug ?? r.employeeSlug ?? null,
        event_type: event,
        recorded_at: r.recorded_at ?? r.at,
        attendance_date: body.date,
      });
    }

    const n = await upsertAttendanceBatch(records);
    await logAttendanceSync(
      `HelloManager 등·퇴원 ${n}건 동기화 (${body.date ?? "오늘"})`,
    );

    return NextResponse.json({ ok: true, synced: n });
  } catch (error) {
    console.error("[api/hello-manager/attendance/sync]", error);
    return NextResponse.json({ error: "sync failed" }, { status: 500 });
  }
}
