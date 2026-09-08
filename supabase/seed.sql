-- BIMVORA catalog seed. Run after all files in supabase/migrations.
-- Images point at public storefront assets shipped with the Next.js app.

insert into public.categories (id, slug, name, description, discipline, sort_order, is_active)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'hvac-mechanical',
    'HVAC / Mechanical',
    'Mechanical plant, airside systems, hydronic equipment and HVAC distribution families.',
    'hvac',
    10,
    true
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'air-terminals',
    'Air Terminals',
    'Diffusers, grilles and registers with parametric airflow and neck sizes.',
    'hvac',
    20,
    false
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'duct-accessories',
    'Duct Accessories',
    'Fire, smoke and volume dampers sized to standard rectangular and round ducts.',
    'hvac',
    30,
    false
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'plumbing',
    'Plumbing',
    'Water supply, sanitary fixtures, drainage and plumbing equipment families.',
    'plumbing',
    20,
    true
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'fire-protection',
    'Fire Protection',
    'Code-oriented fire and smoke control families for coordinated models.',
    'fire_protection',
    50,
    false
  )
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  discipline = excluded.discipline,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into public.products (
  id, slug, name, sku, short_description, description,
  price_cents, compare_at_price_cents, category_id, discipline,
  revit_category, family_kind, hosting, revit_versions, file_format,
  is_published, is_featured, seo_title, seo_description
)
values
  (
    'a1111111-1111-4111-8111-111111111111',
    'modular-vav-box-dual-duct',
    'Modular VAV Box — Dual Duct',
    'BL-HVAC-VAV-DD-01',
    'Parametric dual-duct VAV terminal with heating/cooling inlets, reheat coil option and nested connectors.',
    $md$Loadable Mechanical Equipment family for variable air volume terminals.

Built for coordinated HVAC models: dual inlets, discharge connector, optional hot-water reheat coil and shared parameters for airflow, pressure drop and sound power.

Includes type catalogues for 6–16 in. inlets and instance parameters for damper position, min/max airflow and control sequence tags.$md$,
    8900,
    11900,
    '11000000-0000-4000-8000-000000000008',
    'hvac',
    'Mechanical Equipment',
    'loadable',
    'unhosted',
    array['2022', '2023', '2024', '2025', '2026'],
    '.rfa',
    true,
    true,
    'Modular Dual-Duct VAV Box Revit Family | BIMVORA',
    'Professional dual-duct VAV box Revit family for HVAC models. Nested connectors, reheat coil option, Revit 2022–2026.'
  ),
  (
    'a2222222-2222-4222-8222-222222222222',
    'packaged-air-handling-unit',
    'Packaged Air Handling Unit',
    'BL-HVAC-AHU-PK-02',
    'Modular AHU with mixing box, filters, coils and fan section. Clearance envelopes included.',
    $md$Sectional air handling unit for plant rooms and roof plant.

Mixing box, bag filter, heating/cooling coils and supply fan are nested families so you can schedule components independently. Clearance volumes are visibility-controlled for clash detection.

Shared parameters cover airflow, external static pressure, coil kW, filter class and electrical load.$md$,
    14900,
    null,
    '11000000-0000-4000-8000-000000000001',
    'hvac',
    'Mechanical Equipment',
    'loadable',
    'level',
    array['2023', '2024', '2025', '2026'],
    '.rfa',
    true,
    true,
    'Packaged Air Handling Unit Revit Family | BIMVORA',
    'Parametric packaged AHU Revit family with nested coils, filters and fan. Built for plant-room coordination.'
  ),
  (
    'a3333333-3333-4333-8333-333333333333',
    'ceiling-cassette-fan-coil',
    'Ceiling Cassette Fan Coil',
    'BL-HVAC-FCU-CC-03',
    'Four-way cassette FCU with ceiling host, condensate connector and 2-pipe / 4-pipe types.',
    $md$Ceiling-hosted fan coil unit with four-way discharge, return air plenum and hydronic connectors.

2-pipe and 4-pipe type catalogues, cooling/heating capacity parameters, and a nested condensate drain connector. Recess depth is parametric for ceiling void coordination.$md$,
    6900,
    null,
    '11000000-0000-4000-8000-000000000003',
    'hvac',
    'Mechanical Equipment',
    'loadable',
    'ceiling',
    array['2022', '2023', '2024', '2025', '2026'],
    '.rfa',
    true,
    true,
    'Ceiling Cassette Fan Coil Revit Family | BIMVORA',
    'Ceiling-hosted four-way cassette FCU family with 2-pipe and 4-pipe types for HVAC coordination.'
  ),
  (
    'a4444444-4444-4444-8444-444444444444',
    'panel-radiator-hydronic',
    'Panel Radiator — Hydronic',
    'BL-HVAC-RAD-PN-04',
    'Wall-hosted compact and plus radiator types with pipe connectors and output schedules.',
    $md$Wall-hosted hydronic panel radiator for residential and commercial heating.

Compact, plus and convectors types. Length, height and depth are type-driven. Supply/return pipe connectors sit at configurable centres. Output (W) is formula-driven from size and mean water temperature.$md$,
    3900,
    null,
    '11000000-0000-4000-8000-000000000011',
    'hvac',
    'Mechanical Equipment',
    'loadable',
    'wall',
    array['2022', '2023', '2024', '2025', '2026'],
    '.rfa',
    true,
    false,
    'Hydronic Panel Radiator Revit Family | BIMVORA',
    'Wall-hosted hydronic panel radiator with parametric size, output and pipe connectors.'
  ),
  (
    'a5555555-5555-4555-8555-555555555555',
    'inline-centrifugal-pump',
    'In-line Centrifugal Pump',
    'BL-PLB-PMP-IL-05',
    'In-line pump with flanged connectors, motor nested family and duty-point parameters.',
    $md$Unhosted in-line centrifugal pump for hydronic and condenser water loops.

Flanged pipe connectors, nested motor, and instance parameters for flow, head, efficiency and absorbed power. Isolation valve nested types are optional visibility.$md$,
    5900,
    7500,
    '12000000-0000-4000-8000-000000000006',
    'plumbing',
    'Mechanical Equipment',
    'loadable',
    'unhosted',
    array['2022', '2023', '2024', '2025', '2026'],
    '.rfa',
    true,
    true,
    'In-line Centrifugal Pump Revit Family | BIMVORA',
    'Parametric in-line centrifugal pump family with flanged connectors and duty-point shared parameters.'
  ),
  (
    'a6666666-6666-4666-8666-666666666666',
    'rectangular-fire-damper',
    'Rectangular Fire Damper',
    'BL-FIR-DMP-RC-06',
    'Fire damper with wall/duct host options, fusible-link graphics and fire-rating types.',
    $md$Rectangular fire damper for fire compartment walls and shafts.

Wall-hosted and face-hosted types. Blade graphics, fusible link, and access panel. Fire rating (EI 60 / EI 90 / EI 120) as types. Duct size parametric to 200×200 through 1200×800 mm.$md$,
    4500,
    null,
    '11000000-0000-4000-8000-000000000008',
    'fire_protection',
    'Duct Accessory',
    'loadable',
    'wall',
    array['2023', '2024', '2025', '2026'],
    '.rfa',
    true,
    false,
    'Rectangular Fire Damper Revit Family | BIMVORA',
    'Wall-hosted rectangular fire damper with EI rating types and parametric duct sizes.'
  ),
  (
    'a7777777-7777-4777-8777-777777777777',
    'square-ceiling-diffuser',
    'Square Ceiling Diffuser',
    'BL-HVAC-DIF-SQ-07',
    'Ceiling-hosted square diffuser with neck sizes, core types and airflow parameters.',
    $md$Square ceiling diffuser for offices and education.

Neck diameter types, 1–4 cone cores, and optional plenum box nested family. Airflow, throw and NC rating parameters. Hosts to ceiling grids with alignment reference.$md$,
    2900,
    null,
    '11000000-0000-4000-8000-000000000006',
    'hvac',
    'Air Terminal',
    'loadable',
    'ceiling',
    array['2022', '2023', '2024', '2025', '2026'],
    '.rfa',
    true,
    true,
    'Square Ceiling Diffuser Revit Family | BIMVORA',
    'Ceiling-hosted square diffuser family with parametric neck sizes and nested plenum box.'
  ),
  (
    'a8888888-8888-4666-8888-888888888888',
    'roof-exhaust-fan',
    'Roof Exhaust Fan',
    'BL-HVAC-FAN-RF-08',
    'Curb-mounted centrifugal exhaust fan with roof host, curb nested family and electrical connector.',
    $md$Roof-mounted centrifugal exhaust fan.

Level/roof hosted with nested curb. Discharge cowl, bird screen and electrical connector. Duty parameters: airflow, static pressure, power and weight for structural coordination.$md$,
    7900,
    null,
    '11000000-0000-4000-8000-000000000005',
    'hvac',
    'Mechanical Equipment',
    'loadable',
    'face',
    array['2022', '2023', '2024', '2025', '2026'],
    '.rfa',
    true,
    false,
    'Roof Exhaust Fan Revit Family | BIMVORA',
    'Curb-mounted roof exhaust fan with nested curb, electrical connector and duty parameters.'
  ),
  (
    'a9999999-9999-4999-8999-999999999999',
    'condensing-boiler',
    'Condensing Boiler',
    'BL-HVAC-BLR-CD-09',
    'Floor-standing condensing boiler with flue, gas, heating flow/return and condensate connectors.',
    $md$Floor-standing condensing boiler for plant rooms.

Connectors: heating flow/return, gas, condensate, flue. Clearance envelope for service access. Output types from 45 to 280 kW. Weight and electrical load for coordination.$md$,
    12900,
    null,
    '11000000-0000-4000-8000-000000000011',
    'hvac',
    'Mechanical Equipment',
    'loadable',
    'level',
    array['2023', '2024', '2025', '2026'],
    '.rfa',
    true,
    true,
    'Condensing Boiler Revit Family | BIMVORA',
    'Floor-standing condensing boiler family with hydronic, gas, flue and condensate connectors.'
  ),
  (
    'aa101010-1010-4101-8101-101010101010',
    'brazed-plate-heat-exchanger',
    'Brazed Plate Heat Exchanger',
    'BL-HVAC-HEX-BP-10',
    'Compact brazed PHE with primary/secondary connectors and plate-count types.',
    $md$Brazed plate heat exchanger for district heating interfaces and DHW generation.

Primary and secondary pipe connectors with configurable handedness. Plate count types. Duty parameters: capacity, pressure drop, approach temperature.$md$,
    6400,
    null,
    '11000000-0000-4000-8000-000000000011',
    'hvac',
    'Mechanical Equipment',
    'loadable',
    'unhosted',
    array['2022', '2023', '2024', '2025', '2026'],
    '.rfa',
    true,
    false,
    'Brazed Plate Heat Exchanger Revit Family | BIMVORA',
    'Compact brazed plate heat exchanger family with primary/secondary connectors and duty parameters.'
  ),
  (
    'ab111111-0000-4000-8000-000000000001',
    'internal-draft-ahu-unpublished',
    'Draft AHU — Internal Only',
    'BL-DRAFT-AHU-00',
    'Unpublished draft used to verify RLS hides non-public catalog items.',
    'This family must never appear on the storefront.',
    100,
    null,
    '11000000-0000-4000-8000-000000000001',
    'hvac',
    'Mechanical Equipment',
    'loadable',
    'unhosted',
    array['2026'],
    '.rfa',
    false,
    false,
    null,
    null
  )
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  sku = excluded.sku,
  short_description = excluded.short_description,
  description = excluded.description,
  price_cents = excluded.price_cents,
  compare_at_price_cents = excluded.compare_at_price_cents,
  category_id = excluded.category_id,
  discipline = excluded.discipline,
  revit_category = excluded.revit_category,
  family_kind = excluded.family_kind,
  hosting = excluded.hosting,
  revit_versions = excluded.revit_versions,
  file_format = excluded.file_format,
  is_published = excluded.is_published,
  is_featured = excluded.is_featured,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description;

