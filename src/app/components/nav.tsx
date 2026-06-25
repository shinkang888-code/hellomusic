import Image from "next/image";
import Link from "next/link";

export function Nav({
  active,
}: {
  active?: "home" | "about" | "services" | "contact" | "office" | "console";
}) {
  const items = [
    { href: "/", label: "홈", key: "home" },
    { href: "/about", label: "회사 소개", key: "about" },
    { href: "/services", label: "사업 영역", key: "services" },
    { href: "/office", label: "🏢 AI 오피스", key: "office" },
    { href: "/console", label: "🎛 관리 콘솔", key: "console" },
    { href: "/contact", label: "문의", key: "contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <Image
            src="/brand/lonex-logo.png"
            alt="Lonex"
            width={32}
            height={32}
            className="size-8 rounded-md"
          />
          <span>
            Lonex <span className="text-blue-400">AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-1 text-sm">
          {items.map((it) => (
            <Link
              key={it.key}
              href={it.href}
              className={`rounded-lg px-3 py-1.5 transition ${
                active === it.key
                  ? "bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
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
