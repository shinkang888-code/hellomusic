import Link from "next/link";
import { WaitlistForm } from "@/app/waitlist-form";
import { BRAND } from "@/data/academy-content";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="cta-panel relative overflow-hidden rounded-3xl bg-[#1e2a4a] p-10 sm:p-14 lg:p-16">
        <div className="cta-panel-glow absolute -right-20 -top-20 size-80 rounded-full bg-amber-400/10 blur-3xl" aria-hidden />
        <div className="relative max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">
            Trial Lesson
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            체험 레슨 · 상담 신청
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-amber-100/80">
            {BRAND.slogan}. 1:1 체험 레슨과 학원 견학을 예약하세요. 카카오{" "}
            {BRAND.kakao}
          </p>
          <WaitlistForm />
          <p className="mt-4 text-sm text-amber-100/60">
            또는{" "}
            <a
              href={BRAND.blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-200"
            >
              네이버 블로그
            </a>
            에서 수업 후기를 확인하세요.
          </p>
        </div>
      </div>
    </section>
  );
}
