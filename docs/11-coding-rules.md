# BIMVORA — Coding Rules & Standards

## 1. General Principles

1. **Readability over cleverness.** Code is read 10× more than it's written.
2. **Types everywhere.** No `any` in TypeScript. No untyped function params in Python.
3. **One thing per file.** One component, one hook, one service function per file.
4. **No magic numbers.** Named constants in `lib/constants.ts` or config.
5. **Fail loudly in development, gracefully in production.** Throw in dev, catch + log in prod.
6. **Never break the UI for tracking failures.** All pixel/CAPI calls wrapped in try/catch.
7. **Comments explain WHY, not WHAT.** If the code is clear, no comment needed.

---

## 2. Frontend Rules (Next.js / TypeScript / React)

### File Naming
```
Components:          PascalCase.tsx       ProductCard.tsx
Hooks:               camelCase.ts         useCart.ts
Utilities:           camelCase.ts         formatPrice.ts
Constants:           SCREAMING_SNAKE.ts   REVIT_VERSIONS.ts
Types:               PascalCase.ts        Product.ts
API functions:       camelCase.ts         getProducts.ts
Pages (App Router):  page.tsx             app/(shop)/products/[slug]/page.tsx
Layouts:             layout.tsx
```

### Component Structure

```tsx
// components/product/ProductCard.tsx
import { type FC } from 'react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils/format';
import { Badge } from '@/components/ui/Badge';
import type { Product } from '@/lib/api/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  className?: string;
}

const ProductCard: FC<ProductCardProps> = ({ product, onAddToCart, className }) => {
  // Derived state at the top
  const hasDiscount = product.compare_at_price_cents !== null;
  const price = formatPrice(product.price_cents, product.currency);
  const compareAtPrice = hasDiscount
    ? formatPrice(product.compare_at_price_cents!, product.currency)
    : null;

  // Handlers grouped together
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  // JSX last
  return (
    <article className={cn('product-card', className)}>
      {/* ... */}
    </article>
  );
};

export default ProductCard;
```

### TypeScript Rules
- All component props: explicit `interface` or `type`, never inline.
- All API response types: defined in `lib/api/types.ts`.
- All environment variables: typed in `lib/env.ts` using Zod:

```typescript
// lib/env.ts
import { z } from 'zod';

const schema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
  NEXT_PUBLIC_META_PIXEL_ID: z.string().optional(),
  // ...
});

export const env = schema.parse(process.env);
```

### Tailwind Rules
- Use design tokens from `globals.css` `@theme` block, not raw hex values.
- Use `cn()` (clsx + tailwind-merge) for all conditional class names.
- Never use inline `style` for colours or spacing that exists in the token system.
- No arbitrary values `[#abc123]` — add to theme if needed.

### Data Fetching

**Server Components (default):**
```tsx
// app/(shop)/collections/[slug]/page.tsx
export default async function CollectionPage({ params }: { params: { slug: string } }) {
  const category = await getCategory(params.slug);  // Direct fetch, no useEffect
  const products = await getProducts({ category_slug: params.slug });
  
  if (!category) notFound();
  
  return <CollectionView category={category} products={products} />;
}

// Generate static paths for common categories
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map(c => ({ slug: c.slug }));
}

// ISR — revalidate every hour
export const revalidate = 3600;
```

**Client Components (interactivity only):**
- Only mark `'use client'` when you need: `useState`, `useEffect`, browser APIs, event listeners, Zustand.
- Keep client components as small and leaf-level as possible.
- Never fetch data in a client component when a server component can do it.

### Cart Store (Zustand)

```typescript
// lib/cart/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/lib/api/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => set(state => ({
        items: state.items.find(i => i.id === item.id)
          ? state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
          : [...state.items, { ...item, quantity: 1 }],
        isOpen: true,  // Auto-open drawer on add
      })),
      removeItem: (id) => set(state => ({ items: state.items.filter(i => i.id !== id) })),
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      total: () => get().items.reduce((sum, i) => sum + (i.price_cents * i.quantity), 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'bimvora-cart' }
  )
);
```

### Error Handling (Frontend)