delete from public.product_images
where product_id in (
  'a1111111-1111-4111-8111-111111111111',
  'a2222222-2222-4222-8222-222222222222',
  'a3333333-3333-4333-8333-333333333333',
  'a4444444-4444-4444-8444-444444444444',
  'a5555555-5555-4555-8555-555555555555',
  'a6666666-6666-4666-8666-666666666666',
  'a7777777-7777-4777-8777-777777777777',
  'a8888888-8888-4666-8888-888888888888',
  'a9999999-9999-4999-8999-999999999999',
  'aa101010-1010-4101-8101-101010101010'
);

insert into public.product_images (product_id, url, alt, sort_order, is_primary)
values
  ('a1111111-1111-4111-8111-111111111111', '/families/vav-box.svg', 'Dual-duct VAV box family preview', 0, true),
  ('a2222222-2222-4222-8222-222222222222', '/families/ahu.svg', 'Packaged air handling unit family preview', 0, true),
  ('a3333333-3333-4333-8333-333333333333', '/families/fan-coil.svg', 'Ceiling cassette fan coil family preview', 0, true),
  ('a4444444-4444-4444-8444-444444444444', '/families/radiator.svg', 'Hydronic panel radiator family preview', 0, true),
  ('a5555555-5555-4555-8555-555555555555', '/families/pump.svg', 'In-line centrifugal pump family preview', 0, true),
  ('a6666666-6666-4666-8666-666666666666', '/families/fire-damper.svg', 'Rectangular fire damper family preview', 0, true),
  ('a7777777-7777-4777-8777-777777777777', '/families/diffuser.svg', 'Square ceiling diffuser family preview', 0, true),
  ('a8888888-8888-4666-8888-888888888888', '/families/exhaust-fan.svg', 'Roof exhaust fan family preview', 0, true),
  ('a9999999-9999-4999-8999-999999999999', '/families/boiler.svg', 'Condensing boiler family preview', 0, true),
  ('aa101010-1010-4101-8101-101010101010', '/families/heat-exchanger.svg', 'Brazed plate heat exchanger family preview', 0, true);

