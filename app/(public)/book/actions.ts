"use server";

import { createBookingReference } from "@/lib/booking/reference";
import { bookingRequestSchema, type BookingRequestInput } from "@/lib/validation/booking";

export type BookingActionState =
  | {
      ok: true;
      bookingReference: string;
      data: BookingRequestInput;
    }
  | {
      ok: false;
      message: string;
    };

export async function submitBookingRequest(input: BookingRequestInput): Promise<BookingActionState> {
  const parsed = bookingRequestSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Please review your booking request.",
    };
  }

  return {
    ok: true,
    bookingReference: createBookingReference(parsed.data.locationType === "HOME" ? "SHS-HOME" : "SHS-REQ"),
    data: parsed.data,
  };
}
