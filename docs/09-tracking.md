# BIMVORA — Tracking & Analytics Specification

## 1. Overview

BIMVORA uses a dual-tracking architecture:
- **Browser-side (client):** Fires pixel events in the browser via Google Tag Manager.
- **Server-side (backend):** Fires Conversions API events from the Python backend, deduped against browser events.

**Deduplication key:** Every event pair shares a unique `event_id` (nanoid, 21 chars) generated on the frontend at event time. The browser pixel and the CAPI call send the same `event_id` so each platform can deduplicate.

**Privacy / GDPR:** All user PII sent to CAPI must be SHA-256 hashed (normalised before hashing). Raw PII never leaves the backend.

---

## 2. Events to Track

| Event Name | Trigger | Browser | CAPI/Server |
|---|---|---|---|
| `PageView` | Every page load | ✅ | ❌ |
| `ViewContent` | Product page load | ✅ | ✅ |
| `AddToCart` | Add to cart click | ✅ | ✅ |
| `InitiateCheckout` | Checkout page load / drawer checkout click | ✅ | ✅ |
| `AddPaymentInfo` | Payment form filled | ✅ | ❌ |
| `Purchase` | Order confirmed (success page) | ✅ | ✅ |
| `Lead` | Newsletter subscribe | ✅ | ✅ |
| `Search` | Search form submit | ✅ | ❌ |

---

## 3. GTM Container Setup

**GTM ID:** `GTM-XXXXXXX` (replace with real)

### Tags to configure in GTM

| Tag | Trigger | Type |
|---|---|---|
| GA4 Configuration | All Pages | Google tag (gtag) |
| GA4 Events | Custom events (dataLayer) | GA4 event |
| Meta Pixel — PageView | All Pages | Custom HTML |
| Meta Pixel — Events | Custom events (dataLayer) | Custom HTML |
| TikTok Pixel — PageView | All Pages | Custom HTML |
| TikTok Pixel — Events | Custom events (dataLayer) | Custom HTML |
| LinkedIn Insight Tag | All Pages | Custom HTML |

**Loading strategy:** All GTM scripts: `strategy="afterInteractive"` in Next.js `<Script>` component.

```tsx
// app/layout.tsx
import Script from 'next/script';

// In <head>
<Script
  id="gtm-init"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`,
  }}
/>

// After <body>
<noscript>
  <iframe
    src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
    height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}
  />
</noscript>
```

---

## 4. dataLayer Push Pattern (Frontend)

All tracking events are pushed to `window.dataLayer`. GTM picks them up and routes to each pixel.

```typescript
// lib/tracking/events.ts
import { nanoid } from 'nanoid';

export type TrackingProduct = {
  id: string;         // product ID or SKU
  name: string;
  category: string;   // 'HVAC' | 'Plumbing' | 'Clean Room'
  price: number;      // in USD (not cents)
  currency: string;   // 'USD'
};

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function push(event: string, data: Record<string, unknown>): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
}

export function trackViewContent(product: TrackingProduct): void {
  const event_id = nanoid();
  push('view_content', {
    event_id,
    content_ids: [product.id],
    content_name: product.name,
    content_category: product.category,
    value: product.price,
    currency: product.currency,
    // Also for GA4:
    items: [{ item_id: product.id, item_name: product.name, price: product.price }],
  });
  // Persist event_id for server-side dedup (send to backend)
  serverEvent('ViewContent', event_id, { product });
}

export function trackAddToCart(product: TrackingProduct, cartTotal: number): void {
  const event_id = nanoid();
  push('add_to_cart', {
    event_id,
    content_ids: [product.id],
    content_name: product.name,
    content_category: product.category,
    value: product.price,
    currency: product.currency,
    num_items: 1,
    items: [{ item_id: product.id, item_name: product.name, price: product.price }],
  });
  serverEvent('AddToCart', event_id, { product, cartTotal });
}

