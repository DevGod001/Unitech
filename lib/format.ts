import { COURSES, DAYS, FEE_ITEMS, RECEIPTS, RESULTS, TIMETABLE, UNIVERSITY, type Day, type Result } from "./data";

export const naira = (amount: number) => "₦" + amount.toLocaleString("en-NG");

// Nigerian 5-point grading scale.
export function grade(score: number): { letter: string; points: number } {
  if (score >= 70) return { letter: "A", points: 5 };
  if (score >= 60) return { letter: "B", points: 4 };
  if (score >= 50) return { letter: "C", points: 3 };
  if (score >= 45) return { letter: "D", points: 2 };
  if (score >= 40) return { letter: "E", points: 1 };
  return { letter: "F", points: 0 };
}

export function gpa(results: Result[]): number {
  const units = results.reduce((sum, r) => sum + r.units, 0);
  const points = results.reduce((sum, r) => sum + r.units * grade(r.score).points, 0);
  return units ? points / units : 0;
}

export const cgpa = () => gpa(RESULTS.flatMap((s) => s.results));

export function classOfDegree(value: number): string {
  if (value >= 4.5) return "First Class";
  if (value >= 3.5) return "Second Class Upper";
  if (value >= 2.4) return "Second Class Lower";
  if (value >= 1.5) return "Third Class";
  return "Pass";
}

export const unitsFor = (codes: string[]) =>
  COURSES.filter((c) => codes.includes(c.code)).reduce((sum, c) => sum + c.units, 0);

export const courseByCode = (code: string) => COURSES.find((c) => c.code === code);

export const classesOn = (day: Day, codes: string[]) =>
  TIMETABLE.filter((slot) => slot.day === day && codes.includes(slot.code));

/** Today if it is a weekday with classes, otherwise the next day that has classes. */
export function nextClassDay(codes: string[], now: Date): { day: Day; isToday: boolean } | null {
  const todayIndex = now.getDay() - 1; // Monday = 0
  for (let step = 0; step < 7; step++) {
    const index = (todayIndex + step + 7) % 7;
    if (index > 4) continue;
    const day = DAYS[index];
    if (classesOn(day, codes).length) return { day, isToday: step === 0 };
  }
  return null;
}

export function feeSummary() {
  const total = FEE_ITEMS.reduce((sum, item) => sum + item.amount, 0);
  const paid = RECEIPTS.filter((r) => r.session === UNIVERSITY.session).reduce((sum, r) => sum + r.amount, 0);
  return { total, paid, balance: Math.max(total - paid, 0) };
}
