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
3. Run `supabase/seed.sql`.
4. Create staff users in Supabase Auth.
5. Add matching rows in `profiles` with role `ADMIN` or `RECEPTION`.

Money is stored as integer pesewas in `price_pesewas`, `transport_fee_pesewas`, `amount_pesewas` and receipt/payment totals. UI formatting converts these values to GHS.

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

## Architecture

- `app/(public)` contains the public Serenity Haven website.
- `app/staff` contains Serenity Desk foundations.
- `components/booking` contains the stepped booking experience.
- `components/public` and `components/staff` contain layout shells.
- `lib/services` owns service and pricing data helpers.
- `lib/staff` owns current therapist and eligibility helpers.
- `lib/availability` owns slot/request-only availability behavior.
- `lib/appointments` owns appointment sample data and status transitions.
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

Scaffolded but incomplete:

- Supabase persistence for public bookings.
- Staff CRUD for services, variants, staff, schedules and appointments.
- Customer search persistence.
- Walk-in creation persistence.
- Checkout payment/receipt persistence.
- Full Supabase Auth role enforcement in server-side route loaders.

## Business Data Requiring Confirmation

- Business phone number, email, address, social links and opening hours.
- Individual staff weekly schedules.
- Nail technician details and nail-service eligibility.
- Durations for facials, waxing, body treatments and nail services.
- Ambiguous nail flyer entries around "French, art, stones" priced at GHS 210 and GHS 220.
- Home service transportation fee amounts by location.
- Whether home service is available for every seeded home-service variant in all service areas.
