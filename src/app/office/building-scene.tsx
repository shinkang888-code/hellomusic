"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatedFloorPlan } from "./animated-floor-plan";
import {
  FLOOR_CHARACTERS,
  FLOOR_SCENE_LABELS,
  avatarPath,
  chitchatForCharacter,
  type FloorCharacterSlot,
} from "./floor-plan-characters";
import { DEMO_DEPARTMENTS, resolveFloorCharacter } from "./demo-characters";
import { type Department, type Employee, STATUS_META } from "./types";
import { avatarForEmployee } from "./avatars";

type Slot = {
  character: FloorCharacterSlot;
  dept: Department;
  rep: Employee;
};

function idleVars(id: number): React.CSSProperties {
  return {
    "--idle-dur": `${3.2 + (id % 4) * 0.7}s`,
    "--idle-delay": `${(id * 1.1) % 4}s`,
    "--gesture-dur": `${2 + (id % 3) * 0.5}s`,
    "--gesture-delay": `${(id * 0.6) % 3}s`,
  } as React.CSSProperties;
}

function gestureClass(g: FloorCharacterSlot["gesture"]): string {
  if (g === "head") return "anim-chibi-head";
  if (g === "arm") return "anim-chibi-arm";
  return "anim-chibi-idle";
}

function avatarSrc(slot: FloorCharacterSlot, emp: Employee): string {
  if (emp.id >= 9000) return avatarPath(slot.avatar);
  return avatarForEmployee(emp.slug);
}

function chitchatFor(emp: Employee, slot: FloorCharacterSlot, tick: number): string {
  if (emp.current_task) return emp.current_task;
  return chitchatForCharacter(slot, tick);
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
  const depts = departments.length > 0 ? departments : DEMO_DEPARTMENTS;

  const deptBySlug = useMemo(
    () => new Map(depts.map((d) => [d.slug, d])),
    [depts],
  );

  const slots = useMemo<Slot[]>(() => {
    return FLOOR_CHARACTERS.map((character, i) => {
      const rep = resolveFloorCharacter(character, employees, i);
      const dept = deptBySlug.get(character.zone);
      if (!dept) return null;
      return { character, dept, rep };
    }).filter(Boolean) as Slot[];
  }, [employees, deptBySlug]);

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 4200);
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
              원장 · 레슨 · 연습 — chibi가 가볍게 움직이며 잡담해요
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 text-[9px] font-semibold tracking-wide">
            {FLOOR_SCENE_LABELS.map((label) => (
              <span
                key={label}
                className="rounded-full border border-[#C9A962]/40 bg-[#FAF8F4]/10 px-2.5 py-1 text-[#E8D5A8]"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="hello-floor-frame relative">
        <AnimatedFloorPlan />

        <div className="pointer-events-none absolute inset-0 z-10">
          {slots.map((s, i) => {
            const meta = STATUS_META[s.rep.status];
            const msg = chitchatFor(s.rep, s.character, tick);
            const scale = s.character.scale ?? 1;

            return (
              <div
                key={s.character.id}
                className="hello-char-slot absolute -translate-x-1/2 -translate-y-[88%]"
                style={{
                  top: `${s.character.top}%`,
                  left: `${s.character.left}%`,
                }}
              >
                <div
                  className="bubble-floor bubble-floor-hello hello-bubble-show mb-1"
                  aria-live="polite"
                >
                  <span
                    key={`${s.character.id}-${tick}`}
                    className="hello-bubble-text"
                  >
                    {msg}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelect(s.rep)}
                  title={`${s.character.roleLabel} ${s.rep.name} · ${s.character.scene}`}
                  className="pointer-events-auto group flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
                >
                  <span className="mb-0.5 max-w-[88px] truncate rounded-full border border-[#C9A962]/50 bg-[#3D3D3D]/85 px-2 py-0.5 text-[8px] font-semibold tracking-wide text-[#E8D5A8] shadow-sm">
                    {s.character.roleLabel} {s.rep.name}
                  </span>

                  <span
                    className="relative inline-block origin-bottom"
                    style={idleVars(s.rep.id + i)}
                  >
                    <span
                      className={`${gestureClass(s.character.gesture)} inline-block origin-bottom ${
                        scale < 1 ? "scale-90" : scale > 1 ? "scale-105" : ""
                      }`}
                    >
                      <Image
                        src={avatarSrc(s.character, s.rep)}
                        alt={s.rep.name}
                        width={80}
                        height={80}
                        className="h-[clamp(46px,9.5vw,64px)] w-auto object-contain drop-shadow-[0_4px_14px_rgba(61,61,61,0.35)]"
                        priority
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
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 border-t border-[#C9A962]/25 bg-[#3D3D3D] px-4 py-2.5 text-[10px] font-medium text-[#E5E2DC]/70">
        {FLOOR_SCENE_LABELS.map((label) => (
          <span key={label} className="rounded-full bg-white/10 px-2 py-0.5">
            {label}
          </span>
        ))}
        <span className="text-[#E8D5A8]">{slots.length}명 LIVE</span>
      </div>
    </div>
  );
}
