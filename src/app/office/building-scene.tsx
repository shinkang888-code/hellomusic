"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatedFloorPlan } from "./animated-floor-plan";
import {
  FLOOR_ROOMS,
  chitchatForRoom,
  type FloorRoom,
} from "./floor-plan-rooms";
import { type Department, type Employee, STATUS_META } from "./types";
import { avatarForEmployee } from "./avatars";

type Slot = {
  room: FloorRoom;
  dept: Department;
  rep: Employee;
};

function idleVars(id: number): React.CSSProperties {
  return {
    "--idle-dur": `${3.5 + (id % 4) * 0.8}s`,
    "--idle-delay": `${(id * 1.3) % 4}s`,
    "--gesture-dur": `${2.2 + (id % 3) * 0.6}s`,
    "--gesture-delay": `${(id * 0.7) % 3}s`,
  } as React.CSSProperties;
}

function chitchatFor(emp: Employee, room: FloorRoom, tick: number): string {
  if (emp.status === "error") return "확인이 필요해요!";
  if (emp.current_task) return emp.current_task;
  if (emp.status === "meeting") return "멘토링 중이에요";
  if (emp.status === "review") return "피드백 검토 중";
  return chitchatForRoom(room, emp.id, tick);
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

    return FLOOR_ROOMS.map((room) => {
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
    const t = setInterval(() => setTick((n) => n + 1), 3800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl ring-2 ring-[#C9A962]/35 shadow-lg shadow-[#3D3D3D]/8">
      <div className="relative overflow-hidden border-b border-[#C9A962]/30 bg-gradient-to-r from-[#3D3D3D] via-[#454545] to-[#3D3D3D] px-4 py-3">
        <div className="relative flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E8D5A8]">
              HELLO · Isometric Academy
            </p>
            <h2 className="text-base font-light text-[#FAF8F4]">
              Hello Music · <span className="font-semibold">AI 학원 평면도</span>
            </h2>
            <p className="text-[11px] text-[#E5E2DC]/70">
              chibi 캐릭터가 각 실에서 잡담해요 — 머리·팔만 살짝 움직여요
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 text-[9px] font-semibold tracking-wide">
            {FLOOR_ROOMS.slice(0, 4).map((r) => (
              <span
                key={r.id}
                className="rounded-full border border-[#C9A962]/40 bg-[#FAF8F4]/10 px-2.5 py-1 text-[#E8D5A8]"
              >
                {r.labelKo}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="hello-floor-frame relative">
        <AnimatedFloorPlan />

        {slots.length === 0 ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#3D3D3D]/40 px-6 text-center backdrop-blur-[2px]">
            <p className="rounded-2xl border border-[#C9A962]/40 bg-[#FAF8F4] px-5 py-4 text-sm font-medium text-[#3D3D3D] shadow-lg">
              캐릭터 데이터가 없습니다.
              <br />
              <code className="mt-2 inline-block text-xs text-muted">
                npm run init-db
              </code>
            </p>
          </div>
        ) : (
          <div className="pointer-events-none absolute inset-0 z-10">
            {slots.map((s, i) => {
              const meta = STATUS_META[s.rep.status];
              const msg = chitchatFor(s.rep, s.room, tick);
              const roleLabel = s.rep.slug.includes("director")
                ? "원장"
                : s.rep.slug.includes("teacher") || s.rep.slug.includes("admin")
                  ? "강사"
                  : "원생";
              const gestureClass =
                i % 3 === 0
                  ? "anim-chibi-head"
                  : i % 3 === 1
                    ? "anim-chibi-arm"
                    : "anim-chibi-idle";

              return (
                <div
                  key={`${s.room.id}-${s.rep.slug}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    top: `${s.room.top}%`,
                    left: `${s.room.left}%`,
                  }}
                >
                  <span
                    key={`${s.rep.id}-${tick}`}
                    className="bubble-floor bubble-floor-hello bubble-pop"
                    title={msg}
                  >
                    {msg}
                  </span>

                  <button
                    type="button"
                    onClick={() => onSelect(s.rep)}
                    title={`${s.rep.name} · ${s.room.labelKo}`}
                    className="pointer-events-auto group flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
                  >
                    <span
                      className="mb-0.5 max-w-[80px] truncate rounded-full border border-[#C9A962]/50 bg-[#3D3D3D]/85 px-2 py-0.5 text-[8px] font-semibold tracking-wide text-[#E8D5A8] shadow-sm"
                    >
                      {roleLabel} {s.rep.name}
                    </span>

                    <span
                      className="relative inline-block"
                      style={idleVars(s.rep.id + i)}
                    >
                      <span className={`${gestureClass} inline-block`}>
                        <Image
                          src={avatarForEmployee(s.rep.slug)}
                          alt={s.rep.name}
                          width={72}
                          height={72}
                          className="h-[clamp(40px,8vw,58px)] w-auto object-contain drop-shadow-[0_4px_12px_rgba(61,61,61,0.25)]"
                          priority={i < 4}
                        />
                      </span>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#FAF8F4] shadow-sm ${meta.dot}`}
                      />
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 border-t border-[#C9A962]/25 bg-[#3D3D3D] px-4 py-2.5 text-[10px] font-medium text-[#E5E2DC]/70">
        {FLOOR_ROOMS.map((r) => (
          <span key={r.id} className="rounded-full bg-white/10 px-2 py-0.5">
            {r.labelKo}
          </span>
        ))}
        <span className="text-[#E8D5A8]">{slots.length}명 LIVE</span>
      </div>
    </div>
  );
}
