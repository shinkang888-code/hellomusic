import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/data/academy-content";

export function HomeHero() {
  return (
    <section className="relative min-h-[88vh] overflow-hidden">
      <Image
        src="/images/hero-home.png"
        alt="Hello Music Academy 피아노 레슨실"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="hero-overlay absolute inset-0 bg-gradient-to-r from-[#1e2a4a]/90 via-[#1e2a4a]/70 to-transparent" aria-hidden />

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-6 py-24 lg:px-8">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-400/30 bg-[#1e2a4a]/60 px-4 py-1.5 text-xs font-semibold tracking-wide text-amber-100 backdrop-blur">
          <span className="size-2 animate-pulse rounded-full bg-amber-400" />
          🎹 피아노 전문 · 1:1 맞춤 · AI 학원관리
        </div>

        <h1 className="mt-8 max-w-4xl text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
          {BRAND.slogan}
          <span className="gradient-text block sm:inline">
            {" "}
            Hello Music
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-amber-50/90 sm:text-xl">
          {BRAND.taglineKo}. 초급부터 전공·입시까지, 그랜드 피아노 스튜디오와
          AI 학원관리(HelloManager)로 원장·강사·원생이 함께 성장합니다.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/office" className="btn-primary">
            🏫 AI 학원 둘러보기
          </Link>
          <Link href="/services" className="btn-secondary px-5 py-3 text-sm font-semibold">
            🎼 수업 안내
          </Link>
          <Link href="/contact" className="btn-ghost text-amber-100">
            체험 레슨 신청 ↓
          </Link>
        </div>

        <p className="mt-8 text-sm font-medium text-amber-300/90">
          {BRAND.tagline}
        </p>
      </div>
    </section>
  );
}
