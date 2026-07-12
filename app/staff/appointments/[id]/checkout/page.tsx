import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppointment } from "@/lib/appointments/data";
import { formatDuration, formatMoney } from "@/lib/services/catalog";
import { listServiceVariantOptions } from "@/lib/services/data";
import { addCheckoutService, completeAppointmentCheckout } from "./actions";

const paymentMethods = [
  ["CASH", "Cash"],
  ["MOBILE_MONEY", "Mobile Money"],
  ["CARD", "Card"],
  ["BANK_TRANSFER", "Bank Transfer"],
] as const;

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [appointment, variants] = await Promise.all([getAppointment(id), listServiceVariantOptions()]);

  if (!appointment) {
    notFound();
  }

  const blocked = ["CANCELLED", "NO_SHOW", "COMPLETED"].includes(appointment.status);
  const receipt = appointment.receipts[0];

  return (
    <div>
      <Link href={`/staff/appointments/${appointment.id}`} className="text-sm font-semibold text-[#583d2f] underline underline-offset-4">
        Back to appointment
      </Link>
      <div className="mt-5 rounded-lg bg-white p-6">
        <h1 className="serif text-4xl font-semibold text-[#583d2f]">Checkout</h1>
        <p className="mt-2 text-sm text-[#5f554d]">
          {appointment.bookingReference} / {appointment.customerName}
        </p>
        {blocked ? (
          <div className="mt-6 rounded-lg bg-[#fbf7f0] p-4 text-sm">
            Checkout is not available for {appointment.status.toLowerCase().replace(/_/g, " ")} appointments.
            {receipt ? (
              <Link href={`/staff/receipts/${receipt.id}`} className="ml-2 font-semibold text-[#583d2f] underline underline-offset-4">
                View receipt
              </Link>
            ) : null}
          </div>
        ) : (
          <>
            <div className="mt-6 divide-y divide-[#583d2f]/10">
              {appointment.serviceLines.map((line) => (
                <div key={line.id} className="flex justify-between gap-4 py-3 text-sm">
                  <div>
                    <p className="font-semibold">{line.service_name_snapshot}</p>
                    <p className="text-[#5f554d]">{formatDuration(line.duration_minutes_snapshot) || "Duration pending"}</p>
                  </div>
                  <strong>{formatMoney(line.quantity * line.unit_price_pesewas)}</strong>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-between border-t border-[#583d2f]/20 pt-5 text-lg font-semibold">
              <span>Total</span>
              <span>{formatMoney(appointment.totalPesewas + (appointment.transportFeePesewas ?? 0))}</span>
            </div>
            <form action={addCheckoutService.bind(null, appointment.id)} className="mt-6 rounded-lg bg-[#fbf7f0] p-4">
              <h2 className="font-semibold text-[#583d2f]">Add Extra Service</h2>
              <div className="mt-3 flex flex-wrap gap-3">
                <select name="serviceVariantId" className="min-w-72 flex-1 rounded-md border px-4 py-3" defaultValue="">
                  <option value="" disabled>Select service</option>
                  {variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.serviceName} / {variant.locationType} / {formatDuration(variant.durationMinutes) || "Duration pending"} / {formatMoney(variant.pricePesewas)}
                    </option>
                  ))}
                </select>
                <button className="rounded-full bg-[#583d2f] px-5 py-3 text-sm font-semibold text-white">Add</button>
              </div>
            </form>
            <form action={completeAppointmentCheckout.bind(null, appointment.id)} className="mt-6 rounded-lg bg-[#fbf7f0] p-4">
              <h2 className="font-semibold text-[#583d2f]">Payment</h2>
              <select name="paymentMethod" className="mt-3 w-full rounded-md border px-4 py-3" defaultValue="MOBILE_MONEY">
                {paymentMethods.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <button className="mt-4 rounded-full bg-[#583d2f] px-5 py-3 text-sm font-semibold text-white">Complete Payment</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
