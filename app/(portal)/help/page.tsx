import Link from "next/link";
import { Card, PageHeader } from "@/components/ui";

const QUESTIONS = [
  {
    q: "How do I register my courses?",
    a: "Open Courses, tick the optional courses you want, then press Submit registration. Print the form and take it to your course adviser to sign.",
    href: "/courses",
    link: "Go to Courses",
  },
  {
    q: "I paid my fees but it still shows a balance",
    a: "Payments show after the Bursary confirms them, usually within two working days. If it takes longer, take your bank teller or transfer slip to the Bursary.",
    href: "/fees",
    link: "Go to Fees",
  },
  {
    q: "A result is missing or looks wrong",
    a: "Results appear after Senate approves them. If a score looks wrong, speak to your course adviser first. They can raise it with the department.",
    href: "/results",
    link: "Go to Results",
  },
  {
    q: "I forgot my password",
    a: "Visit the ICT help desk with your student ID card. They will reset it while you wait.",
  },
  {
    q: "My name or level is wrong",
    a: "Only the Registry can change your school record. Visit the Registry with your admission letter.",
    href: "/profile",
    link: "See my profile",
  },
];

export default function HelpPage() {
  return (
    <div className="rise">
      <PageHeader title="Help">Quick answers to the things students ask most.</PageHeader>

      <div className="space-y-3">
        {QUESTIONS.map((item) => (
          <Card key={item.q} className="p-0">
            <details className="group">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden="true" className="text-[24px] font-normal text-brand group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6">
                <p className="max-w-[60ch] text-muted">{item.a}</p>
                {item.href && (
                  <Link href={item.href} className="mt-3 inline-flex min-h-11 items-center font-semibold text-brand underline underline-offset-4">
                    {item.link}
                  </Link>
                )}
              </div>
            </details>
          </Card>
        ))}
      </div>

      <Card className="mt-8 bg-brand-soft p-6 sm:p-7">
        <h2 className="text-[20px] font-bold">Still stuck?</h2>
        <p className="mt-2 max-w-[60ch] text-muted">
          The ICT help desk is on the ground floor of the Computing Block, open Monday to Friday, 8:00 am to 4:00 pm.
        </p>
      </Card>
    </div>
  );
}
