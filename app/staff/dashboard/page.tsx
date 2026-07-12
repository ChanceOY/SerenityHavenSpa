import Link from "next/link";
import { displayAppointmentTime, getDashboardData } from "@/lib/appointments/data";

export default async function StaffDashboardPage() {
  const dashboard = await getDashboardData();
  const stats = [
    ["Today", dashboard.stats.today],
    ["Pending Requests", dashboard.stats.pending],
    ["Upcoming", dashboard.stats.upcoming],
    ["Completed", dashboard.stats.completed],
    ["Walk-Ins", dashboard.stats.walkIns],
  ] as const;

  return (
    <div>
      <h1 className="serif text-4xl font-semibold text-[#583d2f]">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-white p-5">
            <p className="text-sm text-[#5f554d]">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-[#583d2f]">{value}</p>
          </div>
        ))}
      </div>
      <section className="mt-8 rounded-lg bg-white p-5">
        <h2 className="text-lg font-semibold text-[#583d2f]">Today's Appointments</h2>
        <div className="mt-4 divide-y divide-[#583d2f]/10">
          {dashboard.today.map((appointment) => (
            <div key={appointment.id} className="grid gap-3 py-4 text-sm md:grid-cols-[90px_1fr_90px_90px_110px_100px_80px] md:items-center">
              <span className="font-semibold text-[#583d2f]">{displayAppointmentTime(appointment.startTime)}</span>
              <div>
                <p className="font-semibold">{appointment.bookingReference} / {appointment.customerName}</p>
                <p className="text-[#5f554d]">{appointment.serviceSummary}</p>
              </div>
              <span>{appointment.locationType}</span>
              <span>{appointment.bookingSource}</span>
              <span>{appointment.status}</span>
              <span>{appointment.preferredStaffName ?? (appointment.assignedStaffNames.join(", ") || "Unassigned")}</span>
              <Link href={`/staff/appointments/${appointment.id}`} className="font-semibold text-[#583d2f] underline underline-offset-4">
                View
              </Link>
            </div>
          ))}
          {dashboard.today.length === 0 ? <p className="py-6 text-sm text-[#5f554d]">No appointments scheduled for today.</p> : null}
        </div>
      </section>
    </div>
  );
}
