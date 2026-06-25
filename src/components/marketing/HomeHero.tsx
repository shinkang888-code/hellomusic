import Image from "next/image";
import Link from "next/link";
import { HelloLogo } from "@/components/brand/HelloLogo";
import { HelloWaveDivider } from "@/components/brand/HelloWaveDivider";
import { BRAND } from "@/data/academy-content";
import { BRAND_ASSETS } from "@/data/brand-assets";

export function HomeHero() {
  return (
    <>
      <section className="relative min-h-[90vh] overflow-hidden">
        <Image
          src={BRAND_ASSETS.heroHome}
          alt="Hello Music Academy — HELLO luxury piano studio"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#FAF8F4]/95 via-[#F5F0E8]/75 to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#F5F0E8]/40 to-transparent"
          aria-hidden
        />

        <div className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-6 py-28 lg:px-8">
          <HelloLogo height={56} priority className="mb-8 drop-shadow-sm" />

          <div className="hello-glow-badge inline-flex w-fit items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold tracking-[0.12em] text-sub backdrop-blur-sm">
            <span className="size-2 animate-pulse rounded-full bg-[#C9A962]" />
            HELLO · 피아노 전문 · 1:1 맞춤
          </div>

          <h1 className="mt-8 max-w-3xl text-4xl font-light leading-[1.15] tracking-tight text-main sm:text-5xl lg:text-6xl">
            {BRAND.slogan}
            <span className="mt-2 block font-semibold gradient-text">
              Hello Music Academy
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-sub sm:text-xl">
            {BRAND.taglineKo}. 그랜드 스튜디오와 AI 학원관리로
            <span className="text-accent-soft"> Play · Learn · Grow</span>.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/office" className="btn-primary">
              AI 학원 둘러보기
            </Link>
            <Link
              href="/services"
              className="btn-secondary rounded-full px-6 py-3 text-sm font-semibold tracking-wide"
            >
              수업 안내
            </Link>
            <Link href="/contact" className="btn-ghost tracking-wide">
              체험 레슨 →
            </Link>
          </div>

          <p className="mt-10 text-sm font-medium tracking-[0.15em] text-muted uppercase">
            {BRAND.tagline}
          </p>
        </div>
      </section>
      <HelloWaveDivider />
    </>
  );
}
