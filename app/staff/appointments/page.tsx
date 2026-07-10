import Link from "next/link";
import { sampleAppointments } from "@/lib/appointments/sample-data";
import { formatMoney } from "@/lib/services/catalog";

export default function StaffAppointmentsPage() {
  return (
    <div>
      <h1 className="serif text-4xl font-semibold text-[#583d2f]">Appointments</h1>
      <div className="mt-6 overflow-hidden rounded-lg bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#d7dfcf] text-[#583d2f]">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {sampleAppointments.map((appointment) => (
              <tr key={appointment.id} className="border-t border-[#583d2f]/10">
                <td className="px-4 py-3 font-semibold">{appointment.bookingReference}</td>
                <td className="px-4 py-3">{appointment.customerName}</td>
                <td className="px-4 py-3">{appointment.serviceSummary}</td>
                <td className="px-4 py-3">{appointment.status}</td>
                <td className="px-4 py-3">{formatMoney(appointment.totalPesewas)}</td>
                <td className="px-4 py-3">
                  <Link href={`/staff/appointments/${appointment.id}`} className="font-semibold text-[#583d2f] underline underline-offset-4">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
