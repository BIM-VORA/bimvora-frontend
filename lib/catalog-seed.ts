import type { Category, Product } from "@/types/catalog";

export const SEED_CATEGORIES: Category[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    slug: "mechanical-equipment",
    name: "Mechanical Equipment",
    description:
      "Air handlers, boilers, fan coils, pumps and packaged HVAC plant families.",
    parentId: null,
    discipline: "hvac",
    sortOrder: 10,
    isActive: true,
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    slug: "air-terminals",
    name: "Air Terminals",
    description:
      "Diffusers, grilles and registers with parametric airflow and neck sizes.",
    parentId: null,
    discipline: "hvac",
    sortOrder: 20,
    isActive: true,
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    slug: "duct-accessories",
    name: "Duct Accessories",
    description:
      "Fire, smoke and volume dampers sized to standard rectangular and round ducts.",
    parentId: null,
    discipline: "hvac",
    sortOrder: 30,
    isActive: true,
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    slug: "plumbing",
    name: "Plumbing",
    description: "Pumps, valves and hydronic accessories for MEP coordination.",
    parentId: null,
    discipline: "plumbing",
    sortOrder: 40,
    isActive: true,
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    slug: "fire-protection",
    name: "Fire Protection",
    description:
      "Code-oriented fire and smoke control families for coordinated models.",
    parentId: null,
    discipline: "fire_protection",
    sortOrder: 50,
    isActive: true,
  },
];

