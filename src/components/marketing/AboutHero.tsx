import Image from "next/image";
import Link from "next/link";
import { LonexLogo } from "@/components/brand/LonexLogo";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-8 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full glass-badge px-4 py-1.5 text-xs font-semibold tracking-wide text-sub">
              <span className="size-2 rounded-full bg-emerald-400" />
              About Lonex AI
            </div>

            <div className="mt-8">
              <LonexLogo size="md" accent="AI" />
            </div>

            <p className="mt-6 text-xl font-medium leading-relaxed text-accent sm:text-2xl">
              The Logical Nexus of Infinite Data.
            </p>
            <p className="mt-2 text-base text-muted">
              무한한 데이터를 잇는 논리적 연결점.
            </p>

            <div className="mt-8 space-y-5 text-base leading-relaxed text-sub sm:text-lg">
              <p>
                Lonex AI는 특허·지식재산·법률 영역에서 AI 기술을 실무에
                적용하는 기술 기업입니다. lawygoai 플랫폼과 연계하여 특허
                협상, 문서 분석, 한국어 LLM, 임베딩·리랭킹 등 end-to-end AI
                스택을 제공합니다.
              </p>
              <p>
                217명의 AI 직원이 운영하는 라이브 오피스, Neon PostgreSQL
                기반 모델 카탈로그, Vercel 위의 Next.js 대시보드는 Lonex AI의
                기술력과 운영 철학을 보여주는 대표 프로덕트입니다.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/office" className="btn-primary">
                AI 오피스 보기
              </Link>
              <Link href="/contact" className="btn-secondary px-5 py-3 text-sm font-semibold">
                문의하기
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="about-image-frame overflow-hidden rounded-3xl ring-1 ring-theme">
              <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image
                  src="/images/about-hero.png"
                  alt="Lonex AI — Enterprise Technology"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="about-image-overlay absolute inset-0" aria-hidden />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-4 rounded-2xl bg-card p-5 shadow-lg ring-1 ring-theme sm:-left-8">
              <p className="text-3xl font-bold text-main">217+</p>
              <p className="mt-1 text-sm text-sub">AI 직원 라이브 운영</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
