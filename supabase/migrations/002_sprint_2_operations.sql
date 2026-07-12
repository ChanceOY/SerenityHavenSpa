alter table customers
  add column if not exists phone_normalized text;

update customers
set phone_normalized = phone
where phone_normalized is null;

alter table customers
  alter column phone_normalized set not null;

create unique index if not exists customers_phone_normalized_key
  on customers(phone_normalized);

alter table appointment_services
  add column if not exists service_name_snapshot text,
  add column if not exists duration_minutes_snapshot integer,
  add column if not exists location_type_snapshot location_type;

update appointment_services
set
  service_name_snapshot = services.name,
  duration_minutes_snapshot = service_variants.duration_minutes,
  location_type_snapshot = service_variants.location_type
from service_variants
join services on services.id = service_variants.service_id
where appointment_services.service_variant_id = service_variants.id
  and appointment_services.service_name_snapshot is null;

alter table appointment_services
  alter column service_name_snapshot set not null,
  alter column location_type_snapshot set not null;

create sequence if not exists booking_reference_seq start with 100001;
create sequence if not exists receipt_number_seq start with 1;

create or replace function next_booking_reference()
returns text
language sql
volatile
as $$
  select 'SH-' || nextval('booking_reference_seq')::text;
$$;

create or replace function next_receipt_number()
returns text
language sql
volatile
as $$
  select 'SH-R-' || lpad(nextval('receipt_number_seq')::text, 6, '0');
$$;

create index if not exists customers_phone_normalized_idx on customers(phone_normalized);
create index if not exists appointments_source_idx on appointments(booking_source);
create index if not exists appointment_services_appointment_idx on appointment_services(appointment_id);
create index if not exists payments_appointment_idx on payments(appointment_id);
create index if not exists receipts_appointment_idx on receipts(appointment_id);
