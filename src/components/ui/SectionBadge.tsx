type SectionBadgeProps = {
  children: React.ReactNode;
};

export function SectionBadge({ children }: SectionBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/60 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-slate-700">
      <span className="size-1.5 rounded-full bg-emerald-400" />
      {children}
    </div>
  );
}
