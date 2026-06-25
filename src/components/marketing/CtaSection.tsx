import Link from "next/link";
import { HelloLogo } from "@/components/brand/HelloLogo";
import { WaitlistForm } from "@/app/waitlist-form";
import { BRAND } from "@/data/academy-content";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="cta-panel relative overflow-hidden rounded-3xl p-10 sm:p-14 lg:p-16">
        <div className="cta-panel-glow absolute -right-20 -top-20 size-80 rounded-full blur-3xl" aria-hidden />
        <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-xl">
            <HelloLogo height={48} className="brightness-0 invert opacity-90" />
            <p className="hello-section-label mt-6 text-[#E8D5A8]">Trial Lesson</p>
            <h2 className="mt-3 text-3xl font-light tracking-tight text-[#FAF8F4] sm:text-4xl">
              체험 레슨 · 상담 신청
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[#E5E2DC]/85">
              {BRAND.slogan}. 1:1 체험 레슨과 학원 견학을 예약하세요. 카카오{" "}
              {BRAND.kakao}
            </p>
            <WaitlistForm />
            <p className="mt-4 text-sm text-[#C9C4BC]/70">
              또는{" "}
              <a
                href={BRAND.blogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E8D5A8] underline underline-offset-2 hover:text-[#FAF8F4]"
              >
                네이버 블로그
              </a>
              에서 수업 후기를 확인하세요.
            </p>
          </div>
          <div className="hidden rounded-2xl border border-[#C9A962]/30 bg-[#FAF8F4]/5 p-8 text-center lg:block">
            <p className="text-5xl font-light text-[#E8D5A8]">HELLO</p>
            <p className="mt-2 text-sm tracking-[0.25em] text-[#C9C4BC]">
              Play · Learn · Grow
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
