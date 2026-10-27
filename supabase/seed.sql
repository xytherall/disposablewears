-- Disposable Wears: starting product list (prices from the owner's list, October 2026)
-- Run this once in Supabase > SQL Editor, after schema.sql.
-- Running it again will not create duplicates.

with p as (
  insert into public.products (slug, name, category, short_description, description, features, unit, art, featured, sort)
  values ('disposable-bed-sheet', 'Disposable Bed Sheet with Pillow Cover', 'bed-couch', 'Single-use non-woven bed sheet with a matching pillow cover.',
    'A fresh, single-use bed sheet for every patient or client. Made from non-woven fabric, it keeps beds and treatment tables clean and saves you the laundry. Each piece comes with a matching pillow cover.',
    array['Fluid-resistant, single use', 'Premium non-woven fabric', 'Matching pillow cover included', 'Zero laundry hassle', 'Fast changes between patients'],
    '1 piece + pillow cover', 'bedsheet', true, 0)
  on conflict (slug) do nothing
  returning id
)
insert into public.product_variants (product_id, name, price, stock, sort)
select p.id, v.name, v.price, 1000, v.sort from p, (values
  ('Blue', 300, 0),
  ('Black', 300, 1),
  ('White', 300, 2)
) as v(name, price, sort);

with p as (
  insert into public.products (slug, name, category, short_description, description, features, unit, art, featured, sort)
  values ('disposable-couch-cover', 'Disposable Couch Cover', 'bed-couch', 'Fitted cover with elastic edges for treatment couches and massage tables.',
    'A fitted, single-use cover for treatment couches, facial beds and massage tables. The elastic edges hold it firmly in place so it doesn''t slide while in use. Sold without a pillow cover.',
    array['Secure elastic edges', 'Non-slip fit, zero sliding', 'Quick setup', 'Non-woven fabric'],
    '1 piece', 'couch', true, 1)
  on conflict (slug) do nothing
  returning id
)
insert into public.product_variants (product_id, name, price, stock, sort)
select p.id, v.name, v.price, 1000, v.sort from p, (values
  ('Blue', 280, 0),
  ('Black', 280, 1),
  ('White', 280, 2)
) as v(name, price, sort);

with p as (
  insert into public.products (slug, name, category, short_description, description, features, unit, art, featured, sort)
  values ('isolation-gown', 'Isolation Gown', 'gowns', 'Lightweight non-woven gown with tie-back and adjustable waist.',
    'A lightweight, breathable gown that covers clothing during procedures, patient care and visits. It ties at the back and the waist can be adjusted for a comfortable fit.',
    array['Lightweight and breathable', 'Non-woven fabric', 'Easy tie-back', 'Adjustable waist'],
    '1 piece', 'gown', true, 2)
  on conflict (slug) do nothing
  returning id
)
insert into public.product_variants (product_id, name, price, stock, sort)
select p.id, v.name, v.price, 1000, v.sort from p, (values
  ('Blue', 280, 0),
  ('White', 280, 1)
) as v(name, price, sort);

with p as (
  insert into public.products (slug, name, category, short_description, description, features, unit, art, featured, sort)
  values ('ot-gown-with-trouser', 'OT Gown with Trouser', 'gowns', 'Disposable operation theatre gown that comes with a matching trouser.',
    'A disposable top and trouser set for operation theatres, procedure rooms and clinic staff. Wear once and throw away, with no washing or sterilising needed.',
    array['Top and trouser set', 'Single use', 'Lightweight non-woven fabric', 'Comfortable fit'],
    '1 set (gown + trouser)', 'scrubs', false, 3)
  on conflict (slug) do nothing
  returning id
)
insert into public.product_variants (product_id, name, price, stock, sort)
select p.id, v.name, v.price, 1000, v.sort from p, (values
  ('Blue', 300, 0),
  ('White', 300, 1)
) as v(name, price, sort);

with p as (
  insert into public.products (slug, name, category, short_description, description, features, unit, art, featured, sort)
  values ('bouffant-cap', 'Bouffant Cap', 'head-foot', 'Elastic hair cover for clinics, salons and kitchens. Pack of 100.',
    'A soft, breathable cap that keeps hair fully covered. The elastic band fits all head sizes. Used in hospitals, salons, spas and food preparation.',
    array['Lightweight and breathable', 'Elastic fit', 'Full hair coverage', '100 caps per pack'],
    'Pack of 100', 'cap', true, 4)
  on conflict (slug) do nothing
  returning id
)
insert into public.product_variants (product_id, name, price, stock, sort)
select p.id, v.name, v.price, 1000, v.sort from p, (values
  ('Blue', 300, 0)
) as v(name, price, sort);

with p as (
  insert into public.products (slug, name, category, short_description, description, features, unit, art, featured, sort)
  values ('shoe-cover', 'Shoe Cover', 'head-foot', 'Anti-skid disposable shoe covers. Pack of 100 pieces (50 pairs).',
    'Slip-on covers that keep floors clean and keep dirt out of clean areas. Useful for operation theatres, clinics, labs, salons and homes.',
    array['Anti-skid', 'Durable', 'Comfortable fit', 'Keeps floors clean', '100 pieces (50 pairs) per pack'],
    'Pack of 100 (50 pairs)', 'shoe', true, 5)
  on conflict (slug) do nothing
  returning id
)
insert into public.product_variants (product_id, name, price, stock, sort)
select p.id, v.name, v.price, 1000, v.sort from p, (values
  ('Blue', 390, 0)
) as v(name, price, sort);

with p as (
  insert into public.products (slug, name, category, short_description, description, features, unit, art, featured, sort)
  values ('face-mask', 'Face Mask', 'masks-gloves', 'Disposable face masks with ear loops. Box of 50.',
    'Comfortable single-use face masks with soft ear loops, for daily protection at clinics, salons, offices and kitchens.',
    array['Hygienic protection', 'Comfortable ear loops', 'Single-use design', '50 masks per box'],
    'Box of 50', 'mask', true, 6)
  on conflict (slug) do nothing
  returning id
)
insert into public.product_variants (product_id, name, price, stock, sort)
select p.id, v.name, v.price, 1000, v.sort from p, (values
  ('Blue', 230, 0),
  ('Black', 160, 1)
) as v(name, price, sort);

with p as (
  insert into public.products (slug, name, category, short_description, description, features, unit, art, featured, sort)
  values ('disposable-gloves', 'Disposable Plastic Gloves', 'masks-gloves', 'Transparent plastic gloves. Pack of 100 pieces (50 pairs).',
    'Lightweight transparent plastic gloves for food handling, cleaning, hair colouring and general hygiene tasks.',
    array['Lightweight plastic', 'Transparent', 'Single use', '100 pieces (50 pairs) per pack'],
    'Pack of 100 (50 pairs)', 'gloves', true, 7)
  on conflict (slug) do nothing
  returning id
)
insert into public.product_variants (product_id, name, price, stock, sort)
select p.id, v.name, v.price, 1000, v.sort from p, (values
  ('Transparent', 95, 0)
) as v(name, price, sort);

with p as (
  insert into public.products (slug, name, category, short_description, description, features, unit, art, featured, sort)
  values ('spa-gown', 'Spa Gown', 'gowns', 'Black disposable gown for spa and salon clients. Male and female cuts.',
    'A comfortable single-use gown for spa, massage and salon clients. Available in separate male and female cuts.',
    array['Breathable non-woven fabric', 'Comfortable', 'Single use', 'Male and female cuts'],
    '1 piece', 'spa', true, 8)
  on conflict (slug) do nothing
  returning id
)
insert into public.product_variants (product_id, name, price, stock, sort)
select p.id, v.name, v.price, 1000, v.sort from p, (values
  ('Black · Female', 190, 0),
  ('Black · Male', 230, 1)
) as v(name, price, sort);

with p as (
  insert into public.products (slug, name, category, short_description, description, features, unit, art, featured, sort)
  values ('chef-apron', 'Chef Apron', 'aprons', 'Disposable apron that protects clothing during food handling.',
    'A single-use apron for kitchens, bakeries and food counters. Protects clothing from spills and keeps food handling hygienic.',
    array['Protects clothing', 'Hygienic for food handling', 'Lightweight', 'Single use'],
    '1 piece', 'apron', false, 9)
  on conflict (slug) do nothing
  returning id
)
insert into public.product_variants (product_id, name, price, stock, sort)
select p.id, v.name, v.price, 1000, v.sort from p, (values
  ('White', 170, 0),
  ('Blue', 170, 1)
) as v(name, price, sort);

with p as (
  insert into public.products (slug, name, category, short_description, description, features, unit, art, featured, sort)
  values ('barber-apron', 'Barber Apron', 'aprons', 'Disposable cape for haircuts, colouring and salon treatments.',
    'A single-use cape that keeps hair and colour off your clients'' clothes. A new one for every client keeps your salon clean.',
    array['Keeps hair and colour off clothes', 'Fresh for every client', 'Lightweight', 'Single use'],
    '1 piece', 'barber', false, 10)
  on conflict (slug) do nothing
  returning id
)
insert into public.product_variants (product_id, name, price, stock, sort)
select p.id, v.name, v.price, 1000, v.sort from p, (values
  ('Black', 170, 0),
  ('White', 170, 1),
  ('Blue', 170, 2)
) as v(name, price, sort);


-- Last step: let the owner into the admin panel.
-- 1) In Supabase go to Authentication > Users > Add user, and create a user with the owner's email and a password.
-- 2) Put that same email below, remove the two dashes at the start of the line, and run it.
-- insert into public.admins (email) values ('owner@example.com') on conflict do nothing;
