import { SEASON } from "@/lib/data";

const CRESCENT = "M15.15 2.51A10 10 0 1 0 21.04 16.27A8 8 0 1 1 15.15 2.51z";
const STAR = "m12 2 2.6 6.3 6.8.5-5.2 4.4 1.6 6.6L12 16.2 6.2 19.8l1.6-6.6L2.6 8.8l6.8-.5z";
const BULB_COLOURS = ["bg-accent", "bg-gold", "bg-pine", "bg-brand"];

/** Decoration across the top of a page: Christmas lights, or hanging moons and stars for Eid. */
export function Garland({ className = "" }: { className?: string }) {
  if (SEASON === "none") return null;

  if (SEASON === "eid") {
    return (
      <div aria-hidden="true" className={`no-print pointer-events-none flex h-9 justify-between overflow-hidden px-4 ${className}`}>
        {Array.from({ length: 16 }, (_, i) => (
          <span key={i} className={`flex flex-col items-center ${i >= 8 ? "hidden sm:flex" : ""}`}>
            <span className="w-px bg-gold/60" style={{ height: 6 + ((i * 7) % 4) * 5 }} />
            <svg viewBox="0 0 24 24" className="bulb h-3.5 w-3.5" style={{ animationDelay: `${(i % 5) * 0.5}s` }}>
              <path d={i % 2 ? STAR : CRESCENT} fill={i % 3 === 0 ? "#1740c9" : "#eaa91f"} />
            </svg>
          </span>
        ))}
      </div>
    );
  }

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

/** Soft decoration inside one coloured panel: falling snow, or a night sky of stars for Eid. The parent needs `relative overflow-hidden`. */
export function Sky({ count = 22 }: { count?: number }) {
  if (SEASON === "none") return null;
  return (
    <div aria-hidden="true" className="no-print pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }, (_, i) => {
        // Fixed numbers, so the server and the browser draw the same picture.
        const left = (i * 37 + 11) % 100;
        if (SEASON === "eid") {
          const size = 7 + (i % 3) * 4;
          return (
            <svg
              key={i}
              viewBox="0 0 24 24"
              className="sparkle"
              style={{ left: `${left}%`, top: `${(i * 53 + 7) % 92}%`, width: size, height: size, animationDelay: `${(i % 7) * 0.5}s` }}
            >
              <path d="M12 1c.9 6.2 4.8 10.1 11 11-6.2.9-10.1 4.8-11 11-.9-6.2-4.8-10.1-11-11 6.2-.9 10.1-4.8 11-11z" fill={i % 3 ? "#fff" : "#eaa91f"} opacity={0.35 + (i % 3) * 0.2} />
            </svg>
          );
        }
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

/** The season's emblem: a Christmas tree, or a crescent moon and star for Eid. */
export function Emblem({ className = "" }: { className?: string }) {
  if (SEASON === "eid") {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
        <g transform="translate(2 4) scale(1.7)">
          <path d={CRESCENT} fill="#eaa91f" />
        </g>
        <g transform="translate(24 10) scale(0.8)">
          <path d={STAR} fill="#eaa91f" />
        </g>
      </svg>
    );
  }
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

export const CRESCENT_PATH = CRESCENT;
