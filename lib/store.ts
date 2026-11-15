"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_CONTACT, DEMO_LOGIN } from "./data";

// Demo-only state kept in the browser.
// The sign-in here is a stand-in: real security arrives with the server and database.

export type Contact = typeof DEFAULT_CONTACT;
export type Registration = { codes: string[]; submittedOn: string };
export type HostelApplication = {
  ref: string;
  hall: string;
  beds: number;
  price: number;
  note: string;
  submittedOn: string;
};
export type CourseChangeRequest = {
  ref: string;
  faculty: string;
  programme: string;
  reason: string;
  submittedOn: string;
};

type State = {
  ready: boolean;
  signedIn: boolean;
  registration: Registration | null;
  hostel: HostelApplication | null;
  courseChange: CourseChangeRequest | null;
  contact: Contact;
};

const SESSION_KEY = "unitech.session";
const DATA_KEY = "unitech.demo";

const SERVER_STATE: State = { ready: false, signedIn: false, registration: null, hostel: null, courseChange: null, contact: DEFAULT_CONTACT };

let state: State | null = null;
const listeners = new Set<() => void>();

function load(): State {
  const next: State = { ...SERVER_STATE, ready: true };
  try {
    next.signedIn = window.sessionStorage.getItem(SESSION_KEY) === "1";
    const saved = JSON.parse(window.localStorage.getItem(DATA_KEY) ?? "{}");
    if (saved.registration?.codes) next.registration = saved.registration;
    if (saved.hostel?.ref) next.hostel = saved.hostel;
    if (saved.courseChange?.ref) next.courseChange = saved.courseChange;
    if (saved.contact) next.contact = { ...DEFAULT_CONTACT, ...saved.contact };
  } catch {
    // Storage can be blocked. The portal still works, it just forgets on refresh.
  }
  return next;
}

function current(): State {
  if (!state) state = load();
  return state;
}

function update(patch: Partial<State>) {
  state = { ...current(), ...patch };
  try {
    if (state.signedIn) window.sessionStorage.setItem(SESSION_KEY, "1");
    else window.sessionStorage.removeItem(SESSION_KEY);
    window.localStorage.setItem(
      DATA_KEY,
      JSON.stringify({
        registration: state.registration,
        hostel: state.hostel,
        courseChange: state.courseChange,
        contact: state.contact,
      }),
    );
  } catch {}
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePortal(): State {
  return useSyncExternalStore(subscribe, current, () => SERVER_STATE);
}

const tidy = (value: string) => value.replace(/\s+/g, "").toUpperCase();

const today = () => new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
const newRef = (prefix: string) => `${prefix}-${String(Date.now()).slice(-6)}`;

export const portal = {
  applyForHostel(choice: Omit<HostelApplication, "ref" | "submittedOn">) {
    update({ hostel: { ...choice, ref: newRef("UTP-HST"), submittedOn: today() } });
  },
  withdrawHostel() {
    update({ hostel: null });
  },
  requestCourseChange(request: Omit<CourseChangeRequest, "ref" | "submittedOn">) {
    update({ courseChange: { ...request, ref: newRef("UTP-COC"), submittedOn: today() } });
  },
  withdrawCourseChange() {
    update({ courseChange: null });
  },
  signIn(matric: string, password: string): boolean {
    const ok = tidy(matric) === DEMO_LOGIN.matric && password === DEMO_LOGIN.password;
    if (ok) update({ signedIn: true });
    return ok;
  },
  signOut() {
    update({ signedIn: false });
  },
  submitRegistration(codes: string[]) {
    update({ registration: { codes, submittedOn: today() } });
  },
  saveContact(contact: Contact) {
    update({ contact });
  },
};
