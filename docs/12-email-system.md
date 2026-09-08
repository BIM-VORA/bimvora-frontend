# BIMVORA — Email System

## 1. Email Provider

**Service:** Resend (resend.com)  
**From address:** `orders@bimvora.com` (set up SPF, DKIM, DMARC on domain)  
**From name:** `BIMVORA`  
**Reply-to:** `support@bimvora.com`  

---

## 2. Transactional Emails

### Email 1 — Order Confirmation + Download Links

**Trigger:** Stripe `payment_intent.succeeded` webhook → order fulfilled.  
**Subject:** `Your BIMVORA order is ready — #{order_number}`  
**Send to:** `customer_email`  

**Content:**
```
Logo + Brand header (dark navy background)

Hello {first_name},

Your payment has been confirmed. Your Revit families are ready to download.

──────────────────────────────────────────────
Order #{order_number}
Date: {date}
Total: ${total_usd} USD
──────────────────────────────────────────────

📦 YOUR DOWNLOADS

[2-Pipe FCU Ceiling Mounted]
File: BIMV-FCU-2P-CEIL-001.rfa (2.4 MB)
Revit 2022–2026
[⬇ Download Now →]  ← Large button linking to /downloads?token=xxx

[HVAC Chiller Air Cooled]
File: BIMV-CHLR-AC-001.rfa (5.1 MB)
Revit 2022–2026
[⬇ Download Now →]

──────────────────────────────────────────────
⚡ HOW TO USE YOUR FAMILY

1. Open Revit
2. Go to Insert → Load Family
3. Select the downloaded .rfa file
4. Place the family and connect to your system
5. Schedule from shared parameters
──────────────────────────────────────────────

Download links expire in: 1 year (you can always access them at bimvora.com/account/downloads)

Questions? Reply to this email or visit our FAQ.

BIMVORA — Professional BIM Content
bimvora.com · support@bimvora.com

Unsubscribe from order notifications
```

---

### Email 2 — Payment Failed

**Trigger:** Stripe `payment_intent.payment_failed` webhook.  
**Subject:** `Payment unsuccessful — BIMVORA`

**Content:**
```
Hello {first_name},

Unfortunately your payment for order #{order_number} was unsuccessful.

Reason: {stripe_decline_reason}  ← e.g. "Card declined"

This can happen due to:
• Insufficient funds
• Card details entered incorrectly
• Card blocked for online transactions

To complete your purchase:
[Try Again →]  ← links to checkout with same cart

If you continue to have problems, contact your bank or try a different card.

BIMVORA Support
```

---

### Email 3 — Password Reset

**Trigger:** Customer requests password reset.  
**Subject:** `Reset your BIMVORA password`

**Content:**
```
Hello {first_name},

We received a request to reset your BIMVORA password.

[Reset Password →]  ← expires in 1 hour

If you didn't request this, ignore this email.
```

---

### Email 4 — Welcome (Account Created)

**Trigger:** Customer completes registration (not guest checkout).  
**Subject:** `Welcome to BIMVORA, {first_name}`

**Content:**
```
Hello {first_name},

Welcome to BIMVORA — your source for professional Revit Families.

Your account is ready. You can now:
✓ Access all your purchased families at any time
✓ Manage your downloads
✓ View order history

[Browse Families →]

The BIMVORA Team
```

---

### Email 5 — Cart Abandonment (Sequence)

**Trigger:** User added to cart, provided email, did not complete purchase.  
**Managed via:** Resend Broadcasts or triggered from backend when order status stays `pending` for 1 hour.

**Email 5a — 1 hour after abandon:**
```
Subject: Your Revit families are still in your cart

{first_name}, you left some families behind.

{Cart items list}
Total: ${cart_total}

Ready to finish?
[Complete Purchase →]

These files are ready to download the moment you pay.
```

**Email 5b — 24 hours after abandon:**
```
Subject: Still thinking about it?

Quick reminder — your cart is saved.

{Cart items list}

Any questions before you purchase? 
Reply to this email and an engineer will answer you personally.

[Complete Purchase →]

BIMVORA — Professional BIM Families
```

