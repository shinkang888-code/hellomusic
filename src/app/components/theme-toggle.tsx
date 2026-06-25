"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle({ fixed = false }: { fixed?: boolean }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
      aria-label={theme === "light" ? "다크 모드" : "라이트 모드"}
      className={
        fixed
          ? "fixed top-3 right-3 z-[200] flex items-center gap-1.5 rounded-full bg-card px-4 py-2 text-sm font-bold text-main shadow-xl ring-2 ring-blue-500/60 backdrop-blur-md transition hover:ring-blue-500 hover:shadow-blue-500/20"
          : "rounded-lg px-3 py-1.5 text-sm font-semibold ring-1 ring-theme transition bg-theme-toggle text-theme-toggle hover:opacity-90"
      }
    >
      <span aria-hidden className="text-base">
        {theme === "light" ? "🌙" : "☀️"}
      </span>
      {theme === "light" ? "다크" : "라이트"}
    </button>
  );
}