export function trackInitiateCheckout(cartItems: TrackingProduct[], total: number): void {
  const event_id = nanoid();
  push('initiate_checkout', {
    event_id,
    content_ids: cartItems.map(i => i.id),
    num_items: cartItems.length,
    value: total,
    currency: 'USD',
    items: cartItems.map(i => ({ item_id: i.id, item_name: i.name, price: i.price })),
  });
  serverEvent('InitiateCheckout', event_id, { cartItems, total });
}

export function trackPurchase(orderId: string, items: TrackingProduct[], total: number): void {
  const event_id = nanoid();
  push('purchase', {
    event_id,
    transaction_id: orderId,
    value: total,
    currency: 'USD',
    content_ids: items.map(i => i.id),
    num_items: items.length,
    items: items.map(i => ({ item_id: i.id, item_name: i.name, price: i.price })),
  });
  // For Purchase, the server-side event is fired from the backend webhook
  // Store event_id in sessionStorage so backend can use it via the order payload
}

// Send event to backend for server-side CAPI
async function serverEvent(
  eventName: string,
  eventId: string,
  data: Record<string, unknown>,
): Promise<void> {
  try {
    await fetch('/api/tracking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: eventName,
        event_id: eventId,
        event_source_url: window.location.href,
        user_agent: navigator.userAgent,
        data,
      }),
    });
  } catch {
    // Non-critical — never block UX for tracking
  }
}
```

---

## 5. GA4 Setup

**Measurement ID:** `G-XXXXXXXXXX` (replace with real)

Configure via `@next/third-parties`:
```tsx
import { GoogleTagManager } from '@next/third-parties/google';
// Already included via GTM — no separate GA4 init needed if using GTM
```

**Key events in GTM → GA4 tag:**
- `view_content` → GA4 `view_item`
- `add_to_cart` → GA4 `add_to_cart`
- `initiate_checkout` → GA4 `begin_checkout`
- `purchase` → GA4 `purchase`

**GA4 Measurement Protocol (server-side purchase confirmation):**

```python
# app/services/tracking.py

import httpx
import hashlib

GA4_ENDPOINT = "https://www.google-analytics.com/mp/collect"

async def send_ga4_purchase(
    measurement_id: str,
    api_secret: str,
    client_id: str,   # from _ga cookie on frontend (pass in order payload)
    order_id: str,
    total_usd: float,
    items: list[dict],
    currency: str = "USD",
):
    payload = {
        "client_id": client_id,
        "events": [{
            "name": "purchase",
            "params": {
                "transaction_id": order_id,
                "value": total_usd,
                "currency": currency,
                "items": [
                    {
                        "item_id": item["product_id"],
                        "item_name": item["name"],
                        "price": item["unit_price_cents"] / 100,
                        "quantity": item["quantity"],
                    }
                    for item in items
                ],
            },
        }],
    }
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{GA4_ENDPOINT}?measurement_id={measurement_id}&api_secret={api_secret}",
            json=payload,
            timeout=5.0,
        )
```

---

## 6. Meta Pixel (Browser)

Configure in GTM as Custom HTML tag.

```javascript
// GTM Custom HTML — Meta Pixel Init (fires on All Pages)
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '{{Meta Pixel ID}}');  // GTM variable
fbq('track', 'PageView');
```

```javascript
// GTM Custom HTML — Meta Pixel Events (fires on dataLayer events)
// Trigger: Custom Event — matches add_to_cart, view_content, purchase, etc.
<script>
(function() {
  var dl = {{dataLayer}};  // GTM built-in variable
  var event = {{Event}};
  
  var eventMap = {
    'view_content':      'ViewContent',
    'add_to_cart':       'AddToCart',
    'initiate_checkout': 'InitiateCheckout',
    'purchase':          'Purchase',
    'lead':              'Lead',
  };
  
  var fbEvent = eventMap[event];
  if (!fbEvent || typeof fbq === 'undefined') return;
  
  fbq('track', fbEvent, {
    content_ids:      [{{dlv - content_ids}}],
    content_name:     {{dlv - content_name}},
    content_category: {{dlv - content_category}},
    value:            {{dlv - value}},
    currency:         {{dlv - currency}},
    num_items:        {{dlv - num_items}},
    eventID:          {{dlv - event_id}},  // CRITICAL for dedup with CAPI
  });
})();
</script>
```

---

## 7. Meta Conversions API (Server-Side)

Called from the Python backend after every key server event.

### PII Hashing (Python)

```python
# app/utils/hashing.py
import hashlib

