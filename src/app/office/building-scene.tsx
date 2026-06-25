"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { type Department, type Employee, STATUS_META } from "./types";
import { avatarFor, baseFlip } from "./avatars";

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

// 4개 층 × 4열 = 16개 부서 슬롯
// 각 층 바닥(짙은 네이비 슬래브 = 파란선) 바로 위에 신발이 닿도록 보정한 % 값
const FLOOR_FEET = [28, 51.5, 74.5, 95.5];
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

  // 상시 잡담: 주기적으로 일부 슬롯만 말풍선 표시
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
                  {/*
                    단일 이미지(_1.png, 오른쪽 보기)를 이동 방향에 맞춰 좌우 미러링.
                    오른쪽 이동 → 원본(코 오른쪽), 왼쪽 이동 → 좌우반전(코 왼쪽).
                    프레임 교체(팔락거림)·옷 변화 없음.
                  */}
                  <span
                    className="anim-face block h-[clamp(36px,8vw,64px)]"
                    style={
                      {
                        "--pace-dur": `${dur}s`,
                        "--pace-delay": `${delay}s`,
                      } as React.CSSProperties
                    }
                  >
                    {/* 왼쪽 보기 기준 이미지는 좌우반전해 전문팀(오른쪽 보기)으로 정규화 */}
                    <Image
                      src={avatarFor(s.dept.slug)}
                      alt={s.rep.name}
                      width={120}
                      height={260}
                      className="h-full w-auto object-contain object-bottom drop-shadow-xl"
                      style={
                        baseFlip(s.dept.slug)
                          ? { transform: "scaleX(-1)" }
                          : undefined
                      }
                      priority={i < 4}
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
