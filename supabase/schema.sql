-- Disposable Wears store: database setup
-- Paste this whole file into Supabase > SQL Editor > New query, then press "Run".
-- It is safe to run more than once.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  short_description text not null default '',
  description text not null default '',
  features text[] not null default '{}',
  unit text not null default '1 piece',
  art text,                 -- built-in illustration used when there is no photo
  image_url text,           -- product photo (uploaded from the admin panel)
  featured boolean not null default false,
  active boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  price integer not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  sort integer not null default 0
);
create index if not exists product_variants_product_id_idx on public.product_variants(product_id);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no bigint generated always as identity (start with 1001) unique,
  customer_name text not null,
  phone text not null,
  email text,
  business_name text,
  city text not null,
  address text not null,
  notes text,
  items jsonb not null,
  subtotal integer not null,
  delivery_fee integer,            -- null = delivery charge still to be confirmed
  total integer not null,          -- subtotal + delivery_fee (when known)
  payment_method text not null check (payment_method in ('cod', 'bank', 'jazzcash', 'easypaisa')),
  payment_reference text,
  payment_proof_path text,
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'pending_verification', 'paid', 'refunded')),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  admin_notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business_name text,
  business_type text,
  phone text not null,
  email text,
  city text,
  products text not null,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'won', 'lost')),
  created_at timestamptz not null default now()
);

create table if not exists public.store_settings (
  id integer primary key default 1 check (id = 1),
  whatsapp text not null default '923001455129',
  phone text not null default '+92 300 1455 129',
  email text not null default 'disposablewears.pk@gmail.com',
  address text not null default 'Ghazi Road, DHA, Lahore Cantt.',
  free_delivery_city text not null default 'Lahore',
  delivery_fee integer not null default 0,        -- other cities; 0 = confirm per order
  free_delivery_min integer not null default 0,   -- free delivery above this amount; 0 = off
  bank_name text not null default '',
  bank_account_title text not null default '',
  bank_account_no text not null default '',
  bank_iban text not null default '',
  jazzcash_no text not null default '',
  jazzcash_name text not null default '',
  easypaisa_no text not null default '',
  easypaisa_name text not null default '',
  facebook_url text not null default '',
  instagram_url text not null default '',
  announcement text not null default 'Free delivery in Lahore · Delivery all over Pakistan · Cash on Delivery'
);
insert into public.store_settings (id) values (1) on conflict (id) do nothing;

-- People allowed into /admin. Add the owner's login email here (see bottom of file).
create table if not exists public.admins (
  email text primary key
);

-- ---------------------------------------------------------------------------
-- Security (Row Level Security)
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.quote_requests enable row level security;
alter table public.store_settings enable row level security;
alter table public.admins enable row level security;

drop policy if exists "public reads active products" on public.products;
create policy "public reads active products" on public.products
  for select using (active or public.is_admin());
drop policy if exists "admins manage products" on public.products;
create policy "admins manage products" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public reads variants" on public.product_variants;
create policy "public reads variants" on public.product_variants
  for select using (true);
drop policy if exists "admins manage variants" on public.product_variants;
create policy "admins manage variants" on public.product_variants
  for all using (public.is_admin()) with check (public.is_admin());

-- Orders and quotes are created by the website's server (service role key),
-- so the public has no direct access to them.
drop policy if exists "admins manage orders" on public.orders;
create policy "admins manage orders" on public.orders
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage quotes" on public.quote_requests;
create policy "admins manage quotes" on public.quote_requests
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public reads settings" on public.store_settings;
create policy "public reads settings" on public.store_settings
  for select using (true);
drop policy if exists "admins update settings" on public.store_settings;
create policy "admins update settings" on public.store_settings
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins read admins" on public.admins;
create policy "admins read admins" on public.admins
  for select using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Placing an order: checks prices and stock on the server, then saves the
-- order and reduces stock in one step.
-- ---------------------------------------------------------------------------

