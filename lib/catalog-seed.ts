import type { Category, Product } from "@/types/catalog";

const HVAC_ID = "11111111-1111-4111-8111-111111111111";
const PLUMBING_ID = "44444444-4444-4444-8444-444444444444";
const CLEAN_ROOM_ID = "10000000-0000-4000-8000-000000000003";

function category(
  id: string,
  slug: string,
  name: string,
  discipline: Category["discipline"],
  sortOrder: number,
  parentId: string | null,
  description: string,
): Category {
  return { id, slug, name, description, parentId, discipline, sortOrder, isActive: true };
}

// --- Departments (level 1) -------------------------------------------------
const DEPARTMENTS: Category[] = [
  category(HVAC_ID, "hvac-mechanical", "HVAC / Mechanical", "hvac", 10, null, "Mechanical plant, airside systems, hydronic equipment and HVAC distribution families."),
  category(PLUMBING_ID, "plumbing", "Plumbing", "plumbing", 20, null, "Water supply, sanitary fixtures, drainage and plumbing equipment families."),
  category(CLEAN_ROOM_ID, "clean-room-pharmaceutical", "Clean Room / Pharmaceutical", "clean_room", 30, null, "Controlled-environment and pharmaceutical clean-room equipment and architectural families."),
];

// --- Product categories (level 2) -----------------------------------------
const CATEGORIES_L2: Category[] = [
  // HVAC
  category("11000000-0000-4000-8000-000000000002", "chillers", "Chillers", "hvac", 101, HVAC_ID, "Air- and water-cooled chillers for plant-room coordination."),
  category("11000000-0000-4000-8000-000000000003", "fcu", "FCU – Fan Coil Units", "hvac", 102, HVAC_ID, "Fan-coil units with hydronic, condensate and electrical connectors."),
  category("11000000-0000-4000-8000-000000000004", "heat-pumps", "Heat Pumps", "hvac", 103, HVAC_ID, "Air-source, water-source and ground-source heat pump equipment."),
  category("11000000-0000-4000-8000-000000000005", "fans", "Fans", "hvac", 104, HVAC_ID, "Supply, extract, roof, inline and smoke-extraction fans."),
  category("11000000-0000-4000-8000-000000000006", "diffusers-grilles", "Diffusers & Grilles", "hvac", 105, HVAC_ID, "Air terminals with parametric airflow and neck sizes."),
  category("11000000-0000-4000-8000-000000000007", "ducts-accessories", "Ducts & Accessories", "hvac", 106, HVAC_ID, "Duct distribution components and installation accessories."),
  category("11000000-0000-4000-8000-000000000008", "dampers", "Dampers", "hvac", 107, HVAC_ID, "Volume-control, fire, smoke, motorized and backdraft dampers."),
  category("11000000-0000-4000-8000-000000000009", "hvac-pumps", "Pumps", "hvac", 108, HVAC_ID, "Hydronic circulation and plant pumps."),
  category("11000000-0000-4000-8000-000000000010", "hvac-valves", "Valves", "hvac", 109, HVAC_ID, "Control, isolation and balancing valves for HVAC systems."),
  category("11000000-0000-4000-8000-000000000011", "hvac-piping", "HVAC Piping", "hvac", 110, HVAC_ID, "Hydronic piping, fittings and accessories."),

  // Plumbing
  category("12000000-0000-4000-8000-000000000001", "cold-hot-water", "Cold / Hot Water", "plumbing", 201, PLUMBING_ID, "Domestic cold-water and hot-water distribution families."),
  category("12000000-0000-4000-8000-000000000002", "sanitary-fixtures", "WC / Wash Basin / Shower / Sink", "plumbing", 202, PLUMBING_ID, "Sanitary fixtures with supply and waste connectors."),
  category("12000000-0000-4000-8000-000000000003", "drainage-waste", "Drainage & Waste", "plumbing", 203, PLUMBING_ID, "Gravity drainage, waste and vent system components."),
  category("12000000-0000-4000-8000-000000000004", "water-heaters", "Water Heater", "plumbing", 204, PLUMBING_ID, "Domestic water-heating equipment and cylinders."),
  category("12000000-0000-4000-8000-000000000005", "tanks", "Tanks", "plumbing", 205, PLUMBING_ID, "Water-storage, break and expansion tanks."),
  category("12000000-0000-4000-8000-000000000006", "plumbing-pumps", "Pumps", "plumbing", 206, PLUMBING_ID, "Booster, transfer, drainage and domestic-water pumps."),
  category("12000000-0000-4000-8000-000000000007", "plumbing-valves", "Valves", "plumbing", 207, PLUMBING_ID, "Isolation, check, pressure-reducing and mixing valves."),
  category("12000000-0000-4000-8000-000000000008", "plumbing-accessories", "Plumbing Accessories", "plumbing", 208, PLUMBING_ID, "Supporting plumbing components for coordinated models."),

  // Clean Room / Pharmaceutical
  category("13000000-0000-4000-8000-000000000001", "hepa-filters", "HEPA Filter", "clean_room", 301, CLEAN_ROOM_ID, "Terminal and inline HEPA filtration families."),
  category("13000000-0000-4000-8000-000000000002", "ffu", "FFU", "clean_room", 302, CLEAN_ROOM_ID, "Fan filter units for controlled environments."),
  category("13000000-0000-4000-8000-000000000003", "laf", "LAF", "clean_room", 303, CLEAN_ROOM_ID, "Laminar airflow benches, cabinets and canopies."),
  category("13000000-0000-4000-8000-000000000004", "clean-room-ahu", "Clean Room AHU", "clean_room", 304, CLEAN_ROOM_ID, "Hygienic air-handling units for clean-room systems."),
  category("13000000-0000-4000-8000-000000000005", "pass-box", "Pass Box", "clean_room", 305, CLEAN_ROOM_ID, "Static and dynamic material pass-box families."),
  category("13000000-0000-4000-8000-000000000006", "air-shower", "Air Shower", "clean_room", 306, CLEAN_ROOM_ID, "Personnel and material air-shower equipment."),
  category("13000000-0000-4000-8000-000000000007", "clean-room-doors", "Clean Room Doors", "clean_room", 307, CLEAN_ROOM_ID, "Flush hygienic doors for controlled areas."),
  category("13000000-0000-4000-8000-000000000008", "sas-personnel-material", "SAS Personnel / SAS Material", "clean_room", 308, CLEAN_ROOM_ID, "Personnel and material airlock assemblies."),
  category("13000000-0000-4000-8000-000000000009", "gowning-room", "Gowning Room", "clean_room", 309, CLEAN_ROOM_ID, "Gowning-room benches, storage and supporting equipment."),
];

