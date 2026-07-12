import Link from "next/link";
import { listAppointments, type AppointmentFilters } from "@/lib/appointments/data";
import { formatMoney } from "@/lib/services/catalog";

const filters = [
  ["all", "All"],
  ["pending", "Pending"],
  ["today", "Today"],
  ["upcoming", "Upcoming"],
  ["completed", "Completed"],
] as const;

export default async function StaffAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; search?: string }>;
}) {
  const params = await searchParams;
  const activeFilter = filters.some(([value]) => value === params.filter) ? (params.filter as AppointmentFilters["filter"]) : "all";
  const appointments = await listAppointments({ filter: activeFilter, search: params.search });

  return (
    <div>
      <h1 className="serif text-4xl font-semibold text-[#583d2f]">Appointments</h1>
      <form className="mt-6 flex flex-wrap items-center gap-3 rounded-lg bg-white p-4">
        <input
          name="search"
          defaultValue={params.search ?? ""}
          className="min-w-64 flex-1 rounded-md border border-[#583d2f]/20 px-4 py-2"
          placeholder="Search reference, customer or phone"
        />
        <button className="rounded-full bg-[#583d2f] px-5 py-2 text-sm font-semibold text-white">Search</button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map(([value, label]) => (
          <Link
            key={value}
            href={`/staff/appointments?filter=${value}${params.search ? `&search=${encodeURIComponent(params.search)}` : ""}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              activeFilter === value ? "bg-[#583d2f] text-white" : "bg-white text-[#583d2f]"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
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
            {appointments.map((appointment) => (
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
        {appointments.length === 0 ? <p className="p-6 text-sm text-[#5f554d]">No appointments match this view.</p> : null}
      </div>
    </div>
  );
}
