# Amazon Storefront Setup — julianmonge02-20

> Phase 1 of the launch: the Amazon Influencer storefront goes live FIRST and starts
> earning referral commission immediately. The Shopify ecom follows in October.
> This guide covers everything to complete on the Amazon side, in order.

**Associate tag:** `julianmonge02-20` (approved, wired into every site link)
**Storefront URL (once set up):** `amazon.com/shop/<your-handle>` — see §2 for claiming the handle

---

## 0 · Amazon storefront OR the Shopify store? — Both. Here's why.

They are not competing options. They sell **different inventory** and neither can do the other's job.

| | Amazon storefront | shop.julianmonge.com |
|---|---|---|
| **Sells** | Things you don't own — Café Britt, Lizano, DJI, Sony, dehumidifiers | Things you do own — merch, presets, PDF guides, services |
| **You earn** | A commission per sale (single digits %) | The full margin (60–100%) |
| **Costs you** | $0 | $39/mo + Printful cost per item |
| **Inventory risk** | None | None (print-on-demand) |
| **Live when** | Days | October |
| **Brand control** | Almost none — it's an Amazon page | Total |
| **You keep the customer** | No. Amazon does. | Yes — email, repeat, upsell |

**Why you can't drop the Amazon side:** you cannot legally sell Café Britt or a DJI drone on your Shopify store — you don't own that inventory and don't want to. Affiliate commission is the only mechanism that monetizes "here's the coffee I actually drink." That's ~90% of your list content.

**Why you can't drop the Shopify side:** a bare Amazon storefront has no brand, no email list, no way to sell your own tee or your Lightroom presets, and Amazon owns the customer relationship. It's a payout mechanism, not a business.

**How they work together — this is the actual strategy:**

```
julianmonge.com (real estate authority)
        ↓
shop.julianmonge.com  ← the brand, the story, the email list
        ├── Amazon links  → commission on other people's products
        └── Own products  → full margin on yours (October)
```

The site is the front door that makes the Amazon links credible. Nobody trusts a raw Amazon storefront; they trust a real estate agent in Nosara with a point of view who happens to link to Amazon. **The site is the asset. Amazon is a revenue stream running through it.**

Practical sequence, unchanged: Amazon live in days (earning while you build), Shopify live in October.

---

## 1 · Create the storefront — step by step

### 1a · Check what you already have

`julianmonge02-20` is an **Associates tracking-ID** format (`name-20`). That earns commission on tagged links but does **not** by itself give you a storefront page. Confirm which you have:

