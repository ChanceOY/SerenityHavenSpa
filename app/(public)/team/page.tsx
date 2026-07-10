import Image from "next/image";
import { staffMembers } from "@/lib/staff/staff";

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9f6f52]">Our Team</p>
        <h1 className="serif mt-3 text-5xl font-semibold text-[#583d2f]">The Serenity Haven therapists.</h1>
        <p className="mt-5 text-base leading-7 text-[#5f554d]">Current staff are listed with the shared public role label confirmed for V1.</p>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {staffMembers.map((member) => (
          <article key={member.id}>
            <Image
              src={member.profileImage}
              alt={`${member.displayName}, Spa Therapist`}
              width={420}
              height={520}
              className="aspect-[4/5] w-full rounded-lg object-cover"
            />
            <h2 className="mt-4 text-lg font-semibold text-[#583d2f]">{member.displayName}</h2>
            <p className="text-sm text-[#5f554d]">{member.roleLabel}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
