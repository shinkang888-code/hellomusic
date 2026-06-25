import Link from "next/link";
import { HelloLogo } from "@/components/brand/HelloLogo";

export function Nav({
  active,
}: {
  active?: "home" | "about" | "services" | "contact" | "office" | "console" | "control-tower";
}) {
  const items = [
    { href: "/", label: "홈", key: "home" },
    { href: "/about", label: "학원 소개", key: "about" },
    { href: "/services", label: "수업 안내", key: "services" },
    { href: "/office", label: "AI 학원", key: "office" },
    { href: "/console", label: "관리", key: "console" },
    { href: "/contact", label: "체험 상담", key: "contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-theme bg-nav backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 pr-24 sm:pr-28">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 transition opacity-90 hover:opacity-100"
        >
          <HelloLogo height={40} markOnly priority />
          <span className="hidden text-sm font-semibold tracking-[0.18em] text-main sm:inline">
            HELLO
            <span className="ml-1 font-light text-muted">Music</span>
          </span>
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-0.5 text-sm">
          {items.map((it) => (
            <Link
              key={it.key}
              href={it.href}
              className={`nav-link rounded-full px-3.5 py-1.5 tracking-wide ${
                active === it.key ? "nav-link-active" : ""
              }`}
            >
              {it.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
