export type LocationType = "SPA" | "HOME";

export type ServiceCategoryName =
  | "Massage"
  | "Four Hands Massage"
  | "Signature Massage Combos"
  | "Couples Massage"
  | "Focused Massage"
  | "Nails"
  | "Facials"
  | "Waxing"
  | "Body Treatments";

export type BookingSource = "ONLINE" | "WALK_IN" | "STAFF";

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type TransportFeeStatus = "NOT_REQUIRED" | "PENDING_CONFIRMATION" | "CONFIRMED" | "PAID";

export type PaymentMethod = "CASH" | "MOBILE_MONEY" | "CARD" | "BANK_TRANSFER";

export type ServiceVariant = {
  id: string;
  serviceId: string;
  locationType: LocationType;
  durationMinutes: number | null;
  pricePesewas: number;
};

export type Service = {
  id: string;
  name: string;
  category: ServiceCategoryName;
  description?: string;
  active: boolean;
  variants: ServiceVariant[];
};

export type StaffMember = {
  id: string;
  displayName: string;
  roleLabel: "Spa Therapist";
  profileImage: string;
  active: boolean;
  bookable: boolean;
  homeServiceEligible: boolean;
};

export type AvailabilityWindow = {
  staffId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  active: boolean;
};

export type AppointmentSummary = {
  id: string;
  bookingReference: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceSummary: string;
  locationType: LocationType;
  bookingSource: BookingSource;
  status: AppointmentStatus;
  startTime: string | null;
  endTime: string | null;
  preferredStaffName?: string;
  assignedStaffNames: string[];
  totalPesewas: number;
  notes?: string;
  area?: string;
  address?: string;
  landmark?: string;
  locationNotes?: string;
  transportFeePesewas?: number | null;
  transportFeeStatus: TransportFeeStatus;
};
