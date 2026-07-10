insert into service_categories (name, sort_order) values
('Massage', 1),
('Four Hands Massage', 2),
('Signature Massage Combos', 3),
('Couples Massage', 4),
('Focused Massage', 5),
('Nails', 6),
('Facials', 7),
('Waxing', 8),
('Body Treatments', 9)
on conflict (name) do nothing;

insert into staff (display_name, role_label, profile_image_path, active, bookable, home_service_eligible) values
('Ruby', 'Spa Therapist', '/therapists/ruby.jpeg', true, true, true),
('Anita', 'Spa Therapist', '/therapists/anita.jpeg', true, true, true),
('Fafali', 'Spa Therapist', '/therapists/fafali.jpeg', true, true, true),
('Millicent', 'Spa Therapist', '/therapists/millicent.jpeg', true, true, true),
('Bridget', 'Spa Therapist', '/therapists/bridget.jpeg', true, true, true),
('Christelle', 'Spa Therapist', '/therapists/christelle.jpeg', true, true, true),
('Judith', 'Spa Therapist', '/therapists/judith.jpeg', true, true, true),
('Elizabeth', 'Spa Therapist', '/therapists/elizabeth.jpeg', true, true, true),
('Sedoine', 'Spa Therapist', '/therapists/sedoine.jpeg', true, true, true);

with rows(category_name, service_name, description) as (
  values
  ('Massage','Swedish Massage',null),('Massage','Deep Tissue Massage',null),('Massage','Hot Stone Massage',null),('Massage','Thai Massage',null),
  ('Four Hands Massage','Four Hands Swedish Massage',null),('Four Hands Massage','Four Hands Deep Tissue Massage',null),('Four Hands Massage','Four Hands Hot Stone Massage',null),('Four Hands Massage','Four Hands Thai Massage',null),
  ('Four Hands Massage','Four Hands Soli Massage','Combination of Deep Tissue, Thai and Hot Stone'),('Four Hands Massage','Four Hands Elixir Massage','Combination of Swedish and Hot Stone'),('Four Hands Massage','Four Hands Scintilla Massage','Combination of Swedish and Deep Tissue'),('Four Hands Massage','Four Hands Massage','Home-service four hands massage request'),
  ('Signature Massage Combos','Soli Massage','Deep Tissue + Thai + Hot Stone'),('Signature Massage Combos','Elixir Massage','Swedish + Hot Stone'),('Signature Massage Combos','Scintilla Massage','Swedish + Deep Tissue'),
  ('Couples Massage','Moon Walk','Swedish massage for both'),('Couples Massage','Rosy Massage','Swedish + Deep Tissue'),('Couples Massage','Solace Massage','Hot Stone + Deep Tissue'),('Couples Massage','Soothing Massage','Deep Tissue + Soli'),('Couples Massage','Repose Massage','Elixir for both'),
  ('Focused Massage','Back Massage',null),('Focused Massage','Reflexology',null),('Focused Massage','Head Massage',null),('Focused Massage','Head, Neck & Shoulder Massage',null),
  ('Facials','Classic Facial',null),('Facials','Basic Facial',null),
  ('Waxing','Bikini Line Waxing',null),('Waxing','Armpit Waxing',null),('Waxing','Beard Waxing',null),('Waxing','Arm Waxing',null),('Waxing','Thigh Waxing',null),
  ('Body Treatments','Body Scrub',null),('Body Treatments','Body Scrub & Steaming',null),
  ('Nails','Manicure',null),('Nails','Pedicure',null),('Nails','Stickons',null),('Nails','Stickons & French Tip',null),('Nails','Stickon & Art with Rhinestones',null),('Nails','Stickon Toes with Gel Polish',null),('Nails','Plain Set Acrylic - Short',null),('Nails','Plain Set Acrylic - Long',null),('Nails','Plain Set Acrylic - X Long',null),('Nails','Ombre Set',null),('Nails','Marble Set',null),('Nails','Gel Nails',null),('Nails','Pedicure with Gel Polish',null)
)
insert into services (category_id, name, description)
select service_categories.id, rows.service_name, rows.description
from rows join service_categories on service_categories.name = rows.category_name
on conflict (category_id, name) do nothing;

