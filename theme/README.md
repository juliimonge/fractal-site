# shop.julianmonge.com — Shopify theme

A Dawn-based Shopify theme for **Julián Monge** (Blue Water Properties, Nosara, Costa Rica). Editorial, luxury coastal, minimal. Mobile-first.

This repo contains **only the brand overrides** — not a full copy of Dawn. The bootstrap script clones a fresh Dawn and overlays these files on top. That way Dawn stays upgradeable and our diff stays small and reviewable.

---

## Layout

```
theme/
├── config/
│   ├── settings_data.json              # Brand tokens preloaded (colors, fonts, URLs)
│   └── settings_schema.brand-patch.json # "Brand" settings group, merged into Dawn's schema
├── layout/
│   └── theme.liquid                    # Full replacement: fonts, OG meta, sticky back-bar
├── sections/
│   ├── back-bar.liquid                 # Sticky "← Back to julianmonge.com" bar
│   ├── back-bar-group.json             # Mounts back-bar on every page
│   ├── header.liquid                   # Shop / Services / About / Contact nav
│   ├── header-group.json
│   └── main-product-service.liquid     # Calendly-only product page (no cart, no checkout)
├── templates/
│   ├── index.json                      # Editorial homepage
│   ├── product.service.json            # Uses the Calendly template
│   ├── page.about.json
│   └── page.contact.json
├── snippets/
│   └── seo-meta.liquid                 # OG + Twitter tags for products / collections / pages
├── assets/
│   ├── brand.css                       # Brand color + font tokens, button & header overrides
│   └── back-bar.css                    # Sticky-bar styles
└── locales/
    └── en.default.schema.json

scripts/
├── bootstrap-theme.sh                  # Clone Dawn + overlay these files → .build/theme
├── merge-settings-schema.mjs           # Merges the "Brand" group into Dawn's settings_schema.json
└── apply-seed.mjs                      # Creates collections + products from shopify-seed/store.json

shopify-seed/
└── store.json                          # Collections + product data (Digital, Services, Merch)
```

---

## Brand tokens

| Token             | Hex       | Used for                              |
|-------------------|-----------|---------------------------------------|
| Deep Teal         | `#0C2830` | Primary text, primary buttons, footer |
| Ocean Blue        | `#17617C` | Links, accents, secondary buttons     |
| Light Teal        | `#99D6D8` | Soft surfaces, hover states           |
| Warm Off-White    | `#F5F0E6` | Page background                       |
| White             | `#FFFFFF` | Cards, button text                    |

Fonts: **Playfair Display** (headings, 400–700) / **Inter** (body, 300–700). Loaded from Google Fonts in `layout/theme.liquid`.

These are wired into:
- `theme/assets/brand.css` (CSS custom properties + overrides for Dawn classes)
- `theme/config/settings_data.json` (preloaded merchant settings)
- `theme/config/settings_schema.brand-patch.json` (a "Brand" admin settings group)

---

## Setup — step by step

### 1. Install the Shopify CLI

```bash
npm install -g @shopify/cli @shopify/theme
```

Verify:

```bash
shopify version
```

### 2. Bootstrap the theme

From the repo root:

```bash
./scripts/bootstrap-theme.sh julianmonge
```

This:
1. Clones Shopify Dawn into `.build/theme/`
2. Overlays everything from `theme/` on top
3. Merges the "Brand" group into Dawn's `settings_schema.json`

### 3. Push to your store

```bash
cd .build/theme

# Authenticate (opens browser)
shopify theme dev --store julianmonge.myshopify.com

# Preview a hot-reloading local copy (recommended first)
# Or push as an unpublished theme draft:
shopify theme push --unpublished --store julianmonge.myshopify.com

# When ready to go live:
shopify theme push --live --store julianmonge.myshopify.com
```

### 4. Seed collections & products

Generate an Admin API access token (Shopify admin → **Settings → Apps and sales channels → Develop apps → Create app**), grant `read_products` + `write_products` + `read_publications` + `write_publications` scopes, then:

