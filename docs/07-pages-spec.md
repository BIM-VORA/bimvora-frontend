# BIMVORA — Pages Specification

---

## Header (Persistent)

### Desktop layout (left → right)
```
[B⃝ BIMVORA]   [Home] [Collections ▾] [Bundles] [About] [Contact]   [Search 🔍]   [Cart 🛒 (3)]
```
- Logo: circle-B symbol + BIMVORA wordmark.
- Nav links: text-sm, semibold. Hover: colour shifts to brand blue.
- Collections dropdown: shows 3 main categories with description + discipline icon.
- Cart icon: shows item count badge (brand blue circle).
- Mobile: hamburger menu slides in from right.

### Sticky behaviour
- Sticky top-0 with `backdrop-blur` + subtle bottom border on scroll.
- Background: `rgba(255,255,255,0.96)` — not fully opaque for premium feel.

---

## Footer (Persistent)

### Structure (4-column on desktop, stacked mobile)
```
Col 1: BIMVORA logo + tagline + social icons (LinkedIn, YouTube, Instagram, TikTok)
Col 2: Products — HVAC · Plumbing · Clean Room · All Products · Bundles
Col 3: Company — About Us · Contact · Blog (future) · Brand Kit
Col 4: Legal — Terms · Privacy · Refund Policy · FAQ
```
- Bottom bar: copyright + "Powered by Stripe" trust badge + SSL badge.
- Newsletter form: "Get new family alerts" email input + subscribe button.
- Social icons: linked, aria-labelled.

---

## Homepage (`/`)

### Section 1 — Hero
**Layout:** Split — text left (60%), image right (40%) on desktop. Stacked mobile.  
**Background:** Brand navy (`#0A0E1A`) with subtle grid-dot pattern.

**Content:**
```
[Eyebrow chip]  HVAC · Plumbing · Clean Room Revit Families

[H1]  Professional Revit Families.
      Built for Real Projects.

[Lead] Stop rebuilding the same MEP equipment from scratch. 
       Load production-ready families with connectors, shared parameters, 
       and Revit 2022–2026 compatibility — in 60 seconds.

[CTA row]  [Browse Families →]   [See Bundles]

[Trust row]  ✓ Instant download  ·  ✓ MEP-grade connectors  ·  ✓ Commercial licence
```

**Image block (right):** Placeholder for Revit 3D isometric render with discipline overlay badge.

---

### Section 2 — Category Grid (Collections)
**Layout:** 3 cards, equal width, horizontal on desktop, vertical stack mobile.  
**Background:** White.

**Heading:**
```
[Eyebrow]  Browse by Discipline
[H2]       Find the Revit Families Your Project Needs
```

**Cards (one per category):**
```
┌────────────────────────────────┐
│  [Discipline illustration/img] │  ← full bleed top image
│  HVAC / Mechanical             │  ← discipline chip
│  HVAC Revit Families           │  ← H3
│  Chillers, FCUs, AHUs, fans,   │  ← description 2 lines
│  diffusers, dampers and more.  │
│  [48 families available]       │  ← count, muted
│  [Browse HVAC →]               │  ← ghost button
└────────────────────────────────┘
```

---

### Section 3 — Value Proposition (Why BIMVORA)
**Layout:** 3 columns on desktop (icon + heading + body).  
**Background:** `#F7F9FC` (light surface).

| Column 1 | Column 2 | Column 3 |
|---|---|---|
| ⚡ **Instant Download** — Purchase and download in under 2 minutes. No waiting, no request forms. | 🔌 **MEP Connectors Included** — Duct, pipe and electrical connectors built in. Clash-detection ready. | 📋 **Schedule-Ready Parameters** — Shared parameters match Autodesk MEP templates. No manual setup. |

**Second row:**
| Column 1 | Column 2 | Column 3 |
|---|---|---|
| 🔄 **Revit 2022–2026** — Every family tested across supported Revit versions. Stated on every product. | 📐 **Fully Parametric** — Size, type and configuration driven by type catalogues, not fixed geometry. | 🏗️ **Commercial Licence** — Use in client-facing projects. No attribution required. |

---

### Section 4 — Featured Products
**Layout:** Horizontal scroll on mobile, 4-column grid desktop.  
**Heading:**
```
[Eyebrow]  Trusted by BIM Professionals
[H2]       Most Downloaded This Month
```
**Show:** 4–8 top-selling products. ProductCard component.  
**CTA below grid:** `[See All Families →]`

---

### Section 5 — Social Proof / Authority
**Layout:** Full-bleed dark section (navy).  
**Content:**
```
[Metric 1]   500+        Revit Families
[Metric 2]   10,000+     Downloads
[Metric 3]   4.9★        Average Rating
[Metric 4]   2022–2026   Revit Version Coverage
```
Below metrics: 2–3 short testimonials (when available). Until then, use placeholder quote boxes with [Client Name, Role, Company].