```tsx
// Every page that fetches data:
export default async function ProductPage({ params }) {
  try {
    const product = await getProduct(params.slug);
    if (!product) notFound();
    return <ProductView product={product} />;
  } catch (error) {
    // Log to monitoring (Sentry in future)
    console.error('ProductPage fetch error:', error);
    throw error;  // Next.js will use error.tsx
  }
}

// error.tsx at route level — user-friendly error page
'use client';
export default function Error({ error, reset }) {
  return (
    <div>
      <p>Something went wrong loading this page.</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## 3. Backend Rules (Python / FastAPI)

### File / Module Naming
```
snake_case for all Python files and modules.
PascalCase for classes (ORM models, Pydantic schemas).
snake_case for functions and variables.
SCREAMING_SNAKE_CASE for constants.
```

### Router Pattern

```python
# app/routers/products.py
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.product import ProductList, ProductDetail
from app import crud

router = APIRouter()

@router.get("/", response_model=ProductList)
async def list_products(
    db: AsyncSession = Depends(get_db),
    category_slug: str | None = Query(None),
    discipline: str | None = Query(None),
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(24, ge=1, le=96),
):
    """List active products with optional filtering."""
    products, total = await crud.product.get_multi(
        db,
        category_slug=category_slug,
        discipline=discipline,
        search=search,
        page=page,
        per_page=per_page,
    )
    return ProductList(items=products, total=total, page=page, per_page=per_page)
```

### Schema Pattern (Pydantic v2)

```python
# app/schemas/product.py
from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    short_description: str
    price_cents: int
    currency: str = "USD"

class ProductCreate(ProductBase):
    slug: str
    sku: str
    discipline: str
    category_id: UUID
    revit_versions: list[str]

class ProductRead(ProductBase):
    model_config = ConfigDict(from_attributes=True)  # ORM mode
    
    id: UUID
    slug: str
    sku: str
    discipline: str
    lod: str
    revit_versions: list[str]
    has_connectors: bool
    average_rating: float | None
    review_count: int
    created_at: datetime

class ProductList(BaseModel):
    items: list[ProductRead]
    total: int
    page: int
    per_page: int

    @property
    def pages(self) -> int:
        return (self.total + self.per_page - 1) // self.per_page
```

### CRUD Pattern

```python
# app/crud/product.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from app.models.product import Product

class ProductCRUD:
    async def get_by_slug(self, db: AsyncSession, slug: str) -> Product | None:
        result = await db.execute(
            select(Product).where(Product.slug == slug, Product.status == "active")
        )
        return result.scalar_one_or_none()

    async def get_multi(
        self,
        db: AsyncSession,
        *,
        category_slug: str | None = None,
        discipline: str | None = None,
        search: str | None = None,
        page: int = 1,
        per_page: int = 24,
    ) -> tuple[list[Product], int]:
        query = select(Product).where(Product.status == "active")
        
        if discipline:
            query = query.where(Product.discipline == discipline)
        if search:
            query = query.where(
                or_(
                    Product.name.ilike(f"%{search}%"),
                    Product.short_description.ilike(f"%{search}%"),
                )
            )
        
        count_query = select(func.count()).select_from(query.subquery())
        total = await db.scalar(count_query) or 0
        
        query = query.offset((page - 1) * per_page).limit(per_page)
        result = await db.execute(query)
        return result.scalars().all(), total

product = ProductCRUD()
```

### Config Pattern (pydantic-settings)

```python
# app/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    
    # Server
    port: int = 8000
    environment: str = "production"
    debug: bool = False
    
    # Database
    database_url: str
    
    # Stripe
    stripe_secret_key: str
    stripe_webhook_secret: str
    
    # Email
    resend_api_key: str
    email_from: str = "orders@bimvora.com"
    
    # Frontend
    frontend_url: str = "https://bimvora.com"
    internal_secret: str
    
    # Tracking
    meta_pixel_id: str = ""
    meta_access_token: str = ""
    tiktok_pixel_id: str = ""
    tiktok_access_token: str = ""
    linkedin_partner_id: str = ""
    linkedin_access_token: str = ""
    ga4_measurement_id: str = ""
    ga4_api_secret: str = ""
    
    # Storage
    supabase_url: str
    supabase_service_role_key: str
    supabase_storage_bucket: str = "bimvora-files"

