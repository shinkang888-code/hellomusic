export type Department = {
  slug: string;
  label: string;
  color: string;
  icon: string | null;
  sort: number;
};

export type EmployeeStatus =
  | "working"
  | "meeting"
  | "review"
  | "idle"
  | "error";

export type Employee = {
  id: number;
  slug: string;
  department_slug: string;
  name: string;
  description: string | null;
  color: string | null;
  emoji: string | null;
  vibe: string | null;
  status: EmployeeStatus;
  current_task: string | null;
};

export type Site = {
  id: number;
  name: string;
  url: string;
  department_slug: string | null;
  status: "up" | "down" | "unknown";
  http_code: number | null;
  last_checked: string | null;
};

export type CompanyData = {
  departments: Department[];
  employees: Employee[];
  sites: Site[];
  stats: {
    total: number;
    working: number;
    meeting: number;
    idle: number;
    departments: number;
  };
};

export const STATUS_META: Record<
  EmployeeStatus,
  { label: string; ring: string; dot: string }
> = {
  working: { label: "근무중", ring: "#22c55e", dot: "bg-emerald-400" },
  meeting: { label: "회의중", ring: "#3b82f6", dot: "bg-blue-400" },
  review: { label: "검토중", ring: "#eab308", dot: "bg-yellow-400" },
  idle: { label: "대기", ring: "#64748b", dot: "bg-slate-500" },
  error: { label: "장애대응", ring: "#ef4444", dot: "bg-red-500" },
};
