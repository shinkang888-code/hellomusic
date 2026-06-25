"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type CompanyData,
  type Employee,
  type EmployeeStatus,
  STATUS_META,
} from "../office/types";
import { avatarFor } from "../office/avatars";

type Task = {
  id: number;
  title: string;
  status: string;
  department_slug: string | null;
  source: string;
  created_at: string;
};

export function ConsoleClient() {
  const [data, setData] = useState<CompanyData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [q, setQ] = useState("");
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [geminiKey, setGeminiKey] = useState("");
  const [keySaved, setKeySaved] = useState(false);

  useEffect(() => {
    setGeminiKey(localStorage.getItem("lonex_gemini_key") ?? "");
  }, []);

  function saveGeminiKey() {
    localStorage.setItem("lonex_gemini_key", geminiKey.trim());
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 1800);
  }

  function clearGeminiKey() {
    localStorage.removeItem("lonex_gemini_key");
    setGeminiKey("");
  }

  const load = useCallback(async () => {
    const [c, t] = await Promise.all([
      fetch("/api/company", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/tasks", { cache: "no-store" }).then((r) => r.json()),
    ]);
    if (!c.error) setData(c);
    if (!t.error) setTasks(t.tasks);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.employees.filter((e) => {
      if (filter !== "all" && e.department_slug !== filter) return false;
      if (q && !`${e.name} ${e.vibe ?? ""}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      return true;
    });
  }, [data, filter, q]);

  async function setStatus(id: number, status: EmployeeStatus) {
    await fetch(`/api/employees/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function addTask() {
    if (!newTask.trim()) return;
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTask,
        department_slug: filter !== "all" ? filter : null,
      }),
    });
    setNewTask("");
    load();
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-slate-500">
        불러오는 중…
      </div>
    );
  }
  if (!data) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-rose-400">
        DB 연결 확인 필요 (DATABASE_URL)
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-2xl font-bold">🎛 직원 관리 콘솔</h1>
      <p className="mt-1 text-sm text-slate-400">
        총 {data.stats.total}명 · 부서 {data.stats.departments}개 · 근무{" "}
        {data.stats.working} / 회의 {data.stats.meeting} / 대기 {data.stats.idle}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* 직원 테이블 */}
        <section>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm ring-1 ring-slate-700"
            >
              <option value="all">전체 부서</option>
              {data.departments.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.label}
                </option>
              ))}
            </select>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="이름 검색…"
              className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm ring-1 ring-slate-700 outline-none focus:ring-blue-500"
            />
            <span className="text-xs text-slate-500">{filtered.length}명</span>
          </div>

          <div className="mt-3 max-h-[60vh] overflow-y-auto rounded-xl border border-slate-800">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-900 text-left text-xs text-slate-400">
                <tr>
                  <th className="px-3 py-2">직원</th>
                  <th className="px-3 py-2">부서</th>
                  <th className="px-3 py-2">상태</th>
                  <th className="px-3 py-2">빠른 변경</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <EmployeeRow
                    key={emp.id}
                    emp={emp}
                    deptLabel={
                      data.departments.find(
                        (d) => d.slug === emp.department_slug,
                      )?.label ?? emp.department_slug
                    }
                    onSetStatus={setStatus}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 우측 사이드 */}
        <aside>
          {/* AI 답변 설정 */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <h2 className="flex items-center gap-1.5 text-sm font-bold">
              🤖 업무지시방 AI (Gemini)
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              키를 입력하면 업무지시방에서 팀장들이 Gemini로 실제 답변합니다.
              미입력 시 기본(비서팀) 응답으로 동작합니다.
            </p>
            <div className="mt-2 flex gap-2">
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="Gemini API 키 붙여넣기"
                className="flex-1 rounded-lg bg-slate-950 px-3 py-2 text-sm ring-1 ring-slate-700 outline-none focus:ring-blue-500"
              />
              <button
                onClick={saveGeminiKey}
                className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-400"
              >
                저장
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-xs">
              <span className={keySaved ? "text-emerald-400" : "text-slate-500"}>
                {keySaved
                  ? "✓ 저장됨 (이 브라우저에만 저장)"
                  : geminiKey
                    ? "키 입력됨"
                    : "키 없음"}
              </span>
              {geminiKey && (
                <button
                  onClick={clearGeminiKey}
                  className="text-slate-500 underline hover:text-slate-300"
                >
                  삭제
                </button>
              )}
            </div>
          </div>

          <h2 className="mt-5 text-sm font-bold">📋 할 일판</h2>
          <div className="mt-2 flex gap-2">
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="새 업무…"
              className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm ring-1 ring-slate-700 outline-none focus:ring-blue-500"
            />
            <button
              onClick={addTask}
              className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-400"
            >
              추가
            </button>
          </div>
          <ul className="mt-3 max-h-[55vh] space-y-2 overflow-y-auto">
            {tasks.length === 0 && (
              <li className="text-xs text-slate-500">업무가 없습니다.</li>
            )}
            {tasks.map((t) => (
              <li
                key={t.id}
                className={`rounded-lg border-l-2 bg-slate-900/60 p-2.5 text-xs ${
                  t.source === "control-tower"
                    ? "border-rose-500"
                    : "border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-200">{t.title}</span>
                </div>
                <div className="mt-1 text-slate-500">
                  {t.source === "control-tower" ? "🛰 관제탑" : "👤 수동"} ·{" "}
                  {t.status}
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

function EmployeeRow({
  emp,
  deptLabel,
  onSetStatus,
}: {
  emp: Employee;
  deptLabel: string;
  onSetStatus: (id: number, s: EmployeeStatus) => void;
}) {
  const meta = STATUS_META[emp.status];
  return (
    <tr className="border-t border-slate-800 hover:bg-slate-900/40">
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="relative inline-flex size-8 shrink-0 overflow-hidden rounded-full bg-slate-800 ring-1 ring-slate-700">
            <Image
              src={avatarFor(emp.department_slug)}
              alt={emp.name}
              width={32}
              height={32}
              className="size-full object-contain"
            />
          </span>
          <div>
            <div className="font-medium text-slate-100">{emp.name}</div>
            {emp.current_task && (
              <div className="text-xs text-slate-500">{emp.current_task}</div>
            )}
          </div>
        </div>
      </td>
      <td className="px-3 py-2 text-slate-400">{deptLabel}</td>
      <td className="px-3 py-2">
        <span className="inline-flex items-center gap-1.5 text-xs">
          <span className={`size-1.5 rounded-full ${meta.dot}`} />
          {meta.label}
        </span>
      </td>
      <td className="px-3 py-2">
        <div className="flex gap-1">
          {(["working", "meeting", "idle"] as EmployeeStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => onSetStatus(emp.id, s)}
              className={`rounded px-1.5 py-0.5 text-[10px] ring-1 transition ${
                emp.status === s
                  ? "bg-blue-500/20 text-blue-300 ring-blue-500/40"
                  : "bg-slate-800 text-slate-400 ring-slate-700 hover:bg-slate-700"
              }`}
            >
              {STATUS_META[s].label}
            </button>
          ))}
        </div>
      </td>
    </tr>
  );
}
