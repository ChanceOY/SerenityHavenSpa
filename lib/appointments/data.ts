import "server-only";

import { format } from "date-fns";
import type { AppointmentStatus, BookingSource, LocationType, PaymentMethod, TransportFeeStatus } from "@/lib/types";
import { canTransitionAppointmentStatus } from "@/lib/appointments/status";
import { normalizeGhanaPhone } from "@/lib/customers/phone";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const appointmentSelect = `
  id,
  booking_reference,
  booking_source,
  location_type,
  start_time,
  end_time,
  status,
  notes,
  area,
  address,
  landmark,
  location_notes,
  transport_fee_pesewas,
  transport_fee_status,
  created_at,
  customers (
    id,
    full_name,
    phone,
    phone_normalized,
    email
  ),
  appointment_services (
    id,
    service_variant_id,
    quantity,
    unit_price_pesewas,
    service_name_snapshot,
    duration_minutes_snapshot,
    location_type_snapshot
  ),
  appointment_staff (
    assignment_role,
    staff (
      id,
      display_name,
      role_label,
      profile_image_path,
      active,
      bookable,
      home_service_eligible
    )
  ),
  payments (
    id,
    method,
    status,
    amount_pesewas,
    paid_at
  ),
  receipts (
    id,
    receipt_number,
    total_pesewas,
    issued_at
  )
`;

type AppointmentRow = {
  id: string;
  booking_reference: string;
  booking_source: BookingSource;
  location_type: LocationType;
  start_time: string | null;
  end_time: string | null;
  status: AppointmentStatus;
  notes: string | null;
  area: string | null;
  address: string | null;
  landmark: string | null;
  location_notes: string | null;
  transport_fee_pesewas: number | null;
  transport_fee_status: TransportFeeStatus;
  customers: {
    id: string;
    full_name: string;
    phone: string;
    phone_normalized: string;
    email: string | null;
  } | null;
  appointment_services: AppointmentServiceLine[];
  appointment_staff: StaffAssignment[];
  payments: PaymentRow[];
  receipts: ReceiptRow[];
};

export type AppointmentServiceLine = {
  id: string;
  service_variant_id: string;
  quantity: number;
  unit_price_pesewas: number;
  service_name_snapshot: string;
  duration_minutes_snapshot: number | null;
  location_type_snapshot: LocationType;
};

export type StaffAssignment = {
  assignment_role: "PREFERRED" | "ASSIGNED" | "SECONDARY";
  staff: {
    id: string;
    display_name: string;
    role_label: string;
    profile_image_path: string | null;
    active: boolean;
    bookable: boolean;
    home_service_eligible: boolean;
  } | null;
};

export type PaymentRow = {
  id: string;
  method: PaymentMethod;
  status: "PENDING" | "PAID" | "VOID";
  amount_pesewas: number;
  paid_at: string | null;
};

export type ReceiptRow = {
  id: string;
  receipt_number: string;
  total_pesewas: number;
  issued_at: string;
};

export type AppointmentRecord = {
  id: string;
  bookingReference: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  serviceLines: AppointmentServiceLine[];
  serviceSummary: string;
  locationType: LocationType;
  bookingSource: BookingSource;
  status: AppointmentStatus;
  startTime: string | null;
  endTime: string | null;
  preferredStaffName: string | null;
  assignedStaffNames: string[];
  staffAssignments: StaffAssignment[];
  totalPesewas: number;
  notes: string | null;
  area: string | null;
  address: string | null;
  landmark: string | null;
  locationNotes: string | null;
  transportFeePesewas: number | null;
  transportFeeStatus: TransportFeeStatus;
  payments: PaymentRow[];
  receipts: ReceiptRow[];
};

export type AppointmentFilters = {
  filter?: "all" | "pending" | "today" | "upcoming" | "completed";
  search?: string;
};

function getAdminClient() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase service role configuration is required for Serenity Desk persistence.");
  }

  return supabase;
}