// --- Product types (level 3) ----------------------------------------------
// Compact source of truth: parent category slug -> ordered product type names.
const PRODUCT_TYPES: Record<string, string[]> = {
  // HVAC
  chillers: ["Air Cooled Chiller", "Water Cooled Chiller", "Scroll Chiller", "Screw Chiller", "Centrifugal Chiller"],
  fcu: ["2-Pipe FCU", "4-Pipe FCU", "Ceiling FCU", "Ducted FCU", "Cassette FCU"],
  "heat-pumps": ["Air Source Heat Pump", "Water Source Heat Pump", "Ground Source Heat Pump", "VRF Outdoor Unit", "Monobloc Heat Pump"],
  fans: ["Axial Fan", "Centrifugal Fan", "Exhaust Fan", "Inline Fan", "Roof Fan", "Smoke Extraction Fan"],
  "diffusers-grilles": ["Ceiling Diffuser", "Linear Diffuser", "Jet Diffuser", "Supply Grille", "Return Grille", "Exhaust Grille"],
  "ducts-accessories": ["Rectangular Duct", "Circular Duct", "Flexible Duct", "Duct Connector", "Duct Insulation", "Access Door"],
  dampers: ["Volume Control Damper", "Fire Damper", "Smoke Damper", "Motorized Damper", "Backdraft Damper"],
  "hvac-pumps": ["Inline Pump", "End Suction Pump", "Twin Pump", "Primary Pump", "Secondary Pump"],
  "hvac-valves": ["2-Way Valve", "3-Way Valve", "Butterfly Valve", "Ball Valve", "Globe Valve", "Check Valve", "PICV"],
  "hvac-piping": ["Steel Pipe", "Copper Pipe", "PPR Pipe", "HDPE Pipe", "Insulated Pipe", "Chilled Water Pipe"],
  // Plumbing
  "cold-hot-water": ["PPR Water Pipe", "PEX Water Pipe", "Copper Water Pipe", "Manifold", "Pressure Reducing Set", "Water Meter"],
  "sanitary-fixtures": ["WC", "Wash Basin", "Shower", "Sink", "Urinal", "Bidet"],
  "drainage-waste": ["PVC Drainage Pipe", "Floor Drain", "Gully Trap", "Vent Pipe", "Cleanout", "Grease Trap"],
  "water-heaters": ["Electric Water Heater", "Gas Water Heater", "Storage Cylinder", "Instantaneous Heater", "Solar Water Heater"],
  tanks: ["Storage Tank", "Break Tank", "Expansion Tank", "GRP Sectional Tank", "Pressure Vessel"],
  "plumbing-pumps": ["Booster Pump", "Sump Pump", "Submersible Pump", "Transfer Pump", "Circulator Pump"],
  "plumbing-valves": ["Gate Valve", "Ball Valve", "Check Valve", "Pressure Reducing Valve", "Float Valve", "Mixing Valve"],
  "plumbing-accessories": ["Pipe Support", "Air Vent", "Strainer", "Flexible Connector", "Trap"],
  // Clean Room / Pharmaceutical
  "hepa-filters": ["Terminal HEPA Filter", "Ducted HEPA Filter", "HEPA Filter Box", "ULPA Filter", "Bag-In Bag-Out Filter"],
  ffu: ["2x2 FFU", "2x4 FFU", "Room-Side Replaceable FFU", "EC Motor FFU"],
  laf: ["Horizontal LAF", "Vertical LAF", "LAF Trolley", "LAF Canopy"],
  "clean-room-ahu": ["Hygienic AHU", "Recirculation AHU", "Make-Up Air AHU", "Ducted AHU"],
  "pass-box": ["Static Pass Box", "Dynamic Pass Box", "Ventilated Pass Box", "BioSafety Pass Box"],
  "air-shower": ["Personnel Air Shower", "Material Air Shower", "Tunnel Air Shower", "Cargo Air Shower"],
  "clean-room-doors": ["Single Leaf Door", "Double Leaf Door", "Sliding Door", "Vision Panel Door", "Interlock Door"],
  "sas-personnel-material": ["SAS Personnel", "SAS Material", "Airlock", "De-Gowning SAS"],
  "gowning-room": ["Gowning Bench", "SS Storage Locker", "Garment Rack", "Cross-Over Bench", "Step-Over Bench"],
};

