"use client";

import Link from "next/link";
import { useEffect, useRef, type ComponentProps, type ReactNode } from "react";
import { Check, X } from "lucide-react";

export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="mb-8">
      <h1 className="text-[28px] font-bold sm:text-[34px]">{title}</h1>
      {children && <p className="mt-2 max-w-[60ch] text-[17px] text-muted">{children}</p>}
    </header>
  );
}

export function Card({ className = "", ...props }: ComponentProps<"section">) {
  return <section className={`rounded-2xl border border-line bg-white ${className}`} {...props} />;
}

type Tone = "primary" | "quiet" | "onBlue";
const tones: Record<Tone, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  quiet: "border border-line bg-white text-ink hover:border-brand hover:text-brand",
  onBlue: "bg-white text-brand hover:bg-brand-soft",
};
const buttonBase =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-[16px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export function Button({ tone = "primary", className = "", ...props }: ComponentProps<"button"> & { tone?: Tone }) {
  return <button className={`${buttonBase} ${tones[tone]} ${className}`} {...props} />;
}

export function ButtonLink({
  tone = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { tone?: Tone }) {
  return <Link className={`${buttonBase} ${tones[tone]} ${className}`} {...props} />;
}

type BadgeTone = "ok" | "alert" | "info" | "plain";
const badgeTones: Record<BadgeTone, string> = {
  ok: "bg-ok-soft text-ok",
  alert: "bg-accent-soft text-accent",
  info: "bg-brand-soft text-brand",
  plain: "bg-paper text-muted",
};

export function Badge({ tone = "plain", children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-semibold ${badgeTones[tone]}`}>
      {children}
    </span>
  );
}

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) ref.current?.close();
      }}
      aria-labelledby="modal-title"
      className="rise m-auto w-[min(92vw,480px)] rounded-2xl bg-white p-0 text-ink backdrop:bg-ink/50"
    >
      <div className="p-6 sm:p-7">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="text-[22px] font-bold">
            {title}
          </h2>
          <button
            onClick={() => ref.current?.close()}
            aria-label="Close"
            className="no-print -mr-2 -mt-1 grid h-10 w-10 place-items-center rounded-full text-muted hover:bg-paper"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

/** Shows where a request has reached. `current` is the index of the stage it is waiting at. */
export function Progress({ stages, current }: { stages: { label: string; note: string }[]; current: number }) {
  return (
    <ol className="space-y-0">
      {stages.map((stage, index) => {
        const done = index < current;
        const now = index === current;
        const last = index === stages.length - 1;
        return (
          <li key={stage.label} className="relative flex gap-4 pb-6 last:pb-0" aria-current={now ? "step" : undefined}>
            {!last && <span aria-hidden="true" className={`absolute left-[17px] top-9 h-[calc(100%-36px)] w-0.5 ${done ? "bg-ok" : "bg-line"}`} />}
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-[15px] font-bold ${
                done ? "bg-ok text-white" : now ? "bg-brand text-white ring-4 ring-brand-soft" : "bg-paper text-muted"
              }`}
            >
              {done ? <Check size={18} strokeWidth={3} /> : index + 1}
            </span>
            <span className="pt-1">
              <span className={`block font-semibold ${!done && !now ? "text-muted" : ""}`}>
                {stage.label}
                {now && <span className="block text-[14px] font-semibold text-brand sm:ml-2 sm:inline">You are here</span>}
              </span>
              <span className="block text-[15px] text-muted">{stage.note}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
