import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

const VALID = ["working", "meeting", "review", "idle", "error"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const empId = Number(id);
    if (!Number.isInteger(empId)) {
      return NextResponse.json({ error: "잘못된 ID" }, { status: 400 });
    }

    const body = (await request.json()) as {
      status?: string;
      current_task?: string;
    };

    if (body.status && !VALID.includes(body.status)) {
      return NextResponse.json({ error: "잘못된 상태값" }, { status: 400 });
    }

    const rows = (await sql`
      UPDATE employees
      SET status = COALESCE(${body.status ?? null}, status),
          current_task = COALESCE(${body.current_task ?? null}, current_task),
          updated_at = now()
      WHERE id = ${empId}
      RETURNING id, name, status, current_task
    `) as { id: number; name: string; status: string; current_task: string }[];

    if (rows.length === 0) {
      return NextResponse.json({ error: "직원 없음" }, { status: 404 });
    }

    const emp = rows[0];
    await sql`
      INSERT INTO event_log (actor, message)
      VALUES (${emp.name}, ${`상태 → ${emp.status}${emp.current_task ? ` · ${emp.current_task}` : ""}`})
    `;

    return NextResponse.json({ ok: true, employee: emp });
  } catch (error) {
    console.error("[api/employees/:id]", error);
    return NextResponse.json({ error: "업데이트 실패" }, { status: 500 });
  }
}
