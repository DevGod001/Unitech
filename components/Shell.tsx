"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ArrowLeftRight, BedDouble, BookOpen, CalendarDays, CircleHelp, GraduationCap, House, LogOut, UserRound, Wallet } from "lucide-react";
import { STUDENT } from "@/lib/data";
import { portal, usePortal } from "@/lib/store";
import { Lights } from "./Festive";
import { Logo } from "./Logo";

const NAV = [
  { href: "/dashboard", label: "Home", icon: House },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/timetable", label: "Timetable", icon: CalendarDays },
  { href: "/results", label: "Results", icon: GraduationCap },
  { href: "/fees", label: "Fees", icon: Wallet },
];

const REQUESTS = [
  { href: "/accommodation", label: "Accommodation", icon: BedDouble },
  { href: "/change-of-course", label: "Change of course", icon: ArrowLeftRight },
];

const MORE = [
  { href: "/profile", label: "My profile", icon: UserRound },
  { href: "/help", label: "Help", icon: CircleHelp },
];

const IDLE_LIMIT = 15 * 60 * 1000; // sign out after 15 minutes without activity

export function Shell({ children }: { children: ReactNode }) {
  const { ready, signedIn } = usePortal();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (ready && !signedIn) router.replace("/login");
  }, [ready, signedIn, router]);

  useEffect(() => {
    if (!signedIn) return;
    let timer = window.setTimeout(portal.signOut, IDLE_LIMIT);
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(portal.signOut, IDLE_LIMIT);
    };
    const events = ["pointerdown", "keydown", "scroll"] as const;
    events.forEach((name) => window.addEventListener(name, reset, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((name) => window.removeEventListener(name, reset));
    };
  }, [signedIn]);

  if (!ready || !signedIn) {
    return (
      <div className="grid min-h-dvh place-items-center" role="status">
        <p className="text-muted">Opening your portal…</p>
      </div>
    );
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const initials = STUDENT.firstName[0] + STUDENT.lastName[0];

  return (
    <div className="min-h-dvh lg:pl-[264px]">
      <a href="#content" className="no-print sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="no-print fixed inset-y-0 left-0 hidden w-[264px] flex-col overflow-y-auto border-r border-line bg-white px-5 py-7 lg:flex">
        <Link href="/dashboard" className="mb-8 px-2">
          <Logo />
        </Link>
        <nav aria-label="Main" className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <SideLink key={item.href} {...item} active={isActive(item.href)} />
          ))}
          <div className="my-3 border-t border-line" />
          {REQUESTS.map((item) => (
            <SideLink key={item.href} {...item} active={isActive(item.href)} />
          ))}
          <div className="my-3 border-t border-line" />
          {MORE.map((item) => (
            <SideLink key={item.href} {...item} active={isActive(item.href)} />
          ))}
        </nav>
        <button
          onClick={portal.signOut}
          className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-[16px] font-medium text-muted transition-colors hover:bg-accent-soft hover:text-accent"
        >
          <LogOut size={20} /> Sign out
        </button>
      </aside>

      {/* Mobile top bar */}
      <header className="no-print sticky top-0 z-20 flex items-center justify-between border-b border-line bg-white/95 px-5 py-3 backdrop-blur lg:hidden">
        <Link href="/dashboard">
          <Logo />
        </Link>
        <Link
          href="/profile"
          aria-label="My profile"
          className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft font-display text-[15px] font-bold text-brand"
        >
          {initials}
        </Link>
      </header>

      <Lights />

      <main id="content" className="mx-auto max-w-[920px] px-5 pb-32 pt-8 sm:px-8 lg:px-12 lg:pb-16 lg:pt-12">
        {children}
      </main>

      {/* Mobile bottom tabs */}
      <nav
        aria-label="Main"
        className="no-print fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[12px] font-semibold ${
                active ? "text-brand" : "text-muted"
              }`}
            >
              <span className={`grid h-8 w-14 place-items-center rounded-full ${active ? "bg-brand-soft" : ""}`}>
                <Icon size={21} strokeWidth={active ? 2.4 : 2} />
              </span>
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function SideLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof House;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-12 items-center gap-3 rounded-xl px-4 text-[16px] transition-colors ${
        active ? "bg-brand font-semibold text-white" : "font-medium text-ink hover:bg-brand-soft"
      }`}
    >
      <Icon size={20} /> {label}
    </Link>
  );
}
