import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  isAdminEmail,
  sessionCookieHeader,
  clearSessionCookieHeader,
} from "@/lib/academy-auth";

type GoogleTokenInfo = {
  email?: string;
  email_verified?: string;
  aud?: string;
  exp?: string;
};

export async function POST(req: NextRequest) {
  const { credential } = (await req.json()) as { credential?: string };
  if (!credential) {
    return NextResponse.json({ error: "credential required" }, { status: 400 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "GOOGLE_CLIENT_ID not configured" },
      { status: 503 },
    );
  }

  const infoRes = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
  );
  if (!infoRes.ok) {
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }
  const info = (await infoRes.json()) as GoogleTokenInfo;

  if (info.aud !== clientId) {
    return NextResponse.json({ error: "audience mismatch" }, { status: 401 });
  }
  if (info.email_verified !== "true" || !info.email) {
    return NextResponse.json({ error: "email not verified" }, { status: 401 });
  }
  if (!isAdminEmail(info.email)) {
    return NextResponse.json(
      { error: "관리자 Google 계정이 아닙니다." },
      { status: 403 },
    );
  }

  const token = createSessionToken(info.email);
  const res = NextResponse.json({ ok: true, email: info.email });
  res.headers.set("Set-Cookie", sessionCookieHeader(token));
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", clearSessionCookieHeader());
  return res;
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("hello_admin_session")?.value;
  if (!cookie) return NextResponse.json({ admin: false });
  const { verifySessionToken } = await import("@/lib/academy-auth");
  const email = verifySessionToken(cookie);
  return NextResponse.json({ admin: !!email, email: email || undefined });
}
