"use client";

import { useState } from "react";
import { MapPin, UserRound } from "lucide-react";
import { ButtonLink, Card, PageHeader } from "@/components/ui";
import { DAYS, UNIVERSITY, type Day } from "@/lib/data";
import { classesOn, courseByCode, nextClassDay } from "@/lib/format";
import { usePortal } from "@/lib/store";

export default function TimetablePage() {
  const { registration } = usePortal();
  const codes = registration?.codes ?? [];
  const [picked, setPicked] = useState<Day | null>(null);

  if (!codes.length) {
    return (
      <div className="rise">
        <PageHeader title="Timetable" />
        <Card className="p-8 text-center sm:p-12">
          <h2 className="text-[22px] font-bold">No classes yet</h2>
          <p className="mx-auto mt-2 max-w-[40ch] text-muted">
            Your timetable is built from the courses you register. Register your courses and your classes appear here.
          </p>
          <ButtonLink href="/courses" className="mt-6">
            Register courses
          </ButtonLink>
        </Card>
      </div>
    );
  }

  const upcoming = nextClassDay(codes, new Date());
  const day = picked ?? upcoming?.day ?? "Monday";
  const slots = classesOn(day, codes);

  return (
    <div className="rise">
      <PageHeader title="Timetable">
        {UNIVERSITY.semester}, {UNIVERSITY.session}. Pick a day to see your classes.
      </PageHeader>

      <div role="tablist" aria-label="Day of the week" className="mb-6 grid grid-cols-5 gap-2 rounded-2xl border border-line bg-white p-2">
        {DAYS.map((name) => {
          const active = name === day;
          return (
            <button
              key={name}
              role="tab"
              aria-selected={active}
              onClick={() => setPicked(name)}
              className={`min-h-12 rounded-xl text-[15px] font-semibold transition-colors ${
                active ? "bg-brand text-white" : "text-muted hover:bg-brand-soft hover:text-brand"
              }`}
            >
              <span className="sm:hidden">{name.slice(0, 3)}</span>
              <span className="hidden sm:inline">{name}</span>
            </button>
          );
        })}
      </div>

      {slots.length ? (
        <ul className="space-y-3">
          {slots.map((slot) => {
            const course = courseByCode(slot.code);
            return (
              <li key={slot.code + slot.start}>
                <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:gap-8 sm:p-6">
                  <p className="tabular font-display text-[18px] font-bold text-brand sm:w-[190px] sm:shrink-0">
                    {slot.start} to {slot.end}
                  </p>
                  <div className="min-w-0">
                    <p className="text-[18px] font-semibold">{course?.title}</p>
                    <p className="tabular text-[14px] text-muted">{slot.code}</p>
                    <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[15px] text-muted">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={15} /> {slot.venue}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <UserRound size={15} /> {course?.lecturer}
                      </span>
                    </p>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <Card className="p-8 text-center text-muted">You have no classes on {day}.</Card>
      )}
    </div>
  );
}
