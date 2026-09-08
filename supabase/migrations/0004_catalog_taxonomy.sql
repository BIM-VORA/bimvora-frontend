-- Three-department catalog taxonomy:
-- HVAC / Mechanical, Plumbing, Clean Room / Pharmaceutical.

update public.categories
set
  slug = 'hvac-mechanical',
  name = 'HVAC / Mechanical',
  description = 'Mechanical plant, airside systems, hydronic equipment and HVAC distribution families.',
  parent_id = null,
  discipline = 'hvac',
  sort_order = 10,
  is_active = true
where id = '11111111-1111-4111-8111-111111111111';

update public.categories
set
  name = 'Plumbing',
  description = 'Water supply, sanitary fixtures, drainage and plumbing equipment families.',
  parent_id = null,
  discipline = 'plumbing',
  sort_order = 20,
  is_active = true
where id = '44444444-4444-4444-8444-444444444444';

insert into public.categories (
  id, slug, name, description, parent_id, discipline, sort_order, is_active
)
values
  (
    '10000000-0000-4000-8000-000000000003',
    'clean-room-pharmaceutical',
    'Clean Room / Pharmaceutical',
    'Controlled-environment and pharmaceutical clean-room equipment and architectural families.',
    null,
    'clean_room',
    30,
    true
  ),

  ('11000000-0000-4000-8000-000000000001', 'ahu-cta-uta', 'AHU / CTA / UTA', 'Air-handling units for commercial, industrial and technical installations.', '11111111-1111-4111-8111-111111111111', 'hvac', 101, true),
  ('11000000-0000-4000-8000-000000000002', 'chillers', 'Chiller', 'Air- and water-cooled chiller families for plant-room coordination.', '11111111-1111-4111-8111-111111111111', 'hvac', 102, true),
  ('11000000-0000-4000-8000-000000000003', 'fcu', 'FCU', 'Fan-coil units with hydronic, condensate and electrical connectors.', '11111111-1111-4111-8111-111111111111', 'hvac', 103, true),
  ('11000000-0000-4000-8000-000000000004', 'heat-pumps', 'Heat Pump', 'Air-source and water-source heat pump equipment.', '11111111-1111-4111-8111-111111111111', 'hvac', 104, true),
  ('11000000-0000-4000-8000-000000000005', 'fans', 'Fans', 'Supply, extract, roof and inline fan families.', '11111111-1111-4111-8111-111111111111', 'hvac', 105, true),
  ('11000000-0000-4000-8000-000000000006', 'diffusers-grilles', 'Diffusers & Grilles', 'Air terminals with parametric airflow and neck sizes.', '11111111-1111-4111-8111-111111111111', 'hvac', 106, true),
  ('11000000-0000-4000-8000-000000000007', 'ducts-accessories', 'Ducts & Accessories', 'Duct distribution components and installation accessories.', '11111111-1111-4111-8111-111111111111', 'hvac', 107, true),
  ('11000000-0000-4000-8000-000000000008', 'dampers', 'Dampers', 'Volume-control, fire and smoke damper families.', '11111111-1111-4111-8111-111111111111', 'hvac', 108, true),
  ('11000000-0000-4000-8000-000000000009', 'hvac-pumps', 'Pumps', 'Hydronic circulation and plant pumps.', '11111111-1111-4111-8111-111111111111', 'hvac', 109, true),
  ('11000000-0000-4000-8000-000000000010', 'hvac-valves', 'Valves', 'Control, isolation and balancing valves for HVAC systems.', '11111111-1111-4111-8111-111111111111', 'hvac', 110, true),
  ('11000000-0000-4000-8000-000000000011', 'hvac-piping', 'HVAC Piping', 'Hydronic piping equipment, fittings and accessories.', '11111111-1111-4111-8111-111111111111', 'hvac', 111, true),

  ('12000000-0000-4000-8000-000000000001', 'cold-hot-water', 'Cold / Hot Water', 'Domestic cold-water and hot-water distribution families.', '44444444-4444-4444-8444-444444444444', 'plumbing', 201, true),
  ('12000000-0000-4000-8000-000000000002', 'sanitary-fixtures', 'WC / Wash Basin / Shower / Sink', 'Sanitary fixtures with supply and waste connectors.', '44444444-4444-4444-8444-444444444444', 'plumbing', 202, true),
  ('12000000-0000-4000-8000-000000000003', 'drainage-waste', 'Drainage & Waste', 'Gravity drainage, waste and vent system components.', '44444444-4444-4444-8444-444444444444', 'plumbing', 203, true),
  ('12000000-0000-4000-8000-000000000004', 'water-heaters', 'Water Heater', 'Domestic water-heating equipment and cylinders.', '44444444-4444-4444-8444-444444444444', 'plumbing', 204, true),
  ('12000000-0000-4000-8000-000000000005', 'tanks', 'Tanks', 'Water-storage, break and expansion tanks.', '44444444-4444-4444-8444-444444444444', 'plumbing', 205, true),
  ('12000000-0000-4000-8000-000000000006', 'plumbing-pumps', 'Pumps', 'Booster, transfer, drainage and domestic-water pumps.', '44444444-4444-4444-8444-444444444444', 'plumbing', 206, true),
  ('12000000-0000-4000-8000-000000000007', 'plumbing-valves', 'Valves', 'Isolation, check, pressure-reducing and mixing valves.', '44444444-4444-4444-8444-444444444444', 'plumbing', 207, true),
  ('12000000-0000-4000-8000-000000000008', 'plumbing-accessories', 'Plumbing Accessories', 'Supporting plumbing components for coordinated models.', '44444444-4444-4444-8444-444444444444', 'plumbing', 208, true),

  ('13000000-0000-4000-8000-000000000001', 'hepa-filters', 'HEPA Filter', 'Terminal and inline HEPA filtration families.', '10000000-0000-4000-8000-000000000003', 'clean_room', 301, true),
  ('13000000-0000-4000-8000-000000000002', 'ffu', 'FFU', 'Fan filter units for controlled environments.', '10000000-0000-4000-8000-000000000003', 'clean_room', 302, true),
  ('13000000-0000-4000-8000-000000000003', 'laf', 'LAF', 'Laminar airflow benches, cabinets and canopies.', '10000000-0000-4000-8000-000000000003', 'clean_room', 303, true),
  ('13000000-0000-4000-8000-000000000004', 'clean-room-ahu', 'Clean Room AHU', 'Hygienic air-handling units for clean-room systems.', '10000000-0000-4000-8000-000000000003', 'clean_room', 304, true),
  ('13000000-0000-4000-8000-000000000005', 'pass-box', 'Pass Box', 'Static and dynamic material pass-box families.', '10000000-0000-4000-8000-000000000003', 'clean_room', 305, true),
  ('13000000-0000-4000-8000-000000000006', 'air-shower', 'Air Shower', 'Personnel and material air-shower equipment.', '10000000-0000-4000-8000-000000000003', 'clean_room', 306, true),
  ('13000000-0000-4000-8000-000000000007', 'clean-room-doors', 'Clean Room Doors', 'Flush hygienic doors for controlled areas.', '10000000-0000-4000-8000-000000000003', 'clean_room', 307, true),
  ('13000000-0000-4000-8000-000000000008', 'sas-personnel-material', 'SAS Personnel / SAS Material', 'Personnel and material airlock assemblies.', '10000000-0000-4000-8000-000000000003', 'clean_room', 308, true),
  ('13000000-0000-4000-8000-000000000009', 'gowning-room', 'Gowning Room', 'Gowning-room benches, storage and supporting equipment.', '10000000-0000-4000-8000-000000000003', 'clean_room', 309, true)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  parent_id = excluded.parent_id,
  discipline = excluded.discipline,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

