# BIMVORA — Database Schema (PostgreSQL)

**Database name:** `bimvora`  
**ORM:** SQLAlchemy 2.0 async  
**Migrations:** Alembic  

---

## Enums

```sql
CREATE TYPE order_status AS ENUM ('pending','paid','fulfilled','refunded','cancelled');
CREATE TYPE product_status AS ENUM ('draft','active','archived');
CREATE TYPE discipline AS ENUM ('hvac','plumbing','clean_room','electrical','structural','other');
CREATE TYPE lod_level AS ENUM ('lod_100','lod_200','lod_300','lod_350','lod_400');
CREATE TYPE customer_type AS ENUM ('individual','company');
```

---

## Tables

### `categories`
```sql
CREATE TABLE categories (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT        NOT NULL UNIQUE,
  name          TEXT        NOT NULL,
  description   TEXT,
  discipline    discipline  NOT NULL,
  parent_id     UUID        REFERENCES categories(id) ON DELETE SET NULL,
  image_url     TEXT,
  sort_order    INTEGER     NOT NULL DEFAULT 0,
  is_active     BOOLEAN     NOT NULL DEFAULT true,
  seo_title     TEXT,
  seo_desc      TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Initial categories
-- HVAC Revit Families (discipline=hvac)
-- Plumbing Revit Families (discipline=plumbing)
-- Clean Room Revit Families (discipline=clean_room)
-- Sub-categories can be added via parent_id
```

### `products`
```sql
CREATE TABLE products (
  id                   UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                 TEXT           NOT NULL UNIQUE,
  sku                  TEXT           NOT NULL UNIQUE,
  name                 TEXT           NOT NULL,
  short_description    TEXT           NOT NULL,
  description          TEXT,          -- Rich text / markdown
  status               product_status NOT NULL DEFAULT 'draft',
  discipline           discipline     NOT NULL,
  category_id          UUID           REFERENCES categories(id) ON DELETE SET NULL,

  -- Pricing
  price_cents          INTEGER        NOT NULL CHECK (price_cents >= 0),
  compare_at_price_cents INTEGER,     -- Strikethrough price
  currency             TEXT           NOT NULL DEFAULT 'USD',

  -- BIM/Revit specific
  revit_versions       TEXT[]         NOT NULL,  -- e.g. ['2022','2023','2024','2025','2026']
  lod                  lod_level      NOT NULL DEFAULT 'lod_300',
  file_formats         TEXT[]         NOT NULL DEFAULT ARRAY['.rfa'],
  has_connectors       BOOLEAN        NOT NULL DEFAULT true,
  has_shared_params    BOOLEAN        NOT NULL DEFAULT true,
  is_parametric        BOOLEAN        NOT NULL DEFAULT true,
  manufacturer         TEXT,          -- Equipment manufacturer name (e.g. Carrier, Daikin)
  model_number         TEXT,          -- Optional real equipment model number

  -- Technical specs (JSONB for flexibility)
  -- Example: {"flow_range": "500-5000 l/s", "pressure_drop": "10-200 Pa", "sizes": "600x600 to 2400x1200"}
  specifications       JSONB          NOT NULL DEFAULT '{}',

  -- SEO
  seo_title            TEXT,
  seo_description      TEXT,

  -- Stats
  total_sales          INTEGER        NOT NULL DEFAULT 0,
  average_rating       NUMERIC(3,2),
  review_count         INTEGER        NOT NULL DEFAULT 0,

  -- Timestamps
  created_at           TIMESTAMPTZ    NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status) WHERE status = 'active';
CREATE INDEX idx_products_discipline ON products(discipline);
CREATE INDEX idx_products_slug ON products(slug);
```

### `product_images`
```sql
CREATE TABLE product_images (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url          TEXT        NOT NULL,
  alt_text     TEXT,
  sort_order   INTEGER     NOT NULL DEFAULT 0,
  is_thumbnail BOOLEAN     NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);
```

