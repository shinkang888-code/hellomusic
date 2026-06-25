import { Nav } from "../components/nav";
import { OfficeClient } from "./office-client";

export const metadata = {
  title: "학원 빌딩 — LC Academy AI 학원관리",
  description: "원장·강사·원생이 4층 학원 빌딩에서 실시간 운영되는 AI 학원관리 프로그램",
};

export default function OfficePage() {
  return (
    <main className="flex-1 bg-page text-main">
      <Nav active="office" />
      <OfficeClient />
    </main>
  );
}
