import { NextResponse } from "next/server";
import { sql, type Department, type Employee, type Site } from "@/lib/db";
import { getAdminEmailFromCookies } from "@/lib/academy-auth";
import {
  getTodayAttendanceStats,
  getTodayPresenceBySlug,
} from "@/lib/attendance-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const adminEmail = await getAdminEmailFromCookies();

    const [departments, employeesRaw, sites, statsRow] = await Promise.all([
      sql`SELECT slug, label, color, icon, sort, real_member_name,
                 (real_member_avatar IS NOT NULL AND real_member_avatar <> '') AS has_real_avatar
          FROM departments ORDER BY sort`,
      sql`SELECT id, slug, department_slug, name, description, color, emoji, vibe, status, current_task
          FROM employees ORDER BY department_slug, id`,
      sql`SELECT id, name, url, department_slug, status, http_code, last_checked
          FROM sites ORDER BY id`,
      sql`SELECT
            (SELECT count(*)::int FROM employees) AS total,
            (SELECT count(*)::int FROM departments) AS departments`,
    ]);

    let employees = employeesRaw as Employee[];
    let stats: Record<string, number>;

    if (adminEmail) {
      const attendanceStats = await getTodayAttendanceStats();
      const presence = await getTodayPresenceBySlug(attendanceStats.date);
      employees = employees.map((e) => {
        const p = presence.get(e.slug);
        if (!p) return e;
        return { ...e, status: p };
      });
      stats = {
        total: Number((statsRow as Record<string, number>[])[0]?.total ?? 0),
        working: attendanceStats.working,
        meeting: attendanceStats.meeting,
        idle: attendanceStats.idle,
        departments: Number(
          (statsRow as Record<string, number>[])[0]?.departments ?? 0,
        ),
        checkInsToday: attendanceStats.checkInsToday,
        checkOutsToday: attendanceStats.checkOutsToday,
        onPremises: attendanceStats.onPremises,
      };
    } else {
      employees = employees.map((e) => ({
        ...e,
        status: "idle" as const,
        current_task: null,
      }));
      stats = {
        total: Number((statsRow as Record<string, number>[])[0]?.total ?? 0),
        working: 0,
        meeting: 0,
        idle: 0,
        departments: Number(
          (statsRow as Record<string, number>[])[0]?.departments ?? 0,
        ),
      };
    }

    return NextResponse.json({
      departments: departments as Department[],
      employees,
      sites: sites as Site[],
      stats,
      admin: !!adminEmail,
    });
  } catch (error) {
    console.error("[api/company]", error);
    return NextResponse.json(
      { error: "회사 데이터를 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}
