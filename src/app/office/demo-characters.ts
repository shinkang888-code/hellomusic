import agency from "@/data/agency.json";
import type { CompanyData, Department, Employee } from "./types";
import { FLOOR_ROOMS, type FloorRoom } from "./floor-plan-rooms";

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

export function demoEmployeeForRoom(room: FloorRoom, index: number): Employee {
  const d = room.demo;
  return {
    id: 9000 + index,
    slug: d.slug,
    department_slug: room.zone,
    name: d.name,
    description: `${room.labelKo} · ${room.label}`,
    color: DIVISIONS[room.zone]?.color ?? "#C9A962",
    emoji: d.emoji,
    vibe: room.chitchat[0],
    status: d.status,
    current_task: null,
  };
}

/** 방별 DB 직원 매칭 — slug 일치 우선, 없으면 zone 풀 */
export function resolveRoomEmployee(
  room: FloorRoom,
  employees: Employee[],
  zoneIndex: Map<string, number>,
): Employee {
  const bySlug = employees.find((e) => e.slug === room.demo.slug);
  if (bySlug) return bySlug;

  const pool = employees.filter((e) => e.department_slug === room.zone);
  if (pool.length > 0) {
    const idx = zoneIndex.get(room.zone) ?? 0;
    zoneIndex.set(room.zone, idx + 1);
    return pool[idx % pool.length];
  }

  return demoEmployeeForRoom(room, FLOOR_ROOMS.indexOf(room));
}

export function isDemoMode(employees: Employee[]): boolean {
  return employees.length === 0;
}

/** API·DB 실패 시 office 전체 폴백 */
export function getDemoCompanyData(): CompanyData {
  const employees = FLOOR_ROOMS.map((room, i) => demoEmployeeForRoom(room, i));
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
