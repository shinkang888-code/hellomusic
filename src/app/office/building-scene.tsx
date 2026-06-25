"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatedFloorPlan } from "./animated-floor-plan";
import { type Department, type Employee, STATUS_META } from "./types";
import { avatarForEmployee } from "./avatars";

const CHITCHAT = [
  "오늘 연습곡 뭐예요? 🎹",
  "콩쿠르 준비 화이팅!",
  "Theory Room 이론 시험!",
  "그랜드 스튜디오 예약 ✨",
  "등·하원 알림 보냈어요 📱",
  "체험레슨 상담 잡았어요",
  "연습실 비었어요!",
  "발표회 리허설~ 🎵",
  "바이엘 다음 페이지!",
  "원장님 부르셨대요",
  "손가락 스트레칭!",
  "레슨 10분 전 ⏰",
  "쉬는 시간~ ☕",
  "조골조골 연습 중",
  "입시곡 어려워요…",
];

/** SVG 평면도 방 중심 (% 좌표) — animated-floor-plan.tsx 와 동기화 */
const ROOMS = [
  { id: "p1", label: "Practice 1", zone: "room-students", top: 14, left: 11 },
  { id: "p2", label: "Practice 2", zone: "room-students", top: 14, left: 29 },
  { id: "p3", label: "Practice 3", zone: "room-students", top: 14, left: 48 },
  { id: "p4", label: "Practice 4", zone: "room-students", top: 14, left: 66 },
  { id: "theory", label: "Theory Room", zone: "room-admin", top: 41, left: 12 },
  { id: "office", label: "Office", zone: "room-director", top: 65, left: 12 },
  { id: "lecture", label: "Lecture Hall", zone: "room-students", top: 53, left: 40 },
  { id: "mixed", label: "Mixed Study", zone: "room-students", top: 85, left: 32 },
  { id: "grand", label: "Grand Studio", zone: "room-teachers", top: 45, left: 68 },
  { id: "p5", label: "Practice 5", zone: "room-students", top: 45, left: 88 },
] as const;

type Slot = {
  room: (typeof ROOMS)[number];
  dept: Department;
  rep: Employee;
};

function chitchatFor(emp: Employee, tick: number): string {
  if (emp.status === "error") return "🚨 확인 필요!";
  if (emp.current_task) return emp.current_task;
  if (emp.status === "meeting") return "회의 중 🗣";
  if (emp.status === "review") return "검토 중 🔍";
  return CHITCHAT[(emp.id + tick) % CHITCHAT.length];
}

