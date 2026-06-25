/** Hello Music Academy 이소메트릭 평면도 — 방·캐릭터·잡담 정의 */

export type FloorRoom = {
  id: string;
  label: string;
  labelKo: string;
  zone: "room-director" | "room-admin" | "room-teachers" | "room-students";
  /** 캐릭터 오버레이 위치 (%) */
  top: number;
  left: number;
  chitchat: string[];
  /** DB 없을 때 방별 고정 데모 캐릭터 */
  demo: {
    slug: string;
    name: string;
    avatar: string;
    emoji: string;
    status: "working" | "meeting" | "idle" | "review";
  };
};

export const FLOOR_ROOMS: FloorRoom[] = [
  {
    id: "ai-lab",
    label: "AI Composition Lab",
    labelKo: "AI 작곡실",
    zone: "room-admin",
    top: 24,
    left: 15,
    chitchat: [
      "AI 선율이 딱 맞아요 ✨",
      "이 멜로디 완성해볼까?",
      "파형 편집 중이에요~",
      "하모니 AI 추천 받았어!",
    ],
    demo: {
      slug: "admin-lead",
      name: "박행정",
      avatar: "director-female",
      emoji: "🎛",
      status: "working",
    },
  },
  {
    id: "production",
    label: "Production Studio",
    labelKo: "프로덕션",
    zone: "room-admin",
    top: 56,
    left: 13,
    chitchat: [
      "믹싱 거의 다 됐어요",
      "마스터링 들어갑니다 🎧",
      "모니터 스피커 소리 좋다",
      "트랙 레이어 정리 중~",
    ],
    demo: {
      slug: "admin-billing",
      name: "최믹싱",
      avatar: "director-female",
      emoji: "🎧",
      status: "working",
    },
  },
  {
    id: "practice",
    label: "Smart Practice Room",
    labelKo: "스마트 연습실",
    zone: "room-students",
    top: 60,
    left: 41,
    chitchat: [
      "하이음 더 올려볼게요",
      "연주 점수 96점! 🎻",
      "디지털 악보 따라 연습",
      "손목 풀고 다시!",
    ],
    demo: {
      slug: "student-jia",
      name: "지아",
      avatar: "student-girl",
      emoji: "🎻",
      status: "working",
    },
  },
  {
    id: "community",
    label: "Community Space",
    labelKo: "커뮤니티",
    zone: "room-students",
    top: 56,
    left: 73,
    chitchat: [
      "세계 음악 트렌드 봤어?",
      "주말 공연 같이 가자!",
      "신곡 추천해줄게~",
      "카페에서 곡 얘기 중 ☕",
    ],
    demo: {
      slug: "student-doyoon",
      name: "도윤",
      avatar: "student-boy",
      emoji: "☕",
      status: "meeting",
    },
  },
  {
    id: "recording",
    label: "Recording Suite",
    labelKo: "녹음실",
    zone: "room-teachers",
    top: 38,
    left: 81,
    chitchat: [
      "테이크 원 더! 🎙",
      "목소리 톤 좋아요~",
      "헤드폰 체크 완료",
      "브릿지만 다시 찍자",
    ],
    demo: {
      slug: "teacher-park",
      name: "박서연",
      avatar: "teacher-female",
      emoji: "🎙",
      status: "working",
    },
  },
  {
    id: "mentor",
    label: "Mentor Lounge",
    labelKo: "멘토 라운지",
    zone: "room-director",
    top: 22,
    left: 81,
    chitchat: [
      "이번 주 작곡 많이 늘었네",
      "콩쿠르 준비 잘하고 있어",
      "명예의 전당 사진 봤어?",
      "오늘 레슨 피드백 드릴게",
    ],
    demo: {
      slug: "director-principal",
      name: "김원장",
      avatar: "director-male",
      emoji: "👑",
      status: "meeting",
    },
  },
  {
    id: "hub",
    label: "Grand Hub",
    labelKo: "그랜드 허브",
    zone: "room-teachers",
    top: 40,
    left: 49,
    chitchat: [
      "HELLO 테마 연습 중 🎹",
      "그랜드 연주 시작!",
      "중앙 무대 리허설~",
      "날개 H 로고 멋져 ✨",
    ],
    demo: {
      slug: "teacher-choi",
      name: "최그랜드",
      avatar: "teacher-male",
      emoji: "🎹",
      status: "working",
    },
  },
];

export function chitchatForRoom(
  room: FloorRoom,
  employeeId: number,
  tick: number,
): string {
  const list = room.chitchat;
  return list[(employeeId + tick) % list.length];
}

export function avatarPath(avatarKey: string): string {
  return `/characters/chibi/${avatarKey}.png`;
}
