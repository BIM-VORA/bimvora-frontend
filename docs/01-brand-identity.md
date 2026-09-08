# BIMVORA — Brand Identity

## 1. Brand Overview

**Name:** BIMVORA  
**Tagline:** *Professional BIM Content, Ready When You Are.*  
**Domain:** bimvora.com  
**Positioning:** Premium digital marketplace for professional Revit Families — the tools serious BIM engineers reach for when quality, compatibility, and time matter.

BIMVORA is not a generic 3D asset store. It is an engineering-grade content platform built by BIM specialists, for BIM specialists. Every product is a production-ready Revit Family built to real-world MEP standards, not a shapefile in .rfa format.

---

## 2. Logo System

### Primary Mark
- **Symbol:** The letter **B** enclosed in a perfect circle — monogram mark.
- **Font for B:** `Geist` Bold or `Inter` Black — geometric, no serifs, optically balanced inside the circle.
- **Wordmark:** `BIMVORA` in `Geist` Medium or `Inter` SemiBold, tracked at `0.15em`.
- **Layout:** Circle-B mark on the left, wordmark immediately to the right, vertically centred.
- **Circle stroke:** filled with brand primary blue; B in white.
- **Minimum size:** 24 px circle diameter on screen.

### Color Variants
| Variant | Background | Mark fill | Wordmark |
|---|---|---|---|
| Primary | White / Light | `#0047CC` circle, white B | `#0A0E1A` |
| Dark | `#0A0E1A` | `#0047CC` circle, white B | `#FFFFFF` |
| Monochrome Light | White | Black circle, white B | Black |
| Monochrome Dark | Black | White circle, black B | White |

---

## 3. Color Palette

### Primary Colors
```
--color-brand-blue:    #0047CC   /* Primary CTA, links, accents */
--color-brand-navy:    #0A0E1A   /* Hero backgrounds, dark sections */
--color-brand-sky:     #00B4D8   /* Secondary accent, badges, chips */
```

### Neutral Scale
```
--color-ink:           #0A0E1A   /* Body text on light */
--color-ink-70:        rgba(10,14,26,0.70)
--color-ink-40:        rgba(10,14,26,0.40)
--color-surface:       #F7F9FC   /* Page background */
--color-surface-2:     #EEF2F7   /* Cards on surface */
--color-border:        #DDE3EE   /* Dividers, card borders */
--color-white:         #FFFFFF
```

### Semantic Colors
```
--color-success:       #10B981   /* Confirmation, checkmarks */
--color-warning:       #F59E0B   /* Warnings, trial badges */
--color-error:         #EF4444   /* Form errors */
--color-gold:          #E6A817   /* Star ratings */
```

### Brand Application Rules
- **Primary blue** on white backgrounds only for CTAs and primary interactive elements.
- **Navy** for hero sections, full-bleed dark sections (always with white text).
- **Sky blue** for informational chips (Revit version, format, discipline).
- Never use more than 2 brand colours simultaneously in one component.
- Dark sections: text at minimum `#FFFFFFCC` (80% opacity white).

---

## 4. Typography

### Font Stack
```css
/* Headings — geometric, technical, modern */
font-family: 'Geist', 'Inter', system-ui, sans-serif;

/* Body — readable, clean */
font-family: 'Inter', system-ui, sans-serif;

/* Code / Technical specs / SKUs / version numbers */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale (rem, 1rem = 16px)
| Token | Size | Weight | Line Height | Use |
|---|---|---|---|---|
| `display-2xl` | 4rem | 800 | 1.05 | Hero headline |
| `display-xl` | 3rem | 700 | 1.08 | Section headline |
| `display-lg` | 2.25rem | 700 | 1.1 | Page title |
| `heading-md` | 1.5rem | 600 | 1.2 | Card title, section sub |
| `heading-sm` | 1.125rem | 600 | 1.3 | Widget title |
| `body-lg` | 1.125rem | 400 | 1.6 | Hero lead, intro |
| `body-md` | 1rem | 400 | 1.6 | Default body |
| `body-sm` | 0.875rem | 400 | 1.55 | Meta, captions |
| `label-lg` | 0.875rem | 600 | 1 | Button text, nav |
| `label-sm` | 0.75rem | 500 | 1 | Chip, badge |
| `mono-sm` | 0.75rem | 500 | 1 | SKU, version, spec |

### Heading Hierarchy Rules
- H1: One per page. Hero headline or page title.
- H2: Major section titles.
- H3: Product card title, feature title.
- Never skip heading levels.
- Headings on dark backgrounds: white, weight 700+.

---

## 5. Spacing System (Tailwind-compatible)

Use an 8px base grid.
```
4   →  4px   (0.25rem)
8   →  8px   (0.5rem)
12  →  12px
16  →  16px  (1rem)   — default gap
24  →  24px
32  →  32px
40  →  40px
48  →  48px
64  →  64px  — section padding top/bottom (mobile)
80  →  80px  — section padding (tablet)
96  →  96px  — section padding (desktop)
128 →  128px — hero section padding
```

---

## 6. Border Radius
```
--radius-sm:   4px    (chips, tags)
--radius-md:   8px    (inputs, small cards)
--radius-lg:   12px   (product cards)
--radius-xl:   16px   (modal, drawer)
--radius-2xl:  24px   (hero cards, featured)
--radius-full: 9999px (badges, buttons pill)
```

Primary CTA buttons: `--radius-md` (8px) — not pill, not sharp. Professional.

---

## 7. Shadow System
```
--shadow-sm:  0 1px 3px rgba(10,14,26,0.08), 0 1px 2px rgba(10,14,26,0.04)
--shadow-md:  0 4px 16px rgba(10,14,26,0.10), 0 2px 4px rgba(10,14,26,0.05)
--shadow-lg:  0 12px 40px rgba(10,14,26,0.14), 0 4px 8px rgba(10,14,26,0.06)
--shadow-blue: 0 8px 32px rgba(0,71,204,0.25) (for primary CTA buttons)
```

---

## 8. Component Visual Rules

### Buttons
| Variant | Background | Text | Border |
|---|---|---|---|
| Primary | `#0047CC` | White | None |
| Primary Hover | `#003BA3` | White | None |
| Secondary | `#EEF2F7` | `#0047CC` | None |
| Outline | Transparent | `#0047CC` | 1.5px `#0047CC` |
| Ghost | Transparent | `#0A0E1A` | None |
| Danger | `#EF4444` | White | None |

