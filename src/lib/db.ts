import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL 환경변수가 설정되지 않았습니다.");
}

export const sql = neon(databaseUrl);

export type Model = {
  id: number;
  repo_id: string;
  category: string;
  name: string;
  downloads: number;
  likes: number;
  note: string | null;
};

export type Department = {
  slug: string;
  label: string;
  color: string;
  icon: string | null;
  sort: number;
  real_member_name: string | null;
  has_real_avatar: boolean;
};

export type EmployeeStatus = "working" | "meeting" | "review" | "idle" | "error";

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

export type Task = {
  id: number;
  title: string;
  status: "todo" | "doing" | "done";
  department_slug: string | null;
  employee_id: number | null;
  source: string;
  created_at: string;
};

export type EventLog = {
  id: number;
  ts: string;
  actor: string | null;
  message: string;
};
