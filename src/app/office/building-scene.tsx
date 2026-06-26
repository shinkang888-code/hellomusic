"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatedFloorPlan } from "./animated-floor-plan";
import {
  FLOOR_CHARACTERS,
  FLOOR_SCENE_LABELS,
  POSE_LABELS,
  chitchatForCharacter,
  type FloorCharacterSlot,
} from "./floor-plan-characters";
import { resolveFloorCharacter } from "./demo-characters";
import { pixarFramesForCast } from "./pixar-cast";
import { type Department, type Employee, STATUS_META } from "./types";

type Slot = {
  character: FloorCharacterSlot;
  rep: Employee;
};

/** 원본 lonex Walker — cast 2프레임 교차로 가벼운 동작 */
function PixarWalker({
  character,
  alt,
  active,
  seed,
}: {
  character: FloorCharacterSlot;
  alt: string;
  active: boolean;
  seed: number;
}) {
  const frames = useMemo(
    () => pixarFramesForCast(character.castKey),
    [character.castKey],
  );
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!active) {
      setIdx(0);
      return;
    }
    let i = seed % frames.length;
    const t = setInterval(() => {
      i = (i + 1) % frames.length;
      setIdx(i);
    }, 280 + (seed % 80));
    return () => clearInterval(t);
  }, [active, seed, frames.length]);

  const heightScale = character.heightScale ?? 1;
  const gestureClass =
    character.gesture === "head"
      ? "anim-pixar-head"
      : character.gesture === "arm"
        ? "anim-pixar-arm"
        : "anim-pixar-idle";

  return (
    <span
      className={`hello-pixar-body ${gestureClass} block ${character.flip ? "-scale-x-100" : ""}`}
      style={
        {
          "--pixar-scale": heightScale,
          "--idle-dur": `${3.2 + (seed % 4) * 0.7}s`,
          "--idle-delay": `${(seed * 1.1) % 4}s`,
          "--gesture-dur": `${2 + (seed % 3) * 0.5}s`,
          "--gesture-delay": `${(seed * 0.6) % 3}s`,
        } as React.CSSProperties
      }
    >
      {frames.map((src, f) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          width={160}
          height={320}
          className="hello-pixar-char h-[clamp(78px,14vw,118px)] w-auto object-contain object-bottom"
          style={{ display: f === idx ? "block" : "none" }}
          priority={f === 0}
        />
      ))}
    </span>
  );
}

function chitchatFor(emp: Employee, slot: FloorCharacterSlot, tick: number): string {
  if (emp.current_task) return emp.current_task;
  return chitchatForCharacter(slot, tick);
}

export function BuildingScene({
  departments: _departments,
  employees,
  onSelect,
}: {
  departments: Department[];
  employees: Employee[];
  onSelect: (e: Employee) => void;
}) {
  const slots = useMemo<Slot[]>(() => {
    return FLOOR_CHARACTERS.map((character, i) => ({
      character,
      rep: resolveFloorCharacter(character, employees, i),
    }));
  }, [employees]);

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
              Pixar 전신 캐릭터가 방마다 연주·레슨·연습하며 잡담해요
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
            const active = s.rep.status !== "idle";

            return (
              <div
                key={s.character.id}
                className="hello-char-slot absolute"
                style={{
                  top: `${s.character.top}%`,
                  left: `${s.character.left}%`,
                  transform: "translate(-50%, -100%)",
                }}
              >
                <div
                  className="bubble-floor bubble-floor-hello hello-bubble-show mb-1.5"
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
                  title={`${s.character.roleLabel} ${s.rep.name} · ${s.character.scene} · ${POSE_LABELS[s.character.pose]}`}
                  className="pointer-events-auto group relative flex flex-col items-center transition-transform hover:scale-[1.03] active:scale-[0.98]"
                >
                  <span className="mb-1 max-w-[96px] truncate rounded-full border border-[#C9A962]/50 bg-[#3D3D3D]/88 px-2 py-0.5 text-[8px] font-semibold tracking-wide text-[#E8D5A8] shadow-sm">
                    {s.character.roleLabel} {s.rep.name}
                  </span>

                  <span className="hello-pixar-shadow absolute bottom-0 left-1/2 h-2 w-[42%] -translate-x-1/2 rounded-[50%] bg-[#3D3D3D]/35 blur-[2px]" />

                  <span className="relative inline-block">
                    <PixarWalker
                      character={s.character}
                      alt={s.rep.name}
                      active={active}
                      seed={s.rep.id + i}
                    />
                    <span
                      className={`absolute bottom-1 right-0 size-2.5 rounded-full border-2 border-[#FAF8F4] shadow-sm ${meta.dot}`}
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
