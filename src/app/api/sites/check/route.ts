import { NextResponse } from "next/server";
import { sql, type Site } from "@/lib/db";
import {
  scanSiteSecurity,
  summarizeFindings,
  type SecurityFinding,
} from "@/lib/logshield/site-scan";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type SiteCheckResult = {
  url: string;
  name: string;
  status: string;
  code: number | null;
  securityScore: number;
  securityGrade: string;
  findings: SecurityFinding[];
};

async function checkOne(site: Site): Promise<SiteCheckResult> {
  let status = "unknown";
  let code: number | null = null;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(site.url, {
      method: "GET",
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timer);
    code = res.status;
    status = res.status < 400 ? "up" : "down";
  } catch {
    status = "down";
    code = null;
  }

  const { findings } = await scanSiteSecurity(site.name, site.url, status, code);
  const { score, grade } = summarizeFindings(findings);

  return {
    url: site.url,
    name: site.name,
    status,
    code,
    securityScore: score,
    securityGrade: grade,
    findings,
  };
}

export async function POST() {
  return runCheck();
}

export async function GET() {
  return runCheck();
}

async function runCheck() {
  try {
    const sites = (await sql`
      SELECT id, name, url, department_slug, status, http_code, last_checked
      FROM sites
    `) as Site[];

    const results = await Promise.all(sites.map(checkOne));

    let downCount = 0;
    let highRiskCount = 0;

    for (let i = 0; i < sites.length; i++) {
      const s = sites[i];
      const r = results[i];
      const prev = s.status;
      await sql`
        UPDATE sites SET status = ${r.status}, http_code = ${r.code}, last_checked = now()
        WHERE id = ${s.id}
      `;

      if (r.status === "down") downCount += 1;
      if (r.securityGrade === "critical" || r.securityGrade === "high") {
        highRiskCount += 1;
      }

      if (r.status === "down") {
        if (s.department_slug) {
          await sql`
            UPDATE employees SET status = 'error', current_task = ${`🚨 ${s.name} 사이트 장애 대응`}, updated_at = now()
            WHERE department_slug = ${s.department_slug}
              AND id = (SELECT id FROM employees WHERE department_slug = ${s.department_slug} ORDER BY id LIMIT 1)
          `;
        }
        if (prev !== "down") {
          await sql`
            INSERT INTO tasks (title, status, department_slug, source)
            VALUES (${`🚨 [장애] ${s.name} (${s.url}) 점검 필요`}, 'todo', ${s.department_slug}, 'control-tower')
          `;
          await sql`
            INSERT INTO event_log (actor, message)
            VALUES ('LogShield 관제탑', ${`${s.name} 사이트 장애 감지 → 할 일판 등록`})
          `;
        }
      } else if (r.securityGrade === "critical" || r.securityGrade === "high") {
        await sql`
          INSERT INTO event_log (actor, message)
          VALUES ('LogShield 관제탑', ${`${s.name} 보안 위험 ${r.securityGrade} (점수 ${r.securityScore}) — ${r.findings.filter((f) => f.severity === "critical" || f.severity === "high").map((f) => f.title).slice(0, 2).join(", ")}`})
        `;
      }
    }

    await sql`
      INSERT INTO event_log (actor, message)
      VALUES ('LogShield 관제탑', ${`사이트 ${sites.length}개 점검 · 장애 ${downCount} · 고위험 ${highRiskCount}`})
    `;

    return NextResponse.json({
      ok: true,
      engine: "Lonex LogShield",
      checked: sites.length,
      down: downCount,
      highRisk: highRiskCount,
      results,
    });
  } catch (error) {
    console.error("[api/sites/check]", error);
    return NextResponse.json({ error: "점검 실패" }, { status: 500 });
  }
}
