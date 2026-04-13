import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { db } from "../lib/db.js";
import { blogPostsTable } from "@workspace/db";
import { requireAdminAuth } from "../middleware/auth.js";

const router = Router();

/* ── Starter articles seeded on first request ── */
const STARTER_POSTS = [
  {
    title: "Top 10 Long Lasting Perfumes in Pakistan",
    slug: "top-10-long-lasting-perfumes-pakistan",
    excerpt: "Discover the best long lasting perfumes available in Pakistan with Cash on Delivery. We cover oud, floral, and oriental fragrances that keep you smelling great all day.",
    published: true,
    coverImage: "",
    content: `## Top 10 Long Lasting Perfumes in Pakistan (2024 Guide)

If you've ever bought a perfume that fades within two hours, you know the frustration. In Pakistan's warm climate — especially during Karachi and Lahore summers — longevity is everything. A good Eau de Parfum (EDP) should last 6 to 12 hours and project beautifully throughout the day.

At **MagnifiScent**, we've curated a premium collection of long-lasting fragrances for both men and women, all available with **Cash on Delivery across Pakistan**. Here's our definitive guide to the most long-lasting perfumes you can buy online right now.

---

## What Makes a Perfume Last Longer?

Before we list the top picks, it's important to understand **fragrance concentration**. The higher the concentration of perfume oil, the longer it lasts:

- **Eau de Cologne (EDC)** – 2–4 hours
- **Eau de Toilette (EDT)** – 3–5 hours
- **Eau de Parfum (EDP)** – 6–10 hours
- **Parfum (Extrait)** – 8–12+ hours

All MagnifiScent fragrances are formulated as **Eau de Parfum**, ensuring exceptional longevity on the skin.

---

## How to Make Your Perfume Last Even Longer

1. **Apply to pulse points** — wrists, neck, inner elbows, and behind knees
2. **Moisturise first** — fragrance clings to hydrated skin much longer
3. **Don't rub** — rubbing breaks the molecular structure and kills the top notes
4. **Layer with matching body lotion** if available
5. **Store away from heat and sunlight**

---

## Top 10 Long Lasting Fragrances at MagnifiScent

### 1. Oud & Oriental Fragrances — Evening Kings
Oud-based fragrances are the undisputed champions of longevity. Derived from agarwood, oud has a rich, resinous quality that clings to fabric and skin for 10–12 hours easily. Whether you're attending a wedding or a corporate dinner, an oud Eau de Parfum from our [men's collection](/products?gender=men) will keep you smelling extraordinary all night.

### 2. Woody Base Notes — All-Day Powerhouses
Fragrances built on cedar, sandalwood, and vetiver bases are known for their exceptional staying power. The woody molecules are large and slow to evaporate, giving you that smooth, lingering dry-down that remains present hours after application.

### 3. Musky Fragrances — The Silent Seductors
Musk is one of the oldest perfume ingredients. Modern synthetic musks are incredibly long-lasting and project beautifully close to the skin — perfect for intimate occasions or the office. Browse our [women's collection](/products?gender=women) for captivating musky Eau de Parfum options.

### 4. Amber & Resin — Warm and Persistent
Amber-based fragrances create a warm, enveloping cocoon that lasts all day and into the evening. These oriental-leaning fragrances are particularly well-suited to Pakistan's cooler winter months.

### 5. Floral Orientals — Feminine and Long-Wearing
Floral fragrances with oriental dry-downs — rose with oud, jasmine with musk, ylang-ylang with amber — offer the best of both worlds: feminine beauty with remarkable longevity.

---

## Tips for Buying Perfume Online in Pakistan

1. **Always buy Eau de Parfum** — EDT and cologne won't give you the longevity you need in our climate
2. **Read the scent notes** — base notes (oud, wood, musk, amber) are what lasts
3. **Check Cash on Delivery availability** — MagnifiScent offers COD on all orders
4. **Buy from trusted sources** — avoid fake or diluted fragrances

---

## Final Verdict

For the absolute best longevity, reach for fragrances with **oud, amber, sandalwood, or musk** as their base notes. These materials are the anchors of any great Eau de Parfum and what keeps you smelling incredible hours after application.

Explore our full range of [long-lasting Eau de Parfum](/products) at MagnifiScent — with free delivery and Cash on Delivery across all of Pakistan.

*خوشبو جو دل کو چھو لے — A fragrance that touches the heart.*`,
  },
  {
    title: "Best Perfumes Under 3000 PKR in Pakistan",
    slug: "best-perfumes-under-3000-pkr-pakistan",
    excerpt: "Looking for premium fragrance without breaking the bank? Here are the best perfumes under 3000 PKR in Pakistan, available online with Cash on Delivery.",
    published: true,
    coverImage: "",
    content: `## Best Perfumes Under 3000 PKR in Pakistan

Finding a high-quality, long-lasting perfume on a budget is harder than it looks — especially in Pakistan where the market is flooded with imitations and diluted fragrances. But at **MagnifiScent**, we believe that luxury scent shouldn't require a luxury budget.

This guide covers the best value-for-money Eau de Parfum options available online in Pakistan, all under 3000 PKR, with **Cash on Delivery** nationwide.

---

## Why Expensive Doesn't Always Mean Better

The perfume industry has a well-kept secret: many affordable fragrances use the same high-quality aromatic ingredients as their expensive designer counterparts. The difference often lies in branding, packaging, and marketing budgets — not the actual liquid in the bottle.

When you shop at MagnifiScent, you're paying for **premium fragrance oil concentration** and **authentic ingredients**, not for a celebrity endorsement or a boutique storefront in DHA.

---

## What to Look for in a Budget Perfume

### 1. Concentration — Always Choose EDP
An Eau de Parfum (EDP) with a lower price tag will always outlast an Eau de Toilette that costs more. Concentration is everything.

### 2. Base Notes — Your Longevity Guarantee
Look for fragrances with **oud, musk, amber, cedar, or sandalwood** in the base. These notes are cheap to produce in synthetic form but incredibly long-lasting on skin.

### 3. Packaging — Simple but Quality
Don't overpay for elaborate bottle design. A simple, heavy bottle with a proper atomiser is what you need.

---

## The Best Budget Fragrance Categories at MagnifiScent

### Fresh & Clean Fragrances — Office Essentials
A fresh, clean fragrance is a wardrobe staple for daily office wear. Look for aquatic, citrus, and green notes with a light musk base. These are professional, versatile, and never offensive. Browse our [men's collection](/products?gender=men) for fresh EDPs ideal for everyday wear.

### Floral & Fruity — For Women on a Budget
Floral fragrances for women don't have to cost a fortune. Rose, jasmine, and peony-based Eau de Parfum from our [women's collection](/products?gender=women) deliver beautiful, feminine scents with excellent longevity at very accessible price points.

### Oriental & Oud — Maximum Impact, Minimum Spend
Oud-based fragrances are typically among the most expensive in the market due to the rarity of real agarwood. However, high-quality synthetic oud has become remarkably refined. You can enjoy rich, complex oud fragrances at MagnifiScent without paying international designer prices.

---

## How to Stretch Your Perfume Budget

1. **Buy 100ml bottles** — the per-ml cost is almost always lower than 50ml
2. **Apply strategically** — 2–3 sprays to pulse points is enough; don't bathe in it
3. **Rotate fragrances** — using a different scent each day extends each bottle's life
4. **Store properly** — cool, dark, dry places preserve fragrance quality for years

---

## MagnifiScent: Pakistan's Best Value Perfume Brand

At MagnifiScent, every fragrance in our [full collection](/products) is designed to deliver maximum quality at honest prices. We don't spend your money on celebrity endorsements or fancy retail spaces — we put it in the bottle.

All orders come with:
- ✅ **Cash on Delivery** across Pakistan
- ✅ **Free delivery** on qualifying orders
- ✅ **20-day return policy**
- ✅ **100% authentic** Eau de Parfum

Whether you're looking for your signature everyday scent or a special-occasion fragrance, MagnifiScent delivers premium quality without the premium markup.

*Smelling good is not a luxury — it's a right. And in Pakistan, it starts at MagnifiScent.*`,
  },
  {
    title: "Inspired vs Original Perfumes in Pakistan — What You Need to Know",
    slug: "inspired-vs-original-perfumes-pakistan",
    excerpt: "Confused about inspired perfumes vs originals in Pakistan? We break down the differences, the risks, and why MagnifiScent's authentic Eau de Parfum is the smarter choice.",
    published: true,
    coverImage: "",
    content: `## Inspired vs Original Perfumes in Pakistan — What You Need to Know

Walk into any perfume market in Lahore's Liberty, Karachi's Bolton Market, or even browse certain online stores, and you'll find shelves packed with "inspired by" fragrances claiming to smell like Dior Sauvage, Creed Aventus, or Tom Ford Black Orchid — at a fraction of the price. But what exactly are inspired perfumes? Are they legal? And are they safe to use?

This guide answers every question Pakistani fragrance buyers have about the inspired vs original debate.

---

## What Are "Inspired By" Perfumes?

"Inspired by" fragrances — also called "dupes" or "alternative" fragrances — are perfumes that attempt to replicate the scent profile of a well-known designer or niche fragrance. They are:

- **Not counterfeits** — they don't use the original brand's logo, name, or packaging
- **Legally produced** — scent molecules themselves are not copyright-protected
- **Lower quality** — they use cheaper raw materials and lower fragrance oil concentrations

The confusion arises when sellers in Pakistan market these as "original" or use deceptive packaging. That's where the problem begins.

---

## The Risks of Buying Fake or Inspired Perfumes

### 1. Unknown Ingredients — Skin Safety Risks
Cheap inspired perfumes, especially those sold at very low prices on social media or in local markets, may contain:
- **Unregulated aromatic chemicals** that cause allergic reactions
- **Alcohol substitutes** that irritate the skin
- **Heavy metals** used as fixatives in some unethical production

### 2. Poor Longevity
Even well-made inspired fragrances rarely last more than 2–3 hours because they use low concentrations of the aromatic materials.

### 3. Batch Inconsistency
Unlike authentic brands with quality control, inspired perfume batches vary wildly. The bottle you bought last month may smell completely different from the one you buy today.

### 4. No Regulatory Oversight
In Pakistan, inspired perfumes often bypass PSQCA standards. You have no way to know what you're actually applying to your skin.

---

## What Are "Original" or "Authentic" Perfumes?

Authentic fragrances are original compositions created by master perfumers and produced under strict quality control. They:

- Use **high-grade aromatic materials** — natural and synthetic
- Maintain **consistent batch quality**
- Are **regulated** and meet international safety standards
- Offer **genuine longevity** because of proper EDP concentration

At **MagnifiScent**, every fragrance is an **original composition** — not a copy of any designer fragrance. Our perfumers create unique scent stories inspired by global fragrance trends, but our compositions are entirely our own.

---

## MagnifiScent: Original Fragrances, Honest Pricing

The real alternative to the inspired perfume trap isn't buying a fake — it's buying an **authentic, independently composed** Eau de Parfum at honest prices.

Our [full collection of original fragrances](/products) covers everything from:

- **Fresh & Aquatic** — perfect for daily wear and summers in Pakistan
- **Floral & Feminine** — from our [women's range](/products?gender=women)
- **Oud & Oriental** — from our [men's range](/products?gender=men)
- **Woody & Musky** — versatile all-season signatures

---

## How to Spot a Fake Perfume in Pakistan

1. **Price too good to be true** — original 100ml EDPs cost more to produce
2. **Spelling errors on packaging** — a classic tell
3. **Thin, watery texture** — authentic EDPs should feel slightly oily on skin
4. **Fades within 2 hours** — proper EDP should last 6+ hours
5. **No batch number or manufacturing info** — regulatory non-compliance

---

## The Bottom Line

"Inspired by" and counterfeit fragrances are a gamble with your skin, your money, and your reputation. When you're standing in a meeting or at a wedding in Pakistan, you want to be confident your fragrance is working for you — not fading away or causing a skin reaction.

Choose **authentic**. Choose **original**. Choose **MagnifiScent** — delivering premium, 100% genuine Eau de Parfum with Cash on Delivery across Pakistan.`,
  },
  {
    title: "Best Men's Perfumes for Summer in Pakistan",
    slug: "best-mens-perfumes-summer-pakistan",
    excerpt: "Pakistan summers are brutal. Your fragrance needs to keep up. Here are the best men's perfumes for summer in Pakistan — fresh, long-lasting, and available with Cash on Delivery.",
    published: true,
    coverImage: "",
    content: `## Best Men's Perfumes for Summer in Pakistan

Pakistan's summer is legendary — temperatures regularly climb above 40°C in cities like Multan, Lahore, and Karachi. In these conditions, heavy oud and oriental fragrances can become overwhelming, while light colognes evaporate within minutes. The ideal summer perfume for Pakistani men is a careful balance: **fresh enough to feel clean, strong enough to last all day**.

Here's our comprehensive guide to the best men's summer fragrances available online in Pakistan.

---

## What Makes a Great Summer Perfume?

### Heat Amplifies Everything
In summer heat, fragrance molecules evaporate faster and project more intensely. This means:
- **Heavy oud and amber** can become overwhelming
- **Fresh, citrus, and aquatic** notes become more pleasant
- **Longevity** is still critical — you need the fragrance to last through the heat

### The Summer Fragrance Formula
The best summer men's fragrances typically follow this structure:

**Top Notes:** Citrus (bergamot, lemon, grapefruit), Aquatic, Herbs (mint, lavender)  
**Heart Notes:** Aromatic (cardamom, pepper), Floral (geranium), Marine  
**Base Notes:** Light woods (cedar), Clean musk, Amber

---

## Best Fragrance Families for Pakistani Summer

### 1. Aquatic & Marine — Ultimate Summer Freshness
Aquatic fragrances evoke clean ocean air, cool breezes, and freshly-laundered linen. They're perfect for the office, casual outings, and anytime you need to feel refreshed despite the heat. These are among the safest choices for daytime summer wear in Pakistan.

Browse our [men's aquatic and fresh fragrances](/products?gender=men).

### 2. Citrus & Aromatic — The Classic Summer Standard
Bergamot, lemon, and grapefruit top notes paired with aromatic hearts of lavender and sage create timeless summer fragrances. They're versatile, universally appealing, and project beautifully without being aggressive in the heat.

### 3. Light Woods — Sophisticated Summer Elegance
For men who prefer something more mature and sophisticated than pure citrus, light woody fragrances with cedar and vetiver bases offer excellent longevity with a refined, never-overpowering character.

---

## How to Wear Perfume in Pakistani Summer Heat

### Application Tips
1. **Apply after showering** — clean, moisturised skin holds fragrance longer
2. **Pulse points only** — wrists, neck, and chest; avoid applying to areas that sweat heavily
3. **Don't rub** — let the fragrance dry naturally
4. **Clothes and hair** — a light spray on shirt collar holds fragrance beautifully
5. **Carry a small bottle** — for mid-day reapplication if needed

### How Many Sprays?
In summer, **2–3 sprays** is the right amount for most men. The heat will amplify the projection significantly. Over-applying in summer is a common mistake that makes even good fragrances unpleasant.

---

## Summer vs Winter Fragrances: Knowing the Difference

| Category | Summer (Pakistan) | Winter (Pakistan) |
|----------|------------------|------------------|
| Opening | Citrus, Marine, Herbal | Spice, Warm Oud, Incense |
| Heart | Aromatic, Floral | Rose, Tobacco, Leather |
| Base | Light Wood, Clean Musk | Heavy Amber, Resin, Oud |
| Projection | Moderate | Strong |
| Longevity | 5–8 hours | 8–12+ hours |

---

## Our Top Picks from MagnifiScent Men's Collection

MagnifiScent's [men's fragrance collection](/products?gender=men) includes several excellent summer-ready Eau de Parfum options:

- **Fresh & Aquatic EDPs** — ideal for daily office wear and outdoor activities
- **Citrus & Aromatic EDPs** — classic summer masculines with excellent longevity
- **Light Oriental EDPs** — for men who want presence without heaviness in summer

All available with **Cash on Delivery** and **free delivery on qualifying orders** across Pakistan.

---

## Summary: Your Summer Fragrance Checklist

✅ Choose **Eau de Parfum** (not cologne or EDT) for longer wear  
✅ Prioritise **fresh, aquatic, citrus, and light woody** notes  
✅ Avoid **heavy oud, incense, and resin** as primary notes in summer  
✅ Apply **2–3 sprays** to pulse points only  
✅ Reapply **mid-afternoon** if needed  

The right summer fragrance in Pakistan is one that keeps you feeling confident and fresh even when the mercury says otherwise. Explore our full [men's collection](/products?gender=men) and find your perfect summer signature at MagnifiScent.`,
  },
  {
    title: "How to Choose the Right Perfume for Your Personality",
    slug: "how-to-choose-perfume-for-your-personality",
    excerpt: "Your fragrance says more about you than you think. Learn how to choose the right perfume for your personality, lifestyle, and the occasion — with expert guidance from MagnifiScent.",
    published: true,
    coverImage: "",
    content: `## How to Choose the Right Perfume for Your Personality

A fragrance is the most intimate accessory you own. Unlike clothing or jewellery, a scent bypasses the rational mind and speaks directly to emotion and memory. The right perfume doesn't just make you smell good — it tells your story before you say a word.

But with thousands of options available — especially now that you can order perfume online in Pakistan with Cash on Delivery — how do you choose the one that's truly *yours*?

This guide from **MagnifiScent** will help you find your signature scent based on your personality, lifestyle, and the occasions you dress for.

---

## Step 1: Understand the Fragrance Families

Before matching scent to personality, you need to understand the six major fragrance families:

### 1. Fresh / Aquatic
**Vibe:** Clean, sporty, energetic  
**Notes:** Marine, citrus, green, aquatic  
**Best for:** Athletes, outdoorsy types, casual personalities  
**Season:** Spring & Summer

### 2. Citrus / Aromatic
**Vibe:** Upbeat, professional, optimistic  
**Notes:** Bergamot, lemon, lavender, herbs  
**Best for:** Office professionals, people-pleasers, classic types  
**Season:** Year-round, especially spring/summer

### 3. Floral
**Vibe:** Romantic, feminine, elegant  
**Notes:** Rose, jasmine, peony, gardenia  
**Best for:** Creative souls, romantics, social butterflies  
**Season:** Spring & Summer  
**Explore:** [MagnifiScent women's floral collection](/products?gender=women)

### 4. Woody / Earthy
**Vibe:** Grounded, sophisticated, mature  
**Notes:** Sandalwood, cedar, vetiver, patchouli  
**Best for:** Introverts, intellectuals, nature lovers  
**Season:** Autumn & Winter

### 5. Oriental / Spicy
**Vibe:** Bold, confident, passionate  
**Notes:** Oud, amber, cinnamon, cardamom, vanilla  
**Best for:** Extroverts, social leaders, people who love attention  
**Season:** Autumn & Winter  
**Explore:** [MagnifiScent men's oriental collection](/products?gender=men)

### 6. Musky / Gourmand
**Vibe:** Sensual, intimate, warm  
**Notes:** Musk, vanilla, tonka, caramel  
**Best for:** Romantics, homebodies, date-night dressers  
**Season:** All year, especially evenings

---

## Step 2: Match Your Lifestyle

### The Office Professional
You need something that's **present but not intrusive** — colleagues shouldn't smell you before they see you. Go for clean, moderate fragrances with citrus or aromatic openings and light woody or clean musk dry-downs.

### The Social Butterfly
You want to be **memorable and approachable**. Floral orientals and fruity florals from our [women's collection](/products?gender=women) are your best friends. For men, a fresh woody or spicy oriental makes a great impression.

### The Romantic
You want something **intimate and captivating** — not loud, but impossible to forget. Musky, woody, or soft oriental fragrances work beautifully here. Think sandalwood, rose, and a lingering musk base.

### The Adventurer
You're outdoors, active, and free-spirited. **Aquatic, citrus, and green** fragrances match your energy. They're fresh, invigorating, and never feel out of place.

### The Traditionalist
You appreciate **timeless elegance** over trendy novelty. Classic oriental compositions — oud, rose, amber, sandalwood — have been the gold standard of Pakistani and Middle Eastern fragrance culture for centuries. Explore our full [fragrance collection](/products) for options in this space.

---

## Step 3: Consider the Occasion

The same person might wear three different fragrances depending on the moment:

| Occasion | Fragrance Type |
|----------|----------------|
| Morning / Office | Fresh, Citrus, Light Woody |
| Casual Daytime | Aromatic, Light Oriental |
| Evening / Going Out | Oriental, Spicy, Musky |
| Wedding / Formal | Oud, Amber, Floral Oriental |
| Date Night | Sensual Musky, Soft Wood, Oriental |

---

## Step 4: Test Before You Commit

The best way to choose a perfume is still to smell it. But when shopping online in Pakistan:

1. **Read the notes carefully** — base notes are what you'll smell after 30 minutes
2. **Read customer reviews** — real experiences from fellow Pakistanis are invaluable
3. **Consider your skin chemistry** — fragrances smell different on different people
4. **Start with familiar families** — if you love the smell of sandalwood, go woody first

---

## The MagnifiScent Promise

At MagnifiScent, we've designed our [full collection](/products) to cover every personality and every occasion. From fresh summer EDPs for the active professional to rich oud compositions for the evening socialite — there's a MagnifiScent fragrance for every chapter of your story.

All our fragrances are:
- 🌸 **Original compositions** — not imitations
- 💧 **Eau de Parfum** — for genuine longevity
- 🚚 **Delivered with COD** — Cash on Delivery across Pakistan
- ✅ **100% authentic** ingredients

Find your signature. Start at [MagnifiScent](/products).`,
  },
];

