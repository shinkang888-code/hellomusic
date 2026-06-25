"use client";

/** chibi 캐릭터와 톤을 맞춘 애니메이션풍 1층 학원 평면도 (SVG) */

type RoomDef = {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  zone: "director" | "admin" | "teachers" | "students";
  icon: string;
};

const ROOMS: RoomDef[] = [
  { id: "p1", label: "Practice 1", x: 24, y: 28, w: 168, h: 118, zone: "students", icon: "🎹" },
  { id: "p2", label: "Practice 2", x: 208, y: 28, w: 168, h: 118, zone: "students", icon: "🎹" },
  { id: "p3", label: "Practice 3", x: 392, y: 28, w: 168, h: 118, zone: "students", icon: "🎹" },
  { id: "p4", label: "Practice 4", x: 576, y: 28, w: 168, h: 118, zone: "students", icon: "🎹" },
  { id: "stairs", label: "Stairs", sub: "UP · DN", x: 760, y: 28, w: 120, h: 118, zone: "students", icon: "🪜" },
  { id: "theory", label: "Theory Room", sub: "행정실", x: 24, y: 188, w: 200, h: 132, zone: "admin", icon: "📚" },
  { id: "office", label: "Office", sub: "원장실", x: 24, y: 336, w: 200, h: 132, zone: "director", icon: "👑" },
  { id: "lecture", label: "Lecture Hall", sub: "강의실", x: 244, y: 188, w: 320, h: 280, zone: "students", icon: "🎤" },
  { id: "mixed", label: "Mixed Study", sub: "자습", x: 244, y: 484, w: 148, h: 88, zone: "students", icon: "📖" },
  { id: "grand", label: "Grand Studio", sub: "강사실", x: 584, y: 188, w: 188, h: 180, zone: "teachers", icon: "🎼" },
  { id: "p5", label: "Practice 5", x: 788, y: 188, w: 188, h: 180, zone: "students", icon: "🎹" },
];

const ZONE_STYLE: Record<
  RoomDef["zone"],
  { fill: string; fill2: string; stroke: string; glow: string }
> = {
  director: {
    fill: "#EDE9FE",
    fill2: "#DDD6FE",
    stroke: "#7C3AED",
    glow: "rgba(124,58,237,0.35)",
  },
  admin: {
    fill: "#DBEAFE",
    fill2: "#BFDBFE",
    stroke: "#2563EB",
    glow: "rgba(37,99,235,0.35)",
  },
  teachers: {
    fill: "#FFE4E6",
    fill2: "#FECDD3",
    stroke: "#9B2335",
    glow: "rgba(155,35,53,0.4)",
  },
  students: {
    fill: "#FEF3C7",
    fill2: "#FDE68A",
    stroke: "#B8860B",
    glow: "rgba(184,134,11,0.35)",
  },
};

function RoomShape({ room }: { room: RoomDef }) {
  const s = ZONE_STYLE[room.zone];
  const rx = 18;
  const isGrand = room.id === "grand";

  return (
    <g className={isGrand ? "anime-room anime-room-shine" : "anime-room"}>
      <rect
        x={room.x}
        y={room.y}
        width={room.w}
        height={room.h}
        rx={rx}
        fill={`url(#grad-${room.zone})`}
        stroke={s.stroke}
        strokeWidth={3}
        className="anime-room-body"
      />
      <rect
        x={room.x + 8}
        y={room.y + 8}
        width={room.w - 16}
        height={room.h - 16}
        rx={rx - 4}
        fill="none"
        stroke="white"
        strokeWidth={1.5}
        opacity={0.45}
      />
      {/* 바담 wood plank hint */}
      <g opacity={0.12}>
        {Array.from({ length: Math.floor(room.h / 22) }).map((_, i) => (
          <line
            key={i}
            x1={room.x + 12}
            y1={room.y + 20 + i * 22}
            x2={room.x + room.w - 12}
            y2={room.y + 20 + i * 22}
            stroke="#1e2a4a"
            strokeWidth={1}
          />
        ))}
      </g>
      {/* 아이콘 */}
      <text
        x={room.x + room.w / 2}
        y={room.y + room.h / 2 - (room.sub ? 8 : 0)}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={room.w > 200 ? 28 : 22}
        className="anime-room-icon"
      >
        {room.icon}
      </text>
      {/* 라벨 */}
      <text
        x={room.x + room.w / 2}
        y={room.y + room.h - (room.sub ? 28 : 18)}
        textAnchor="middle"
        className="anime-room-label"
        fontSize={11}
        fontWeight={800}
      >
        {room.label}
      </text>
      {room.sub && (
        <text
          x={room.x + room.w / 2}
          y={room.y + room.h - 12}
          textAnchor="middle"
          className="anime-room-sublabel"
          fontSize={9}
          fontWeight={700}
        >
          {room.sub}
        </text>
      )}
    </g>
  );
}

