"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assignAppointmentStaff, updateAppointmentStatus } from "@/lib/appointments/data";
import { requireStaffSession } from "@/lib/staff/auth";
import type { AppointmentStatus } from "@/lib/types";

export async function changeAppointmentStatus(appointmentId: string, status: AppointmentStatus) {
  await requireStaffSession();
  await updateAppointmentStatus(appointmentId, status);
  revalidatePath(`/staff/appointments/${appointmentId}`);
  revalidatePath("/staff/appointments");
  revalidatePath("/staff/dashboard");
}

export async function saveAppointmentStaff(appointmentId: string, formData: FormData) {
  await requireStaffSession();
  const staffIds = formData.getAll("staffIds").map(String);
  await assignAppointmentStaff(appointmentId, staffIds);
  revalidatePath(`/staff/appointments/${appointmentId}`);
}

export async function openCheckout(appointmentId: string) {
  await requireStaffSession();
  redirect(`/staff/appointments/${appointmentId}/checkout`);
}
