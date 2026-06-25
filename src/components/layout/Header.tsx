"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/about", label: "회사 소개" },
  { href: "/services", label: "사업 영역" },
  { href: "/contact", label: "문의" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <Image
            alt="Lonex"
            src="/brand/lonex-logo.png"
            width={32}
            height={32}
            className="size-8 rounded-md"
          />
          <span>
            Lonex <span className="text-blue-400">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 text-sm">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-1.5 transition ${
                  active
                    ? "bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href="https://lonex-ai.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="ml-1 rounded-lg px-3 py-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
          >
            🎛 대시보드
          </a>
        </div>
      </nav>
    </header>
  );
}
