"use client";

import { useState, type FormEvent } from "react";
import { Check, CircleCheck, Printer, X } from "lucide-react";
import { Button, Card, Modal, PageHeader, Progress } from "@/components/ui";
import { COURSE_CHANGE, PROGRAMMES, RESULTS, STUDENT } from "@/lib/data";
import { cgpa } from "@/lib/format";
import { portal, usePortal } from "@/lib/store";

const MIN_REASON = 30;

export default function ChangeOfCoursePage() {
  const { courseChange } = usePortal();
  const [faculty, setFaculty] = useState("");
  const [programme, setProgramme] = useState("");
  const [reason, setReason] = useState("");
  const [spoken, setSpoken] = useState(false);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  const grade = cgpa();
  const checks = [
    { ok: RESULTS.length >= 2, text: `You have finished at least two semesters (${RESULTS.length} done)` },
    { ok: grade >= COURSE_CHANGE.minCgpa, text: `Your CGPA is ${COURSE_CHANGE.minCgpa.toFixed(2)} or higher (yours is ${grade.toFixed(2)})` },
  ];
  const eligible = checks.every((c) => c.ok);

  // Already requested: show the form and where it has reached.
  if (courseChange) {
    return (
      <div className="rise">
        <PageHeader title="Change of course" />

        <div className="no-print mb-6 flex items-start gap-3 rounded-2xl bg-ok-soft p-5 text-ok">
          <CircleCheck className="mt-0.5 shrink-0" size={22} />
          <p className="font-medium">
            Request sent on {courseChange.submittedOn}. It is now with your Head of Department, {STUDENT.headOfDepartment}.
            You stay in {STUDENT.department} until the Registry approves the change.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card aria-labelledby="change-progress" className="self-start no-print p-6 sm:p-7">
            <h2 id="change-progress" className="mb-5 text-[20px] font-bold">
              Where your request is
            </h2>
            <Progress
              current={1}
              stages={[
                { label: "Request sent", note: `Received on ${courseChange.submittedOn}` },
                { label: "Head of Department", note: `${STUDENT.department} releases you` },
                { label: "Dean of the new faculty", note: `${courseChange.faculty} accepts you` },
                { label: "Registry", note: "Your record is updated" },
              ]}
            />
          </Card>

          <Card aria-labelledby="change-form" className="self-start p-6 sm:p-7">
            <h2 id="change-form" className="text-[20px] font-bold">
              Change of course form
            </h2>
            <dl className="mt-4 divide-y divide-line">
              {[
                ["Student", `${STUDENT.firstName} ${STUDENT.lastName}, ${STUDENT.matric}`],
                ["Moving from", `${STUDENT.programme}, ${STUDENT.faculty}`],
                ["Moving to", `${courseChange.programme}, ${courseChange.faculty}`],
                ["CGPA", grade.toFixed(2)],
                ["Reason", courseChange.reason],
                ["Request number", courseChange.ref],
              ].map(([label, value]) => (
                <div key={label} className="py-3">
                  <dt className="text-[14px] text-muted">{label}</dt>
                  <dd className="break-words font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="no-print mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
              <Button tone="quiet" onClick={() => window.print()}>
                <Printer size={18} /> Print form
              </Button>
              <button onClick={() => setWithdrawing(true)} className="min-h-11 font-semibold text-accent underline underline-offset-4">
                Withdraw request
              </button>
            </div>
          </Card>
        </div>

        {withdrawing && (
          <Modal title="Withdraw this request?" onClose={() => setWithdrawing(false)}>
            <p className="text-muted">
              You will stay in {STUDENT.programme}. You can send a new request until {COURSE_CHANGE.closes}.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button tone="quiet" onClick={() => setWithdrawing(false)}>
                Keep request
              </Button>
              <Button
                className="bg-accent hover:bg-accent/90"
                onClick={() => {
                  portal.withdrawCourseChange();
                  setWithdrawing(false);
                  setSpoken(false);
                }}
              >
                Withdraw request
              </Button>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  const options = PROGRAMMES.find((group) => group.faculty === faculty)?.programmes ?? [];

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!faculty || !programme) return setError("Choose the faculty and the programme you want to move to.");
    if (reason.trim().length < MIN_REASON) return setError(`Tell us a little more about your reason. Write at least ${MIN_REASON} characters.`);
    if (!spoken) return setError("Tick the box to confirm you have spoken with your course adviser.");
    setError("");
    setConfirming(true);
  }

  const field = "mt-2 block h-14 w-full rounded-xl border border-line bg-white px-4 text-[16px] focus:border-brand disabled:bg-paper disabled:text-muted";

  return (
    <div className="rise">
      <PageHeader title="Change of course">
        Ask to move from {STUDENT.programme} to another programme. Your Head of Department reviews it first. Requests
        close on {COURSE_CHANGE.closes}.
      </PageHeader>

      <Card aria-labelledby="eligible" className="mb-8 p-6 sm:p-7">
        <h2 id="eligible" className="text-[20px] font-bold">
          {eligible ? "You can apply" : "You cannot apply yet"}
        </h2>
        <ul className="mt-4 space-y-3">
          {checks.map((check) => (
            <li key={check.text} className="flex items-start gap-3">
              <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-white ${check.ok ? "bg-ok" : "bg-accent"}`}>
                {check.ok ? <Check size={15} strokeWidth={3} /> : <X size={15} strokeWidth={3} />}
              </span>
              {check.text}
            </li>
          ))}
        </ul>
        {!eligible && (
          <p className="mt-4 text-muted">Speak with your course adviser, {STUDENT.adviser}, about your options.</p>
        )}
      </Card>

      {eligible && (
        <form onSubmit={onSubmit} noValidate className="space-y-8">
          <div>
            <p className="font-display text-[20px] font-bold">1. Where do you want to move to?</p>
            <div className="mt-3 grid gap-5 sm:grid-cols-2">
              <label className="block text-[15px] font-semibold">
                Faculty
                <select
                  className={field}
                  value={faculty}
                  onChange={(e) => {
                    setFaculty(e.target.value);
                    setProgramme("");
                    setError("");
                  }}
                >
                  <option value="">Choose a faculty</option>
                  {PROGRAMMES.map((group) => (
                    <option key={group.faculty}>{group.faculty}</option>
                  ))}
                </select>
              </label>
              <label className="block text-[15px] font-semibold">
                Programme
                <select
                  className={field}
                  value={programme}
                  disabled={!faculty}
                  onChange={(e) => {
                    setProgramme(e.target.value);
                    setError("");
                  }}
                >
                  <option value="">{faculty ? "Choose a programme" : "Choose a faculty first"}</option>
                  {options.map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="reason" className="block font-display text-[20px] font-bold">
              2. Why do you want to change?
            </label>
            <p className="mt-1 text-[15px] text-muted">A few honest sentences are enough. Your Head of Department reads this.</p>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              maxLength={600}
              rows={5}
              className="mt-3 block w-full rounded-xl border border-line bg-white p-4 text-[16px] focus:border-brand"
            />
            <p className="tabular mt-1 text-right text-[14px] text-muted">{reason.length} of 600</p>
          </div>

          <div>
            <p className="font-display text-[20px] font-bold">3. Confirm and send</p>
            <label className="mt-3 flex cursor-pointer items-start gap-4 rounded-2xl border border-line bg-white p-5">
              <input
                type="checkbox"
                checked={spoken}
                onChange={(e) => {
                  setSpoken(e.target.checked);
                  setError("");
                }}
                className="mt-0.5 h-6 w-6 shrink-0 accent-brand"
              />
              <span>I have spoken with my course adviser, {STUDENT.adviser}, about this change.</span>
            </label>
          </div>

          <p role="alert" className={error ? "rounded-xl bg-accent-soft px-4 py-3 text-[15px] font-medium text-accent" : "sr-only"}>
            {error}
          </p>

          <Button type="submit" className="w-full sm:w-auto">
            Send request
          </Button>
        </form>
      )}

      {confirming && (
        <Modal title="Send this request?" onClose={() => setConfirming(false)}>
          <p className="text-muted">
            You are asking to move from {STUDENT.programme} to {programme}. It goes to your Head of Department first. You
            can withdraw it at any time before it is approved.
          </p>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button tone="quiet" onClick={() => setConfirming(false)}>
              Go back
            </Button>
            <Button
              onClick={() => {
                portal.requestCourseChange({ faculty, programme, reason: reason.trim() });
                setConfirming(false);
                window.scrollTo({ top: 0 });
              }}
            >
              Send request
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
