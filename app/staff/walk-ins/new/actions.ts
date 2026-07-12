"use server";

import { redirect } from "next/navigation";
import { combineAccraDateTime, createAppointmentWithLine, findOrCreateCustomer } from "@/lib/appointments/data";
import { requireStaffSession } from "@/lib/staff/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { AppointmentStatus, BookingSource } from "@/lib/types";

export async function createWalkInAppointment(formData: FormData) {
  await requireStaffSession();

  const appointmentMode = String(formData.get("appointmentMode") ?? "walk-in-now");
  const customerName = String(formData.get("customerName") ?? "");
  const customerPhone = String(formData.get("customerPhone") ?? "");
  const customerEmail = String(formData.get("customerEmail") ?? "");
  const serviceVariantId = String(formData.get("serviceVariantId") ?? "");
  const appointmentDate = String(formData.get("appointmentDate") ?? "");
  const appointmentTime = String(formData.get("appointmentTime") ?? "");
  const staffIds = formData.getAll("staffIds").map(String).filter(Boolean);

  if (!customerName.trim() || !customerPhone.trim() || !serviceVariantId) {
    throw new Error("Customer name, phone and service are required.");
  }

  if (appointmentMode !== "walk-in-now" && appointmentMode !== "schedule-later") {
    throw new Error("Select whether this is a walk-in now or scheduled appointment.");
  }

  if (appointmentMode === "schedule-later" && (!appointmentDate || !appointmentTime)) {
    throw new Error("Appointment date and time are required when scheduling for later.");
  }

  await validateManualAppointmentSelection(serviceVariantId, staffIds);

  const customer = await findOrCreateCustomer({
    fullName: customerName,
    phone: customerPhone,
    email: customerEmail || null,
  });
  const bookingSource: BookingSource = appointmentMode === "walk-in-now" ? "WALK_IN" : "STAFF";
  const status: AppointmentStatus = appointmentMode === "walk-in-now" ? "CHECKED_IN" : "CONFIRMED";
  const startTime = appointmentMode === "walk-in-now" ? new Date().toISOString() : combineAccraDateTime(appointmentDate, appointmentTime);

  const appointment = await createAppointmentWithLine({
    customerId: customer.id,
    bookingSource,
    locationType: "SPA",
    status,
    startTime,
    serviceVariantId,
    assignedStaffIds: staffIds,
  });

  if (!appointment) {
    throw new Error("Unable to create walk-in appointment.");
  }

  redirect(`/staff/appointments/${appointment.id}`);
}

async function validateManualAppointmentSelection(serviceVariantId: string, staffIds: string[]) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase service role configuration is required for manual appointment creation.");
  }

  const { data: variant, error: variantError } = await supabase
    .from("service_variants")
    .select("id, services!inner(id, name, service_categories!inner(name))")
    .eq("id", serviceVariantId)
    .eq("active", true)
    .eq("location_type", "SPA")
    .single();

  if (variantError || !variant) {
    throw new Error("Selected service variant is not active for in-spa appointments.");
  }

  const service = Array.isArray(variant.services) ? variant.services[0] : variant.services;
  const category = Array.isArray(service.service_categories) ? service.service_categories[0] : service.service_categories;
  const uniqueStaffIds = [...new Set(staffIds)];

  if (category.name === "Nails") {
    if (uniqueStaffIds.length > 0) {
      throw new Error("Nail appointments must remain unassigned until a nail technician is added.");
    }

    return;
  }

  if (uniqueStaffIds.length === 0) {
    return;
  }

  const { data: eligibleStaff, error: staffError } = await supabase
    .from("staff")
    .select("id, staff_services!inner(service_id)")
    .eq("active", true)
    .eq("bookable", true)
    .eq("staff_services.service_id", service.id)
    .in("id", uniqueStaffIds);

  if (staffError) {
    throw staffError;
  }

  const eligibleIds = new Set((eligibleStaff ?? []).map((staff) => staff.id));

  if (uniqueStaffIds.some((staffId) => !eligibleIds.has(staffId))) {
    throw new Error("One or more selected therapists are not eligible for this service.");
  }
}
