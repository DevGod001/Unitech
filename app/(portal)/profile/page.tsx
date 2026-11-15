"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { CircleCheck, CircleHelp, LogOut } from "lucide-react";
import { Button, Card, PageHeader } from "@/components/ui";
import { STUDENT } from "@/lib/data";
import { portal, usePortal, type Contact } from "@/lib/store";

export default function ProfilePage() {
  const { contact } = usePortal();
  const [form, setForm] = useState<Contact>(contact);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const changed = JSON.stringify(form) !== JSON.stringify(contact);

  function set(key: keyof Contact, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
    setError("");
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const phone = form.phone.replace(/[\s-]/g, "");
    if (!/^(\+234|0)[789]\d{9}$/.test(phone)) {
      setError("Enter a Nigerian phone number, for example 0803 555 0142.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Enter a full email address, for example name@example.com.");
      return;
    }
    if (form.address.trim().length < 5) {
      setError("Enter the address where you live during the semester.");
      return;
    }
    portal.saveContact({ phone: form.phone.trim(), email: form.email.trim(), address: form.address.trim() });
    setSaved(true);
  }

  const details = [
    ["Matric number", STUDENT.matric],
    ["Programme", STUDENT.programme],
    ["Faculty", STUDENT.faculty],
    ["Level", STUDENT.level],
    ["State of origin", STUDENT.stateOfOrigin],
    ["School email", STUDENT.schoolEmail],
    ["Course adviser", STUDENT.adviser],
  ];

  const field = "mt-2 block h-13 w-full rounded-xl border border-line bg-white px-4 text-[16px] focus:border-brand";

  return (
    <div className="rise">
      <PageHeader title="My profile" />

      <div className="mb-8 flex items-center gap-5">
        <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-brand font-display text-[28px] font-bold text-white">
          {STUDENT.firstName[0]}
          {STUDENT.lastName[0]}
        </span>
        <div>
          <p className="font-display text-[24px] font-bold">
            {STUDENT.firstName} {STUDENT.lastName}
          </p>
          <p className="text-muted">
            {STUDENT.level} {STUDENT.department}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card aria-labelledby="school-record" className="p-6 sm:p-7">
          <h2 id="school-record" className="text-[20px] font-bold">
            School record
          </h2>
          <p className="mt-1 text-[15px] text-muted">Only the Registry can change these. Visit them if something is wrong.</p>
          <dl className="mt-4 divide-y divide-line">
            {details.map(([label, value]) => (
              <div key={label} className="py-3">
                <dt className="text-[14px] text-muted">{label}</dt>
                <dd className="break-words font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card aria-labelledby="contact" className="self-start p-6 sm:p-7">
          <h2 id="contact" className="text-[20px] font-bold">
            Contact details
          </h2>
          <p className="mt-1 text-[15px] text-muted">Keep these up to date so the school can reach you.</p>
          <form onSubmit={onSubmit} noValidate className="mt-5 space-y-5">
            <label className="block text-[15px] font-semibold">
              Phone number
              <input className={field} type="tel" autoComplete="tel" maxLength={20} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </label>
            <label className="block text-[15px] font-semibold">
              Personal email
              <input className={field} type="email" autoComplete="email" maxLength={120} value={form.email} onChange={(e) => set("email", e.target.value)} />
            </label>
            <label className="block text-[15px] font-semibold">
              Address during the semester
              <input className={field} autoComplete="street-address" maxLength={160} value={form.address} onChange={(e) => set("address", e.target.value)} />
            </label>

            <p role="alert" className={error ? "rounded-xl bg-accent-soft px-4 py-3 text-[15px] font-medium text-accent" : "sr-only"}>
              {error}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit" disabled={!changed}>
                Save changes
              </Button>
              <p role="status" className="flex items-center gap-2 font-medium text-ok">
                {saved && !changed && (
                  <>
                    <CircleCheck size={19} /> Changes saved
                  </>
                )}
              </p>
            </div>
          </form>
        </Card>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/help"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 font-semibold hover:border-brand hover:text-brand"
        >
          <CircleHelp size={18} /> Get help
        </Link>
        <button
          onClick={portal.signOut}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-accent/30 bg-white px-5 font-semibold text-accent hover:bg-accent-soft"
        >
          <LogOut size={18} /> Sign out
        </button>
      </div>
    </div>
  );
}
