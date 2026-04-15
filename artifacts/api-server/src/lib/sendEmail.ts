import nodemailer from "nodemailer";
import { readConfig } from "../routes/emailConfig.js";

function replacePlaceholders(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

const SERVER_DEFAULT_SUBJECTS: Record<string, string> = {
  order_confirmation: "Your MagnifiScent Order is Confirmed!",
  order_shipped: "Your MagnifiScent order has been shipped!",
  order_delivered: "Your MagnifiScent order has been delivered!",
  new_order_alert: "New Order Received — {{order_id}}",
};

const SERVER_DEFAULT_BODIES: Record<string, string> = {
  order_confirmation: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px"><h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Order Confirmed! 🎉</h2><p>Dear {{customer_name}},</p><p>Thank you for your order <strong>{{order_id}}</strong> totalling <strong>Rs. {{order_total}}</strong>. It is now being processed and will be dispatched within 1–2 business days.</p><p style="color:#6b7280;font-size:14px"><em>— The {{store_name}} Team</em></p></div>`,
  order_shipped: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px"><h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Your Order Is On Its Way! 🚚</h2><p>Dear {{customer_name}},</p><p>Your order <strong>{{order_id}}</strong> has been shipped. Estimated delivery: 3–5 business days.</p><p style="color:#6b7280;font-size:14px"><em>— The {{store_name}} Team</em></p></div>`,
  order_delivered: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px"><h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Order Delivered! ✅</h2><p>Dear {{customer_name}},</p><p>Your order <strong>{{order_id}}</strong> has been delivered. We hope you love your fragrance!</p><p style="color:#6b7280;font-size:14px"><em>— The {{store_name}} Team</em></p></div>`,
  new_order_alert: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px"><h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">New Order Alert 🛍️</h2><p>Customer: <strong>{{customer_name}}</strong></p><p>Order ID: <strong>{{order_id}}</strong> — Total: <strong>Rs. {{order_total}}</strong></p></div>`,
};

export interface SendEmailOptions {
  type: string;
  customerEmail?: string;
  customerName?: string;
  orderId?: string;
  orderTotal?: string | number;
  variables?: Record<string, string>;
}

export async function sendEmailInternal(opts: SendEmailOptions): Promise<void> {
  try {
    const config = await readConfig();
    if (!config.smtp?.host || !config.smtp?.username || !config.smtp?.password) return;

    const isAdminAlert = opts.type === "new_order_alert" || opts.type === "low_stock_alert";
    if (opts.type !== "test" && config.toggles[opts.type as keyof typeof config.toggles] === false) return;

    const savedTpl = config.templates[opts.type];
    const defaultSubject = SERVER_DEFAULT_SUBJECTS[opts.type] ?? "";
    const defaultBody = SERVER_DEFAULT_BODIES[opts.type] ?? "";
    const subject = (savedTpl?.subject && savedTpl.subject.trim()) ? savedTpl.subject : defaultSubject;
    const body = (savedTpl?.body && savedTpl.body.trim()) ? savedTpl.body : defaultBody;
    if (!subject || !body) return;

    const vars: Record<string, string> = {
      customer_name: opts.customerName ?? "",
      order_id: opts.orderId ?? "",
      order_total: String(opts.orderTotal ?? ""),
      store_name: "MagnifiScent",
      ...(opts.variables ?? {}),
    };

    const to = isAdminAlert ? config.smtp.fromEmail : (opts.customerEmail ?? config.smtp.fromEmail);

    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port ?? 587,
      secure: config.smtp.secure ?? false,
      auth: { user: config.smtp.username, pass: config.smtp.password },
    });

    await transporter.sendMail({
      from: `"${config.smtp.fromName}" <${config.smtp.fromEmail}>`,
      replyTo: config.smtp.replyTo || undefined,
      to,
      subject: replacePlaceholders(subject, vars),
      html: replacePlaceholders(body, vars),
    });
  } catch {
    // silent — email failure must never break order creation
  }
}
