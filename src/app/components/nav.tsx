import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/data/academy-content";

export function Nav({
  active,
}: {
  active?: "home" | "about" | "services" | "contact" | "office" | "console" | "control-tower";
}) {
  const items = [
    { href: "/", label: "홈", key: "home" },
    { href: "/about", label: "학원 소개", key: "about" },
    { href: "/services", label: "수업 안내", key: "services" },
    { href: "/office", label: "🎹 AI 학원", key: "office" },
    { href: "/console", label: "🎛 관리", key: "console" },
    { href: "/contact", label: "체험 상담", key: "contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-theme bg-nav backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 pr-24 sm:pr-28">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-bold text-main">
          <Image
            src="/brand/hello-music-logo.png"
            alt={BRAND.name}
            width={36}
            height={36}
            className="size-9 rounded-lg ring-1 ring-theme"
          />
          <span>
            Hello <span className="text-accent">Music</span>
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
        </div>
      </nav>
    </header>
  );
}
