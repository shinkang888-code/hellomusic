/** 평면도 위 고정 캐릭터 슬롯 — 원장 / 레슨 / 연습 (Pixar 전신) */

import type { EmployeeStatus } from "./types";
import type { PixarCastKey } from "./pixar-cast";

export type FloorCharacterPose =
  | "mentor-sit"
  | "piano-teach"
  | "piano-play"
  | "violin-practice";

export type FloorCharacterSlot = {
  id: string;
  scene: string;
  roleLabel: string;
  slug: string;
  name: string;
  avatar: string;
  castKey: PixarCastKey;
  pose: FloorCharacterPose;
  zone: "room-director" | "room-admin" | "room-teachers" | "room-students";
  /** 이소메트릭 empty 배경 기준 발 위치 (%) */
  top: number;
  left: number;
  /** 전신 렌더 높이 배율 */
  heightScale?: number;
  flip?: boolean;
  status: EmployeeStatus;
  gesture: "head" | "arm" | "idle";
  chitchat: string[];
};

/**
 * hello-academy-isometric.png 레퍼런스 기준 배치
 * - 멘토 라운지: 1:1 멘토링
 * - 그랜드 허브: 그랜드 피아노 레슨
 * - 스마트 연습실: 바이올린 연습
 */
export const FLOOR_CHARACTERS: FloorCharacterSlot[] = [
  {
    id: "director",
    scene: "멘토 라운지",
    roleLabel: "원장",
    slug: "director-principal",
    name: "김원장",
    avatar: "director-male",
    castKey: "director-principal",
    pose: "mentor-sit",
    zone: "room-director",
    top: 24,
    left: 84,
    heightScale: 1.02,
    status: "meeting",
    gesture: "head",
    chitchat: [
      "오늘 학원 분위기 좋네요 ☕",
      "콩쿠르 준비 잘하고 있어요",
      "HELLO 테마 연주 멋졌어요",
      "학부모 상담 3시 예약~",
    ],
  },
  {
    id: "teacher-lesson",
    scene: "그랜드 허브",
    roleLabel: "강사",
    slug: "teacher-park",
    name: "박서연",
    avatar: "teacher-female",
    castKey: "teacher-park",
    pose: "piano-teach",
    zone: "room-teachers",
    top: 36,
    left: 41,
    heightScale: 1.08,
    status: "working",
    gesture: "arm",
    chitchat: [
      "손목 힘 빼고 연주해봐 🎹",
      "페달 밟는 타이밍 좋아!",
      "이 구간만 다시 해볼까?",
      "표정도 음악에 담아봐~",
    ],
  },
  {
    id: "student-lesson",
    scene: "그랜드 허브",
    roleLabel: "원생",
    slug: "student-doyoon",
    name: "도윤",
    avatar: "student-boy",
    castKey: "student-doyoon",
    pose: "piano-play",
    zone: "room-students",
    top: 41,
    left: 50,
    heightScale: 0.9,
    status: "working",
    gesture: "idle",
    chitchat: [
      "네! 이렇게요?",
      "선생님, 여기 어려워요…",
      "아까보다 소리 좋죠?",
      "다음 페이지 갈게요!",
    ],
  },
  {
    id: "student-practice",
    scene: "스마트 연습실",
    roleLabel: "원생",
    slug: "student-jia",
    name: "지아",
    avatar: "student-girl",
    castKey: "student-jia",
    pose: "violin-practice",
    zone: "room-students",
    top: 57,
    left: 39,
    heightScale: 0.94,
    status: "working",
    gesture: "head",
    chitchat: [
      "혼자 연습 중~ 🎵",
      "디지털 악보 96점!",
      "하이음 더 올려볼게",
      "발표회 곡 거의 외웠어",
    ],
  },
];

export function chitchatForCharacter(
  slot: FloorCharacterSlot,
  tick: number,
): string {
  return slot.chitchat[(slot.id.length + tick) % slot.chitchat.length];
}

/** @deprecated chibi 경로 — 그리드 뷰 등 레거시 */
export function avatarPath(avatarKey: string): string {
  return `/characters/chibi/${avatarKey}.png`;
}

export const FLOOR_SCENE_LABELS = [
  "멘토 라운지",
  "그랜드 허브",
  "스마트 연습실",
] as const;

export const POSE_LABELS: Record<FloorCharacterPose, string> = {
  "mentor-sit": "멘토링",
  "piano-teach": "레슨 지도",
  "piano-play": "피아노 연주",
  "violin-practice": "바이올린 연습",
};
