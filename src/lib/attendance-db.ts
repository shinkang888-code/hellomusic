import { sql } from "@/lib/db";

export type AttendanceEventType =
  | "check_in"
  | "check_out"
  | "meeting_start"
  | "meeting_end";

export type AttendanceRecord = {
  id: number;
  external_member_id: string;
  member_name: string;
  member_role: string;
  employee_slug: string | null;
  event_type: AttendanceEventType;
  recorded_at: string;
  attendance_date: string;
  source: string;
};

export type AttendanceStats = {
  working: number;
  meeting: number;
  idle: number;
  checkInsToday: number;
  checkOutsToday: number;
  onPremises: number;
  date: string;
};

export type SyncAttendanceInput = {
  external_member_id: string;
  member_name: string;
  member_role?: string;
  employee_slug?: string | null;
  event_type: AttendanceEventType;
  recorded_at?: string;
  attendance_date?: string;
};

function todayKst(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
}

/** 멤버별 오늘 마지막 이벤트 → presence */
export function presenceFromEvents(
  events: { event_type: string; recorded_at: string }[],
): "working" | "meeting" | "idle" {
  if (events.length === 0) return "idle";
  const sorted = [...events].sort(
    (a, b) =>
      new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime(),
  );
  const last = sorted[sorted.length - 1]!.event_type;
  if (last === "check_out" || last === "meeting_end") return "idle";
  if (last === "meeting_start") return "meeting";
  if (last === "check_in") return "working";
  return "idle";
}

export async function upsertAttendanceBatch(
  records: SyncAttendanceInput[],
): Promise<number> {
  let n = 0;
  for (const r of records) {
    const at = r.recorded_at ?? new Date().toISOString();
    const date = r.attendance_date ?? todayKst();
    await sql`
      INSERT INTO attendance_records (
        external_member_id, member_name, member_role, employee_slug,
        event_type, recorded_at, attendance_date, source
      )
      VALUES (
        ${r.external_member_id},
        ${r.member_name},
        ${r.member_role ?? "student"},
        ${r.employee_slug ?? null},
        ${r.event_type},
        ${at}::timestamptz,
        ${date}::date,
        'hello_manager'
      )
      ON CONFLICT (external_member_id, event_type, attendance_date, recorded_at)
      DO NOTHING
    `;
    n += 1;
  }
  return n;
}

export async function getTodayRecords(
  date = todayKst(),
): Promise<AttendanceRecord[]> {
  const rows = await sql`
    SELECT id, external_member_id, member_name, member_role, employee_slug,
           event_type, recorded_at, attendance_date::text, source
    FROM attendance_records
    WHERE attendance_date = ${date}::date
    ORDER BY recorded_at ASC
  `;
  return rows as AttendanceRecord[];
}

/** HelloManager 등·퇴원 기록 → 오늘 근무/회의/대기 집계 */
export async function getTodayAttendanceStats(
  date = todayKst(),
): Promise<AttendanceStats> {
  const records = await getTodayRecords(date);
  const byMember = new Map<string, AttendanceRecord[]>();
  for (const r of records) {
    const list = byMember.get(r.external_member_id) ?? [];
    list.push(r);
    byMember.set(r.external_member_id, list);
  }

  let working = 0;
  let meeting = 0;
  let idle = 0;
  let checkInsToday = 0;
  let checkOutsToday = 0;

  for (const events of byMember.values()) {
    for (const e of events) {
      if (e.event_type === "check_in") checkInsToday += 1;
      if (e.event_type === "check_out") checkOutsToday += 1;
    }
    const p = presenceFromEvents(events);
    if (p === "working") working += 1;
    else if (p === "meeting") meeting += 1;
    else idle += 1;
  }

  const [{ count: empTotal }] = await sql`
    SELECT count(*)::int AS count FROM employees
  `;
  const tracked = byMember.size;
  const untracked = Math.max(0, Number(empTotal) - tracked);
  idle += untracked;

  return {
    working,
    meeting,
    idle,
    checkInsToday,
    checkOutsToday,
    onPremises: working + meeting,
    date,
  };
}

/** employee_slug 기준 오늘 presence 맵 */
export async function getTodayPresenceBySlug(
  date = todayKst(),
): Promise<Map<string, "working" | "meeting" | "idle">> {
  const records = await getTodayRecords(date);
  const bySlug = new Map<string, AttendanceRecord[]>();

  for (const r of records) {
    if (!r.employee_slug) continue;
    const list = bySlug.get(r.employee_slug) ?? [];
    list.push(r);
    bySlug.set(r.employee_slug, list);
  }

  const out = new Map<string, "working" | "meeting" | "idle">();
  for (const [slug, events] of bySlug) {
    out.set(slug, presenceFromEvents(events));
  }
  return out;
}

export async function logAttendanceSync(message: string, actor = "HelloManager") {
  await sql`
    INSERT INTO event_log (actor, message)
    VALUES (${actor}, ${message})
  `;
}
