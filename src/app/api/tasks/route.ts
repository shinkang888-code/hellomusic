import { NextResponse } from "next/server";
import { sql, type Task } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tasks = (await sql`
      SELECT id, title, status, department_slug, employee_id, source, created_at
      FROM tasks ORDER BY created_at DESC LIMIT 100
    `) as Task[];
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("[api/tasks GET]", error);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      title?: string;
      department_slug?: string;
      employee_id?: number;
    };
    if (!body.title?.trim()) {
      return NextResponse.json({ error: "제목을 입력하세요." }, { status: 400 });
    }

    const rows = (await sql`
      INSERT INTO tasks (title, department_slug, employee_id, source)
      VALUES (${body.title.trim()}, ${body.department_slug ?? null}, ${body.employee_id ?? null}, 'manual')
      RETURNING id, title, status
    `) as Task[];

    await sql`INSERT INTO event_log (actor, message) VALUES ('관리자', ${`새 업무 등록 — ${body.title.trim()}`})`;

    return NextResponse.json({ ok: true, task: rows[0] });
  } catch (error) {
    console.error("[api/tasks POST]", error);
    return NextResponse.json({ error: "등록 실패" }, { status: 500 });
  }
}
