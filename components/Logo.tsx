export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden="true">
        <path d="M4 4h32v18c0 9-7 14-16 16C11 36 4 31 4 22z" fill={light ? "#fff" : "#1740c9"} />
        <path d="M13 11v10a7 7 0 0 0 14 0V11h-4.2v10a2.8 2.8 0 0 1-5.6 0V11z" fill={light ? "#1740c9" : "#fff"} />
        <circle cx="31" cy="9" r="4" fill="#d4252e" />
      </svg>
      <span className="leading-tight">
        <span className={`block font-display text-[17px] font-bold ${light ? "text-white" : "text-ink"}`}>
          Unitech University
        </span>
        <span className={`block text-[13px] ${light ? "text-white/75" : "text-muted"}`}>Port Harcourt</span>
      </span>
    </span>
  );
}
