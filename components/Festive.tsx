import { CHRISTMAS } from "@/lib/data";

const BULB_COLOURS = ["bg-accent", "bg-gold", "bg-pine", "bg-brand"];

/** A string of Christmas lights. Purely decorative. */
export function Lights({ className = "" }: { className?: string }) {
  if (!CHRISTMAS.active) return null;
  return (
    <div aria-hidden="true" className={`no-print pointer-events-none flex h-5 justify-between overflow-hidden border-t-2 border-ink/15 px-3 ${className}`}>
      {Array.from({ length: 28 }, (_, i) => (
        <span
          key={i}
          className={`bulb h-2.5 w-2 shrink-0 rounded-b-full ${BULB_COLOURS[i % 4]} ${i >= 14 ? "hidden sm:block" : ""}`}
          style={{ marginTop: i % 2 ? 5 : 1, animationDelay: `${(i % 5) * 0.45}s` }}
        />
      ))}
    </div>
  );
}

/** Light snowfall for a single coloured panel. The parent needs `relative overflow-hidden`. */
export function Snow({ count = 22 }: { count?: number }) {
  if (!CHRISTMAS.active) return null;
  return (
    <div aria-hidden="true" className="no-print pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }, (_, i) => {
        // Spread the flakes with fixed numbers so the server and browser draw the same picture.
        const left = (i * 37 + 11) % 100;
        const size = 3 + (i % 4) * 1.5;
        const duration = 9 + (i % 6) * 2.5;
        const style = {
          left: `${left}%`,
          width: size,
          height: size,
          opacity: 0.35 + (i % 3) * 0.2,
          animationDuration: `${duration}s`,
          animationDelay: `${-((i * 1.7) % duration)}s`,
          "--drift": `${(i % 2 ? 1 : -1) * (8 + (i % 5) * 6)}px`,
          "--rest": `${(i * 53) % 90}%`,
        } as React.CSSProperties;
        return <span key={i} className="snowflake" style={style} />;
      })}
    </div>
  );
}

/** A small Christmas tree drawn in the brand colours. */
export function Tree({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 56" className={className} aria-hidden="true">
      <rect x="21" y="44" width="6" height="9" rx="1.5" fill="#7a4a21" />
      <path d="M24 6 9 28h7L6 44h36L32 28h7z" fill="#1b7a4e" />
      <path d="m24 1 1.6 3.4 3.7.5-2.7 2.6.7 3.7L24 9.4l-3.3 1.8.7-3.7-2.7-2.6 3.7-.5z" fill="#eaa91f" />
      <circle cx="20" cy="24" r="2.2" fill="#d4252e" />
      <circle cx="29" cy="33" r="2.2" fill="#eaa91f" />
      <circle cx="17" cy="38" r="2.2" fill="#fff" />
      <circle cx="31" cy="40" r="2.2" fill="#d4252e" />
      <circle cx="25" cy="17" r="1.8" fill="#fff" />
    </svg>
  );
}
