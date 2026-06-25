import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-theme bg-card/40 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-sm text-muted sm:flex-row lg:px-8">
        <p className="text-center sm:text-left">
          Lonex AI · The Logical Nexus of Infinite Data
          <span className="hidden sm:inline"> · </span>
          <span className="block sm:inline">Powered by Next.js + Neon + Vercel</span>
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/about" className="transition hover:text-main">
            회사 소개
          </Link>
          <Link href="/services" className="transition hover:text-main">
            사업 영역
          </Link>
          <Link href="/office" className="transition hover:text-main">
            AI 오피스
          </Link>
          <Link href="/contact" className="transition hover:text-main">
            문의
          </Link>
        </div>
      </div>
    </footer>
  );
}
