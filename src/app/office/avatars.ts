/** Hello Music Academy 2D 2등신 chibi 캐릭터 */

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
};

export function avatarForEmployee(slug: string): string {
  const key = SLUG_AVATAR[slug] ?? "student-girl";
  return `/characters/chibi/${key}.png`;
}

/** @deprecated 부서 slug 기본 캐릭터 (그리드 뷰) */
export function avatarFor(departmentSlug: string): string {
  const key = DEPT_DEFAULT[departmentSlug] ?? "student-girl";
  return `/characters/chibi/${key}.png`;
}

export function baseFlip(_departmentSlug: string): boolean {
  return false;
}

export function castFramesFor(departmentSlug: string): string[] {
  const key = DEPT_DEFAULT[departmentSlug] ?? "student-girl";
  return [`/characters/chibi/${key}.png`];
}

export function framesFor(departmentSlug: string): string[] {
  return castFramesFor(departmentSlug);
}