export function AnimatedFloorPlan() {
  return (
    <svg
      viewBox="0 0 1000 620"
      className="anime-floor-plan w-full h-auto select-none"
      role="img"
      aria-label="Hello Music Academy 1층 애니메이션 평면도"
    >
      <defs>
        <linearGradient id="anime-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF7ED" />
          <stop offset="55%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
        <linearGradient id="anime-hall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F5F0E8" />
          <stop offset="50%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#F5F0E8" />
        </linearGradient>
        {(["director", "admin", "teachers", "students"] as const).map((z) => (
          <linearGradient key={z} id={`grad-${z}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={ZONE_STYLE[z].fill} />
            <stop offset="100%" stopColor={ZONE_STYLE[z].fill2} />
          </linearGradient>
        ))}
        <filter id="anime-soft-shadow" x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1e2a4a" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* 배경 */}
      <rect width="1000" height="620" fill="url(#anime-sky)" className="anime-floor-bg" />
      <rect x="0" y="158" width="1000" height="28" fill="url(#anime-hall)" className="anime-hallway" />
      <text x="500" y="176" textAnchor="middle" fontSize="10" fontWeight={800} fill="#1e2a4a" opacity={0.35}>
        ✦ MAIN HALLWAY ✦
      </text>

      {/* 복도 장식 라인 */}
      <line x1="20" y1="172" x2="980" y2="172" stroke="#1e2a4a" strokeWidth={2} strokeDasharray="8 6" opacity={0.15} />

      {/* 방 */}
      <g filter="url(#anime-soft-shadow)">
        {ROOMS.map((room) => (
          <RoomShape key={room.id} room={room} />
        ))}
      </g>

      {/* 떠다니는 음표 */}
      {[
        { x: 130, y: 90, d: "0s" },
        { x: 450, y: 70, d: "0.8s" },
        { x: 680, y: 100, d: "1.6s" },
        { x: 350, y: 280, d: "0.4s" },
        { x: 720, y: 260, d: "1.2s" },
        { x: 120, y: 400, d: "2s" },
      ].map((n, i) => (
        <text
          key={i}
          x={n.x}
          y={n.y}
          fontSize={18}
          fill="#9B2335"
          opacity={0.55}
          className="anime-note"
          style={{ animationDelay: n.d }}
        >
          ♪
        </text>
      ))}

      {/* 반짝이 */}
      {[
        { cx: 650, cy: 220 },
        { cx: 500, cy: 320 },
        { cx: 180, cy: 240 },
        { cx: 860, cy: 280 },
      ].map((s, i) => (
        <g key={i} className="anime-sparkle" style={{ animationDelay: `${i * 0.7}s` }}>
          <circle cx={s.cx} cy={s.cy} r={3} fill="#B8860B" opacity={0.7} />
          <circle cx={s.cx} cy={s.cy} r={8} fill="none" stroke="#B8860B" strokeWidth={1} opacity={0.3} />
        </g>
      ))}

      {/* 하단 타이틀 배너 */}
      <g className="anime-title-banner">
        <rect x="280" y="572" width="440" height="36" rx="18" fill="#1e2a4a" opacity={0.92} />
        <rect x="284" y="576" width="432" height="28" rx="14" fill="none" stroke="#B8860B" strokeWidth={1.5} opacity={0.6} />
        <text x="500" y="594" textAnchor="middle" fill="#FEF3C7" fontSize="13" fontWeight={900} letterSpacing={2}>
          HELLO MUSIC ACADEMY · 1F
        </text>
      </g>

      {/* 코너 장식 */}
      <text x="28" y="608" fontSize={20} opacity={0.25}>
        🎹
      </text>
      <text x="948" y="608" fontSize={20} opacity={0.25}>
        ✨
      </text>
    </svg>
  );
}
