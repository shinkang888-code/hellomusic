import { NextRequest, NextResponse } from "next/server";
import {
  getAcademyInfo,
  updateAcademyInfo,
} from "@/lib/academy-info-db";
import { getAdminEmailFromCookies } from "@/lib/academy-auth";
import { fetchBlogSummary } from "@/lib/blog-fetch";

export async function GET() {
  try {
    const row = await getAcademyInfo();
    const admin = await getAdminEmailFromCookies();
    if (admin) {
      return NextResponse.json({
        publicNotice: row.public_notice,
        privateNotes: row.private_notes,
        blogUrl: row.blog_url,
        blogCacheAt: row.blog_cache_at,
        updatedAt: row.updated_at,
        updatedBy: row.updated_by,
        isAdmin: true,
      });
    }
    return NextResponse.json({
      publicNotice: row.public_notice,
      blogUrl: row.blog_url,
      isAdmin: false,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "load failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await getAdminEmailFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "관리자 로그인 필요" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      publicNotice?: string;
      privateNotes?: string;
      blogUrl?: string | null;
      refreshBlog?: boolean;
    };

    let blogCache: string | null | undefined;
    let blogCacheAt: string | null | undefined;

    const blogUrl =
      body.blogUrl !== undefined ? body.blogUrl?.trim() || null : undefined;

    if (body.refreshBlog && (blogUrl || (await getAcademyInfo()).blog_url)) {
      const url = blogUrl ?? (await getAcademyInfo()).blog_url!;
      try {
        blogCache = await fetchBlogSummary(url);
        blogCacheAt = new Date().toISOString();
      } catch (e) {
        console.error("blog fetch", e);
        return NextResponse.json(
          { error: "블로그 정보를 가져오지 못했습니다." },
          { status: 502 },
        );
      }
    }

    const row = await updateAcademyInfo(
      {
        public_notice: body.publicNotice,
        private_notes: body.privateNotes,
        blog_url: blogUrl,
        blog_cache: blogCache,
        blog_cache_at: blogCacheAt,
      },
      admin,
    );

    return NextResponse.json({
      ok: true,
      publicNotice: row.public_notice,
      privateNotes: row.private_notes,
      blogUrl: row.blog_url,
      blogCacheAt: row.blog_cache_at,
      updatedAt: row.updated_at,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "save failed" }, { status: 500 });
  }
}
