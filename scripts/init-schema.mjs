// LC Academy Neon DB 스키마 초기화
// 실행: DATABASE_URL=... node scripts/init-schema.mjs
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL 환경변수가 필요합니다.");
  process.exit(1);
}
const sql = neon(databaseUrl);

async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS departments (
      slug TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#64748b',
      icon TEXT,
      sort INT NOT NULL DEFAULT 0,
      real_member_name TEXT,
      real_member_avatar TEXT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS employees (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      department_slug TEXT NOT NULL REFERENCES departments(slug),
      name TEXT NOT NULL,
      description TEXT,
      color TEXT,
      emoji TEXT,
      vibe TEXT,
      status TEXT NOT NULL DEFAULT 'idle',
      current_task TEXT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sites (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      url TEXT UNIQUE NOT NULL,
      department_slug TEXT REFERENCES departments(slug),
      status TEXT NOT NULL DEFAULT 'unknown',
      http_code INT,
      last_checked TIMESTAMPTZ
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'todo',
      department_slug TEXT REFERENCES departments(slug),
      employee_id INT REFERENCES employees(id),
      source TEXT NOT NULL DEFAULT 'manual',
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS event_log (
      id SERIAL PRIMARY KEY,
      ts TIMESTAMPTZ DEFAULT now(),
      actor TEXT,
      message TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS models (
      id SERIAL PRIMARY KEY,
      repo_id TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      downloads BIGINT DEFAULT 0,
      likes INT DEFAULT 0,
      note TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS waitlist (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS academy_info (
      id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      public_notice TEXT NOT NULL DEFAULT '',
      private_notes TEXT NOT NULL DEFAULT '',
      blog_url TEXT,
      blog_cache TEXT,
      blog_cache_at TIMESTAMPTZ,
      updated_by TEXT,
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  `;

  const infoRows = await sql`SELECT id FROM academy_info WHERE id = 1`;
  if (infoRows.length === 0) {
    await sql`
      INSERT INTO academy_info (id, public_notice, blog_url)
      VALUES (
        1,
        '【공지되는 게시글】\nHello Music Academy · 헬로뮤직 피아노 전문 학원\n\n· 1:1 맞춤 피아노 레슨\n· 체험·상담: 02-555-2040\n· Blog: https://blog.naver.com/hellomusic0104',
        'https://blog.naver.com/hellomusic0104'
      )
    `;
  }

  console.log("LC Academy DB 스키마 초기화 완료 (academy_info 포함)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
