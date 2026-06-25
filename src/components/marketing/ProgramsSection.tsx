import Link from "next/link";
import { PROGRAMS } from "@/data/academy-content";

export function ProgramsSection() {
  return (
    <section id="programs" className="border-t border-theme bg-card/50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Programs
          </p>
          <h2 className="mt-3 text-3xl font-bold text-main">수강 과정</h2>
          <p className="mt-4 text-sub">
            초급·중급·고급·전공·성인·이론 — 학생 수준과 목표에 맞는
            1:1 피아노 레슨
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl border border-theme bg-card p-5 transition hover:border-accent/40"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                {p.category}
              </span>
              <h3 className="mt-2 text-lg font-bold text-main">{p.title}</h3>
              <p className="mt-2 text-sm text-sub">{p.description}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {p.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full bg-elevated px-2.5 py-0.5 text-[11px] text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-semibold text-accent">{p.fee}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/contact" className="btn-primary">
            체험 레슨 상담 신청
          </Link>
        </div>
      </div>
    </section>
  );
}
