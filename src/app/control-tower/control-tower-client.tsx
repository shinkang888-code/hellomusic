"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { type Site } from "../office/types";
import { useLogshieldEvents } from "./use-logshield-events";
import { hourlyTrend } from "@/lib/logshield/mock-data";
import { MITRE_TECHNIQUES } from "@/lib/logshield/security-engine";

type CheckResult = {
  url: string;
  name: string;
  status: string;
  code: number | null;
  securityScore: number;
  securityGrade: string;
  findings: Array<{
    id: string;
    severity: string;
    title: string;
    detail: string;
    mitre?: string;
    engine?: string;
  }>;
};

type CheckResponse = {
  ok?: boolean;
  error?: string;
  checked?: number;
  down?: number;
  highRisk?: number;
  results?: CheckResult[];
};

const FEATURES = [
  {
    icon: "🔌",
    title: "USB DLP",
    desc: "미니필터 드라이버 기반 매체 반출 차단 · 승인 워크플로우",
  },
  {
    icon: "🌐",
    title: "네트워크 접근 통제",
    desc: "WFP Callout + TrafficGPT 악성 트래픽 의도 분류",
  },
  {
    icon: "🖨️",
    title: "프린트 보안",
    desc: "XPS 워터마크 · PII(gliner) 자동 탐지",
  },
  {
    icon: "🧠",
    title: "AI UEBA",
    desc: "Transformer+GNN 세션 위협 스코어 (CERT r6.2)",
  },
  {
    icon: "⛓️",
    title: "블록체인 무결성",
    desc: "Hyperledger Fabric 2.5 감사 로그 앵커",
  },
  {
    icon: "🛡️",
    title: "랜섬웨어 차단",
    desc: "AURA PE 스캔 · 파일 엔트로피 기반 TerminateProcess",
  },
];

const gradeStyle: Record<string, string> = {
  critical: "text-rose-400 bg-rose-500/15 ring-rose-500/40",
  high: "text-orange-400 bg-orange-500/15 ring-orange-500/40",
  medium: "text-yellow-400 bg-yellow-500/15 ring-yellow-500/40",
  low: "text-emerald-400 bg-emerald-500/15 ring-emerald-500/40",
};

const sevDot: Record<string, string> = {
  critical: "bg-rose-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-blue-400",
  info: "bg-slate-500",
};

