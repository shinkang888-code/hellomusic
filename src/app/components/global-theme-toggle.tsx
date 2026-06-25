"use client";

import { ThemeToggle } from "./theme-toggle";

/** 모든 페이지 우상단에 고정 표시되는 테마 토글 */
export function GlobalThemeToggle() {
  return <ThemeToggle fixed />;
}