---

### Section 6 — Bundles CTA
**Layout:** Full-width card with gradient background (navy to dark blue).  
**Content:**
```
[H2]  Get More for Less. Buy a Bundle.
[Body] Save up to 40% when you purchase a discipline pack or the full BIMVORA library.
[CTA]  [See Bundles & Pricing →]  [Compare Individual Families]
```

---

### Section 7 — How It Works
**Layout:** 3 steps, horizontal timeline desktop, vertical mobile.

```
Step 1 [🛒]           Step 2 [💳]           Step 3 [⬇]
Browse & Select        Secure Checkout       Instant Download
Find the Revit         Pay securely via       Files appear in your
families you need.     Stripe. Takes          account. Download
Add to cart.           under 60 seconds.      immediately. Done.
```

---

### Section 8 — Newsletter
**Layout:** Centered, light background.
```
[H2]  New Families Added Every Month.
[Body] Get notified when new Revit families go live. No spam.
[Email input]  [Subscribe →]
```

---

## Collection Page (`/collections/[slug]`)

### Structure

**Hero band (full width, navy background):**
```
[Discipline icon large]
[H1]  HVAC Revit Families
[Lead] Professional HVAC equipment families — chillers, FCUs, AHUs, fans, 
       diffusers and more. MEP connectors, shared parameters, Revit 2022–2026.
[Breadcrumb]  Home > HVAC Revit Families
```

**Content area — sidebar layout (desktop):**
```
[Sidebar 260px]              [Product Grid — rest of width]
─────────────────
Filter by:
□ Sub-category
  ▢ Chillers
  ▢ Fan Coil Units
  ▢ AHUs
  ▢ Fans
  ▢ ...

Revit Version:
  ▢ 2022 · ▢ 2023 · ▢ 2024
  ▢ 2025 · ▢ 2026

LOD Level:
  ▢ LOD 200 · ▢ LOD 300
  ▢ LOD 350 · ▢ LOD 400

Connectors:
  ▢ Duct · ▢ Pipe · ▢ Electrical

Sort by: [Dropdown] Popular / Newest / Price ↑↓

[Clear all filters]
──────────────────

[Product count: 48 families]

[Product Grid: 3 columns desktop, 2 tablet, 1 mobile]
[ProductCard × N]

[Pagination / Load More]
```

**Below grid — bundle upsell band:**
```
┌──────────────────────────────────────────────────────┐
│  💡 Buy the full HVAC pack and save 40%              │
│  Get all 48 HVAC families for $249 instead of $412  │
│  [Get the HVAC Bundle →]                             │
└──────────────────────────────────────────────────────┘
```

---

## Product Page (`/products/[slug]`)

### Above the Fold (2-column, image left / info right on desktop)

**Left column — Gallery:**
- Primary image (large): product render or placeholder
- Thumbnail strip below (max 4 images)
- Image 1: 3D isometric view
- Image 2: Revit 3D perspective
- Image 3: Revit schedule/parameter view
- Image 4: In-context placement render

**Right column — Product Info:**
```
[Breadcrumb]  Home > HVAC > Fan Coil Units > 2-Pipe FCU Ceiling

[Discipline badge]  HVAC       [LOD chip]  LOD 300

[H1]  2-Pipe Fan Coil Unit — Ceiling Concealed
      [SKU: BIMV-FCU-2P-CEIL-001]

[Stars rating]  ★★★★★ 4.9  (18 reviews)  ← anchor scrolls to reviews

[Short description]
Parametric ceiling-concealed FCU with hydronic connectors, condensate outlet 
and electrical connection. Load in Revit, connect to your hydronic system 
and coordinate in minutes.

[Revit version chips row]
[Revit 2022] [Revit 2023] [Revit 2024] [Revit 2025] [Revit 2026]

[Technical highlights — icon + text, 2 columns]
✓ Duct connectors (supply + return)
✓ Hydronic pipe connectors (supply + return)
✓ Condensate pipe outlet
✓ Electrical connector
✓ Shared parameters (Airflow, Capacity, Model)
✓ Type catalogue (sizes 1.0–15.0 kW)
✓ Compatible: Revit MEP template
✓ LOD 300 geometry

[Pricing]
~~$49~~  $29.00 USD

[Offer selection — if bundle/upsell]
○ Single Family — $29
● HVAC Starter Bundle (5 families) — $99  ← SAVE 32% badge
○ HVAC Complete Pack (48 families) — $249

[CTA — Primary full width]
[🛒 Add to Cart & Preview →]

[Trust row under button]
✓ Instant download  ·  ✓ Commercial licence  ·  ✓ 7-day guarantee
✓ Secure payment via Stripe  ·  🔒 SSL encrypted
```

