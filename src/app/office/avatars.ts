// LC Academy 부서 → 캐릭터 아키타입 매핑
export type Archetype =
  | "tech"
  | "creative"
  | "business"
  | "research"
  | "security"
  | "comms";

const DEPT_ARCHETYPE: Record<string, Archetype> = {
  "floor-director": "business",
  "floor-admin": "business",
  "floor-teachers": "research",
  "floor-students": "creative",
};

/** 기존 lonex cast 이미지 재활용 */
const CAST_MAP: Record<string, string> = {
  "floor-director": "finance",
  "floor-admin": "project-management",
  "floor-teachers": "academic",
  "floor-students": "design",
};

export function avatarFor(departmentSlug: string): string {
  const cast = CAST_MAP[departmentSlug];
  if (cast) return `/characters/cast/${cast}_1.png`;
  const a = DEPT_ARCHETYPE[departmentSlug] ?? "tech";
  return `/characters/${a}.png`;
}

const LEFT_FACING = new Set(["floor-teachers", "floor-students"]);

export function baseFlip(departmentSlug: string): boolean {
  return LEFT_FACING.has(departmentSlug);
}

export function framesFor(departmentSlug: string): string[] {
  const a = DEPT_ARCHETYPE[departmentSlug] ?? "tech";
  return [
    `/characters/frames/${a}_0.png`,
    `/characters/frames/${a}_1.png`,
    `/characters/frames/${a}_2.png`,
  ];
}

export function castFramesFor(departmentSlug: string): string[] {
  const cast = CAST_MAP[departmentSlug];
  if (!cast) return framesFor(departmentSlug).slice(1);
  return [
    `/characters/cast/${cast}_1.png`,
    `/characters/cast/${cast}_2.png`,
  ];
}
