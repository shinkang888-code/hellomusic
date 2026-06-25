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
import { WorkChat } from "./work-chat";
import { DeptProfileEditor } from "./dept-profile-editor";
import { deptRealAvatarUrl } from "./resize-avatar";

type EventItem = { id: number; ts: string; actor: string | null; message: string };

const CHITCHAT = [
  "오늘 배포 언제죠?",
  "커피 한잔 ☕",
  "이 버그 누구 거예요?",
  "회의 또 있어요? 😵",
  "데이터 확인 중…",
  "거의 다 됐어요!",
  "리뷰 부탁드려요 🙏",
  "점심 뭐 먹죠?",
  "이거 잘 되네요 ✨",
  "잠깐 도와주실 분?",
  "마감 화이팅 🔥",
  "오늘도 출근 완료",
  "테스트 통과! ✅",
  "아이디어 떠올랐어요 💡",
];

function chatFor(emp: Employee): string {
  if (emp.status === "error") return "🚨 장애 대응 중!";
  if (emp.current_task) return emp.current_task;
  if (emp.status === "meeting") return "회의 중이에요 🗣";
  if (emp.status === "review") return "검토 중입니다 🔍";
  return CHITCHAT[emp.id % CHITCHAT.length];
}

// id 기반 결정적 워킹 파라미터
function walkVars(id: number): React.CSSProperties {
  const dx = ((id * 37) % 14) - 7; // -7~6 px
  const dy = ((id * 53) % 10) - 5; // -5~4 px
  const dur = 6 + ((id * 13) % 7); // 6~12s
  const delay = (id * 7) % 5; // 0~4s
  return {
    "--wx": `${dx}px`,
    "--wy": `${dy}px`,
    "--wd": `${dur}s`,
    "--wdelay": `${delay}s`,
  } as React.CSSProperties;
}

