import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";
import { SectionBadge } from "@/components/ui/SectionBadge";

const services = [
  {
    category: "Patent",
    categoryClass: "bg-amber-500/10 text-amber-300 ring-amber-500/20",
    title: "특허 AI 모델 큐레이션",
    items: [
      "PatentSBERTa 특허 임베딩",
      "문서·표·PDF 파싱 (Docling, Table Transformer)",
      "협상 전략 추론 모델 (DeepSeek R1 Distill)",
    ],
    link: "https://lonex-ai.vercel.app/#catalog",
  },
  {
    category: "Korean LLM",
    categoryClass: "bg-violet-500/10 text-violet-300 ring-violet-500/20",
    title: "한국어·법률 LLM",
    items: [
      "Llama-3 Korean Bllossom 8B / 3B",
      "Qwen3-8B Legal Korean",
      "Korean PII NER v3 (개인정보 마스킹)",
    ],
    link: "https://lonex-ai.vercel.app/#catalog",
  },
  {
    category: "Operations",
    categoryClass: "bg-teal-500/10 text-teal-300 ring-teal-500/20",
    title: "AI 오피스 & 관제",
    items: [
      "217명 AI 직원 라이브 오피스",
      "16개 부서 실시간 상태 모니터링",
      "사이트 헬스체크·이벤트 로그",
    ],
    link: "https://lonex-ai.vercel.app/office",
  },
  {
    category: "Platform",
    categoryClass: "bg-blue-500/10 text-blue-300 ring-blue-500/20",
    title: "SaaS·대시보드 개발",
    items: [
      "Next.js App Router 풀스택",
      "Neon PostgreSQL 데이터 레이어",
      "Vercel CI/CD·프리뷰 배포",
    ],
    link: "https://lonex-ai.vercel.app/console",
  },
  {
    category: "Embedding",
    categoryClass: "bg-indigo-500/10 text-indigo-300 ring-indigo-500/20",
    title: "검색·RAG 인프라",
    items: [
      "BGE-M3 다국어 임베딩",
      "BGE Reranker v2 M3",
      "Qwen2.5-VL 문서·이미지 이해",
    ],
    link: "https://lonex-ai.vercel.app/#catalog",
  },
  {
    category: "Ecosystem",
    categoryClass: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
    title: "lawygoai 생태계",
    items: [
      "특허 협상 플랫폼 연동",
      "HF 컬렉션 184항목",
      "대기자 명단·API 연동",
    ],
    link: "https://huggingface.co/collections/shinkang/lonex-6a3c2d46b16593fecb629a4b",
  },
];

export default function ServicesPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
        <SectionBadge>Services</SectionBadge>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          사업 <span className="text-blue-400">영역</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-400">
          Lonex AI는 특허·법률 AI부터 운영 대시보드까지, 데이터와 모델을
          연결하는 end-to-end 솔루션을 제공합니다.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group rounded-xl bg-slate-900/60 p-5 ring-1 ring-slate-800 transition hover:ring-blue-500/50"
            >
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${service.categoryClass}`}
              >
                {service.category}
              </span>
              <h3 className="mt-3 font-semibold text-slate-100 group-hover:text-blue-300">
                {service.title}
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-400">
                {service.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-blue-500">·</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={service.link}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm text-blue-400 hover:text-blue-300"
              >
                자세히 보기 →
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-slate-900/60 p-6 ring-1 ring-slate-800">
          <h3 className="text-lg font-semibold">라이브 데모</h3>
          <p className="mt-2 text-sm text-slate-400">
            lonex-ai.vercel.app에서 모델 카탈로그, AI 오피스, 관리 콘솔을
            직접 확인할 수 있습니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://lonex-ai.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              AI 대시보드
            </a>
            <Link
              href="/contact"
              className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-200 ring-1 ring-slate-700 transition hover:bg-slate-700"
            >
              문의하기
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
