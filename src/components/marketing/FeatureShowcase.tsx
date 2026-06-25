import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "라이브 AI 오피스",
    description:
      "217명의 AI 직원이 부서별로 근무·협업하는 실시간 가상 오피스. 업무지시방과 부서 프로필까지.",
    image: "/images/feature-office.png",
    href: "/office",
    cta: "오피스 입장",
  },
  {
    title: "모델 카탈로그",
    description:
      "한국어 LLM, 특허·법률, 임베딩, OCR 등 lawygoai를 위한 Hugging Face 큐레이션.",
    image: "/images/feature-models.png",
    href: "#catalog",
    cta: "카탈로그 보기",
  },
  {
    title: "특허·법률 AI",
    description:
      "특허 협상, 문서 분석, NER/PII, 리랭킹까지 end-to-end AI 스택을 실무에 적용합니다.",
    image: "/images/feature-legal.png",
    href: "/services",
    cta: "사업 영역",
  },
];

export function FeatureShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          Platform
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-main sm:text-4xl">
          데이터에서 인사이트까지,
          <br className="hidden sm:block" />
          하나의 플랫폼
        </h2>
        <p className="mt-4 text-lg text-sub">
          Lonex AI는 모델 큐레이션, 라이브 운영, 보안 관제까지 통합된
          엔터프라이즈 AI 경험을 제공합니다.
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
              <h3 className="text-xl font-bold text-main">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-sub">
                {feature.description}
              </p>
              <Link
                href={feature.href}
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent transition group-hover:gap-2"
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