- Primary button: add `--shadow-blue` on hover.
- All buttons: `transition: all 150ms ease`.
- Min width for primary CTAs: 200px on desktop.
- Height: 44px (touch-friendly).

### Cards (Product Cards)
- Background: `#FFFFFF`
- Border: 1px `#DDE3EE`
- Border-radius: `--radius-lg` (12px)
- Box-shadow: `--shadow-sm`, hover `--shadow-md`
- Hover: border colour shifts to `rgba(0,71,204,0.3)`, slight lift `transform: translateY(-2px)`
- Transition: `all 200ms ease`

### Form Inputs
- Height: 44px
- Border: 1.5px `#DDE3EE`
- Focus: border `#0047CC`, box-shadow `0 0 0 3px rgba(0,71,204,0.15)`
- Border-radius: `--radius-md`
- Font: `Inter`, `body-md`

---

## 9. Brand Voice & Tone

### Core Voice Attributes
| Attribute | What it means |
|---|---|
| **Expert** | Speaks the language of BIM professionals (Revit, RFA, LOD, MEP, IFC, Navisworks) |
| **Direct** | States what the product does. No puffery. No fluff. |
| **Trustworthy** | Backed by specs, versions, compatibility tables — not just claims |
| **Efficient** | Short sentences. Active voice. Values the reader's time. |
| **Premium** | Elevated without being cold. Confident without being arrogant. |

### Writing Rules
- Use second person ("you", "your model", "your workflow") always.
- Lead with the outcome, not the feature. ("Stop rebuilding the same chiller every project" not "Our chillers have connectors")
- Technical accuracy is non-negotiable. Use correct Revit / BIM terminology.
- Avoid generic superlatives: "best", "world-class", "revolutionary". Show, don't tell.
- Use numbers and specifics: "saves ~3 hours per chiller family" beats "saves time".

### Headline Formulas
- Pain → Relief: "Tired of rebuilding FCUs from scratch? Download, load, connect."
- Outcome first: "Every chiller you'll need. Loaded in 60 seconds."
- Authority: "Built to Autodesk Revit MEP standards. Compatible 2022–2026."
- Scarcity/focus: "48 production-ready HVAC families. Not a single placeholder."

---

## 10. Imagery Direction (Until Real Assets Provided)

Use **placeholder containers** with these characteristics:
- Aspect ratio: `16:10` for product hero, `4:3` for product cards, `1:1` for thumbnails
- Background: gradient from `#1E2A3B` to `#0A0E1A`
- Centered label in `JetBrains Mono`, `0.75rem`, `rgba(255,255,255,0.35)` showing `[Product Name — Revit View]`
- Subtle grid lines (1px, `rgba(0,71,204,0.15)`) to suggest a BIM/CAD environment
- Corner badge: discipline chip (HVAC / Plumbing / Clean Room)

When real assets are provided, use:
- Revit 3D/isometric renders on neutral backgrounds
- Process views (floor plan, section, elevation)
- In-context renders (placed in a building model)
- Technical drawing overlays
- Format: WebP primary, AVIF next-gen, PNG fallback. Serve via `next/image`.
