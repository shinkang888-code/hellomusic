import { NextResponse } from "next/server";
import { sql, type Site } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// 관제탑: 등록된 사이트를 실시간 점검하고 결함 발견 시 할 일판(tasks)에 자동 등록
async function checkOne(site: Site): Promise<{ url: string; status: string; code: number | null }> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(site.url, {
      method: "GET",
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timer);
    const ok = res.status < 400;
    return { url: site.url, status: ok ? "up" : "down", code: res.status };
  } catch {
    return { url: site.url, status: "down", code: null };
  }
}

export async function POST() {
  return runCheck();
}

// Vercel Cron 은 GET 으로 호출됨
export async function GET() {
  return runCheck();
}

async function runCheck() {
  try {
    const sites = (await sql`SELECT id, name, url, department_slug, status, http_code, last_checked FROM sites`) as Site[];
    const results = await Promise.all(sites.map(checkOne));

    let downCount = 0;
    for (let i = 0; i < sites.length; i++) {
      const s = sites[i];
      const r = results[i];
      const prev = s.status;
      await sql`
        UPDATE sites SET status = ${r.status}, http_code = ${r.code}, last_checked = now()
        WHERE id = ${s.id}
      `;
      if (r.status === "down") {
        downCount += 1;
        // 결함 → 담당 부서 직원 error 표시
        if (s.department_slug) {
          await sql`
            UPDATE employees SET status = 'error', current_task = ${`🚨 ${s.name} 사이트 장애 대응`}, updated_at = now()
            WHERE department_slug = ${s.department_slug}
              AND id = (SELECT id FROM employees WHERE department_slug = ${s.department_slug} ORDER BY id LIMIT 1)
          `;
        }
        // 새 장애일 때만 할 일판 등록
        if (prev !== "down") {
          await sql`
            INSERT INTO tasks (title, status, department_slug, source)
            VALUES (${`🚨 [장애] ${s.name} (${s.url}) 점검 필요`}, 'todo', ${s.department_slug}, 'control-tower')
          `;
          await sql`INSERT INTO event_log (actor, message) VALUES ('관제탑', ${`${s.name} 사이트 장애 감지 → 할 일판 등록`})`;
        }
      }
    }

    await sql`INSERT INTO event_log (actor, message) VALUES ('관제탑', ${`사이트 ${sites.length}개 점검 완료 (장애 ${downCount})`})`;

    return NextResponse.json({
      ok: true,
      checked: sites.length,
      down: downCount,
      results,
    });
  } catch (error) {
    console.error("[api/sites/check]", error);
    return NextResponse.json({ error: "점검 실패" }, { status: 500 });
  }
}
