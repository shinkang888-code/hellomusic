/** HelloManager(helloap) 연동 설정 */

export const HELLO_MANAGER_BASE_URL =
  process.env.NEXT_PUBLIC_HELLO_MANAGER_URL ||
  process.env.HELLO_MANAGER_URL ||
  "https://helloappbeta.vercel.app";

export const HELLO_MANAGER_LOGIN_PATH = "/login";
export const HELLO_MANAGER_DASHBOARD_PATH = "/";
export const HELLO_MANAGER_SSO_PATH = "/sso";

export function helloManagerLoginUrl(from = "lc_aca"): string {
  const u = new URL(HELLO_MANAGER_LOGIN_PATH, HELLO_MANAGER_BASE_URL);
  u.searchParams.set("from", from);
  return u.toString();
}

export function helloManagerSsoUrl(token: string, next = HELLO_MANAGER_DASHBOARD_PATH): string {
  const u = new URL(HELLO_MANAGER_SSO_PATH, HELLO_MANAGER_BASE_URL);
  u.searchParams.set("token", token);
  u.searchParams.set("next", next);
  u.searchParams.set("from", "lc_aca");
  return u.toString();
}
