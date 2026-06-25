"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { type Department, type Employee, STATUS_META } from "./types";
import { avatarForEmployee } from "./avatars";

const CHITCHAT = [
  "오늘 연습곡 뭐예요? 🎹",
  "콩쿠르 준비 화이팅!",
  "Theory Room 이론 시험 있어요",
  "그랜드 스튜디오 예약됐어요 ✨",
  "등·하원 알림 보냈어요 📱",
  "체험레슨 상담 잡았어요",
  "연습실 3번 비었어요!",
  "발표회 리허설 시작~ 🎵",
  "바이엘 다음 페이지!",
  "원장님 부르셨대요",
  "손가락 스트레칭 했어요?",
  "레슨 10분 전이에요 ⏰",
];

/** 1층 Academy Floor Plan — 도면 위 캐릭터 앵커 (% 좌표) */
const ROOMS = [
  { id: "p1", label: "Practice 1", zone: "room-students", top: 14, left: 18 },
  { id: "p2", label: "Practice 2", zone: "room-students", top: 14, left: 36 },
  { id: "p3", label: "Practice 3", zone: "room-students", top: 14, left: 54 },
  { id: "p4", label: "Practice 4", zone: "room-students", top: 14, left: 72 },
  { id: "theory", label: "Theory Room · 행정실", zone: "room-admin", top: 32, left: 50 },
  { id: "lecture", label: "Lecture Hall", zone: "room-students", top: 48, left: 50 },
  { id: "office", label: "Office · 원장실", zone: "room-director", top: 72, left: 16 },
  { id: "mixed", label: "Mixed Study", zone: "room-students", top: 72, left: 38 },
  { id: "grand", label: "Grand Piano Studio · 강사실", zone: "room-teachers", top: 72, left: 62 },
  { id: "p5", label: "Practice 5", zone: "room-students", top: 72, left: 84 },
] as const;

type Slot = {
  room: (typeof ROOMS)[number];
  dept: Department;
  rep: Employee;
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
      const idx = zoneIdx.get(room.zone) ?? 0;
      zoneIdx.set(room.zone, idx + 1);
      const rep = pool[idx % Math.max(pool.length, 1)];
      if (!dept || !rep) return null;
      return { room, dept, rep };
    }).filter(Boolean) as Slot[];
  }, [departments, employees, deptBySlug]);

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl ring-2 ring-[#9B2335]/30">
      <div className="border-b border-[#9B2335]/20 bg-[#1e2a4a] px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-white">
              🎹 Hello Music Academy · 1F 학원 평면도
            </h2>
            <p className="text-[11px] text-amber-100/70">
              Academy Floor Plan · 원장 &gt; 팀장 &gt; 직원 · 캐릭터 클릭으로
              업무 지시
            </p>
          </div>
          <div className="flex flex-wrap gap-1 text-[9px]">
            <span className="rounded bg-violet-500/30 px-2 py-0.5 text-violet-100">
              원장실
            </span>
            <span className="rounded bg-blue-500/30 px-2 py-0.5 text-blue-100">
              행정실
            </span>
            <span className="rounded bg-rose-500/30 px-2 py-0.5 text-rose-100">
              강사실
            </span>
            <span className="rounded bg-amber-500/30 px-2 py-0.5 text-amber-100">
              원생학습실
            </span>
          </div>
        </div>
      </div>

      <div className="relative bg-[#f5f0e8]">
        <Image
          src="/images/academy-floor-plan.png"
          alt="Hello Music Academy 1층 평면도"
          width={1400}
          height={900}
          priority
          className="h-auto w-full select-none opacity-95"
        />

        <div className="pointer-events-none absolute inset-0">
          {slots.map((s, i) => {
            const meta = STATUS_META[s.rep.status];
            const show = (tick + i) % 2 === 0;
            const msg =
              s.rep.status === "error"
                ? "🚨 확인 필요!"
                : s.rep.current_task ||
                  CHITCHAT[(s.rep.id + tick) % CHITCHAT.length];
            const isLeader =
              s.rep.slug.includes("lead") ||
              s.rep.slug.includes("director-principal") ||
              s.rep.slug.includes("teacher-park") ||
              s.rep.slug.includes("teacher-choi");

            return (
              <div
                key={s.room.id}
                className="absolute -translate-x-1/2 -translate-y-full"
                style={{
                  top: `${s.room.top}%`,
                  left: `${s.room.left}%`,
                }}
              >
                {show && (
                  <span className="bubble-floor absolute -top-2 left-1/2 z-20 max-w-[88px] -translate-x-1/2 truncate text-[7px]">
                    {msg}
                  </span>
                )}
                <button
                  onClick={() => onSelect(s.rep)}
                  title={`${s.rep.name} · ${s.room.label}`}
                  className="pointer-events-auto group flex flex-col items-center transition-transform hover:scale-110"
                >
                  <span
                    className="mb-0.5 max-w-[72px] truncate rounded px-1 py-0.5 text-[7px] font-bold text-white shadow"
                    style={{ backgroundColor: s.dept.color }}
                  >
                    {isLeader ? "팀장" : "·"} {s.rep.name}
                  </span>
                  <span className="relative block">
                    <Image
                      src={avatarForEmployee(s.rep.slug)}
                      alt={s.rep.name}
                      width={64}
                      height={64}
                      className="h-[clamp(36px,7vw,56px)] w-auto object-contain drop-shadow-lg"
                      priority={i < 3}
                    />
                    <span
                      className={`absolute bottom-0 right-0 size-2 rounded-full ring-2 ring-white ${meta.dot}`}
                    />
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 border-t border-[#9B2335]/15 bg-[#1e2a4a] px-4 py-2 text-[10px] text-amber-100/60">
        <span>🎹 Piano Practice 1–5</span>
        <span>📚 Theory · Lecture</span>
        <span>👑 Office</span>
        <span>🎼 Grand Studio</span>
      </div>
    </div>
  );
}
