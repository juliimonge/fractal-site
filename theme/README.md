# shop.julianmonge.com — Shopify theme

A Dawn-based Shopify theme for **shop.julianmonge.com** — *All things Costa Rica*. The shop has two faces: an own-merch line (printed by Printful) and a curated Amazon Influencer storefront ("Nosara Essentials"). Designed as a chapter of [julianmonge.com](https://julianmonge.com).

This repo contains **brand overrides only** — not a full copy of Dawn. The bootstrap script clones a fresh Dawn and overlays these files. Dawn stays upgradeable; our diff stays small.

---

## What's in the theme

```
theme/
├── config/
│   ├── settings_data.json                # Brand tokens pre-loaded (colors, fonts, URLs)
│   └── settings_schema.brand-patch.json  # "Brand" settings group, merged into Dawn's schema
├── layout/
│   └── theme.liquid                      # Full replacement: Inter font, announcement, header, footer, floating WhatsApp
├── sections/
│   ├── announcement-bar.liquid           # Top promo strip (free shipping, returns, etc.)
│   ├── announcement-group.json
│   ├── header.liquid                     # Sticky lockup + search + bag + nav
│   ├── header-group.json
│   ├── hero-store.liquid                 # Ink hero with built SVG composition
│   ├── trust-strip.liquid                # 4 trust signals (vetted, ships fast, returns, reef-safe)
│   ├── category-tiles.liquid             # 4 tinted-color tiles, each shows a product SVG
│   ├── featured-collection.liquid        # Product grid; supports normal mode + Amazon affiliate mode
│   ├── editorial-about.liquid            # Editorial split with built SVG composition
│   ├── amazon-callout.liquid             # Ink banner with "Open Amazon storefront" CTA
│   ├── newsletter-strip.liquid           # Email capture
│   ├── footer-main.liquid                # 4-column footer with affiliate disclosure
│   ├── footer-group.json
│   ├── main-product-amazon.liquid        # Amazon affiliate product detail page (no cart)
│   └── main-product-service.liquid       # Calendly-only service product page (kept from earlier scaffold)
├── templates/
│   ├── index.json                        # Homepage: hero → trust → cats → merch → about → amzbanner → essentials
│   ├── product.amazon.json               # Template for Amazon affiliate products
│   ├── product.service.json              # Template for Calendly service products
│   ├── page.about.json
│   └── page.contact.json
├── snippets/
│   └── seo-meta.liquid                   # OG + Twitter tags on every page
├── assets/
│   ├── brand.css                         # Tokens + base + buttons + product grid
│   ├── tee-sand.svg, tee-teal.svg        # 8 merch product mockups
│   ├── cap-teal.svg, cap-sand.svg
│   ├── crewneck.svg, tote.svg
│   ├── stickers.svg, mug.svg
│   └── amz-*.svg                         # 8 Amazon picks product mockups
└── locales/
    └── en.default.schema.json
```

---

## Brand tokens (preloaded)

| Token | Hex | Role |
|---|---|---|
| Ink | `#0E1A20` | Primary text, primary buttons, footer |
| Teal | `#1F5A6F` | Links, accents, hover states |
| Light Teal | `#9FC8D0` | On-dark accents, eyebrows |
| Sand | `#E8DFC8` | Warm surfaces, category tile background |
| Paper | `#F6F2E8` | Cream sections |
| Page bg | `#FAF8F3` | Default page background |

**Font:** Inter (300/400/500/600/700/800/900) — loaded from Google Fonts.
**Button radius:** 2px (utility, near-square).
**Layout width:** 1480px max.

These are wired into `theme/assets/brand.css` (CSS custom properties) and `theme/config/settings_data.json` (merchant-editable settings).

---

## Setup — step by step

### 1. Install the Shopify CLI

```bash
npm install -g @shopify/cli @shopify/theme
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

### 3. Push to the store

```bash
cd .build/theme
shopify theme dev --store julianmonge.myshopify.com         # browser auth + local preview
shopify theme push --unpublished --store julianmonge.myshopify.com  # unpublished draft
shopify theme push --live --store julianmonge.myshopify.com         # when ready
```

### 4. Seed collections + products

Generate an Admin API access token (Shopify admin → **Settings → Apps and sales channels → Develop apps → Create app**) with `write_products`, `write_publications`, `write_metafields`. Then:

```bash
export SHOPIFY_STORE=julianmonge.myshopify.com
export SHOPIFY_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxx
node scripts/apply-seed.mjs
```

Creates the **6 collections** (Nosara Merch, Apparel, Caps, Bags, Home, Nosara Essentials) and **16 products** (8 own merch + 8 Amazon affiliate picks). Idempotent on `handle`.

After seeding, **set the metafield definitions** in admin so the Amazon products render correctly:

- **Settings → Custom data → Products → Add definition** for each:
  - `custom.amazon_url` — URL
  - `custom.short_specs` — Single line text
  - `custom.curator_note` — Multi-line text
  - `custom.amazon_cta` — Single line text (optional, defaults to "View on Amazon")

The seed populates these per Amazon product.

---

## Amazon Essentials — how it works

Amazon products are Shopify products with `templateSuffix: amazon`. Their product page (`templates/product.amazon.json` → `sections/main-product-amazon.liquid`):
- Shows the product photo, title, specs, curator note
- Replaces Add-to-Cart with a single **View on Amazon →** button
- Reads the affiliate URL from `custom.amazon_url`, falls back to your storefront URL in theme settings

On the homepage and collection pages, the `featured-collection` section has an **Amazon mode** checkbox that:
- Hides prices
- Renders an "amazon" badge
- Each card opens its `custom.amazon_url` in a new tab with `rel="nofollow noopener sponsored"`

---

## Custom subdomain — `shop.julianmonge.com`

1. **Shopify admin:** *Settings → Domains → Connect existing domain → `shop.julianmonge.com`*
2. **At your registrar:** Add CNAME `shop → shops.myshopify.com` (TTL 3600)
3. **Verify** in Shopify admin. Propagation 5–60 minutes.

---

## Printful (merch)

1. Install: [apps.shopify.com/printful](https://apps.shopify.com/printful)
2. For each merch product, either:
   - Create the product in Printful first → it syncs to Shopify (recommended)
   - Or pair an existing Shopify product to a Printful product by SKU
3. SKU prefixes match the seed (`TEE-SAND-S`, `CAP-TEAL-OS`, `TOTE-NAT-OS`, etc.) so Printful can sync by SKU.

After Printful is connected, replace the placeholder SVG product mockups (`theme/assets/tee-sand.svg` etc.) with Printful's auto-generated mockups or your own product photography.

---

## Amazon Influencer Program

Required to use the Amazon Storefront pattern with affiliate links:
1. Apply at [affiliate-program.amazon.com/influencers](https://affiliate-program.amazon.com/influencers) — needs an active social account with engagement
2. Once approved, you get `amazon.com/shop/<yourhandle>`
3. Update **theme settings → Brand → Amazon Storefront URL** to this URL
4. For each Amazon product in admin, set `custom.amazon_url` to your tagged affiliate URL (or leave as the generic search URL the seed populated)

**Important on pricing:** Amazon's ToS prohibits caching prices on third-party sites. The Amazon-mode `featured-collection` section already hides prices — keep it that way.

---

## Shopify Payments

**Settings → Payments → Activate Shopify Payments.** Costa Rica availability may be limited; fall back to Stripe, PayPal, or 2Checkout/Verifone where Shopify Payments isn't supported.

---

## Section-by-section reference

| Section | Where it lives | What it does |
|---|---|---|
| Announcement bar | `announcement-bar.liquid` | Top promo strip, up to 4 messages |
| Header | `header.liquid` | Sticky lockup + search + bag + nav |
| Store hero | `hero-store.liquid` | Built SVG hero composition (no photo) |
| Trust strip | `trust-strip.liquid` | 4 icon + title + subtitle items |
| Category tiles | `category-tiles.liquid` | 4 tinted color blocks, each shows a product SVG |
| Featured collection | `featured-collection.liquid` | Product grid; toggle Amazon mode for affiliate links |
| Editorial about | `editorial-about.liquid` | Split layout with built SVG art + copy |
| Amazon callout | `amazon-callout.liquid` | Ink banner with Amazon storefront CTA |
| Newsletter strip | `newsletter-strip.liquid` | Email capture via Shopify customer form |
| Footer | `footer-main.liquid` | 4-column with affiliate disclosure |
| Amazon product page | `main-product-amazon.liquid` | No cart, View on Amazon CTA |
| Service product page | `main-product-service.liquid` | No cart, Book a Call (Calendly) CTA — kept from earlier scaffold |

All sections are merchant-editable via the Shopify theme customizer.

---

## What this repo does NOT do automatically

- `shopify theme push` (needs your browser auth on first run)
- Install Printful, Amazon Influencer enrollment, DNS configuration
- Replace placeholder SVG product mockups with real photography
- Configure Shopify Payments (KYC/banking)

Each is documented above in its section.

---

## Updating Dawn

Dawn ships fixes frequently. To pull the latest:

```bash
rm -rf .build/theme
./scripts/bootstrap-theme.sh julianmonge
shopify theme push --unpublished --store julianmonge.myshopify.com
```

The overlay re-applies on top of the new Dawn.