export function ControlTowerClient() {
  const [sites, setSites] = useState<Site[]>([]);
  const [checkData, setCheckData] = useState<CheckResponse | null>(null);
  const [checking, setChecking] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { events, stats, newAlertCount, clearAlerts } = useLogshieldEvents(12);

  const loadSites = useCallback(async () => {
    const res = await fetch("/api/company", { cache: "no-store" });
    const data = await res.json();
    if (!data.error) setSites(data.sites ?? []);
  }, []);

  useEffect(() => {
    loadSites();
  }, [loadSites]);

  async function runCheck() {
    setChecking(true);
    try {
      const res = await fetch("/api/sites/check", { method: "POST" });
      const data = (await res.json()) as CheckResponse;
      setCheckData(data);
      await loadSites();
    } finally {
      setChecking(false);
    }
  }

  const resultMap = new Map(
    (checkData?.results ?? []).map((r) => [r.url, r]),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* 히어로 */}
      <div className="relative overflow-hidden rounded-2xl border border-theme bg-hero p-6 sm:p-8">
        <div className="absolute -right-8 -top-8 size-40 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              Lonex LogShield × 관제탑
            </p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              🛰 통합 보안 관제센터
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-sub">
              기존 <strong className="text-sub">관제탑 사이트 점검</strong>은
              등록 URL에 HTTP 요청만 보내 up/down을 표시하던 단순 헬스체크였습니다.
              이제 <strong className="text-blue-300">LogShield</strong> 엔진(SecEBL,
              TrafficGPT, MITRE ATT&CK, UEBA)과 연동해{" "}
              <strong className="text-sub">가용성 + 웹 보안 헤더 + 행동 분석</strong>
              을 함께 점검합니다.
            </p>
            <p className="mt-1 text-xs text-muted">
              소스:{" "}
              <a
                href="https://github.com/shinkang888-code/logshield"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline"
              >
                shinkang888-code/logshield
              </a>
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <button
              onClick={runCheck}
              disabled={checking}
              className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 disabled:opacity-50"
            >
              {checking ? "LogShield 점검 중…" : "🛰 전체 사이트 보안 점검"}
            </button>
            <Link
              href="/office"
              className="text-center text-xs text-muted hover:text-main"
            >
              ← AI 오피스로 돌아가기
            </Link>
          </div>
        </div>
      </div>

      {/* KPI — LogShield 엔드포인트 시뮬 */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "관리 엔드포인트", value: stats.endpoints, color: "text-blue-400" },
          { label: "활성 위협", value: stats.activeAlerts, color: "text-rose-400" },
          { label: "오늘 차단", value: stats.blockedEvents.toLocaleString(), color: "text-orange-400" },
          { label: "USB 승인 대기", value: stats.usbRequests, color: "text-yellow-400" },
          { label: "위협 스코어", value: `${stats.threatScore}%`, color: "text-purple-400" },
          { label: "무결성", value: `${stats.integrityOk}%`, color: "text-emerald-400" },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-xl border border-theme bg-card px-3 py-3"
          >
            <p className="text-[10px] text-muted">{k.label}</p>
            <p className={`mt-0.5 text-xl font-bold tabular-nums ${k.color}`}>
              {k.value}
            </p>
          </div>
        ))}
      </div>

      {/* 사이트 점검 결과 */}
      <section className="mt-6 rounded-xl border border-theme bg-card p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold">🌐 회사 사이트 보안 점검</h2>
          {checkData?.ok && (
            <span className="text-xs text-sub">
              {checkData.checked}개 점검 · 장애 {checkData.down} · 고위험{" "}
              {checkData.highRisk}
            </span>
          )}
        </div>
        <div className="space-y-2">
          {sites.map((s) => {
            const r = resultMap.get(s.url);
            const grade = r?.securityGrade ?? "—";
            return (
              <div
                key={s.id}
                className="rounded-lg border border-theme bg-card"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpanded(expanded === s.url ? null : s.url)
                  }
                  className="flex w-full flex-wrap items-center gap-3 px-3 py-2.5 text-left"
                >
                  <span
                    className={`size-2 shrink-0 rounded-full ${
                      (r?.status ?? s.status) === "up"
                        ? "bg-emerald-400"
                        : (r?.status ?? s.status) === "down"
                          ? "bg-rose-500 anim-alert"
                          : "bg-slate-500"
                    }`}
                  />
                  <span className="min-w-[100px] text-sm font-medium">{s.name}</span>
                  <span className="flex-1 truncate text-xs text-muted">
                    {s.url}
                  </span>
                  <span className="text-xs text-sub">
                    HTTP {r?.code ?? s.http_code ?? "—"}
                  </span>
                  {r && (
                    <>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${gradeStyle[grade] ?? gradeStyle.low}`}
                      >
                        {grade} · {r.securityScore}pt
                      </span>
                    </>
                  )}
                  <span className="text-xs text-muted">
                    {expanded === s.url ? "▲" : "▼"} LogShield
                  </span>
                </button>
                {expanded === s.url && r && r.findings.length > 0 && (
                  <div className="border-t border-theme px-3 py-2">
                    <ul className="space-y-1.5">
                      {r.findings.map((f) => (
                        <li
                          key={f.id}
                          className="flex flex-wrap items-start gap-2 text-xs"
                        >
                          <span
                            className={`mt-1 size-1.5 shrink-0 rounded-full ${sevDot[f.severity] ?? sevDot.info}`}
                          />
                          <span className="font-medium text-main">
                            {f.title}
                          </span>
                          {f.mitre && (
                            <span className="rounded bg-elevated px-1 font-mono text-[10px] text-purple-300">
                              {f.mitre}
                            </span>
                          )}
                          {f.engine && (
                            <span className="text-[10px] text-blue-400/80">
                              {f.engine}
                            </span>
                          )}
                          <span className="w-full text-muted">{f.detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* LogShield 혁신 기능 */}
        <section className="rounded-xl border border-theme bg-card p-4">
          <h2 className="mb-3 text-sm font-bold">🔐 Lonex LogShield 핵심 기능</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-lg border border-theme bg-page/50 p-3"
              >
                <p className="text-lg">{f.icon}</p>
                <p className="mt-1 text-xs font-bold text-main">{f.title}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* MITRE ATT&CK */}
        <section className="rounded-xl border border-theme bg-card p-4">
          <h2 className="mb-3 text-sm font-bold">🎯 MITRE ATT&CK 탐지 (데모)</h2>
          <div className="space-y-2">
            {MITRE_TECHNIQUES.slice(0, 6).map((m) => (
              <div key={m.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-purple-300">{m.id}</span>
                  <span className="text-muted">{m.tactic}</span>
                </div>
                <p className="text-[11px] text-sub">{m.name}</p>
                <div className="h-1 overflow-hidden rounded-full bg-elevated">
                  <div
                    className="h-full rounded-full bg-red-500/70"
                    style={{
                      width: `${20 + (m.id.charCodeAt(2) % 60)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 24h 트렌드 + SOC 피드 */}
      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <section className="rounded-xl border border-theme bg-card p-4 lg:col-span-2">
          <h2 className="mb-3 text-sm font-bold">📈 24시간 이벤트 (데모)</h2>
          <div className="flex h-32 items-end gap-0.5">
            {hourlyTrend.slice(-12).map((h) => (
              <div
                key={h.hour}
                className="flex flex-1 flex-col items-center gap-0.5"
                title={`${h.hour} 차단 ${h.blocked}`}
              >
                <div
                  className="w-full rounded-t bg-rose-500/60"
                  style={{ height: `${Math.min(100, h.blocked / 1.2)}%` }}
                />
                <div
                  className="w-full rounded-t bg-emerald-500/30"
                  style={{ height: `${Math.min(60, h.allowed / 4)}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-3 text-[10px] text-muted">
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-sm bg-rose-500/60" /> 차단
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-sm bg-emerald-500/30" /> 허용
            </span>
          </div>
        </section>

        <section className="rounded-xl border border-theme bg-card p-4 lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              SOC 실시간 피드
              <span className="size-1.5 animate-pulse rounded-full bg-rose-500" />
            </h2>
            {newAlertCount > 0 && (
              <button
                onClick={clearAlerts}
                className="rounded-lg bg-rose-500/20 px-2 py-1 text-[10px] font-semibold text-rose-300"
              >
                신규 {newAlertCount}건
              </button>
            )}
          </div>
          <div className="max-h-40 space-y-1 overflow-y-auto">
            {events.slice(0, 8).map((e) => (
              <div
                key={e.id}
                className="flex flex-wrap items-center gap-2 rounded-lg px-2 py-1.5 text-xs hover:bg-elevated"
              >
                <span className="tabular-nums text-muted">
                  {format(e.time, "HH:mm:ss")}
                </span>
                <span className="font-medium text-sub">{e.user}</span>
                <span className="rounded bg-elevated px-1 text-[10px]">
                  {e.type}
                </span>
                <span
                  className={
                    e.action.includes("차단") || e.action.includes("탐지")
                      ? "text-rose-400"
                      : "text-sub"
                  }
                >
                  {e.action}
                </span>
                <span className="flex-1 truncate text-muted">{e.detail}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                    e.severity === "critical"
                      ? "bg-rose-500/20 text-rose-300"
                      : e.severity === "high"
                        ? "bg-orange-500/20 text-orange-300"
                        : "bg-slate-700 text-sub"
                  }`}
                >
                  {e.severity}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
