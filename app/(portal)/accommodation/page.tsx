"use client";

import { useState, type FormEvent } from "react";
import { Check, CircleCheck } from "lucide-react";
import { Badge, Button, Card, Modal, PageHeader, Progress } from "@/components/ui";
import { ACCOMMODATION, HALLS, STUDENT, UNIVERSITY } from "@/lib/data";
import { naira } from "@/lib/format";
import { portal, usePortal } from "@/lib/store";

const HALLS_FOR_ME = HALLS.filter((hall) => hall.gender === STUDENT.gender);

export default function AccommodationPage() {
  const { hostel } = usePortal();
  const [choice, setChoice] = useState<{ hall: string; beds: number; price: number } | null>(null);
  const [note, setNote] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  // Already applied: show where the application has reached.
  if (hostel) {
    return (
      <div className="rise">
        <PageHeader title="Accommodation">Hostel application for the {UNIVERSITY.session} session.</PageHeader>

        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-ok-soft p-5 text-ok">
          <CircleCheck className="mt-0.5 shrink-0" size={22} />
          <p className="font-medium">
            Application sent on {hostel.submittedOn}. You do not need to do anything now. We will show the result here.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card aria-labelledby="hostel-progress" className="self-start p-6 sm:p-7">
            <h2 id="hostel-progress" className="mb-5 text-[20px] font-bold">
              Where your application is
            </h2>
            <Progress
              current={1}
              stages={[
                { label: "Application sent", note: `Received on ${hostel.submittedOn}` },
                { label: `${ACCOMMODATION.office} review`, note: "Usually takes 5 working days" },
                { label: "Room allocated", note: "You get your room number here" },
                { label: "Pay hostel fee", note: `${naira(hostel.price)}, within 7 days of allocation` },
              ]}
            />
          </Card>

          <Card aria-labelledby="hostel-choice" className="self-start p-6 sm:p-7">
            <h2 id="hostel-choice" className="text-[20px] font-bold">
              What you applied for
            </h2>
            <dl className="mt-4 divide-y divide-line">
              {[
                ["Hall", hostel.hall],
                ["Room type", `${hostel.beds} students in a room`],
                ["Fee for the session", naira(hostel.price)],
                ["Special need", hostel.note || "None"],
                ["Application number", hostel.ref],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-6 py-3">
                  <dt className="text-muted">{label}</dt>
                  <dd className="tabular text-right font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
            <button
              onClick={() => setWithdrawing(true)}
              className="mt-5 min-h-11 font-semibold text-accent underline underline-offset-4"
            >
              Withdraw application
            </button>
          </Card>
        </div>

        {withdrawing && (
          <Modal title="Withdraw this application?" onClose={() => setWithdrawing(false)}>
            <p className="text-muted">
              You will lose your place in the queue for {hostel.hall}. You can apply again until {ACCOMMODATION.closes}.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button tone="quiet" onClick={() => setWithdrawing(false)}>
                Keep application
              </Button>
              <Button
                className="bg-accent hover:bg-accent/90"
                onClick={() => {
                  portal.withdrawHostel();
                  setWithdrawing(false);
                  setChoice(null);
                  setAgreed(false);
                }}
              >
                Withdraw application
              </Button>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!choice) return setError("Choose a room first.");
    if (!agreed) return setError("Tick the box to agree to the hostel rules.");
    setError("");
    setConfirming(true);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rise">
      <PageHeader title="Accommodation">
        Apply for a room on campus for the {UNIVERSITY.session} session. Applications close on {ACCOMMODATION.closes}.
      </PageHeader>

      <fieldset>
        <legend className="text-[20px] font-bold font-display">1. Choose a room</legend>
        <p className="mt-1 text-[15px] text-muted">You pay the fee only after a room is allocated to you.</p>

        <div className="mt-4 space-y-6">
          {HALLS_FOR_ME.map((hall) => (
            <div key={hall.name}>
              <p className="font-semibold">{hall.name}</p>
              <p className="text-[15px] text-muted">{hall.about}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {hall.rooms.map((room) => {
                  const full = room.spacesLeft === 0;
                  const on = choice?.hall === hall.name && choice.beds === room.beds;
                  return (
                    <label
                      key={room.beds}
                      className={`flex min-h-[92px] items-center gap-4 rounded-2xl border bg-white px-5 py-4 transition-colors ${
                        full ? "opacity-60" : "cursor-pointer hover:border-brand"
                      } ${on ? "border-brand ring-1 ring-brand" : "border-line"}`}
                    >
                      <input
                        type="radio"
                        name="room"
                        className="peer sr-only"
                        disabled={full}
                        checked={on}
                        onChange={() => {
                          setChoice({ hall: hall.name, beds: room.beds, price: room.price });
                          setError("");
                        }}
                      />
                      <span
                        aria-hidden="true"
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand ${
                          on ? "border-brand bg-brand text-white" : "border-line"
                        }`}
                      >
                        {on && <Check size={16} strokeWidth={3} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold">{room.beds} students in a room</span>
                        <span className="tabular block text-[15px] text-muted">{naira(room.price)} for the session</span>
                      </span>
                      <Badge tone={full ? "alert" : room.spacesLeft <= 10 ? "info" : "plain"}>
                        {full ? "Full" : `${room.spacesLeft} left`}
                      </Badge>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="mt-10">
        <label htmlFor="need" className="block font-display text-[20px] font-bold">
          2. Tell us about any special need
        </label>
        <p className="mt-1 text-[15px] text-muted">
          Optional. For example a medical condition or a ground-floor room. Leave it empty if you have none.
        </p>
        <textarea
          id="need"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={300}
          rows={3}
          className="mt-3 block w-full rounded-xl border border-line bg-white p-4 text-[16px] focus:border-brand"
        />
      </div>

      <div className="mt-10">
        <p className="font-display text-[20px] font-bold">3. Agree and apply</p>
        <label className="mt-3 flex cursor-pointer items-start gap-4 rounded-2xl border border-line bg-white p-5">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              setError("");
            }}
            className="mt-0.5 h-6 w-6 shrink-0 accent-brand"
          />
          <span>
            I will follow the hostel rules, and I understand that a room is not guaranteed until Student Affairs
            allocates one.
          </span>
        </label>
      </div>

      <p role="alert" className={error ? "mt-5 rounded-xl bg-accent-soft px-4 py-3 text-[15px] font-medium text-accent" : "sr-only"}>
        {error}
      </p>

      <Button type="submit" className="mt-6 w-full sm:w-auto">
        Apply for this room
      </Button>

      {confirming && choice && (
        <Modal title="Send this application?" onClose={() => setConfirming(false)}>
          <p className="text-muted">
            {choice.hall}, {choice.beds} students in a room, {naira(choice.price)} for the session. You pay nothing now.
          </p>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" tone="quiet" onClick={() => setConfirming(false)}>
              Go back
            </Button>
            <Button
              type="button"
              onClick={() => {
                portal.applyForHostel({ ...choice, note: note.trim() });
                setConfirming(false);
                window.scrollTo({ top: 0 });
              }}
            >
              Send application
            </Button>
          </div>
        </Modal>
      )}
    </form>
  );
}
