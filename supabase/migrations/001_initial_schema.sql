create extension if not exists pgcrypto;

create type app_role as enum ('ADMIN', 'RECEPTION');
create type location_type as enum ('SPA', 'HOME');
create type booking_source as enum ('ONLINE', 'WALK_IN', 'STAFF');
create type appointment_status as enum ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
create type transport_fee_status as enum ('NOT_REQUIRED', 'PENDING_CONFIRMATION', 'CONFIRMED', 'PAID');
create type payment_method as enum ('CASH', 'MOBILE_MONEY', 'CARD', 'BANK_TRANSFER');
create type payment_status as enum ('PENDING', 'PAID', 'VOID');
create type staff_assignment_role as enum ('PREFERRED', 'ASSIGNED', 'SECONDARY');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role app_role not null default 'RECEPTION',
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table staff (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete set null,
  display_name text not null,
  role_label text not null default 'Spa Therapist',
  profile_image_path text,
  active boolean not null default true,
  bookable boolean not null default true,
  home_service_eligible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references service_categories(id) on delete restrict,
  name text not null,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, name)
);

create table service_variants (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  location_type location_type not null,
  duration_minutes integer,
  price_pesewas integer not null check (price_pesewas >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table staff_services (
  staff_id uuid not null references staff(id) on delete cascade,
  service_id uuid not null references services(id) on delete cascade,
  primary key (staff_id, service_id)
);

create table staff_availability (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references staff(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (start_time < end_time)
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  booking_reference text not null unique,
  customer_id uuid not null references customers(id) on delete restrict,
  booking_source booking_source not null,
  location_type location_type not null,
  start_time timestamptz,
  end_time timestamptz,
  status appointment_status not null default 'PENDING',
  notes text,
  area text,
  address text,
  landmark text,
  location_notes text,
  transport_fee_pesewas integer,
  transport_fee_status transport_fee_status not null default 'NOT_REQUIRED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table appointment_services (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references appointments(id) on delete cascade,
  service_variant_id uuid not null references service_variants(id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  unit_price_pesewas integer not null check (unit_price_pesewas >= 0),
  created_at timestamptz not null default now()
);

create table appointment_staff (
  appointment_id uuid not null references appointments(id) on delete cascade,
  staff_id uuid not null references staff(id) on delete restrict,
  assignment_role staff_assignment_role not null,
  created_at timestamptz not null default now(),
  primary key (appointment_id, staff_id, assignment_role)
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references appointments(id) on delete restrict,
  method payment_method not null,
  status payment_status not null default 'PENDING',
  amount_pesewas integer not null check (amount_pesewas >= 0),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table receipts (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null unique references payments(id) on delete restrict,
  appointment_id uuid not null references appointments(id) on delete restrict,
  receipt_number text not null unique,
  total_pesewas integer not null check (total_pesewas >= 0),
  issued_at timestamptz not null default now()
);

create index appointments_status_idx on appointments(status);
create index appointments_start_time_idx on appointments(start_time);
create index appointment_staff_staff_idx on appointment_staff(staff_id);
create index service_variants_lookup_idx on service_variants(service_id, location_type, active);
create index staff_availability_lookup_idx on staff_availability(staff_id, day_of_week, active);

alter table profiles enable row level security;
alter table staff enable row level security;
alter table service_categories enable row level security;
alter table services enable row level security;
alter table service_variants enable row level security;
alter table staff_services enable row level security;
alter table staff_availability enable row level security;
alter table customers enable row level security;
alter table appointments enable row level security;
alter table appointment_services enable row level security;
alter table appointment_staff enable row level security;
alter table payments enable row level security;
alter table receipts enable row level security;

create or replace function is_staff_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role in ('ADMIN', 'RECEPTION')
  );
$$;

create policy "public read active categories" on service_categories for select using (active = true);
create policy "public read active services" on services for select using (active = true);
create policy "public read active variants" on service_variants for select using (active = true);
create policy "public read bookable staff" on staff for select using (active = true and bookable = true);

create policy "staff read profiles" on profiles for select to authenticated using (is_staff_user());
create policy "staff manage staff" on staff for all to authenticated using (is_staff_user()) with check (is_staff_user());
create policy "staff manage categories" on service_categories for all to authenticated using (is_staff_user()) with check (is_staff_user());
create policy "staff manage services" on services for all to authenticated using (is_staff_user()) with check (is_staff_user());
create policy "staff manage variants" on service_variants for all to authenticated using (is_staff_user()) with check (is_staff_user());
create policy "staff manage staff services" on staff_services for all to authenticated using (is_staff_user()) with check (is_staff_user());
create policy "staff manage availability" on staff_availability for all to authenticated using (is_staff_user()) with check (is_staff_user());
create policy "staff manage customers" on customers for all to authenticated using (is_staff_user()) with check (is_staff_user());
create policy "staff manage appointments" on appointments for all to authenticated using (is_staff_user()) with check (is_staff_user());
create policy "staff manage appointment services" on appointment_services for all to authenticated using (is_staff_user()) with check (is_staff_user());
create policy "staff manage appointment staff" on appointment_staff for all to authenticated using (is_staff_user()) with check (is_staff_user());
create policy "staff manage payments" on payments for all to authenticated using (is_staff_user()) with check (is_staff_user());
create policy "staff manage receipts" on receipts for all to authenticated using (is_staff_user()) with check (is_staff_user());
