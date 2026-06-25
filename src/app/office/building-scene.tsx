"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { type Department, type Employee, STATUS_META } from "./types";
import { avatarFor, baseFlip } from "./avatars";

const CHITCHAT = [
  "오늘 시험 범위 확인했어요?",
  "숙제 다 했나요? 📝",
  "점심 급식 맛있었어요 🍱",
  "이 문제 어떻게 풀죠? 🤔",
  "원장님 부르셨대요",
  "상담 예약 잡았어요",
  "출석 체크 완료! ✅",
  "자습 시간이에요 📚",
  "강의 자료 준비 중",
  "학부모 연락 왔어요 📞",
  "성적표 입력 중…",
  "오늘 특강 있어요!",
  "코딩 프로젝트 화이팅 💻",
  "A반 모두 집중! 🔥",
];

/** 층별 평면도 설정 — 상단(4F)에서 내려다보는 top-down 뷰 */
const FLOORS = [
  {
    floor: 4,
    label: "4F",
    room: "원장실",
    slug: "floor-director",
    cols: 2,
    bg: "from-violet-900/40 to-violet-950/60",
  },
  {
    floor: 3,
    label: "3F",
    room: "행정실",
    slug: "floor-admin",
    cols: 4,
    bg: "from-blue-900/40 to-blue-950/60",
  },
  {
    floor: 2,
    label: "2F",
    room: "강사실",
    slug: "floor-teachers",
    cols: 4,
    bg: "from-emerald-900/40 to-emerald-950/60",
  },
  {
    floor: 1,
    label: "1F",
    room: "원생학습실",
    slug: "floor-students",
    cols: 4,
    bg: "from-amber-900/40 to-amber-950/60",
  },
] as const;

type Slot = {
  dept: Department;
  rep: Employee;
  col: number;
  cols: number;
};

export function BuildingScene({
  departments,
  employees,
  onSelect,
}: {
  departments: Department[];
  employees: Employee[];
  onSelect: (e: Employee) => void;
}) {
  const deptBySlug = useMemo(
    () => new Map(departments.map((d) => [d.slug, d])),
    [departments],
  );

  const slotsByFloor = useMemo(() => {
    const repByDept = new Map<string, Employee>();
    const allByDept = new Map<string, Employee[]>();
    for (const e of employees) {
      if (!repByDept.has(e.department_slug))
        repByDept.set(e.department_slug, e);
      const list = allByDept.get(e.department_slug) ?? [];
      list.push(e);
      allByDept.set(e.department_slug, list);
    }

    return FLOORS.map((f) => {
      const dept = deptBySlug.get(f.slug);
      if (!dept) return { floor: f, slots: [] as Slot[], members: [] as Employee[] };

      const members = allByDept.get(f.slug) ?? [];
      const leaders = members.slice(0, f.cols);
      const slots: Slot[] = leaders.map((rep, col) => ({
        dept,
        rep,
        col,
        cols: f.cols,
      }));

      return { floor: f, slots, members };
    });
  }, [departments, employees, deptBySlug]);

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-slate-700">
      {/* 건물 외곽 — 위에서 내려다본 평면도 */}
      <div className="border-b border-slate-700 bg-slate-900 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">🏫 LC Academy 빌딩</h2>
            <p className="text-[11px] text-slate-400">
              상단 평면도 · 4F 원장실 → 1F 원생학습실
            </p>
          </div>
          <div className="flex gap-1 text-[10px] text-slate-500">
            <span className="rounded bg-violet-500/20 px-2 py-0.5 text-violet-300">
              원장
            </span>
            <span className="rounded bg-blue-500/20 px-2 py-0.5 text-blue-300">
              행정
            </span>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-300">
              강사
            </span>
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-amber-300">
              원생
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-1 bg-slate-950 p-2">
        {slotsByFloor.map(({ floor: f, slots, members }, fi) => {
          const dept = deptBySlug.get(f.slug);
          return (
            <div
              key={f.slug}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${f.bg} ring-1 ring-white/10`}
            >
              {/* 층 라벨 (좌측) */}
              <div className="absolute left-0 top-0 z-10 flex h-full w-14 flex-col items-center justify-center border-r border-white/10 bg-black/30">
                <span className="text-lg font-black text-white/90">{f.label}</span>
                <span className="mt-1 text-[9px] font-semibold text-white/60">
                  {f.room}
                </span>
              </div>

              {/* 평면 그리드 */}
              <div
                className="grid min-h-[88px] gap-1 p-2 pl-16 sm:min-h-[100px]"
                style={{
                  gridTemplateColumns: `repeat(${f.cols}, minmax(0, 1fr))`,
                }}
              >
                {slots.map((s, i) => {
                  const meta = STATUS_META[s.rep.status];
                  const show = (tick + fi + i) % 2 === 0;
                  const msg =
                    s.rep.status === "error"
                      ? "🚨 확인 필요!"
                      : s.rep.current_task ||
                        CHITCHAT[(s.rep.id + tick) % CHITCHAT.length];
                  const isLeader = i === 0 || s.rep.slug.includes("lead");
                  return (
                    <div
                      key={s.rep.slug}
                      className="relative flex flex-col items-center justify-end rounded-lg border border-white/10 bg-black/20 p-1.5 pb-2"
                    >
                      {/* 방 구역 표시 */}
                      <span className="absolute left-1 top-1 text-[8px] font-medium text-white/40">
                        {isLeader ? "팀장" : "직원"}
                      </span>
                      {show && (
                        <span className="bubble-floor absolute -top-1 z-20 max-w-[90%] truncate text-[8px]">
                          {msg}
                        </span>
                      )}
                      <button
                        onClick={() => onSelect(s.rep)}
                        title={`${s.rep.name} · ${dept?.label ?? f.room}`}
                        className="group relative flex flex-col items-center transition-transform hover:scale-110"
                      >
                        <span
                          className="block h-[clamp(28px,6vw,48px)]"
                          style={
                            baseFlip(f.slug)
                              ? { transform: "scaleX(-1)" }
                              : undefined
                          }
                        >
                          <Image
                            src={avatarFor(f.slug)}
                            alt={s.rep.name}
                            width={80}
                            height={120}
                            className="h-full w-auto object-contain drop-shadow-lg"
                            priority={fi === 0}
                          />
                        </span>
                        <span
                          className={`absolute bottom-0 right-0 size-1.5 rounded-full ring-1 ring-white ${meta.dot}`}
                        />
                        <span className="mt-0.5 max-w-full truncate text-[9px] font-semibold text-white">
                          {s.rep.name}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* 층 인원 요약 */}
              <div className="border-t border-white/5 px-16 py-1 text-[9px] text-white/40">
                {dept?.label} · {members.length}명 · 조직: 원장 &gt; 팀장 &gt; 직원
              </div>
            </div>
          );
        })}
      </div>

      {/* 엘리베이터·계단 표시 */}
      <div className="flex items-center justify-center gap-4 border-t border-slate-700 bg-slate-900 px-4 py-2 text-[10px] text-slate-500">
        <span>🛗 엘리베이터</span>
        <span>🪜 계단</span>
        <span>북쪽 ↑</span>
      </div>
    </div>
  );
}
