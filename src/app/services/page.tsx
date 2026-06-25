import Link from "next/link";
import { Nav } from "@/app/components/nav";
import { PROGRAMS } from "@/data/academy-content";

export default function ServicesPage() {
  return (
    <main className="flex-1 bg-page text-main">
      <Nav active="services" />
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          Programs
        </p>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          수업 <span className="text-accent">안내</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-sub">
          Hello Music Academy는 초급부터 전공·입시까지 1:1 피아노 레슨과
          Theory Room 그룹 이론 수업을 제공합니다.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((p) => (
            <div
              key={p.id}
              className="group rounded-xl bg-card p-5 ring-1 ring-theme transition hover:ring-accent/40"
            >
              <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent ring-1 ring-accent/20">
                {p.category}
              </span>
              <h3 className="mt-3 font-semibold text-main group-hover:text-accent">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-sub">{p.description}</p>
              <ul className="mt-3 space-y-1.5 text-sm text-sub">
                {p.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-accent">♪</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-semibold text-accent">{p.fee}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-card p-6 ring-1 ring-theme">
          <h3 className="text-lg font-semibold">학원 둘러보기</h3>
          <p className="mt-2 text-sm text-sub">
            AI 학원 평면도에서 원장·강사·원생 캐릭터가 실시간으로 활동하는
            Hello Music Academy를 확인하세요.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/office" className="btn-primary">
              AI 학원 입장
            </Link>
            <Link href="/contact" className="btn-secondary px-5 py-2.5 text-sm font-semibold">
              체험 레슨 상담
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