- Go to [affiliate-program.amazon.com](https://affiliate-program.amazon.com) and sign in
- Look at the top navigation. If you see a **"Your Storefront"** tab (or an "Influencer" section) → you already have the Influencer program, skip to §2
- If you only see Associates tools (Product Linking, Reports, SiteStripe) → apply for Influencer below

Also just try loading `amazon.com/shop/julianmonge` in a browser. If a page loads that's yours, you have it.

### 1b · Apply for the Influencer Program (if needed)

1. Go to **[amazon.com/influencers](https://www.amazon.com/influencers)** (or the Influencer link inside the Associates dashboard)
2. Sign in with the **same Amazon account** that owns your Associates tag — this keeps everything under one payout and one tax profile
3. Choose the social account you're applying with. Amazon accepts **Instagram, TikTok, YouTube, or Facebook**
4. Authorize the account so Amazon can read follower count and engagement
5. Submit

**On approval odds:** Amazon weighs *engagement* more than raw follower count — a real estate account with a few thousand engaged local followers gets approved regularly, where a 50k-follower account with dead engagement can get declined. Decisions are typically instant to a few days.

**If declined:** you can reapply, and you can apply with a different social account. Post consistently for a few weeks and try again — the Associates tag keeps earning on your site links in the meantime, so nothing is blocked.

### 1c · Claim your storefront URL

Once approved, Amazon assigns a default storefront URL and lets you set a **vanity handle**:

- Go to **Your Storefront → Edit storefront → storefront name/URL**
- Request `julianmonge` → your page becomes `amazon.com/shop/julianmonge`
- If taken, fall back to `nosaraessentials` or `julianmongecr`
- **Pick carefully — handles are hard or impossible to change later**, and this URL goes on the site, in your IG bio, and in the theme settings

### 1d · Tell me the final URL

Once the handle is set, send it to me and I'll update:
- `theme/config/settings_data.json` → `brand_amazon_storefront_url`
- The Amazon callout section CTA
- The mockup preview

Right now those all point at the placeholder `amazon.com/shop/julianmonge`.

### 1e · What the storefront gives you that plain links don't

- A public page you can put in an IG bio, on the site, in a Linktree
- **Idea Lists** — the collections in §3 below
- **Shoppable photos and videos** — Amazon shows your content next to the product on Amazon's own pages, which is a second earning surface most people ignore
- On-Amazon discovery (your videos can surface in Amazon's Inspire feed)

---

## 2 · Storefront identity settings

In the Influencer dashboard → **Your Storefront → Edit storefront**:

| Setting | Set it to | Why |
|---|---|---|
| **Storefront handle** | `julianmonge` (if free) or `nosaraessentials` | Short, matches the brand. This becomes `amazon.com/shop/julianmonge` |
| **Storefront name** | `Julián Monge — All Things Costa Rica` | Mirrors the site's positioning line |
| **Bio / tagline** (200 chars) | `Real estate agent in Nosara, Costa Rica. The Tico goods I actually use and ship home — coffee, Lizano, reef-safe sun, hammocks, field guides. Part of julianmonge.com.` | Same voice as the site. No exclamation marks. |
| **Profile photo** | `brand/amazon-assets/profile-avatar.svg` (export at 500×500 PNG) | JM roundel in ink/teal — matches site header |
| **Header/banner image** | `brand/amazon-assets/storefront-banner.svg` (export at 2000×500 PNG; Amazon crops responsively, keep text in center 60%) | Same ink background + horizon composition as the site hero |
| **Social links** | Instagram + julianmonge.com | Cross-traffic both ways |

Asset files are in this repo under `brand/amazon-assets/` — see §5 for export instructions.

---

## 3 · Idea Lists — mirror the site's categories exactly

Idea Lists are the Amazon storefront's version of collections. Create these four, named identically to the site's departments so a visitor moving between the two feels zero seam:

### List 1 — `Sun & Surf`
| Product | Search to find it | Note for the list |
|---|---|---|
| Sun Bum Mineral SPF 50 | `sun bum mineral spf 50` | The Nosara surf-shop standard. Reef-friendly zinc. |
| Sex Wax Quick Humps — Tropical | `sex wax quick humps tropical` | Warm-water formula for 25°C+ Pacific surf. |

### List 2 — `Kitchen & Pantry`
| Product | Search | Note |
|---|---|---|
| Café Britt Costa Rica Tarrazú | `cafe britt costa rica tarrazu whole bean` | The most-exported Tico coffee. High-altitude, clean cup. |
| Salsa Lizano 700ml | `salsa lizano` | Costa Rica's national sauce. On everything since 1920. |

### List 3 — `Books & Guides`
| Product | Search | Note |
|---|---|---|
| The Blue Zones Solution — Buettner | `blue zones solution dan buettner` | Nicoya is one of the five. Required reading before moving here. |
| The Birds of Costa Rica — Garrigues & Dean | `birds of costa rica garrigues dean` | The definitive field guide. Lives on the porch. |
| Lonely Planet Costa Rica | `lonely planet costa rica` | The visitor's classic. |

### List 4 — `Tropical Home & Real Estate`
Your strongest authority list — you sell these houses, you know what salt air and green season do to them. Framed as *"what I tell every buyer to order before their container arrives."*

16 products, full table in **`brand/amazon-list-architecture.md` §3**. Site heroes: hOmeLabs dehumidifier, Schlage Encode smart lock, APC UPS, Thermacell.

### List 5 — `Photo & Drone Gear`
Sony · DJI · iPhone — what you actually shoot with. Feeds the content-services funnel.

30 products across four sub-sections (Sony bodies & glass / DJI air & motion / iPhone / tropical survival kit), full table in **`brand/amazon-list-architecture.md` §4**. Site heroes: DJI Mini 4 Pro, Sony a6700, Sony 10-20mm f/4, Osmo Pocket 3.

**How to add:** Storefront → **Idea Lists → Create list** → search each product inside the Amazon UI → add → paste the one-line note. The notes in the architecture doc are already in brand voice — use them verbatim.

**Growing the lists:** aim for 8–12 items minimum per list. Same test for every addition: *would you actually pack it for/from Nosara, or put it in a client's house?* Further candidates: Kuhl/prAna sun shirts, YETI Panga dry duffel, Birkenstock EVAs, Britt chocolate-covered beans, chorreador + cloth filters.

---

## 4 · Getting the exact product links for the site

The site currently uses tagged **search links** (`amazon.com/s?k=...&tag=julianmonge02-20`) — they work and earn, but a direct **ASIN link** converts better and attributes cleaner. Once your idea lists exist:

1. On the storefront, open a product you added
2. Use the **"Get link"** button in the Influencer/SiteStripe bar → copy the short link (it embeds your tag)
3. Paste it into the matching product's `custom.amazon_url` metafield in Shopify (or send me the 8 links and I'll update `shopify-seed/store.json` in one commit)

Priority order for swapping search links → direct links: Lizano, Café Britt, Blue Zones book (highest-recognition items first).

---

## 5 · Brand assets for the storefront

Two files created in this repo at `brand/amazon-assets/`:

- **`profile-avatar.svg`** — JM mark, ink background, light-teal ring. Export at 500×500.
- **`storefront-banner.svg`** — "ALL THINGS COSTA RICA / Curated from Nosara" over the same ink horizon composition as the site hero. Export at 2000×500.

**To export as PNG on Windows:** open the SVG in any browser → right-click → "Save image as" won't rasterize reliably, so instead: open [svgtopng.com](https://svgtopng.com) or use Figma (drag the SVG in, export as PNG at 2x). Or ask me and I'll try converting in-session.

Amazon's uploader will center-crop the banner on mobile — the artwork keeps all text inside the safe middle 60% for this reason.

---

## 6 · Compliance checklist (Associates ToS — the ones that actually bite)

- [x] **Site disclosure** — "As an Amazon Associate we earn from qualifying purchases" is already in the site footer and Amazon sections. Required on any page with tagged links.
- [ ] **Add the same disclosure to your Instagram bio or link-in-bio page** if you post tagged links there
- [ ] **Never quote prices** on your own site (prices change; cached prices violate ToS). The site already shows no Amazon prices — keep it that way.
- [ ] **No link cloaking** — don't wrap tagged links in bit.ly etc. Direct or Amazon short-links only.
- [ ] **No tagged links in email** — Amazon prohibits affiliate links in email newsletters. The site newsletter should link to the storefront page or your site, never to tagged product URLs.
- [ ] **Make 3 qualifying sales in 180 days** — new Associates accounts are closed if no sales occur. Phase-1 launch of the storefront + site traffic should clear this easily; if you're worried, share the storefront link with a few friends who shop on Amazon anyway.

---

## 7 · Payout settings

Influencer dashboard → **Account Settings → Payment**:

- **Now:** set payout to your personal account (Amazon pays to CR bank via international details, or Payoneer/Wise as intermediaries, or Amazon gift-card balance as a holding option)
- **September (when the LLC/Chase account exists):** switch the payee to the business entity. Takes effect the next payment cycle. Amazon pays ~60 days after month end.
- Tax interview: complete the W-8BEN (non-US person) or W-9 (if the LLC is US) in the same settings area. Takes 5 minutes; commissions are held until it's done.

---

## 8 · How the two surfaces stay seamless

The design rule already in the codebase — same card, same grid, same type, different CTA:

| | Amazon items | Own merch (October) |
|---|---|---|
| Card design | identical | identical |
| Photography style | product on cream, 4:5 | product on cream, 4:5 |
| Price shown | no (ToS) — "View on Amazon" | yes — "Add to bag" |
| Click behavior | opens Amazon, new tab, tagged | stays on site, checkout |
| Badge | small "amazon" chip | "Best seller" / "New" chips |

Until October, merch cards render in **"Coming October — Notify me"** state (email capture instead of add-to-bag), so nothing on the site ever looks broken or half-finished. Flip one theme setting at launch to turn on real purchasing.

---

## Do-this-week list

1. [ ] Check whether you have Influencer or only Associates (§1a) — apply if needed (§1b)
2. [ ] Claim the `amazon.com/shop/...` handle (§1c) and **send me the final URL** (§1d)
3. [ ] Set name / bio / profile photo / banner (§2 — artwork ready in `brand/amazon-assets/`)
4. [ ] Create the 5 idea lists (§3 + `amazon-list-architecture.md`) — start with 4–6 items each, grow weekly
5. [ ] Validate the gear picks against what you actually own — strike or swap anything you wouldn't vouch for
6. [ ] Send me direct tagged product links for the site's hero picks (§4)
7. [ ] Complete the tax interview + payout details (§7)
8. [ ] Add the affiliate disclosure to your Instagram bio if you post links there (§6)
