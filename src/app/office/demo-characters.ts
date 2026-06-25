import agency from "@/data/agency.json";
import type { CompanyData, Department, Employee } from "./types";
import {
  FLOOR_CHARACTERS,
  type FloorCharacterSlot,
} from "./floor-plan-characters";

const DIVISIONS = agency.divisions as Record<
  string,
  { label: string; color: string; icon: string }
>;

/** DB 미연결·미시드 시 평면도용 부서 */
export const DEMO_DEPARTMENTS: Department[] = Object.entries(DIVISIONS).map(
  ([slug, meta], sort) => ({
    slug,
    label: meta.label,
    color: meta.color,
    icon: meta.icon,
    sort,
    real_member_name: null,
    has_real_avatar: false,
  }),
);

export function demoEmployeeForSlot(
  slot: FloorCharacterSlot,
  index: number,
): Employee {
  return {
    id: 9000 + index,
    slug: slot.slug,
    department_slug: slot.zone,
    name: slot.name,
    description: `${slot.scene} · ${slot.roleLabel}`,
    color: DIVISIONS[slot.zone]?.color ?? "#C9A962",
    emoji: null,
    vibe: slot.chitchat[0],
    status: slot.status,
    current_task: null,
  };
}

export function resolveFloorCharacter(
  slot: FloorCharacterSlot,
  employees: Employee[],
  index: number,
): Employee {
  const bySlug = employees.find((e) => e.slug === slot.slug);
  if (bySlug) return bySlug;
  return demoEmployeeForSlot(slot, index);
}

export function isDemoMode(employees: Employee[]): boolean {
  return employees.length === 0;
}

/** API·DB 실패 시 office 전체 폴백 */
export function getDemoCompanyData(): CompanyData {
  const employees = FLOOR_CHARACTERS.map((slot, i) =>
    demoEmployeeForSlot(slot, i),
  );
  return {
    departments: DEMO_DEPARTMENTS,
    employees,
    sites: [
      {
        id: 1,
        name: "Hello Music Academy",
        url: "https://lc-aca.vercel.app",
        department_slug: "room-director",
        status: "up",
        http_code: 200,
        last_checked: new Date().toISOString(),
      },
    ],
    stats: {
      total: employees.length,
      working: employees.filter((e) => e.status === "working").length,
      meeting: employees.filter((e) => e.status === "meeting").length,
      idle: employees.filter((e) => e.status === "idle").length,
      departments: DEMO_DEPARTMENTS.length,
    },
  };
}
