"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { type Department, type Employee, STATUS_META } from "./types";
import { castFramesFor } from "./avatars";

// 워크 사이클 스프라이트: 좌발/우발 2프레임 교체로 자연스러운 걷기
function Walker({
  slug,
  alt,
  active,
  seed,
}: {
  slug: string;
  alt: string;
  active: boolean;
  seed: number;
}) {
  const frames = useMemo(() => castFramesFor(slug), [slug]);
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
    }, 260 + (seed % 90));
    return () => clearInterval(t);
  }, [active, seed, frames.length]);

  return (
    <>
      {frames.map((src, f) => (
        <Image
          key={f}
          src={src}
          alt={alt}
          width={120}
          height={260}
          className="h-full w-auto object-contain object-bottom drop-shadow-xl"
          style={{ display: f === idx ? "block" : "none" }}
          priority={f === 0}
        />
      ))}
    </>
  );
}

const CHITCHAT = [
  "오늘 배포 언제죠?",
  "커피 한잔 하실래요? ☕",
  "이 버그 누구 거예요? 🐛",
  "회의 또 있어요? 😵",
  "데이터 확인 중입니다",
  "거의 다 끝났어요!",
  "리뷰 부탁드려요 🙏",
  "점심 뭐 먹죠? 🍜",
  "이거 잘 되네요 ✨",
  "잠깐 도와주실 분? 🙋",
  "마감 화이팅! 🔥",
  "오늘도 출근 완료 💪",
  "테스트 통과했어요 ✅",
  "아이디어 떠올랐어요! 💡",
  "주말 계획 있으세요?",
  "이번 스프린트 빡세네요 😅",
  "고객 피드백 좋아요 🎉",
  "캐릭터 귀엽지 않아요?",
];

// 4개 층 × 4열 = 16개 부서 슬롯 (배경 빌딩 바닥에 발 정렬)
// 각 층 바닥 면(발이 닿는 위치, 파란 슬래브 라인 바로 위) %
const FLOOR_FEET = [27, 50.5, 73, 94.5];
const COL_LEFT = [24, 44, 63, 82]; // 엘리베이터/계단(좌측) 피해서 (%)

type Slot = { dept: Department; rep: Employee; top: number; left: number };

export function BuildingScene({
  departments,
  employees,
  onSelect,
}: {
  departments: Department[];
  employees: Employee[];
  onSelect: (e: Employee) => void;
}) {
  // 부서별 대표 1명 (부서 내 첫 직원)
  const slots = useMemo<Slot[]>(() => {
    const repByDept = new Map<string, Employee>();
    for (const e of employees) {
      if (!repByDept.has(e.department_slug)) repByDept.set(e.department_slug, e);
    }
    const ordered = [...departments].sort((a, b) => a.sort - b.sort);
    const out: Slot[] = [];
    ordered.forEach((dept, i) => {
      const rep = repByDept.get(dept.slug);
      if (!rep) return;
      const floor = Math.floor(i / 4);
      const col = i % 4;
      out.push({
        dept,
        rep,
        top: FLOOR_FEET[floor] ?? 95,
        left: COL_LEFT[col] ?? 50,
      });
    });
    return out;
  }, [departments, employees]);

  // 상시 잡담: 각 슬롯에 메시지 인덱스, 주기적으로 일부만 말풍선 표시
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-slate-800">
      <Image
        src="/brand/office-building-bg.png"
        alt="로넥스 오피스 빌딩"
        width={1400}
        height={933}
        priority
        className="h-auto w-full select-none"
      />
      {/* 캐릭터 오버레이 */}
      <div className="pointer-events-none absolute inset-0">
        {slots.map((s, i) => {
          const meta = STATUS_META[s.rep.status];
          const range = 40 + ((s.rep.id * 11) % 50); // 40~90px
          const dur = 7 + ((s.rep.id * 7) % 8); // 7~14s
          const delay = (s.rep.id * 5) % 6; // 0~5s
          // 상시 잡담: tick + 슬롯에 따라 보일지 결정 (절반 정도가 동시에 말함)
          const show = (tick + i) % 2 === 0;
          const msg =
            s.rep.status === "error"
              ? "🚨 장애 대응 중!"
              : s.rep.current_task ||
                CHITCHAT[(s.rep.id + tick) % CHITCHAT.length];
          return (
            <div
              key={s.dept.slug}
              className="absolute"
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                transform: "translate(-50%, -100%)",
              }}
            >
              {/* 좌우 이동(걷기) 레이어 — 앵커와 분리해 transform 충돌 방지 */}
              <div
                className="anim-pace relative"
                style={
                  {
                    "--range": `${range}px`,
                    "--pace-dur": `${dur}s`,
                    "--pace-delay": `${delay}s`,
                  } as React.CSSProperties
                }
              >
                {show && (
                  <span className="bubble-floor" key={tick}>
                    {msg}
                  </span>
                )}
                {/* 부서 이름표 */}
                <span
                  className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded px-1.5 py-0.5 text-[9px] font-semibold text-white shadow"
                  style={{ backgroundColor: s.dept.color }}
                >
                  {s.dept.label}
                </span>
                <button
                  onClick={() => onSelect(s.rep)}
                  title={`${s.rep.name} · ${s.dept.label}`}
                  className="pointer-events-auto relative flex flex-col items-center transition-transform hover:scale-110"
                >
                  {/* 바닥 그림자 */}
                  <span className="absolute -bottom-0.5 left-1/2 h-1 w-6 -translate-x-1/2 rounded-[50%] bg-black/50 blur-[2px]" />
                  {/* 캐릭터 크기를 각 층고에 맞게 축소(약 11~14% 빌딩 높이) */}
                  <span className="anim-face block h-[clamp(36px,8vw,64px)]">
                    <Walker
                      slug={s.dept.slug}
                      alt={s.rep.name}
                      active={s.rep.status !== "idle"}
                      seed={s.rep.id}
                    />
                  </span>
                  <span
                    className={`absolute bottom-0.5 right-0 size-2 rounded-full ring-2 ring-white ${meta.dot}`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
