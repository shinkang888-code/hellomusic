import type { Model } from "@/lib/db";

const CATEGORY_STYLE: Record<string, string> = {
  "Korean LLM": "bg-blue-500/10 text-blue-700 ring-blue-500/25 theme-dark:text-blue-300",
  Patent: "bg-amber-500/10 text-amber-800 ring-amber-500/25 theme-dark:text-amber-300",
  Legal: "bg-emerald-500/10 text-emerald-800 ring-emerald-500/25 theme-dark:text-emerald-300",
  Embedding: "bg-violet-500/10 text-violet-800 ring-violet-500/25 theme-dark:text-violet-300",
  "NER/PII": "bg-rose-500/10 text-rose-800 ring-rose-500/25 theme-dark:text-rose-300",
  Coding: "bg-cyan-500/10 text-cyan-800 ring-cyan-500/25 theme-dark:text-cyan-300",
  Reasoning: "bg-fuchsia-500/10 text-fuchsia-800 ring-fuchsia-500/25 theme-dark:text-fuchsia-300",
  "Office/Doc": "bg-orange-500/10 text-orange-800 ring-orange-500/25 theme-dark:text-orange-300",
  Vision: "bg-teal-500/10 text-teal-800 ring-teal-500/25 theme-dark:text-teal-300",
  Translation: "bg-lime-500/10 text-lime-800 ring-lime-500/25 theme-dark:text-lime-300",
};

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

const COLLECTION_URL =
  "https://huggingface.co/collections/shinkang/lonex-6a3c2d46b16593fecb629a4b";

export function ModelCatalogSection({ models }: { models: Model[] }) {
  return (
    <section id="catalog" className="border-t border-theme bg-elevated/30 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Catalog
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-main sm:text-4xl">
              모델 카탈로그
            </h2>
            <p className="mt-3 max-w-xl text-sub">
              Neon PostgreSQL에서 실시간으로 불러온 큐레이션 목록.
              다운로드 순으로 정렬됩니다.
            </p>
          </div>
          <a
            href={COLLECTION_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary shrink-0 px-5 py-2.5 text-sm font-semibold"
          >
            Hugging Face 컬렉션 ↗
          </a>
        </div>

        {models.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-theme bg-card p-16 text-center text-muted">
            데이터베이스 연결을 확인해 주세요. (DATABASE_URL 환경변수)
          </div>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((m) => (
              <a
                key={m.id}
                href={`https://huggingface.co/${m.repo_id}`}
                target="_blank"
                rel="noreferrer"
                className="catalog-card group rounded-2xl bg-card p-6 ring-1 ring-theme transition hover:ring-blue-500/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
                      CATEGORY_STYLE[m.category] ??
                      "bg-elevated text-sub ring-theme"
                    }`}
                  >
                    {m.category}
                  </span>
                  <span className="text-xs tabular-nums text-muted">
                    ↓ {formatCount(m.downloads)} · ♥ {formatCount(m.likes)}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-main transition group-hover:text-accent">
                  {m.name}
                </h3>
                <p className="mt-1 truncate font-mono text-xs text-muted">
                  {m.repo_id}
                </p>
                {m.note && (
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-sub">
                    {m.note}
                  </p>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
