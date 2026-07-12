import { ManualAppointmentForm } from "@/components/staff/manual-appointment-form";
import { listServiceVariantOptions } from "@/lib/services/data";
import { listBookableStaff } from "@/lib/staff/data";
import { createWalkInAppointment } from "./actions";

export default async function NewWalkInPage() {
  const [variants, staffMembers] = await Promise.all([listServiceVariantOptions("SPA"), listBookableStaff()]);

  return (
    <div>
      <h1 className="serif text-4xl font-semibold text-[#583d2f]">New Appointment</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5f554d]">
        Create a checked-in walk-in for a customer who is here now, or schedule a confirmed in-spa appointment for later.
      </p>
      <ManualAppointmentForm variants={variants} staffMembers={staffMembers} action={createWalkInAppointment} />
    </div>
  );
}