export function OfficeClient() {
  const [data, setData] = useState<CompanyData | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [talking, setTalking] = useState<Set<number>>(new Set());
  const [view, setView] = useState<"building" | "grid">("building");
  const [chatOpen, setChatOpen] = useState(false);
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

  // 캐릭터 말풍선: 3초마다 무작위 직원들이 말함
  useEffect(() => {
    if (!data) return;
    const ids = data.employees.map((e) => e.id);
    const rotate = () => {
      const next = new Set<number>();
      const count = Math.min(10, ids.length);
      for (let i = 0; i < count; i++) {
        next.add(ids[Math.floor(Math.random() * ids.length)]);
      }
      setTalking(next);
    };
    rotate();
    const t = setInterval(rotate, 3200);
    return () => clearInterval(t);
  }, [data]);

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
      <div className="flex h-[60vh] items-center justify-center text-slate-500">
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
      {/* 간판 히어로 */}
      <div className="relative mb-6 overflow-hidden rounded-2xl ring-1 ring-slate-800">
        <Image
          src="/brand/lonex-office-hero.png"
          alt="Lonex 라이브 오피스"
          width={1600}
          height={600}
          priority
          className="h-40 w-full object-cover sm:h-56"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/lonex-logo.png"
              alt="Lonex"
              width={48}
              height={48}
              className="size-10 rounded-lg sm:size-12"
            />
            <span className="text-2xl font-bold tracking-tight sm:text-3xl">
              로넥스 <span className="text-slate-400">· 라이브 오피스</span>
            </span>
          </div>
          <p className="mt-2 max-w-md text-sm text-blue-200 sm:text-base">
            The Logical Nexus of Infinite Data.
          </p>
          <p className="text-xs text-slate-400">무한한 데이터를 잇는 논리적 연결점.</p>
        </div>
      </div>

      {/* 상단 바 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">🏢 lonex AI 컴퍼니 — 라이브 오피스</h1>
          <p className="mt-1 text-sm text-slate-400">
            {data.stats.total}명의 AI 직원이 {data.stats.departments}개 부서에서
            실시간 근무 중 · 테두리 색이 사이트 상태를 나타냅니다
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 text-xs">
            <Stat label="근무" value={data.stats.working} dot="bg-emerald-400" />
            <Stat label="회의" value={data.stats.meeting} dot="bg-blue-400" />
            <Stat label="대기" value={data.stats.idle} dot="bg-slate-500" />
          </div>
          <div className="flex overflow-hidden rounded-lg ring-1 ring-slate-700">
            <button
              onClick={() => setView("building")}
              className={`px-3 py-2 text-xs font-semibold transition ${
                view === "building"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              🏙 빌딩 뷰
            </button>
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-2 text-xs font-semibold transition ${
                view === "grid"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              🗂 부서 뷰
            </button>
          </div>
          <button
            onClick={() => setChatOpen(true)}
            className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-yellow-300"
          >
            💬 업무지시방
          </button>
          <a
            href="https://grend.grend.kr/login"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            [그렌드]
          </a>
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
            className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 ring-1 ring-slate-700 transition hover:bg-slate-700 disabled:opacity-50"
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
                  : "bg-slate-700/30 text-slate-400 ring-slate-600"
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
          <p className="mt-2 text-center text-xs text-slate-500">
            각 층 부서 대표가 실시간으로 걸어다니며 잡담합니다 · 캐릭터를 클릭하면
            업무를 지시할 수 있어요
          </p>
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
            <h3 className="text-xs font-bold text-slate-300">🛰 실시간 활동</h3>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {events.slice(0, 8).map((e) => (
                <li key={e.id} className="text-slate-500">
                  <span className="text-slate-300">{e.actor ?? "시스템"}</span> ·{" "}
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
                className={`self-start rounded-xl border-2 bg-slate-900/40 p-3 transition ${
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
                  <span className="text-xs text-slate-500">{emps.length}명</span>
                </div>
                {emps.length === 0 ? (
                  <p className="text-xs text-slate-600">배정된 팀원이 없습니다.</p>
                ) : (
                  <div className="space-y-2.5">
                    {/* AI 팀장 (캐릭터) */}
                    {(() => {
                      const aiLeader = emps[0];
                      const meta = STATUS_META[aiLeader.status];
                      return (
                        <div className="flex items-center gap-2 rounded-lg bg-slate-950/40 px-2 py-1.5">
                          <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-800 ring-2"
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
                            <p className="text-[10px] font-semibold text-slate-500">
                              🤖 AI 팀장
                            </p>
                            <p className="truncate text-xs text-slate-300">
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
                    <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-700/80 bg-slate-950/20 px-2 py-1.5">
                      <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-800 ring-2 ring-blue-500/40">
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
                          <span className="text-lg text-slate-500">👤</span>
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold text-blue-300/90">
                          👤 실무 담당
                        </p>
                        <p className="truncate text-xs text-slate-200">
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
        <aside className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold">
            🛰 실시간 활동
          </h3>
          <ul className="mt-3 space-y-2 text-xs">
            {events.length === 0 && (
              <li className="text-slate-500">이벤트가 없습니다.</li>
            )}
            {events.map((e) => (
              <li key={e.id} className="anim-bubble border-l-2 border-slate-700 pl-2">
                <span className="text-slate-300">{e.actor ?? "시스템"}</span>
                <span className="text-slate-500"> · {e.message}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {/* 업무지시방 (카카오톡 스타일 채팅) */}
      {chatOpen && (
        <WorkChat
          departments={data.departments}
          employees={data.employees}
          onClose={() => setChatOpen(false)}
        />
      )}

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
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900/60 px-2.5 py-1.5 ring-1 ring-slate-800">
      <span className={`size-1.5 rounded-full ${dot}`} />
      {label} <b className="text-slate-100">{value}</b>
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
        className="w-full max-w-md rounded-2xl border bg-slate-900 p-6 anim-bubble"
        style={{ borderColor: deptColor }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div
            className="relative flex size-16 items-center justify-center overflow-hidden rounded-full bg-slate-800 ring-2"
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
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-2 py-0.5 text-xs">
              <span
                className={`size-1.5 rounded-full ${STATUS_META[employee.status].dot}`}
              />
              {STATUS_META[employee.status].label}
            </span>
          </div>
        </div>

        {employee.vibe && (
          <p className="mt-4 rounded-lg bg-slate-800/60 p-3 text-sm italic text-slate-300">
            “{employee.vibe}”
          </p>
        )}
        {employee.description && (
          <p className="mt-3 max-h-28 overflow-y-auto text-xs leading-relaxed text-slate-400">
            {employee.description}
          </p>
        )}

        {/* 업무 지시 */}
        <div className="mt-4">
          <label className="text-xs font-medium text-slate-400">
            업무 지시
          </label>
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            rows={2}
            placeholder="이 직원에게 지시할 업무를 입력하세요…"
            className="mt-1 w-full rounded-lg bg-slate-950 px-3 py-2 text-sm text-slate-100 ring-1 ring-slate-700 outline-none focus:ring-blue-500"
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
                    : "bg-slate-800 text-slate-300 ring-slate-700 hover:bg-slate-700"
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
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-300 ring-1 ring-slate-700 hover:bg-slate-700"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
