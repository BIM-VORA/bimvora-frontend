# BIMVORA — Project Documentation Index

This folder contains the complete specification for building the BIMVORA premium digital BIM store.
An AI coder (or human developer) can build the full production system using these documents alone.

---

## Document Index

| # | File | What it covers |
|---|---|---|
| 01 | [Brand Identity](./01-brand-identity.md) | Logo, colours, typography, spacing, voice, imagery |
| 02 | [ICP & Positioning](./02-icp-positioning.md) | Customer profiles, pain points, emotional copy, objections |
| 03 | [Architecture](./03-architecture.md) | System diagram, folder structure, data flow, env variables |
| 04 | [Tech Stack](./04-tech-stack.md) | All libraries with versions, Next.js + FastAPI config rules |
| 05 | [Database Schema](./05-database-schema.md) | Full PostgreSQL schema, SQLAlchemy models, Alembic |
| 06 | [Product Structure](./06-product-structure.md) | Category hierarchy, product card spec, pricing, digital delivery |
| 07 | [Pages Spec](./07-pages-spec.md) | Every page — homepage, collection, product, cart, checkout, success |
| 08 | [CRO Strategy](./08-cro-strategy.md) | Conversion optimisation rules, A/B tests, mobile CRO |
| 09 | [Tracking](./09-tracking.md) | GA4, Meta Pixel + CAPI, TikTok Pixel + Events API, LinkedIn CAPI |
| 10 | [Backend API](./10-backend-api.md) | Full FastAPI spec — endpoints, schemas, error formats |
| 11 | [Coding Rules](./11-coding-rules.md) | TypeScript + Python standards, component patterns, SEO, a11y |
| 12 | [Email System](./12-email-system.md) | All transactional emails, Resend setup, DNS records |
| 13 | [Deployment](./13-deployment.md) | EasyPanel + Docker + GitHub + Stripe webhooks + Cloudflare |

---

## Quick Start Build Order

1. Set up GitHub repos (`bimvora/frontend`, `bimvora/backend`)
2. Read **03-architecture** + **04-tech-stack** — understand the system
3. Bootstrap frontend: `npx create-next-app@latest bimvora-frontend --typescript --tailwind --app`
4. Bootstrap backend: create `bimvora-backend/` with FastAPI + SQLAlchemy
5. Apply **05-database-schema** via Alembic first migration
6. Build backend API endpoints per **10-backend-api**
7. Build frontend components per **07-pages-spec** + **01-brand-identity**
8. Implement tracking per **09-tracking**
9. Set up email per **12-email-system**
10. Deploy per **13-deployment**

---

## Key Decisions

| Decision | Chosen |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS v4, shadcn/ui |
| Backend | Python 3.12, FastAPI, SQLAlchemy 2.0 async, Alembic |
| Database | PostgreSQL (EasyPanel), DB name: `bimvora` |
| Storage | Supabase Storage (private bucket) |
| Payment | Stripe |
| Email | Resend |
| Hosting | EasyPanel (Docker containers) |
| DNS/CDN | Cloudflare |
| Analytics | GA4 via GTM + Measurement Protocol |
| Ads tracking | Meta CAPI + TikTok Events API + LinkedIn CAPI |
| Domain | bimvora.com (frontend) · api.bimvora.com (backend) |

---

## Brand Summary

**Name:** BIMVORA  
**Tagline:** Professional BIM Content, Ready When You Are.  
**Primary colour:** `#0047CC` (engineering blue)  
**Dark colour:** `#0A0E1A` (near black)  
**Logo:** Circle-B symbol + BIMVORA wordmark  

**3 Initial Product Categories:**
1. HVAC Revit Families
2. Plumbing Revit Families  
3. Clean Room Revit Families

**Target customer:** BIM Modelers · MEP Engineers · HVAC Engineers · Engineering Offices · BIM Managers
