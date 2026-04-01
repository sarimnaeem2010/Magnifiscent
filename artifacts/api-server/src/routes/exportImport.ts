import { Router } from "express";
import { db } from "../lib/db.js";
import { requireAdminAuth } from "../middleware/auth.js";
import {
  productsTable,
  dealsTable,
  dealImagesTable,
  storeSettingsTable,
  extendedSettingsTable,
  paymentSettingsTable,
  emailConfigTable,
  heroSlidesTable,
  genderBannersTable,
  notesImagesTable,
  productImagesTable,
  tickerMessagesTable,
  instagramReelsTable,
  homeHeadingsTable,
  policyPagesTable,
  discountCodesTable,
} from "@workspace/db";

const router = Router();

/* GET /api/admin/export — export all store data as JSON */
router.get("/admin/export", requireAdminAuth, async (_req, res) => {
  try {
    const [
      products,
      deals,
      dealImages,
      settings,
      extendedSettings,
      paymentSettings,
      emailConfig,
      heroSlides,
      genderBanners,
      notesImages,
      productImages,
      tickerMessages,
      instagramReels,
      homeHeadings,
      policyPages,
      discountCodes,
    ] = await Promise.all([
      db.select().from(productsTable),
      db.select().from(dealsTable),
      db.select().from(dealImagesTable),
      db.select().from(storeSettingsTable),
      db.select().from(extendedSettingsTable),
      db.select().from(paymentSettingsTable),
      db.select().from(emailConfigTable),
      db.select().from(heroSlidesTable),
      db.select().from(genderBannersTable),
      db.select().from(notesImagesTable),
      db.select().from(productImagesTable),
      db.select().from(tickerMessagesTable),
      db.select().from(instagramReelsTable),
      db.select().from(homeHeadingsTable),
      db.select().from(policyPagesTable),
      db.select().from(discountCodesTable),
    ]);

    const exportData = {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      data: {
        products,
        deals,
        dealImages,
        settings,
        extendedSettings,
        paymentSettings,
        emailConfig,
        heroSlides,
        genderBanners,
        notesImages,
        productImages,
        tickerMessages,
        instagramReels,
        homeHeadings,
        policyPages,
        discountCodes,
      },
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="magnifiscent-export-${new Date().toISOString().split("T")[0]}.json"`
    );
    res.json(exportData);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* POST /api/admin/import — import store data from JSON */
router.post("/admin/import", requireAdminAuth, async (req, res) => {
  try {
    const body = req.body;
    if (!body?.data) {
      res.status(400).json({ success: false, error: "Invalid import file: missing data field" });
      return;
    }

    const { data } = body;
    const results: Record<string, number> = {};

    if (Array.isArray(data.products) && data.products.length > 0) {
      for (const row of data.products) {
        await db
          .insert(productsTable)
          .values(row)
          .onConflictDoUpdate({ target: productsTable.id, set: row });
      }
      results.products = data.products.length;
    }

    if (Array.isArray(data.deals) && data.deals.length > 0) {
      for (const row of data.deals) {
        await db
          .insert(dealsTable)
          .values(row)
          .onConflictDoUpdate({ target: dealsTable.id, set: row });
      }
      results.deals = data.deals.length;
    }

    if (Array.isArray(data.dealImages) && data.dealImages.length > 0) {
      for (const row of data.dealImages) {
        await db
          .insert(dealImagesTable)
          .values(row)
          .onConflictDoUpdate({ target: dealImagesTable.dealId, set: row });
      }
      results.dealImages = data.dealImages.length;
    }

    if (Array.isArray(data.settings) && data.settings.length > 0) {
      for (const row of data.settings) {
        await db
          .insert(storeSettingsTable)
          .values(row)
          .onConflictDoUpdate({ target: storeSettingsTable.id, set: row });
      }
      results.settings = data.settings.length;
    }

    if (Array.isArray(data.extendedSettings) && data.extendedSettings.length > 0) {
      for (const row of data.extendedSettings) {
        await db
          .insert(extendedSettingsTable)
          .values(row)
          .onConflictDoUpdate({ target: extendedSettingsTable.id, set: row });
      }
      results.extendedSettings = data.extendedSettings.length;
    }

    if (Array.isArray(data.paymentSettings) && data.paymentSettings.length > 0) {
      for (const row of data.paymentSettings) {
        await db
          .insert(paymentSettingsTable)
          .values(row)
          .onConflictDoUpdate({ target: paymentSettingsTable.id, set: row });
      }
      results.paymentSettings = data.paymentSettings.length;
    }

    if (Array.isArray(data.emailConfig) && data.emailConfig.length > 0) {
      for (const row of data.emailConfig) {
        await db
          .insert(emailConfigTable)
          .values(row)
          .onConflictDoUpdate({ target: emailConfigTable.id, set: row });
      }
      results.emailConfig = data.emailConfig.length;
    }

    if (Array.isArray(data.heroSlides) && data.heroSlides.length > 0) {
      for (const row of data.heroSlides) {
        await db
          .insert(heroSlidesTable)
          .values(row)
          .onConflictDoUpdate({ target: heroSlidesTable.id, set: row });
      }
      results.heroSlides = data.heroSlides.length;
    }

    if (Array.isArray(data.genderBanners) && data.genderBanners.length > 0) {
      for (const row of data.genderBanners) {
        await db
          .insert(genderBannersTable)
          .values(row)
          .onConflictDoUpdate({ target: genderBannersTable.id, set: row });
      }
      results.genderBanners = data.genderBanners.length;
    }

    if (Array.isArray(data.notesImages) && data.notesImages.length > 0) {
      for (const row of data.notesImages) {
        await db
          .insert(notesImagesTable)
          .values(row)
          .onConflictDoUpdate({ target: notesImagesTable.id, set: row });
      }
      results.notesImages = data.notesImages.length;
    }

    if (Array.isArray(data.productImages) && data.productImages.length > 0) {
      for (const row of data.productImages) {
        await db
          .insert(productImagesTable)
          .values(row)
          .onConflictDoUpdate({ target: productImagesTable.id, set: row });
      }
      results.productImages = data.productImages.length;
    }

    if (Array.isArray(data.tickerMessages) && data.tickerMessages.length > 0) {
      for (const row of data.tickerMessages) {
        await db
          .insert(tickerMessagesTable)
          .values(row)
          .onConflictDoUpdate({ target: tickerMessagesTable.id, set: row });
      }
      results.tickerMessages = data.tickerMessages.length;
    }

    if (Array.isArray(data.instagramReels) && data.instagramReels.length > 0) {
      for (const row of data.instagramReels) {
        await db
          .insert(instagramReelsTable)
          .values(row)
          .onConflictDoUpdate({ target: instagramReelsTable.id, set: row });
      }
      results.instagramReels = data.instagramReels.length;
    }

    if (Array.isArray(data.homeHeadings) && data.homeHeadings.length > 0) {
      for (const row of data.homeHeadings) {
        await db
          .insert(homeHeadingsTable)
          .values(row)
          .onConflictDoUpdate({ target: homeHeadingsTable.id, set: row });
      }
      results.homeHeadings = data.homeHeadings.length;
    }

    if (Array.isArray(data.policyPages) && data.policyPages.length > 0) {
      for (const row of data.policyPages) {
        await db
          .insert(policyPagesTable)
          .values(row)
          .onConflictDoUpdate({ target: policyPagesTable.id, set: row });
      }
      results.policyPages = data.policyPages.length;
    }

    if (Array.isArray(data.discountCodes) && data.discountCodes.length > 0) {
      for (const row of data.discountCodes) {
        await db
          .insert(discountCodesTable)
          .values(row)
          .onConflictDoUpdate({ target: discountCodesTable.id, set: row });
      }
      results.discountCodes = data.discountCodes.length;
    }

    res.json({ success: true, imported: results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
