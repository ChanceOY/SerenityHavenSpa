import Link from "next/link";
import { format } from "date-fns";
import { sampleAppointments } from "@/lib/appointments/sample-data";

export default function StaffDashboardPage() {
  const stats = [
    ["Today", sampleAppointments.length],
    ["Pending Requests", sampleAppointments.filter((appointment) => appointment.status === "PENDING").length],
    ["Upcoming", sampleAppointments.filter((appointment) => appointment.status === "CONFIRMED").length],
    ["Completed", sampleAppointments.filter((appointment) => appointment.status === "COMPLETED").length],
    ["Walk-Ins", sampleAppointments.filter((appointment) => appointment.bookingSource === "WALK_IN").length],
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
          {sampleAppointments.map((appointment) => (
            <div key={appointment.id} className="grid gap-3 py-4 text-sm md:grid-cols-[90px_1fr_110px_100px_80px] md:items-center">
              <span className="font-semibold text-[#583d2f]">{appointment.startTime ? format(new Date(appointment.startTime), "HH:mm") : "Request"}</span>
              <div>
                <p className="font-semibold">{appointment.customerName}</p>
                <p className="text-[#5f554d]">{appointment.serviceSummary}</p>
              </div>
              <span>{appointment.locationType}</span>
              <span>{appointment.status}</span>
              <Link href={`/staff/appointments/${appointment.id}`} className="font-semibold text-[#583d2f] underline underline-offset-4">
                View
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