def hash_pii(value: str | None) -> str | None:
    """Normalise and SHA-256 hash a PII value for Meta CAPI."""
    if not value:
        return None
    normalised = value.strip().lower()
    return hashlib.sha256(normalised.encode()).hexdigest()

def hash_phone(phone: str | None) -> str | None:
    """Strip non-digits, remove leading zeros, then hash."""
    if not phone:
        return None
    digits = ''.join(c for c in phone if c.isdigit()).lstrip('0')
    return hashlib.sha256(digits.encode()).hexdigest()
```

### CAPI Event Payload

```python
# app/services/tracking.py

META_CAPI_URL = "https://graph.facebook.com/v21.0/{pixel_id}/events"

async def send_meta_capi_event(
    event_name: str,           # 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase'
    event_id: str,             # Must match browser pixel eventID for dedup
    event_source_url: str,
    user_email: str | None,
    user_phone: str | None,
    user_first_name: str | None,
    user_last_name: str | None,
    user_country: str | None,
    ip_address: str | None,
    user_agent: str | None,
    fbc: str | None,           # _fbc cookie value from browser
    fbp: str | None,           # _fbp cookie value from browser
    custom_data: dict,
    pixel_id: str,
    access_token: str,
):
    payload = {
        "data": [{
            "event_name": event_name,
            "event_time": int(time.time()),
            "event_id": event_id,        # Dedup key — MUST match browser pixel
            "event_source_url": event_source_url,
            "action_source": "website",
            "user_data": {
                "em": hash_pii(user_email),
                "ph": hash_phone(user_phone),
                "fn": hash_pii(user_first_name),
                "ln": hash_pii(user_last_name),
                "country": hash_pii(user_country),
                "client_ip_address": ip_address,
                "client_user_agent": user_agent,
                "fbc": fbc,
                "fbp": fbp,
            },
            "custom_data": custom_data,  # value, currency, content_ids, etc.
        }],
        "test_event_code": None,  # Set during testing: "TEST12345"
    }
    
    # Remove None values from user_data
    payload["data"][0]["user_data"] = {
        k: v for k, v in payload["data"][0]["user_data"].items() if v is not None
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            META_CAPI_URL.format(pixel_id=pixel_id),
            json=payload,
            params={"access_token": access_token},
            timeout=10.0,
        )
    
    return response.json()
```

### Purchase custom_data

```python
custom_data = {
    "value": order.total_cents / 100,
    "currency": order.currency,
    "content_ids": [str(item.product_id) for item in order.items],
    "content_type": "product",
    "num_items": len(order.items),
    "order_id": str(order.id),
}
```

---

## 8. TikTok Pixel (Browser) + Events API (Server-Side)

### Browser (GTM Custom HTML — all pages)

```javascript
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
  ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
  ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
  for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
  ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
  ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
  ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
  var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;
  var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
  ttq.load('{{TikTok Pixel ID}}');
  ttq.page();
}(window, document, 'ttq');
```

```javascript
// GTM trigger on dataLayer events → TikTok event push
(function() {
  var event = {{Event}};
  var ttEventMap = {
    'view_content':      'ViewContent',
    'add_to_cart':       'AddToCart',
    'initiate_checkout': 'InitiateCheckout',
    'purchase':          'PlaceAnOrder',
    'lead':              'Subscribe',
  };
  var ttEvent = ttEventMap[event];
  if (!ttEvent || typeof ttq === 'undefined') return;
  
  ttq.track(ttEvent, {
    content_id:   {{dlv - content_ids}},
    content_name: {{dlv - content_name}},
    content_type: 'product',
    value:        {{dlv - value}},
    currency:     {{dlv - currency}},
    quantity:     {{dlv - num_items}},
    event_id:     {{dlv - event_id}},  // For dedup with Events API
  });
})();
```

### TikTok Events API (Server-Side — Python)

```python
TIKTOK_EVENTS_API_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/"

