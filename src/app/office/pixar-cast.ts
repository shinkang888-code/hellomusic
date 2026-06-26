/** Hello Music — Pixar 전신 캐릭터 (원본 lonex castFramesFor 패턴) */

export type PixarCastKey =
  | "director-principal"
  | "teacher-park"
  | "student-doyoon"
  | "student-jia";

/** [idle, walk] — 동일 전신 2프레임(원본 lonex 패턴, CSS 미세동작 병행) */
const PIXAR_FRAMES: Record<PixarCastKey, [string, string]> = {
  "director-principal": [
    "/characters/pixar/director-principal.png",
    "/characters/pixar/director-principal.png",
  ],
  "teacher-park": [
    "/characters/pixar/teacher-park.png",
    "/characters/pixar/teacher-park.png",
  ],
  "student-doyoon": [
    "/characters/pixar/student-doyoon.png",
    "/characters/pixar/student-doyoon.png",
  ],
  "student-jia": [
    "/characters/pixar/student-jia.png",
    "/characters/pixar/student-jia.png",
  ],
};

const AVATAR_TO_CAST: Record<string, PixarCastKey> = {
  "director-male": "director-principal",
  "director-female": "director-principal",
  "teacher-female": "teacher-park",
  "teacher-male": "teacher-park",
  "student-boy": "student-doyoon",
  "student-girl": "student-jia",
};

export function pixarCastKeyForAvatar(avatarKey: string): PixarCastKey {
  return AVATAR_TO_CAST[avatarKey] ?? "student-doyoon";
}

export function pixarFramesForAvatar(avatarKey: string): string[] {
  return PIXAR_FRAMES[pixarCastKeyForAvatar(avatarKey)];
}

export function pixarFramesForCast(castKey: PixarCastKey): string[] {
  return PIXAR_FRAMES[castKey];
}
