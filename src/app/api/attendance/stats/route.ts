import { NextResponse } from "next/server";
import { getAdminEmailFromCookies } from "@/lib/academy-auth";
import {
  getTodayAttendanceStats,
  getTodayRecords,
} from "@/lib/attendance-db";

export const dynamic = "force-dynamic";

/** 관리자만 — HelloManager 연동 오늘 등·퇴원 기반 근무/회의/대기 */
export async function GET() {
  const admin = await getAdminEmailFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "관리자 로그인 필요" }, { status: 403 });
  }

  try {
    const stats = await getTodayAttendanceStats();
    const records = await getTodayRecords(stats.date);
    return NextResponse.json({
      admin: true,
      stats,
      records: records.slice(-50),
      source: "hello_manager",
    });
  } catch (error) {
    console.error("[api/attendance/stats]", error);
    return NextResponse.json(
      { error: "등원 기록을 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}
