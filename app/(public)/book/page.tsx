import { BookingFlow } from "@/components/booking/booking-flow";
import type { LocationType } from "@/lib/types";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string; service?: string }>;
}) {
  const params = await searchParams;
  const initialLocation: LocationType | undefined = params.location === "SPA" || params.location === "HOME" ? params.location : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9f6f52]">Book Now</p>
        <h1 className="serif mt-3 text-5xl font-semibold text-[#583d2f]">Create a Serenity Haven booking request.</h1>
        <p className="mt-5 leading-7 text-[#5f554d]">
          Because staff schedules are not confirmed yet, V1 submissions are treated as booking requests pending confirmation unless
          availability can be calculated from configured schedules.
        </p>
      </div>
      <div className="mt-10">
        <BookingFlow initialLocation={initialLocation} initialServiceId={params.service} />
      </div>
    </div>
  );
}
