# PROJECT — shop.julianmonge.com

> **Read this first.** This file is the single source of truth for the shop project.
> It exists so any person, tool, or AI model opening this repo understands the
> project instantly — without needing the conversation history that produced it.

**Last updated:** July 2026 · **Branch with all shop work:** `claude/shopify-store-research-IAEWI`
(`main` still holds only the original Fractal marketing site — the shop work has NOT been merged to main yet.)

---

## What this is

An e-commerce store for **Julián Monge** — real estate agent in Nosara, Costa Rica
(Nicoya peninsula, one of the world's five Blue Zones). The store is a chapter of the
parent brand at [julianmonge.com](https://julianmonge.com) and will live at
**shop.julianmonge.com**.

**Positioning:** *"All things Costa Rica."* Two commerce faces under one roof:

1. **Own merch line** — heavyweight cotton tees, embroidered dad caps, canvas tote,
   enamel mug, sticker pack. Printed on demand by Printful (no inventory, no warehouse).
2. **Nosara Essentials** — a curated Amazon storefront of real Tico goods that ship
   internationally: Café Britt Tarrazú coffee, Salsa Lizano, *The Blue Zones Solution*,
   Sun Bum reef-safe SPF, *Birds of Costa Rica* (Garrigues & Dean), hand-woven hammocks,
   Sex Wax Tropical, Lonely Planet Costa Rica.
3. **(Future)** Sponsored product placements once sponsors come on board.

**Amazon Associate tag (live, wired into every link):** `julianmonge02-20`

---

## Current status — July 2026

| Piece | Status |
|---|---|
| Shopify theme (Dawn overlay, 11 custom sections) | ✅ Built, validated with `shopify theme check` |
| Public design preview (Vercel) | ✅ Live — see Links below |
| Brand design system + 10-SKU production spec | ✅ `brand/blue-zone-system.md` |
| Lightroom preset pack (real product deliverable) | ✅ `lightroom-presets/` — 10 importable `.xmp` files |
| Product data (6 collections, 16 products) | ✅ Declarative seed at `shopify-seed/store.json` |
| Amazon affiliate tag wiring | ✅ `julianmonge02-20` on every Amazon URL |
| Fable 5 audit/photography brief | ✅ `brand/fable5-audit-prompt.md` — ready to paste into Fable 5 |
| Shopify store itself | ⏳ Not yet created — next action (see below) |
| Theme pushed to a live store | ⏳ Blocked on store creation + Theme Access token |
| Real product photography | ⏳ Fable 5 generates stand-ins; real shoot post-launch |
| Printful account + merch samples | ⏳ September |
| LLC / Chase business account for payouts | ⏳ September |
| **Launch** | 🎯 **October 2026** |

### Immediate next action

Julián signs up at [partners.shopify.com](https://partners.shopify.com) (free) →
creates a **development store** (`julianmonge-dev`) → installs the free
**Theme Access** app → generates a password (`shptka_...`) → shares it with the
Claude session. Then the theme gets pushed and products seeded in one pass.

---

## Repo map

```
PROJECT.md                  ← you are here
index.html, nosara-explorer.html, css/, js/, frames/
                            ← the ORIGINAL Fractal marketing site (main branch content)

theme/                      ← the Shopify theme (Dawn overlay — deploy this)
├── README.md               ← full setup guide: CLI, push, seed, Printful, Amazon, DNS
├── sections/               ← 11 custom sections (hero, trust strip, category tiles,
│                              featured-collection w/ Amazon mode, cart, footer, etc.)
├── snippets/
│   ├── amazon-affiliate-url.liquid   ← appends julianmonge02-20 to any Amazon URL
│   └── seo-meta.liquid               ← OG/Twitter tags
├── assets/                 ← brand.css (design tokens) + 16 SVG product mockups
├── config/                 ← settings schema + preloaded brand values
└── templates/              ← index, product.amazon (affiliate PDP), product.service

mockup/                     ← static HTML preview of the store design
├── index.html              ← current design (commerce-led, deployed on Vercel)
├── editorial.html          ← earlier editorial design (kept for reference)
└── products/               ← the 16 product SVGs (source of theme/assets copies)

brand/
├── blue-zone-system.md     ← design system + brand voice + 10-SKU production spec
│                              (name candidate: TUANIS; palette, type, artwork briefs,
│                              Printful workflow, launch checklist)
└── fable5-audit-prompt.md  ← paste into Fable 5 for audit + photography generation

lightroom-presets/
├── Nosara Coastal/         ← 10 real .xmp presets + INSTALL.txt (the $15 product)
└── Nosara-Coastal-Presets.zip  ← customer deliverable for Digital Downloads

shopify-seed/store.json     ← 6 collections + 16 products, declarative
scripts/
├── bootstrap-theme.sh      ← pulls Dawn from the store, overlays theme/, merges schema
├── apply-seed.mjs          ← creates collections/products via Admin GraphQL (idempotent)
├── merge-settings-schema.mjs
└── build-presets.mjs       ← regenerates the Lightroom presets from JS definitions
```

---

## Brand quick reference

**Palette:** ink `#0E1A20` · teal `#1F5A6F` · light-teal `#9FC8D0` · sand `#E8DFC8` · paper `#F6F2E8` · bg `#FAF8F3`
**Type:** Inter only (300–900). No Playfair, no serifs on the storefront.
**Voice:** No exclamation marks. No emoji. Specifics over adjectives ("12oz heavyweight cotton" not "premium quality"). Spanish only where it earns its place (PURA VIDA, NICOYA, TUANIS). Quiet confidence.
**Anti-references:** tourist-shop pastels, cartoon parrots, "paradise"/"amazing" copy, gold foil.
**Reference stores:** Aimé Leon Dore, Mollusk, Buck Mason (heritage) · Allbirds, Bombas (mechanics) · MR PORTER (polish) · Kotn, Public Goods (curation).

Full detail: `brand/blue-zone-system.md`.

---

## Links

| What | URL |
|---|---|
| Public design preview | `https://fractal-site-git-claude-shopif-a3437e-julimongea-4326s-projects.vercel.app/mockup/` |
| Repo | `https://github.com/juliimonge/fractal-site` |
| Work branch | `claude/shopify-store-research-IAEWI` |
| Parent brand site | `https://julianmonge.com` |
| Amazon storefront (once live) | `https://amazon.com/shop/julianmonge` — tag `julianmonge02-20` |
| Shopify Partner signup | `https://partners.shopify.com` |
| Theme Access app | `https://apps.shopify.com/theme-access` |

The Vercel preview auto-redeploys on every push to the work branch.

---

## Timeline to launch

| When | What | Who |
|---|---|---|
| **Now (July)** | Create Shopify Partner dev store, share Theme Access token, push theme, seed products | Julián + Claude |
| **August** | Run Fable 5 prompt → real photography stand-ins; finish theme sections (cart drawer, quick view, predictive search, size guide); copy pass | Julián runs prompt, Claude wires results |
| **September** | Printful account + merch artwork upload + order 1 physical sample per product; LLC or Chase business account for payouts | Julián |
| **Early October** | Samples approved; final photography swapped in | Julián + Claude |
| **October — LAUNCH** | Transfer dev store → paid plan (Basic $39/mo); Shopify Payments w/ LLC bank (fallback: Stripe/2Checkout for CR); `shop.julianmonge.com` DNS; remove password gate | Julián |

---

## Decisions log (why things are the way they are)

- **Dawn overlay, not full theme fork** — Dawn stays upgradeable; our diff stays small. `scripts/bootstrap-theme.sh` assembles the deployable theme.
- **Bootstrap pulls Dawn from the store, not GitHub** — the Claude Code agent proxy blocks `github.com/Shopify/dawn` fetches; every Shopify store ships with Dawn pre-installed, so we pull from there via Theme Access token.
- **Commerce-led design, not editorial** — first two design iterations (luxury editorial "Nosara, considered.") were rejected as toy-like. Current design: clean product grids, white product shots, real commerce affordances. Reference: Stüssy/Buck Mason, not lifestyle blogs.
- **SVG product mockups as placeholders** — every product image is a hand-built SVG (renders identically everywhere, zero external deps). Swap for real photos 1:1 without layout changes — same filenames in `theme/assets/`.
- **Amazon links via render-time snippet** — tag is stored once in theme settings (`brand_amazon_associate_tag`); a Liquid snippet appends it to any un-tagged Amazon URL at render. Change the tag in admin → every link updates. No hardcoded tags in seed data.
- **Amazon URLs are search links** (`amazon.com/s?k=...`), not ASIN links — they resolve even when specific listings change. Swap to tagged ASIN links per-product later for tighter attribution.
- **Amazon products have price 0 and no cart** — Amazon ToS prohibits caching prices; the `product.amazon` template shows "View on Amazon" instead of add-to-cart.
- **Partner dev store for the build phase** — free forever, full admin, no 90-day trial clock. Transfers to a paid plan at launch.
- **Broader brand name (TUANIS) proposed but not adopted yet** — merch currently says NOSARA / COSTA RICA. The design system doc specs the TUANIS rename if Julián wants it; nothing blocks on the decision.

---

## For future Claude sessions

If you're a Claude (or other AI) session picking this up cold:

1. Read this file, then `theme/README.md`, then `brand/blue-zone-system.md`.
2. Check `git log --oneline` on the work branch — commit messages narrate every decision.
3. The user is Julián (julimongea@gmail.com, GitHub: juliimonge). His pronouns: not stated — use they/them or the name.
4. Pending user-side blockers at last update: Shopify Partner signup, Theme Access token, Printful, LLC/bank. Ask before assuming any completed.
5. Never push to `main` without explicit permission — all work goes to `claude/shopify-store-research-IAEWI` (or its successor branch).
