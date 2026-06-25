import Link from "next/link";
import { HelloLogo } from "@/components/brand/HelloLogo";
import { BRAND } from "@/data/academy-content";

export function MarketingFooter() {
  return (
    <footer className="border-t border-theme bg-[#3D3D3D] py-14 text-[#E5E2DC]/75">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="text-center sm:text-left">
            <HelloLogo height={44} className="mx-auto brightness-0 invert opacity-90 sm:mx-0" />
            <p className="mt-4 text-sm leading-relaxed">
              {BRAND.name}
              <br />
              {BRAND.tagline} · {BRAND.phone}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm tracking-wide">
            <Link href="/about" className="transition hover:text-[#E8D5A8]">
              학원 소개
            </Link>
            <Link href="/services" className="transition hover:text-[#E8D5A8]">
              수업 안내
            </Link>
            <Link href="/office" className="transition hover:text-[#E8D5A8]">
              AI 학원
            </Link>
            <a
              href={BRAND.blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-[#E8D5A8]"
            >
              Blog
            </a>
            <Link href="/contact" className="transition hover:text-[#E8D5A8]">
              체험 상담
            </Link>
          </div>
        </div>
        <p className="mt-10 text-center text-xs tracking-[0.15em] text-[#9A9590] uppercase">
          © HELLO · Hello Music Academy
        </p>
      </div>
    </footer>
  );
}
