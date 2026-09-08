-- BIMVORA — initial schema, RLS, storage, and auth hooks.
-- Run this in the Supabase SQL editor (or via supabase db push).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

do $$ begin
  create type public.user_role as enum ('customer', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.discipline as enum (
    'hvac',
    'plumbing',
    'electrical',
    'fire_protection',
    'architectural',
    'structural',
    'other'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.family_kind as enum ('loadable', 'nested');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.hosting_type as enum ('unhosted', 'wall', 'ceiling', 'face', 'level');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.order_status as enum ('pending', 'paid', 'failed', 'refunded', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.coupon_type as enum ('percent', 'fixed');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.payment_event_status as enum ('received', 'processed', 'ignored', 'failed');
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- Profiles (extends auth.users)
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  company text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Catalog
-- ---------------------------------------------------------------------------

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  parent_id uuid references public.categories (id) on delete set null,
  discipline public.discipline not null default 'other',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sku text not null unique,
  short_description text not null,
  description text not null,
  price_cents integer not null check (price_cents >= 0),
  compare_at_price_cents integer check (compare_at_price_cents is null or compare_at_price_cents >= 0),
  category_id uuid not null references public.categories (id) on delete restrict,
  discipline public.discipline not null,
  revit_category text not null,
  family_kind public.family_kind not null default 'loadable',
  hosting public.hosting_type not null default 'unhosted',
  revit_versions text[] not null default '{}',
  file_format text not null default '.rfa',
  is_published boolean not null default false,
  is_featured boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_published_idx on public.products (is_published, created_at desc);
create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_discipline_idx on public.products (discipline);
create index if not exists products_featured_idx on public.products (is_featured) where is_featured = true;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  alt text not null,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_idx on public.product_images (product_id, sort_order);

create table if not exists public.product_files (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null,
  filename text not null,
  revit_version text,
  file_size_bytes bigint not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_files_product_idx on public.product_files (product_id);

-- ---------------------------------------------------------------------------
-- Commerce (Phase 2+)
-- ---------------------------------------------------------------------------

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  type public.coupon_type not null,
  value integer not null check (value >= 0),
  max_uses integer,
  used_count integer not null default 0,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists coupons_set_updated_at on public.coupons;
create trigger coupons_set_updated_at
  before update on public.coupons
  for each row execute function public.set_updated_at();

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete restrict,
  status public.order_status not null default 'pending',
  currency text not null default 'EUR',
  subtotal_cents integer not null default 0,
  discount_cents integer not null default 0,
  total_cents integer not null default 0,
  coupon_id uuid references public.coupons (id) on delete set null,
  payment_provider text,
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders (user_id, created_at desc);
create index if not exists orders_status_idx on public.orders (status);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete restrict,
  product_name text not null,
  sku text not null,
  unit_price_cents integer not null,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items (order_id);

create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  order_item_id uuid not null references public.order_items (id) on delete cascade,
  product_file_id uuid not null references public.product_files (id) on delete restrict,
  token text not null unique,
  expires_at timestamptz,
  download_count integer not null default 0,
  max_downloads integer not null default 5,
  last_downloaded_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists downloads_user_idx on public.downloads (user_id);
create index if not exists downloads_token_idx on public.downloads (token);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_type text not null,
  external_id text,
  payload jsonb not null default '{}'::jsonb,
  status public.payment_event_status not null default 'received',
  order_id uuid references public.orders (id) on delete set null,
  created_at timestamptz not null default now()
);

create unique index if not exists payment_events_provider_external_idx
  on public.payment_events (provider, external_id)
  where external_id is not null;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Catalog is publicly readable when published. Mutations are service-role only.
-- product_files are never readable by the anon/authenticated keys.
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_files enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.downloads enable row level security;
alter table public.payment_events enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select p.role from public.profiles p where p.id = auth.uid()));

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
  on public.categories for select
  using (is_active = true or public.is_admin());

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
  on public.products for select
  using (is_published = true or public.is_admin());

drop policy if exists "product_images_public_read" on public.product_images;
create policy "product_images_public_read"
  on public.product_images for select
  using (
    exists (
      select 1
      from public.products p
      where p.id = product_id
        and (p.is_published = true or public.is_admin())
    )
  );

-- No SELECT policy on product_files: clients cannot read storage paths.
-- Service role (admin server) bypasses RLS.

drop policy if exists "coupons_admin_read" on public.coupons;
create policy "coupons_admin_read"
  on public.coupons for select
  using (public.is_admin());

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own"
  on public.orders for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "order_items_select_own" on public.order_items;
create policy "order_items_select_own"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "downloads_select_own" on public.downloads;
create policy "downloads_select_own"
  on public.downloads for select
  using (auth.uid() = user_id or public.is_admin());

-- payment_events: no client policies. Service role only.

-- ---------------------------------------------------------------------------
-- Storage buckets
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'product-images',
    'product-images',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  ),
  (
    'product-files',
    'product-files',
    false,
    52428800,
    array[
      'application/octet-stream',
      'application/zip',
      'application/x-zip-compressed'
    ]
  )
on conflict (id) do nothing;

drop policy if exists "product_images_public_select" on storage.objects;
create policy "product_images_public_select"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- product-files: no public/authenticated SELECT. Signed URLs are issued server-side later.
