"use client";

import Image from "next/image";

/** HELLO Music Academy — 이소메트릭 럭셔리 평면도 (참조 디자인 기반) */

export function AnimatedFloorPlan() {
  return (
    <div className="hello-iso-floor relative w-full overflow-hidden bg-[#FAF8F4]">
      <Image
        src="/brand/hello-academy-isometric-empty.png"
        alt="Hello Music Academy 이소메트릭 평면도 (캐릭터 없음)"
        width={1200}
        height={750}
        className="hello-iso-floor-img h-auto w-full object-cover object-center"
        priority
      />

      {/* 골드 글로우 오버레이 — 중앙 허브 H 로고 */}
      <svg
        viewBox="0 0 1000 620"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <radialGradient id="hub-glow" cx="50%" cy="42%" r="18%">
            <stop offset="0%" stopColor="#C9A962" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#C9A962" stopOpacity="0" />
          </radialGradient>
          <filter id="iso-sparkle">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ellipse cx="500" cy="260" rx="120" ry="70" fill="url(#hub-glow)" className="hello-hub-pulse" />

        {[
          { cx: 160, cy: 130 },
          { cx: 820, cy: 120 },
          { cx: 140, cy: 360 },
          { cx: 820, cy: 250 },
          { cx: 420, cy: 385 },
          { cx: 740, cy: 360 },
        ].map((s, i) => (
          <g key={i} className="hello-iso-sparkle" style={{ animationDelay: `${i * 0.6}s` }}>
            <circle cx={s.cx} cy={s.cy} r={4} fill="#E8D5A8" filter="url(#iso-sparkle)" />
          </g>
        ))}

        {/* 방 라벨 */}
        {[
          { label: "AI 작곡실", x: 15, y: 18 },
          { label: "프로덕션", x: 13, y: 52 },
          { label: "스마트 연습실", x: 41, y: 54 },
          { label: "커뮤니티", x: 73, y: 52 },
          { label: "녹음실", x: 81, y: 34 },
          { label: "멘토 라운지", x: 83, y: 16 },
          { label: "그랜드 허브", x: 49, y: 36 },
        ].map((room) => (
          <text
            key={room.label}
            x={(room.x / 100) * 1000}
            y={(room.y / 100) * 620 + 28}
            textAnchor="middle"
            className="hello-iso-room-label"
            fontSize={9}
            fontWeight={600}
            letterSpacing={1.2}
          >
            {room.label.toUpperCase()}
          </text>
        ))}
      </svg>

      <div className="hello-iso-banner pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-3">
        <span className="rounded-full border border-[#C9A962]/50 bg-[#3D3D3D]/90 px-6 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-[#E8D5A8] shadow-lg">
          HELLO MUSIC ACADEMY
        </span>
      </div>
    </div>
  );
}
