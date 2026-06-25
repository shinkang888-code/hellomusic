import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const SSO_TTL_MS = 5 * 60 * 1000; // 5분

function ssoSecret(): string {
  return (
    process.env.HELLO_SSO_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.GOOGLE_CLIENT_SECRET ||
    "hello-music-dev-secret"
  );
}

function sign(body: string): string {
  return createHmac("sha256", ssoSecret()).update(body).digest("base64url");
}

/** lc_aca → helloap 단방향 SSO 토큰 (이메일은 Google 관리자 로그인으로 검증된 값) */
export function createHelloManagerSsoToken(email: string): string {
  const exp = Date.now() + SSO_TTL_MS;
  const nonce = randomBytes(8).toString("base64url");
  const body = `${email.toLowerCase()}|${exp}|${nonce}`;
  return `${body}|${sign(body)}`;
}

export function verifyHelloManagerSsoToken(token: string): { email: string } | null {
  const parts = token.split("|");
  if (parts.length !== 4) return null;
  const [email, expStr, nonce, sig] = parts;
  const body = `${email}|${expStr}|${nonce}`;
  const expected = sign(body);
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return null;
  if (!timingSafeEqual(sigBuf, expBuf)) return null;
  if (Number(expStr) < Date.now()) return null;
  if (!email.includes("@")) return null;
  return { email };
}
