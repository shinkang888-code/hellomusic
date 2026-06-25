type Stat = { label: string; value: string };

export function StatsStrip({ stats }: { stats: Stat[] }) {
  return (
    <section className="border-y border-theme bg-card/60 backdrop-blur-sm">
      <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-px sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="px-6 py-8 text-center sm:py-10">
            <dt className="text-xs font-medium uppercase tracking-wider text-muted">
              {stat.label}
            </dt>
            <dd className="mt-2 text-3xl font-bold tabular-nums text-main sm:text-4xl">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
