import { Nav } from "../components/nav";
import { ConsoleClient } from "./console-client";

export const metadata = {
  title: "관리 콘솔 — lonex AI 컴퍼니",
  description: "AI 직원 상태 관리, 업무 지시, 할 일판 관리 콘솔",
};

export default function ConsolePage() {
  return (
    <main className="flex-1 bg-page text-main">
      <Nav active="console" />
      <ConsoleClient />
    </main>
  );
}
