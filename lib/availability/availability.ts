import { addMinutes, format, isBefore, parseISO } from "date-fns";
import type { AppointmentSummary, AvailabilityWindow, ServiceVariant, StaffMember } from "@/lib/types";

export type AvailabilityResult =
  | {
      mode: "REQUEST_ONLY";
      reason: string;
      slots: [];
    }
  | {
      mode: "SLOTS";
      reason: string;
      slots: string[];
    };

const blockingStatuses = new Set(["PENDING", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS"]);

export function calculateAvailability({
  staff,
  variant,
  dateIso,
  availability,
  appointments,
}: {
  staff: StaffMember[];
  variant: ServiceVariant;
  dateIso: string;
  availability: AvailabilityWindow[];
  appointments: AppointmentSummary[];
}): AvailabilityResult {
  if (variant.durationMinutes === null) {
    return {
      mode: "REQUEST_ONLY",
      reason: "This service does not yet have a confirmed duration, so staff will confirm timing manually.",
      slots: [],
    };
  }

  if (staff.length === 0) {
    return {
      mode: "REQUEST_ONLY",
      reason: "No automatically assignable staff are configured for this service yet.",
      slots: [],
    };
  }

  const date = parseISO(`${dateIso}T00:00:00`);
  const dayOfWeek = date.getDay();
  const staffIds = new Set(staff.map((member) => member.id));
  const workingWindows = availability.filter(
    (window) => window.active && staffIds.has(window.staffId) && window.dayOfWeek === dayOfWeek,
  );

  if (workingWindows.length === 0) {
    return {
      mode: "REQUEST_ONLY",
      reason: "Therapist schedules have not been configured for this date, so this will be submitted as a request.",
      slots: [],
    };
  }

  const slots = new Set<string>();
  for (const window of workingWindows) {
    const [startHour, startMinute] = window.startTime.split(":").map(Number);
    const [endHour, endMinute] = window.endTime.split(":").map(Number);
    let cursor = parseISO(`${dateIso}T${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}:00`);
    const end = parseISO(`${dateIso}T${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}:00`);

    while (!isBefore(end, addMinutes(cursor, variant.durationMinutes))) {
      const candidateEnd = addMinutes(cursor, variant.durationMinutes);
      const overlaps = appointments.some((appointment) => {
        if (!appointment.startTime || !appointment.endTime || !blockingStatuses.has(appointment.status)) {
          return false;
        }

        const existingStart = parseISO(appointment.startTime);
        const existingEnd = parseISO(appointment.endTime);
        return cursor < existingEnd && candidateEnd > existingStart;
      });

      if (!overlaps) {
        slots.add(format(cursor, "HH:mm"));
      }

      cursor = addMinutes(cursor, 30);
    }
  }

  return slots.size > 0
    ? {
        mode: "SLOTS",
        reason: "Available slots are based on configured weekly schedules and existing non-cancelled appointments.",
        slots: Array.from(slots).sort(),
      }
    : {
        mode: "REQUEST_ONLY",
        reason: "No open slot is currently available, but staff can review your preferred time.",
        slots: [],
      };
}
