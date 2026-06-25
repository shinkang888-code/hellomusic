import Image from "next/image";
import Link from "next/link";
import { sql, type Model } from "@/lib/db";
import { WaitlistForm } from "./waitlist-form";
import { Nav } from "./components/nav";

export const dynamic = "force-dynamic";

const COLLECTION_URL =
  "https://huggingface.co/collections/shinkang/lonex-6a3c2d46b16593fecb629a4b";

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

const CATEGORY_STYLE: Record<string, string> = {
  "Korean LLM": "bg-blue-500/10 text-blue-300 ring-blue-500/20",
  Patent: "bg-amber-500/10 text-amber-300 ring-amber-500/20",
  Legal: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
  Embedding: "bg-violet-500/10 text-violet-300 ring-violet-500/20",
  "NER/PII": "bg-rose-500/10 text-rose-300 ring-rose-500/20",
  Coding: "bg-cyan-500/10 text-cyan-300 ring-cyan-500/20",
  Reasoning: "bg-fuchsia-500/10 text-fuchsia-300 ring-fuchsia-500/20",
  "Office/Doc": "bg-orange-500/10 text-orange-300 ring-orange-500/20",
  Vision: "bg-teal-500/10 text-teal-300 ring-teal-500/20",
  Translation: "bg-lime-500/10 text-lime-300 ring-lime-500/20",
};

async function getModels(): Promise<Model[]> {
  try {
    return (await sql`
      SELECT id, repo_id, category, name, downloads, likes, note
      FROM models
      ORDER BY downloads DESC
    `) as Model[];
  } catch {
    return [];
  }
}

export default async function Home() {
  const models = await getModels();
  const categories = Array.from(new Set(models.map((m) => m.category)));

  return (
    <main className="flex-1 bg-slate-950 text-slate-100">
      <Nav active="home" />
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/60 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-slate-700">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Neon · Vercel · Next.js 로 구동
        </div>
        <div className="mt-6 flex items-center gap-4">
          <Image
            src="/brand/lonex-logo.png"
            alt="Lonex"
            width={72}
            height={72}
            priority
            className="size-16 rounded-2xl ring-1 ring-slate-800 sm:size-20"
          />
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Lonex <span className="text-blue-400">AI</span>
          </h1>
        </div>
        <p className="mt-4 text-lg font-medium text-blue-300">
          The Logical Nexus of Infinite Data.
        </p>
        <p className="text-sm text-slate-500">무한한 데이터를 잇는 논리적 연결점.</p>
        <p className="mt-4 max-w-2xl text-lg text-slate-400">
          lawygoai 특허 협상 플랫폼을 위한 오픈소스 AI 모델 큐레이션과 217명의
          AI 직원이 일하는 라이브 오피스.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/office"
            className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            🏢 AI 오피스 둘러보기
          </Link>
          <Link
            href="/console"
            className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-200 ring-1 ring-slate-700 transition hover:bg-slate-700"
          >
            🎛 관리 콘솔
          </Link>
          <a
            href={COLLECTION_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-200 ring-1 ring-slate-700 transition hover:bg-slate-700"
          >
            HF 컬렉션
          </a>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "큐레이션 모델", value: `${models.length}` },
            { label: "카테고리", value: `${categories.length}` },
            { label: "HF 컬렉션 항목", value: "184" },
            { label: "데이터베이스", value: "Neon" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-slate-900/60 p-4 ring-1 ring-slate-800"
            >
              <dt className="text-xs text-slate-500">{stat.label}</dt>
              <dd className="mt-1 text-2xl font-bold">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="catalog" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-bold">모델 카탈로그</h2>
        <p className="mt-1 text-sm text-slate-400">
          Neon PostgreSQL에서 실시간으로 불러온 큐레이션 목록 (다운로드 순).
        </p>

        {models.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-slate-700 p-10 text-center text-slate-500">
            데이터베이스 연결을 확인해 주세요. (DATABASE_URL 환경변수)
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((m) => (
              <a
                key={m.id}
                href={`https://huggingface.co/${m.repo_id}`}
                target="_blank"
                rel="noreferrer"
                className="group rounded-xl bg-slate-900/60 p-5 ring-1 ring-slate-800 transition hover:ring-blue-500/50"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${
                      CATEGORY_STYLE[m.category] ??
                      "bg-slate-700/30 text-slate-300 ring-slate-600"
                    }`}
                  >
                    {m.category}
                  </span>
                  <span className="text-xs text-slate-500">
                    ↓ {formatCount(m.downloads)} · ♥ {formatCount(m.likes)}
                  </span>
                </div>
                <h3 className="mt-3 font-semibold text-slate-100 group-hover:text-blue-300">
                  {m.name}
                </h3>
                <p className="mt-1 truncate font-mono text-xs text-slate-500">
                  {m.repo_id}
                </p>
                {m.note && (
                  <p className="mt-2 text-sm text-slate-400">{m.note}</p>
                )}
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600/20 to-slate-900 p-8 ring-1 ring-slate-800 sm:p-12">
          <h2 className="text-2xl font-bold">대기자 명단 등록</h2>
          <p className="mt-2 max-w-lg text-slate-400">
            lonex AI 정식 출시 소식을 받아보세요. 이메일은 Neon DB에 안전하게
            저장됩니다.
          </p>
          <WaitlistForm />
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        lonex AI · lawygoai 프로젝트 · Powered by Next.js + Neon + Vercel
      </footer>
    </main>
  );
}
