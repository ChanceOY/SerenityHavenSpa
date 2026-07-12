"use server";

import { createOnlineBooking } from "@/lib/bookings/create-booking";
import { bookingRequestSchema, type BookingRequestInput } from "@/lib/validation/booking";

export type BookingActionState =
  | {
      ok: true;
      bookingReference: string;
      status: "PENDING";
      serviceName: string;
      durationMinutes: number | null;
      pricePesewas: number;
      preferredStaffName: string | null;
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

  try {
    const appointment = await createOnlineBooking(parsed.data);
    const firstLine = appointment.serviceLines[0];

    return {
      ok: true,
      bookingReference: appointment.bookingReference,
      status: "PENDING",
      serviceName: firstLine?.service_name_snapshot ?? appointment.serviceSummary,
      durationMinutes: firstLine?.duration_minutes_snapshot ?? null,
      pricePesewas: appointment.totalPesewas,
      preferredStaffName: appointment.preferredStaffName,
      data: parsed.data,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to submit booking request.",
    };
  }
}
