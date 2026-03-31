import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

/* ── Variable replacement ── */
function replacePlaceholders(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

/* ── Default templates (server-side copy) ── */
const DEFAULT_TEMPLATES: Record<string, { subject: string; body: string }> = {
  order_confirmation: {
    subject: "Your MagnifiScent Order is Confirmed!",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Order Confirmed!</h2>
<p>Dear {{customer_name}},</p>
<p>Thank you for your order! Here are your order details:</p>
<table style="width:100%;border-collapse:collapse;margin:16px 0">
  <tr><td style="padding:8px 0;color:#6b7280;border-bottom:1px solid #f3f4f6"><strong>Order ID:</strong></td><td style="padding:8px 0;border-bottom:1px solid #f3f4f6">{{order_id}}</td></tr>
  <tr><td style="padding:8px 0;color:#6b7280;border-bottom:1px solid #f3f4f6"><strong>Order Total:</strong></td><td style="padding:8px 0;border-bottom:1px solid #f3f4f6">{{order_total}}</td></tr>
  <tr><td style="padding:8px 0;color:#6b7280"><strong>Store:</strong></td><td style="padding:8px 0">{{store_name}}</td></tr>
</table>
<p>Your order will be dispatched within 1–2 business days.</p>
<p style="color:#6b7280;font-size:14px"><em>— The {{store_name}} Team</em></p>
</div>`,
  },
  order_shipped: {
    subject: "Your MagnifiScent order has been shipped!",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Your Order Is On Its Way!</h2>
<p>Dear {{customer_name}},</p>
<p>Your order <strong>{{order_id}}</strong> has been shipped.</p>
<p>Estimated delivery: 3–5 business days.</p>
<p style="color:#6b7280;font-size:14px"><em>— The {{store_name}} Team</em></p>
</div>`,
  },
  order_delivered: {
    subject: "Your MagnifiScent order has been delivered!",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Order Delivered!</h2>
<p>Dear {{customer_name}},</p>
<p>Your order <strong>{{order_id}}</strong> has been delivered. We hope you love your fragrance!</p>
<p style="color:#6b7280;font-size:14px"><em>— The {{store_name}} Team</em></p>
</div>`,
  },
  abandoned_cart: {
    subject: "You left something behind — complete your MagnifiScent order",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Your Cart Misses You</h2>
<p>Dear {{customer_name}},</p>
<p>You left items in your cart. Come back and complete your order before they sell out!</p>
<p style="color:#6b7280;font-size:14px"><em>— The {{store_name}} Team</em></p>
</div>`,
  },
  welcome_email: {
    subject: "Welcome to MagnifiScent — Thank you for your first order!",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Welcome to {{store_name}}!</h2>
<p>Dear {{customer_name}},</p>
<p>Thank you for placing your first order with us. We're thrilled to have you as a customer!</p>
<p>Your order <strong>{{order_id}}</strong> is being processed and will be dispatched soon.</p>
<p style="color:#6b7280;font-size:14px"><em>— The {{store_name}} Team</em></p>
</div>`,
  },
  new_order_alert: {
    subject: "New Order Received — {{order_id}}",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">New Order Alert</h2>
<p>A new order has been placed on your store.</p>
<table style="width:100%;border-collapse:collapse;margin:16px 0">
  <tr><td style="padding:8px 0;color:#6b7280;border-bottom:1px solid #f3f4f6"><strong>Order ID:</strong></td><td style="padding:8px 0;border-bottom:1px solid #f3f4f6">{{order_id}}</td></tr>
  <tr><td style="padding:8px 0;color:#6b7280;border-bottom:1px solid #f3f4f6"><strong>Customer:</strong></td><td style="padding:8px 0;border-bottom:1px solid #f3f4f6">{{customer_name}}</td></tr>
  <tr><td style="padding:8px 0;color:#6b7280"><strong>Total:</strong></td><td style="padding:8px 0">{{order_total}}</td></tr>
</table>
</div>`,
  },
  low_stock_alert: {
    subject: "Low Stock Alert — {{store_name}}",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Low Stock Alert</h2>
<p>A product in your store is running low on stock. Please review your inventory and restock if needed.</p>
</div>`,
  },
  test: {
    subject: "MagnifiScent — Test Email",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Test Email</h2>
<p>Your SMTP settings are working correctly!</p>
<p style="color:#6b7280;font-size:14px"><em>— MagnifiScent Admin Panel</em></p>
</div>`,
  },
};

/*
 * POST /api/send-email
 *
 * Type-driven endpoint. Callers provide:
 *   - smtp: { host, port, secure, auth: { user, pass } }
 *   - from: '"Name" <email>'
 *   - replyTo: (optional)
 *   - to: recipient address
 *   - type: one of the template keys (or "custom" for raw html)
 *   - variables: Record<string, string>  — interpolated into template
 *   - customSubject / customHtml: used only when type === "custom"
 *
 * The server resolves the correct template, replaces {{variables}}, and sends.
 * SMTP credentials must be provided by the caller (admin panel or checkout).
 * Requests without valid smtp.host are rejected.
 */
router.post("/send-email", async (req, res) => {
  try {
    const { smtp, from, replyTo, to, type, variables, customSubject, customHtml } = req.body;

    if (!to) {
      res.status(400).json({ success: false, error: "Missing required field: to" });
      return;
    }
    if (!type) {
      res.status(400).json({ success: false, error: "Missing required field: type" });
      return;
    }
    if (!smtp?.host || !smtp?.auth?.user || !smtp?.auth?.pass) {
      res.status(400).json({ success: false, error: "Missing or incomplete SMTP configuration (host, auth.user, auth.pass required)" });
      return;
    }

    const vars: Record<string, string> = variables ?? {};

    let subject: string;
    let html: string;

    if (type === "custom") {
      subject = customSubject ?? "Message from MagnifiScent";
      html = customHtml ?? "";
    } else {
      const tpl = DEFAULT_TEMPLATES[type];
      if (!tpl) {
        res.status(400).json({ success: false, error: `Unknown email type: ${type}` });
        return;
      }
      subject = replacePlaceholders(tpl.subject, vars);
      html = replacePlaceholders(tpl.body, vars);
    }

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port ?? 587,
      secure: smtp.secure ?? false,
      auth: {
        user: smtp.auth.user,
        pass: smtp.auth.pass,
      },
    });

    const info = await transporter.sendMail({
      from: from ?? smtp.auth.user,
      replyTo: replyTo ?? undefined,
      to,
      subject,
      html,
    });

    res.json({ success: true, messageId: info.messageId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
