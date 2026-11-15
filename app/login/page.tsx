"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Lights, Snow, Tree } from "@/components/Festive";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui";
import { CHRISTMAS, DEMO_LOGIN, UNIVERSITY } from "@/lib/data";
import { portal, usePortal } from "@/lib/store";

const MAX_TRIES = 5;
const LOCK_SECONDS = 30;

export default function LoginPage() {
  const { ready, signedIn } = usePortal();
  const router = useRouter();
  const [matric, setMatric] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [tries, setTries] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (ready && signedIn) router.replace("/dashboard");
  }, [ready, signedIn, router]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (locked) return;
    if (!matric.trim() || !password) {
      setError("Enter your matric number and your password.");
      return;
    }
    if (portal.signIn(matric, password)) return;

    const next = tries + 1;
    if (next >= MAX_TRIES) {
      setLocked(true);
      setTries(0);
      setError(`Too many wrong tries. Wait ${LOCK_SECONDS} seconds, then try again.`);
      window.setTimeout(() => {
        setLocked(false);
        setError("");
      }, LOCK_SECONDS * 1000);
    } else {
      setTries(next);
      setError("That matric number or password is not correct. Check both and try again.");
    }
  }

  function useDemo() {
    setMatric(DEMO_LOGIN.matric);
    setPassword(DEMO_LOGIN.password);
    setError("");
  }

  const field =
    "mt-2 block h-14 w-full rounded-xl border border-line bg-white px-4 text-[17px] text-ink placeholder:text-muted/60 focus:border-brand";

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-brand p-14 text-white lg:flex lg:flex-col lg:justify-between">
        <Snow count={34} />
        <span className="relative z-10">
          <Logo light />
        </span>
        <div className="relative z-10">
          <h1 className="max-w-[12ch] text-[64px] font-bold leading-[1.02]">
            {CHRISTMAS.active ? "Merry Christmas from Unitech." : "Everything for your semester, in one place."}
          </h1>
          <p className="mt-6 max-w-[38ch] text-[19px] text-white/80">
            {CHRISTMAS.active
              ? "Compliments of the season. Finish your registration and fees before you travel home for the break."
              : "Register courses, check results, see your fees and find your next class."}
          </p>
        </div>
        <p className="relative z-10 text-[15px] text-white/70">
          {UNIVERSITY.semester}, {UNIVERSITY.session} session
        </p>
        {/* The Bonny River bend, drawn as one line */}
        <svg viewBox="0 0 600 600" className="pointer-events-none absolute -right-24 -top-10 h-[120%] opacity-[0.14]" aria-hidden="true">
          <path d="M520 -20C380 80 560 190 420 290S300 440 380 620" fill="none" stroke="#fff" strokeWidth="56" strokeLinecap="round" />
          
        </svg>
      </div>

      {/* Sign-in form */}
      <div className="relative flex flex-col justify-center px-6 py-10 sm:px-12">
        <Lights className="absolute inset-x-0 top-0" />
        <div className="mx-auto w-full max-w-[420px]">
          <div className="mb-10 lg:hidden">
            <Logo />
          </div>
          {CHRISTMAS.active && (
            <p className="mb-6 flex items-center gap-3 rounded-2xl bg-accent-soft p-4 font-semibold text-accent lg:hidden">
              <Tree className="h-10 w-9 shrink-0" /> Merry Christmas from all of us at Unitech
            </p>
          )}
          <h2 className="text-[32px] font-bold">Sign in</h2>
          <p className="mt-2 text-[17px] text-muted">Use your matric number and portal password.</p>

          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
            <label className="block text-[15px] font-semibold">
              Matric number
              <input
                className={field}
                value={matric}
                onChange={(e) => setMatric(e.target.value)}
                placeholder="UTP/23/CSC/0142"
                autoComplete="username"
                autoCapitalize="characters"
                spellCheck={false}
                maxLength={24}
              />
            </label>

            <label className="block text-[15px] font-semibold">
              Password
              <span className="relative block">
                <input
                  className={`${field} pr-14`}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  maxLength={72}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-paper"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </span>
            </label>

            <p role="alert" className={error ? "rounded-xl bg-accent-soft px-4 py-3 text-[15px] font-medium text-accent" : "sr-only"}>
              {error}
            </p>

            <Button type="submit" disabled={locked} className="w-full">
              <LockKeyhole size={18} /> Sign in
            </Button>
          </form>

          <div className="mt-8 rounded-xl border border-dashed border-brand/40 bg-brand-soft p-4">
            <p className="text-[15px] text-ink">
              This is a demo with sample data. No real student records are stored.
            </p>
            <button onClick={useDemo} className="mt-2 min-h-11 text-[16px] font-semibold text-brand underline underline-offset-4">
              Fill in the demo account
            </button>
          </div>

          <p className="mt-8 text-[15px] text-muted">
            Forgot your password? Visit the ICT help desk with your student ID card.
          </p>
        </div>
      </div>
    </div>
  );
}
