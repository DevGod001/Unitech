# Unitech University, Port Harcourt: Student Portal

A clean, simple student portal. Students can sign in, register courses, see their timetable, check results, view fees and receipts, and update their contact details.

This version is a working frontend with sample data. There is no server or database yet.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000 and press "Fill in the demo account" on the sign-in page.

## Screens

| Screen | What the student does there |
| --- | --- |
| Sign in | Enters matric number and password |
| Home | Sees the one next step to take, a semester checklist and upcoming classes |
| Courses | Picks courses within the unit limits, submits, prints the course form |
| Timetable | Sees classes for each day, built from registered courses |
| Results | Sees CGPA and results for each semester |
| Fees | Sees the balance, the fee breakdown and printable receipts |
| My profile | Views the school record and edits contact details |
| Help | Reads short answers to common questions |

## How it is put together

- Next.js (App Router), TypeScript, Tailwind CSS
- `lib/data.ts`: all sample data in one file
- `lib/store.ts`: demo state kept in the browser (sign-in, registration, contact details)
- `lib/format.ts`: grading, GPA, fees and timetable helpers
- `components/`: logo, app shell (sidebar on desktop, bottom tabs on phones) and shared UI pieces
- `next.config.ts`: security headers (content security policy, clickjacking protection, HSTS)

## Security status

Already in place: security headers, input length limits and validation, sign-in lockout after 5 wrong tries, automatic sign-out after 15 minutes of inactivity, no third-party scripts or fonts.

Not yet in place: real authentication and access control. The demo sign-in runs in the browser, so it does not protect real data. Do not put real student records in this version. Real security comes with the backend: server-side sign-in, hashed passwords, and database rules so each student can only read their own records.
