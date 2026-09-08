# BIMVORA — CRO Strategy

## 1. Core CRO Principles

1. **Every page has one primary action.** The user is never confused about what to do next.
2. **Friction is the enemy.** Remove every unnecessary field, step, and click.
3. **Trust must be earned on every screen.** Security badges, reviews, and guarantees appear at every decision point.
4. **AOV is optimised through bundles, not upsells after checkout.** Show the bundle value before the customer commits to the single product.
5. **Mobile is primary.** 60%+ of visitors will be on mobile. Every interaction is designed for thumb reach.

---

## 2. Conversion Funnel

```
Awareness (social/search)
     ↓
Landing (homepage or collection)
     ↓  [CRO: Clear value prop, fast page load, trust signals]
Product Page
     ↓  [CRO: Specs, compatibility, reviews, bundle offer]
Add to Cart
     ↓  [CRO: Cart drawer with cross-sells opens immediately]
Checkout
     ↓  [CRO: Minimal fields, trust, progress bar, order summary visible]
Payment
     ↓  [CRO: Stripe Elements in-page, no redirect]
Success
     ↓  [CRO: Immediate download access, referral prompt, upsell]
Repeat Purchase (email, retargeting)
```

---

## 3. Product Page CRO Checklist

### Above the fold (must be visible without scroll)
- [ ] Product name (H1, clear, keyword-rich)
- [ ] Rating + review count (visible, clickable to anchor)
- [ ] Price (large, primary colour)
- [ ] Compare-at price (strikethrough if applicable)
- [ ] Add to Cart button (high contrast, full width)
- [ ] 3–4 trust bullets below button
- [ ] At least 1 product image (loaded with `priority`)
- [ ] Revit version chips visible

### Offer selection (before CTA)
Use a radio button group to show:
1. Single family price
2. Bundle option (X families for $YY) — pre-select this as default when bundle saves >25%
3. Full library option

This is the #1 AOV lever. Do not hide the bundle — make it the obvious choice.

### Scarcity / Social proof
- "X engineers downloaded this this month" — real counter when data exists.
- "★★★★★ from verified Revit users" — rating pull-quote above CTA.
- "Instant download" — repeated near the CTA.

### Risk reversal (below CTA)
```
✓ 7-day satisfaction guarantee
✓ Commercial licence — use in unlimited client projects
✓ Instant download — no waiting
✓ Files tested in Revit 2022–2026
```

---

## 4. Cart Drawer CRO

The cart drawer must open immediately on "Add to Cart" — before the customer navigates away.

### Cross-sell logic (priority order)
1. If cart contains 1 item from category X → show "Complete your [X] library" bundle.
2. If cart contains 2+ items from category X → show the full category bundle with savings math.
3. Always show 2–3 individual complementary products.
4. Cross-sell cards: small, image + name + price + "+ Add" button. One click to add without closing drawer.

