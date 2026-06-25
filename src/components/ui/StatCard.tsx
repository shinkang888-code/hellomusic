type StatCardProps = {
  label: string;
  value: string;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-xl bg-card p-4 ring-1 ring-theme">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 text-2xl font-bold">{value}</dd>
    </div>
  );
}
