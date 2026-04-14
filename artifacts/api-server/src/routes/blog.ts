import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { db } from "../lib/db.js";
import { blogPostsTable, productsTable } from "@workspace/db";
import { requireAdminAuth } from "../middleware/auth.js";

const router = Router();

/* ── Helpers ── */

type ProductRef = { slug: string; name: string; category: string };

function buildProductLinks(products: ProductRef[], category: "men" | "women" | "any", count: number): string {
  const filtered = category === "any"
    ? products
    : products.filter((p) => p.category === category);
  const picked = filtered.slice(0, count);
  if (picked.length === 0) {
    return category === "women"
      ? "[women's collection](/products?gender=women)"
      : category === "men"
      ? "[men's collection](/products?gender=men)"
      : "[our collection](/products)";
  }
  return picked.map((p) => `[${p.name}](/products/${p.slug})`).join(", ");
}

function buildStarterPosts(products: ProductRef[]) {
  const men = products.filter((p) => p.category === "men");
  const women = products.filter((p) => p.category === "women");
  const any = products;

  const menLinks3 = buildProductLinks(men, "men", 3);
  const menLinks4 = buildProductLinks(men, "men", 4);
  const womenLinks3 = buildProductLinks(women, "women", 3);
  const anyLinks4 = buildProductLinks(any, "any", 4);
  const anyLinks5 = buildProductLinks(any, "any", 5);

  const menFeatured = men.slice(0, 5).map((p) => `- [${p.name}](/products/${p.slug})`).join("\n") ||
    "- [View all men's perfumes](/products?gender=men)";
  const womenFeatured = women.slice(0, 5).map((p) => `- [${p.name}](/products/${p.slug})`).join("\n") ||
    "- [View all women's perfumes](/products?gender=women)";
  const anyFeatured = any.slice(0, 5).map((p) => `- [${p.name}](/products/${p.slug})`).join("\n") ||
    "- [View all perfumes](/products)";

  return [
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

## Top Long-Lasting Fragrance Picks at MagnifiScent

### Oud & Oriental — Evening Kings
Oud-based fragrances are the undisputed champions of longevity. Derived from agarwood, oud has a rich, resinous quality that clings to fabric and skin for 10–12 hours easily. Whether you're attending a wedding or a corporate dinner, an oud Eau de Parfum will keep you smelling extraordinary all night.

**Shop these long-lasting men's picks:** ${menLinks4}

### Woody Base Notes — All-Day Powerhouses
Fragrances built on cedar, sandalwood, and vetiver bases are known for their exceptional staying power. The woody molecules are large and slow to evaporate, giving you that smooth, lingering dry-down that remains present hours after application.

### Musky Fragrances — The Silent Seductors
Musk is one of the oldest perfume ingredients. Modern synthetic musks are incredibly long-lasting and project beautifully close to the skin — perfect for intimate occasions or the office. These women's picks deliver captivating longevity: ${womenLinks3}

### Amber & Resin — Warm and Persistent
Amber-based fragrances create a warm, enveloping cocoon that lasts all day and into the evening. These oriental-leaning fragrances are particularly well-suited to Pakistan's cooler winter months.

---

## Featured Long-Lasting Picks from MagnifiScent

${anyFeatured}

---

## Tips for Buying Perfume Online in Pakistan

1. **Always buy Eau de Parfum** — EDT and cologne won't give you the longevity you need in our climate
2. **Read the scent notes** — base notes (oud, wood, musk, amber) are what lasts
3. **Check Cash on Delivery availability** — MagnifiScent offers COD on all orders
4. **Buy from trusted sources** — avoid fake or diluted fragrances

---

## Final Verdict

For the absolute best longevity, reach for fragrances with **oud, amber, sandalwood, or musk** as their base notes. These materials are the anchors of any great Eau de Parfum and what keeps you smelling incredible hours after application.

Explore our full range of long-lasting Eau de Parfum at MagnifiScent — with free delivery and Cash on Delivery across all of Pakistan.

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

This guide covers the best value-for-money Eau de Parfum options available online in Pakistan, all with **Cash on Delivery** nationwide.

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

## Best Budget Fragrance Picks at MagnifiScent

### Fresh & Clean Fragrances — Office Essentials
A fresh, clean fragrance is a wardrobe staple for daily office wear. Look for aquatic, citrus, and green notes with a light musk base. These picks are great for everyday wear:

${menLinks3}

### Floral & Fruity — For Women on a Budget
Floral fragrances for women don't have to cost a fortune. Rose, jasmine, and peony-based Eau de Parfum deliver beautiful, feminine scents with excellent longevity. Explore these options: ${womenLinks3}

### Oriental & Oud — Maximum Impact, Minimum Spend
Oud-based fragrances are typically among the most expensive in the market due to the rarity of real agarwood. However, high-quality synthetic oud has become remarkably refined. Enjoy rich, complex oud fragrances without paying international designer prices: ${anyLinks4}

---

## Featured Value Picks

${anyFeatured}

---

## How to Stretch Your Perfume Budget

1. **Buy 100ml bottles** — the per-ml cost is almost always lower than 50ml
2. **Apply strategically** — 2–3 sprays to pulse points is enough; don't bathe in it
3. **Rotate fragrances** — using a different scent each day extends each bottle's life
4. **Store properly** — cool, dark, dry places preserve fragrance quality for years

---

## MagnifiScent: Pakistan's Best Value Perfume Brand

At MagnifiScent, every fragrance in our collection is designed to deliver maximum quality at honest prices. We don't spend your money on celebrity endorsements or fancy retail spaces — we put it in the bottle.

All orders come with:
- Cash on Delivery across Pakistan
- Free delivery on qualifying orders
- 20-day return policy
- 100% authentic Eau de Parfum

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
Cheap inspired perfumes, especially those sold at very low prices on social media or in local markets, may contain unregulated aromatic chemicals that cause allergic reactions, alcohol substitutes that irritate the skin, and heavy metals used as fixatives in some unethical production.

### 2. Poor Longevity
Even well-made inspired fragrances rarely last more than 2–3 hours because they use low concentrations of the aromatic materials.

### 3. Batch Inconsistency
Unlike authentic brands with quality control, inspired perfume batches vary wildly. The bottle you bought last month may smell completely different from the one you buy today.

---

## What Are "Original" or "Authentic" Perfumes?

Authentic fragrances are original compositions created by master perfumers and produced under strict quality control. They use high-grade aromatic materials — natural and synthetic — maintain consistent batch quality, are regulated and meet international safety standards, and offer genuine longevity because of proper EDP concentration.

At **MagnifiScent**, every fragrance is an **original composition** — not a copy of any designer fragrance. Our perfumers create unique scent stories inspired by global fragrance trends, but our compositions are entirely our own.

---

## MagnifiScent: Original Fragrances, Honest Pricing

The real alternative to the inspired perfume trap isn't buying a fake — it's buying an **authentic, independently composed** Eau de Parfum at honest prices. Our original collection includes:

${anyFeatured}

Our collection covers everything from fresh and aquatic EDPs perfect for daily office wear, to floral feminine fragrances, to rich oud orientals and woody musks.

Some of our most popular authentic picks: ${anyLinks5}

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
In summer heat, fragrance molecules evaporate faster and project more intensely. This means heavy oud and amber can become overwhelming, while fresh, citrus, and aquatic notes become more pleasant.

### The Summer Fragrance Formula
The best summer men's fragrances typically follow this structure:

**Top Notes:** Citrus (bergamot, lemon, grapefruit), Aquatic, Herbs (mint, lavender)
**Heart Notes:** Aromatic (cardamom, pepper), Floral (geranium), Marine
**Base Notes:** Light woods (cedar), Clean musk, Amber

---

## Top Men's Summer Picks from MagnifiScent

Here are our recommended summer-ready men's Eau de Parfum options — each crafted for Pakistan's heat:

${menFeatured}

---

## Best Fragrance Families for Pakistani Summer

### 1. Aquatic & Marine — Ultimate Summer Freshness
Aquatic fragrances evoke clean ocean air, cool breezes, and freshly-laundered linen. They're perfect for the office, casual outings, and anytime you need to feel refreshed despite the heat. Great everyday summer picks: ${menLinks3}

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

## Summary: Your Summer Fragrance Checklist

- Choose Eau de Parfum (not cologne or EDT) for longer wear
- Prioritise fresh, aquatic, citrus, and light woody notes
- Avoid heavy oud, incense, and resin as primary notes in summer
- Apply 2–3 sprays to pulse points only
- Reapply mid-afternoon if needed

The right summer fragrance in Pakistan is one that keeps you feeling confident and fresh even when the mercury says otherwise. Shop our men's collection and find your perfect summer signature at MagnifiScent.`,
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
**Season:** Spring and Summer

### 2. Citrus / Aromatic
**Vibe:** Upbeat, professional, optimistic
**Notes:** Bergamot, lemon, lavender, herbs
**Best for:** Office professionals, people-pleasers, classic types
**Season:** Year-round, especially spring/summer

### 3. Floral
**Vibe:** Romantic, feminine, elegant
**Notes:** Rose, jasmine, peony, gardenia
**Best for:** Creative souls, romantics, social butterflies
**Season:** Spring and Summer

Some beautiful floral picks for women: ${womenLinks3}

### 4. Woody / Earthy
**Vibe:** Grounded, sophisticated, mature
**Notes:** Sandalwood, cedar, vetiver, patchouli
**Best for:** Introverts, intellectuals, nature lovers
**Season:** Autumn and Winter

### 5. Oriental / Spicy
**Vibe:** Bold, confident, passionate
**Notes:** Oud, amber, cinnamon, cardamom, vanilla
**Best for:** Extroverts, social leaders, people who love attention
**Season:** Autumn and Winter

Bold men's oriental picks: ${menLinks3}

### 6. Musky / Gourmand
**Vibe:** Sensual, intimate, warm
**Notes:** Musk, vanilla, tonka, caramel
**Best for:** Romantics, homebodies, date-night dressers
**Season:** All year, especially evenings

---

## Step 2: Match Your Lifestyle

### The Office Professional
You need something that's **present but not intrusive**. Go for clean, moderate fragrances with citrus or aromatic openings and light woody or clean musk dry-downs. Our top office-ready picks: ${anyLinks4}

### The Social Butterfly
You want to be **memorable and approachable**. Floral orientals and fruity florals make a great impression: ${womenLinks3}

### The Adventurer
You're outdoors, active, and free-spirited. **Aquatic, citrus, and green** fragrances match your energy. Fresh and invigorating men's picks: ${menLinks4}

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

## Our Complete Fragrance Lineup

Explore our full collection below — something for every personality:

${anyFeatured}

---

## The MagnifiScent Promise

At MagnifiScent, every fragrance is an original composition — not an imitation. All are Eau de Parfum formulated for genuine longevity, and all are delivered with Cash on Delivery across Pakistan.

Find your signature. Start at MagnifiScent.`,
    },
    {
      title: "Best Oud Perfumes Available in Pakistan — The Complete Guide",
      slug: "best-oud-perfumes-pakistan",
      excerpt: "Oud is the king of fragrance in Pakistan. Discover the finest oud-based Eau de Parfum available online with Cash on Delivery — from light Taifi rose-oud blends to deep Cambodian resin.",
      published: true,
      coverImage: "",
      content: `## Best Oud Perfumes Available in Pakistan — The Complete Guide

Oud — known as *عود* in Urdu — holds a place of unrivalled prestige in Pakistani fragrance culture. Used for centuries in the subcontinent and the Arab world alike, oud is derived from agarwood, the resinous heartwood of *Aquilaria* trees infected with a specific mould. The scent is complex, smoky, resinous, and deeply animalic — and it carries a cultural weight that no other ingredient can match.

Whether you're dressing for an Eid celebration, a mehndi ceremony, or simply want to smell extraordinary at the office, a well-crafted oud Eau de Parfum is the ultimate statement.

---

## Why Oud Is Perfect for Pakistan's Climate

Pakistan's warm, humid summers and cool winters are ideal for oud-based fragrances. Oud molecules are large and heavy — they evaporate slowly, creating a rich projection that lasts 8–12 hours even in Karachi's coastal heat. In winter, oud becomes even more powerful and enveloping, wrapping the wearer in a warm, resinous cocoon.

---

## Understanding Oud — From Taifi to Cambodian

Not all oud smells the same. The origin of the agarwood significantly influences the character of the oud:

### Indian Oud (Hindi Oud)
Rich, deep, and animalic. Strong barnyard and leather undertones. Extremely powerful and best suited to evening wear and formal occasions. Pakistani fragrance traditionalists often prefer Indian oud for its raw, primal intensity.

### Cambodian Oud
Smooth, creamy, and slightly sweet. Less aggressive than Indian oud, with a clean woody quality. Cambodian oud is the "diplomatic" choice — it's approachable enough for everyday wear while still carrying the unmistakable oud signature.

### Taifi Rose Oud
Perhaps the most beloved in Pakistan — the combination of Bulgarian-style rose with Taifi oud creates a floral-resinous harmony that has been a mainstay of South Asian and Middle Eastern perfumery for generations. Romantic, rich, and deeply civilised.

### Light / Modern Oud
Contemporary perfumers have developed "cleaned" oud accords that capture the woody, resinous character of oud without the animalic intensity. These are perfect for oud first-timers or for wearing in professional settings.

---

## Tips for Wearing Oud in Pakistan

1. **Less is more** — 2 sprays of a proper oud EDP is sufficient for 8+ hours
2. **Apply to warm pulse points** — wrists, neck, inner elbows for maximum diffusion
3. **Layer with a hair mist** — oud in your hair projects beautifully and lasts all day
4. **Perfect for evenings** — oud becomes richer after body heat has worked on it for a few hours
5. **Don't mix with strong florals** — let oud speak for itself

---

## The MagnifiScent Oud Collection

At MagnifiScent, we've developed oud-forward Eau de Parfum compositions that respect the tradition of oud while delivering modern wearability. All our oud fragrances are:

- **100% authentic Eau de Parfum** — no dilution, no imitation
- **8–12 hour longevity** — guaranteed by our EDP concentration
- **Available with Cash on Delivery** across Pakistan
- **Priced honestly** — premium oud quality without the inflated designer markup

**Our most popular oud picks:** ${anyLinks5}

---

## Shopping Oud Online in Pakistan

When buying oud perfumes online in Pakistan, always ensure you're purchasing from a trusted source. The market is unfortunately full of synthetic oud imitations marketed as "pure" or "original." At MagnifiScent, every bottle comes with our authenticity guarantee.

All oud fragrances ship from our warehouse within 24 hours of order placement, with delivery in 2–3 business days to Karachi, Lahore, Islamabad, and all major cities.

*اچھی خوشبو انسان کی شخصیت کا آئینہ ہوتی ہے — A good fragrance is a mirror of one's character.*`,
    },
    {
      title: "Best Perfumes for Women in Pakistan — 2025 Wedding Season Edit",
      slug: "best-perfumes-women-pakistan-wedding-season",
      excerpt: "Pakistan's wedding season is a fragrance occasion like no other. Here are the best perfumes for women in Pakistan — from mehndi mornings to baraat nights and everything in between.",
      published: true,
      coverImage: "",
      content: `## Best Perfumes for Women in Pakistan — 2025 Wedding Season Edit

Pakistan's wedding culture is legendary — weeks of celebrations, each with its own dress code, colour palette, and mood. And every outfit deserves a fragrance to match. The right perfume for a mehndi is very different from what you'd wear to a walima; an afternoon bridal shower calls for something entirely different from a late-night baraat reception.

At **MagnifiScent**, we've created this definitive women's fragrance guide for Pakistan's wedding season, covering every occasion from the first dholki to the last rukhsati.

---

## The Pakistani Wedding Fragrance Calendar

### Dholki — Festive, Fun, and Fresh
**Vibe:** Joyful, energetic, informal
**Recommended:** Fruity florals, fresh rose, light musk
**Why it works:** Dholkis are intimate gatherings — often at home, in the garden, or in a smaller hall. Lighter fragrances that don't overwhelm in close proximity are ideal. Fruity rose or jasmine with a clean musk base is the perfect choice.

### Mehndi — Romantic and Floral
**Vibe:** Romantic, colourful, traditional
**Recommended:** Rose oud, tuberose, oriental floral
**Why it works:** Mehndi evenings have a magical, slightly nostalgic quality. The combination of fresh mehndi paste, incense, and colourful lights calls for a fragrance with depth — something floral with an oriental heart. A rose-oud or tuberose-amber EDP performs beautifully.

### Baraat — Bold, Memorable, Unforgettable
**Vibe:** Grand, dramatic, celebratory
**Recommended:** Oud florals, amber woods, rich oriental
**Why it works:** The baraat is the centrepiece of Pakistani weddings — and the fragrance you wear should match. This is the occasion for your most powerful, most memorable Eau de Parfum. Rich oud florals, deep amber, or warm sandalwood with rose will carry you through hours of dancing, photography, and ceremony.

### Walima — Elegant, Refined, Sophisticated
**Vibe:** Polished, celebratory but slightly more formal
**Recommended:** Fresh oriental, musk floral, light amber
**Why it works:** Walimas tend to be slightly more restrained than baraat celebrations. A sophisticated musk-floral or fresh oriental EDP is the ideal choice — present and beautiful, but never overwhelming.

---

## The 5 Fragrance Notes Every Pakistani Wedding Guest Should Have

### 1. Rose
Rose is the queen of Pakistani wedding fragrance. Rich, romantic, and universally loved — rose is your safe, beautiful choice for any wedding occasion.

### 2. Jasmine (Chameli)
*Chameli* holds deep cultural roots in Pakistan — jasmine garlands are used at weddings, and the scent of chameli is synonymous with celebration and femininity.

### 3. Oud
For baraat and formal wedding evenings, oud adds gravitas and longevity that nothing else can match. A rose-oud or jasmine-oud composition is the ultimate Pakistani bridal fragrance.

### 4. Amber
Amber creates warmth and sensuality that develops beautifully throughout the evening.

### 5. Musk
Clean musk extends longevity, softens other notes, and creates a beautiful, skin-close dry-down.

---

## MagnifiScent Wedding Fragrance Recommendations

Explore our top women's picks: ${womenFeatured}

Shop our full women's collection online with Cash on Delivery across Pakistan. All fragrances are 100% authentic Eau de Parfum with 6–12 hour longevity.

*شادی میں خوشبو وہی — The fragrance of a wedding is forever.*`,
    },
    {
      title: "How to Wear Perfume in Pakistani Winters — The Fragrance Upgrade Guide",
      slug: "how-to-wear-perfume-pakistan-winter",
      excerpt: "Pakistan winters from Islamabad to Lahore call for a completely different fragrance strategy. Here's how to upgrade your winter scent wardrobe with the right Eau de Parfum — available with Cash on Delivery.",
      published: true,
      coverImage: "",
      content: `## How to Wear Perfume in Pakistani Winters — The Fragrance Upgrade Guide

Winter in Pakistan is a completely different fragrance world. From December fog in Lahore's roads to the sharp mountain chill of Islamabad and Murree, the cooler temperatures fundamentally change how fragrance performs — and which fragrances deserve a place in your rotation.

---

## Why Winter Changes Everything

In cold weather, fragrance molecules move more slowly — they evaporate at a lower rate, meaning:

1. **Sillage (projection) is reduced** — your fragrance stays closer to the skin
2. **Longevity increases** — slower evaporation means longer wear
3. **Heavy notes perform best** — oud, amber, resin, leather, and tobacco shine in the cold
4. **Light citrus and aquatics fall flat** — they rely on warmth to project properly

This is why summer favourites can feel disappointing in winter, while fragrances that seemed "too heavy" in June suddenly become perfect in December.

---

## Best Fragrance Families for Pakistani Winters

### 1. Oriental / Oud — The Quintessential Pakistani Winter Fragrance
Nothing performs better in Pakistan's winter than a rich oud or oriental EDP. The cold air acts as a diffuser — the warmth of your body heat pushes the heavy, resinous molecules outward in a beautiful, enveloping projection.

### 2. Amber & Resin — Warm, Enveloping, Sensual
Amber fragrances create a second skin of warmth. They're incredibly comforting in cold weather — rich without being aggressive, sensual without being overwhelming.

### 3. Woody & Smoky — Sophistication in the Cold
Sandalwood, vetiver, cedar, and smoked wood fragrances find their truest expression in winter. The cool air slows their diffusion, creating an intimate projection that's perfect for close encounters and evening events.

### 4. Leather & Tobacco — Bold, Distinctive, Unforgettable
For the confident fragrance wearer, leather and tobacco notes in winter are extraordinary. Rich, animalic, and deeply distinctive — these fragrances command attention.

---

## How Many Sprays in Winter?

| Occasion | Sprays |
|----------|--------|
| Office / Daytime | 3–4 |
| Evening / Social | 4–5 |
| Formal / Wedding | 5–6 |

**Pro tip:** Apply immediately after a warm shower while your skin is still slightly warm. This drives the molecules deep into your skin and significantly extends longevity.

---

## Building Your Winter Fragrance Wardrobe

A proper winter wardrobe for Pakistan needs at minimum:

1. **A daytime oriental or amber EDP** — for office and casual wear
2. **A rich oud EDP** — for evenings, weddings, and formal events

Our top winter picks: ${anyFeatured}

Shop online with Cash on Delivery — and upgrade your winter wardrobe today.`,
    },
    {
      title: "Eid Perfume Gift Guide Pakistan — Best Fragrance Gifts for Eid ul Fitr & Eid ul Adha",
      slug: "eid-perfume-gift-guide-pakistan",
      excerpt: "Perfume is the most universally loved Eid gift in Pakistan. Here's MagnifiScent's complete Eid gift guide — for men, women, and everyone you want to impress this Eid.",
      published: true,
      coverImage: "",
      content: `## Eid Perfume Gift Guide Pakistan — The Ultimate Fragrance Gifting Handbook

In Pakistan, Eid gifting has one undisputed winner: **perfume**. A beautifully packaged Eau de Parfum says exactly the right thing — you value this person, and you want them to feel special.

---

## Why Perfume Is Pakistan's #1 Eid Gift

1. **Universal appeal** — everyone wears fragrance, from children to grandparents
2. **No sizing issues** — unlike clothing, perfume always fits
3. **Premium feel** — a well-packaged EDP looks and feels luxurious
4. **Practical luxury** — it's used and appreciated daily, not stored away
5. **Price flexibility** — options exist for every budget

---

## Eid Gift Guide by Recipient

### For Mothers — Timeless and Floral
A classic floral oriental — rose, jasmine, or tuberose with an amber base — is universally loved. Top picks: ${womenLinks3}

### For Fathers — Dignified and Strong
A rich woody oriental with oud, cedar, and amber delivers masculine confidence without aggression. Top picks: ${menLinks3}

### For Brothers — Modern and Cool
Aquatic-woody blends, fresh citrus orientals, or modern oud accords are all excellent choices for younger men.

### For Sisters — Youthful and Vibrant
Look for peach, pear, or apple top notes with rose or jasmine hearts and clean musk bases.

### For Your Spouse or Partner — Intimate and Sensual
Rich orientals, sensual musks, and warm amber EDPs make extraordinary spousal gifts.

---

## Eid Gifting Tips

1. **Order early** — Eid rush means shipping can slow down; order 5–7 days ahead
2. **Cash on Delivery means no advance risk** — ideal for last-minute Eid shopping
3. **Multiple quantities available** — buy several bottles for multiple family members

---

## The MagnifiScent Eid Promise

All MagnifiScent fragrances are 100% authentic Eau de Parfum, beautifully packaged, and available with Cash on Delivery across Pakistan, delivered within 2–3 business days.

*عید مبارک — May your Eid be as beautiful as the fragrance you gift.*`,
    },
    {
      title: "Best Perfumes for Pakistani College Students — Premium Scent on a Budget",
      slug: "best-perfumes-college-students-pakistan",
      excerpt: "University life in Pakistan doesn't have to mean smelling ordinary. Here are the best long-lasting perfumes for college students in Pakistan — premium quality at honest prices, with Cash on Delivery.",
      published: true,
      coverImage: "",
      content: `## Best Perfumes for Pakistani College Students — Premium Scent on a Budget

Whether you're at Punjab University, NUST Islamabad, or Karachi University, smelling good is non-negotiable. Your fragrance is part of your first impression — and at university, you're making new first impressions every single day.

But university life in Pakistan comes with a budget. The good news: you don't need to spend Rs. 15,000–25,000 on designer fragrances to smell extraordinary.

---

## What Makes a Great Student Fragrance?

### 1. Versatility — Day to Night, Lecture to Chai Dhaba
Your fragrance needs to work across morning lectures, afternoon labs, and evening outings — without feeling out of place in any context.

### 2. Longevity — One Application, All Day
Between morning commutes and late library sessions, you need a fragrance that lasts 6–8 hours. This means **Eau de Parfum concentration only** — EDT and cologne simply won't survive a full university day.

### 3. Projection — Present but Not Overpowering
In packed lecture halls and shared transport, moderate projection with a clean, sophisticated character is ideal.

---

## Best Fragrance Profiles for Pakistani Students

### For Him — Fresh Oriental
Fresh orientals open with energetic citrus or aquatic notes, then dry down to a warm, mildly spicy oriental base that lasts all day. Universally appropriate — morning lectures to evening cricket. Top picks: ${menLinks4}

### For Her — Light Floral Musk
Light floral musks are approachable, feminine, and appropriate for every setting. Top picks: ${womenLinks3}

---

## How to Make Your Perfume Last Longer (Student Hacks)

1. **The Moisturiser Trick** — Apply unscented moisturiser before spraying; fragrance lasts 2–3 hours longer
2. **The Clothing Spray** — A light spray on your shirt collar holds fragrance all day
3. **The Two-Spray Rule** — Two well-placed sprays of a quality EDP is always enough

---

## MagnifiScent for Students

All MagnifiScent fragrances are genuine Eau de Parfum — full concentration, honest pricing. Available with Cash on Delivery across Pakistan, delivered to your hostel or home.

Start your fragrance journey right. Because smelling good in university isn't a luxury — it's a competitive advantage.`,
    },
    {
      title: "Pakistani Bridal Fragrance Guide — How the Bride Should Smell on Her Wedding Day",
      slug: "pakistani-bridal-fragrance-guide",
      excerpt: "Your bridal fragrance will be tied to your wedding memories forever. This complete guide helps Pakistani brides choose the perfect Eau de Parfum for every wedding ceremony — from mehndi to rukhsati.",
      published: true,
      coverImage: "",
      content: `## Pakistani Bridal Fragrance Guide — How the Bride Should Smell on Her Wedding Day

Your wedding fragrance is the most powerful sensory detail of your entire wedding week. Decades after your baraat, the smell of a specific oud or rose-jasmine combination will transport you — and your husband — back to that exact moment.

---

## The Fragrance Philosophy of a Pakistani Bride

| Ceremony | Mood | Fragrance Type |
|----------|------|----------------|
| Dholki | Playful, intimate | Fruity floral, fresh musk |
| Mehndi | Romantic, colourful | Rose-oud, tuberose floral |
| Baraat | Grand, unforgettable | Rich oriental, oud floral |
| Walima | Elegant, sophisticated | Light oriental, musk floral |

---

## The Classic Pakistani Bridal Fragrance: Rose-Oud

In Pakistani bridal culture, the combination of rose and oud is as iconic as red and gold in a bridal outfit. Rose brings romance, femininity, and cultural resonance. Oud brings depth, longevity, and gravitas — the weight of an occasion that matters.

A rose-oud Eau de Parfum is the single most appropriate choice for a Pakistani baraat.

---

## Fragrance Application on Your Wedding Day

**How Many Sprays:**
- **Baraat:** 6–8 sprays — wrists, neck, décolletage, hair or dupatta
- **Mehndi:** 4–5 sprays — lighter for indoor, warmer setting
- **Walima:** 5–6 sprays

**Timing:** Apply your fragrance **45 minutes before** you begin dressing. This allows the opening notes to pass and the beautiful heart and base notes to develop, ensuring you smell your absolute best for photographs.

**The Dupatta Trick:** A light spray on your dupatta — held 30cm away — creates a beautiful cloud of fragrance around you as you move.

---

## MagnifiScent Bridal Recommendations

Our top women's picks for wedding season: ${womenFeatured}

All fragrances are Eau de Parfum — the correct concentration for a wedding day that lasts 16+ hours. Order with Cash on Delivery, delivered within 2–3 business days.

*آپ کی خوشبو آپ کی یادوں کا حصہ بن جائے — May your fragrance become part of your memories.*`,
    },
    {
      title: "Best Office Perfumes for Pakistani Men — Professional Fragrances That Close Deals",
      slug: "best-office-perfumes-men-pakistan",
      excerpt: "Your fragrance in a professional setting says as much as your suit. Here are the best office-appropriate Eau de Parfum for Pakistani men — confident, clean, and available with Cash on Delivery.",
      published: true,
      coverImage: "",
      content: `## Best Office Perfumes for Pakistani Men — Professional Fragrances That Close Deals

In Pakistan's corporate culture — from Karachi's I.I. Chundrigar Road banking towers to Lahore's Arfa Karim Tower tech offices to Islamabad's Blue Area government corridors — how you present yourself matters enormously. Your suit is chosen carefully. Your shoes are polished. But your fragrance? Often an afterthought.

It shouldn't be. A well-chosen office fragrance is invisible confidence.

---

## The Cardinal Rules of Office Fragrance

### Rule 1: Moderate Projection is Non-Negotiable
In a packed boardroom or shared open-plan office, a powerful oriental or oud EDP can be oppressive. The goal is to smell present and pleasant, not to declare your presence from across the floor.

### Rule 2: Inoffensive is Not the Same as Boring
"Office appropriate" doesn't mean generic or forgettable. A well-designed woody aromatic or clean oriental is noticed and appreciated — it's just not overwhelming.

### Rule 3: Longevity Still Matters
An office fragrance needs to last a full working day — 8+ hours. This means Eau de Parfum concentration regardless of how light the profile.

### Rule 4: Freshness Signals Competence
Research consistently shows that fresh, clean fragrances are associated with competence, reliability, and professionalism.

---

## Best Fragrance Families for Pakistani Office Wear

### 1. Woody Aromatic — The Professional Standard
Cedar, vetiver, and light sandalwood with aromatic top notes (lavender, cardamom, herbs). These are the fragrance equivalent of a well-fitted navy suit — always appropriate, always confident.

### 2. Fresh Oriental — Modern Confidence
A fresh oriental where citrus or aquatic top notes gradually warm into mild spice and amber is the contemporary Pakistani professional's power fragrance.

### 3. Light Oud — Tradition with Authority
A well-chosen light oud carries an air of confident tradition — perfect for senior executives, directors, and government professionals.

---

## How to Apply for the Office

1. **2 sprays maximum** — wrists and neck only
2. **Apply 30 minutes before leaving home** — let the opening notes settle before you arrive
3. **Seasonal adjustment:** Summer → lean fresh/aquatic; Winter → warmer woods and light orientals

Our top men's professional picks: ${menFeatured}

Shop MagnifiScent's professional collection with Cash on Delivery across Pakistan — delivered to your home or office within 2–3 business days.`,
    },
    {
      title: "How to Gift Perfume in Pakistan — The Complete Gifting Etiquette Guide",
      slug: "how-to-gift-perfume-pakistan",
      excerpt: "Gifting perfume in Pakistan comes with its own cultural etiquette. This complete guide covers everything — from choosing the right fragrance to presentation, budgeting, and gift-giving occasions.",
      published: true,
      coverImage: "",
      content: `## How to Gift Perfume in Pakistan — The Complete Gifting Etiquette Guide

Perfume is the most intimate and meaningful gift in Pakistani culture. Whether it's for Eid, a wedding, a birthday, or an anniversary, a well-chosen Eau de Parfum says something no card or envelope of cash can: *I thought about you specifically when I chose this.*

---

## Is Perfume a Good Gift in Pakistan?

**Absolutely yes.** In Pakistani culture, fragrance has deep roots in religious, social, and familial traditions. The Prophet Muhammad (PBUH) famously loved good fragrance, and gifting attar or perfume has been a sunnah-aligned gesture for centuries.

---

## Reading the Recipient — Fragrance Clues

### Watch What They Currently Wear
The most reliable indicator of someone's fragrance preferences is what they already wear. If your father has worn a heavy woody-oriental for years, he'll appreciate something in the same family.

### Consider Their Personality
- **Bold, outgoing** → Rich oriental, oud, spicy
- **Reserved, professional** → Clean woody, light aromatic, fresh musk
- **Romantic, creative** → Floral oriental, rose, warm amber
- **Young and modern** → Fresh, fruity, light oriental

---

## Budget Guide for Fragrance Gifting in Pakistan

| Recipient / Occasion | Suggested Budget |
|---------------------|------------------|
| Office colleague | Rs. 1,500–3,000 |
| Close friend | Rs. 2,000–5,000 |
| Sibling | Rs. 3,000–8,000 |
| Parent | Rs. 5,000–15,000 |
| Spouse / Partner | Rs. 5,000–20,000 |
| Wedding gift | Rs. 5,000–15,000 |

---

## Safe Choices When You're Unsure

**For men:** A clean, moderate woody oriental — fresh top notes with a warm amber-wood base. Universally appreciated. Top picks: ${menLinks3}

**For women:** A warm floral oriental — rose or jasmine with a soft amber-musk base. Appropriate for any age group. Top picks: ${womenLinks3}

---

## MagnifiScent: Pakistan's Gift-Ready Fragrance Brand

All MagnifiScent fragrances arrive in gift-ready packaging and are available with Cash on Delivery. Delivered within 2–3 business days across Pakistan.

*ایک اچھا تحفہ وہ ہے جو دل سے دیا جائے — The best gift is the one given from the heart.*`,
    },
    {
      title: "How to Store Perfume in Pakistan's Heat — Protect Your Fragrance Collection",
      slug: "how-to-store-perfume-pakistan-heat",
      excerpt: "Pakistan's extreme summers can ruin an expensive perfume collection in weeks. Here's the definitive guide to storing your Eau de Parfum properly in Karachi, Lahore, and Multan's heat.",
      published: true,
      coverImage: "",
      content: `## How to Store Perfume in Pakistan's Heat — Protect Your Fragrance Collection

If you've ever opened a favourite perfume after a summer away and found it smells flat or completely different — you've experienced fragrance degradation. In Pakistan's extreme summer heat, an expensive Eau de Parfum can deteriorate in weeks if stored incorrectly. Temperatures in Multan, Jacobabad, and Karachi regularly exceed 45°C in June — conditions that rapidly break down delicate aromatic molecules.

---

## How Heat Destroys Fragrance

1. **Oxidation** — Heat accelerates the reaction between fragrance molecules and oxygen, creating harsh or "sour" notes
2. **Evaporation** — High temperatures drive alcohol out of the bottle even when sealed
3. **Molecular breakdown** — Delicate molecular bonds break apart under prolonged heat
4. **Colour change** — A fragrance turning significantly darker signals oxidative damage

---

## Pakistan's Heat Problem — City by City

| City | Peak Summer Temp | Risk Level |
|------|-----------------|------------|
| Jacobabad | 50°C+ | Extreme |
| Multan | 48°C+ | Extreme |
| Lahore | 44°C+ | High |
| Karachi | 40°C+ | High |
| Islamabad | 38°C+ | Moderate |

If you live in Lahore, Karachi, or southern Punjab, proper storage is **essential**.

---

## The Golden Rules of Fragrance Storage in Pakistan

### Rule 1: Keep Away from Direct Sunlight
UV radiation accelerates oxidation faster than heat alone. Never store perfume on a sunny windowsill or bathroom shelf with natural light.

### Rule 2: Maintain Stable, Cool Temperatures
In Pakistani summers, this means:
- **Air-conditioned room storage** — ideal if your bedroom is regularly air-conditioned
- **Inner wardrobe storage** — inside a closed wardrobe in a cooler room
- **Refrigerator storage** — the vegetable drawer (4–8°C) works excellently in extreme heat

### Rule 3: Keep Bottles in Their Original Boxes
The cardboard box blocks light and provides thermal insulation. **Always store perfume in its original box** when not in daily use.

### Rule 4: Store Upright
When stored on their side, the liquid is in constant contact with the cap seal, which degrades faster and can cause leakage.

---

## Signs Your Perfume Has Gone Bad

- Significantly darker colour
- Unusually harsh or alcoholic opening
- Much flatter, less complex scent
- Sour or vinegary character

---

## Invest in Proper Storage — Protect Your Investment

A proper 100ml EDP is a genuine investment in Pakistan's premium fragrance market. Our fragrances are filled in high-quality sealed bottles — but no bottle can protect against Pakistan's summer heat without your help. Shop online with Cash on Delivery and store your collection correctly from day one.`,
    },
    {
      title: "Best Unisex Perfumes in Pakistan — Fragrances That Work for Everyone",
      slug: "best-unisex-perfumes-pakistan",
      excerpt: "Unisex fragrances are the fastest-growing category in Pakistan's perfume market. Here are the best gender-neutral Eau de Parfum options — beautiful on both men and women, available with Cash on Delivery.",
      published: true,
      coverImage: "",
      content: `## Best Unisex Perfumes in Pakistan — Fragrances That Work for Everyone

The fastest-growing segment of Pakistan's fragrance market isn't masculine or feminine — it's neither. Gender-neutral fragrances are finding enthusiastic audiences among younger Pakistani consumers who see fragrance as personal expression rather than gender signalling.

---

## What Makes a Fragrance Truly Unisex?

The concept of gendered fragrance is largely a 20th-century marketing construct. Historically, fragrance has had no gender — roses, oud, amber, and musk were worn by kings and queens alike across all cultures.

A fragrance tends to be perceived as unisex when it:
- **Avoids extremely heavy floral hearts** — like overwhelmingly sweet rose bouquets
- **Avoids extremely aggressive masculines** — like heavy leather or crude tobacco
- **Uses neutral base notes** — oud, cedar, vetiver, amber, soft musk
- **Has a balanced profile** — neither overtly sweet nor overtly harsh

---

## Why Unisex Fragrances Are Perfect for Pakistan

Pakistan has a rich olfactive tradition where many ingredients are inherently non-gendered. Oud has been worn by both men and women for centuries. Rose-oud, which reads as feminine in some Western markets, is regularly worn by Pakistani men at weddings and formal occasions. This existing cultural openness makes Pakistani consumers perfectly suited to enjoying unisex fragrances.

---

## The Best Fragrance Families for Unisex Wear in Pakistan

### 1. Oud — The Original Unisex Fragrance
Oud is neither masculine nor feminine in Pakistani culture — it's prestigious, traditional, and beautiful.

### 2. Woody — Sophisticated and Versatile
Cedar, sandalwood, and vetiver-based fragrances project sophistication and groundedness without skewing to any gender.

### 3. Clean Musk — Modern and Universally Appealing
Clean white musk fragrances smell like clean skin — intimate, soft, and fresh. Universally beautiful.

### 4. Aquatic Woody — Modern Pakistan's Favourite
Fresh aquatic notes with a clean woody base create a modern, contemporary fragrance profile completely free of traditional gender associations.

---

## The Unisex Gifting Advantage

When gifting and you're unsure of the recipient's preferences, a well-chosen unisex fragrance is your safest option. A beautiful oud, clean musk, or woody EDP is guaranteed to be appreciated regardless of gender.

Our most versatile, gender-neutral picks: ${anyFeatured}

Shop MagnifiScent's full collection with Cash on Delivery across Pakistan.

*خوشبو کا کوئی جنس نہیں ہوتا — Fragrance has no gender.*`,
    },
  ];
}

/* ── Seeding ── */

let seeded = false;

async function seedBlogPosts() {
  if (seeded) return;
  seeded = true;
  try {
    const products = await db
      .select({ slug: productsTable.slug, name: productsTable.name, category: productsTable.category })
      .from(productsTable)
      .where(eq(productsTable.active, true))
      .limit(10);

    const posts = buildStarterPosts(products as { slug: string; name: string; category: string }[]);

    for (const post of posts) {
      await db.insert(blogPostsTable).values(post).onConflictDoNothing();
    }
  } catch {
    seeded = false;
  }
}

/* ── Public routes ── */

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
