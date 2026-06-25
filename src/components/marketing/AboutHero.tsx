import Image from "next/image";
import Link from "next/link";
import { HelloLogo } from "@/components/brand/HelloLogo";
import { BRAND, HELLO_MANAGER } from "@/data/academy-content";
import { BRAND_ASSETS } from "@/data/brand-assets";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-page">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-8 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="hello-section-label">About · HELLO</p>

            <div className="mt-6 flex items-center gap-4">
              <HelloLogo height={52} />
            </div>

            <h1 className="mt-6 text-3xl font-light tracking-tight text-main sm:text-4xl">
              {BRAND.name}
            </h1>
            <p className="mt-2 text-sm font-medium tracking-[0.2em] text-accent-soft uppercase">
              {BRAND.tagline}
            </p>

            <p className="mt-8 text-xl font-medium leading-relaxed text-main sm:text-2xl">
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
                한 마디로 처리합니다. 원장·강사는 음악 교육에만 집중할 수
                있습니다.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/office" className="btn-primary">
                AI 학원 둘러보기
              </Link>
              <Link
                href="/contact"
                className="btn-secondary rounded-full px-6 py-3 text-sm font-semibold"
              >
                체험 레슨 상담
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="about-image-frame overflow-hidden rounded-3xl ring-1 ring-[#C9A962]/30">
              <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image
                  src={BRAND_ASSETS.heroAbout}
                  alt="Hello Music Academy studio"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="about-image-overlay absolute inset-0" aria-hidden />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-4 rounded-2xl border border-[#C9A962]/25 bg-card p-5 shadow-lg sm:-left-8">
              <p className="text-3xl font-light text-main">
                120<span className="text-accent-soft">+</span>
              </p>
              <p className="mt-1 text-sm text-sub">재원 원생 · 9개 레슨실</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
