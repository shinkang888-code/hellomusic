// 부서(division) → Lonex 캐릭터 아키타입 매핑
// 생성된 세련된 3D 캐릭터를 부서 성격에 맞게(적재적소) 배치
export type Archetype =
  | "tech"
  | "creative"
  | "business"
  | "research"
  | "security"
  | "comms";

const DEPT_ARCHETYPE: Record<string, Archetype> = {
  engineering: "tech",
  "game-development": "tech",
  "spatial-computing": "tech",
  testing: "tech",
  gis: "tech",
  design: "creative",
  finance: "business",
  sales: "business",
  product: "business",
  "project-management": "business",
  academic: "research",
  specialized: "research",
  security: "security",
  support: "security",
  marketing: "comms",
  "paid-media": "comms",
};

export function avatarFor(departmentSlug: string): string {
  if (CAST.has(departmentSlug))
    return `/characters/cast/${departmentSlug}_1.png`;
  const a = DEPT_ARCHETYPE[departmentSlug] ?? "tech";
  return `/characters/${a}.png`;
}

// 기준 이미지를 좌우반전(미러링)해야 전문팀(오른쪽 보기)과 같은 방향이 되는 부서들.
// 전문팀(specialized)을 모델로, 뒤로 걷던 부서들을 반전 처리해 방향을 통일한다.
// 반전하지 않는(원본 그대로 오른쪽 보기) 부서: specialized, finance, sales, testing
const LEFT_FACING = new Set([
  "academic",
  "design",
  "engineering",
  "game-development",
  "gis",
  "marketing",
  "paid-media",
  "product",
  "project-management",
  "security",
  "spatial-computing",
  "support",
]);

// true면 기준 이미지를 좌우반전해야 전문팀과 같은(오른쪽) 방향이 된다.
export function baseFlip(departmentSlug: string): boolean {
  return LEFT_FACING.has(departmentSlug);
}

// 워크 사이클 프레임 [idle, 왼발, 오른발]
export function framesFor(departmentSlug: string): string[] {
  const a = DEPT_ARCHETYPE[departmentSlug] ?? "tech";
  return [
    `/characters/frames/${a}_0.png`,
    `/characters/frames/${a}_1.png`,
    `/characters/frames/${a}_2.png`,
  ];
}

// 부서별 고유 성인 캐릭터(다양한 인종/성별) 워크 2프레임 [왼발, 오른발]
const CAST = new Set([
  "academic","design","engineering","finance","game-development","gis",
  "marketing","paid-media","product","project-management","sales","security",
  "spatial-computing","specialized","support","testing",
]);
export function castFramesFor(departmentSlug: string): string[] {
  if (!CAST.has(departmentSlug)) return framesFor(departmentSlug).slice(1);
  return [
    `/characters/cast/${departmentSlug}_1.png`,
    `/characters/cast/${departmentSlug}_2.png`,
  ];
}

