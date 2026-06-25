import Image from "next/image";
import Link from "next/link";

export function HomeHero() {
  return (
    <section className="relative min-h-[88vh] overflow-hidden">
      <Image
        src="/images/hero-home.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="hero-overlay absolute inset-0" aria-hidden />

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-6 py-24 lg:px-8">
        <div className="inline-flex w-fit items-center gap-2 rounded-full glass-badge px-4 py-1.5 text-xs font-semibold tracking-wide text-main">
          <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
          Neon · Vercel · Next.js Enterprise Stack
        </div>

        <h1 className="mt-8 max-w-4xl text-5xl font-bold leading-[1.08] tracking-tight text-main sm:text-6xl lg:text-7xl">
          무한한 데이터를 잇는
          <span className="gradient-text block sm:inline"> 논리적 연결점</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-sub sm:text-xl">
          Lonex AI는 특허·법률·협상 도메인을 위한 오픈소스 모델 큐레이션과
          217명의 AI 직원이 실시간으로 일하는 라이브 오피스를 제공합니다.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/office" className="btn-primary">
            🏢 AI 오피스 둘러보기
          </Link>
          <Link href="/control-tower" className="btn-secondary px-5 py-3 text-sm font-semibold">
            🛰 LogShield 관제탑
          </Link>
          <Link href="#catalog" className="btn-ghost">
            모델 카탈로그 ↓
          </Link>
        </div>

        <p className="mt-8 text-sm font-medium text-accent">
          The Logical Nexus of Infinite Data.
        </p>
      </div>
    </section>
  );
}
