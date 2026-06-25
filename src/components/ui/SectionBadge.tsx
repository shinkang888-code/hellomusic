type SectionBadgeProps = {
  children: React.ReactNode;
};

export function SectionBadge({ children }: SectionBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-elevated px-3 py-1 text-xs font-medium text-sub ring-1 ring-theme">
      <span className="size-1.5 rounded-full bg-emerald-400" />
      {children}
    </div>
  );
}
