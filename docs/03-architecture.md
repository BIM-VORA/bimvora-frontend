# BIMVORA — System Architecture

## 1. High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     bimvora.com (Frontend)                      │
│                     Next.js 15 · App Router                     │
│                  Tailwind CSS · shadcn/ui · TypeScript          │
└───────────────────────────┬─────────────────────────────────────┘
                            │ REST / fetch
┌───────────────────────────▼─────────────────────────────────────┐
│                  api.bimvora.com (Backend)                       │
│                  Python 3.12 · FastAPI · Uvicorn                │
│                  SQLAlchemy 2.0 · Alembic migrations            │
└────────┬──────────────────┬─────────────────────┬───────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
  ┌─────────────┐  ┌──────────────────┐  ┌──────────────────┐
  │  PostgreSQL  │  │  Supabase Storage│  │   Resend Email   │
  │  (EasyPanel) │  │  (private bucket)│  │  (transactional) │
  │  DB: bimvora │  │  .rfa files      │  │                  │
  └─────────────┘  └──────────────────┘  └──────────────────┘
         │
         ▼
  ┌─────────────────────────────────────────────────┐
  │              Tracking Layer                      │
  │  GA4 (client + Measurement Protocol server)     │
  │  Meta Pixel (browser) + CAPI (server)           │
  │  TikTok Pixel (browser) + Events API (server)   │
  │  LinkedIn Insight Tag (browser) + CAPI (server) │
  └─────────────────────────────────────────────────┘
```

---

## 2. Frontend Folder Structure

```
bimvora-frontend/
├── app/                          ← Next.js App Router
│   ├── layout.tsx                ← Root layout (fonts, providers, tracking init)
│   ├── page.tsx                  ← Homepage
│   ├── (shop)/
│   │   ├── collections/
│   │   │   └── [slug]/page.tsx   ← Category/collection page
│   │   ├── products/
│   │   │   └── [slug]/page.tsx   ← Product detail page
│   │   ├── cart/page.tsx         ← Cart page (fallback, main is drawer)
│   │   └── checkout/
│   │       ├── page.tsx          ← Checkout page
│   │       └── success/page.tsx  ← Thank you page
│   ├── (info)/
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── privacy/page.tsx
│   │   └── refund/page.tsx
│   └── api/
│       ├── revalidate/route.ts   ← On-demand ISR from backend webhook
│       └── checkout/route.ts     ← Proxy to backend (keeps API key server-side)
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx            ← Nav, cart icon, mobile menu
│   │   ├── Footer.tsx            ← Links, newsletter, trust badges
│   │   └── MobileMenu.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── CategoryGrid.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── ValueProposition.tsx
│   │   ├── SocialProof.tsx
│   │   ├── HowItWorks.tsx
│   │   └── NewsletterBanner.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductHero.tsx       ← Product page top section
│   │   ├── ProductGallery.tsx
│   │   ├── ProductSpecs.tsx      ← Technical specifications table
│   │   ├── ProductCompatibility.tsx
│   │   ├── ProductBundles.tsx    ← Cross-sell bundle offers
│   │   ├── ProductReviews.tsx
│   │   └── RelatedProducts.tsx
│   ├── collection/
│   │   ├── CollectionHero.tsx
│   │   ├── ProductGrid.tsx
│   │   └── FilterSidebar.tsx
│   ├── cart/
│   │   ├── CartDrawer.tsx        ← Slide-in cart with cross-sells
│   │   ├── CartItem.tsx
│   │   ├── CartCrossSells.tsx
│   │   └── CartSummary.tsx
│   ├── checkout/
│   │   ├── CheckoutForm.tsx
│   │   ├── CheckoutSummary.tsx
│   │   └── TrustElements.tsx
│   ├── ui/                       ← shadcn/ui + custom primitives
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Chip.tsx              ← Revit version chip, discipline chip
│   │   ├── StarRating.tsx
│   │   ├── ImagePlaceholder.tsx
│   │   ├── Modal.tsx
│   │   └── Drawer.tsx
│   └── tracking/
│       ├── TrackingProvider.tsx  ← Client component, initialises all pixels
│       ├── GoogleTagManager.tsx
│       └── CookieBanner.tsx
│
├── lib/
│   ├── api/
│   │   ├── client.ts             ← Base fetch wrapper with auth
│   │   ├── products.ts           ← Product fetch functions
│   │   ├── orders.ts             ← Order creation
│   │   └── types.ts              ← Shared TypeScript types
│   ├── cart/
│   │   ├── store.ts              ← Zustand cart store
│   │   └── actions.ts            ← Add, remove, update
│   ├── tracking/
│   │   ├── events.ts             ← Typed event emitters (ViewContent, AddToCart, Purchase)
│   │   ├── meta.ts               ← Browser pixel push
│   │   ├── tiktok.ts
│   │   ├── linkedin.ts
│   │   └── ga4.ts
│   ├── utils/
│   │   ├── format.ts             ← Price, date, string formatters
│   │   └── slug.ts
│   └── constants.ts
│
├── public/
│   ├── images/                   ← Static images, OG images
│   └── fonts/
│
├── styles/
│   └── globals.css               ← CSS variables, base styles
│
├── Dockerfile
├── .env.example
├── next.config.ts
└── tailwind.config.ts
```

---

## 3. Backend Folder Structure

```
bimvora-backend/
├── app/
│   ├── main.py                   ← FastAPI app factory, CORS, lifespan
│   ├── config.py                 ← Settings (pydantic-settings)
│   ├── database.py               ← SQLAlchemy engine + session
│   ├── models/                   ← SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── product.py
│   │   ├── category.py
│   │   ├── order.py
│   │   ├── customer.py
│   │   ├── review.py
│   │   └── download.py
│   ├── schemas/                  ← Pydantic request/response schemas
│   │   ├── product.py
│   │   ├── order.py
│   │   ├── customer.py
│   │   └── tracking.py           ← Server-side tracking payloads
│   ├── routers/                  ← FastAPI routers
│   │   ├── products.py
│   │   ├── categories.py
│   │   ├── orders.py
│   │   ├── customers.py
│   │   ├── downloads.py
│   │   ├── tracking.py           ← Server-side event endpoint
│   │   ├── webhooks.py           ← Stripe, payment processor
│   │   └── admin.py
│   ├── services/
│   │   ├── storage.py            ← Supabase Storage signed URL generation
│   │   ├── email.py              ← Resend email sending
│   │   ├── tracking.py           ← Meta CAPI, TikTok Events API, GA4 MP
│   │   └── stripe.py             ← Stripe operations
│   ├── middleware/
│   │   ├── auth.py               ← JWT verification
│   │   └── rate_limit.py
│   └── utils/
│       ├── hashing.py            ← PII SHA-256 normalisation
│       └── pagination.py
│
├── alembic/
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│       └── 001_initial_schema.py
│
├── Dockerfile
├── requirements.txt
├── .env.example
└── README.md
```

---

## 4. Data Flow — Purchase

```
1. Customer clicks "Add to Cart"
   ├── Frontend: CartDrawer opens
   ├── Frontend: cross-sells shown in drawer
   ├── Browser: Meta Pixel AddToCart + TikTok AddToCart + GA4 add_to_cart
   └── Server (backend tracking endpoint): Meta CAPI AddToCart (deduped)

