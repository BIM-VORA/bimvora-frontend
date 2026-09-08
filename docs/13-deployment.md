# BIMVORA — Deployment Guide (EasyPanel + GitHub)

## 1. Infrastructure Overview

```
Cloudflare DNS
    ├── bimvora.com          → EasyPanel (Frontend container) : 3000
    └── api.bimvora.com      → EasyPanel (Backend container)  : 8000

EasyPanel Server
    ├── bimvora-frontend     (Docker — Next.js standalone)
    ├── bimvora-backend      (Docker — FastAPI + Uvicorn)
    └── postgres             (EasyPanel built-in PostgreSQL)
                             Database: bimvora
```

---

## 2. GitHub Repository Setup

### Repositories
- `bimvora/frontend` — Next.js frontend
- `bimvora/backend` — FastAPI backend

### Branch Strategy
```
main         → production (auto-deploys via EasyPanel webhook)
develop      → staging
feature/*    → development
```

### GitHub Secrets (for CI/CD)
```
EASYPANEL_WEBHOOK_URL_FRONTEND
EASYPANEL_WEBHOOK_URL_BACKEND
```

---

## 3. Dockerfile — Frontend

```dockerfile
# bimvora-frontend/Dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

### `.dockerignore` (Frontend)
```
.git
.next
node_modules
.env
.env.local
.env.production
npm-debug.log
README.md
docs/
```

### `next.config.ts` (Required for standalone Docker)
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'api.bimvora.com' },
    ],
  },
};

export default nextConfig;
```

### `.env.example` (Frontend)
```env
# === BIMVORA Frontend Environment Variables ===
# Copy to .env.local for development, set in EasyPanel for production

# Site
NEXT_PUBLIC_SITE_URL=https://bimvora.com
NEXT_PUBLIC_API_URL=https://api.bimvora.com

# Supabase (get from supabase.com project settings)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Stripe (publishable key — safe to expose)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Tracking — browser pixels (all NEXT_PUBLIC = exposed to browser, safe)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# Internal — server-side only (do NOT prefix with NEXT_PUBLIC)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
API_INTERNAL_SECRET=changeme-random-32-chars
```

---

## 4. Dockerfile — Backend

```dockerfile
# bimvora-backend/Dockerfile
FROM python:3.12-slim AS builder
WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

FROM python:3.12-slim AS runner
WORKDIR /app

# Runtime dependencies only
RUN apt-get update && apt-get install -y libpq5 && rm -rf /var/lib/apt/lists/*

# Non-root user
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --gid 1001 appuser

COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --chown=appuser:appgroup . .

USER appuser
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import httpx; httpx.get('http://localhost:8000/health')"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
```

### `requirements.txt` (Backend)
```
fastapi==0.115.5
uvicorn[standard]==0.32.1
pydantic==2.10.3
pydantic-settings==2.6.1
sqlalchemy==2.0.36
asyncpg==0.30.0
alembic==1.14.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.12
httpx==0.28.0
stripe==11.3.0
resend==2.5.0
supabase==2.10.0
slowapi==0.1.9
python-dotenv==1.0.1
ruff==0.8.4
```

### `.dockerignore` (Backend)
```
.git
__pycache__
*.pyc
*.pyo
.env
.env.local
.pytest_cache
.mypy_cache
.ruff_cache
README.md
docs/
tests/
```

### `.env.example` (Backend)
```env
# === BIMVORA Backend Environment Variables ===
# Copy to .env for development, set in EasyPanel for production

# Server
PORT=8000
ENVIRONMENT=production
DEBUG=false

# Database — PostgreSQL
# Format: postgresql+asyncpg://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL=postgresql+asyncpg://bimvora:YOUR_PASSWORD@postgres:5432/bimvora

# Supabase Storage (get from supabase.com project settings > API)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_STORAGE_BUCKET=bimvora-files

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Resend)
RESEND_API_KEY=re_...
EMAIL_FROM=orders@bimvora.com

# Frontend (for CORS + redirect URLs)
FRONTEND_URL=https://bimvora.com

# Internal security (must match frontend API_INTERNAL_SECRET)
INTERNAL_SECRET=changeme-random-32-chars

# === Server-side tracking ===

# Meta (Facebook) Conversions API
META_PIXEL_ID=
META_ACCESS_TOKEN=

# TikTok Events API
TIKTOK_PIXEL_ID=
TIKTOK_ACCESS_TOKEN=

# LinkedIn Conversions API
LINKEDIN_PARTNER_ID=
LINKEDIN_ACCESS_TOKEN=
LINKEDIN_CONVERSION_ID=

# Google Analytics 4 Measurement Protocol
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=

# Google Sheets (optional)
SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
SHEETS_SECRET=changeme-random-secret

# Admin
ADMIN_API_KEY=changeme-random-admin-key-32-chars
```

---

## 5. EasyPanel Setup (Step-by-Step)

### Step 1 — PostgreSQL is already installed
Database name: `bimvora`  
Note the host (internal Docker network host, e.g. `postgres`) and credentials.

