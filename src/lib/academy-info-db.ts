import { sql } from "@/lib/db";

export type AcademyInfoRow = {
  id: number;
  public_notice: string;
  private_notes: string;
  blog_url: string | null;
  blog_cache: string | null;
  blog_cache_at: string | null;
  updated_by: string | null;
  updated_at: string;
};

const DEFAULT_PUBLIC = `【공지되는 게시글】
Hello Music Academy · 헬로뮤직 피아노 전문 학원

· 1:1 맞춤 피아노 레슨 (초급~전공·성인)
· Piano Practice 1~5, Grand Piano Studio, Theory Room
· 체험 레슨·상담: 02-555-2040
· 카카오 @hello_piano
· Blog: https://blog.naver.com/hellomusic0104`;

export async function ensureAcademyInfoTable(): Promise<void> {
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
  const rows = await sql`SELECT id FROM academy_info WHERE id = 1`;
  if ((rows as { id: number }[]).length === 0) {
    await sql`
      INSERT INTO academy_info (id, public_notice, blog_url)
      VALUES (1, ${DEFAULT_PUBLIC}, 'https://blog.naver.com/hellomusic0104')
    `;
  }
}

export async function getAcademyInfo(): Promise<AcademyInfoRow> {
  await ensureAcademyInfoTable();
  const rows = (await sql`
    SELECT id, public_notice, private_notes, blog_url, blog_cache,
           blog_cache_at::text, updated_by, updated_at::text
    FROM academy_info WHERE id = 1
  `) as AcademyInfoRow[];
  return rows[0];
}

export async function updateAcademyInfo(
  patch: {
    public_notice?: string;
    private_notes?: string;
    blog_url?: string | null;
    blog_cache?: string | null;
    blog_cache_at?: string | null;
  },
  updatedBy: string,
): Promise<AcademyInfoRow> {
  await ensureAcademyInfoTable();
  const cur = await getAcademyInfo();
  await sql`
    UPDATE academy_info SET
      public_notice = ${patch.public_notice ?? cur.public_notice},
      private_notes = ${patch.private_notes ?? cur.private_notes},
      blog_url = ${patch.blog_url !== undefined ? patch.blog_url : cur.blog_url},
      blog_cache = ${patch.blog_cache !== undefined ? patch.blog_cache : cur.blog_cache},
      blog_cache_at = ${patch.blog_cache_at !== undefined ? patch.blog_cache_at : cur.blog_cache_at},
      updated_by = ${updatedBy},
      updated_at = now()
    WHERE id = 1
  `;
  return getAcademyInfo();
}

/** AI·상담용 전체 컨텍스트 (공개+비공개+블로그 캐시) */
export function buildKnowledgeContext(row: AcademyInfoRow): string {
  const parts = [row.public_notice, row.private_notes].filter(Boolean);
  if (row.blog_cache?.trim()) {
    parts.push(`【블로그 최근 글 요약】\n${row.blog_cache.slice(0, 6000)}`);
  }
  return parts.join("\n\n---\n\n");
}
