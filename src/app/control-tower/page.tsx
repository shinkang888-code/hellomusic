import { Nav } from "../components/nav";
import { ControlTowerClient } from "./control-tower-client";

export const metadata = {
  title: "LogShield 관제탑 | Lonex AI",
  description: "Lonex LogShield 통합 보안 관제 — 사이트 점검, DLP/EDR, UEBA, MITRE ATT&CK",
};

export default function ControlTowerPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Nav active="control-tower" />
      <ControlTowerClient />
    </div>
  );
}