with rows(service_name, location_type, duration_minutes, price_pesewas) as (
  values
  ('Swedish Massage','SPA',60,20000),('Swedish Massage','SPA',90,30000),('Swedish Massage','SPA',120,40000),('Swedish Massage','HOME',90,55000),
  ('Deep Tissue Massage','SPA',60,25000),('Deep Tissue Massage','SPA',90,35000),('Deep Tissue Massage','SPA',120,50000),('Deep Tissue Massage','HOME',90,65000),
  ('Hot Stone Massage','SPA',60,30000),('Hot Stone Massage','SPA',90,40000),('Hot Stone Massage','SPA',120,58000),('Hot Stone Massage','HOME',90,70000),
  ('Thai Massage','SPA',60,30000),('Thai Massage','SPA',90,40000),('Thai Massage','SPA',120,58000),('Thai Massage','HOME',90,75000),
  ('Four Hands Swedish Massage','SPA',60,40000),('Four Hands Swedish Massage','SPA',90,55000),('Four Hands Swedish Massage','SPA',120,75000),
  ('Four Hands Deep Tissue Massage','SPA',60,50000),('Four Hands Deep Tissue Massage','SPA',90,65000),('Four Hands Deep Tissue Massage','SPA',120,88000),
  ('Four Hands Hot Stone Massage','SPA',60,60000),('Four Hands Hot Stone Massage','SPA',90,75000),('Four Hands Hot Stone Massage','SPA',120,95000),
  ('Four Hands Thai Massage','SPA',60,60000),('Four Hands Thai Massage','SPA',90,75000),('Four Hands Thai Massage','SPA',120,95000),
  ('Four Hands Soli Massage','SPA',60,70000),('Four Hands Soli Massage','SPA',90,85000),('Four Hands Soli Massage','SPA',120,130000),
  ('Four Hands Elixir Massage','SPA',60,55000),('Four Hands Elixir Massage','SPA',90,68000),('Four Hands Elixir Massage','SPA',120,100000),
  ('Four Hands Scintilla Massage','SPA',60,55000),('Four Hands Scintilla Massage','SPA',90,63000),('Four Hands Scintilla Massage','SPA',120,95000),('Four Hands Massage','HOME',90,90000),
  ('Soli Massage','SPA',60,35000),('Soli Massage','SPA',90,45000),('Soli Massage','SPA',120,60000),('Soli Massage','HOME',90,80000),
  ('Elixir Massage','SPA',60,25000),('Elixir Massage','SPA',90,35000),('Elixir Massage','SPA',120,48000),('Elixir Massage','HOME',90,60000),
  ('Scintilla Massage','SPA',60,30000),('Scintilla Massage','SPA',90,40000),('Scintilla Massage','SPA',120,55000),('Scintilla Massage','HOME',90,65000),
  ('Moon Walk','SPA',60,40000),('Moon Walk','SPA',90,55000),('Moon Walk','SPA',120,75000),
  ('Rosy Massage','SPA',60,50000),('Rosy Massage','SPA',90,65000),('Rosy Massage','SPA',120,85000),
  ('Solace Massage','SPA',60,60000),('Solace Massage','SPA',90,70000),('Solace Massage','SPA',120,100000),
  ('Soothing Massage','SPA',60,68000),('Soothing Massage','SPA',90,83000),('Soothing Massage','SPA',120,120000),
  ('Repose Massage','SPA',60,48000),('Repose Massage','SPA',90,60000),('Repose Massage','SPA',120,80000),
  ('Back Massage','SPA',40,15000),('Back Massage','HOME',40,40000),('Reflexology','SPA',40,15000),('Reflexology','HOME',40,40000),('Head Massage','SPA',40,10000),('Head Massage','HOME',40,20000),('Head, Neck & Shoulder Massage','SPA',40,15000),('Head, Neck & Shoulder Massage','HOME',40,40000),
  ('Classic Facial','SPA',null,35000),('Classic Facial','HOME',null,50000),('Basic Facial','SPA',null,28000),('Basic Facial','HOME',null,40000),
  ('Bikini Line Waxing','SPA',null,20000),('Bikini Line Waxing','HOME',null,35000),('Armpit Waxing','SPA',null,12000),('Armpit Waxing','HOME',null,24000),('Beard Waxing','SPA',null,12000),('Beard Waxing','HOME',null,20000),('Arm Waxing','SPA',null,25000),('Arm Waxing','HOME',null,40000),('Thigh Waxing','SPA',null,30000),('Thigh Waxing','HOME',null,60000),
  ('Body Scrub','SPA',null,30000),('Body Scrub','HOME',null,50000),('Body Scrub & Steaming','SPA',null,40000),('Body Scrub & Steaming','HOME',null,65000),
  ('Manicure','SPA',null,5000),('Manicure','HOME',null,10000),('Pedicure','SPA',null,12000),('Pedicure','HOME',null,25000),('Stickons','SPA',null,10000),('Stickons & French Tip','SPA',null,12000),('Stickon & Art with Rhinestones','SPA',null,14000),('Stickon Toes with Gel Polish','SPA',null,8000),('Plain Set Acrylic - Short','SPA',null,14000),('Plain Set Acrylic - Long','SPA',null,15000),('Plain Set Acrylic - X Long','SPA',null,18000),('Ombre Set','SPA',null,17000),('Marble Set','SPA',null,17500),('Gel Nails','SPA',null,15000),('Pedicure with Gel Polish','SPA',null,15000)
)
insert into service_variants (service_id, location_type, duration_minutes, price_pesewas)
select services.id, rows.location_type::location_type, rows.duration_minutes, rows.price_pesewas
from rows join services on services.name = rows.service_name;

insert into staff_services (staff_id, service_id)
select staff.id, services.id
from staff
cross join services
join service_categories on service_categories.id = services.category_id
where service_categories.name <> 'Nails'
on conflict do nothing;