2. Customer clicks "Checkout" in drawer
   └── Navigate to /checkout

3. Customer fills email + payment + submits
   ├── Frontend: POST /api/checkout (Next.js route handler, server-side)
   │   └── Forwards to backend: POST /orders
   ├── Backend: validates payload, creates order (status=pending)
   ├── Backend: creates Stripe PaymentIntent
   └── Frontend: Stripe Elements confirms payment

4. Stripe webhook → POST /webhooks/stripe
   ├── Backend: order status → "paid"
   ├── Backend: generates signed download URLs (Supabase Storage)
   ├── Backend: sends confirmation email (Resend)
   ├── Backend: server-side tracking:
   │   ├── Meta CAPI Purchase (with event_id for dedup)
   │   ├── TikTok Events API PlaceAnOrder
   │   ├── LinkedIn CAPI Conversion
   │   └── GA4 Measurement Protocol purchase
   └── Backend: POST to Google Sheets webhook (order record)

5. Frontend: success page
   ├── Display order ID and download links
   └── Browser: fireEvent('Purchase') with matching event_id
```

---

## 5. Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_SITE_URL=https://bimvora.com
NEXT_PUBLIC_API_URL=https://api.bimvora.com

# Supabase (public)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Stripe (public key only)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Tracking (browser pixels — public)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=
NEXT_PUBLIC_GA4_MEASUREMENT_ID=

# Internal (server-side, never NEXT_PUBLIC)
API_INTERNAL_SECRET=        # Shared with backend for route handler auth
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Backend (.env)
```env
# Server
PORT=8000
ENVIRONMENT=production
DEBUG=false

# Database
DATABASE_URL=postgresql+asyncpg://bimvora:PASSWORD@postgres:5432/bimvora

# Supabase Storage
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=bimvora-files

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email
RESEND_API_KEY=
EMAIL_FROM=orders@bimvora.com

# Frontend (CORS + redirect URLs)
FRONTEND_URL=https://bimvora.com
INTERNAL_SECRET=       # Must match frontend API_INTERNAL_SECRET

# Server-side tracking
META_PIXEL_ID=
META_ACCESS_TOKEN=
TIKTOK_PIXEL_ID=
TIKTOK_ACCESS_TOKEN=
LINKEDIN_PARTNER_ID=
LINKEDIN_ACCESS_TOKEN=
GA4_MEASUREMENT_ID=
GA4_API_SECRET=

# Google Sheets
SHEETS_WEBHOOK_URL=
SHEETS_SECRET=

# Admin
ADMIN_API_KEY=
```

---

## 6. Key Architectural Decisions

| Decision | Choice | Reason |
|---|---|---|
| Frontend framework | Next.js 15 App Router | SSR/SSG, SEO critical for product pages |
| Backend framework | FastAPI + Python | Async, auto-docs, type-safe, user preference |
| ORM | SQLAlchemy 2.0 async | Mature, full-featured, Alembic migrations |
| DB | PostgreSQL (bimvora) | Relational, EasyPanel hosted |
| File storage | Supabase Storage | Private bucket, signed URLs for downloads |
| Payment | Stripe | Industry standard, webhooks for server-side confirm |
| Email | Resend | Reliable, developer-friendly |
| Cart state | Zustand + localStorage | No server roundtrip, fast, persistent |
| Styling | Tailwind CSS + shadcn/ui | Fast development, consistent tokens |
| Tracking | GTM + CAPI/server-side | Cookie resilience, accurate attribution |
| Migrations | Alembic | Standard for SQLAlchemy |
| Auth | JWT (access + refresh) | Stateless, works well with Next.js |
| Images | next/image + WebP/AVIF | Core Web Vitals, LCP |