function kebab(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Stable id for a product type, derived from its unique slug. */
export function productTypeId(slug: string): string {
  return `type-${slug}`;
}

const L2_BY_SLUG = Object.fromEntries(CATEGORIES_L2.map((c) => [c.slug, c]));

const PRODUCT_TYPE_CATEGORIES: Category[] = Object.entries(PRODUCT_TYPES).flatMap(
  ([parentSlug, names]) => {
    const parent = L2_BY_SLUG[parentSlug];
    if (!parent) return [];
    return names.map((name, index) => {
      const slug = `${parentSlug}-${kebab(name)}`;
      return category(
        productTypeId(slug),
        slug,
        name,
        parent.discipline,
        parent.sortOrder * 100 + index + 1,
        parent.id,
        `${name} Revit families under ${parent.name}.`,
      );
    });
  },
);

export const SEED_CATEGORIES: Category[] = [
  ...DEPARTMENTS,
  ...CATEGORIES_L2,
  ...PRODUCT_TYPE_CATEGORIES,
];

const byId = Object.fromEntries(SEED_CATEGORIES.map((c) => [c.id, c]));

/** Resolve a product type category id from its slug (helper for seeding). */
function typeBySlug(slug: string): string {
  const found = SEED_CATEGORIES.find((c) => c.slug === slug);
  if (!found) throw new Error(`Unknown product type slug: ${slug}`);
  return found.id;
}

function product(
  partial: Omit<Product, "images" | "category"> & {
    image: string;
    fileSizeBytes: number;
  },
): Product {
  const category = byId[partial.categoryId];
  return {
    ...partial,
    category,
    images: [
      {
        id: `${partial.id}-img`,
        url: partial.image,
        alt: `${partial.name} family preview`,
        sortOrder: 0,
        isPrimary: true,
      },
    ],
  };
}

export const SEED_PRODUCTS: Product[] = [
  product({
    id: "a1111111-1111-4111-8111-111111111111",
    slug: "modular-vav-box-dual-duct",
    name: "Modular VAV Box — Dual Duct",
    sku: "BV-HVAC-VAV-DD-01",
    shortDescription:
      "Parametric dual-duct VAV terminal with heating/cooling inlets, reheat coil option and nested connectors.",
    description:
      "Loadable Mechanical Equipment family for variable air volume terminals.\n\nBuilt for coordinated HVAC models: dual inlets, discharge connector, optional hot-water reheat coil and shared parameters for airflow, pressure drop and sound power.\n\nIncludes type catalogues for 6–16 in. inlets and instance parameters for damper position, min/max airflow and control sequence tags.",
    priceCents: 100,
    compareAtPriceCents: null,
    categoryId: typeBySlug("dampers-volume-control-damper"),
    discipline: "hvac",
    manufacturer: "Airflow Systems",
    revitCategory: "Mechanical Equipment",
    familyKind: "loadable",
    hosting: "unhosted",
    revitVersions: ["2022", "2023", "2024", "2025", "2026"],
    fileFormat: ".rfa",
    cadFormats: [".dwg"],
    hasDatasheet: true,
    isPublished: true,
    isFeatured: true,
    seoTitle: "Modular Dual-Duct VAV Box Revit Family | BIMVORA",
    seoDescription:
      "Professional dual-duct VAV box Revit family for HVAC models. Nested connectors, reheat coil option, Revit 2022–2026.",
    image: "/families/vav-box.svg",
    fileSizeBytes: 1843200,
  }),
  product({
    id: "a2222222-2222-4222-8222-222222222222",
    slug: "packaged-air-handling-unit",
    name: "Packaged Air Handling Unit",
    sku: "BV-HVAC-AHU-PK-02",
    shortDescription:
      "Modular AHU with mixing box, filters, coils and fan section. Clearance envelopes included.",
    description:
      "Sectional air handling unit for plant rooms and roof plant.\n\nMixing box, bag filter, heating/cooling coils and supply fan are nested families so you can schedule components independently. Clearance volumes are visibility-controlled for clash detection.\n\nShared parameters cover airflow, external static pressure, coil kW, filter class and electrical load.",
    priceCents: 100,
    compareAtPriceCents: null,
    categoryId: typeBySlug("fans-centrifugal-fan"),
    discipline: "hvac",
    manufacturer: "Airflow Systems",
    revitCategory: "Mechanical Equipment",
    familyKind: "loadable",
    hosting: "level",
    revitVersions: ["2023", "2024", "2025", "2026"],
    fileFormat: ".rfa",
    cadFormats: [".dwg", ".dxf"],
    hasDatasheet: true,
    isPublished: true,
    isFeatured: true,
    seoTitle: "Packaged Air Handling Unit Revit Family | BIMVORA",
    seoDescription:
      "Parametric packaged AHU Revit family with nested coils, filters and fan. Built for plant-room coordination.",
    image: "/families/ahu.svg",
    fileSizeBytes: 3145728,
  }),
  product({
    id: "a3333333-3333-4333-8333-333333333333",
    slug: "ceiling-cassette-fan-coil",
    name: "Ceiling Cassette Fan Coil",
    sku: "BV-HVAC-FCU-CC-03",
    shortDescription:
      "Four-way cassette FCU with ceiling host, condensate connector and 2-pipe / 4-pipe types.",
    description:
      "Ceiling-hosted fan coil unit with four-way discharge, return air plenum and hydronic connectors.\n\n2-pipe and 4-pipe type catalogues, cooling/heating capacity parameters, and a nested condensate drain connector. Recess depth is parametric for ceiling void coordination.",
    priceCents: 100,
    compareAtPriceCents: null,
    categoryId: typeBySlug("fcu-cassette-fcu"),
    discipline: "hvac",
    manufacturer: "Thermacore",
    revitCategory: "Mechanical Equipment",
    familyKind: "loadable",
    hosting: "ceiling",
    revitVersions: ["2022", "2023", "2024", "2025", "2026"],
    fileFormat: ".rfa",
    cadFormats: [".dwg"],
    hasDatasheet: true,
    isPublished: true,
    isFeatured: true,
    seoTitle: "Ceiling Cassette Fan Coil Revit Family | BIMVORA",
    seoDescription:
      "Ceiling-hosted four-way cassette FCU family with 2-pipe and 4-pipe types for HVAC coordination.",
    image: "/families/fan-coil.svg",
    fileSizeBytes: 983040,
  }),
  product({
    id: "a4444444-4444-4444-8444-444444444444",
    slug: "panel-radiator-hydronic",
    name: "Panel Radiator — Hydronic",
    sku: "BV-HVAC-RAD-PN-04",
    shortDescription:
      "Wall-hosted compact and plus radiator types with pipe connectors and output schedules.",
    description:
      "Wall-hosted hydronic panel radiator for residential and commercial heating.\n\nCompact, plus and convectors types. Length, height and depth are type-driven. Supply/return pipe connectors sit at configurable centres. Output (W) is formula-driven from size and mean water temperature.",
    priceCents: 100,
    compareAtPriceCents: null,
    categoryId: typeBySlug("hvac-piping-insulated-pipe"),
    discipline: "hvac",
    manufacturer: "Thermacore",
    revitCategory: "Mechanical Equipment",
    familyKind: "loadable",
    hosting: "wall",
    revitVersions: ["2022", "2023", "2024", "2025", "2026"],
    fileFormat: ".rfa",
    cadFormats: [".dwg"],
    hasDatasheet: false,
    isPublished: true,
    isFeatured: false,
    seoTitle: "Hydronic Panel Radiator Revit Family | BIMVORA",
    seoDescription:
      "Wall-hosted hydronic panel radiator with parametric size, output and pipe connectors.",
    image: "/families/radiator.svg",
    fileSizeBytes: 512000,
  }),
  product({
    id: "a5555555-5555-4555-8555-555555555555",
    slug: "inline-centrifugal-pump",
    name: "In-line Centrifugal Pump",
    sku: "BV-PLB-PMP-IL-05",
    shortDescription:
      "In-line pump with flanged connectors, motor nested family and duty-point parameters.",
    description:
      "Unhosted in-line centrifugal pump for hydronic and condenser water loops.\n\nFlanged pipe connectors, nested motor, and instance parameters for flow, head, efficiency and absorbed power. Isolation valve nested types are optional visibility.",
    priceCents: 100,
    compareAtPriceCents: null,
    categoryId: typeBySlug("plumbing-pumps-circulator-pump"),
    discipline: "plumbing",
    manufacturer: "Hydroline",
    revitCategory: "Mechanical Equipment",
    familyKind: "loadable",
    hosting: "unhosted",
    revitVersions: ["2022", "2023", "2024", "2025", "2026"],
    fileFormat: ".rfa",
    cadFormats: [".dwg"],
    hasDatasheet: true,
    isPublished: true,
    isFeatured: true,
    seoTitle: "In-line Centrifugal Pump Revit Family | BIMVORA",
    seoDescription:
      "Parametric in-line centrifugal pump family with flanged connectors and duty-point shared parameters.",
    image: "/families/pump.svg",
    fileSizeBytes: 737280,
  }),
  product({
    id: "a6666666-6666-4666-8666-666666666666",
    slug: "rectangular-fire-damper",
    name: "Rectangular Fire Damper",
    sku: "BV-FIR-DMP-RC-06",
    shortDescription:
      "Fire damper with wall/duct host options, fusible-link graphics and fire-rating types.",
    description:
      "Rectangular fire damper for fire compartment walls and shafts.\n\nWall-hosted and face-hosted types. Blade graphics, fusible link, and access panel. Fire rating (EI 60 / EI 90 / EI 120) as types. Duct size parametric to 200×200 through 1200×800 mm.",
    priceCents: 100,
    compareAtPriceCents: null,
    categoryId: typeBySlug("dampers-fire-damper"),
    discipline: "fire_protection",
    manufacturer: "Airflow Systems",
    revitCategory: "Duct Accessory",
    familyKind: "loadable",
    hosting: "wall",
    revitVersions: ["2023", "2024", "2025", "2026"],
    fileFormat: ".rfa",
    cadFormats: [".dwg"],
    hasDatasheet: true,
    isPublished: true,
    isFeatured: false,
    seoTitle: "Rectangular Fire Damper Revit Family | BIMVORA",
    seoDescription:
      "Wall-hosted rectangular fire damper with EI rating types and parametric duct sizes.",
    image: "/families/fire-damper.svg",
    fileSizeBytes: 655360,
  }),
  product({
    id: "a7777777-7777-4777-8777-777777777777",
    slug: "square-ceiling-diffuser",
    name: "Square Ceiling Diffuser",
    sku: "BV-HVAC-DIF-SQ-07",
    shortDescription:
      "Ceiling-hosted square diffuser with neck sizes, core types and airflow parameters.",
    description:
      "Square ceiling diffuser for offices and education.\n\nNeck diameter types, 1–4 cone cores, and optional plenum box nested family. Airflow, throw and NC rating parameters. Hosts to ceiling grids with alignment reference.",
    priceCents: 100,
    compareAtPriceCents: null,
    categoryId: typeBySlug("diffusers-grilles-ceiling-diffuser"),
    discipline: "hvac",
    manufacturer: "Airflow Systems",
    revitCategory: "Air Terminal",
    familyKind: "loadable",
    hosting: "ceiling",
    revitVersions: ["2022", "2023", "2024", "2025", "2026"],
    fileFormat: ".rfa",
    cadFormats: [".dwg"],
    hasDatasheet: true,
    isPublished: true,
    isFeatured: true,
    seoTitle: "Square Ceiling Diffuser Revit Family | BIMVORA",
    seoDescription:
      "Ceiling-hosted square diffuser family with parametric neck sizes and nested plenum box.",
    image: "/families/diffuser.svg",
    fileSizeBytes: 409600,
  }),
  product({
    id: "a8888888-8888-4666-8888-888888888888",
    slug: "roof-exhaust-fan",
    name: "Roof Exhaust Fan",
    sku: "BV-HVAC-FAN-RF-08",
    shortDescription:
      "Curb-mounted centrifugal exhaust fan with roof host, curb nested family and electrical connector.",
    description:
      "Roof-mounted centrifugal exhaust fan.\n\nLevel/roof hosted with nested curb. Discharge cowl, bird screen and electrical connector. Duty parameters: airflow, static pressure, power and weight for structural coordination.",
    priceCents: 100,
    compareAtPriceCents: null,
    categoryId: typeBySlug("fans-roof-fan"),
    discipline: "hvac",
    manufacturer: "Ventia",
    revitCategory: "Mechanical Equipment",
    familyKind: "loadable",
    hosting: "face",
    revitVersions: ["2022", "2023", "2024", "2025", "2026"],
    fileFormat: ".rfa",
    cadFormats: [".dwg"],
    hasDatasheet: false,
    isPublished: true,
    isFeatured: false,
    seoTitle: "Roof Exhaust Fan Revit Family | BIMVORA",
    seoDescription:
      "Curb-mounted roof exhaust fan with nested curb, electrical connector and duty parameters.",
    image: "/families/exhaust-fan.svg",
    fileSizeBytes: 1228800,
  }),
  product({
    id: "a9999999-9999-4999-8999-999999999999",
    slug: "condensing-boiler",
    name: "Condensing Boiler",
    sku: "BV-HVAC-BLR-CD-09",
    shortDescription:
      "Floor-standing condensing boiler with flue, gas, heating flow/return and condensate connectors.",
    description:
      "Floor-standing condensing boiler for plant rooms.\n\nConnectors: heating flow/return, gas, condensate, flue. Clearance envelope for service access. Output types from 45 to 280 kW. Weight and electrical load for coordination.",
    priceCents: 100,
    compareAtPriceCents: null,
    categoryId: typeBySlug("hvac-piping-steel-pipe"),
    discipline: "hvac",
    manufacturer: "Thermacore",
    revitCategory: "Mechanical Equipment",
    familyKind: "loadable",
    hosting: "level",
    revitVersions: ["2023", "2024", "2025", "2026"],
    fileFormat: ".rfa",
    cadFormats: [".dwg", ".dxf"],
    hasDatasheet: true,
    isPublished: true,
    isFeatured: true,
    seoTitle: "Condensing Boiler Revit Family | BIMVORA",
    seoDescription:
      "Floor-standing condensing boiler family with hydronic, gas, flue and condensate connectors.",
    image: "/families/boiler.svg",
    fileSizeBytes: 2097152,
  }),
  product({
    id: "aa101010-1010-4101-8101-101010101010",
    slug: "brazed-plate-heat-exchanger",
    name: "Brazed Plate Heat Exchanger",
    sku: "BV-HVAC-HEX-BP-10",
    shortDescription:
      "Compact brazed PHE with primary/secondary connectors and plate-count types.",
    description:
      "Brazed plate heat exchanger for district heating interfaces and DHW generation.\n\nPrimary and secondary pipe connectors with configurable handedness. Plate count types. Duty parameters: capacity, pressure drop, approach temperature.",
    priceCents: 100,
    compareAtPriceCents: null,
    categoryId: typeBySlug("hvac-piping-copper-pipe"),
    discipline: "hvac",
    manufacturer: "Hydroline",
    revitCategory: "Mechanical Equipment",
    familyKind: "loadable",
    hosting: "unhosted",
    revitVersions: ["2022", "2023", "2024", "2025", "2026"],
    fileFormat: ".rfa",
    cadFormats: [".dwg"],
    hasDatasheet: false,
    isPublished: true,
    isFeatured: false,
    seoTitle: "Brazed Plate Heat Exchanger Revit Family | BIMVORA",
    seoDescription:
      "Compact brazed plate heat exchanger family with primary/secondary connectors and duty parameters.",
    image: "/families/heat-exchanger.svg",
    fileSizeBytes: 860160,
  }),
];