delete from public.product_files
where product_id in (
  'a1111111-1111-4111-8111-111111111111',
  'a2222222-2222-4222-8222-222222222222',
  'a3333333-3333-4333-8333-333333333333',
  'a4444444-4444-4444-8444-444444444444',
  'a5555555-5555-4555-8555-555555555555',
  'a6666666-6666-4666-8666-666666666666',
  'a7777777-7777-4777-8777-777777777777',
  'a8888888-8888-4666-8888-888888888888',
  'a9999999-9999-4999-8999-999999999999',
  'aa101010-1010-4101-8101-101010101010'
);

insert into public.product_files (product_id, storage_path, filename, revit_version, file_size_bytes)
values
  ('a1111111-1111-4111-8111-111111111111', 'families/vav-box/BL-HVAC-VAV-DD-01.rfa', 'BL-HVAC-VAV-DD-01.rfa', '2025', 1843200),
  ('a2222222-2222-4222-8222-222222222222', 'families/ahu/BL-HVAC-AHU-PK-02.rfa', 'BL-HVAC-AHU-PK-02.rfa', '2025', 3145728),
  ('a3333333-3333-4333-8333-333333333333', 'families/fcu/BL-HVAC-FCU-CC-03.rfa', 'BL-HVAC-FCU-CC-03.rfa', '2025', 983040),
  ('a4444444-4444-4444-8444-444444444444', 'families/radiator/BL-HVAC-RAD-PN-04.rfa', 'BL-HVAC-RAD-PN-04.rfa', '2025', 512000),
  ('a5555555-5555-4555-8555-555555555555', 'families/pump/BL-PLB-PMP-IL-05.rfa', 'BL-PLB-PMP-IL-05.rfa', '2025', 737280),
  ('a6666666-6666-4666-8666-666666666666', 'families/damper/BL-FIR-DMP-RC-06.rfa', 'BL-FIR-DMP-RC-06.rfa', '2025', 655360),
  ('a7777777-7777-4777-8777-777777777777', 'families/diffuser/BL-HVAC-DIF-SQ-07.rfa', 'BL-HVAC-DIF-SQ-07.rfa', '2025', 409600),
  ('a8888888-8888-4666-8888-888888888888', 'families/fan/BL-HVAC-FAN-RF-08.rfa', 'BL-HVAC-FAN-RF-08.rfa', '2025', 1228800),
  ('a9999999-9999-4999-8999-999999999999', 'families/boiler/BL-HVAC-BLR-CD-09.rfa', 'BL-HVAC-BLR-CD-09.rfa', '2025', 2097152),
  ('aa101010-1010-4101-8101-101010101010', 'families/hex/BL-HVAC-HEX-BP-10.rfa', 'BL-HVAC-HEX-BP-10.rfa', '2025', 860160);
