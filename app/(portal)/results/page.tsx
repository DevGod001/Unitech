"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge, Card, PageHeader } from "@/components/ui";
import { RESULTS } from "@/lib/data";
import { cgpa, classOfDegree, gpa, grade } from "@/lib/format";

export default function ResultsPage() {
  const [open, setOpen] = useState<string | null>(RESULTS[0].id);
  const overall = cgpa();
  const totalUnits = RESULTS.flatMap((s) => s.results).reduce((sum, r) => sum + r.units, 0);

  return (
    <div className="rise">
      <PageHeader title="Results">Your approved results, newest first. Tap a semester to open it.</PageHeader>

      <section className="mb-8 flex flex-col gap-6 rounded-3xl bg-ink p-7 text-white sm:flex-row sm:items-end sm:justify-between sm:p-9">
        <div>
          <p className="text-[15px] text-white/70">Overall grade (CGPA)</p>
          <p className="tabular mt-1 font-display text-[64px] font-bold leading-none">
            {overall.toFixed(2)}
            <span className="ml-2 text-[20px] font-medium text-white/60">out of 5.00</span>
          </p>
        </div>
        <div className="sm:text-right">
          <p className="font-display text-[20px] font-bold">{classOfDegree(overall)}</p>
          <p className="text-[15px] text-white/70">{totalUnits} units completed</p>
        </div>
      </section>

      <div className="space-y-3">
        {RESULTS.map((semester) => {
          const isOpen = open === semester.id;
          return (
            <Card key={semester.id} className="overflow-hidden">
              <h2 className="font-sans">
                <button
                  onClick={() => setOpen(isOpen ? null : semester.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 p-5 text-left sm:p-6"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[18px] font-semibold">{semester.label}</span>
                    <span className="block text-[14px] font-normal text-muted">{semester.session} session</span>
                  </span>
                  <span className="tabular whitespace-nowrap font-display text-[18px] font-bold text-brand">
                    GPA {gpa(semester.results).toFixed(2)}
                  </span>
                  <ChevronDown size={20} className={`shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
              </h2>
              {isOpen && (
                <div className="border-t border-line">
                  <table className="w-full text-left text-[15px]">
                    <thead className="bg-paper text-[14px] text-muted">
                      <tr>
                        <th scope="col" className="px-5 py-3 font-semibold sm:px-6">Course</th>
                        <th scope="col" className="hidden px-3 py-3 text-right font-semibold sm:table-cell">Units</th>
                        <th scope="col" className="px-3 py-3 text-right font-semibold">Score</th>
                        <th scope="col" className="px-5 py-3 text-right font-semibold sm:px-6">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {semester.results.map((result) => {
                        const { letter } = grade(result.score);
                        return (
                          <tr key={result.code}>
                            <td className="px-5 py-3.5 sm:px-6">
                              <span className="block font-semibold">{result.title}</span>
                              <span className="tabular block text-[14px] text-muted">
                                {result.code}
                                <span className="sm:hidden">, {result.units} units</span>
                              </span>
                            </td>
                            <td className="tabular hidden px-3 py-3.5 text-right sm:table-cell">{result.units}</td>
                            <td className="tabular px-3 py-3.5 text-right">{result.score}</td>
                            <td className="px-5 py-3.5 text-right sm:px-6">
                              <Badge tone={letter === "A" ? "ok" : letter === "F" || letter === "E" ? "alert" : "info"}>{letter}</Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <p className="mt-6 text-[15px] text-muted">
        Grades: A is 70 and above, B is 60 to 69, C is 50 to 59, D is 45 to 49, E is 40 to 44, F is below 40.
      </p>
    </div>
  );
}
