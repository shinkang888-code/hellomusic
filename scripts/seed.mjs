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

  // 3) demo sites (Hello Music 학원 관제)
  const sites = [
    ["Hello Music Academy", "https://lc-aca.vercel.app", "room-director"],
    ["헬로뮤직 공식", "https://hellomusic.co.kr/", "room-admin"],
    ["네이버 블로그", "https://blog.naver.com/hellomusic0104", "room-teachers"],
    ["AI 학원", "https://lc-aca.vercel.app/office", "room-students"],
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
  await sql`INSERT INTO event_log (actor, message) VALUES ('시스템', 'Hello Music Academy 학원 초기화 — 1F 평면도 가동')`;

  // 5) HelloManager 연동 — 오늘 등·퇴원 샘플 (KST)
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
  const samples = [
    ["dir-1", "김원장", "director", "director-principal", "check_in", "09:00"],
    ["dir-1", "김원장", "director", "director-principal", "meeting_start", "10:30"],
    ["tea-1", "박서연", "teacher", "teacher-park", "check_in", "09:15"],
    ["stu-1", "지아", "student", "student-jia", "check_in", "14:00"],
    ["stu-2", "도윤", "student", "student-doyoon", "check_in", "15:30"],
    ["stu-3", "서윤", "student", "student-seoyoon", "check_out", "12:00"],
    ["adm-1", "박행정", "staff", "admin-lead", "check_in", "08:50"],
  ];
  for (const [mid, name, role, slug, ev, hm] of samples) {
    const recorded = `${today}T${hm}:00+09:00`;
    await sql`
      INSERT INTO attendance_records (
        external_member_id, member_name, member_role, employee_slug,
        event_type, recorded_at, attendance_date, source
      )
      VALUES (
        ${mid}, ${name}, ${role}, ${slug}, ${ev}, ${recorded}::timestamptz,
        ${today}::date, 'hello_manager'
      )
      ON CONFLICT (external_member_id, event_type, recorded_at) DO NOTHING
    `;
  }
  console.log(`등·퇴원 샘플 ${samples.length}건 (${today})`);

  const [{ count: emp }] = await sql`SELECT count(*)::int AS count FROM employees`;
  const [{ count: dep }] = await sql`SELECT count(*)::int AS count FROM departments`;
  console.log(`\n완료: 부서 ${dep}개, 직원 ${emp}명`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