let seeded = false;

async function seedBlogPosts() {
  if (seeded) return;
  seeded = true;
  try {
    const existing = await db.select({ id: blogPostsTable.id }).from(blogPostsTable).limit(1);
    if (existing.length > 0) return;
    for (const post of STARTER_POSTS) {
      await db.insert(blogPostsTable).values(post).onConflictDoNothing();
    }
  } catch {
    seeded = false;
  }
}

/* ── Public routes ── */

/* GET /api/blog — published posts list (newest first) */
router.get("/blog", async (_req, res) => {
  await seedBlogPosts();
  try {
    const posts = await db
      .select({
        id: blogPostsTable.id,
        title: blogPostsTable.title,
        slug: blogPostsTable.slug,
        excerpt: blogPostsTable.excerpt,
        coverImage: blogPostsTable.coverImage,
        createdAt: blogPostsTable.createdAt,
      })
      .from(blogPostsTable)
      .where(eq(blogPostsTable.published, true))
      .orderBy(desc(blogPostsTable.createdAt));
    res.json({ success: true, posts });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* GET /api/blog/:slug — single published post */
router.get("/blog/:slug", async (req, res) => {
  await seedBlogPosts();
  try {
    const [post] = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.slug, String(req.params.slug)))
      .limit(1);
    if (!post || !post.published) {
      res.status(404).json({ success: false, error: "Post not found" });
      return;
    }
    res.json({ success: true, post });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* ── Admin routes ── */

/* GET /api/admin/blog — all posts (admin only) */
router.get("/admin/blog", requireAdminAuth, async (_req, res) => {
  await seedBlogPosts();
  try {
    const posts = await db
      .select()
      .from(blogPostsTable)
      .orderBy(desc(blogPostsTable.createdAt));
    res.json({ success: true, posts });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* POST /api/admin/blog — create post */
router.post("/admin/blog", requireAdminAuth, async (req, res) => {
  try {
    const { title, slug, excerpt, content, coverImage, published } = req.body;
    if (!title || !slug) {
      res.status(400).json({ success: false, error: "title and slug are required" });
      return;
    }
    const [created] = await db
      .insert(blogPostsTable)
      .values({ title, slug, excerpt: excerpt ?? "", content: content ?? "", coverImage: coverImage ?? "", published: published ?? false })
      .returning();
    res.json({ success: true, post: created });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* PUT /api/admin/blog/:id — update post */
router.put("/admin/blog/:id", requireAdminAuth, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid id" });
      return;
    }
    const { title, slug, excerpt, content, coverImage, published } = req.body;
    const update: Record<string, unknown> = {};
    if (title !== undefined) update.title = title;
    if (slug !== undefined) update.slug = slug;
    if (excerpt !== undefined) update.excerpt = excerpt;
    if (content !== undefined) update.content = content;
    if (coverImage !== undefined) update.coverImage = coverImage;
    if (published !== undefined) update.published = published;
    if (Object.keys(update).length === 0) {
      res.status(400).json({ success: false, error: "No fields to update" });
      return;
    }
    const [updated] = await db.update(blogPostsTable).set(update).where(eq(blogPostsTable.id, id)).returning();
    if (!updated) {
      res.status(404).json({ success: false, error: "Post not found" });
      return;
    }
    res.json({ success: true, post: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* DELETE /api/admin/blog/:id — delete post */
router.delete("/admin/blog/:id", requireAdminAuth, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid id" });
      return;
    }
    const [deleted] = await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id)).returning();
    if (!deleted) {
      res.status(404).json({ success: false, error: "Post not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
