import { z } from "zod";

export const bookingRequestSchema = z.object({
  locationType: z.enum(["SPA", "HOME"]),
  serviceId: z.string().min(1),
  variantId: z.string().min(1),
  preferredStaffId: z.string().optional(),
  requestedDate: z.string().min(1),
  requestedTime: z.string().min(1),
  customerName: z.string().min(2),
  customerPhone: z.string().min(5),
  customerEmail: z.string().email().optional().or(z.literal("")),
  notes: z.string().max(1000).optional(),
  area: z.string().optional(),
  address: z.string().optional(),
  landmark: z.string().optional(),
  locationNotes: z.string().optional(),
});

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;
