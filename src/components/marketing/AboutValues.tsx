import Image from "next/image";
import { VALUES, HELLO_MANAGER } from "@/data/academy-content";

const facilities = [
  { name: "Piano Practice 1–5", desc: "개인 연습실 5실" },
  { name: "Grand Piano Studio", desc: "그랜드 피아노 스튜디오" },
  { name: "Theory · Lecture", desc: "이론·그룹 수업실" },
  { name: "HelloManager AI", desc: "등·하원·수납·알림톡" },
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
              헬로뮤직 교육 철학
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sub">
              1:1 맞춤 레슨, 체계적 커리큘럼, AI 학원관리 — 음악과 운영을
              함께 성장시킵니다.
            </p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {VALUES.map((value, i) => (
              <article
                key={value.title}
                className="value-card rounded-2xl bg-card p-8 ring-1 ring-theme"
              >
                <span className="flex size-14 items-center justify-center rounded-2xl bg-[#1e2a4a]/10 text-3xl">
                  {value.icon}
                </span>
                <h3 className="mt-5 text-lg font-bold text-main">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sub">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-theme py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              HelloManager
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-main sm:text-4xl">
              AI 학원 통합 관리
            </h2>
            <p className="mt-4 text-sub">{HELLO_MANAGER.sub}</p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HELLO_MANAGER.features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl bg-card p-5 ring-1 ring-theme"
              >
                <h3 className="font-bold text-main">{f.title}</h3>
                <p className="mt-2 text-sm text-sub">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Facilities
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-main sm:text-4xl">
              1층 학원 시설
            </h2>
            <p className="mt-4 text-sub">
              Academy Floor Plan 기준 9개 공간 — 연습·이론·그랜드 스튜디오
            </p>
          </div>

          <dl className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {facilities.map((f) => (
              <div
                key={f.name}
                className="tech-card rounded-2xl bg-card p-6 ring-1 ring-theme"
              >
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Room
                </dt>
                <dd className="mt-2 text-lg font-bold text-main">{f.name}</dd>
                <dd className="mt-1 text-sm text-sub">{f.desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
