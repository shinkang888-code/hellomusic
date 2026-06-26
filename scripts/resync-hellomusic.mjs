/**
 * Neon DB → Hello Music (agency.json) 전체 재동기화
 * - 예전 floor-* 부서·과목별 강사 데이터 제거
 * - room-* 부서 + 헬로뮤직 직원·사이트 upsert
 *
 * 실행: DATABASE_URL=... node scripts/resync-hellomusic.mjs
 */
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

const divisions = data.divisions;
const agents = data.agents;
const validDeptSlugs = Object.keys(divisions);
const validEmpSlugs = agents.map((a) => a.slug);

const STATUSES = ["working", "meeting", "review", "idle", "idle", "working"];

const SITES = [
  ["Hello Music Academy", "https://lc-aca.vercel.app", "room-director"],
  ["헬로뮤직 공식", "https://hellomusic.co.kr/", "room-admin"],
  ["네이버 블로그", "https://blog.naver.com/hellomusic0104", "room-teachers"],
  ["AI 학원", "https://lc-aca.vercel.app/office", "room-students"],
];

async function main() {
  console.log("Hello Music DB 재동기화 시작…\n");

  // 1) Hello Music 부서 먼저 upsert (sites FK)
  let sort = 0;
  for (const [slug, meta] of Object.entries(divisions)) {
    await sql`
      INSERT INTO departments (slug, label, color, icon, sort)
      VALUES (${slug}, ${meta.label}, ${meta.color}, ${meta.icon}, ${sort})
      ON CONFLICT (slug) DO UPDATE
        SET label = EXCLUDED.label,
            color = EXCLUDED.color,
            icon = EXCLUDED.icon,
            sort = EXCLUDED.sort
    `;
    sort += 1;
  }
  console.log(`부서 upsert: ${validDeptSlugs.length}개`);

  await sql`
    UPDATE sites SET department_slug = 'room-director'
    WHERE department_slug IS NOT NULL
      AND NOT (department_slug = ANY(${validDeptSlugs}))
  `;
  await sql`
    UPDATE tasks SET department_slug = NULL
    WHERE department_slug IS NOT NULL
      AND NOT (department_slug = ANY(${validDeptSlugs}))
  `;

  const removedTasks = await sql`
    DELETE FROM tasks
    WHERE employee_id IN (
      SELECT id FROM employees WHERE NOT (slug = ANY(${validEmpSlugs}))
    )
  `;
  console.log(`tasks 정리: ${removedTasks.length ?? 0}건`);

  const removedEmps = await sql`
    DELETE FROM employees
    WHERE NOT (slug = ANY(${validEmpSlugs}))
    RETURNING slug
  `;
  console.log(
    `예전 직원 삭제: ${removedEmps.length}명`,
    removedEmps.map((r) => r.slug).join(", ") || "(없음)",
  );

  // 2) Hello Music 직원 upsert (department_slug room-* 로 맞춤)
  let n = 0;
  for (const a of agents) {
    const status = STATUSES[n % STATUSES.length];
    const task =
      status === "idle" ? null : `${a.division_label} 업무 처리 중`;
    await sql`
      INSERT INTO employees (slug, department_slug, name, description, color, emoji, vibe, status, current_task)
      VALUES (${a.slug}, ${a.division}, ${a.name}, ${a.description}, ${a.color}, ${a.emoji}, ${a.vibe}, ${status}, ${task})
      ON CONFLICT (slug) DO UPDATE
        SET department_slug = EXCLUDED.department_slug,
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            color = EXCLUDED.color,
            emoji = EXCLUDED.emoji,
            vibe = EXCLUDED.vibe,
            status = EXCLUDED.status,
            current_task = EXCLUDED.current_task
    `;
    n += 1;
  }
  console.log(`직원 upsert: ${agents.length}명`);

  const removedDepts = await sql`
    DELETE FROM departments
    WHERE NOT (slug = ANY(${validDeptSlugs}))
    RETURNING slug
  `;
  console.log(
    `예전 부서 삭제: ${removedDepts.length}개`,
    removedDepts.map((r) => r.slug).join(", ") || "(없음)",
  );

  // 3) 사이트 upsert
  for (const [name, url, dept] of SITES) {
    await sql`
      INSERT INTO sites (name, url, department_slug, status)
      VALUES (${name}, ${url}, ${dept}, 'unknown')
      ON CONFLICT (url) DO UPDATE
        SET name = EXCLUDED.name,
            department_slug = EXCLUDED.department_slug
    `;
  }
  console.log(`사이트 upsert: ${SITES.length}개`);

  // 6) academy_info Hello Music 공지
  await sql`
    INSERT INTO academy_info (id, public_notice, blog_url)
    VALUES (
      1,
      '【공지되는 게시글】\nHello Music Academy · 헬로뮤직 피아노 전문 학원\n\n· 1:1 맞춤 피아노 레슨\n· 체험·상담: 02-555-2040\n· Blog: https://blog.naver.com/hellomusic0104',
      'https://blog.naver.com/hellomusic0104'
    )
    ON CONFLICT (id) DO UPDATE
      SET public_notice = EXCLUDED.public_notice,
          blog_url = EXCLUDED.blog_url,
          updated_at = now()
  `;

  // 7) 이벤트 로그
  await sql`
    INSERT INTO event_log (actor, message)
    VALUES ('시스템', 'Hello Music Academy 데이터 재동기화 — room-* 부서·피아노 학원 직원 반영')
  `;

  const depts = await sql`SELECT slug, label FROM departments ORDER BY sort`;
  const emps = await sql`
    SELECT slug, name, department_slug FROM employees ORDER BY department_slug, id
  `;

  console.log("\n=== 동기화 결과 ===");
  console.log("부서:", depts.map((d) => `${d.slug}(${d.label})`).join(", "));
  console.log("직원:", emps.length, "명");
  for (const e of emps) {
    console.log(`  · ${e.slug} — ${e.name} @ ${e.department_slug}`);
  }
  console.log("\n완료.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
