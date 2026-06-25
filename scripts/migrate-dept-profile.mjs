// 부서 실무 담당 프로필 컬럼 추가
// 실행: DATABASE_URL=... node scripts/migrate-dept-profile.mjs
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL 환경변수가 필요합니다.");
  process.exit(1);
}
const sql = neon(databaseUrl);

await sql`ALTER TABLE departments ADD COLUMN IF NOT EXISTS real_member_name TEXT`;
await sql`ALTER TABLE departments ADD COLUMN IF NOT EXISTS real_member_avatar TEXT`;
console.log("departments.real_member_name / real_member_avatar 컬럼 준비 완료");