function mapAppointment(row: AppointmentRow): AppointmentRecord {
  const serviceLines = row.appointment_services ?? [];
  const staffAssignments = row.appointment_staff ?? [];
  const assignedStaffNames = staffAssignments
    .filter((assignment) => assignment.assignment_role !== "PREFERRED")
    .map((assignment) => assignment.staff?.display_name)
    .filter((name): name is string => Boolean(name));
  const preferredStaffName =
    staffAssignments.find((assignment) => assignment.assignment_role === "PREFERRED")?.staff?.display_name ?? null;

  return {
    id: row.id,
    bookingReference: row.booking_reference,
    customerId: row.customers?.id ?? "",
    customerName: row.customers?.full_name ?? "Unknown customer",
    customerPhone: row.customers?.phone_normalized ?? row.customers?.phone ?? "",
    customerEmail: row.customers?.email ?? null,
    serviceLines,
    serviceSummary: serviceLines.map((line) => line.service_name_snapshot).join(", ") || "No services",
    locationType: row.location_type,
    bookingSource: row.booking_source,
    status: row.status,
    startTime: row.start_time,
    endTime: row.end_time,
    preferredStaffName,
    assignedStaffNames,
    staffAssignments,
    totalPesewas: serviceLines.reduce((sum, line) => sum + line.quantity * line.unit_price_pesewas, 0),
    notes: row.notes,
    area: row.area,
    address: row.address,
    landmark: row.landmark,
    locationNotes: row.location_notes,
    transportFeePesewas: row.transport_fee_pesewas,
    transportFeeStatus: row.transport_fee_status,
    payments: row.payments ?? [],
    receipts: row.receipts ?? [],
  };
}

function accraDayRange(date = new Date()) {
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Accra",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  return {
    day,
    start: `${day}T00:00:00+00:00`,
    end: `${day}T23:59:59.999+00:00`,
  };
}

export async function findOrCreateCustomer(input: { fullName: string; phone: string; email?: string | null }) {
  const supabase = getAdminClient();
  const normalizedPhone = normalizeGhanaPhone(input.phone);
  const { data: existing, error: findError } = await supabase
    .from("customers")
    .select("id, full_name, phone, phone_normalized, email")
    .eq("phone_normalized", normalizedPhone)
    .maybeSingle();

  if (findError) {
    throw findError;
  }

  if (existing) {
    return existing;
  }

  const { data: created, error } = await supabase
    .from("customers")
    .insert({
      full_name: input.fullName.trim(),
      phone: input.phone.trim(),
      phone_normalized: normalizedPhone,
      email: input.email || null,
    })
    .select("id, full_name, phone, phone_normalized, email")
    .single();

  if (error) {
    throw error;
  }

  return created;
}

