"use client";

import Link from "next/link";
import { Check, ChevronRight, MapPin } from "lucide-react";
import { Badge, ButtonLink, Card } from "@/components/ui";
import { STUDENT, UNIVERSITY } from "@/lib/data";
import { cgpa, classesOn, courseByCode, feeSummary, naira, nextClassDay, unitsFor } from "@/lib/format";
import { usePortal } from "@/lib/store";

export default function DashboardPage() {
  const { registration } = usePortal();
  const fees = feeSummary();
  const codes = registration?.codes ?? [];
  const registered = codes.length > 0;
  const feesPaid = fees.balance === 0;

  const nextStep = !registered
    ? {
        title: "Register your courses",
        text: `Choose your courses for this semester. Registration closes on ${UNIVERSITY.registrationCloses}.`,
        href: "/courses",
        action: "Register courses",
      }
    : !feesPaid
      ? {
          title: `Pay the remaining ${naira(fees.balance)}`,
          text: `Your courses are registered. Complete your school fees by ${UNIVERSITY.feesDue}.`,
          href: "/fees",
          action: "See fee details",
        }
      : {
          title: "You are all set",
          text: "Your courses are registered and your fees are paid. Check your timetable for your next class.",
          href: "/timetable",
          action: "Open timetable",
        };

  const steps = [
    {
      label: "Pay school fees",
      detail: `${naira(fees.paid)} of ${naira(fees.total)} paid`,
      done: feesPaid,
      status: feesPaid ? "Paid" : "Part paid",
      href: "/fees",
    },
    {
      label: "Register courses",
      detail: registered ? `${codes.length} courses, ${unitsFor(codes)} units` : `Closes ${UNIVERSITY.registrationCloses}`,
      done: registered,
      status: registered ? "Done" : "Not done",
      href: "/courses",
    },
    {
      label: "Print course form",
      detail: registered ? "Ready to print and sign" : "Opens after you register",
      done: false,
      status: registered ? "Ready" : "Waiting",
      href: "/courses",
    },
  ];

  const upcoming = registered ? nextClassDay(codes, new Date()) : null;

  return (
    <div className="rise">
      <header className="mb-8">
        <h1 className="text-[30px] font-bold sm:text-[38px]">Welcome, {STUDENT.firstName}</h1>
        <p className="mt-2 text-[17px] text-muted">
          {STUDENT.level} {STUDENT.department}. {UNIVERSITY.semester}, {UNIVERSITY.session}.
        </p>
      </header>

      {/* The one thing to do now */}
      <section aria-labelledby="next-step" className="relative overflow-hidden rounded-3xl bg-brand p-7 text-white sm:p-10">
        <p className="text-[15px] font-semibold text-white/75">Your next step</p>
        <h2 id="next-step" className="mt-2 max-w-[18ch] text-[30px] font-bold sm:text-[40px]">
          {nextStep.title}
        </h2>
        <p className="mt-3 max-w-[44ch] text-[17px] text-white/85">{nextStep.text}</p>
        <ButtonLink href={nextStep.href} tone="onBlue" className="mt-7">
          {nextStep.action}
        </ButtonLink>
        <span aria-hidden="true" className="absolute right-7 top-7 h-3.5 w-3.5 rounded-full bg-accent ring-4 ring-white/20" />
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <Card aria-labelledby="steps-title" className="p-6 sm:p-7">
          <h2 id="steps-title" className="text-[20px] font-bold">
            This semester, step by step
          </h2>
          <ol className="mt-4 divide-y divide-line">
            {steps.map((step, index) => (
              <li key={step.label}>
                <Link href={step.href} className="group -mx-2 flex items-center gap-4 rounded-xl px-2 py-4 hover:bg-paper">
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-[16px] font-bold ${
                      step.done ? "bg-ok text-white" : "bg-brand-soft text-brand"
                    }`}
                  >
                    {step.done ? <Check size={20} strokeWidth={3} /> : index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{step.label}</span>
                    <span className="block text-[15px] text-muted">{step.detail}</span>
                  </span>
                  <Badge tone={step.done ? "ok" : step.status === "Part paid" || step.status === "Not done" ? "alert" : "plain"}>
                    {step.status}
                  </Badge>
                  <ChevronRight size={18} className="hidden text-muted sm:block" />
                </Link>
              </li>
            ))}
          </ol>
        </Card>

        <Card aria-labelledby="classes-title" className="p-6 sm:p-7">
          <h2 id="classes-title" className="text-[20px] font-bold">
            {upcoming ? (upcoming.isToday ? "Today's classes" : `Classes on ${upcoming.day}`) : "Your classes"}
          </h2>
          {upcoming ? (
            <ul className="mt-4 space-y-4">
              {classesOn(upcoming.day, codes).map((slot) => (
                <li key={slot.code + slot.start} className="border-l-4 border-brand pl-4">
                  <p className="tabular text-[14px] font-semibold text-brand">
                    {slot.start} to {slot.end}
                  </p>
                  <p className="font-semibold">{courseByCode(slot.code)?.title}</p>
                  <p className="flex items-center gap-1.5 text-[15px] text-muted">
                    <MapPin size={15} /> {slot.venue}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-muted">Your classes show here once you register your courses.</p>
          )}
          <Link href="/timetable" className="mt-5 inline-flex min-h-11 items-center font-semibold text-brand underline underline-offset-4">
            See full timetable
          </Link>
        </Card>
      </div>

      <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
        <Fact label="Overall grade (CGPA)" value={cgpa().toFixed(2)} note="out of 5.00" />
        <Fact label="Units this semester" value={registered ? String(unitsFor(codes)) : "0"} note={`maximum ${UNIVERSITY.maxUnits}`} />
        <Fact label="Fees left to pay" value={naira(fees.balance)} note={`due ${UNIVERSITY.feesDue}`} alert={!feesPaid} />
      </dl>
    </div>
  );
}

function Fact({ label, value, note, alert }: { label: string; value: string; note: string; alert?: boolean }) {
  return (
    <div className="bg-white p-6">
      <dt className="text-[15px] text-muted">{label}</dt>
      <dd className={`tabular mt-1 font-display text-[28px] font-bold ${alert ? "text-accent" : "text-ink"}`}>{value}</dd>
      <dd className="text-[14px] text-muted">{note}</dd>
    </div>
  );
}
