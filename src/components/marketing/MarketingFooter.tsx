import Link from "next/link";
import { BRAND } from "@/data/academy-content";

export function MarketingFooter() {
  return (
    <footer className="border-t border-theme bg-[#1e2a4a] py-12 text-amber-100/70">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-sm sm:flex-row lg:px-8">
        <p className="text-center sm:text-left">
          {BRAND.name} · {BRAND.tagline}
          <span className="hidden sm:inline"> · </span>
          <span className="block sm:inline">{BRAND.phone}</span>
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/about" className="transition hover:text-amber-100">
            학원 소개
          </Link>
          <Link href="/services" className="transition hover:text-amber-100">
            수업 안내
          </Link>
          <Link href="/office" className="transition hover:text-amber-100">
            AI 학원
          </Link>
          <a
            href={BRAND.blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-amber-100"
          >
            Blog
          </a>
          <Link href="/contact" className="transition hover:text-amber-100">
            체험 상담
          </Link>
        </div>
      </div>
    </footer>
  );
}