settings = Settings()
```

### Async Best Practices

```python
# DO: Use asyncio.gather for concurrent I/O operations
await asyncio.gather(
    send_email(order),
    fire_tracking_events(order),
    sync_to_sheets(order),
    return_exceptions=True,  # Don't fail if one task fails
)

# DO: Use async context managers for sessions
async with SessionLocal() as session:
    await session.execute(...)
    await session.commit()

# DON'T: Block the event loop with synchronous I/O
# result = requests.get(...)  ← WRONG, use httpx
result = await httpx.get(...)  # CORRECT

# DON'T: Open a DB session in a background task without its own session
# Background tasks must create their own sessions
async def background_task(order_id: str):
    async with SessionLocal() as db:
        order = await db.get(Order, order_id)
        # ...
```

---

## 4. SEO Rules (Frontend)

Every page must export `generateMetadata`:

```typescript
// app/(shop)/products/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) return {};
  
  return {
    title: product.seo_title || `${product.name} — BIMVORA`,
    description: product.seo_description || product.short_description,
    openGraph: {
      title: product.name,
      description: product.short_description,
      images: [{ url: product.images[0]?.url ?? '/og-default.png' }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}
```

**Structured Data (JSON-LD)** for product pages:
```tsx
// Product schema
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.short_description,
  sku: product.sku,
  offers: {
    '@type': 'Offer',
    price: (product.price_cents / 100).toFixed(2),
    priceCurrency: product.currency,
    availability: 'https://schema.org/InStock',
    seller: { '@type': 'Organization', name: 'BIMVORA' },
  },
  aggregateRating: product.review_count > 0 ? {
    '@type': 'AggregateRating',
    ratingValue: product.average_rating,
    reviewCount: product.review_count,
  } : undefined,
};

// In component:
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
```

**Sitemap** (`app/sitemap.ts`):
```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts({ per_page: 500 });
  const categories = await getCategories();
  
  return [
    { url: 'https://bimvora.com', lastModified: new Date() },
    { url: 'https://bimvora.com/about' },
    { url: 'https://bimvora.com/contact' },
    ...categories.map(c => ({
      url: `https://bimvora.com/collections/${c.slug}`,
      lastModified: new Date(),
    })),
    ...products.items.map(p => ({
      url: `https://bimvora.com/products/${p.slug}`,
      lastModified: new Date(p.updated_at),
    })),
  ];
}
```

---

## 5. Accessibility Rules

- All images: `alt` text. Decorative images: `alt=""`.
- All interactive elements: focusable, keyboard navigable.
- Colour contrast: minimum WCAG AA (4.5:1 for text).
- Cart drawer: focus trap when open. `aria-modal="true"`, `role="dialog"`.
- Form errors: `aria-describedby` linking input to error message.
- Star ratings: screen reader text "4.9 out of 5 stars".

---

## 6. Performance Rules

- LCP image: always `<Image priority />`, never lazy.
- Below-fold images: always `loading="lazy"` (Next.js `<Image>` default).
- No layout shift: always specify `width` and `height` or `fill` on `<Image>`.
- Stripe JS: load only on checkout page with `loadStripe()` called inside `useEffect` or on demand.
- Dynamic imports for heavy components:
```typescript
const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer'), { ssr: false });
```
- Bundle size: Check with `ANALYZE=true next build`. No single chunk > 500KB.

---

## 7. Git & Code Quality

### Branch naming
```
feature/product-card-redesign
fix/cart-quantity-bug
chore/update-dependencies
```

### Commit format (Conventional Commits)
```
feat(product): add Revit version filter chip
fix(cart): prevent duplicate item on rapid click
chore(deps): update stripe to v11
docs: add tracking documentation
```

### Before committing
- `npm run lint` — zero ESLint errors
- `npm run type-check` — zero TypeScript errors
- `ruff check .` (backend) — zero linting errors
- `mypy app` (backend) — zero type errors

### Code review checklist
- [ ] No hardcoded colours, only token classes
- [ ] All props typed
- [ ] Server components used where possible (no unnecessary `'use client'`)
- [ ] No console.log in production code
- [ ] Error states handled
- [ ] Mobile layout checked
- [ ] SEO metadata present on new pages
