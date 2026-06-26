/** agency.json → resync SQL JSON (Neon MCP용) */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(
  readFileSync(join(__dirname, "../src/data/agency.json"), "utf-8"),
);

const esc = (s) => String(s).replace(/'/g, "''");
const validEmp = data.agents.map((a) => `'${a.slug}'`).join(",");
const validDept = Object.keys(data.divisions)
  .map((s) => `'${s}'`)
  .join(",");
const STATUSES = ["working", "meeting", "review", "idle", "idle", "working"];
const stmts = [];

// 1) Hello Music 부서 먼저 upsert (sites FK)
let sort = 0;
for (const [slug, meta] of Object.entries(data.divisions)) {
  stmts.push(
    `INSERT INTO departments (slug, label, color, icon, sort) VALUES ('${slug}', '${esc(meta.label)}', '${meta.color}', '${meta.icon}', ${sort}) ON CONFLICT (slug) DO UPDATE SET label = EXCLUDED.label, color = EXCLUDED.color, icon = EXCLUDED.icon, sort = EXCLUDED.sort`,
  );
  sort += 1;
}

stmts.push(
  `UPDATE sites SET department_slug = 'room-director' WHERE department_slug IS NOT NULL AND department_slug NOT IN (${validDept})`,
);
stmts.push(
  `UPDATE tasks SET department_slug = NULL WHERE department_slug IS NOT NULL AND department_slug NOT IN (${validDept})`,
);
stmts.push(
  `DELETE FROM tasks WHERE employee_id IN (SELECT id FROM employees WHERE slug NOT IN (${validEmp}))`,
);
stmts.push(`DELETE FROM employees WHERE slug NOT IN (${validEmp})`);

data.agents.forEach((a, i) => {
  const status = STATUSES[i % STATUSES.length];
  const task =
    status === "idle" ? "NULL" : `'${esc(a.division_label + " 업무 처리 중")}'`;
  stmts.push(
    `INSERT INTO employees (slug, department_slug, name, description, color, emoji, vibe, status, current_task) VALUES ('${a.slug}', '${a.division}', '${esc(a.name)}', '${esc(a.description)}', '${a.color}', '${esc(a.emoji)}', '${esc(a.vibe)}', '${status}', ${task}) ON CONFLICT (slug) DO UPDATE SET department_slug = EXCLUDED.department_slug, name = EXCLUDED.name, description = EXCLUDED.description, color = EXCLUDED.color, emoji = EXCLUDED.emoji, vibe = EXCLUDED.vibe, status = EXCLUDED.status, current_task = EXCLUDED.current_task`,
  );
});

stmts.push(`DELETE FROM departments WHERE slug NOT IN (${validDept})`);

const sites = [
  ["Hello Music Academy", "https://lc-aca.vercel.app", "room-director"],
  ["헬로뮤직 공식", "https://hellomusic.co.kr/", "room-admin"],
  ["네이버 블로그", "https://blog.naver.com/hellomusic0104", "room-teachers"],
  ["AI 학원", "https://lc-aca.vercel.app/office", "room-students"],
];
for (const [name, url, dept] of sites) {
  stmts.push(
    `INSERT INTO sites (name, url, department_slug, status) VALUES ('${esc(name)}', '${url}', '${dept}', 'unknown') ON CONFLICT (url) DO UPDATE SET name = EXCLUDED.name, department_slug = EXCLUDED.department_slug`,
  );
}

stmts.push(
  `INSERT INTO academy_info (id, public_notice, blog_url) VALUES (1, '【공지되는 게시글】\nHello Music Academy · 헬로뮤직 피아노 전문 학원\n\n· 1:1 맞춤 피아노 레슨\n· 체험·상담: 02-555-2040\n· Blog: https://blog.naver.com/hellomusic0104', 'https://blog.naver.com/hellomusic0104') ON CONFLICT (id) DO UPDATE SET public_notice = EXCLUDED.public_notice, blog_url = EXCLUDED.blog_url, updated_at = now()`,
);
stmts.push(
  `INSERT INTO event_log (actor, message) VALUES ('시스템', 'Hello Music Academy 데이터 재동기화 — room-* 부서·피아노 학원 직원 반영')`,
);

writeFileSync(join(__dirname, ".resync-sql.json"), JSON.stringify(stmts, null, 2));
console.log(`Generated ${stmts.length} SQL statements`);
