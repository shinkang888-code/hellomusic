import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const rows = (await sql`
      SELECT real_member_avatar FROM departments WHERE slug = ${slug}
    `) as { real_member_avatar: string | null }[];

    const b64 = rows[0]?.real_member_avatar;
    if (!b64) {
      return new NextResponse(null, { status: 404 });
    }

    const buf = Buffer.from(b64, "base64");
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[api/departments/:slug/avatar]", error);
    return new NextResponse(null, { status: 500 });
  }
}
