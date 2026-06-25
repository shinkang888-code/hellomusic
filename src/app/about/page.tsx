import { SiteShell } from "@/components/layout/SiteShell";
import { LonexLogo } from "@/components/brand/LonexLogo";
import { SectionBadge } from "@/components/ui/SectionBadge";

const values = [
  {
    title: "연결 (Nexus)",
    description:
      "분산된 데이터·모델·서비스를 하나의 논리적 흐름으로 연결합니다.",
  },
  {
    title: "논리 (Logical)",
    description:
      "특허·법률·협상 도메인에 맞는 구조화된 AI 추론과 워크플로를 설계합니다.",
  },
  {
    title: "확장 (Infinite)",
    description:
      "오픈소스 생태계와 클라우드 인프라로 끊임없이 확장 가능한 플랫폼을 만듭니다.",
  },
];

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
        <SectionBadge>About Lonex AI</SectionBadge>

        <div className="mt-6">
          <LonexLogo size="md" accent="" />
        </div>

        <p className="mt-4 text-lg font-medium text-blue-300">
          The Logical Nexus of Infinite Data.
        </p>
        <p className="text-sm text-slate-500">
          무한한 데이터를 잇는 논리적 연결점.
        </p>

        <div className="mt-8 max-w-3xl space-y-4 text-slate-400">
          <p>
            Lonex AI는 특허·지식재산·법률 영역에서 AI 기술을 실무에
            적용하는 기술 기업입니다. lawygoai 플랫폼과 연계하여 특허 협상,
            문서 분석, 한국어 LLM, 임베딩·리랭킹 등 end-to-end AI 스택을
            제공합니다.
          </p>
          <p>
            217명의 AI 직원이 운영하는 라이브 오피스, Neon PostgreSQL 기반
            모델 카탈로그, Vercel 위의 Next.js 대시보드는 Lonex AI의 기술력과
            운영 철학을 보여주는 대표 프로덕트입니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-bold">핵심 가치</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-xl bg-slate-900/60 p-5 ring-1 ring-slate-800"
            >
              <h3 className="font-semibold text-blue-300">{value.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 pb-20">
        <h2 className="text-2xl font-bold">기술 스택</h2>
        <p className="mt-1 text-sm text-slate-400">
          lonex-ai.vercel.app 대시보드와 동일한 인프라.
        </p>
        <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {["Next.js", "Neon PostgreSQL", "Vercel", "Hugging Face"].map(
            (tech) => (
              <div
                key={tech}
                className="rounded-xl bg-slate-900/60 p-4 ring-1 ring-slate-800"
              >
                <dt className="text-xs text-slate-500">Platform</dt>
                <dd className="mt-1 text-lg font-bold">{tech}</dd>
              </div>
            ),
          )}
        </dl>
      </section>
    </SiteShell>
  );
}