const byId = Object.fromEntries(SEED_CATEGORIES.map((c) => [c.id, c]));

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
    sku: "BL-HVAC-VAV-DD-01",
    shortDescription:
      "Parametric dual-duct VAV terminal with heating/cooling inlets, reheat coil option and nested connectors.",
    description:
      "Loadable Mechanical Equipment family for variable air volume terminals.\n\nBuilt for coordinated HVAC models: dual inlets, discharge connector, optional hot-water reheat coil and shared parameters for airflow, pressure drop and sound power.\n\nIncludes type catalogues for 6–16 in. inlets and instance parameters for damper position, min/max airflow and control sequence tags.",
    priceCents: 8900,
    compareAtPriceCents: 11900,
    categoryId: "11111111-1111-4111-8111-111111111111",
    discipline: "hvac",
    revitCategory: "Mechanical Equipment",
    familyKind: "loadable",
    hosting: "unhosted",
    revitVersions: ["2022", "2023", "2024", "2025", "2026"],
    fileFormat: ".rfa",
    isPublished: true,
    isFeatured: true,
    seoTitle: "Modular Dual-Duct VAV Box Revit Family | BIM Lab",
    seoDescription:
      "Professional dual-duct VAV box Revit family for HVAC models. Nested connectors, reheat coil option, Revit 2022–2026.",
    image: "/families/vav-box.svg",
    fileSizeBytes: 1843200,
  }),
  product({
    id: "a2222222-2222-4222-8222-222222222222",
    slug: "packaged-air-handling-unit",
    name: "Packaged Air Handling Unit",
    sku: "BL-HVAC-AHU-PK-02",
    shortDescription:
      "Modular AHU with mixing box, filters, coils and fan section. Clearance envelopes included.",
    description:
      "Sectional air handling unit for plant rooms and roof plant.\n\nMixing box, bag filter, heating/cooling coils and supply fan are nested families so you can schedule components independently. Clearance volumes are visibility-controlled for clash detection.\n\nShared parameters cover airflow, external static pressure, coil kW, filter class and electrical load.",
    priceCents: 14900,
    compareAtPriceCents: null,
    categoryId: "11111111-1111-4111-8111-111111111111",
    discipline: "hvac",
    revitCategory: "Mechanical Equipment",
    familyKind: "loadable",
    hosting: "level",
    revitVersions: ["2023", "2024", "2025", "2026"],
    fileFormat: ".rfa",
    isPublished: true,
    isFeatured: true,
    seoTitle: "Packaged Air Handling Unit Revit Family | BIM Lab",
    seoDescription:
      "Parametric packaged AHU Revit family with nested coils, filters and fan. Built for plant-room coordination.",
    image: "/families/ahu.svg",
    fileSizeBytes: 3145728,
  }),
  product({
    id: "a3333333-3333-4333-8333-333333333333",
    slug: "ceiling-cassette-fan-coil",
    name: "Ceiling Cassette Fan Coil",
    sku: "BL-HVAC-FCU-CC-03",
    shortDescription:
      "Four-way cassette FCU with ceiling host, condensate connector and 2-pipe / 4-pipe types.",
    description:
      "Ceiling-hosted fan coil unit with four-way discharge, return air plenum and hydronic connectors.\n\n2-pipe and 4-pipe type catalogues, cooling/heating capacity parameters, and a nested condensate drain connector. Recess depth is parametric for ceiling void coordination.",
    priceCents: 6900,
    compareAtPriceCents: null,
    categoryId: "11111111-1111-4111-8111-111111111111",
    discipline: "hvac",
    revitCategory: "Mechanical Equipment",
    familyKind: "loadable",
    hosting: "ceiling",
    revitVersions: ["2022", "2023", "2024", "2025", "2026"],
    fileFormat: ".rfa",
    isPublished: true,
    isFeatured: true,
    seoTitle: "Ceiling Cassette Fan Coil Revit Family | BIM Lab",
    seoDescription:
      "Ceiling-hosted four-way cassette FCU family with 2-pipe and 4-pipe types for HVAC coordination.",
    image: "/families/fan-coil.svg",
    fileSizeBytes: 983040,
  }),
  product({
    id: "a4444444-4444-4444-8444-444444444444",
    slug: "panel-radiator-hydronic",
    name: "Panel Radiator — Hydronic",
    sku: "BL-HVAC-RAD-PN-04",
    shortDescription:
      "Wall-hosted compact and plus radiator types with pipe connectors and output schedules.",
    description:
      "Wall-hosted hydronic panel radiator for residential and commercial heating.\n\nCompact, plus and convectors types. Length, height and depth are type-driven. Supply/return pipe connectors sit at configurable centres. Output (W) is formula-driven from size and mean water temperature.",
    priceCents: 3900,
    compareAtPriceCents: null,
    categoryId: "11111111-1111-4111-8111-111111111111",
    discipline: "hvac",
    revitCategory: "Mechanical Equipment",
    familyKind: "loadable",
    hosting: "wall",
    revitVersions: ["2022", "2023", "2024", "2025", "2026"],
    fileFormat: ".rfa",
    isPublished: true,
    isFeatured: false,
    seoTitle: "Hydronic Panel Radiator Revit Family | BIM Lab",
    seoDescription:
      "Wall-hosted hydronic panel radiator with parametric size, output and pipe connectors.",
    image: "/families/radiator.svg",
    fileSizeBytes: 512000,
  }),
  product({
    id: "a5555555-5555-4555-8555-555555555555",
    slug: "inline-centrifugal-pump",
    name: "In-line Centrifugal Pump",
    sku: "BL-PLB-PMP-IL-05",
    shortDescription:
      "In-line pump with flanged connectors, motor nested family and duty-point parameters.",
    description:
      "Unhosted in-line centrifugal pump for hydronic and condenser water loops.\n\nFlanged pipe connectors, nested motor, and instance parameters for flow, head, efficiency and absorbed power. Isolation valve nested types are optional visibility.",
    priceCents: 5900,
    compareAtPriceCents: 7500,
    categoryId: "44444444-4444-4444-8444-444444444444",
    discipline: "plumbing",
    revitCategory: "Mechanical Equipment",
    familyKind: "loadable",
    hosting: "unhosted",
    revitVersions: ["2022", "2023", "2024", "2025", "2026"],
    fileFormat: ".rfa",
    isPublished: true,
    isFeatured: true,
    seoTitle: "In-line Centrifugal Pump Revit Family | BIM Lab",
    seoDescription:
      "Parametric in-line centrifugal pump family with flanged connectors and duty-point shared parameters.",
    image: "/families/pump.svg",
    fileSizeBytes: 737280,
  }),
  product({
    id: "a6666666-6666-4666-8666-666666666666",
    slug: "rectangular-fire-damper",
    name: "Rectangular Fire Damper",
    sku: "BL-FIR-DMP-RC-06",
    shortDescription:
      "Fire damper with wall/duct host options, fusible-link graphics and fire-rating types.",
    description:
      "Rectangular fire damper for fire compartment walls and shafts.\n\nWall-hosted and face-hosted types. Blade graphics, fusible link, and access panel. Fire rating (EI 60 / EI 90 / EI 120) as types. Duct size parametric to 200×200 through 1200×800 mm.",
    priceCents: 4500,
    compareAtPriceCents: null,
    categoryId: "33333333-3333-4333-8333-333333333333",
    discipline: "fire_protection",
    revitCategory: "Duct Accessory",
    familyKind: "loadable",
    hosting: "wall",
    revitVersions: ["2023", "2024", "2025", "2026"],
    fileFormat: ".rfa",
    isPublished: true,
    isFeatured: false,
    seoTitle: "Rectangular Fire Damper Revit Family | BIM Lab",
    seoDescription:
      "Wall-hosted rectangular fire damper with EI rating types and parametric duct sizes.",
    image: "/families/fire-damper.svg",
    fileSizeBytes: 655360,
  }),
  product({
    id: "a7777777-7777-4777-8777-777777777777",
    slug: "square-ceiling-diffuser",
    name: "Square Ceiling Diffuser",
    sku: "BL-HVAC-DIF-SQ-07",
    shortDescription:
      "Ceiling-hosted square diffuser with neck sizes, core types and airflow parameters.",
    description:
      "Square ceiling diffuser for offices and education.\n\nNeck diameter types, 1–4 cone cores, and optional plenum box nested family. Airflow, throw and NC rating parameters. Hosts to ceiling grids with alignment reference.",
    priceCents: 2900,
    compareAtPriceCents: null,
    categoryId: "22222222-2222-4222-8222-222222222222",
    discipline: "hvac",
    revitCategory: "Air Terminal",
    familyKind: "loadable",
    hosting: "ceiling",
    revitVersions: ["2022", "2023", "2024", "2025", "2026"],
    fileFormat: ".rfa",
    isPublished: true,
    isFeatured: true,
    seoTitle: "Square Ceiling Diffuser Revit Family | BIM Lab",
    seoDescription:
      "Ceiling-hosted square diffuser family with parametric neck sizes and nested plenum box.",
    image: "/families/diffuser.svg",
    fileSizeBytes: 409600,
  }),
  product({
    id: "a8888888-8888-4666-8888-888888888888",
    slug: "roof-exhaust-fan",
    name: "Roof Exhaust Fan",
    sku: "BL-HVAC-FAN-RF-08",
    shortDescription:
      "Curb-mounted centrifugal exhaust fan with roof host, curb nested family and electrical connector.",
    description:
      "Roof-mounted centrifugal exhaust fan.\n\nLevel/roof hosted with nested curb. Discharge cowl, bird screen and electrical connector. Duty parameters: airflow, static pressure, power and weight for structural coordination.",
    priceCents: 7900,
    compareAtPriceCents: null,
    categoryId: "11111111-1111-4111-8111-111111111111",
    discipline: "hvac",
    revitCategory: "Mechanical Equipment",
    familyKind: "loadable",
    hosting: "face",
    revitVersions: ["2022", "2023", "2024", "2025", "2026"],
    fileFormat: ".rfa",
    isPublished: true,
    isFeatured: false,
    seoTitle: "Roof Exhaust Fan Revit Family | BIM Lab",
    seoDescription:
      "Curb-mounted roof exhaust fan with nested curb, electrical connector and duty parameters.",
    image: "/families/exhaust-fan.svg",
    fileSizeBytes: 1228800,
  }),
  product({
    id: "a9999999-9999-4999-8999-999999999999",
    slug: "condensing-boiler",
    name: "Condensing Boiler",
    sku: "BL-HVAC-BLR-CD-09",
    shortDescription:
      "Floor-standing condensing boiler with flue, gas, heating flow/return and condensate connectors.",
    description:
      "Floor-standing condensing boiler for plant rooms.\n\nConnectors: heating flow/return, gas, condensate, flue. Clearance envelope for service access. Output types from 45 to 280 kW. Weight and electrical load for coordination.",
    priceCents: 12900,
    compareAtPriceCents: null,
    categoryId: "11111111-1111-4111-8111-111111111111",
    discipline: "hvac",
    revitCategory: "Mechanical Equipment",
    familyKind: "loadable",
    hosting: "level",
    revitVersions: ["2023", "2024", "2025", "2026"],
    fileFormat: ".rfa",
    isPublished: true,
    isFeatured: true,
    seoTitle: "Condensing Boiler Revit Family | BIM Lab",
    seoDescription:
      "Floor-standing condensing boiler family with hydronic, gas, flue and condensate connectors.",
    image: "/families/boiler.svg",
    fileSizeBytes: 2097152,
  }),
  product({
    id: "aa101010-1010-4101-8101-101010101010",
    slug: "brazed-plate-heat-exchanger",
    name: "Brazed Plate Heat Exchanger",
    sku: "BL-HVAC-HEX-BP-10",
    shortDescription:
      "Compact brazed PHE with primary/secondary connectors and plate-count types.",
    description:
      "Brazed plate heat exchanger for district heating interfaces and DHW generation.\n\nPrimary and secondary pipe connectors with configurable handedness. Plate count types. Duty parameters: capacity, pressure drop, approach temperature.",
    priceCents: 6400,
    compareAtPriceCents: null,
    categoryId: "11111111-1111-4111-8111-111111111111",
    discipline: "hvac",
    revitCategory: "Mechanical Equipment",
    familyKind: "loadable",
    hosting: "unhosted",
    revitVersions: ["2022", "2023", "2024", "2025", "2026"],
    fileFormat: ".rfa",
    isPublished: true,
    isFeatured: false,
    seoTitle: "Brazed Plate Heat Exchanger Revit Family | BIM Lab",
    seoDescription:
      "Compact brazed plate heat exchanger family with primary/secondary connectors and duty parameters.",
    image: "/families/heat-exchanger.svg",
    fileSizeBytes: 860160,
  }),
];
