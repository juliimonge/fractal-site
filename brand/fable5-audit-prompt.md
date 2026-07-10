# Prompt for Fable 5 — Modernize & complete shop.julianmonge.com

> Paste this entire document into a new Fable 5 chat.

---

## 1 · Your role

You are acting as senior brand & e-commerce lead for **shop.julianmonge.com** — a small Shopify store selling Nosara / Costa Rica merch and a curated Amazon storefront of real Tico goods. My job is to hand you everything you need to run a full audit and modernization pass in one shot: generate the photography we're missing, close the gaps to modern Shopify DTC quality, and return a structured report + drop-in code.

Your goal: **bring this store to parity with today's best Shopify DTC brands** — Aimé Leon Dore, Mollusk, Buck Mason, Allbirds, MR PORTER — in visual polish, commerce mechanics, and copy.

Everything you deliver should feel like it was made by someone who actually lives in Nosara and knows the brand.

---

## 2 · Project background

### The brand
- **Owner:** Julián Monge — real estate agent in Nosara, Costa Rica. Raised on the Nicoya peninsula, works from Playa Guiones.
- **The shop:** two commerce faces under one roof
  1. **Own merch** — heavyweight cotton tees, embroidered caps, canvas totes, enamel mug, sticker pack (printed on demand by Printful)
  2. **Curated Amazon storefront ("Nosara Essentials")** — real Costa Rica goods sold on Amazon that we've vetted: Café Britt Tarrazú coffee, Salsa Lizano, *The Blue Zones Solution* by Buettner, Sun Bum reef-safe SPF 50, *Birds of Costa Rica* by Garrigues & Dean, hand-woven Caribbean hammocks, Sex Wax Quick Humps Tropical, Lonely Planet Costa Rica.
- **Positioning:** *"All things Costa Rica."* Not a tourist shop — a genuine gateway curated by someone local. Nicoya is one of the world's five Blue Zones; the brand quietly leans on that longevity/place-rooted identity.
- **Parent relationship:** `julianmonge.com` is the real-estate practice. `shop.julianmonge.com` is a chapter of that parent brand — the shop's header should feel like an extension, not a separate identity.

### The customer
- Visitors who fell for Nosara and want a piece of it home
- Expats and second-home owners on the Nicoya coast
- Julián's real-estate clients (as a small gift extension)
- Blue Zones / longevity-culture readers
- Surf/yoga travelers who've been to Guiones

---

## 3 · Current state — what's already built

