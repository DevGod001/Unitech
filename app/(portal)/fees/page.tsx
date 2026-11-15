"use client";

import { useState } from "react";
import { Printer, ReceiptText } from "lucide-react";
import { Badge, Button, Card, Modal, PageHeader } from "@/components/ui";
import { FEE_ITEMS, RECEIPTS, STUDENT, UNIVERSITY, type Receipt } from "@/lib/data";
import { feeSummary, naira } from "@/lib/format";

export default function FeesPage() {
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const { total, paid, balance } = feeSummary();
  const percent = Math.round((paid / total) * 100);

  return (
    <div className="rise">
      <PageHeader title="Fees">
        School fees for the {UNIVERSITY.session} session, and every payment you have made.
      </PageHeader>

      <Card className="no-print p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[15px] text-muted">Left to pay</p>
            <p className={`tabular mt-1 font-display text-[44px] font-bold leading-none sm:text-[56px] ${balance ? "text-accent" : "text-ok"}`}>
              {naira(balance)}
            </p>
          </div>
          <Badge tone={balance ? "alert" : "ok"}>{balance ? `Due ${UNIVERSITY.feesDue}` : "Fully paid"}</Badge>
        </div>

        <div
          className="mt-6 h-3 overflow-hidden rounded-full bg-paper"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Share of fees paid"
        >
          <div className="h-full rounded-full bg-brand" style={{ width: `${percent}%` }} />
        </div>
        <p className="tabular mt-3 text-[15px] text-muted">
          {naira(paid)} paid of {naira(total)} ({percent}%)
        </p>

        <div className="mt-6 rounded-xl bg-brand-soft p-4 text-[15px]">
          <p className="font-semibold">How to pay</p>
          <p className="mt-1 text-muted">
            Pay at the Bursary or at a partner bank using your matric number, {STUDENT.matric}. Your receipt shows here
            once the Bursary confirms it. Online payment is coming soon.
          </p>
        </div>
      </Card>

      <div className="no-print mt-8 grid gap-8 lg:grid-cols-2">
        <Card aria-labelledby="breakdown" className="p-6 sm:p-7">
          <h2 id="breakdown" className="text-[20px] font-bold">
            What you are charged
          </h2>
          <dl className="mt-4 divide-y divide-line">
            {FEE_ITEMS.map((item) => (
              <div key={item.label} className="flex justify-between gap-4 py-3">
                <dt>{item.label}</dt>
                <dd className="tabular font-semibold">{naira(item.amount)}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4 pt-4 text-[18px] font-bold">
              <dt>Total</dt>
              <dd className="tabular">{naira(total)}</dd>
            </div>
          </dl>
        </Card>

        <Card aria-labelledby="receipts" className="p-6 sm:p-7">
          <h2 id="receipts" className="text-[20px] font-bold">
            Your receipts
          </h2>
          <ul className="mt-4 divide-y divide-line">
            {RECEIPTS.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <span className="min-w-0 flex-1">
                  <span className="tabular block font-semibold">{naira(item.amount)}</span>
                  <span className="block text-[14px] text-muted">
                    {item.date}, {item.session} session
                  </span>
                </span>
                <button
                  onClick={() => setReceipt(item)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-[15px] font-semibold text-brand hover:border-brand"
                >
                  <ReceiptText size={17} /> View
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {receipt && (
        <Modal title="Payment receipt" onClose={() => setReceipt(null)}>
          <p className="text-[15px] text-muted">
            {UNIVERSITY.name}, {UNIVERSITY.city}
          </p>
          <p className="tabular mt-4 font-display text-[36px] font-bold text-ok">{naira(receipt.amount)}</p>
          <dl className="mt-4 divide-y divide-line text-[15px]">
            {[
              ["Paid by", `${STUDENT.firstName} ${STUDENT.lastName}`],
              ["Matric number", STUDENT.matric],
              ["For", receipt.description],
              ["Session", receipt.session],
              ["Date", receipt.date],
              ["Method", receipt.method],
              ["Receipt number", receipt.id],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-6 py-2.5">
                <dt className="text-muted">{label}</dt>
                <dd className="tabular text-right font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[13px] text-muted">Sample receipt for demonstration. Not a valid proof of payment.</p>
          <Button onClick={() => window.print()} className="no-print mt-5 w-full">
            <Printer size={18} /> Print receipt
          </Button>
        </Modal>
      )}
    </div>
  );
}
