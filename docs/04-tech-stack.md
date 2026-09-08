# BIMVORA — Tech Stack & Library Choices

## Frontend

### Core
| Library | Version | Purpose |
|---|---|---|
| `next` | 15.x | App Router, SSR, SSG, ISR, image optimisation |
| `react` | 19.x | UI rendering |
| `typescript` | 5.x | Type safety throughout |

### Styling
| Library | Version | Purpose |
|---|---|---|
| `tailwindcss` | 4.x | Utility-first CSS, design token system |
| `@shadcn/ui` | latest | Accessible headless component library (Radix UI based) |
| `class-variance-authority` | latest | Variant-based component styling |
| `clsx` | latest | Conditional class merging |
| `tailwind-merge` | latest | Merge Tailwind classes without conflicts |
| `lucide-react` | latest | Icon library (consistent, tree-shakeable) |

### State & Data
| Library | Version | Purpose |
|---|---|---|
| `zustand` | 4.x | Cart state, UI state (lightweight, no boilerplate) |
| `@tanstack/react-query` | 5.x | Server state, product data fetching, caching |
| `swr` | 3.x | Lightweight data fetching for non-critical data |

### Forms
| Library | Version | Purpose |
|---|---|---|
| `react-hook-form` | 7.x | Checkout form, contact form |
| `zod` | 3.x | Runtime validation schemas (shared with backend types) |
| `@hookform/resolvers` | latest | Zod integration for react-hook-form |

### Payment
| Library | Version | Purpose |
|---|---|---|
| `@stripe/stripe-js` | latest | Stripe.js loader |
| `@stripe/react-stripe-js` | latest | Stripe Elements (card input) |

### Animations
| Library | Version | Purpose |
|---|---|---|
| `framer-motion` | 11.x | Page transitions, micro-animations, cart drawer |

### Tracking / Analytics
| Library | Version | Purpose |
|---|---|---|
| `@next/third-parties` | latest | Performance-safe GA4 integration |

> **Note:** TikTok, Meta, and LinkedIn pixels are loaded via Google Tag Manager script (GTM), deferred, not via npm packages. This avoids bundle bloat and allows non-developer changes.

### Utilities
| Library | Version | Purpose |
|---|---|---|
| `date-fns` | 3.x | Date formatting |
| `nanoid` | 5.x | Event ID generation for tracking dedup |

---

## Backend (Python)

### Core
| Library | Version | Purpose |
|---|---|---|
| `fastapi` | 0.115.x | API framework |
| `uvicorn[standard]` | 0.32.x | ASGI server |
| `pydantic` | 2.x | Data validation, settings |
| `pydantic-settings` | 2.x | Environment variable management |

### Database
| Library | Version | Purpose |
|---|---|---|
| `sqlalchemy` | 2.x | ORM (async mode) |
| `asyncpg` | 0.30.x | Async PostgreSQL driver |
| `alembic` | 1.14.x | Database migrations |

### Auth
| Library | Version | Purpose |
|---|---|---|
| `python-jose[cryptography]` | 3.x | JWT encode/decode |
| `passlib[bcrypt]` | 1.x | Password hashing |
| `python-multipart` | 0.x | Form data parsing |

### HTTP / External Services
| Library | Version | Purpose |
|---|---|---|
| `httpx` | 0.28.x | Async HTTP client (tracking API calls) |
| `stripe` | 11.x | Stripe Python SDK |
| `resend` | 2.x | Resend email SDK |
| `supabase` | 2.x | Supabase Storage client |

### Security
| Library | Version | Purpose |
|---|---|---|
| `slowapi` | 0.1.x | Rate limiting (Limits integration) |
| `python-dotenv` | 1.x | .env loading in dev |

### Dev
| Library | Version | Purpose |
|---|---|---|
| `pytest` | 8.x | Testing |
| `pytest-asyncio` | 0.24.x | Async test support |
| `httpx` | 0.28.x | Test client |
| `ruff` | 0.8.x | Linting + formatting |
| `mypy` | 1.x | Type checking |

---

## Infrastructure
| Service | Purpose |
|---|---|
| EasyPanel | Docker host — frontend + backend + PostgreSQL |
| Supabase Storage | Private file bucket for .rfa / .rvt files |
| Stripe | Payments |
| Resend | Transactional email |
| Google Tag Manager | Centralised tag management |
| Cloudflare | DNS, CDN, DDoS protection |

---

## Next.js Configuration Rules

### `next.config.ts`
```typescript
const nextConfig = {
  output: 'standalone',              // Required for Docker
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'api.bimvora.com' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui'],
  },
};
```

### Tailwind CSS v4 Config
Use CSS-native configuration in `globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-brand-blue: #0047CC;
  --color-brand-navy: #0A0E1A;
  --color-brand-sky: #00B4D8;
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Geist', 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --radius-card: 12px;
  --radius-button: 8px;
}
```

### Performance Rules
- All pages: `loading="lazy"` for below-fold images, `priority` only for LCP hero image.
- GTM: load with `strategy="afterInteractive"` in `<Script>` component.
- All third-party pixels: loaded inside GTM, not hardcoded in JS bundle.
- Fonts: use `next/font` with `display: 'swap'`, subset to Latin+Arabic if multilingual.
- Bundle analysis: run `ANALYZE=true next build` before each major release.

### React Query Setup
```typescript
// lib/query-client.ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // 5 min stale for product data
      gcTime: 30 * 60 * 1000,      // 30 min cache
    },
  },
});
```

---

## FastAPI Configuration Rules

### App factory (`main.py`)
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import engine, Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run Alembic migrations on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title="BIMVORA API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.debug else None,  # Disable in prod
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Async DB session dependency
```python
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import SessionLocal

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session
```

### Router registration
```python
app.include_router(products.router, prefix="/products", tags=["products"])
app.include_router(categories.router, prefix="/categories", tags=["categories"])
app.include_router(orders.router, prefix="/orders", tags=["orders"])
app.include_router(customers.router, prefix="/customers", tags=["customers"])
app.include_router(downloads.router, prefix="/downloads", tags=["downloads"])
app.include_router(tracking.router, prefix="/tracking", tags=["tracking"])
app.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
```
