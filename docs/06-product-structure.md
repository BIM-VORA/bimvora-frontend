# BIMVORA — Product Structure & Categories

## 1. Category Hierarchy

```
BIMVORA
├── HVAC Revit Families          (discipline: hvac)
│   ├── Chillers
│   ├── Fan Coil Units (FCU)
│   ├── Air Handling Units (AHU)
│   ├── Heat Pumps
│   ├── Fans & Ventilation
│   ├── Diffusers & Grilles
│   ├── Ducts & Fittings
│   ├── Dampers
│   ├── Pumps
│   └── HVAC Valves & Accessories
│
├── Plumbing Revit Families      (discipline: plumbing)
│   ├── Sanitary Fixtures
│   ├── Water Supply Pipes & Fittings
│   ├── Drainage & Waste
│   ├── Water Heaters & Boilers
│   ├── Storage Tanks
│   ├── Plumbing Pumps
│   └── Plumbing Valves & Accessories
│
└── Clean Room Revit Families    (discipline: clean_room)
    ├── HEPA Filters & Terminals
    ├── Fan Filter Units (FFU)
    ├── LAF Units & Benches
    ├── Clean Room AHUs
    ├── Pass Boxes & Airlocks
    ├── Air Showers
    ├── Clean Room Doors & Panels
    └── SAS (Personnel & Material Airlocks)
```

**Architecture supports unlimited future categories** via `parent_id` on the `categories` table. Adding a new discipline or sub-category requires only a database insert and a new collection page.

---

## 2. Product Data Requirements

Each product **must** have:

| Field | Description | Example |
|---|---|---|
| `name` | Clear, technical product name | "2-Pipe Fan Coil Unit — Ceiling Mounted" |
| `sku` | Unique identifier | `BIMV-FCU-2P-CEIL-001` |
| `slug` | URL-safe version of name | `2-pipe-fcu-ceiling-mounted` |
| `short_description` | 1–2 sentence benefit statement | "Parametric ceiling FCU with hydronic, condensate and electrical connectors. Schedule-ready in Revit 2022–2026." |
| `description` | Full product description + technical notes | Markdown |
| `discipline` | `hvac` / `plumbing` / `clean_room` | `hvac` |
| `category_id` | FK to categories table | |
| `price_cents` | Price in cents (USD) | `2900` = $29.00 |
| `revit_versions` | Array of supported versions | `['2022','2023','2024','2025','2026']` |
| `lod` | Level of Detail | `lod_300` |
| `file_formats` | Downloadable file types | `['.rfa','.pdf']` |
| `has_connectors` | MEP connectors included | `true` |
| `has_shared_params` | Shared parameters | `true` |
| `is_parametric` | Size/type driven by types | `true` |
| `specifications` | JSONB technical data | See below |

### `specifications` JSONB Structure (examples by discipline)

#### HVAC — FCU
```json
{
  "cooling_capacity": "0.5 to 15 kW",
  "heating_capacity": "0.6 to 18 kW",
  "airflow": "100 to 2000 m³/h",
  "pipe_size": "DN15 / DN20",
  "connection_type": "2-Pipe or 4-Pipe",
  "mounting": "Ceiling Concealed / Cassette / Floor",
  "control_options": "2-point, modulating",
  "filter_type": "G4",
  "weight_kg": "8 to 35"
}
```

#### HVAC — Chiller
```json
{
  "cooling_capacity": "50 to 500 kW",
  "cop": "3.0 to 5.8",
  "refrigerant": "R-410A / R-32 / R-134a",
  "condenser_type": "Air-Cooled / Water-Cooled",
  "chilled_water_flow": "5 to 85 l/s",
  "entering_water_temp": "12°C",
  "leaving_water_temp": "7°C",
  "power_supply": "400V / 3Ph / 50Hz"
}
```

#### Clean Room — HEPA Filter
```json
{
  "filter_class": "H14 / U15 / U16",
  "filtration_efficiency": "99.995%",
  "face_velocity": "0.4 to 0.5 m/s",
  "sizes": "610x610 / 1220x610 / 1220x1220",
  "frame_material": "Aluminium / Stainless Steel",
  "seal_type": "Gel / Bag-In Bag-Out",
  "pressure_drop": "200 to 350 Pa"
}
```