---

### Section 2 — Technical Specifications
**Layout:** Full-width, light background, 2-column spec table.

```
[H2]  Technical Specifications

┌──────────────────────────────────────────────────────────┐
│  File format        .rfa (Revit Family)                  │
│  Revit version      2022 · 2023 · 2024 · 2025 · 2026   │
│  LOD Level          LOD 300                              │
│  Family category    Mechanical Equipment                  │
│  Connectors         Duct · Pipe · Electrical              │
│  Shared parameters  ✓ Yes (Autodesk MEP compatible)      │
│  Parametric types   Yes — type catalogue (10 sizes)      │
│  File size          ~2.4 MB                              │
│  Cooling capacity   0.5 to 15 kW                         │
│  Airflow range      100 to 2,000 m³/h                   │
│  Pipe size          DN15 / DN20                          │
│  Manufacturer       Generic (no brand lock-in)           │
│  Standards          ISO 13792 · EN 16798                 │
└──────────────────────────────────────────────────────────┘
```

---

### Section 3 — Compatibility Table
```
[H2]  Compatibility & Requirements

[Table]
Version          Status     Tested
Revit 2026       ✅ Full    Yes
Revit 2025       ✅ Full    Yes
Revit 2024       ✅ Full    Yes
Revit 2023       ✅ Full    Yes
Revit 2022       ✅ Full    Yes
Revit 2021       ⚠️ Not tested
Revit 2020       ❌ Not supported

Required worksets: None  
Required plugins:  None
Template         Works with default Revit MEP templates
```

---

### Section 4 — What's Included
```
[H2]  What You Get

📦 Download package contents:
  ・ BIMV-FCU-2P-CEIL-001.rfa  — Revit Family file (all versions)
  ・ FCU-Shared-Parameters.txt — Shared parameter file
  ・ Product-Datasheet.pdf     — Technical reference sheet
  ・ Type-Catalogue.csv        — All family types and dimensions

Licence: Commercial use · Unlimited projects · 1 user
        (Team licences: contact us or see bundles)
```

---

### Section 5 — Social Proof (Reviews)
```
[H2]  Engineer Reviews

[Review card × 3–6]
┌──────────────────────────────────────┐
│  ★★★★★                               │
│  "Saved me 4 hours on this project." │
│  — Ahmed K., BIM Coordinator, UAE   │
│  ✓ Verified Purchase                 │
└──────────────────────────────────────┘
```

---

### Section 6 — Cross-sells (Related products + bundle upsell)
```
[H2]  Often Bought Together

[Horizontal scroll or 3-column grid]
[ProductCard × 3]

─────────────────────────────────────────
[Bundle upsell strip]
🔥 Complete your HVAC library — Save 40%
Get the full HVAC pack: 48 families for $249
[Add HVAC Bundle to Cart →]
─────────────────────────────────────────
```

---

### Section 7 — Authority / Trust (bottom of page)
```
[H2]  Built by BIM Engineers

[Text left, visual right — alternating]

"BIMVORA families are not exported from 3D modelling software and wrapped 
in an RFA container. They are built in Revit Family Editor from scratch, 
following Autodesk MEP family authoring standards — connectors, host type, 
shared parameters, type catalogues and all."

[Visual: Revit Family Editor screenshot placeholder]

"Every family is load-tested in a real Revit project before listing. 
We check for nested family warnings, reference planes, subcategory assignments 
and correct connector direction."

[Visual: Revit model coordination view placeholder]
```

---

## Cart Drawer (Slide-in from right)

**Trigger:** Any "Add to Cart" click anywhere on site.

### Drawer anatomy
```
[Header]
  ← Close   🛒 Your Cart (3 items)

[Items list]
  ┌──────────────────────────────────────────┐
  │ [thumb]  2-Pipe FCU Ceiling — $29.00     │
  │          Revit 2022–2026  ✕ Remove       │
  ├──────────────────────────────────────────┤
  │ [thumb]  HVAC Chiller Air Cooled — $49   │
  │          Revit 2024–2026  ✕ Remove       │
  └──────────────────────────────────────────┘

[Cross-sell section]
─────────────────────────────────────────
💡 Engineers who bought this also got:

[CrossSellCard × 2–3]
┌──────────────────────┐ ┌────────────────────┐
│ [thumb]              │ │ [thumb]            │
│ Centrifugal Fan      │ │ HVAC Bundle        │
│ $19 · [+ Add]        │ │ $99 · Save 32%     │
└──────────────────────┘ └────────────────────┘
─────────────────────────────────────────

[Order summary]
Subtotal (3 items)    $97.00
Digital delivery      Free
──────────────────────────────
Total                 $97.00 USD

[Primary CTA — full width]
[Proceed to Checkout →]

[Secondary link]
[View full cart page]

[Trust badges row]
🔒 Secure checkout  ·  ⚡ Instant download  ·  ↩ 7-day guarantee
```

