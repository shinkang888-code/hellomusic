"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type CompanyData,
  type Department,
  type Employee,
  type EmployeeStatus,
  STATUS_META,
} from "./types";
import { avatarFor, baseFlip } from "./avatars";
import { BuildingScene } from "./building-scene";
import { AcademyCounselChat } from "./academy-counsel-chat";
import { AcademyInfoModal } from "./academy-info-modal";
import { HelloManagerButton } from "./hello-manager-button";
import { DeptProfileEditor } from "./dept-profile-editor";
import { deptRealAvatarUrl } from "./resize-avatar";
import { HelloLogo } from "@/components/brand/HelloLogo";
import { BRAND_ASSETS } from "@/data/brand-assets";

type EventItem = { id: number; ts: string; actor: string | null; message: string };

export function OfficeClient() {
  const [data, setData] = useState<CompanyData | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"building" | "grid">("building");
  const [chatOpen, setChatOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [avatarVersions, setAvatarVersions] = useState<Record<string, number>>(
    {},
  );

  const load = useCallback(async () => {
    const [c, e] = await Promise.all([
      fetch("/api/company", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/events", { cache: "no-store" }).then((r) => r.json()),
    ]);
    if (!c.error) setData(c);
    if (!e.error) setEvents(e.events);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [load]);

  const byDept = useMemo(() => {
    if (!data) return new Map<string, Employee[]>();
    const m = new Map<string, Employee[]>();
    for (const emp of data.employees) {
      const arr = m.get(emp.department_slug) ?? [];
      arr.push(emp);
      m.set(emp.department_slug, arr);
    }
    return m;
  }, [data]);

  const downDepts = useMemo(() => {
    const s = new Set<string>();
    data?.sites.forEach((site) => {
      if (site.status === "down" && site.department_slug)
        s.add(site.department_slug);
    });
    return s;
  }, [data]);

  async function runControlTower() {
    setChecking(true);
    try {
      await fetch("/api/sites/check", { method: "POST" });
      await load();
    } finally {
      setChecking(false);
    }
  }

  async function updateEmployee(
    id: number,
    patch: { status?: EmployeeStatus; current_task?: string },
  ) {
    await fetch(`/api/employees/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    await load();
    setSelected((prev) =>
      prev && prev.id === id ? { ...prev, ...patch } : prev,
    );
  }

  function saveDeptProfile(
    slug: string,
    patch: {
      real_member_name: string | null;
      has_real_avatar: boolean;
      avatarVersion: number;
    },
  ) {
    setAvatarVersions((prev) => ({ ...prev, [slug]: patch.avatarVersion }));
    setData((prev) =>
      prev
        ? {
            ...prev,
            departments: prev.departments.map((d) =>
              d.slug === slug
                ? {
                    ...d,
                    real_member_name: patch.real_member_name,
                    has_real_avatar: patch.has_real_avatar,
                  }
                : d,
            ),
          }
        : prev,
    );
    load();
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-muted">
        회사 데이터를 불러오는 중…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-rose-400">
        데이터베이스 연결을 확인해 주세요. (DATABASE_URL)
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* HELLO 브랜드 간판 */}
      <div className="relative mb-6 overflow-hidden rounded-2xl ring-1 ring-[#C9A962]/30">
        <Image
          src={BRAND_ASSETS.heroOffice}
          alt="Hello Music Academy AI 학원"
          width={1600}
          height={600}
          priority
          className="h-44 w-full object-cover sm:h-56"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F4]/95 via-[#F5F0E8]/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
          <HelloLogo height={48} priority />
          <p className="mt-3 text-xl font-light tracking-wide text-main sm:text-2xl">
            Hello Music · <span className="font-semibold gradient-text">AI 학원</span>
          </p>
          <p className="mt-1 text-sm tracking-[0.15em] text-sub uppercase">
            Play · Learn · Grow
          </p>
        </div>
      </div>

      {/* 상단 바 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">🎹 Hello Music — AI 학원관리</h1>
          <p className="mt-1 text-sm text-sub">
            {data.stats.total}명(원장·강사·원생)이 1층 학원에서 실시간 운영 ·
            원장 &gt; 팀장 &gt; 직원
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <div className="flex gap-2 text-xs">
            <Stat label="근무" value={data.stats.working} dot="bg-emerald-400" />
            <Stat label="회의" value={data.stats.meeting} dot="bg-blue-400" />
            <Stat label="대기" value={data.stats.idle} dot="bg-slate-500" />
          </div>
          <div className="flex overflow-hidden rounded-lg ring-1 ring-theme">
            <button
              onClick={() => setView("building")}
              className={`px-3 py-2 text-xs font-semibold transition ${
                view === "building"
                  ? "bg-[#9B2335] text-white"
                  : "bg-card text-sub hover:bg-elevated-hover"
              }`}
            >
              🏫 평면도
            </button>
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-2 text-xs font-semibold transition ${
                view === "grid"
                  ? "bg-[#9B2335] text-white"
                  : "bg-card text-sub hover:bg-elevated-hover"
              }`}
            >
              🗂 구역별 뷰
            </button>
          </div>
          <button
            onClick={() => setChatOpen(true)}
            className="rounded-lg bg-[#9B2335] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7a1c2a]"
          >
            🎹 학원상담
          </button>
          <a
            href="https://grend.grend.kr/login"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[#1e2a4a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d3f6b]"
          >
            🎼 그랜드
          </a>
          <a
            href="https://blog.naver.com/hellomusic0104"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            📝 Blog
          </a>
          <HelloManagerButton />
          <button
            type="button"
            onClick={() => setInfoOpen(true)}
            className="rounded-lg bg-[#B8860B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#9a7209]"
          >
            📋 학원정보
          </button>
          <Link
            href="/control-tower"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            🛰 LogShield 관제탑
          </Link>
          <button
            onClick={runControlTower}
            disabled={checking}
            title="가용성만 빠르게 점검 (전체 보안 점검은 관제탑에서)"
            className="rounded-lg bg-elevated px-3 py-2 text-xs font-semibold text-sub ring-1 ring-theme transition hover:bg-elevated-hover disabled:opacity-50"
          >
            {checking ? "점검 중…" : "빠른 점검"}
          </button>
        </div>
      </div>

      {/* 사이트 상태 바 */}
      <div className="mt-4 flex flex-wrap gap-2">
        {data.sites.map((s) => (
          <span
            key={s.id}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ring-1 ${
              s.status === "up"
                ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20"
                : s.status === "down"
                  ? "bg-rose-500/10 text-rose-300 ring-rose-500/20 anim-alert"
                  : "bg-elevated text-sub ring-theme"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                s.status === "up"
                  ? "bg-emerald-400"
                  : s.status === "down"
                    ? "bg-rose-500"
                    : "bg-slate-500"
              }`}
            />
            {s.name}
            {s.http_code ? ` · ${s.http_code}` : ""}
          </span>
        ))}
      </div>

      {/* 빌딩 씬 (대표 캐릭터들이 층마다 걸어다니며 잡담) */}
      {view === "building" && (
        <div className="mt-6">
          <BuildingScene
            departments={data.departments}
            employees={data.employees}
            onSelect={setSelected}
          />
          <p className="mt-2 text-center text-xs text-muted">
            각 구역 캐릭터가 1층 평면도에서 돌아다니며 잡담합니다 · 🎹 학원상담 · 📋
            학원정보
          </p>
          <div className="mt-4 rounded-xl border border-theme bg-card p-3">
            <h3 className="text-xs font-bold text-sub">🛰 실시간 활동</h3>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {events.slice(0, 8).map((e) => (
                <li key={e.id} className="text-muted">
                  <span className="text-sub">{e.actor ?? "시스템"}</span> ·{" "}
                  {e.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div
        className={`mt-6 gap-6 lg:grid-cols-[1fr_280px] ${
          view === "grid" ? "grid" : "hidden"
        }`}
      >
        {/* 부서별 룸 — 카드는 내용 높이에 맞춰 자동으로 늘었다 줄어듦 */}
        <div className="grid auto-rows-min content-start items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.departments.map((dept) => {
            const emps = byDept.get(dept.slug) ?? [];
            const isDown = downDepts.has(dept.slug);
            return (
              <div
                key={dept.slug}
                className={`self-start rounded-xl border-2 bg-card p-3 transition ${
                  isDown ? "anim-alert" : ""
                }`}
                style={{ borderColor: isDown ? "#ef4444" : dept.color }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3
                    className="text-sm font-bold"
                    style={{ color: dept.color }}
                  >
                    {dept.label}
                  </h3>
                  <span className="text-xs text-muted">{emps.length}명</span>
                </div>
                {emps.length === 0 ? (
                  <p className="text-xs text-muted">배정된 팀원이 없습니다.</p>
                ) : (
                  <div className="space-y-2.5">
                    {/* AI 팀장 (캐릭터) */}
                    {(() => {
                      const aiLeader = emps[0];
                      const meta = STATUS_META[aiLeader.status];
                      return (
                        <div className="flex items-center gap-2 rounded-lg bg-card px-2 py-1.5">
                          <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-elevated ring-2"
                            style={{ borderColor: meta.ring }}>
                            <Image
                              src={avatarFor(dept.slug)}
                              alt={aiLeader.name}
                              width={36}
                              height={36}
                              className="size-full rounded-full object-cover"
                              style={{
                                objectPosition: "50% 6%",
                                transformOrigin: "50% 8%",
                                transform: `scale(2.6)${
                                  baseFlip(dept.slug) ? " scaleX(-1)" : ""
                                }`,
                              }}
                            />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-semibold text-muted">
                              {dept.slug === "room-director"
                                ? "👑 원장(대표)"
                                : "🎯 AI 팀장"}
                            </p>
                            <p className="truncate text-xs text-sub">
                              {aiLeader.name}
                            </p>
                          </div>
                          <span
                            className={`size-2 shrink-0 rounded-full ${meta.dot}`}
                            title={meta.label}
                          />
                        </div>
                      );
                    })()}

                    {/* 실무 담당 (실제 직원) */}
                    <div className="flex items-center gap-2 rounded-lg border border-dashed border-theme/80 bg-card px-2 py-1.5">
                      <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-elevated ring-2 ring-blue-500/40">
                        {dept.has_real_avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={deptRealAvatarUrl(
                              dept.slug,
                              avatarVersions[dept.slug],
                            )}
                            alt={dept.real_member_name ?? "실무 담당"}
                            className="size-full object-cover"
                          />
                        ) : (
                          <span className="text-lg text-muted">👤</span>
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold text-blue-300/90">
                          👤 실무 담당
                        </p>
                        <p className="truncate text-xs text-main">
                          {dept.real_member_name || "미등록"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingDept(dept)}
                        className="shrink-0 rounded-md bg-blue-500/15 px-2 py-1 text-[10px] font-semibold text-blue-300 ring-1 ring-blue-500/30 transition hover:bg-blue-500/25"
                      >
                        편집
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 우측: 실시간 이벤트 로그 */}
        <aside className="rounded-xl border border-theme bg-card p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold">
            🛰 실시간 활동
          </h3>
          <ul className="mt-3 space-y-2 text-xs">
            {events.length === 0 && (
              <li className="text-muted">이벤트가 없습니다.</li>
            )}
            {events.map((e) => (
              <li key={e.id} className="anim-bubble border-l-2 border-theme pl-2">
                <span className="text-sub">{e.actor ?? "시스템"}</span>
                <span className="text-muted"> · {e.message}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {/* 학원상담 (카카오톡 스타일 · 원장 AI) */}
      <AcademyCounselChat open={chatOpen} onClose={() => setChatOpen(false)} />

      <AcademyInfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />

      {/* 부서 실무 담당 프로필 편집 */}
      {editingDept && (
        <DeptProfileEditor
          department={editingDept}
          aiLeaderName={
            byDept.get(editingDept.slug)?.[0]?.name ?? editingDept.label
          }
          avatarVersion={avatarVersions[editingDept.slug]}
          onClose={() => setEditingDept(null)}
          onSaved={(patch) => saveDeptProfile(editingDept.slug, patch)}
        />
      )}

      {/* 직원 상세 모달 */}
      {selected && (
        <EmployeeModal
          employee={selected}
          deptColor={
            data.departments.find((d) => d.slug === selected.department_slug)
              ?.color ?? "#3b82f6"
          }
          deptLabel={
            data.departments.find((d) => d.slug === selected.department_slug)
              ?.label ?? ""
          }
          onClose={() => setSelected(null)}
          onUpdate={updateEmployee}
        />
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  dot,
}: {
  label: string;
  value: number;
  dot: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-card px-2.5 py-1.5 ring-1 ring-theme">
      <span className={`size-1.5 rounded-full ${dot}`} />
      {label} <b className="text-main">{value}</b>
    </span>
  );
}

function EmployeeModal({
  employee,
  deptColor,
  deptLabel,
  onClose,
  onUpdate,
}: {
  employee: Employee;
  deptColor: string;
  deptLabel: string;
  onClose: () => void;
  onUpdate: (
    id: number,
    patch: { status?: EmployeeStatus; current_task?: string },
  ) => Promise<void>;
}) {
  const [task, setTask] = useState(employee.current_task ?? "");
  const [saving, setSaving] = useState(false);

  async function assign() {
    setSaving(true);
    await onUpdate(employee.id, { current_task: task, status: "working" });
    setSaving(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border bg-card p-6 anim-bubble"
        style={{ borderColor: deptColor }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div
            className="relative flex size-16 items-center justify-center overflow-hidden rounded-full bg-elevated ring-2"
            style={{ borderColor: deptColor }}
          >
            <Image
              src={avatarFor(employee.department_slug)}
              alt={employee.name}
              width={64}
              height={64}
              className="size-full object-contain"
            />
            {employee.emoji && (
              <span className="absolute -top-0.5 left-0.5 text-base">
                {employee.emoji}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">{employee.name}</h3>
            <p className="text-xs" style={{ color: deptColor }}>
              {deptLabel}
            </p>
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-elevated px-2 py-0.5 text-xs">
              <span
                className={`size-1.5 rounded-full ${STATUS_META[employee.status].dot}`}
              />
              {STATUS_META[employee.status].label}
            </span>
          </div>
        </div>

        {employee.vibe && (
          <p className="mt-4 rounded-lg bg-elevated p-3 text-sm italic text-sub">
            “{employee.vibe}”
          </p>
        )}
        {employee.description && (
          <p className="mt-3 max-h-28 overflow-y-auto text-xs leading-relaxed text-sub">
            {employee.description}
          </p>
        )}

        {/* 업무 지시 */}
        <div className="mt-4">
          <label className="text-xs font-medium text-sub">
            업무 지시
          </label>
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            rows={2}
            placeholder="이 직원에게 지시할 업무를 입력하세요…"
            className="mt-1 w-full rounded-lg bg-page px-3 py-2 text-sm text-main ring-1 ring-theme outline-none focus:ring-blue-500"
          />
        </div>

        {/* 상태 변경 */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(["working", "meeting", "review", "idle"] as EmployeeStatus[]).map(
            (st) => (
              <button
                key={st}
                onClick={() => onUpdate(employee.id, { status: st })}
                className={`rounded-lg px-2.5 py-1 text-xs ring-1 transition ${
                  employee.status === st
                    ? "bg-blue-500/20 text-blue-300 ring-blue-500/40"
                    : "bg-elevated text-sub ring-theme hover:bg-elevated-hover"
                }`}
              >
                {STATUS_META[st].label}
              </button>
            ),
          )}
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={assign}
            disabled={saving}
            className="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50"
          >
            {saving ? "지시 중…" : "업무 지시"}
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-elevated px-4 py-2 text-sm text-sub ring-1 ring-theme hover:bg-elevated-hover"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
