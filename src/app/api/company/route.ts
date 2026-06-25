import { NextResponse } from "next/server";
import { sql, type Department, type Employee, type Site } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [departments, employees, sites, stats] = await Promise.all([
      sql`SELECT slug, label, color, icon, sort, real_member_name,
                 (real_member_avatar IS NOT NULL AND real_member_avatar <> '') AS has_real_avatar
          FROM departments ORDER BY sort`,
      sql`SELECT id, slug, department_slug, name, description, color, emoji, vibe, status, current_task
          FROM employees ORDER BY department_slug, id`,
      sql`SELECT id, name, url, department_slug, status, http_code, last_checked
          FROM sites ORDER BY id`,
      sql`SELECT
            (SELECT count(*)::int FROM employees) AS total,
            (SELECT count(*)::int FROM employees WHERE status = 'working') AS working,
            (SELECT count(*)::int FROM employees WHERE status = 'meeting') AS meeting,
            (SELECT count(*)::int FROM employees WHERE status = 'idle') AS idle,
            (SELECT count(*)::int FROM departments) AS departments`,
    ]);

    return NextResponse.json({
      departments: departments as Department[],
      employees: employees as Employee[],
      sites: sites as Site[],
      stats: (stats as Record<string, number>[])[0],
    });
  } catch (error) {
    console.error("[api/company]", error);
    return NextResponse.json(
      { error: "회사 데이터를 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}
