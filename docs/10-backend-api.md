# BIMVORA — Backend API Specification (FastAPI)

**Base URL:** `https://api.bimvora.com`  
**Framework:** Python 3.12 + FastAPI + SQLAlchemy 2.0 async + Alembic  
**Auth:** JWT Bearer tokens (access: 15min, refresh: 30 days)  
**Docs:** `/docs` (Swagger) — disabled in production via env flag  

---

## Authentication

### Public endpoints (no auth required)
- All `GET /products/*`
- All `GET /categories/*`
- `POST /orders` (checkout)
- `POST /tracking/event`
- `GET /downloads/{token}` (token-based, no JWT)
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /webhooks/stripe`
- `POST /newsletter/subscribe`

### Customer endpoints (JWT required)
- `GET /customers/me`
- `GET /customers/me/orders`
- `GET /customers/me/downloads`
- `PUT /customers/me`

### Admin endpoints (JWT + admin role required)
- All `GET/POST/PUT/DELETE /admin/*`

---

## Core Endpoints

---

### Auth

#### `POST /auth/register`
```json
// Request
{
  "email": "ahmed@company.com",
  "password": "securepassword",
  "first_name": "Ahmed",
  "last_name": "Hassan",
  "company": "MEP Engineering Co."
}

// Response 201
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "customer": {
    "id": "uuid",
    "email": "ahmed@company.com",
    "first_name": "Ahmed"
  }
}
```

#### `POST /auth/login`
```json
// Request
{ "email": "ahmed@company.com", "password": "securepassword" }

// Response 200
{ "access_token": "eyJ...", "refresh_token": "eyJ..." }
```

#### `POST /auth/refresh`
```json
// Request
{ "refresh_token": "eyJ..." }

// Response 200
{ "access_token": "eyJ..." }
```

---

### Products

#### `GET /products`
```
Query params:
  category_slug   string    Filter by category slug
  discipline      string    'hvac' | 'plumbing' | 'clean_room'
  search          string    Full-text search on name, description
  revit_version   string    '2024' — filter families that include this version
  lod             string    'lod_300'
  sort            string    'popular' | 'newest' | 'price_asc' | 'price_desc'
  page            int       default 1
  per_page        int       default 24, max 96
```

```json
// Response 200
{
  "items": [
    {
      "id": "uuid",
      "slug": "2-pipe-fcu-ceiling-mounted",
      "sku": "BIMV-FCU-2P-CEIL-001",
      "name": "2-Pipe Fan Coil Unit — Ceiling Mounted",
      "short_description": "...",
      "discipline": "hvac",
      "category": { "id": "uuid", "name": "Fan Coil Units", "slug": "fan-coil-units" },
      "price_cents": 2900,
      "compare_at_price_cents": 4900,
      "currency": "USD",
      "revit_versions": ["2022","2023","2024","2025","2026"],
      "lod": "lod_300",
      "file_formats": [".rfa", ".pdf"],
      "has_connectors": true,
      "has_shared_params": true,
      "is_parametric": true,
      "average_rating": 4.9,
      "review_count": 18,
      "total_sales": 234,
      "thumbnail_url": "https://...",
    }
  ],
  "total": 48,
  "page": 1,
  "per_page": 24,
  "pages": 2
}
```

#### `GET /products/{slug}`
```json
// Response 200 — full product detail
{
  "id": "uuid",
  "slug": "...",
  "sku": "...",
  "name": "...",
  "short_description": "...",
  "description": "...",
  "discipline": "hvac",
  "category": { ... },
  "price_cents": 2900,
  "compare_at_price_cents": 4900,
  "currency": "USD",
  "revit_versions": ["2022","2023","2024","2025","2026"],
  "lod": "lod_300",
  "file_formats": [".rfa", ".pdf"],
  "has_connectors": true,
  "has_shared_params": true,
  "is_parametric": true,
  "manufacturer": null,
  "specifications": {
    "cooling_capacity": "0.5 to 15 kW",
    "airflow": "100 to 2,000 m³/h",
    "pipe_size": "DN15 / DN20"
  },
  "images": [
    { "url": "...", "alt_text": "...", "is_thumbnail": true, "sort_order": 0 }
  ],
  "files": [
    { "file_name": "BIMV-FCU-2P-CEIL-001.rfa", "file_type": ".rfa", "file_size": 2457600, "revit_version": null }
  ],
  "average_rating": 4.9,
  "review_count": 18,
  "total_sales": 234,
  "seo_title": "...",
  "seo_description": "...",
  "cross_sells": [
    { "id": "uuid", "slug": "...", "name": "...", "price_cents": 1900, "thumbnail_url": "..." }
  ],
  "created_at": "2026-01-15T10:00:00Z"
}
```

---

### Categories

#### `GET /categories`
```json
// Response 200
{
  "items": [
    {
      "id": "uuid",
      "slug": "hvac-revit-families",
      "name": "HVAC Revit Families",
      "description": "...",
      "discipline": "hvac",
      "parent_id": null,
      "image_url": "...",
      "product_count": 48,
      "children": [
        { "id": "uuid", "slug": "fan-coil-units", "name": "Fan Coil Units", "product_count": 12 }
      ]
    }
  ]
}
```

#### `GET /categories/{slug}`
Returns category + child categories + paginated product list.

---

### Orders (Checkout)

#### `POST /orders`
This is called from the Next.js route handler (`/api/checkout`), never directly from the browser. The route handler adds the internal secret header.

```json
// Request
{
  "customer_email": "ahmed@company.com",
  "customer_first_name": "Ahmed",
  "customer_last_name": "Hassan",
  "customer_company": "MEP Engineering Co.",
  "country": "AE",
  "currency": "USD",
  "items": [
    { "product_id": "uuid", "quantity": 1 },
    { "bundle_id": "uuid", "quantity": 1 }
  ],
  "coupon_code": "SAVE20",
  // Tracking data (from browser cookies)
  "event_id": "nanoid-21-chars",
  "fbc": "_fbc.bimvora.com.1...",
  "fbp": "fb.1.1234567890...",
  "ttp": "...",
  "ga_client_id": "1234567890.9876543210",
  "ip_address": "1.2.3.4",
  "user_agent": "Mozilla/5.0...",
  "event_source_url": "https://bimvora.com/checkout"
}

// Response 201
{
  "order_id": "uuid",
  "order_number": "BV-2026-01042",
  "stripe_client_secret": "pi_xxx_secret_xxx",  // For Stripe Elements
  "total_cents": 9700,
  "currency": "USD"
}
```

#### `GET /orders/{order_id}/status`
```json
// Response 200
{
  "order_id": "uuid",
  "order_number": "BV-2026-01042",
  "status": "paid",  // 'pending' | 'paid' | 'fulfilled'
  "downloads_enabled": true
}
```

---

### Downloads

#### `GET /downloads/{token}`
Resolves a download token and returns a signed Supabase Storage URL.

```json
// Response 200
{
  "signed_url": "https://xxx.supabase.co/storage/v1/object/sign/...",
  "file_name": "BIMV-FCU-2P-CEIL-001.rfa",
  "expires_in_seconds": 3600
}

// Response 404 — token not found
// Response 410 — token expired or max downloads exceeded
```

#### `GET /customers/me/downloads`
Returns all active download tokens for the authenticated customer.

---

### Webhooks

#### `POST /webhooks/stripe`
Receives Stripe webhook events. Verifies signature using `STRIPE_WEBHOOK_SECRET`.

**Handled events:**
- `payment_intent.succeeded` → order status `paid`, generate download tokens, send email, fire CAPI Purchase event, sync to Sheets.
- `payment_intent.payment_failed` → order status `cancelled`, send failure email.

```python
# app/routers/webhooks.py
@router.post("/stripe")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.stripe_webhook_secret
        )
    except ValueError:
        raise HTTPException(400, "Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(400, "Invalid signature")
    
    if event["type"] == "payment_intent.succeeded":
        pi = event["data"]["object"]
        order_id = pi["metadata"]["order_id"]
        await fulfill_order(db, order_id, pi["id"])
    
    return {"status": "ok"}
```

---

### Tracking

#### `POST /tracking/event`
See `09-tracking.md` for full spec.

```json
// Request
{
  "event_name": "AddToCart",
  "event_id": "abc123...",
  "event_source_url": "https://bimvora.com/products/...",
  "user_agent": "Mozilla/5.0...",
  "fbc": "_fbc.bimvora.com...",
  "fbp": "fb.1...",
  "ttp": "...",
  "content_ids": ["product-uuid"],
  "value": 29.00,
  "currency": "USD",
  "num_items": 1
}

// Response 202
{ "status": "accepted" }
```

---

### Admin

All admin endpoints require `Authorization: Bearer {ADMIN_JWT}` and user with admin role.

#### `GET /admin/orders`
```
Query: status, page, per_page, search (email/order_number), date_from, date_to
```

#### `GET /admin/orders/{id}` 
Full order detail with customer, items, download tokens.

#### `PATCH /admin/orders/{id}`
Update status, trigger re-fulfillment.

#### `GET /admin/products`
#### `POST /admin/products`
#### `PUT /admin/products/{id}`
#### `DELETE /admin/products/{id}` (soft delete — sets status=archived)

#### `GET /admin/customers`
#### `GET /admin/customers/{id}`

#### `GET /admin/analytics/summary`
```json
// Response 200
{
  "total_revenue_cents": 1234500,
  "orders_count": 127,
  "customers_count": 89,
  "downloads_count": 340,
  "top_products": [
    { "id": "uuid", "name": "...", "total_sales": 45, "revenue_cents": 130500 }
  ],
  "revenue_by_day": [
    { "date": "2026-08-29", "revenue_cents": 58000 }
  ]
}
```

---

## Order Fulfillment Service

```python
# app/services/orders.py

async def fulfill_order(db: AsyncSession, order_id: str, stripe_pi_id: str):
    """Called after Stripe payment_intent.succeeded webhook."""
    
    # 1. Update order status
    order = await db.get(Order, order_id)
    order.status = "paid"
    order.stripe_payment_intent_id = stripe_pi_id
    order.paid_at = datetime.utcnow()
    order.downloads_enabled = True
    await db.commit()
    
    # 2. Generate download tokens (one per file, per order item)
    tokens = await generate_download_tokens(db, order)
    
    # 3. Send confirmation email (async, non-blocking)
    asyncio.create_task(
        send_order_confirmation_email(order, tokens)
    )
    
    # 4. Server-side tracking (Purchase CAPI events)
    asyncio.create_task(
        fire_purchase_tracking(order)
    )
    
    # 5. Sync to Google Sheets
    asyncio.create_task(
        sync_order_to_sheets(order)
    )
    
    return order
```

---

## Error Response Format

```json
// All errors follow this format
{
  "detail": "Human-readable error message",
  "code": "MACHINE_READABLE_CODE",  // optional
  "field": "email"                   // optional, for validation errors
}

// Validation errors (422 Unprocessable Entity)
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "email"],
      "msg": "Field required",
      "input": {}
    }
  ]
}
```

---

## Rate Limiting

Using `slowapi`:

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/orders")
@limiter.limit("10/minute")
async def create_order(request: Request, ...):
    ...

@router.post("/auth/login")
@limiter.limit("5/minute")
async def login(request: Request, ...):
    ...

@router.post("/tracking/event")
@limiter.limit("60/minute")
async def track_event(request: Request, ...):
    ...
```

---

## Database Session Pattern

```python
# app/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

engine = create_async_engine(
    settings.database_url,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
)

SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
```

---

## Alembic Migration (auto-run on startup)

```python
# app/main.py — in lifespan()
from alembic.config import Config
from alembic import command

def run_migrations():
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run migrations synchronously before starting
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, run_migrations)
    yield
```
