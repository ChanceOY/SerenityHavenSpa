import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllowedStatusTransitions } from "@/lib/appointments/status";
import { sampleAppointments } from "@/lib/appointments/sample-data";
import { formatMoney } from "@/lib/services/catalog";

export default async function StaffAppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const appointment = sampleAppointments.find((item) => item.id === id);

  if (!appointment) {
    notFound();
  }

  const transitions = getAllowedStatusTransitions(appointment.status);

  return (
    <div>
      <Link href="/staff/appointments" className="text-sm font-semibold text-[#583d2f] underline underline-offset-4">
        Back to appointments
      </Link>
      <div className="mt-5 rounded-lg bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-[#5f554d]">{appointment.bookingReference}</p>
            <h1 className="serif text-4xl font-semibold text-[#583d2f]">{appointment.customerName}</h1>
          </div>
          <span className="rounded-full bg-[#d7dfcf] px-4 py-2 text-sm font-semibold text-[#583d2f]">{appointment.status}</span>
        </div>
        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <Info label="Phone" value={appointment.customerPhone} />
          <Info label="Email" value={appointment.customerEmail ?? "Not supplied"} />
          <Info label="Service" value={appointment.serviceSummary} />
          <Info label="Location" value={appointment.locationType} />
          <Info label="Booking source" value={appointment.bookingSource} />
          <Info label="Total" value={formatMoney(appointment.totalPesewas)} />
          <Info label="Preferred staff" value={appointment.preferredStaffName ?? "No preference"} />
          <Info label="Assigned staff" value={appointment.assignedStaffNames.join(", ") || "Not assigned"} />
          <Info label="Transport fee" value={appointment.transportFeeStatus} />
        </dl>
        {appointment.locationType === "HOME" ? (
          <div className="mt-6 rounded-lg bg-[#fbf7f0] p-4 text-sm">
            <h2 className="font-semibold text-[#583d2f]">Home Service Information</h2>
            <p className="mt-2">Area: {appointment.area ?? "Pending"}</p>
            <p>Address: {appointment.address ?? "Pending"}</p>
            <p>Landmark: {appointment.landmark ?? "Pending"}</p>
          </div>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-2">
          {transitions.map((transition) => (
            <button key={transition} type="button" className="rounded-full bg-[#583d2f] px-4 py-2 text-sm font-semibold text-white">
              {transition.replace(/_/g, " ")}
            </button>
          ))}
          <Link href="/staff/receipts/demo" className="rounded-full border border-[#583d2f]/20 px-4 py-2 text-sm font-semibold text-[#583d2f]">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[#fbf7f0] p-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[#62705a]">{label}</dt>
      <dd className="mt-2 font-semibold text-[#583d2f]">{value}</dd>
    </div>
  );
}