function paceVars(id: number): React.CSSProperties {
  return {
    "--pace-dur": `${7 + (id % 5)}s`,
    "--pace-delay": `${(id * 2) % 5}s`,
    "--range": `${14 + (id % 4) * 8}px`,
  } as React.CSSProperties;
}

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

  const slots = useMemo<Slot[]>(() => {
    const byZone = new Map<string, Employee[]>();
    for (const e of employees) {
      const list = byZone.get(e.department_slug) ?? [];
      list.push(e);
      byZone.set(e.department_slug, list);
    }
    const zoneIdx = new Map<string, number>();

    return ROOMS.map((room) => {
      const dept = deptBySlug.get(room.zone);
      const pool = byZone.get(room.zone) ?? [];
      if (!dept || pool.length === 0) return null;
      const idx = zoneIdx.get(room.zone) ?? 0;
      zoneIdx.set(room.zone, idx + 1);
      const rep = pool[idx % pool.length];
      if (!rep) return null;
      return { room, dept, rep };
    }).filter(Boolean) as Slot[];
  }, [departments, employees, deptBySlug]);

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl ring-2 ring-[#C9A962]/35 shadow-lg shadow-[#3D3D3D]/8">
      <div className="relative overflow-hidden border-b border-[#C9A962]/30 bg-gradient-to-r from-[#3D3D3D] via-[#454545] to-[#3D3D3D] px-4 py-3">
        <div className="relative flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E8D5A8]">
              HELLO · Anime Map
            </p>
            <h2 className="text-base font-light text-[#FAF8F4]">
              Hello Music · <span className="font-semibold">1F 학원</span>
            </h2>
            <p className="text-[11px] text-[#E5E2DC]/70">
              chibi 캐릭터가 연습실을 돌아다니며 잡담해요
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 text-[9px] font-semibold tracking-wide">
            <span className="rounded-full border border-[#C9A962]/40 bg-[#FAF8F4]/10 px-2.5 py-1 text-[#E8D5A8]">
              원장실
            </span>
            <span className="rounded-full border border-[#C9A962]/40 bg-[#FAF8F4]/10 px-2.5 py-1 text-[#E8D5A8]">
              행정실
            </span>
            <span className="rounded-full border border-[#C9A962]/40 bg-[#FAF8F4]/10 px-2.5 py-1 text-[#E8D5A8]">
              강사실
            </span>
            <span className="rounded-full border border-[#C9A962]/40 bg-[#FAF8F4]/10 px-2.5 py-1 text-[#E8D5A8]">
              원생실
            </span>
          </div>
        </div>
      </div>

      <div className="anime-floor-frame relative">
        <AnimatedFloorPlan />

        {slots.length === 0 ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#1e2a4a]/50 px-6 text-center backdrop-blur-[2px]">
            <p className="rounded-2xl border-2 border-[#1e2a4a] bg-white px-5 py-4 text-sm font-bold text-[#1e2a4a] shadow-[4px_4px_0_#1e2a4a]">
              캐릭터 데이터가 없습니다.
              <br />
              <code className="mt-2 inline-block text-xs font-normal">
                npm run init-db
              </code>
            </p>
          </div>
        ) : (
          <div className="pointer-events-none absolute inset-0 z-10">
            {slots.map((s, i) => {
              const meta = STATUS_META[s.rep.status];
              const msg = chitchatFor(s.rep, tick);
              const roleLabel = s.rep.slug.includes("director")
                ? "원장"
                : s.rep.slug.includes("teacher") || s.rep.slug.includes("admin")
                  ? "강사"
                  : "원생";

              return (
                <div
                  key={`${s.room.id}-${s.rep.slug}`}
                  className="anim-pace absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    top: `${s.room.top}%`,
                    left: `${s.room.left}%`,
                    ...paceVars(s.rep.id + i),
                  }}
                >
                  <span
                    key={`${s.rep.id}-${tick}`}
                    className="bubble-floor bubble-floor-anime"
                    title={msg}
                  >
                    {msg}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelect(s.rep)}
                    title={`${s.rep.name} · ${s.room.label}`}
                    className="pointer-events-auto group flex flex-col items-center transition-transform hover:scale-110 active:scale-95"
                  >
                    <span
                      className="mb-0.5 max-w-[76px] truncate rounded-full border-2 border-[#1e2a4a]/80 px-2 py-0.5 text-[8px] font-black text-white shadow-[2px_2px_0_rgba(30,42,74,0.35)]"
                      style={{ backgroundColor: s.dept.color }}
                    >
                      {roleLabel} {s.rep.name}
                    </span>
                    <span className="anim-face relative inline-block drop-shadow-[0_4px_8px_rgba(30,42,74,0.35)]">
                      <span className="anim-chibi-bob inline-block" style={paceVars(s.rep.id + i)}>
                        <Image
                          src={avatarForEmployee(s.rep.slug)}
                          alt={s.rep.name}
                          width={72}
                          height={72}
                          className="h-[clamp(44px,9vw,64px)] w-auto object-contain"
                          priority={i < 4}
                        />
                      </span>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white shadow-sm ${meta.dot}`}
                      />
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 border-t-2 border-[#C9A962]/25 bg-[#3D3D3D] px-4 py-2.5 text-[10px] font-medium text-[#E5E2DC]/70">
        <span className="rounded-full bg-white/10 px-2 py-0.5">🎹 Practice 1–5</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5">📚 Theory</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5">👑 Office</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5">🎼 Grand</span>
        <span className="text-amber-200">💬 {slots.length}명 LIVE</span>
      </div>
    </div>
  );
}