### Step 2 — Create Frontend Service

1. In EasyPanel → New Service → From GitHub
2. Select repo: `bimvora/frontend`
3. Branch: `main`
4. Build method: Dockerfile
5. Port: `3000`
6. Domain: `bimvora.com` + `www.bimvora.com`
7. SSL: Enable (Let's Encrypt auto)
8. Environment variables: paste all from `.env.example` with real values
9. Deploy

### Step 3 — Create Backend Service

1. In EasyPanel → New Service → From GitHub
2. Select repo: `bimvora/backend`
3. Branch: `main`
4. Build method: Dockerfile
5. Port: `8000`
6. Domain: `api.bimvora.com`
7. SSL: Enable (Let's Encrypt auto)
8. Environment variables: paste all from `.env.example` with real values
9. In `DATABASE_URL`, use the internal EasyPanel PostgreSQL hostname (check EasyPanel PostgreSQL service details)
10. Deploy

### Step 4 — Set up GitHub auto-deploy webhooks

In EasyPanel, each service has a "Deploy webhook URL". Copy it.  
In GitHub repo → Settings → Webhooks → Add webhook:
- Payload URL: the EasyPanel webhook URL
- Content type: `application/json`
- Events: "Just the push event"
- Branch filter: `main`

Now every push to `main` triggers an automatic redeploy.

### Step 5 — Set up Stripe webhook

1. In Stripe Dashboard → Developers → Webhooks → Add endpoint
2. Endpoint URL: `https://api.bimvora.com/webhooks/stripe`
3. Events to send:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy the webhook signing secret → set as `STRIPE_WEBHOOK_SECRET` in backend env

### Step 6 — Set up Supabase Storage

1. Create Supabase project (free tier is fine)
2. Storage → New Bucket → `bimvora-files` → **Private** (not public)
3. Copy Project URL and Service Role Key → set in backend env
4. Files uploaded to this bucket will NEVER be directly accessible — only via signed URLs generated by the backend

### Step 7 — Cloudflare DNS

```
# bimvora.com
A    @       → EasyPanel server IP
A    www     → EasyPanel server IP
A    api     → EasyPanel server IP

# Enable Cloudflare proxy (orange cloud) for DDoS protection
# Set SSL/TLS mode: Full (strict)
```

---

## 6. Health Check Endpoints

```
GET https://api.bimvora.com/health
Response: {"status": "ok", "db": "connected", "version": "1.0.0"}

GET https://bimvora.com/api/health
Response: {"status": "ok"}
```

EasyPanel uses these for restart-on-failure logic.

---

## 7. Database Migration on Backend Start

Alembic runs on every container start. This is safe because migrations are idempotent.

```python
# app/main.py
from contextlib import asynccontextmanager
import asyncio
from alembic.config import Config
from alembic import command

def run_alembic_migrations():
    """Run synchronously in thread pool during startup."""
    cfg = Config("alembic.ini")
    command.upgrade(cfg, "head")

@asynccontextmanager
async def lifespan(app: FastAPI):
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, run_alembic_migrations)
    yield

app = FastAPI(lifespan=lifespan, ...)
```

```ini
# alembic.ini
[alembic]
script_location = alembic
sqlalchemy.url = %(DATABASE_URL)s
```

```python
# alembic/env.py
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.config import settings
from app.models import Base

target_metadata = Base.metadata

def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()

async def run_async_migrations():
    engine = create_async_engine(settings.database_url)
    async with engine.begin() as conn:
        await conn.run_sync(do_run_migrations)
    await engine.dispose()

def run_migrations_online():
    asyncio.run(run_async_migrations())
```

---

## 8. Monitoring & Logging

**Phase 1 (MVP):**
- EasyPanel built-in log viewer for container logs
- Uvicorn access logs (structured JSON format)
- Python `logging` with structured format

**Phase 2 (when needed):**
- Sentry for error tracking (frontend + backend)
- Uptime monitoring: uptimerobot.com (free tier)
- PostHog for analytics + session recordings

**Backend logging setup:**
```python
import logging
import json

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(name)s %(message)s',
)
logger = logging.getLogger("bimvora")

# Usage
logger.info("Order created", extra={"order_id": str(order.id), "total": order.total_cents})
logger.error("Stripe webhook failed", extra={"error": str(e)}, exc_info=True)
```

---

## 9. Backup Strategy

**Database:** EasyPanel PostgreSQL → enable automatic daily backups in EasyPanel settings.  
**Files (Supabase Storage):** Supabase provides automatic backups on paid plans.  
**Code:** GitHub is the source of truth. No local-only code.

---

## 10. Rollback Procedure

1. In EasyPanel → Service → Deployments → select a previous deployment → Re-deploy
2. For database: use Alembic downgrade (`alembic downgrade -1`) before rolling back code if migration was destructive.
3. All migrations should be backwards-compatible when possible (add columns, don't drop immediately).
