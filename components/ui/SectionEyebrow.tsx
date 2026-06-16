/**
 * Consistent, clearly-visible numbered section marker, e.g.  03 — EXPERIENCE
 */
export default function SectionEyebrow({
  index,
  label,
  color = "#0ea5e9",
  className = "",
}: {
  index: string;
  label: string;
  color?: string;
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <span
        className="font-display font-extrabold text-3xl md:text-4xl leading-none"
        style={{ color, textShadow: `0 0 18px ${color}66` }}
      >
        {index}
      </span>
      <span className="flex flex-col items-start gap-1 leading-none">
        <span className="h-[2px] w-7 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
        <span className="text-xs font-display font-bold tracking-[0.35em] uppercase text-white/70">{label}</span>
      </span>
    </div>
  );
}