```bash
export SHOPIFY_STORE=julianmonge.myshopify.com
export SHOPIFY_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxx

node scripts/apply-seed.mjs
```

The script is idempotent on `handle` — it skips items that already exist.

---

## Custom subdomain — `shop.julianmonge.com`

Shopify supports custom domains via either Shopify-managed DNS or your own registrar. Both routes are documented here.

### Option A — your registrar manages DNS (recommended)

1. **In Shopify admin:** *Settings → Domains → Connect existing domain → `shop.julianmonge.com`.*
2. Shopify shows the required DNS record. Either:
   - **CNAME**: `shop` → `shops.myshopify.com`
   - or follow Shopify's current instructions if they've changed
3. **In your registrar's DNS settings** (Cloudflare, Namecheap, GoDaddy, etc.) for `julianmonge.com`:
   - Add a CNAME record:
     - Name: `shop`
     - Target: `shops.myshopify.com`
     - TTL: 3600 (or "auto")
   - If Cloudflare: set the proxy status to **DNS only (gray cloud)** at first; you can enable proxying later.
4. Back in Shopify, click **Verify connection**. Propagation usually takes 5–60 minutes.
5. Once verified, in **Settings → Domains** set `shop.julianmonge.com` as the **primary** domain (or keep `julianmonge.myshopify.com` as canonical and `shop.julianmonge.com` as the public face — your call).

### Option B — Shopify-managed DNS

Only relevant if you want Shopify to host the apex zone. Not recommended when `julianmonge.com` already lives on your existing registrar.

### Verify

```bash
dig +short shop.julianmonge.com
# expect: a CNAME chain to shops.myshopify.com → Shopify's IPs

curl -I https://shop.julianmonge.com
# expect: 200 or 301 with x-shopify-stage / x-shopid headers
```

---

## Digital Downloads (Collection 1)

The **Digital Products** collection uses Shopify's first-party [Digital Downloads](https://apps.shopify.com/digital-downloads) app for automatic file delivery after checkout.

### Install

