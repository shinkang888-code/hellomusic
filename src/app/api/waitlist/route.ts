import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "올바른 이메일을 입력해 주세요." },
        { status: 400 },
      );
    }

    await sql`
      INSERT INTO waitlist (email)
      VALUES (${email})
      ON CONFLICT (email) DO NOTHING
    `;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/waitlist]", error);
    return NextResponse.json(
      { error: "등록에 실패했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}
