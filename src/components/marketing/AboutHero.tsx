import Image from "next/image";
import Link from "next/link";
import { BRAND, HELLO_MANAGER } from "@/data/academy-content";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-8 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-[#1e2a4a]/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-sub">
              <span className="size-2 rounded-full bg-amber-400" />
              About {BRAND.shortName}
            </div>

            <div className="mt-8 flex items-center gap-3">
              <Image
                src="/brand/hello-music-logo.png"
                alt={BRAND.name}
                width={56}
                height={56}
                className="size-14 rounded-xl ring-1 ring-theme"
              />
              <div>
                <h1 className="text-2xl font-bold text-main sm:text-3xl">
                  {BRAND.name}
                </h1>
                <p className="text-sm text-accent">{BRAND.tagline}</p>
              </div>
            </div>

            <p className="mt-6 text-xl font-medium leading-relaxed text-accent sm:text-2xl">
              {HELLO_MANAGER.headline}
            </p>
            <p className="mt-2 text-base text-muted">{HELLO_MANAGER.sub}</p>

            <div className="mt-8 space-y-5 text-base leading-relaxed text-sub sm:text-lg">
              <p>
                헬로뮤직은 서울 관악구를 기반으로 피아노 전문 1:1 레슨을
                제공합니다. Piano Practice 1–5, Theory Room, Lecture Hall,
                Grand Piano Studio로 구성된 1층 학원에서 초급·중급·고급·전공·성인
                과정을 운영합니다.
              </p>
              <p>
                HelloManager AI 학원관리로 등·하원·수납·카카오 알림톡을 자연어
                한 마디로 처리하고, 개인정보는 학원 내부에서 안전하게
                보호합니다. 원장·강사는 음악 교육에만 집중할 수 있습니다.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/office" className="btn-primary">
                AI 학원 둘러보기
              </Link>
              <Link href="/contact" className="btn-secondary px-5 py-3 text-sm font-semibold">
                체험 레슨 상담
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="about-image-frame overflow-hidden rounded-3xl ring-1 ring-theme">
              <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image
                  src="/images/about-hero.png"
                  alt="Hello Music Academy"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="about-image-overlay absolute inset-0" aria-hidden />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-4 rounded-2xl bg-card p-5 shadow-lg ring-1 ring-theme sm:-left-8">
              <p className="text-3xl font-bold text-main">120+</p>
              <p className="mt-1 text-sm text-sub">재원 원생 · 9개 레슨실</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
