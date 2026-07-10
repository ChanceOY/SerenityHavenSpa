import { services } from "@/lib/services/catalog";
import { staffMembers } from "@/lib/staff/staff";

export default function NewWalkInPage() {
  return (
    <div>
      <h1 className="serif text-4xl font-semibold text-[#583d2f]">New Walk-In</h1>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg bg-white p-5">
          <h2 className="font-semibold text-[#583d2f]">Customer</h2>
          <input className="mt-4 w-full rounded-md border px-4 py-3" placeholder="Search by phone" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input className="rounded-md border px-4 py-3" placeholder="Customer name" />
            <input className="rounded-md border px-4 py-3" placeholder="Phone" />
          </div>
        </section>
        <section className="rounded-lg bg-white p-5">
          <h2 className="font-semibold text-[#583d2f]">Services and Staff</h2>
          <select className="mt-4 w-full rounded-md border px-4 py-3">
            {services.map((service) => (
              <option key={service.id}>{service.name}</option>
            ))}
          </select>
          <select className="mt-4 w-full rounded-md border px-4 py-3">
            <option>Assign later</option>
            {staffMembers.map((staff) => (
              <option key={staff.id}>{staff.displayName}</option>
            ))}
          </select>
          <button type="button" className="mt-5 rounded-full bg-[#583d2f] px-5 py-3 text-sm font-semibold text-white">
            Create Walk-In Appointment
          </button>
        </section>
      </div>
    </div>
  );
}