**Email 5c — 72 hours after abandon:**
```
Subject: Last reminder — {product_name}

This is the last reminder about your BIMVORA cart.

If you're not sure, here's what other BIM engineers said:
"Saved me 3 hours on the coordination model." — Ahmed K., Dubai

[Complete your purchase →]

(This is the last email we'll send about this cart.)
```

---

## 3. Python Email Service (Resend)

```python
# app/services/email.py
import resend
from app.config import settings
from app.models.order import Order

resend.api_key = settings.resend_api_key

async def send_order_confirmation_email(
    order: Order,
    download_tokens: list[dict],
) -> None:
    """Send order confirmation email with download links."""
    
    download_items_html = ""
    for item in download_tokens:
        download_url = f"{settings.frontend_url}/downloads?token={item['token']}"
        download_items_html += f"""
        <div style="margin-bottom:16px;padding:16px;background:#F7F9FC;border-radius:8px;">
            <strong>{item['product_name']}</strong><br>
            <span style="color:#6B7280;font-size:14px;">{item['file_name']} · {item['file_size_mb']} MB</span><br>
            <a href="{download_url}" style="display:inline-block;margin-top:8px;padding:10px 20px;
               background:#0047CC;color:white;border-radius:6px;text-decoration:none;font-weight:600;">
               ⬇ Download Now
            </a>
        </div>
        """
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family:Inter,sans-serif;color:#0A0E1A;background:#ffffff;max-width:600px;margin:0 auto;">
        <div style="background:#0A0E1A;padding:32px;text-align:center;">
            <span style="color:white;font-size:24px;font-weight:700;letter-spacing:0.1em;">BIMVORA</span>
        </div>
        <div style="padding:32px;">
            <h1 style="font-size:22px;">Your order is ready to download ✅</h1>
            <p>Hello {order.customer_first_name},</p>
            <p>Your payment for order <strong>#{order.order_number}</strong> has been confirmed. 
               Your Revit families are ready.</p>
            
            <h2 style="font-size:16px;border-bottom:1px solid #DDE3EE;padding-bottom:8px;">
                Your Downloads
            </h2>
            {download_items_html}
            
            <p style="color:#6B7280;font-size:13px;margin-top:24px;">
                Download links are valid for 1 year and can be accessed anytime at 
                <a href="{settings.frontend_url}/account/downloads">your account</a>.
            </p>
        </div>
        <div style="background:#F7F9FC;padding:24px;text-align:center;font-size:12px;color:#6B7280;">
            BIMVORA · Professional BIM Families · 
            <a href="https://bimvora.com">bimvora.com</a>
        </div>
    </body>
    </html>
    """
    
    resend.Emails.send({
        "from": f"BIMVORA <{settings.email_from}>",
        "to": [order.customer_email],
        "subject": f"Your BIMVORA order is ready — #{order.order_number}",
        "html": html_content,
        "reply_to": "support@bimvora.com",
    })
```

---

## 4. Email DNS Setup

Set up these DNS records on bimvora.com for email deliverability:

```
# SPF
TXT @ "v=spf1 include:resend.com ~all"

# DKIM (Resend will provide the value)
TXT resend._domainkey "v=DKIM1; p=..."

# DMARC
TXT _dmarc "v=DMARC1; p=quarantine; rua=mailto:dmarc@bimvora.com"

# MX (if accepting inbound replies at support@bimvora.com)
MX @ 10 inbound.resend.com
```

---

## 5. Future Email Marketing (Phase 2)

- **Tool:** Resend Broadcasts or Loops.so
- **Segments:**
  - HVAC buyers → HVAC new release alerts
  - Plumbing buyers → Plumbing new release alerts
  - Never-purchased → nurture sequence + intro offer
- **Frequency:** Maximum 2 emails/month to cold segments.
- **Opt-in:** Newsletter signup in footer + checkout (optional checkbox).
