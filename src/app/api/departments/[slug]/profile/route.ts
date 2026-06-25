import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

const MAX_AVATAR_LEN = 200_000;
const MAX_NAME_LEN = 40;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "부서 없음" }, { status: 400 });
    }

    const body = (await request.json()) as {
      name?: string;
      avatar?: string | null;
      clearAvatar?: boolean;
    };

    const nameProvided = body.name !== undefined;
    const name = nameProvided
      ? body.name!.trim().slice(0, MAX_NAME_LEN) || null
      : null;

    let avatarProvided = false;
    let avatar: string | null = null;
    if (body.clearAvatar) {
      avatarProvided = true;
      avatar = null;
    } else if (body.avatar !== undefined) {
      avatarProvided = true;
      if (body.avatar === null || body.avatar === "") {
        avatar = null;
      } else {
        const raw = body.avatar.replace(/^data:image\/\w+;base64,/, "").trim();
        if (raw.length > MAX_AVATAR_LEN) {
          return NextResponse.json({ error: "이미지가 너무 큽니다." }, { status: 400 });
        }
        avatar = raw;
      }
    }

    let rows: {
      slug: string;
      label: string;
      real_member_name: string | null;
      has_real_avatar: boolean;
    }[];

    if (nameProvided && avatarProvided) {
      rows = (await sql`
        UPDATE departments
        SET real_member_name = ${name}, real_member_avatar = ${avatar}
        WHERE slug = ${slug}
        RETURNING slug, label, real_member_name,
          (real_member_avatar IS NOT NULL AND real_member_avatar <> '') AS has_real_avatar
      `) as typeof rows;
    } else if (nameProvided) {
      rows = (await sql`
        UPDATE departments
        SET real_member_name = ${name}
        WHERE slug = ${slug}
        RETURNING slug, label, real_member_name,
          (real_member_avatar IS NOT NULL AND real_member_avatar <> '') AS has_real_avatar
      `) as typeof rows;
    } else if (avatarProvided) {
      rows = (await sql`
        UPDATE departments
        SET real_member_avatar = ${avatar}
        WHERE slug = ${slug}
        RETURNING slug, label, real_member_name,
          (real_member_avatar IS NOT NULL AND real_member_avatar <> '') AS has_real_avatar
      `) as typeof rows;
    } else {
      return NextResponse.json({ error: "변경할 항목이 없습니다." }, { status: 400 });
    }

    if (rows.length === 0) {
      return NextResponse.json({ error: "부서를 찾을 수 없습니다." }, { status: 404 });
    }

    const dept = rows[0];
    const actor = dept.real_member_name ?? dept.label;
    await sql`
      INSERT INTO event_log (actor, message)
      VALUES (${actor}, ${`${dept.label} 실무 담당 프로필이 업데이트되었습니다.`})
    `;

    return NextResponse.json({
      ok: true,
      department: dept,
      avatarVersion: Date.now(),
    });
  } catch (error) {
    console.error("[api/departments/:slug/profile]", error);
    return NextResponse.json({ error: "프로필 저장 실패" }, { status: 500 });
  }
}