1. Visit [apps.shopify.com/digital-downloads](https://apps.shopify.com/digital-downloads) and click **Add app**.
2. Approve the install (free, by Shopify).

### Wire up each product

Once `apply-seed.mjs` has created the four products in **Digital Products**:

For each of: *Invest in Nosara*, *Relocate to Nosara*, *Real Estate Agent Social Templates*, *Nosara Coastal Lightroom Preset Pack*:

1. Open the product in admin.
2. Confirm **Inventory → Track quantity** is **off** and **This is a physical product** is **off** (the seed already sets `requiresShipping: false`).
3. Scroll to the **Digital Downloads** card (added by the app).
4. Click **Upload file** and attach the deliverable (.pdf, .zip with Canva link, .zip of presets).
5. The customer receives a download link on the order confirmation + a separate email from the app.

### Tax / shipping

Digital products are non-shippable. Seed sets `taxable: false`; revise per your jurisdiction (Costa Rica IVA may apply to digital goods sold to CR customers).

---

## Services (Collection 2) — Calendly, no cart

The **Services** collection uses a custom template (`templates/product.service.json` → `sections/main-product-service.liquid`) that:

- Shows the product image, title, price, and description.
- Replaces the add-to-cart form with a single **Book a call** button.
- The button reads the Calendly URL from a per-product metafield (`custom.calendly_url`), falling back to the brand-wide default in theme settings.
- If Calendly's widget script loads, the button opens a popup; otherwise it opens the URL in a new tab.

### Set up the Calendly metafield definition

In Shopify admin → **Settings → Custom data → Products → Add definition**:

| Field      | Value                          |
|------------|--------------------------------|
| Name       | Calendly URL                   |
| Namespace  | `custom`                       |
| Key        | `calendly_url`                 |
| Type       | Single line text               |
| Validation | URL (optional)                 |

Repeat for `custom.cta_label` (Single line text) if you want per-product button labels.

`apply-seed.mjs` populates these per service product.

### Apply the service template to each service product

The seed sets `templateSuffix: "service"` on the three service products, which makes Shopify use `templates/product.service.json` automatically.

If you create a service product manually, set **Theme template → product.service** in the admin product page sidebar.

### Default Calendly URL

Set in **Online Store → Themes → Customize → Theme settings → Brand → Default Calendly URL**, or pre-loaded in `theme/config/settings_data.json` (`brand_calendly_url`).

---

## Printful (Collection 3) — print-on-demand merch

The **Nosara Merch** collection ships as **DRAFT** placeholders. Printful takes over inventory, variants, and fulfillment once connected.

### Install Printful

1. Visit [apps.shopify.com/printful](https://apps.shopify.com/printful) → **Add app** → approve scopes.
2. In Printful's onboarding, link your Shopify store.

### Connect each merch product

Option A — let Printful create the products (cleanest):
1. In Printful → **Stores → Add Product**.
2. Choose the base (tee, dad cap, kiss-cut sticker), upload your artwork, and select sizes/colors.
3. When Printful publishes to Shopify, it creates a *new* product. Delete the matching seed placeholder, or have Printful overwrite by matching SKU.

Option B — connect existing Shopify products:
1. In Printful → **Stores → Sync**, find the placeholder product.
2. Choose **Add to Printful** and pair the Shopify variant with a Printful product/variant.
3. Once paired, Printful manages inventory; flip the product **Status → Active** in Shopify.

### Notes on the seed

- All merch products are created as `DRAFT` with `requiresShipping: true`.
- SKUs are prefixed `MERCH-` so Printful can match by SKU.
- The "Sand / Deep Teal" cap variants are placeholders — match them to actual Printful color codes during sync.

---

## Shopify Payments

Enable in **Settings → Payments → Shopify Payments → Activate**. You'll need:

- Business type and legal name
- Tax ID (Costa Rica: cédula jurídica) — Shopify Payments availability in CR may be limited; if so, fall back to a third-party gateway such as Stripe or 2Checkout.
- Bank account (USD or CRC depending on payout currency)

If Shopify Payments isn't available for Costa Rica, the next best options are:
- **PayPal** (works globally; high fees)
- **Stripe** (via Shopify's third-party gateway, where supported)
- **2Checkout / Verifone** (Costa Rica-friendly)

### Mark service products correctly

If a service product somehow ends up purchasable (a customer fills cart manually), they'd be charged. The Calendly template prevents this from the UI side. As a belt-and-suspenders measure:

- Set **Inventory → Track quantity = On**, quantity 0, and **Continue selling when out of stock = Off** on each service product. The seed leaves this off so adjust manually if you want hard enforcement.

---

## SEO / OG tags

`theme/snippets/seo-meta.liquid` writes Open Graph + Twitter Card tags into every page's `<head>` automatically. Per-product/per-collection SEO is also wired into the seed (`seo.title` and `seo.description`).

To audit:

```bash
curl -s https://shop.julianmonge.com/products/invest-in-nosara | grep -E 'og:|twitter:'
```

---

## Mobile-first

`assets/brand.css` and `assets/back-bar.css` use min-width media queries (`@media (min-width: 750px)`). Dawn's base is already responsive. Verify on a mid-range Android (Chrome) and iPhone Safari before publishing.

---

## Updating Dawn

Dawn ships fixes frequently. To pull the latest:

```bash
rm -rf .build/theme
./scripts/bootstrap-theme.sh julianmonge
shopify theme push --unpublished --store julianmonge.myshopify.com
```

The overlay re-applies on top of the new Dawn, so your brand changes survive.

---

## Local dev

```bash
cd .build/theme
shopify theme dev --store julianmonge.myshopify.com
# Opens http://127.0.0.1:9292 with hot reload
```

---

## What this repo does NOT do automatically

These steps require human action and cannot be scripted from a CI/sandbox:

- Run `shopify theme push` (requires interactive browser auth on first run).
- Install third-party apps (Digital Downloads, Printful) — App Store approval.
- Configure DNS at your registrar.
- Verify Shopify Payments (KYC / banking).
- Upload digital download files.
- Sync Printful artwork.

Each one is described above in its respective section.
