// Neon seed script — agency-agents 기반 부서/직원 시드
// 실행: DATABASE_URL=... node scripts/seed.mjs
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(
  readFileSync(join(__dirname, "../src/data/agency.json"), "utf-8"),
);

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL 환경변수가 필요합니다.");
  process.exit(1);
}
const sql = neon(databaseUrl);

const STATUSES = ["working", "meeting", "review", "idle", "idle", "working"];

async function main() {
  const divisions = data.divisions;
  const agents = data.agents;

  // 1) departments
  let sort = 0;
  for (const [slug, meta] of Object.entries(divisions)) {
    await sql`
      INSERT INTO departments (slug, label, color, icon, sort)
      VALUES (${slug}, ${meta.label}, ${meta.color}, ${meta.icon}, ${sort})
      ON CONFLICT (slug) DO UPDATE
        SET label = EXCLUDED.label, color = EXCLUDED.color, icon = EXCLUDED.icon
    `;
    sort += 1;
  }
  console.log(`부서 ${Object.keys(divisions).length}개 시드 완료`);

  // 2) employees
  let n = 0;
  for (const a of agents) {
    const status = STATUSES[n % STATUSES.length];
    const task =
      status === "idle"
        ? null
        : `${a.division_label} 업무 처리 중`;
    await sql`
      INSERT INTO employees (slug, department_slug, name, description, color, emoji, vibe, status, current_task)
      VALUES (${a.slug}, ${a.division}, ${a.name}, ${a.description}, ${a.color}, ${a.emoji}, ${a.vibe}, ${status}, ${task})
      ON CONFLICT (slug) DO UPDATE
        SET name = EXCLUDED.name, description = EXCLUDED.description,
            color = EXCLUDED.color, emoji = EXCLUDED.emoji, vibe = EXCLUDED.vibe
    `;
    n += 1;
  }
  console.log(`직원 ${agents.length}명 시드 완료`);

  // 3) demo sites (학원 관제탑 점검 대상)
  const sites = [
    ["LC Academy", "https://lc-aca.vercel.app", "floor-director"],
    ["학원 등록 포털", "https://lc-aca.vercel.app/office", "floor-admin"],
    ["강사 스케줄", "https://lc-aca.vercel.app/console", "floor-teachers"],
    ["원생 학습실", "https://lc-aca.vercel.app/office", "floor-students"],
  ];
  for (const [name, url, dept] of sites) {
    await sql`
      INSERT INTO sites (name, url, department_slug, status)
      VALUES (${name}, ${url}, ${dept}, 'unknown')
      ON CONFLICT (url) DO NOTHING
    `;
  }
  console.log(`사이트 ${sites.length}개 시드 완료`);

  // 4) seed event
  await sql`INSERT INTO event_log (actor, message) VALUES ('시스템', 'LC Academy 학원 초기화 완료 — 원장·강사·원생 출석')`;

  const [{ count: emp }] = await sql`SELECT count(*)::int AS count FROM employees`;
  const [{ count: dep }] = await sql`SELECT count(*)::int AS count FROM departments`;
  console.log(`\n완료: 부서 ${dep}개, 직원 ${emp}명`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
