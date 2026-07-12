import "server-only";

import { createAppointmentWithLine, combineAccraDateTime, findOrCreateCustomer } from "@/lib/appointments/data";
import { getServiceById, getVariantById } from "@/lib/services/catalog";
import { databaseVariantMatchesCatalogSelection, resolveCatalogBookingSelection, validatePreferredStaffSelection } from "@/lib/bookings/validation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { BookingRequestInput } from "@/lib/validation/booking";

export async function createOnlineBooking(input: BookingRequestInput) {
  const { service, variant } = resolveCatalogBookingSelection({
    service: getServiceById(input.serviceId),
    variant: getVariantById(input.variantId),
    locationType: input.locationType,
  });

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase service role configuration is required to submit booking requests.");
  }

  let variantQuery = supabase
    .from("service_variants")
    .select("id, location_type, duration_minutes, price_pesewas, active, services!inner(name, active)")
    .eq("location_type", variant.locationType)
    .eq("price_pesewas", variant.pricePesewas)
    .eq("active", true)
    .eq("services.active", true)
    .eq("services.name", service.name)
    .limit(1);

  variantQuery = variant.durationMinutes === null ? variantQuery.is("duration_minutes", null) : variantQuery.eq("duration_minutes", variant.durationMinutes);
  const { data: databaseVariants, error: variantError } = await variantQuery;
  const databaseVariant = databaseVariants?.[0];

  if (variantError || !databaseVariant) {
    throw new Error("Unable to verify selected service pricing.");
  }

  const databaseService = Array.isArray(databaseVariant.services) ? databaseVariant.services[0] : databaseVariant.services;

  if (
    !databaseVariantMatchesCatalogSelection({
      serviceName: databaseService.name,
      serviceActive: databaseService.active,
      variantActive: databaseVariant.active,
      locationType: databaseVariant.location_type,
      durationMinutes: databaseVariant.duration_minutes,
      pricePesewas: databaseVariant.price_pesewas,
      selectedService: service,
      selectedVariant: variant,
    })
  ) {
    throw new Error("Unable to verify selected service pricing.");
  }

  let preferredStaffId: string | null = null;
  const preferredStaffInput = input.preferredStaffId && input.preferredStaffId !== "no-preference" ? input.preferredStaffId : null;
  const preferredStaff = validatePreferredStaffSelection({
    service,
    locationType: input.locationType,
    preferredStaffId: preferredStaffInput,
  });

  if (preferredStaff) {
    const { data: databaseStaff, error: staffError } = await supabase
      .from("staff")
      .select("id")
      .eq("display_name", preferredStaff.displayName)
      .eq("active", true)
      .eq("bookable", true)
      .maybeSingle();

    if (staffError) {
      throw staffError;
    }

    preferredStaffId = databaseStaff?.id ?? null;
  }

  const customer = await findOrCreateCustomer({
    fullName: input.customerName,
    phone: input.customerPhone,
    email: input.customerEmail || null,
  });

  const appointment = await createAppointmentWithLine({
    customerId: customer.id,
    bookingSource: "ONLINE",
    locationType: input.locationType,
    status: "PENDING",
    startTime: combineAccraDateTime(input.requestedDate, input.requestedTime),
    notes: input.notes,
    area: input.locationType === "HOME" ? input.area : null,
    address: input.locationType === "HOME" ? input.address : null,
    landmark: input.locationType === "HOME" ? input.landmark : null,
    locationNotes: input.locationType === "HOME" ? input.locationNotes : null,
    serviceVariantId: databaseVariant.id,
    preferredStaffId,
  });

  if (!appointment) {
    throw new Error("Unable to load created booking request.");
  }

  return appointment;
}
