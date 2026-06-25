/** 평면도 위 고정 캐릭터 슬롯 — 원장 / 레슨 / 연습 */

import type { EmployeeStatus } from "./types";

export type FloorCharacterSlot = {
  id: string;
  scene: string;
  roleLabel: string;
  slug: string;
  name: string;
  avatar: string;
  zone: "room-director" | "room-admin" | "room-teachers" | "room-students";
  top: number;
  left: number;
  scale?: number;
  status: EmployeeStatus;
  gesture: "head" | "arm" | "idle";
  chitchat: string[];
};

/** 이소메트릭 배경(empty) 기준 좌표 (%) */
export const FLOOR_CHARACTERS: FloorCharacterSlot[] = [
  {
    id: "director",
    scene: "멘토 라운지",
    roleLabel: "원장",
    slug: "director-principal",
    name: "김원장",
    avatar: "director-male",
    zone: "room-director",
    top: 26,
    left: 83,
    scale: 1.05,
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
    zone: "room-teachers",
    top: 41,
    left: 44,
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
    zone: "room-students",
    top: 46,
    left: 54,
    scale: 0.92,
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
    zone: "room-students",
    top: 59,
    left: 41,
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

export function avatarPath(avatarKey: string): string {
  return `/characters/chibi/${avatarKey}.png`;
}

/** 방 라벨 (푸터·헤더용) */
export const FLOOR_SCENE_LABELS = [
  "멘토 라운지",
  "그랜드 허브",
  "스마트 연습실",
] as const;