### Cart summary CRO
- Show per-item totals clearly.
- Show "You're saving $X compared to individual pricing" when a bundle is in the cart.
- Free delivery line item = "$0 — Digital delivery" (makes it visible that there's no shipping cost).
- Checkout button: large, primary blue, full width.
- Under button: 3 trust icons (lock, lightning, refresh).

---

## 5. Checkout CRO

### Reduce fields to minimum viable
Digital product → collect only:
- Email (required — for download delivery)
- First name (for personalised email)
- Last name (optional — for invoice)
- Company (optional — for B2B invoice)
- Country (required — for tax/legal)
- Payment (Stripe Elements)

Do **not** collect: phone, address line 1, address line 2, city, postcode, state.  
These are irrelevant for digital delivery and kill conversion.

### Progress indicator
Show a 2-step indicator: ① Contact → ② Payment  
When on step 1, step 2 is greyed. Visually communicates "almost there".

### Order summary always visible
On desktop: sticky right column.  
On mobile: collapsible "Show order summary ▾" at the top.

### Trust elements in checkout
- SSL padlock icon + "Secured by SSL" text.
- Stripe logo + card brand logos (Visa, Mastercard, Amex).
- "7-day guarantee" chip.
- "Instant download" chip.

### Guest checkout only (initially)
Do not force account creation at checkout. Collect email, complete purchase, then offer account creation on thank you page ("Save your downloads — create an account").

### Error states
- Inline validation — errors appear on blur, not on submit.
- Payment errors: display Stripe's error message verbatim. Do not hide the error.

---

## 6. Thank You Page CRO

The order is confirmed. Now optimise for:

### 1. Immediate value delivery
Show download buttons prominently. Don't make them hunt for the files. Download experience = product experience.

### 2. Secondary CTA (upsell)
"Add the full HVAC bundle for $152 more" — one-click add to a new order.  
This is the highest-converting upsell moment (commitment bias).

### 3. Referral / social share
"Know an engineer who would love this? Share BIMVORA."  
LinkedIn share button (most relevant channel for B2B). Copy link button.

### 4. Account creation (soft)
"Save your downloads permanently — create a free account."  
One-click Google SSO or email+password. No pressure.

### 5. What to do next (onboarding)
3-step visual guide: Load → Place → Schedule.  
Reduces support requests and increases perceived product quality.

---

## 7. Urgency & Scarcity (Use Authentically)

| Tactic | Honest implementation |
|---|---|
| Sale countdown | Only when a real sale has a real end date |
| "X downloaded this week" | Show real numbers from DB. If < 10, show "New" badge instead |
| "Last reviewed X ago" | Show real review timestamps |
| "Revit 2026 compatible" | Highlight newest version in chip (current = most desirable) |
| Bundle "Save X%" | Calculate real savings, always |

Never fake scarcity. The audience is technical and will notice.

---

## 8. A/B Test Priorities

| Test | Hypothesis | Metric |
|---|---|---|
| Hero headline A vs B | Pain-first vs outcome-first | Homepage → product page CTR |
| Bundle pre-selected vs not | Pre-selecting bundle increases AOV | Average order value |
| CTA text "Add to Cart" vs "Get Instant Access" | Action-oriented copy converts better | Product page → cart rate |
| 3 trust bullets vs 6 trust bullets | Fewer bullets scan faster | Add to Cart rate |
| Offer selector (radio) vs hidden bundle | Visible bundle offer = higher AOV | Average order value |
| Guest checkout vs account required | Guest = higher checkout completion | Checkout completion rate |

Use Vercel Edge Config + PostHog for A/B tests without code deploys.

---

## 9. Exit Intent / Recovery

- **Exit intent popup (desktop):** When cursor moves toward browser chrome → "Before you go — download a free sample family." Email capture with lead magnet.
- **Cart abandonment email:** If user added to cart and provided email → 3-email sequence (1h, 24h, 72h).
- **Retargeting:** Meta/TikTok/LinkedIn pixel fires on cart add. Retarget with specific product shown.

---

## 10. Mobile-Specific CRO

- Sticky "Add to Cart" bar at bottom of screen on product page (appears after scrolling past price).
- Cart drawer is full-screen on mobile (not half-screen).
- Payment form: Stripe Link enabled for returning customers (one tap pay).
- All buttons: minimum 44px height.
- Images: load at correct resolution for device (next/image srcset).
- No hover-only interactions on mobile.

---

## 11. Page Speed (CRO-critical)

| Target | Metric |
|---|---|
| LCP | < 2.5s |
| FID / INP | < 200ms |
| CLS | < 0.1 |
| First Byte (TTFB) | < 600ms |

Implementation:
- Product pages: SSG with ISR (revalidate: 3600) for most content.
- Cart/checkout: client-side Zustand state, no server roundtrip for add.
- Images: `next/image` with `priority` on LCP image, `loading="lazy"` below fold.
- Fonts: `next/font` with `display: 'swap'` and preconnect.
- Scripts: GTM deferred, Stripe loaded only on checkout page.
- Third-party: all pixels via GTM, not inline.
