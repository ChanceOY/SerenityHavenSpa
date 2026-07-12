"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addAppointmentServiceLine, completeCheckout } from "@/lib/appointments/data";
import { requireStaffSession } from "@/lib/staff/auth";
import type { PaymentMethod } from "@/lib/types";

export async function addCheckoutService(appointmentId: string, formData: FormData) {
  await requireStaffSession();
  const variantId = String(formData.get("serviceVariantId") ?? "");

  if (variantId) {
    await addAppointmentServiceLine(appointmentId, variantId);
  }

  revalidatePath(`/staff/appointments/${appointmentId}/checkout`);
}

export async function completeAppointmentCheckout(appointmentId: string, formData: FormData) {
  await requireStaffSession();
  const method = String(formData.get("paymentMethod") ?? "") as PaymentMethod;
  const allowed: PaymentMethod[] = ["CASH", "MOBILE_MONEY", "CARD", "BANK_TRANSFER"];

  if (!allowed.includes(method)) {
    throw new Error("Select a valid payment method.");
  }

  const receiptId = await completeCheckout(appointmentId, method);
  revalidatePath(`/staff/appointments/${appointmentId}`);
  revalidatePath("/staff/dashboard");
  redirect(`/staff/receipts/${receiptId}`);
}
