"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
      aria-label={theme === "light" ? "다크 모드" : "라이트 모드"}
      className="rounded-lg px-3 py-1.5 text-sm font-semibold ring-1 transition bg-theme-toggle text-theme-toggle hover:opacity-90"
    >
      {theme === "light" ? "🌙 다크" : "☀️ 라이트"}
    </button>
  );
}
