import Image from "next/image";
import Link from "next/link";
import { BRAND_ASSETS } from "@/data/brand-assets";

const features = [
  {
    title: "체계적 피아노 커리큘럼",
    description:
      "바이엘·체르니부터 클래식·입시까지 1:1 맞춤. Theory Room·Lecture Hall·연습실 완비.",
    image: BRAND_ASSETS.featureCurriculum,
    href: "/services",
    cta: "수업 안내",
  },
  {
    title: "AI 학원 · 1F 평면도",
    description:
      "Hello Music Academy 실시간 학원 뷰. 원장·강사·원생 2D 캐릭터가 도면 위에서 활동합니다.",
    image: BRAND_ASSETS.featureOffice,
    href: "/office",
    cta: "학원 입장",
  },
  {
    title: "연주회 · 발표회",
    description:
      "Grand Piano Studio 정기 발표회, 콩쿠르·입시 대비 무대 경험. HelloManager로 학부모 알림.",
    image: BRAND_ASSETS.featureRecital,
    href: "/about",
    cta: "학원 소개",
  },
];

export function FeatureShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="max-w-2xl">
        <p className="hello-section-label">Why HELLO Music</p>
        <h2 className="mt-4 text-3xl font-light tracking-tight text-main sm:text-4xl">
          연주부터 AI 운영까지,
          <br className="hidden sm:block" />
          <span className="font-semibold gradient-text">피아노 전문 학원</span>
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-sub">
          HELLO 브랜드가 지향하는 프리미엄 음악 교육 — 1:1 레슨, 9개
          연습·레슨실, HelloManager AI 학원관리.
        </p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="image-card group overflow-hidden rounded-2xl ring-1 ring-theme"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={feature.image}
                alt={feature.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="image-card-overlay absolute inset-0" aria-hidden />
            </div>
            <div className="bg-card p-6">
              <h3 className="text-lg font-semibold tracking-wide text-main">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-sub">
                {feature.description}
              </p>
              <Link
                href={feature.href}
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold tracking-wide text-accent-soft transition group-hover:gap-2"
              >
                {feature.cta}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
