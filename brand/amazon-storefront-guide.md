# Amazon Storefront Setup — julianmonge02-20

> Phase 1 of the launch: the Amazon Influencer storefront goes live FIRST and starts
> earning referral commission immediately. The Shopify ecom follows in October.
> This guide covers everything to complete on the Amazon side, in order.

**Associate tag:** `julianmonge02-20` (approved, wired into every site link)
**Storefront URL (once set up):** `amazon.com/shop/<your-handle>` — see §2 for claiming the handle

---

## 1 · Confirm which program you're actually in

Amazon has two related programs and the storefront features differ:

| Program | What you get | Check |
|---|---|---|
| **Amazon Associates** (tag `julianmonge02-20`) | Tagged links earn commission. No storefront page. | [affiliate-program.amazon.com](https://affiliate-program.amazon.com) → sign in → your tag shows in the top bar |
| **Amazon Influencer Program** | Everything Associates has PLUS a public storefront page (`amazon.com/shop/handle`) with idea lists, photos, videos | [affiliate-program.amazon.com/influencers](https://affiliate-program.amazon.com/influencers) → sign in → "Your Storefront" appears in the nav |

The tag format `julianmonge02-20` works for both. **If you only have Associates today**, apply to the Influencer Program with your Instagram/TikTok/YouTube (they check follower engagement, not raw count — accounts in the low thousands get approved regularly). Approval is usually instant-to-48h.

**If you already have the Influencer storefront** (you mentioned the link name tag — if `amazon.com/shop/julianmonge02-20` or similar resolves, you have it), skip to §2.

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

### List 4 — `Home & Porch`
| Product | Search | Note |
|---|---|---|
| Hand-woven hammock | `hand woven caribbean hammock cotton` | The porch standard from Nicoya to Limón. Pick the best-reviewed listing. |

**How to add:** Storefront → **Idea Lists → Create list** → search each product inside the Amazon UI → add → paste the one-line note. The notes above are already in brand voice — use them verbatim.

**Growing the lists:** aim for 8–12 items per list over the next month. Same test for every addition: *would you actually pack it for/from Nosara?* Candidates: Kuhl/prAna sun shirts, YETI Panga dry duffel, Birkenstock EVAs, a machete file, Britt chocolate-covered coffee beans, chorreador + cloth filters, Imperial beer glasses.

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

1. [ ] Confirm Influencer storefront exists (§1) — if not, apply today
2. [ ] Claim handle + set name/bio/photo/banner (§2, assets in §5)
3. [ ] Create the 4 idea lists with the 8 products (§3)
4. [ ] Send me the 8 direct product links → I swap them into the site (§4)
5. [ ] Complete the tax interview + payout details (§7)
6. [ ] Add disclosure to Instagram bio if posting links (§6)
