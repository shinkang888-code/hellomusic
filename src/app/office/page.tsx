import Script from "next/script";
import { Nav } from "../components/nav";
import { OfficeClient } from "./office-client";

export const metadata = {
  title: "AI 학원 — Hello Music Academy",
  description:
    "헬로뮤직 1층 학원 평면도. 원장·강사·원생 2D 캐릭터가 Piano Practice·Grand Studio에서 실시간 활동.",
};

export default function OfficePage() {
  return (
    <main className="flex-1 bg-page text-main">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="lazyOnload"
      />
      <Nav active="office" />
      <OfficeClient />
    </main>
  );
}
