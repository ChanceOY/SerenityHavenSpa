import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllowedStatusTransitions } from "@/lib/appointments/status";
import { displayAppointmentTime, getAppointment, listEligibleStaffForAppointment } from "@/lib/appointments/data";
import { formatDuration, formatMoney } from "@/lib/services/catalog";
import { changeAppointmentStatus, saveAppointmentStaff } from "./actions";

export default async function StaffAppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const appointment = await getAppointment(id);

  if (!appointment) {
    notFound();
  }

  const transitions = getAllowedStatusTransitions(appointment.status);
  const eligibleStaff = await listEligibleStaffForAppointment(appointment);
  const assignedIds = new Set(
    appointment.staffAssignments
      .filter((assignment) => assignment.assignment_role !== "PREFERRED")
      .map((assignment) => assignment.staff?.id)
      .filter(Boolean),
  );

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
          <Info label="Requested time" value={`${appointment.startTime ? new Date(appointment.startTime).toLocaleDateString("en-GH") : "Pending"} ${displayAppointmentTime(appointment.startTime)}`} />
          <Info label="Location" value={appointment.locationType} />
          <Info label="Booking source" value={appointment.bookingSource} />
          <Info label="Total" value={formatMoney(appointment.totalPesewas)} />
          <Info label="Preferred staff" value={appointment.preferredStaffName ?? "No preference"} />
          <Info label="Assigned staff" value={appointment.assignedStaffNames.join(", ") || "Not assigned"} />
          <Info label="Transport fee" value={`${appointment.transportFeeStatus}${appointment.transportFeePesewas ? ` / ${formatMoney(appointment.transportFeePesewas)}` : ""}`} />
          <Info label="Notes" value={appointment.notes ?? "None"} />
        </dl>
        <section className="mt-6 rounded-lg bg-[#fbf7f0] p-4">
          <h2 className="font-semibold text-[#583d2f]">Service Line Items</h2>
          <div className="mt-3 divide-y divide-[#583d2f]/10">
            {appointment.serviceLines.map((line) => (
              <div key={line.id} className="flex justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-semibold">{line.service_name_snapshot}</p>
                  <p className="text-[#5f554d]">{formatDuration(line.duration_minutes_snapshot) || "Duration pending"} / Qty {line.quantity}</p>
                </div>
                <strong>{formatMoney(line.quantity * line.unit_price_pesewas)}</strong>
              </div>
            ))}
          </div>
        </section>
        {appointment.locationType === "HOME" ? (
          <div className="mt-6 rounded-lg bg-[#fbf7f0] p-4 text-sm">
            <h2 className="font-semibold text-[#583d2f]">Home Service Information</h2>
            <p className="mt-2">Area: {appointment.area ?? "Pending"}</p>
            <p>Address: {appointment.address ?? "Pending"}</p>
            <p>Landmark: {appointment.landmark ?? "Pending"}</p>
          </div>
        ) : null}
        <form action={saveAppointmentStaff.bind(null, appointment.id)} className="mt-6 rounded-lg bg-[#fbf7f0] p-4">
          <h2 className="font-semibold text-[#583d2f]">Assign Therapists</h2>
          {eligibleStaff.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {eligibleStaff.map((staff) => (
                <label key={staff.id} className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm">
                  <input name="staffIds" type="checkbox" value={staff.id} defaultChecked={assignedIds.has(staff.id)} />
                  {staff.display_name}
                </label>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-[#5f554d]">No eligible therapists can be assigned to this service yet.</p>
          )}
          {appointment.status !== "COMPLETED" ? (
            <button className="mt-4 rounded-full bg-[#583d2f] px-4 py-2 text-sm font-semibold text-white">Save Assignment</button>
          ) : null}
        </form>
        <div className="mt-6 flex flex-wrap gap-2">
          {transitions.map((transition) => (
            <form key={transition} action={changeAppointmentStatus.bind(null, appointment.id, transition)}>
              <button className="rounded-full bg-[#583d2f] px-4 py-2 text-sm font-semibold text-white">
              {transition.replace(/_/g, " ")}
              </button>
            </form>
          ))}
          {appointment.status === "IN_PROGRESS" ? (
          <Link href={`/staff/appointments/${appointment.id}/checkout`} className="rounded-full border border-[#583d2f]/20 px-4 py-2 text-sm font-semibold text-[#583d2f]">
            Checkout
          </Link>
          ) : null}
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
