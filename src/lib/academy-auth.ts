import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "hello_admin_session";
const MAX_AGE = 60 * 60 * 24; // 24h

function secret(): string {
  return (
    process.env.AUTH_SECRET ||
    process.env.GOOGLE_CLIENT_SECRET ||
    "hello-music-dev-secret"
  );
}

export function adminEmails(): string[] {
  return (process.env.ACADEMY_ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string): boolean {
  const allowed = adminEmails();
  if (allowed.length === 0) return false;
  return allowed.includes(email.trim().toLowerCase());
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken(email: string): string {
  const exp = Date.now() + MAX_AGE * 1000;
  const body = `${email}|${exp}`;
  return `${body}|${sign(body)}`;
}

export function verifySessionToken(token: string): string | null {
  const parts = token.split("|");
  if (parts.length !== 3) return null;
  const [email, expStr, sig] = parts;
  const body = `${email}|${expStr}`;
  const expected = sign(body);
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return null;
  if (!timingSafeEqual(sigBuf, expBuf)) return null;
  if (Number(expStr) < Date.now()) return null;
  if (!isAdminEmail(email)) return null;
  return email;
}

export async function getAdminEmailFromCookies(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function sessionCookieHeader(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${secure}`;
}

export function clearSessionCookieHeader(): string {
  return `${COOKIE}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`;
}

export { COOKIE };
