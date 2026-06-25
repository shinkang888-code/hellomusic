import { NextResponse } from "next/server";
import { getAdminEmailFromCookies } from "@/lib/academy-auth";
import {
  helloManagerLoginUrl,
  helloManagerSsoUrl,
} from "@/lib/hello-manager-config";
import { createHelloManagerSsoToken } from "@/lib/hello-manager-sso";

/** HelloManager 새 탭 URL — Google 연동 관리자면 SSO 토큰 포함 */
export async function GET() {
  try {
    const adminEmail = await getAdminEmailFromCookies();

    if (adminEmail) {
      const token = createHelloManagerSsoToken(adminEmail);
      return NextResponse.json({
        url: helloManagerSsoUrl(token),
        mode: "sso",
        email: adminEmail,
      });
    }

    return NextResponse.json({
      url: helloManagerLoginUrl(),
      mode: "login",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { url: helloManagerLoginUrl(), mode: "fallback" },
      { status: 200 },
    );
  }
}