---

## 3. Bundle Structure

### HVAC Starter Bundle
- 5 core HVAC families (FCU, AHU, diffuser, pump, valve)
- Price: $99 (vs $145 individual)
- Badge: "Save 32%"

### HVAC Complete Pack
- All HVAC families
- Price: $249
- Badge: "Best Value"

### MEP Coordination Bundle
- HVAC + Plumbing essentials
- Price: $189
- Badge: "MEP Ready"

### Clean Room Complete Pack
- All clean room families
- Price: $179
- Badge: "Pharma Grade"

### Full Library Bundle
- Every family in the BIMVORA catalogue
- Price: $399
- Badge: "Complete Library · Unlimited Projects"

**Cross-sell rule:** When a user adds any single HVAC family, show the HVAC Starter Bundle in the cart drawer cross-sell. When they add 2+ HVAC families, show the HVAC Complete Pack.

---

## 4. Pricing Strategy

| Segment | Price Range | Notes |
|---|---|---|
| Single family | $19–$49 | Most families |
| Premium / complex family | $49–$99 | AHU, chiller, full system family |
| Starter bundle (5 products) | $79–$99 | ~30% discount vs individual |
| Category bundle (all in one discipline) | $199–$299 | ~40% discount |
| Full library | $399–$599 | Max AOV target |

**Display:** Always show the `compare_at_price` crossed out when a bundle is shown to communicate savings.

---

## 5. Product Card UI Spec

The product card is the core commerce unit. It appears on:
- Collection pages (grid layout)
- Homepage featured section
- Cart cross-sells
- Related products

### Card Anatomy
```
┌─────────────────────────────────┐
│   [IMAGE PLACEHOLDER / RENDER]  │  ← Aspect ratio 4:3
│   [discipline chip top-left]    │
│   [LOD badge top-right]         │
├─────────────────────────────────┤
│  Category · SKU                 │  ← font-mono, 0.75rem, muted
│  Product Name (H3)              │  ← 1rem–1.125rem, semibold
│  Short description              │  ← 0.875rem, 2 lines, muted
│  ─────────────────────────────  │
│  [Revit ver chips] [Connectors] │  ← small chips
│  ─────────────────────────────  │
│  ★★★★☆ 4.8 (23 reviews)        │  ← stars + count
│  ─────────────────────────────  │
│  ~~$49~~ $29                    │  ← price + compare
│  [Add to Cart ▶]                │  ← full width primary button
└─────────────────────────────────┘
```

### Card Interaction
1. Card hover: shadow elevates, border brightens, image scales `1.02`.
2. "Add to Cart" click:
   - Item added to Zustand cart store.
   - Cart drawer slides open immediately.
   - Button changes to "Added ✓" for 1.5 seconds, then resets.
   - Browser tracking: `AddToCart` event fires.

---

## 6. Revit Version Chip Component
```tsx
// <RevitVersionChip version="2024" />
<span className="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-mono font-medium text-sky-800">
  Revit {version}
</span>
```
Show all supported versions in a wrapping flex row.

---

## 7. Discipline Badge
```
HVAC       → blue-50 / blue-700
Plumbing   → cyan-50 / cyan-700  
Clean Room → purple-50 / purple-700
```

---

## 8. Digital Delivery Flow

1. **Checkout completed** → Stripe webhook → order status `paid`.
2. Backend generates `download_tokens` for each `order_item` (one token per file, per order item).
3. Backend sends email with order confirmation + download links.
4. Customer clicks link in email → hits `/downloads?token=xxx` on frontend.
5. Frontend calls `GET /api/downloads/{token}` (Next.js route handler) → backend generates a **Supabase Storage signed URL** (expires in 1 hour).
6. Frontend redirects to signed URL → file downloads.
7. `download_tokens.download_count` incremented on each use.
8. Token expires after `max_downloads` (default: 10) or `expires_at` (default: 1 year).