export async function listAppointments(filters: AppointmentFilters = {}) {
  const supabase = getAdminClient();
  const { start, end } = accraDayRange();
  let query = supabase.from("appointments").select(appointmentSelect).order("start_time", { ascending: true, nullsFirst: false });

  if (filters.filter === "pending") {
    query = query.eq("status", "PENDING");
  } else if (filters.filter === "today") {
    query = query.gte("start_time", start).lte("start_time", end);
  } else if (filters.filter === "upcoming") {
    query = query.in("status", ["PENDING", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS"]).gte("start_time", new Date().toISOString());
  } else if (filters.filter === "completed") {
    query = query.eq("status", "COMPLETED");
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  const appointments = ((data ?? []) as unknown as AppointmentRow[]).map(mapAppointment);
  const search = filters.search?.trim().toLowerCase();

  if (!search) {
    return appointments;
  }

  return appointments.filter((appointment) =>
    [appointment.bookingReference, appointment.customerName, appointment.customerPhone].some((value) => value.toLowerCase().includes(search)),
  );
}

export async function getDashboardData() {
  const appointments = await listAppointments();
  const { start, end } = accraDayRange();
  const today = appointments.filter((appointment) => appointment.startTime && appointment.startTime >= start && appointment.startTime <= end);

  return {
    stats: {
      today: today.length,
      pending: appointments.filter((appointment) => appointment.status === "PENDING").length,
      upcoming: appointments.filter((appointment) => ["PENDING", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS"].includes(appointment.status)).length,
      completed: today.filter((appointment) => appointment.status === "COMPLETED").length,
      walkIns: today.filter((appointment) => appointment.bookingSource === "WALK_IN").length,
    },
    today: today.sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? "")),
  };
}

export async function getAppointment(id: string) {
  const supabase = getAdminClient();
  const { data, error } = await supabase.from("appointments").select(appointmentSelect).eq("id", id).maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapAppointment(data as unknown as AppointmentRow) : null;
}

export async function getReceiptAppointment(receiptId: string) {
  const supabase = getAdminClient();
  const { data: receipt, error } = await supabase.from("receipts").select("appointment_id").eq("id", receiptId).maybeSingle();

  if (error) {
    throw error;
  }

  return receipt?.appointment_id ? getAppointment(receipt.appointment_id) : null;
}

export async function updateAppointmentStatus(id: string, nextStatus: AppointmentStatus) {
  const appointment = await getAppointment(id);

  if (!appointment) {
    throw new Error("Appointment not found.");
  }

  if (!canTransitionAppointmentStatus(appointment.status, nextStatus)) {
    throw new Error(`Cannot change ${appointment.status} to ${nextStatus}.`);
  }

  const supabase = getAdminClient();
  const { error } = await supabase.from("appointments").update({ status: nextStatus, updated_at: new Date().toISOString() }).eq("id", id);

  if (error) {
    throw error;
  }
}

export async function listEligibleStaffForAppointment(appointment: AppointmentRecord) {
  const supabase = getAdminClient();
  const serviceNames = appointment.serviceLines.map((line) => line.service_name_snapshot);
  const hasNailService = serviceNames.some((name) => /manicure|pedicure|nail|acrylic|stickon|gel/i.test(name));

  if (hasNailService) {
    return [];
  }

  let query = supabase
    .from("staff")
    .select("id, display_name, role_label, profile_image_path, active, bookable, home_service_eligible")
    .eq("active", true)
    .eq("bookable", true)
    .order("display_name");

  if (appointment.locationType === "HOME") {
    query = query.eq("home_service_eligible", true);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function assignAppointmentStaff(appointmentId: string, staffIds: string[]) {
  const appointment = await getAppointment(appointmentId);

  if (!appointment) {
    throw new Error("Appointment not found.");
  }

  if (appointment.status === "COMPLETED") {
    throw new Error("Completed appointments cannot be reassigned.");
  }

  const eligibleStaff = await listEligibleStaffForAppointment(appointment);
  const eligibleIds = new Set(eligibleStaff.map((staff) => staff.id));
  const cleanStaffIds = [...new Set(staffIds.filter(Boolean))];

  if (cleanStaffIds.some((staffId) => !eligibleIds.has(staffId))) {
    throw new Error("One or more selected therapists are not eligible for this appointment.");
  }

  const supabase = getAdminClient();
  const { error: deleteError } = await supabase
    .from("appointment_staff")
    .delete()
    .eq("appointment_id", appointmentId)
    .in("assignment_role", ["ASSIGNED", "SECONDARY"]);

  if (deleteError) {
    throw deleteError;
  }

  if (cleanStaffIds.length === 0) {
    return;
  }

  const { error } = await supabase.from("appointment_staff").insert(
    cleanStaffIds.map((staffId, index) => ({
      appointment_id: appointmentId,
      staff_id: staffId,
      assignment_role: index === 0 ? "ASSIGNED" : "SECONDARY",
    })),
  );

  if (error) {
    throw error;
  }
}

export async function addAppointmentServiceLine(appointmentId: string, serviceVariantId: string) {
  const supabase = getAdminClient();
  const { data: variant, error: variantError } = await supabase
    .from("service_variants")
    .select("id, location_type, duration_minutes, price_pesewas, services!inner(name)")
    .eq("id", serviceVariantId)
    .eq("active", true)
    .single();

  if (variantError) {
    throw variantError;
  }

  const service = Array.isArray(variant.services) ? variant.services[0] : variant.services;
  const { error } = await supabase.from("appointment_services").insert({
    appointment_id: appointmentId,
    service_variant_id: variant.id,
    quantity: 1,
    unit_price_pesewas: variant.price_pesewas,
    service_name_snapshot: service.name,
    duration_minutes_snapshot: variant.duration_minutes,
    location_type_snapshot: variant.location_type,
  });

  if (error) {
    throw error;
  }
}

export async function completeCheckout(appointmentId: string, method: PaymentMethod) {
  const appointment = await getAppointment(appointmentId);

  if (!appointment) {
    throw new Error("Appointment not found.");
  }

  if (["CANCELLED", "NO_SHOW", "COMPLETED"].includes(appointment.status)) {
    throw new Error("Checkout is not available for this appointment status.");
  }

  if (appointment.receipts[0]) {
    return appointment.receipts[0].id;
  }

  const supabase = getAdminClient();
  const totalPesewas = appointment.totalPesewas + (appointment.transportFeePesewas ?? 0);
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      appointment_id: appointmentId,
      method,
      status: "PAID",
      amount_pesewas: totalPesewas,
      paid_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (paymentError) {
    throw paymentError;
  }

  const { data: receiptNumber, error: receiptNumberError } = await supabase.rpc("next_receipt_number");

  if (receiptNumberError) {
    throw receiptNumberError;
  }

  const { data: receipt, error: receiptError } = await supabase
    .from("receipts")
    .insert({
      payment_id: payment.id,
      appointment_id: appointmentId,
      receipt_number: receiptNumber,
      total_pesewas: totalPesewas,
    })
    .select("id")
    .single();

  if (receiptError) {
    throw receiptError;
  }

  const { error: appointmentError } = await supabase
    .from("appointments")
    .update({ status: "COMPLETED", updated_at: new Date().toISOString() })
    .eq("id", appointmentId);

  if (appointmentError) {
    throw appointmentError;
  }

  return receipt.id;
}

export async function createAppointmentWithLine(input: {
  customerId: string;
  bookingSource: BookingSource;
  locationType: LocationType;
  status: AppointmentStatus;
  startTime: string;
  notes?: string | null;
  area?: string | null;
  address?: string | null;
  landmark?: string | null;
  locationNotes?: string | null;
  serviceVariantId: string;
  preferredStaffId?: string | null;
  assignedStaffIds?: string[];
}) {
  const supabase = getAdminClient();
  const { data: referenceData, error: referenceError } = await supabase.rpc("next_booking_reference");

  if (referenceError) {
    throw referenceError;
  }

  const { data: variant, error: variantError } = await supabase
    .from("service_variants")
    .select("id, location_type, duration_minutes, price_pesewas, services!inner(id, name, service_categories!inner(name))")
    .eq("id", input.serviceVariantId)
    .eq("active", true)
    .single();

  if (variantError) {
    throw variantError;
  }

  const startTime = new Date(input.startTime);
  const endTime = variant.duration_minutes ? new Date(startTime.getTime() + variant.duration_minutes * 60_000).toISOString() : null;
  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments")
    .insert({
      booking_reference: referenceData,
      customer_id: input.customerId,
      booking_source: input.bookingSource,
      location_type: input.locationType,
      start_time: startTime.toISOString(),
      end_time: endTime,
      status: input.status,
      notes: input.notes || null,
      area: input.area || null,
      address: input.address || null,
      landmark: input.landmark || null,
      location_notes: input.locationNotes || null,
      transport_fee_status: input.locationType === "HOME" ? "PENDING_CONFIRMATION" : "NOT_REQUIRED",
    })
    .select("id")
    .single();

  if (appointmentError) {
    throw appointmentError;
  }

  const service = Array.isArray(variant.services) ? variant.services[0] : variant.services;
  const { error: lineError } = await supabase.from("appointment_services").insert({
    appointment_id: appointment.id,
    service_variant_id: variant.id,
    quantity: 1,
    unit_price_pesewas: variant.price_pesewas,
    service_name_snapshot: service.name,
    duration_minutes_snapshot: variant.duration_minutes,
    location_type_snapshot: variant.location_type,
  });

  if (lineError) {
    throw lineError;
  }

  const staffRows = [
    ...(input.preferredStaffId ? [{ appointment_id: appointment.id, staff_id: input.preferredStaffId, assignment_role: "PREFERRED" }] : []),
    ...(input.assignedStaffIds ?? []).map((staffId, index) => ({
      appointment_id: appointment.id,
      staff_id: staffId,
      assignment_role: index === 0 ? "ASSIGNED" : "SECONDARY",
    })),
  ];

  if (staffRows.length > 0) {
    const { error: staffError } = await supabase.from("appointment_staff").insert(staffRows);

    if (staffError) {
      throw staffError;
    }
  }

  return getAppointment(appointment.id);
}

export function combineAccraDateTime(date: string, time: string) {
  return `${date}T${time}:00+00:00`;
}

export function displayAppointmentTime(value: string | null) {
  return value ? format(new Date(value), "HH:mm") : "Request";
}