create or replace function public.place_order(p_customer jsonb, p_items jsonb, p_payment jsonb)
returns table (order_id uuid, order_number bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item jsonb;
  v_variant record;
  v_qty integer;
  v_lines jsonb := '[]'::jsonb;
  v_subtotal integer := 0;
  v_fee integer;
  v_free_min integer;
  v_free_city text;
  v_id uuid;
  v_no bigint;
begin
  if jsonb_array_length(coalesce(p_items, '[]'::jsonb)) = 0 then
    raise exception 'Your cart is empty.';
  end if;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := (v_item ->> 'quantity')::integer;
    if v_qty is null or v_qty < 1 or v_qty > 10000 then
      raise exception 'Invalid quantity.';
    end if;

    select v.id, v.name as variant_name, v.price, v.stock, p.name as product_name, p.slug, p.unit
      into v_variant
      from product_variants v
      join products p on p.id = v.product_id
     where v.id = (v_item ->> 'variant_id')::uuid and p.active
       for update of v;

    if not found then
      raise exception 'A product in your cart is no longer available.';
    end if;
    if v_variant.stock < v_qty then
      raise exception 'Only % left of % (%). Please reduce the quantity or request a bulk quote.',
        v_variant.stock, v_variant.product_name, v_variant.variant_name;
    end if;

    update product_variants set stock = stock - v_qty where id = v_variant.id;

    v_subtotal := v_subtotal + v_variant.price * v_qty;
    v_lines := v_lines || jsonb_build_object(
      'variant_id', v_variant.id,
      'slug', v_variant.slug,
      'product', v_variant.product_name,
      'variant', v_variant.variant_name,
      'unit', v_variant.unit,
      'price', v_variant.price,
      'quantity', v_qty,
      'line_total', v_variant.price * v_qty
    );
  end loop;

  -- Same rules as deliveryFeeFor() in src/lib/format.ts.
  select delivery_fee, free_delivery_min, free_delivery_city
    into v_fee, v_free_min, v_free_city
    from store_settings where id = 1;
  if v_free_city <> '' and lower(trim(p_customer ->> 'city')) = lower(trim(v_free_city)) then
    v_fee := 0;
  elsif v_free_min > 0 and v_subtotal >= v_free_min then
    v_fee := 0;
  elsif coalesce(v_fee, 0) <= 0 then
    v_fee := null;  -- confirmed by the owner after the order
  end if;

  insert into orders (
    customer_name, phone, email, business_name, city, address, notes,
    items, subtotal, delivery_fee, total,
    payment_method, payment_reference, payment_proof_path, payment_status
  ) values (
    p_customer ->> 'name', p_customer ->> 'phone', nullif(p_customer ->> 'email', ''),
    nullif(p_customer ->> 'business_name', ''), p_customer ->> 'city', p_customer ->> 'address',
    nullif(p_customer ->> 'notes', ''),
    v_lines, v_subtotal, v_fee, v_subtotal + coalesce(v_fee, 0),
    p_payment ->> 'method', nullif(p_payment ->> 'reference', ''), nullif(p_payment ->> 'proof_path', ''),
    case when p_payment ->> 'method' = 'cod' then 'unpaid' else 'pending_verification' end
  )
  returning id, order_no into v_id, v_no;

  return query select v_id, v_no;
end;
$$;

revoke all on function public.place_order(jsonb, jsonb, jsonb) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- File storage: product photos (public) and payment screenshots (private)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do nothing;

drop policy if exists "admins upload product images" on storage.objects;
create policy "admins upload product images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admins change product images" on storage.objects;
create policy "admins change product images" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admins delete product images" on storage.objects;
create policy "admins delete product images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admins read payment proofs" on storage.objects;
create policy "admins read payment proofs" on storage.objects
  for select to authenticated
  using (bucket_id = 'payment-proofs' and public.is_admin());
