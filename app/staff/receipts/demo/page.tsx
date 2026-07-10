import Image from "next/image";
import { PrintButton } from "@/components/staff/print-button";
import { createReceiptNumber, paymentMethodLabel } from "@/lib/receipts/receipts";
import { formatMoney } from "@/lib/services/catalog";

const lineItems = [
  { service: "Swedish Massage", duration: "90 min", pricePesewas: 30000 },
  { service: "Pedicure", duration: "", pricePesewas: 12000 },
];

export default function DemoReceiptPage() {
  const total = lineItems.reduce((sum, item) => sum + item.pricePesewas, 0);

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-8">
      <PrintButton />
      <Image src="/brand/serenity-haven-logo.jpeg" alt="Serenity Haven Spa logo" width={72} height={72} className="h-16 w-16 rounded-full object-cover" />
      <h1 className="serif mt-4 text-4xl font-semibold text-[#583d2f]">Serenity Haven Spa</h1>
      <p className="mt-2 text-sm text-[#5f554d]">Receipt {createReceiptNumber(new Date("2026-07-09T12:00:00Z"))}</p>
      <div className="mt-6 divide-y divide-[#583d2f]/10">
        {lineItems.map((item) => (
          <div key={item.service} className="flex justify-between py-3 text-sm">
            <div>
              <p className="font-semibold">{item.service}</p>
              {item.duration ? <p className="text-[#5f554d]">{item.duration}</p> : null}
            </div>
            <strong>{formatMoney(item.pricePesewas)}</strong>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-between border-t border-[#583d2f]/20 pt-5 text-lg font-semibold">
        <span>Total</span>
        <span>{formatMoney(total)}</span>
      </div>
      <p className="mt-4 text-sm">Payment method: {paymentMethodLabel("CASH")} / PAID</p>
      <p className="mt-8 text-sm text-[#5f554d]">Thank you for visiting Serenity Haven Spa.</p>
    </div>
  );
}
