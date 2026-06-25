import { Nav } from "../components/nav";
import { OfficeClient } from "./office-client";

export const metadata = {
  title: "AI 오피스 — lonex AI 컴퍼니 라이브 오피스",
  description: "217명의 AI 직원이 16개 부서에서 실시간 근무하는 라이브 오피스",
};

export default function OfficePage() {
  return (
    <main className="flex-1 bg-page text-main">
      <Nav active="office" />
      <OfficeClient />
    </main>
  );
}