-- Reclassify the current sample catalog into the new subcategories.
update public.products set category_id = '11000000-0000-4000-8000-000000000008' where slug = 'modular-vav-box-dual-duct';
update public.products set category_id = '11000000-0000-4000-8000-000000000001' where slug = 'packaged-air-handling-unit';
update public.products set category_id = '11000000-0000-4000-8000-000000000003' where slug = 'ceiling-cassette-fan-coil';
update public.products set category_id = '11000000-0000-4000-8000-000000000011' where slug = 'panel-radiator-hydronic';
update public.products set category_id = '12000000-0000-4000-8000-000000000006' where slug = 'inline-centrifugal-pump';
update public.products set category_id = '11000000-0000-4000-8000-000000000008' where slug = 'rectangular-fire-damper';
update public.products set category_id = '11000000-0000-4000-8000-000000000006' where slug = 'square-ceiling-diffuser';
update public.products set category_id = '11000000-0000-4000-8000-000000000005' where slug = 'roof-exhaust-fan';
update public.products set category_id = '11000000-0000-4000-8000-000000000011' where slug = 'condensing-boiler';
update public.products set category_id = '11000000-0000-4000-8000-000000000011' where slug = 'brazed-plate-heat-exchanger';

update public.categories
set is_active = false
where id in (
  '22222222-2222-4222-8222-222222222222',
  '33333333-3333-4333-8333-333333333333',
  '55555555-5555-4555-8555-555555555555'
);

update public.family_packs
set
  description = 'A focused family collection for one department: HVAC / Mechanical, Plumbing or Clean Room / Pharmaceutical.',
  features = array[
    'One complete department collection',
    'HVAC, Plumbing or Clean Room',
    'Coordinated connectors',
    'Consistent naming and parameters'
  ]
where slug = 'family-group';