async def send_tiktok_server_event(
    event_name: str,     # 'ViewContent' | 'AddToCart' | 'PlaceAnOrder'
    event_id: str,       # Must match browser event_id for dedup
    event_url: str,
    user_email: str | None,
    user_phone: str | None,
    ip_address: str | None,
    user_agent: str | None,
    ttp_cookie: str | None,   # _ttp cookie from browser
    ttclid: str | None,       # ttclid URL param
    properties: dict,
    pixel_id: str,
    access_token: str,
):
    payload = {
        "event_source": "web",
        "event_source_id": pixel_id,
        "data": [{
            "event": event_name,
            "event_time": int(time.time()),
            "event_id": event_id,
            "page": {"url": event_url},
            "user": {
                "email": hash_pii(user_email),
                "phone_number": hash_phone(user_phone),
                "ip": ip_address,
                "user_agent": user_agent,
                "ttp": ttp_cookie,
                "ttclid": ttclid,
            },
            "properties": {
                "content_id": properties.get("content_ids", []),
                "content_type": "product",
                "value": properties.get("value"),
                "currency": properties.get("currency", "USD"),
                "quantity": properties.get("num_items", 1),
            },
        }],
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            TIKTOK_EVENTS_API_URL,
            json=payload,
            headers={"Access-Token": access_token},
            timeout=10.0,
        )
    return response.json()
```

---

## 9. LinkedIn (Browser) + Conversion API (Server-Side)

### Browser Insight Tag (GTM — all pages)

```javascript
// LinkedIn Insight Tag
_linkedin_partner_id = "{{LinkedIn Partner ID}}";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
(function(l) {
  if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
  window.lintrk.q=[]}
  var s = document.getElementsByTagName("script")[0];
  var b = document.createElement("script");
  b.type = "text/javascript";b.async = true;
  b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
  s.parentNode.insertBefore(b, s);
})(window.lintrk);
```

```javascript
// LinkedIn Purchase conversion (fires on purchase dataLayer event)
if (typeof window.lintrk !== 'undefined') {
  window.lintrk('track', { conversion_id: {{LinkedIn Conversion ID}} });
}
```

### LinkedIn CAPI (Server-Side — Python)

```python
LINKEDIN_CAPI_URL = "https://api.linkedin.com/rest/conversionEvents"

async def send_linkedin_conversion(
    conversion_id: str,
    user_email: str,
    event_time_ms: int,
    value_usd: float,
    currency: str,
    access_token: str,
):
    payload = {
        "conversion": f"urn:lla:llaPartnerConversion:{conversion_id}",
        "conversionHappenedAt": event_time_ms,
        "conversionValue": {
            "currencyCode": currency,
            "amount": str(value_usd),
        },
        "eventId": nanoid(),
        "user": {
            "userIds": [{
                "idType": "SHA256_EMAIL",
                "idValue": hash_pii(user_email),
            }],
        },
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            LINKEDIN_CAPI_URL,
            json=payload,
            headers={
                "Authorization": f"Bearer {access_token}",
                "LinkedIn-Version": "202501",
                "X-Restli-Protocol-Version": "2.0.0",
            },
            timeout=10.0,
        )
    return response.status_code
```

---

## 10. Backend Tracking Endpoint

Frontend sends non-Purchase events here for server-side firing.

```
POST /tracking/event
```

```python
# app/schemas/tracking.py
from pydantic import BaseModel

