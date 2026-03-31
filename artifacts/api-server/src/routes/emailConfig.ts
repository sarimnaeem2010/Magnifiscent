import { Router } from "express";
import { db } from "../lib/db.js";
import { emailConfigTable } from "@workspace/db";
import { requireAdminAuth } from "../middleware/auth.js";

const router = Router();

/* ── Types ── */
export type ServerSmtpSettings = {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
};

export type ServerEmailToggles = {
  order_confirmation: boolean;
  order_shipped: boolean;
  order_delivered: boolean;
  abandoned_cart: boolean;
  welcome_email: boolean;
  new_order_alert: boolean;
  low_stock_alert: boolean;
};

export type ServerEmailTemplate = { subject: string; body: string };
export type ServerEmailTemplates = Record<string, ServerEmailTemplate>;

export type EmailConfig = {
  smtp: ServerSmtpSettings | null;
  toggles: ServerEmailToggles;
  templates: ServerEmailTemplates;
};

const DEFAULT_TOGGLES: ServerEmailToggles = {
  order_confirmation: true,
  order_shipped: true,
  order_delivered: false,
  abandoned_cart: false,
  welcome_email: false,
  new_order_alert: true,
  low_stock_alert: false,
};

/* Read config from the database */
export async function readConfig(): Promise<EmailConfig> {
  try {
    const [row] = await db.select().from(emailConfigTable).limit(1);
    if (!row) return { smtp: null, toggles: { ...DEFAULT_TOGGLES }, templates: {} };
    return {
      smtp: row.username
        ? {
            host: row.host,
            port: row.port,
            secure: row.secure,
            username: row.username,
            password: row.password,
            fromName: row.fromName,
            fromEmail: row.fromEmail,
            replyTo: row.replyTo,
          }
        : null,
      toggles: { ...DEFAULT_TOGGLES, ...(row.toggles as Record<string, boolean>) },
      templates: (row.templates as Record<string, { subject: string; body: string }>) ?? {},
    };
  } catch {
    return { smtp: null, toggles: { ...DEFAULT_TOGGLES }, templates: {} };
  }
}

/* GET /api/email-config — admin auth required; returns config with password masked */
router.get("/email-config", requireAdminAuth, async (_req, res) => {
  try {
    const config = await readConfig();
    const safeConfig = {
      ...config,
      smtp: config.smtp
        ? { ...config.smtp, password: config.smtp.password ? "••••••••" : "" }
        : null,
    };
    res.json({ success: true, config: safeConfig });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* POST /api/email-config — admin auth required; saves full config to DB */
router.post("/email-config", requireAdminAuth, async (req, res) => {
  try {
    const { smtp, toggles, templates } = req.body;
    const existing = await readConfig();

    let newSmtp = smtp !== undefined ? smtp : existing.smtp;
    if (newSmtp && newSmtp.password === "••••••••" && existing.smtp) {
      newSmtp = { ...newSmtp, password: existing.smtp.password };
    }

    const newToggles = toggles !== undefined
      ? { ...DEFAULT_TOGGLES, ...toggles }
      : existing.toggles;

    const newTemplates = templates !== undefined ? templates : existing.templates;

    const dbValues = {
      id: 1,
      host: newSmtp?.host ?? "smtp.gmail.com",
      port: newSmtp?.port ?? 587,
      secure: newSmtp?.secure ?? false,
      username: newSmtp?.username ?? "",
      password: newSmtp?.password ?? "",
      fromName: newSmtp?.fromName ?? "MagnifiScent",
      fromEmail: newSmtp?.fromEmail ?? "hello@magnifiscent.com",
      replyTo: newSmtp?.replyTo ?? "hello@magnifiscent.com",
      toggles: newToggles,
      templates: newTemplates,
    };

    await db
      .insert(emailConfigTable)
      .values(dbValues)
      .onConflictDoUpdate({
        target: emailConfigTable.id,
        set: {
          host: dbValues.host,
          port: dbValues.port,
          secure: dbValues.secure,
          username: dbValues.username,
          password: dbValues.password,
          fromName: dbValues.fromName,
          fromEmail: dbValues.fromEmail,
          replyTo: dbValues.replyTo,
          toggles: dbValues.toggles,
          templates: dbValues.templates,
        },
      });

    res.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
