import { NextResponse } from "next/server";
import { sql, type Model } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = (await sql`
      SELECT id, repo_id, category, name, downloads, likes, note
      FROM models
      ORDER BY downloads DESC
    `) as Model[];

    return NextResponse.json({ count: rows.length, models: rows });
  } catch (error) {
    console.error("[api/models]", error);
    return NextResponse.json(
      { error: "모델 목록을 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}