class TrackingEventRequest(BaseModel):
    event_name: str         # 'ViewContent' | 'AddToCart' | 'InitiateCheckout'
    event_id: str           # Shared with browser pixel
    event_source_url: str
    user_agent: str | None = None
    # PII (optional, only if known)
    user_email: str | None = None
    # Cookie values passed from browser
    fbc: str | None = None    # _fbc cookie
    fbp: str | None = None    # _fbp cookie
    ttp: str | None = None    # _ttp cookie (TikTok)
    ttclid: str | None = None
    ga_client_id: str | None = None  # _ga cookie
    # Event data
    content_ids: list[str] = []
    value: float | None = None
    currency: str = "USD"
    num_items: int = 1
```

```python
# app/routers/tracking.py
@router.post("/event", status_code=202)
async def track_event(
    request: Request,
    body: TrackingEventRequest,
):
    ip = request.client.host if request.client else None
    
    # Fire all CAPI calls concurrently
    await asyncio.gather(
        send_meta_capi_event(
            event_name=body.event_name,
            event_id=body.event_id,
            event_source_url=body.event_source_url,
            user_email=body.user_email,
            ip_address=ip,
            user_agent=body.user_agent,
            fbc=body.fbc,
            fbp=body.fbp,
            custom_data={
                "content_ids": body.content_ids,
                "value": body.value,
                "currency": body.currency,
                "num_items": body.num_items,
            },
            pixel_id=settings.meta_pixel_id,
            access_token=settings.meta_access_token,
        ),
        send_tiktok_server_event(
            event_name=body.event_name,
            event_id=body.event_id,
            event_url=body.event_source_url,
            user_email=body.user_email,
            ip_address=ip,
            user_agent=body.user_agent,
            ttp_cookie=body.ttp,
            ttclid=body.ttclid,
            properties={
                "content_ids": body.content_ids,
                "value": body.value,
                "currency": body.currency,
                "num_items": body.num_items,
            },
            pixel_id=settings.tiktok_pixel_id,
            access_token=settings.tiktok_access_token,
        ),
        return_exceptions=True,  # Don't fail if one CAPI call fails
    )
    
    return {"status": "accepted"}
```

---

## 11. Cookie / Consent Handling

**Display:** Cookie consent banner on first visit (bottom of page).  
**Options:** Accept All / Reject Non-Essential  

- If rejected: GTM fires only essential tags (none of the pixel tags fire).
- If accepted: all GTM tags fire normally.
- Consent state stored in `localStorage('bimvora_consent')`.
- On next page load, GTM checks consent variable before firing tags.

**GTM Consent Mode v2:** Configure GTM to use `gtag('consent', 'default', {...})` and `gtag('consent', 'update', {...})` pattern for Google-native consent mode compatibility.

```typescript
// lib/tracking/consent.ts
export function initConsent(): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': Date.now(),
    event: 'gtm.js',
    // Consent defaults — conservative
    consent_analytics_storage: 'denied',
    consent_ad_storage: 'denied',
    consent_ad_personalization: 'denied',
  });
}

export function grantConsent(): void {
  window.dataLayer.push({
    event: 'consent_update',
    consent_analytics_storage: 'granted',
    consent_ad_storage: 'granted',
    consent_ad_personalization: 'granted',
  });
  localStorage.setItem('bimvora_consent', 'granted');
}
```

---

## 12. Cookie Values to Collect on Frontend (Pass to Backend)

Collect these from `document.cookie` and pass in the order creation payload for server-side accuracy:

```typescript
export function getTrackingCookies(): Record<string, string | null> {
  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : null;
  };
  return {
    fbc: getCookie('_fbc'),
    fbp: getCookie('_fbp'),
    ttp: getCookie('_ttp'),
    ga_client_id: getCookie('_ga')?.replace(/^GA\d+\.\d+\./, '') ?? null,
  };
}
```

Include these in the order creation POST body so the backend can use them in the `Purchase` CAPI event fired from the Stripe webhook.