---

## Checkout Page / Popup (`/checkout`)

**Layout:** Centred modal-style on desktop (max-width 960px). Full-page on mobile.

### Left column — Form (60%)
```
[Progress indicator]  ① Contact  → ② Payment

─── Step 1: Contact & Delivery ────────────────────────

Email address *      [__________________________________]
                     (your download link will be sent here)

First name *         [_______________]  Last name * [___]

Company (optional)   [__________________________________]

Country *            [Select country ▾]

[Continue to Payment →]

─── Step 2: Payment ────────────────────────────────────

Secure payment via Stripe

[Stripe Elements — card number, expiry, CVC]

Cardholder name      [__________________________________]

[🔒 Pay $97.00 →]

(By completing purchase you agree to our Terms of Service and 
understand this is a digital product with no physical delivery.)
```

### Right column — Order Summary (40%)
```
┌────────────────────────────────────────┐
│  Order Summary                         │
├────────────────────────────────────────┤
│  [thumb]  2-Pipe FCU Ceiling     $29   │
│  [thumb]  Chiller Air Cooled     $49   │
│  [thumb]  Centrifugal Fan        $19   │
├────────────────────────────────────────┤
│  Subtotal                        $97   │
│  Digital delivery                Free  │
│  ────────────────────────────────────  │
│  Total                   $97.00 USD    │
├────────────────────────────────────────┤
│  🔒 256-bit SSL encryption             │
│  ⚡ Instant download after payment     │
│  ↩  7-day satisfaction guarantee       │
│  📋 Commercial licence included        │
│  🏦 Powered by Stripe                  │
└────────────────────────────────────────┘

Cross-sell:
┌────────────────────────────────────────┐
│  💡 Add the full HVAC bundle for only  │
│  $152 more and save $163               │
│  [Add HVAC Bundle +$152]               │
└────────────────────────────────────────┘
```

---

## Thank You / Success Page (`/checkout/success`)

```
[Header — centred, success icon]
✅ Order Confirmed!

[H1]  Your Revit Families Are Ready to Download

[Order info box]
Order number:  BV-2026-01042
Email sent to: ahmed@company.com

[Download section]
─────────────────────────────────────────
📦 2-Pipe FCU Ceiling Mounted
   BIMV-FCU-2P-CEIL-001.rfa  ·  2.4 MB
   [⬇ Download Now]  [expires in 1 year]

📦 HVAC Chiller — Air Cooled
   BIMV-CHLR-AC-001.rfa  ·  5.1 MB
   [⬇ Download Now]  [expires in 1 year]
─────────────────────────────────────────

[Note]  A copy of these links has been emailed to you.
        You can also access your downloads anytime at 
        bimvora.com/account/downloads

[What's next section]
1. Load the .rfa file in Revit (Insert → Load Family)
2. Place your family and connect to the system
3. Adjust type parameters in Properties
4. Schedule from the shared parameters

[Cross-sell / upsell]
[H3]  Complete Your HVAC Library
Add the full HVAC bundle and get 45 more families for $220
[Browse HVAC Bundle →]

[Social share]
Love BIMVORA? Share it with your team:
[LinkedIn] [WhatsApp] [Copy Link]
```

---

## About Page (`/about`)

### Sections (in order)
1. **Hero:** "About BIMVORA" — navy background, tagline, mission statement.
2. **Mission block:** Alternating text/image. "We exist because BIM professionals deserve better content."
3. **What makes us different:** 3-column, icon cards.
4. **Our process:** How families are built (timeline/steps).
5. **The team:** Placeholder cards for team members.
6. **Values:** 3 core values (Quality, Compatibility, Speed).
7. **CTA:** "Browse the library" button.

---

## Contact Page (`/contact`)

### Sections
1. **Hero:** "Get in Touch" — navy, short description.
2. **Contact form:**
   - Name, Email, Subject dropdown (General / Technical / Licensing / Partnership), Message, Send button.
3. **Sidebar info:** Email address, LinkedIn, expected response time (< 24 hours).
4. **FAQ shortcut:** "Have a quick question? Check our FAQ first →"

---

## FAQ Page (`/faq`)

### Categories
- **Products & Files:** What file formats? What's LOD 300? Are families parametric?
- **Compatibility:** Which Revit versions? Do I need plugins? Does it work with my template?
- **Purchasing:** How does instant download work? What's the licence?
- **Refunds & Support:** What if the file doesn't work? Refund policy?
- **Bundles:** What's included? Can I buy for my team?

Each FAQ item: accordion expand/collapse. Structured data markup `FAQPage` schema for SEO.
