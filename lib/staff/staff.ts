import type { LocationType, Service, StaffMember } from "@/lib/types";

const staffNames = [
  "Ruby",
  "Anita",
  "Fafali",
  "Millicent",
  "Bridget",
  "Christelle",
  "Judith",
  "Elizabeth",
  "Sedoine",
] as const;

export const staffMembers: StaffMember[] = staffNames.map((name) => ({
  id: name.toLowerCase(),
  displayName: name,
  roleLabel: "Spa Therapist",
  profileImage: `/therapists/${name.toLowerCase()}.jpeg`,
  active: true,
  bookable: true,
  homeServiceEligible: true,
}));

export function isNailService(service: Service): boolean {
  return service.category === "Nails";
}

export function requiresStaffSelection(service: Service): boolean {
  return service.category !== "Nails" && service.category !== "Couples Massage";
}

export function getEligibleStaff(service: Service, locationType: LocationType): StaffMember[] {
  if (isNailService(service)) {
    return [];
  }

  return staffMembers.filter((staff) => {
    if (!staff.active || !staff.bookable) {
      return false;
    }

    if (locationType === "HOME" && !staff.homeServiceEligible) {
      return false;
    }

    return true;
  });
}

export function staffSelectionNote(service: Service): string {
  if (service.category === "Nails") {
    return "Nail requests are accepted without therapist selection until the nail technician is added.";
  }

  if (service.category === "Couples Massage") {
    return "Serenity Haven will assign the appropriate therapists for couples bookings.";
  }

  if (service.category === "Four Hands Massage") {
    return "Choose one preferred therapist if you like. A second therapist will be assigned by Serenity Haven.";
  }

  return "Choose a preferred therapist or select No Preference.";
}
