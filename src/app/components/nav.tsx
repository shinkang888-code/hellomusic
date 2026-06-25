import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Nav({
  active,
}: {
  active?: "home" | "about" | "services" | "contact" | "office" | "console" | "control-tower";
}) {
  const items = [
    { href: "/", label: "홈", key: "home" },
    { href: "/about", label: "회사 소개", key: "about" },
    { href: "/services", label: "사업 영역", key: "services" },
    { href: "/office", label: "🏢 AI 오피스", key: "office" },
    { href: "/control-tower", label: "🛰 LogShield", key: "control-tower" },
    { href: "/console", label: "🎛 관리 콘솔", key: "console" },
    { href: "/contact", label: "문의", key: "contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-theme bg-nav backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-bold text-main">
          <Image
            src="/brand/lonex-logo.png"
            alt="Lonex"
            width={32}
            height={32}
            className="size-8 rounded-md ring-1 ring-theme"
          />
          <span>
            Lonex <span className="text-accent">AI</span>
          </span>
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-1 text-sm">
          {items.map((it) => (
            <Link
              key={it.key}
              href={it.href}
              className={`nav-link rounded-lg px-3 py-1.5 ${
                active === it.key ? "nav-link-active" : ""
              }`}
            >
              {it.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
