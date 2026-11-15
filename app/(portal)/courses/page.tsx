"use client";

import { useState } from "react";
import { Check, CircleCheck, Lock, Printer } from "lucide-react";
import { Button, Card, Modal, PageHeader } from "@/components/ui";
import { COURSES, STUDENT, UNIVERSITY } from "@/lib/data";
import { unitsFor } from "@/lib/format";
import { portal, usePortal } from "@/lib/store";

const REQUIRED = COURSES.filter((c) => c.required).map((c) => c.code);

export default function CoursesPage() {
  const { registration } = usePortal();
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<string[]>(registration?.codes ?? REQUIRED);
  const [confirming, setConfirming] = useState(false);

  const units = unitsFor(selected);
  const tooFew = units < UNIVERSITY.minUnits;
  const tooMany = units > UNIVERSITY.maxUnits;

  function toggle(code: string) {
    setSelected((list) => (list.includes(code) ? list.filter((c) => c !== code) : [...list, code]));
  }

  function submit() {
    portal.submitRegistration(selected);
    setConfirming(false);
    setEditing(false);
    window.scrollTo({ top: 0 });
  }

  // Already registered: show the course form.
  if (registration && !editing) {
    const mine = COURSES.filter((c) => registration.codes.includes(c.code));
    return (
      <div className="rise">
        <PageHeader title="My courses">
          {UNIVERSITY.semester}, {UNIVERSITY.session}
        </PageHeader>

        <div className="no-print mb-6 flex items-start gap-3 rounded-2xl bg-ok-soft p-5 text-ok">
          <CircleCheck className="mt-0.5 shrink-0" size={22} />
          <p className="font-medium">
            Your courses are registered. Submitted on {registration.submittedOn}. Print the form and take it to your
            course adviser, {STUDENT.adviser}, to sign.
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="border-b border-line p-6">
            <h2 className="text-[20px] font-bold">Course registration form</h2>
            <p className="mt-1 text-[15px] text-muted">
              {STUDENT.firstName} {STUDENT.lastName}, {STUDENT.matric}, {STUDENT.level} {STUDENT.department}
            </p>
          </div>
          <ul className="divide-y divide-line">
            {mine.map((course) => (
              <li key={course.code} className="flex items-center gap-4 px-6 py-4">
                <span className="tabular w-[76px] shrink-0 text-[15px] font-semibold text-brand">{course.code}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{course.title}</span>
                  <span className="block text-[14px] text-muted">{course.lecturer}</span>
                </span>
                <span className="tabular whitespace-nowrap text-[15px] text-muted">{course.units} units</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-line bg-paper px-6 py-4 font-semibold">
            <span>Total</span>
            <span className="tabular">
              {mine.length} courses, {unitsFor(registration.codes)} units
            </span>
          </div>
        </Card>

        <div className="no-print mt-6 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => window.print()}>
            <Printer size={18} /> Print course form
          </Button>
          <Button
            tone="quiet"
            onClick={() => {
              setSelected(registration.codes);
              setEditing(true);
            }}
          >
            Change my courses
          </Button>
        </div>
        <p className="no-print mt-3 text-[15px] text-muted">You can change your courses until {UNIVERSITY.registrationCloses}.</p>
      </div>
    );
  }

  const groups = [
    { title: "Required courses", note: "Everyone in your level takes these. They are already added.", list: COURSES.filter((c) => c.required) },
    { title: "Optional courses", note: "Tap a course to add it. Tap again to remove it.", list: COURSES.filter((c) => !c.required) },
  ];

  return (
    <div className="rise">
      <PageHeader title="Register courses">
        Pick between {UNIVERSITY.minUnits} and {UNIVERSITY.maxUnits} units for {UNIVERSITY.semester.toLowerCase()}.
        Registration closes on {UNIVERSITY.registrationCloses}.
      </PageHeader>

      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group.title}>
            <h2 className="text-[20px] font-bold">{group.title}</h2>
            <p className="mt-1 text-[15px] text-muted">{group.note}</p>
            <ul className="mt-4 space-y-3">
              {group.list.map((course) => {
                const on = selected.includes(course.code);
                return (
                  <li key={course.code}>
                    <label
                      className={`flex min-h-[76px] items-center gap-4 rounded-2xl border bg-white px-5 py-4 transition-colors ${
                        course.required ? "border-line" : "cursor-pointer hover:border-brand"
                      } ${on && !course.required ? "border-brand ring-1 ring-brand" : "border-line"}`}
                    >
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={on}
                        disabled={course.required}
                        onChange={() => toggle(course.code)}
                      />
                      <span
                        aria-hidden="true"
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border-2 peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand ${
                          on ? "border-brand bg-brand text-white" : "border-line bg-white"
                        } ${course.required ? "opacity-60" : ""}`}
                      >
                        {on && (course.required ? <Lock size={14} strokeWidth={3} /> : <Check size={18} strokeWidth={3} />)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold">{course.title}</span>
                        <span className="tabular block text-[14px] text-muted">
                          {course.code}, {course.lecturer}
                        </span>
                      </span>
                      <span className="tabular whitespace-nowrap text-[15px] font-semibold text-muted">{course.units} units</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {/* Running total stays in view */}
      <div className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-10 mt-8 rounded-2xl border border-line bg-white p-4 shadow-[0_8px_30px_rgba(12,27,77,0.12)] sm:p-5 lg:bottom-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div aria-live="polite">
            <p className="tabular font-display text-[20px] font-bold">
              {units} of {UNIVERSITY.maxUnits} units chosen
            </p>
            <p className={`text-[15px] ${tooFew || tooMany ? "font-medium text-accent" : "text-muted"}`}>
              {tooFew
                ? `Add ${UNIVERSITY.minUnits - units} more units to reach the minimum.`
                : tooMany
                  ? `Remove ${units - UNIVERSITY.maxUnits} units. The maximum is ${UNIVERSITY.maxUnits}.`
                  : "You are within the allowed range."}
            </p>
          </div>
          <div className="flex gap-3">
            {editing && (
              <Button tone="quiet" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            )}
            <Button disabled={tooFew || tooMany} onClick={() => setConfirming(true)} className="flex-1 sm:flex-none">
              Submit registration
            </Button>
          </div>
        </div>
      </div>

      {confirming && (
        <Modal title="Submit these courses?" onClose={() => setConfirming(false)}>
          <p className="text-muted">
            You chose {selected.length} courses, {units} units in total. You can still change them until{" "}
            {UNIVERSITY.registrationCloses}.
          </p>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button tone="quiet" onClick={() => setConfirming(false)}>
              Go back
            </Button>
            <Button onClick={submit}>Submit registration</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