### `product_files`
```sql
-- Actual downloadable files (stored in Supabase Storage private bucket)
CREATE TABLE product_files (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  storage_path  TEXT        NOT NULL,  -- Supabase Storage path (private)
  file_name     TEXT        NOT NULL,  -- Display name: "HVAC-FCU-2Pipe-v1.0.rfa"
  file_size     BIGINT,                -- bytes
  file_type     TEXT        NOT NULL,  -- '.rfa', '.rvt', '.dwg', '.pdf'
  revit_version TEXT,                  -- e.g. '2024' (if version-specific)
  version       TEXT        NOT NULL DEFAULT '1.0',
  is_primary    BOOLEAN     NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `bundles`
```sql
CREATE TABLE bundles (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                TEXT        NOT NULL UNIQUE,
  name                TEXT        NOT NULL,
  description         TEXT,
  price_cents         INTEGER     NOT NULL,
  compare_at_price_cents INTEGER,
  currency            TEXT        NOT NULL DEFAULT 'USD',
  badge               TEXT,       -- e.g. 'Best Value', 'Save 40%'
  is_active           BOOLEAN     NOT NULL DEFAULT true,
  sort_order          INTEGER     NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE bundle_products (
  bundle_id  UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (bundle_id, product_id)
);
```

### `customers`
```sql
CREATE TABLE customers (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT          NOT NULL UNIQUE,
  first_name      TEXT          NOT NULL,
  last_name       TEXT,
  company         TEXT,
  customer_type   customer_type NOT NULL DEFAULT 'individual',
  country         TEXT,
  password_hash   TEXT,         -- nullable = guest checkout
  stripe_customer_id TEXT       UNIQUE,
  total_spent_cents INTEGER     NOT NULL DEFAULT 0,
  order_count     INTEGER       NOT NULL DEFAULT 0,
  is_active       BOOLEAN       NOT NULL DEFAULT true,
  email_verified  BOOLEAN       NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_stripe ON customers(stripe_customer_id);
```

### `orders`
```sql
CREATE TABLE orders (
  id                       UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number             TEXT         NOT NULL UNIQUE,  -- e.g. BV-2026-0001
  customer_id              UUID         REFERENCES customers(id) ON DELETE SET NULL,
  customer_email           TEXT         NOT NULL,
  customer_first_name      TEXT         NOT NULL,
  customer_last_name       TEXT,
  customer_company         TEXT,
  country                  TEXT         NOT NULL,
  status                   order_status NOT NULL DEFAULT 'pending',

  -- Pricing
  subtotal_cents           INTEGER      NOT NULL,
  discount_cents           INTEGER      NOT NULL DEFAULT 0,
  total_cents              INTEGER      NOT NULL,
  currency                 TEXT         NOT NULL DEFAULT 'USD',
  coupon_code              TEXT,

  -- Payment
  stripe_payment_intent_id TEXT         UNIQUE,
  stripe_session_id        TEXT,
  paid_at                  TIMESTAMPTZ,

  -- Tracking (for server-side pixel dedup)
  event_id                 TEXT,        -- Shared with browser pixel Purchase event
  fbclid                   TEXT,
  gclid                    TEXT,
  ip_address               INET,
  user_agent               TEXT,

  -- Delivery
  sheets_synced            BOOLEAN      NOT NULL DEFAULT false,
  email_sent               BOOLEAN      NOT NULL DEFAULT false,
  downloads_enabled        BOOLEAN      NOT NULL DEFAULT false,

  created_at               TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);
```

### `order_items`
```sql
CREATE TABLE order_items (
  id                UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          UUID    NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id        UUID    REFERENCES products(id) ON DELETE SET NULL,
  bundle_id         UUID    REFERENCES bundles(id) ON DELETE SET NULL,
  item_type         TEXT    NOT NULL DEFAULT 'product',  -- 'product' | 'bundle'
  name              TEXT    NOT NULL,
  sku               TEXT,
  quantity          INTEGER NOT NULL DEFAULT 1,
  unit_price_cents  INTEGER NOT NULL,
  total_price_cents INTEGER NOT NULL,

  CONSTRAINT one_item_type CHECK (
    (product_id IS NOT NULL AND bundle_id IS NULL) OR
    (product_id IS NULL AND bundle_id IS NOT NULL)
  )
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
```

### `download_tokens`
```sql
-- One token per order_item, used to generate signed URLs
CREATE TABLE download_tokens (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id   UUID        NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  product_file_id UUID        NOT NULL REFERENCES product_files(id) ON DELETE CASCADE,
  customer_id     UUID        REFERENCES customers(id) ON DELETE SET NULL,
  token           TEXT        NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  download_count  INTEGER     NOT NULL DEFAULT 0,
  max_downloads   INTEGER     NOT NULL DEFAULT 10,
  expires_at      TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_download_tokens_token ON download_tokens(token);
CREATE INDEX idx_download_tokens_order_item ON download_tokens(order_item_id);
```

### `reviews`
```sql
CREATE TABLE reviews (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID        REFERENCES customers(id) ON DELETE SET NULL,
  order_id    UUID        REFERENCES orders(id) ON DELETE SET NULL,
  rating      SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       TEXT,
  body        TEXT,
  is_verified BOOLEAN     NOT NULL DEFAULT false,  -- Purchased = verified
  is_approved BOOLEAN     NOT NULL DEFAULT false,  -- Admin moderated
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_product ON reviews(product_id) WHERE is_approved = true;
```

### `cross_sells`
```sql
-- Manual cross-sell pairings (product → recommended products)
CREATE TABLE cross_sells (
  source_product_id UUID    NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  target_product_id UUID    NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order        INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (source_product_id, target_product_id)
);
```

### `coupons`
```sql
CREATE TABLE coupons (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  code                TEXT        NOT NULL UNIQUE,
  discount_type       TEXT        NOT NULL CHECK (discount_type IN ('percent','fixed')),
  discount_value      INTEGER     NOT NULL,  -- percent 0-100 or fixed cents
  max_uses            INTEGER,
  used_count          INTEGER     NOT NULL DEFAULT 0,
  minimum_order_cents INTEGER,
  expires_at          TIMESTAMPTZ,
  is_active           BOOLEAN     NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `newsletter_subscribers`
```sql
CREATE TABLE newsletter_subscribers (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT        NOT NULL UNIQUE,
  source      TEXT,       -- 'footer', 'homepage_banner', 'checkout'
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## Updated At Trigger (apply to all tables with updated_at)

```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to: categories, products, bundles, customers, orders
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_bundles_updated_at BEFORE UPDATE ON bundles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

---

## Order Number Generation

```sql
CREATE SEQUENCE order_number_seq START 1000;

-- In application code, generate:
-- BV-{YEAR}-{SEQUENCE_PADDED}
-- e.g. BV-2026-01000
```

---

## SQLAlchemy Model Pattern

```python
# app/models/product.py
from sqlalchemy import Column, String, Integer, Boolean, ARRAY, JSON, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import uuid

class Product(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug = Column(String, nullable=False, unique=True, index=True)
    sku = Column(String, nullable=False, unique=True)
    name = Column(String, nullable=False)
    short_description = Column(String, nullable=False)
    description = Column(String)
    status = Column(SAEnum("draft","active","archived", name="product_status"), default="draft")
    discipline = Column(SAEnum("hvac","plumbing","clean_room","electrical","structural","other", name="discipline"))
    price_cents = Column(Integer, nullable=False)
    compare_at_price_cents = Column(Integer)
    revit_versions = Column(ARRAY(String), nullable=False)
    lod = Column(SAEnum("lod_100","lod_200","lod_300","lod_350","lod_400", name="lod_level"), default="lod_300")
    file_formats = Column(ARRAY(String), default=list)
    has_connectors = Column(Boolean, default=True)
    has_shared_params = Column(Boolean, default=True)
    is_parametric = Column(Boolean, default=True)
    specifications = Column(JSON, default=dict)
    total_sales = Column(Integer, default=0)
    average_rating = Column(Integer)
    review_count = Column(Integer, default=0)
    created_at = Column(TIMESTAMPTZ, default=datetime.utcnow)
    updated_at = Column(TIMESTAMPTZ, default=datetime.utcnow)
```
