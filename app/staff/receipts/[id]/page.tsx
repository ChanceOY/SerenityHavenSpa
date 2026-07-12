import Image from "next/image";
import { notFound } from "next/navigation";
import { getReceiptAppointment } from "@/lib/appointments/data";
import { PrintButton } from "@/components/staff/print-button";
import { paymentMethodLabel } from "@/lib/receipts/receipts";
import { formatDuration, formatMoney } from "@/lib/services/catalog";

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const appointment = await getReceiptAppointment(id);
  const receipt = appointment?.receipts.find((item) => item.id === id);
  const payment = appointment?.payments.find((item) => item.status === "PAID");

  if (!appointment || !receipt || !payment) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-8">
      <PrintButton />
      <Image src="/brand/serenity-haven-logo.jpeg" alt="Serenity Haven Spa logo" width={72} height={72} className="h-16 w-16 rounded-full object-cover" />
      <h1 className="serif mt-4 text-4xl font-semibold text-[#583d2f]">Serenity Haven Spa</h1>
      <p className="mt-2 text-sm text-[#5f554d]">Receipt {receipt.receipt_number}</p>
      <p className="text-sm text-[#5f554d]">{new Date(receipt.issued_at).toLocaleString("en-GH")}</p>
      <div className="mt-5 rounded-md bg-[#fbf7f0] p-4 text-sm">
        <p><strong>Booking:</strong> {appointment.bookingReference}</p>
        <p><strong>Customer:</strong> {appointment.customerName}</p>
      </div>
      <div className="mt-6 divide-y divide-[#583d2f]/10">
        {appointment.serviceLines.map((item) => (
          <div key={item.id} className="flex justify-between py-3 text-sm">
            <div>
              <p className="font-semibold">{item.service_name_snapshot}</p>
              <p className="text-[#5f554d]">{formatDuration(item.duration_minutes_snapshot) || "Duration pending"}</p>
            </div>
            <strong>{formatMoney(item.quantity * item.unit_price_pesewas)}</strong>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-between border-t border-[#583d2f]/20 pt-5 text-lg font-semibold">
        <span>Total</span>
        <span>{formatMoney(receipt.total_pesewas)}</span>
      </div>
      <p className="mt-4 text-sm">Payment method: {paymentMethodLabel(payment.method)} / PAID</p>
      <p className="mt-8 text-sm text-[#5f554d]">Thank you for visiting Serenity Haven Spa.</p>
    </div>
  );
}
