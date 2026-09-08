-- BIMVORA family packs and student verification.

do $$ begin
  create type public.student_verification_status as enum (
    'pending',
    'approved',
    'rejected'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.family_packs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  audience text not null,
  description text not null,
  price_cents integer not null check (price_cents >= 0),
  features text[] not null default '{}',
  requires_student_proof boolean not null default false,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists family_packs_set_updated_at on public.family_packs;
create trigger family_packs_set_updated_at
  before update on public.family_packs
  for each row execute function public.set_updated_at();

create table if not exists public.family_pack_products (
  pack_id uuid not null references public.family_packs (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  primary key (pack_id, product_id)
);

create table if not exists public.student_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  pack_id uuid not null references public.family_packs (id) on delete restrict,
  certificate_path text not null,
  original_filename text not null,
  status public.student_verification_status not null default 'pending',
  reviewer_note text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, pack_id)
);

drop trigger if exists student_verifications_set_updated_at on public.student_verifications;
create trigger student_verifications_set_updated_at
  before update on public.student_verifications
  for each row execute function public.set_updated_at();

alter table public.order_items
  alter column product_id drop not null;

alter table public.order_items
  add column if not exists pack_id uuid references public.family_packs (id) on delete restrict;

alter table public.order_items
  drop constraint if exists order_items_product_or_pack_check;

alter table public.order_items
  add constraint order_items_product_or_pack_check
  check (num_nonnulls(product_id, pack_id) = 1);

alter table public.family_packs enable row level security;
alter table public.family_pack_products enable row level security;
alter table public.student_verifications enable row level security;

drop policy if exists "family_packs_public_read" on public.family_packs;
create policy "family_packs_public_read"
  on public.family_packs for select
  using (is_active = true or public.is_admin());

drop policy if exists "family_pack_products_public_read" on public.family_pack_products;
create policy "family_pack_products_public_read"
  on public.family_pack_products for select
  using (
    exists (
      select 1
      from public.family_packs fp
      where fp.id = pack_id and fp.is_active = true
    )
  );

drop policy if exists "student_verifications_select_own" on public.student_verifications;
create policy "student_verifications_select_own"
  on public.student_verifications for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "student_verifications_insert_own" on public.student_verifications;
create policy "student_verifications_insert_own"
  on public.student_verifications for insert
  with check (auth.uid() = user_id);

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'student-certificates',
  'student-certificates',
  false,
  5242880,
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do nothing;

drop policy if exists "students_upload_own_certificate" on storage.objects;
create policy "students_upload_own_certificate"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'student-certificates'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Certificate files remain private. Admin review and signed access use
-- the server-side service role.

insert into public.family_packs (
  slug,
  name,
  audience,
  description,
  price_cents,
  features,
  requires_student_proof,
  is_featured,
  sort_order
)
values
  (
    'student',
    'Student',
    'Students and BIM learners',
    'Core Revit families, training projects and templates.',
    0,
    array[
      'Essential HVAC and MEP families',
      'Training project files',
      'Starter templates',
      'Student certificate verification'
    ],
    true,
    false,
    10
  ),
  (
    'professional',
    'Employee / Professional',
    'Employees, technicians and designers',
    'Professional families ready for immediate use in coordinated projects.',
    1000,
    array[
      'Project-ready Revit families',
      'HVAC and MEP essentials',
      'Shared parameters',
      'Commercial-use licence'
    ],
    false,
    false,
    20
  ),
  (
    'family-group',
    'Employee Family Group',
    'Advanced employees and specialists',
    'A focused family collection for one MEP discipline.',
    2000,
    array[
      'One complete discipline collection',
      'HVAC, Plumbing or Clean Room',
      'Coordinated connectors',
      'Consistent naming and parameters'
    ],
    false,
    false,
    30
  ),
  (
    'company',
    'Company',
    'Engineering and construction companies',
    'A large library licensed for professional use inside one company.',
    5000,
    array[
      'Large multi-discipline library',
      'Company-wide internal use',
      'MEP coordination content',
      'Priority issue reporting'
    ],
    false,
    false,
    40
  ),
  (
    'premium-pro-bim',
    'Premium / Pro BIM',
    'BIM modelers and engineers',
    'Advanced parametric families with documentation and BIM standards.',
    5000,
    array[
      'Advanced parametric families',
      'Technical documentation',
      'BIM naming standards',
      'Type catalogues and schedules'
    ],
    false,
    true,
    50
  ),
  (
    'ultimate-all-access',
    'Ultimate / All Access',
    'Professionals and companies',
    'Every pack, catalog updates and future additions.',
    10000,
    array[
      'All current packs included',
      'Future family additions',
      'Catalog updates',
      'Multi-discipline access'
    ],
    false,
    false,
    60
  )
on conflict (slug) do update set
  name = excluded.name,
  audience = excluded.audience,
  description = excluded.description,
  price_cents = excluded.price_cents,
  features = excluded.features,
  requires_student_proof = excluded.requires_student_proof,
  is_featured = excluded.is_featured,
  sort_order = excluded.sort_order,
  is_active = true;
