import { WaitlistForm } from "@/app/waitlist-form";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="cta-panel relative overflow-hidden rounded-3xl p-10 sm:p-14 lg:p-16">
        <div className="cta-panel-glow absolute -right-20 -top-20 size-80 rounded-full blur-3xl" aria-hidden />
        <div className="relative max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Early Access
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-main sm:text-4xl">
            대기자 명단 등록
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-sub">
            Lonex AI 정식 출시 소식과 lawygoai 플랫폼 업데이트를
            가장 먼저 받아보세요.
          </p>
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}
