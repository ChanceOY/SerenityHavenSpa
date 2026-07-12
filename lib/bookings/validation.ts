import { getEligibleStaff, requiresStaffSelection } from "../staff/staff.ts";
import type { LocationType, Service, ServiceVariant } from "../types.ts";

export type CatalogBookingSelection = {
  service: Service;
  variant: ServiceVariant;
};

export function resolveCatalogBookingSelection({
  service,
  variant,
  locationType,
}: {
  service: Service | undefined;
  variant: ServiceVariant | undefined;
  locationType: LocationType;
}): CatalogBookingSelection {
  if (!service || !variant || variant.serviceId !== service.id || variant.locationType !== locationType) {
    throw new Error("Selected service is no longer available.");
  }

  return { service, variant };
}

export function databaseVariantMatchesCatalogSelection({
  serviceName,
  serviceActive,
  variantActive,
  locationType,
  durationMinutes,
  pricePesewas,
  selectedService,
  selectedVariant,
}: {
  serviceName: string;
  serviceActive: boolean;
  variantActive: boolean;
  locationType: LocationType;
  durationMinutes: number | null;
  pricePesewas: number;
  selectedService: Service;
  selectedVariant: ServiceVariant;
}) {
  return (
    serviceActive &&
    variantActive &&
    serviceName === selectedService.name &&
    locationType === selectedVariant.locationType &&
    durationMinutes === selectedVariant.durationMinutes &&
    pricePesewas === selectedVariant.pricePesewas
  );
}

export function validatePreferredStaffSelection({
  service,
  locationType,
  preferredStaffId,
}: {
  service: Service;
  locationType: LocationType;
  preferredStaffId: string | null;
}) {
  if (!preferredStaffId) {
    return null;
  }

  if (!requiresStaffSelection(service)) {
    throw new Error("Therapist selection is not available for this service.");
  }

  const staff = getEligibleStaff(service, locationType).find((member) => member.id === preferredStaffId);

  if (!staff) {
    throw new Error("Selected therapist is not eligible for this service.");
  }

  return staff;
}
