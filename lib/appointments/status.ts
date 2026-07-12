import type { AppointmentStatus } from "@/lib/types";

const transitions: Record<AppointmentStatus, AppointmentStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["CHECKED_IN", "CANCELLED", "NO_SHOW"],
  CHECKED_IN: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: [],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

export function getAllowedStatusTransitions(status: AppointmentStatus): AppointmentStatus[] {
  return transitions[status];
}

export function canTransitionAppointmentStatus(from: AppointmentStatus, to: AppointmentStatus): boolean {
  return transitions[from].includes(to);
}
