# Serenity Haven Spa

Production-quality V1 foundation for the public Serenity Haven Spa website and the internal Serenity Desk staff operations portal.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Fill in Supabase values:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

4. Run locally:

```bash
npm run dev
```

5. Verify:

```bash
npm run lint
npm run build
```

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/migrations/001_initial_schema.sql`.
3. Run `supabase/migrations/002_sprint_2_operations.sql`.
4. Run `supabase/seed.sql`.
5. Create staff users in Supabase Auth.
6. Add matching rows in `profiles` with role `ADMIN` or `RECEPTION`.

Money is stored as integer pesewas in `price_pesewas`, `transport_fee_pesewas`, `amount_pesewas` and receipt/payment totals. UI formatting converts these values to GHS.

`SUPABASE_SERVICE_ROLE_KEY` is used only in server-side modules for operational writes such as online booking creation, walk-ins, checkout and receipts. Do not expose it in browser code.

To create the first ADMIN user:

1. Create the user in Supabase Auth with email/password.
2. Copy the Auth user UUID.
3. Insert a `profiles` row with that UUID and `role = 'ADMIN'`.
4. Log in at `/login`; authorised staff are redirected into `/staff/dashboard`.

## Sprint 2 Operations

Online booking requests persist to Supabase as `PENDING` appointments with source `ONLINE`. The server re-fetches the selected service variant, snapshots the service name, duration and price, normalises the customer phone number, finds or creates the customer, stores home-service address fields where supplied and records an eligible preferred therapist when selected.

Phone normalisation stores Ghana numbers in stable E.164-style `+233XXXXXXXXX` format. Local numbers such as `0541639802`, country-code numbers such as `233541639802` and full international numbers such as `+233541639802` all normalise to `+233541639802`.

Booking references are generated in PostgreSQL with `next_booking_reference()` using the format `SH-100001`. Receipt numbers are generated in PostgreSQL with `next_receipt_number()` using the format `SH-R-000001`.

Serenity Desk appointment screens read persisted appointments. Staff can move appointments through the V1 lifecycle, assign eligible therapists before completion, create walk-ins, complete checkout, record a payment method and generate a persisted receipt. Checkout uses stored line-item snapshots and marks the appointment `COMPLETED`; browser print/save-as-PDF is the receipt output path.

`/staff/walk-ins/new` is the staff manual appointment entry point. Staff can create a walk-in now, which stores source `WALK_IN` and status `CHECKED_IN`, or schedule an in-spa appointment for later, which stores source `STAFF` and status `CONFIRMED`. The service selector is searchable by service name, category, duration and GHS price. Staff assignment remains optional; nail services are created unassigned until a nail technician is added.

Remaining business data required:

- Individual staff weekly schedules.
- Nail technician profile and nail-service eligibility.
- Confirmed transport fee handling for home service.
- Durations for services that are still configured as duration pending.
- Any future operational reporting requirements.

## Routes

Public:

- `/`
- `/services`
- `/home-service`
- `/team`
- `/book`
- `/contact`

Serenity Desk:

- `/login`
- `/staff/dashboard`
- `/staff/appointments`
- `/staff/appointments/[id]`
- `/staff/walk-ins/new`
- `/staff/customers`
- `/staff/services`
- `/staff/team`
- `/staff/receipts/demo`
- `/staff/receipts/[id]`
- `/staff/appointments/[id]/checkout`

## Architecture

- `app/(public)` contains the public Serenity Haven website.
- `app/staff` contains Serenity Desk foundations.
- `components/booking` contains the stepped booking experience.
- `components/public` and `components/staff` contain layout shells.
- `lib/services` owns service and pricing data helpers.
- `lib/staff` owns current therapist and eligibility helpers.
- `lib/availability` owns slot/request-only availability behavior.
- `lib/appointments` owns appointment data access and status transitions.
- `lib/bookings`, `lib/customers`, `lib/payments`, `lib/receipts` and `lib/checkout` contain or are reserved for operational persistence boundaries as the MVP grows.
- `lib/supabase` contains Supabase client factories.
- `supabase/migrations` and `supabase/seed.sql` define the database foundation.

## Asset Mapping

All supplied therapist image filenames confidently map to staff names:

- `Anita.jpeg` -> Anita
- `Bridget.jpeg` -> Bridget
- `Christelle.jpeg` -> Christelle
- `Elizabeth.jpeg` -> Elizabeth
- `Fafali.jpeg` -> Fafali
- `Judith.jpeg` -> Judith
- `Millicent.jpeg` -> Millicent
- `Ruby.jpeg` -> Ruby
- `Sedoine.jpeg` -> Sedoine

No therapist image mappings are unresolved in this asset set.

Copied web assets:

- `public/brand/serenity-haven-logo.jpeg`
- `public/media/serenity-haven-spa-tour.mp4`
- `public/therapists/*.jpeg`

The original `logo`, `therapists` and `video` folders remain untouched.

## RLS Model

The migration enables RLS on operational tables. Public users can read active service categories, active services, active variants and public bookable staff fields needed for the website. Public users can insert constrained booking request records through the intended booking flow.

Authenticated staff with `profiles.role` of `ADMIN` or `RECEPTION` can read operational data. Admin-only management policies can be tightened further as CRUD screens become fully wired.

Public users must not read all customers, appointments, payments or receipts, and must not manage services, staff or appointment statuses.

## V1 Flow Status

Working in this pass:

- Public homepage using supplied video and logo.
- Services page with real supplied prices and category filtering.
- Team page with all nine mapped therapist images.
- Step-by-step booking UI with visual therapist selection, No Preference, nail/couples/four-hands behavior and pending-confirmation submission.
- Staff dashboard, appointment list/detail foundation, status transition display, service warnings, team overview and printable receipt demo.
- Supabase schema and seed foundation.

Sprint 2 wired:

- Supabase persistence for public booking requests.
- Server-side staff route authorization for `ADMIN` and `RECEPTION`.
- Persisted staff dashboard, appointment list and appointment detail.
- Server-side appointment status lifecycle.
- Therapist assignment with nail-service exclusion.
- Walk-in creation with customer lookup/creation by normalised phone.
- Checkout payment recording and persisted receipts.

Still intentionally limited:

- Staff CRUD for services, variants, staff and schedules.
- Full customer management screens.
- Reports, analytics, inventory, memberships, gift cards and payment gateway integrations.

## Business Data Requiring Confirmation

- Business phone number, email, address, social links and opening hours.
- Individual staff weekly schedules.
- Nail technician details and nail-service eligibility.
- Durations for facials, waxing, body treatments and nail services.
- Ambiguous nail flyer entries around "French, art, stones" priced at GHS 210 and GHS 220.
- Home service transportation fee amounts by location.
- Whether home service is available for every seeded home-service variant in all service areas.
