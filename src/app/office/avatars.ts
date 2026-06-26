/** Hello Music Academy — Pixar 전신 + chibi(그리드) 캐릭터 */

import {
  pixarFramesForAvatar,
  pixarFramesForCast,
} from "./pixar-cast";

const SLUG_AVATAR: Record<string, string> = {
  "director-principal": "director-male",
  "director-vice": "director-female",
  "admin-lead": "director-female",
  "admin-billing": "director-female",
  "admin-counsel": "director-female",
  "teacher-park": "teacher-female",
  "teacher-choi": "teacher-male",
  "teacher-lee": "teacher-female",
  "teacher-han": "teacher-male",
  "student-lead-a": "student-girl",
  "student-lead-b": "student-boy",
  "student-jia": "student-girl",
  "student-doyoon": "student-boy",
  "student-seoyoon": "student-girl",
  "student-hajun": "student-boy",
  "student-yuna": "student-girl",
};

const DEPT_DEFAULT: Record<string, string> = {
  "room-director": "director-male",
  "room-admin": "director-female",
  "room-teachers": "teacher-female",
  "room-students": "student-girl",
  "floor-director": "director-male",
  "floor-admin": "director-female",
  "floor-teachers": "teacher-female",
  "floor-students": "student-girl",
};

const SLUG_TO_CAST_KEY = {
  "director-principal": "director-principal",
  "director-vice": "director-principal",
  "teacher-park": "teacher-park",
  "teacher-choi": "teacher-park",
  "teacher-lee": "teacher-park",
  "teacher-han": "teacher-park",
  "student-doyoon": "student-doyoon",
  "student-jia": "student-jia",
  "student-seoyoon": "student-jia",
  "student-hajun": "student-doyoon",
  "student-yuna": "student-jia",
} as const;

export function avatarForEmployee(slug: string): string {
  const key = SLUG_AVATAR[slug] ?? "student-girl";
  return `/characters/chibi/${key}.png`;
}

/** 그리드 뷰 — chibi 썸네일 */
export function avatarFor(departmentSlug: string): string {
  const key = DEPT_DEFAULT[departmentSlug] ?? "student-girl";
  return `/characters/chibi/${key}.png`;
}

export function baseFlip(_departmentSlug: string): boolean {
  return false;
}

/** 원본 lonex castFramesFor — Pixar 전신 2프레임 */
export function castFramesFor(departmentSlug: string): string[] {
  const avatar = DEPT_DEFAULT[departmentSlug] ?? "student-girl";
  return pixarFramesForAvatar(avatar);
}

export function castFramesForSlug(slug: string): string[] {
  const mapped = SLUG_TO_CAST_KEY[slug as keyof typeof SLUG_TO_CAST_KEY];
  if (mapped) return pixarFramesForCast(mapped);
  return pixarFramesForAvatar(SLUG_AVATAR[slug] ?? "student-girl");
}

export function framesFor(departmentSlug: string): string[] {
  return castFramesFor(departmentSlug);
}