- **Deployed mockup**: [fractal-site-git-claude-shopif-a3437e-julimongea-4326s-projects.vercel.app/mockup/](https://fractal-site-git-claude-shopif-a3437e-julimongea-4326s-projects.vercel.app/mockup/) — this is the visual target you're auditing and upgrading.
- **Repo**: `github.com/juliimonge/fractal-site`, branch `claude/shopify-store-research-IAEWI`.
- **Design system doc**: `brand/blue-zone-system.md` in the repo — a ~700-line spec covering brand voice, palette, type, 10-SKU production plan, and artwork briefs. Read this and treat it as the source of truth. If your recommendations depart from it, call out why.
- **Custom Shopify theme (Dawn-based overlay)** lives at `theme/`. Already built:
  - 11 custom sections: `announcement-bar`, `header`, `hero-store`, `trust-strip`, `category-tiles`, `featured-collection` (with Amazon mode), `editorial-about`, `amazon-callout`, `newsletter-strip`, `footer-main`, `main-product-amazon`
  - Full brand-token CSS at `theme/assets/brand.css`
  - Seed data at `shopify-seed/store.json` — 6 collections, 16 products with metafields (curator notes, Amazon URLs, short specs)
- **Lightroom presets**: `lightroom-presets/Nosara Coastal/` — 10 real `.xmp` presets we already ship as a $15 product. Use these color grades as reference for any photography you generate.

### What's still placeholder
- Every product image is a hand-crafted SVG. Clean, but not real product photography.
- Hero + editorial-about are built SVG compositions — brand-aligned but not the real Nosara.
- Some copy is scaffold — hero, section headers, curator notes — needs a real voice pass.
- No cart drawer, no quick-view, no predictive search, no size guide, no reviews slot. All patterns modern DTC stores ship.
- SEO is minimal — no JSON-LD Product schema, no OG image generation, generic titles.

---

## 4 · Brand identity — non-negotiables

### Palette
- Ink `#0E1A20` — primary text, dark surfaces
- Teal `#1F5A6F` — links, accents
- Light teal `#9FC8D0` — on-dark accents
- Sand `#E8DFC8` — warm surfaces, tile backgrounds
- Paper `#F6F2E8` — cream sections
- Page bg `#FAF8F3`
- Terracotta `#C2725A`, Jungle `#4C6A48` — used sparingly for accent tiles

### Type
- **Inter only** across the whole site (weights 300, 400, 500, 600, 700, 800). We dropped Playfair Display in the last iteration — do NOT reintroduce it.
- Wordmark tracking: +0.06em to +0.14em
- Never italic outside a genuine pull-quote

### Voice rules (from `brand/blue-zone-system.md`)
- **No exclamation marks. Ever.**
- **No emoji anywhere** — including in product descriptions, transactional emails, or admin metafields
- **Specifics over adjectives.** "12oz heavyweight cotton, garment-dyed in Sand" beats "Premium quality tee you'll love"
- **Spanish where it earns its place** — `PURA VIDA`, `NICOYA`, `TUANIS` are right; scattered Spanish for flavor is wrong
- **First-person sparingly** — never "we're excited to announce"

### Anti-references (things this brand is NOT)
- Tourist-shop bright pastels stacked together
- Cartoon parrots, cartoon toucans, cartoon anything
- "Paradise" copy, "amazing" copy, exclamation-mark copy
- Luxury-for-luxury's-sake — no gold foil, no marble textures
- Trendy typography that will look dated in 12 months

---

## 5 · Reference stores — benchmark against these

Modern Shopify DTC that this store should stand next to without apologizing:

**Heritage / surf lifestyle** (closest tonal match)
- Aimé Leon Dore — chest lockups, editorial product pages, restrained palette
- Mollusk Surf Shop — surf brand tone, real photography, place-rooted
- Buck Mason — clean product cards, workwear-adjacent, no filler
- Saturdays NYC — beach lifestyle, real people in real spots
- Outerknown — sustainability + surf, calm confidence

**Commerce mechanics**
- Allbirds — cart drawer, size logic, product page
- Bombas — variant swatches, review integration
- Rothy's — filters, sort, mobile drawer
- Everlane — transparency copy, price display

**Editorial luxury** (aspiration for polish)
- MR PORTER — grid density, filter chip UX
- SSENSE — image treatment, hover states

**Story-led curation** (for the Amazon storefront section)
- Kotn — story-per-product, curator voice
- Public Goods — utility copy, dense info
- Snowe — collection storytelling

**When you make a recommendation, name the specific store + specific pattern you're borrowing from.** No generic "modern e-commerce best practices."

---

## 6 · Audit — 11 dimensions

For each dimension, output: **severity** (blocker / high / low), **file path**, **current state → desired state**, **specific fix** (code diff or design change).

1. **Design system consistency** — do color/type/spacing tokens hold across all 11 sections? Any drift?
2. **Information architecture** — is `hero → trust → category tiles → merch → about → Amazon callout → essentials → newsletter` the right story? Where should first-time vs returning visitors land?
3. **Product cards** — modern DTC pattern check: variant swatches visible on card, hover-second-image, quick-add to bag, correct badge hierarchy (best-seller > new > low-stock), price treatment
4. **Product detail page** — image gallery pattern, thumbnails, zoom, sticky add-to-cart, size chart drawer, related products, reviews slot, delivery estimator, size selector states (available / sold-out / low-stock)
5. **Cart** — currently full page. Replace with a slide-in drawer: line-item editing, free-shipping progress bar (`$X to free shipping`), upsell rail ("goes well with"), express-checkout buttons
6. **Search** — predictive search with product thumbnails, collection suggestions, empty-state suggestions ("try surfing, hammock, coffee")
7. **Copy voice audit** — hero, all section headers, all product titles, all product descriptions, empty-state copy, error messages, transactional email templates. Flag anything that violates the voice rules in section 4
8. **SEO / Open Graph** — title patterns per template, meta descriptions from real content, JSON-LD Product schema in Liquid, dynamically-rendered OG images per product/collection, canonical URLs, sitemap
9. **Accessibility** — enumerate every issue with WCAG level. Focus states, contrast (especially light-teal on cream), semantic landmarks, form labels, keyboard nav through header/nav/cart, ALT text pattern for product images, focus trap in modals/drawers
10. **Performance** — LCP element identification, image lazy-loading strategy, above-the-fold JS budget (target: <50 KB), CLS from web-font swap, image `srcset` coverage
11. **Mobile-first** — audit at 375px, 428px, 768px. What breaks? What's cramped? Is the mobile filter drawer usable? Is the cart-drawer touch-friendly? Does the search collapse gracefully?

---

## 7 · Upgrade tasks — deliverables I need from you

### 7.1 Photography (you generate these)

Real product photography to replace the SVG placeholders. Style: clean neutral background (cream `#F6F2E8` or sand `#E8DFC8`), soft directional light, subtle drop shadow, 4:5 crop for grid, additional 1:1 for social. Match the color grading of the Nosara Coastal Lightroom preset "05 Interior Warm" — warm, low-contrast, honest.

**Merch (8 pieces):**
- Nosara CR Heavyweight Tee — Sand — flat lay with folded arms
- Nosara CR Heavyweight Tee — Deep Teal — flat lay
- Nosara CR Cap — Deep Teal — three-quarter view, embroidery visible
- Nosara CR Cap — Sand — three-quarter view
- Pacific Coast Crewneck — Ecru — flat lay
- Heavy Canvas Beach Tote — Natural — hanging, showing stamped mark
- Nosara Sticker Pack — 3 stickers arranged on cream ground
- Nosara Enamel Mug — Cream — with steam rising, coffee ring visible

**Amazon picks (8 pieces — style like editorial product listings):**
- Café Britt Tarrazú whole bean bag
- Salsa Lizano bottle (iconic yellow-and-red label)
- *The Blue Zones Solution* book cover — Buettner, blue cover, gold accents
- Sun Bum Mineral SPF 50 tube — yellow with banana logo
- *Birds of Costa Rica* — Garrigues & Dean, second edition, green cover with bird illustration
- Hand-woven hammock — stuff sack + cordage, natural fiber
- Sex Wax Quick Humps Tropical — round disc, red label
- Lonely Planet Costa Rica — yellow spine guide

**Campaign / hero (4 pieces):**
- Nosara aerial at golden hour — 16:9 at 2400×1350 — Playa Guiones-style crescent bay
- Model wearing the NOSARA CR tee at dawn on Guiones sand
- Nosara CR cap detail shot — worn, sun-lit
- Editorial "about Julián" scene — real porch, cream mug, book, warm dawn light. No face required; a scene that suggests the person

**Category tile lifestyle (4 pieces):**
- Apparel: neatly folded tees stacked
- Caps: cap on a wooden surface, one shadow
- Bags: tote hanging over a beach chair
- Home: mug on a porch railing at golden hour

Return each image with a manifest CSV: `filename, subject, dimensions, prompt used, hex palette (top 3)`.

### 7.2 New Shopify sections (Liquid + CSS)

Follow the exact `{% schema %}` conventions used by our existing sections at `theme/sections/hero-store.liquid` and `theme/sections/featured-collection.liquid` — block-driven, preset defaults, no external asset dependencies.

- `cart-drawer.liquid` — slide-in cart with line-item editing, free-shipping progress bar, upsell rail
- `product-quick-view.liquid` — modal overlay triggered from product grid, single-variant add
- `predictive-search-results.liquid` — dropdown with product thumbnails + collection suggestions
- `size-guide.liquid` — drawer overlay with the SS26 tee sizing table
- `reviews-block.liquid` — placeholder markup that works with Judge.me / Loox / Okendo
- `main-product.liquid` — full product page: gallery, sticky add-to-cart, related products, reviews slot

### 7.3 Copy pass

Return a Markdown table of **before / after** for every copy surface:

- Homepage hero (headline, lede, CTAs)
- All section headers/eyebrows/descriptions
- All 16 product titles
- All 16 product descriptions
- Cart empty state
- Search empty state
- Sold-out state
- 404 page
- Transactional emails: order confirmation, shipping confirmation, delivery, refund

Every "after" must obey the voice rules in section 4.

### 7.4 SEO deliverable

- Page title pattern per template — homepage / collection / product / page / blog article / 404
- Meta description generator for each template (from real content, not boilerplate)
- JSON-LD Product schema as a Liquid snippet (drop-in for `snippets/product-schema.liquid`)
- OG image template: HTML + CSS that renders per-product OG images at 1200×630 using product title + featured image + brand mark
- Sitemap notes

### 7.5 Accessibility fixes

Enumerate every issue found with:
- WCAG level (A / AA / AAA)
- File path
- Current code excerpt
- Fixed code
- One-sentence rationale

---

## 8 · Return format

Structure your response exactly as follows so I can act on it in order:

1. **Executive summary** — 5 bullets. What's already good, what's blocking, what's the fastest win
2. **Reference map** — table: recommendation → source store → specific pattern
3. **Audit report** — 11 sections, one per audit dimension, in the severity order specified
4. **Photography** — the generated images + manifest CSV
5. **New sections** — full Liquid + CSS for each of the 6 files in section 7.2
6. **Copy pass** — the before/after table
7. **SEO deliverable** — all 5 items from section 7.4
8. **Accessibility fixes** — full enumeration
9. **What's still outstanding** — anything you can't do in a single turn, ordered by priority

---

## 9 · One rule about your voice

Don't be excited about the brand. Don't say "amazing," "beautiful," "stunning." Don't use exclamation marks. Write as if you also live in Nosara and just want the work to be quietly correct. The brand is calm; your response should be too.
