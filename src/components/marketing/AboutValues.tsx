import Image from "next/image";

const values = [
  {
    title: "연결 (Nexus)",
    description:
      "분산된 데이터·모델·서비스를 하나의 논리적 흐름으로 연결합니다.",
    icon: "🔗",
    image: "/images/feature-models.png",
  },
  {
    title: "논리 (Logical)",
    description:
      "특허·법률·협상 도메인에 맞는 구조화된 AI 추론과 워크플로를 설계합니다.",
    icon: "⚖️",
    image: "/images/feature-legal.png",
  },
  {
    title: "확장 (Infinite)",
    description:
      "오픈소스 생태계와 클라우드 인프라로 끊임없이 확장 가능한 플랫폼을 만듭니다.",
    icon: "∞",
    image: "/images/feature-office.png",
  },
];

const techStack = [
  { name: "Next.js", desc: "App Router · React 19" },
  { name: "Neon PostgreSQL", desc: "Serverless Postgres" },
  { name: "Vercel", desc: "Edge · CI/CD" },
  { name: "Hugging Face", desc: "Model Hub · 184+ items" },
];

export function AboutValues() {
  return (
    <>
      <section className="border-t border-theme bg-elevated/20 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Core Values
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-main sm:text-4xl">
              핵심 가치
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sub">
              Lonex AI는 연결, 논리, 확장이라는 세 가지 원칙 위에
              엔터프라이즈 AI 플랫폼을 구축합니다.
            </p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.title}
                className="value-card group overflow-hidden rounded-2xl bg-card ring-1 ring-theme"
              >
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={value.image}
                    alt=""
                    fill
                    className="object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="value-card-overlay absolute inset-0" aria-hidden />
                  <span className="absolute bottom-4 left-4 flex size-12 items-center justify-center rounded-xl bg-card/90 text-2xl backdrop-blur ring-1 ring-theme">
                    {value.icon}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-main">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-sub">
                    {value.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Infrastructure
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-main sm:text-4xl">
              기술 스택
            </h2>
            <p className="mt-4 text-sub">
              lonex-ai.vercel.app 대시보드와 동일한 프로덕션 인프라.
            </p>
          </div>

          <dl className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {techStack.map((tech, i) => (
              <div
                key={tech.name}
                className="tech-card rounded-2xl bg-card p-6 ring-1 ring-theme"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Platform
                </dt>
                <dd className="mt-2 text-xl font-bold text-main">{tech.name}</dd>
                <dd className="mt-1 text-sm text-sub">{tech.desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
