import Image from "next/image";
import { services } from "@/lib/services/catalog";
import { isNailService, staffMembers } from "@/lib/staff/staff";

export default function StaffTeamPage() {
  const nonNailCount = services.filter((service) => !isNailService(service)).length;

  return (
    <div>
      <h1 className="serif text-4xl font-semibold text-[#583d2f]">Team Management</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {staffMembers.map((member) => (
          <article key={member.id} className="rounded-lg bg-white p-5">
            <Image src={member.profileImage} alt={`${member.displayName}, Spa Therapist`} width={96} height={96} className="h-20 w-20 rounded-full object-cover" />
            <h2 className="mt-4 text-lg font-semibold text-[#583d2f]">{member.displayName}</h2>
            <p className="text-sm text-[#5f554d]">{member.roleLabel}</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt>Active</dt><dd>Yes</dd></div>
              <div className="flex justify-between"><dt>Bookable</dt><dd>Yes</dd></div>
              <div className="flex justify-between"><dt>Home service</dt><dd>Yes</dd></div>
              <div className="flex justify-between"><dt>Assigned services</dt><dd>{nonNailCount} non-nail</dd></div>
              <div className="flex justify-between"><dt>Weekly schedule</dt><dd>Not configured</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
