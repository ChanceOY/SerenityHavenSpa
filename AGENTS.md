# Serenity Haven Spa Project Rules

Serenity Haven Spa is a Ghana-based spa and wellness business. This repository serves two connected products backed by the same Next.js and Supabase application:

- Public Serenity Haven Spa website for discovery, service browsing, team browsing, in-spa booking requests and home-service booking requests.
- Internal staff operations portal called Serenity Desk.

This is not a generic spa template. Use the supplied Serenity Haven logo, therapist images and spa video before considering any generic imagery.

## Technical Direction

- Use Next.js App Router, TypeScript, Tailwind CSS, Supabase PostgreSQL and Supabase Auth.
- Use Supabase Storage only when necessary; V1 uses static public assets for supplied media.
- Use Server Components by default and Client Components only for interactivity.
- Use server actions or route handlers rather than a separate Express API.
- Do not use Prisma, Redux, a generic CMS, payment gateways, WhatsApp, SMS, email APIs, maps or route optimization in V1.
- Keep business rules out of presentation components.
- Validate user input server-side.
- Use environment variables for Supabase configuration and never commit secrets.

## Business Rules

Current bookable staff names must be used exactly:

- Ruby
- Anita
- Fafali
- Millicent
- Bridget
- Christelle
- Judith
- Elizabeth
- Sedoine

All nine are active, bookable, home-service eligible and use the public role label `Spa Therapist`.

The current nine staff can perform all current spa and home services except nail services. Do not assign them to manicure, pedicure, gel nails, acrylic, stickons or other nail-category services. Nail services remain public and bookable as unassigned requests until a nail technician is added.

Four Hands bookings may collect one preferred therapist; a second therapist is assigned by staff. Couples Massage skips customer staff selection in V1. Normal eligible services show visual therapist cards plus No Preference.

Store money as integer pesewas. Display prices as GHS. Model prices through service variants by service, location type, duration and price.

Do not invent staff biographies, individual specialties, testimonials, awards, contact details, working hours, or business statistics.

## Assets

Original `logo`, `therapists` and `video` folders must not be deleted or overwritten. Web assets may be copied into `public/brand`, `public/therapists` and `public/media` with web-safe filenames.

Therapist identity can only be mapped from filename evidence. If a future image cannot be confidently mapped by filename, document it in README and use a tasteful placeholder until confirmed.

## Availability

Do not show fake availability. If staff schedules are not configured, collect preferred date/time and submit a pending booking request. Pending bookings conservatively block requested times in V1 when availability calculation is possible.
