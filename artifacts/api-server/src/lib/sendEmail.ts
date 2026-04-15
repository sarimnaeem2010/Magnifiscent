import nodemailer from "nodemailer";
import { readConfig } from "../routes/emailConfig.js";

function replacePlaceholders(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

const SERVER_DEFAULT_SUBJECTS: Record<string, string> = {
  order_confirmation: "Your MagnifiScent Order is Confirmed! 🌸",
  order_shipped: "Your MagnifiScent Order is On Its Way! 🚚",
  order_delivered: "Your MagnifiScent Order Has Arrived! ✨",
  new_order_alert: "New Order — {{order_id}}",
};

const emailBase = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>MagnifiScent</title>
</head>
<body style="margin:0;padding:0;background:#f5f1eb;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f1eb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1008 0%,#3d2314 60%,#1a1008 100%);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
              <p style="margin:0 0 6px 0;font-size:11px;letter-spacing:4px;color:#c9a96e;text-transform:uppercase;font-weight:600;">✦ Premium Fragrances ✦</p>
              <h1 style="margin:0;font-size:34px;color:#f5e6c8;letter-spacing:3px;font-weight:300;font-family:Georgia,'Times New Roman',serif;">MagnifiScent</h1>
              <p style="margin:8px 0 0 0;font-size:12px;color:#9d7a52;letter-spacing:1px;">magnifiscent.com.pk</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background:#ffffff;padding:0;">
              ${content}
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="background:#ffffff;padding:0 40px;">
              <div style="border-top:1px solid #f0ebe3;"></div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#ffffff;border-radius:0 0 16px 16px;padding:28px 40px 36px;text-align:center;">
              <p style="margin:0 0 6px 0;font-size:13px;color:#9d7a52;font-style:italic;">Crafted with passion, delivered with care.</p>
              <p style="margin:0 0 16px 0;font-size:12px;color:#bdb0a0;">
                Questions? Email us at
                <a href="mailto:info@magnifiscent.com.pk" style="color:#c9a96e;text-decoration:none;">info@magnifiscent.com.pk</a>
              </p>
              <p style="margin:0;font-size:11px;color:#ccc5bb;">
                © {{year}} MagnifiScent · Pakistan's Premium Fragrance Store
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const SERVER_DEFAULT_BODIES: Record<string, string> = {
  order_confirmation: emailBase(`
    <!-- HERO -->
    <div style="background:linear-gradient(180deg,#fdf8f2 0%,#fff 100%);padding:40px 40px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">🌸</div>
      <h2 style="margin:0 0 8px;font-size:26px;color:#1a1008;font-family:Georgia,'Times New Roman',serif;font-weight:400;">Order Confirmed!</h2>
      <p style="margin:0;font-size:15px;color:#7d6a55;">Thank you for choosing MagnifiScent.</p>
    </div>

    <!-- ORDER CARD -->
    <div style="padding:0 40px 32px;">
      <div style="background:#fdf8f2;border:1px solid #ede5d8;border-radius:12px;padding:24px;">
        <p style="margin:0 0 16px;font-size:14px;color:#9d7a52;letter-spacing:1px;text-transform:uppercase;font-weight:600;">Order Details</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:13px;color:#7d6a55;padding:6px 0;">Order ID</td>
            <td style="font-size:13px;color:#1a1008;font-weight:700;text-align:right;font-family:monospace;">{{order_id}}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#7d6a55;padding:6px 0;">Order Total</td>
            <td style="font-size:15px;color:#3d2314;font-weight:700;text-align:right;">Rs. {{order_total}}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- MESSAGE -->
    <div style="padding:0 40px 32px;">
      <p style="margin:0 0 12px;font-size:15px;color:#3d2314;line-height:1.7;">
        Dear <strong>{{customer_name}}</strong>,
      </p>
      <p style="margin:0 0 12px;font-size:15px;color:#7d6a55;line-height:1.7;">
        Your order has been received and is now being carefully prepared. Our team will dispatch your fragrance within <strong style="color:#3d2314;">1–2 business days</strong>.
      </p>
      <p style="margin:0;font-size:15px;color:#7d6a55;line-height:1.7;">
        We know you'll love every scent. 🕯️
      </p>
    </div>

    <!-- CTA -->
    <div style="padding:0 40px 40px;text-align:center;">
      <a href="https://magnifiscent.com.pk" style="display:inline-block;background:linear-gradient(135deg,#3d2314,#1a1008);color:#f5e6c8;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:1px;padding:14px 36px;border-radius:8px;">
        Shop More Fragrances
      </a>
    </div>
  `),

  order_shipped: emailBase(`
    <!-- HERO -->
    <div style="background:linear-gradient(180deg,#f0f5ff 0%,#fff 100%);padding:40px 40px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">🚚</div>
      <h2 style="margin:0 0 8px;font-size:26px;color:#1a1008;font-family:Georgia,'Times New Roman',serif;font-weight:400;">Your Order Is On Its Way!</h2>
      <p style="margin:0;font-size:15px;color:#7d6a55;">Get ready to experience the magic of MagnifiScent.</p>
    </div>

    <!-- ORDER CARD -->
    <div style="padding:0 40px 32px;">
      <div style="background:#fdf8f2;border:1px solid #ede5d8;border-radius:12px;padding:24px;">
        <p style="margin:0 0 16px;font-size:14px;color:#9d7a52;letter-spacing:1px;text-transform:uppercase;font-weight:600;">Shipment Details</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:13px;color:#7d6a55;padding:6px 0;">Order ID</td>
            <td style="font-size:13px;color:#1a1008;font-weight:700;text-align:right;font-family:monospace;">{{order_id}}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#7d6a55;padding:6px 0;">Order Total</td>
            <td style="font-size:15px;color:#3d2314;font-weight:700;text-align:right;">Rs. {{order_total}}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#7d6a55;padding:6px 0;">Estimated Delivery</td>
            <td style="font-size:13px;color:#3d2314;font-weight:600;text-align:right;">3–5 Business Days</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- MESSAGE -->
    <div style="padding:0 40px 32px;">
      <p style="margin:0 0 12px;font-size:15px;color:#3d2314;line-height:1.7;">
        Dear <strong>{{customer_name}}</strong>,
      </p>
      <p style="margin:0;font-size:15px;color:#7d6a55;line-height:1.7;">
        Great news! Your MagnifiScent order is now on its way to you. Sit back, relax, and anticipate the arrival of your exquisite fragrance.
      </p>
    </div>

    <!-- CTA -->
    <div style="padding:0 40px 40px;text-align:center;">
      <a href="https://magnifiscent.com.pk" style="display:inline-block;background:linear-gradient(135deg,#3d2314,#1a1008);color:#f5e6c8;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:1px;padding:14px 36px;border-radius:8px;">
        Explore More
      </a>
    </div>
  `),

  order_delivered: emailBase(`
    <!-- HERO -->
    <div style="background:linear-gradient(180deg,#f0fff5 0%,#fff 100%);padding:40px 40px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">✨</div>
      <h2 style="margin:0 0 8px;font-size:26px;color:#1a1008;font-family:Georgia,'Times New Roman',serif;font-weight:400;">Your Order Has Arrived!</h2>
      <p style="margin:0;font-size:15px;color:#7d6a55;">We hope you love your new fragrance.</p>
    </div>

    <!-- ORDER CARD -->
    <div style="padding:0 40px 32px;">
      <div style="background:#fdf8f2;border:1px solid #ede5d8;border-radius:12px;padding:24px;">
        <p style="margin:0 0 16px;font-size:14px;color:#9d7a52;letter-spacing:1px;text-transform:uppercase;font-weight:600;">Order Details</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:13px;color:#7d6a55;padding:6px 0;">Order ID</td>
            <td style="font-size:13px;color:#1a1008;font-weight:700;text-align:right;font-family:monospace;">{{order_id}}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#7d6a55;padding:6px 0;">Order Total</td>
            <td style="font-size:15px;color:#3d2314;font-weight:700;text-align:right;">Rs. {{order_total}}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- MESSAGE -->
    <div style="padding:0 40px 32px;">
      <p style="margin:0 0 12px;font-size:15px;color:#3d2314;line-height:1.7;">
        Dear <strong>{{customer_name}}</strong>,
      </p>
      <p style="margin:0 0 12px;font-size:15px;color:#7d6a55;line-height:1.7;">
        Your MagnifiScent order has been delivered! We hope every spray brings you joy, confidence, and an unforgettable impression. 🌺
      </p>
      <p style="margin:0;font-size:15px;color:#7d6a55;line-height:1.7;">
        Loved your fragrance? Share your experience with us — we'd love to hear from you.
      </p>
    </div>

    <!-- REVIEW CTA -->
    <div style="padding:0 40px 40px;text-align:center;">
      <a href="https://magnifiscent.com.pk" style="display:inline-block;background:linear-gradient(135deg,#c9a96e,#9d7a52);color:#fff;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:1px;padding:14px 36px;border-radius:8px;margin-right:8px;">
        Shop Again
      </a>
    </div>
  `),

  new_order_alert: emailBase(`
    <!-- HEADER BADGE -->
    <div style="padding:36px 40px 28px;text-align:center;">
      <div style="display:inline-block;background:#fdf3e3;border:1px solid #f0d9a0;border-radius:50px;padding:8px 20px;margin-bottom:20px;">
        <span style="font-size:12px;font-weight:700;color:#c9a96e;letter-spacing:2px;text-transform:uppercase;">🛍️ New Order Alert</span>
      </div>
      <h2 style="margin:0 0 6px;font-size:24px;color:#1a1008;font-family:Georgia,'Times New Roman',serif;font-weight:400;">You Have a New Order!</h2>
      <p style="margin:0;font-size:14px;color:#9d7a52;">A customer just placed an order on MagnifiScent.</p>
    </div>

    <!-- ORDER CARD -->
    <div style="padding:0 40px 32px;">
      <div style="background:#fdf8f2;border:2px solid #c9a96e;border-radius:12px;padding:28px;">
        <p style="margin:0 0 18px;font-size:13px;color:#9d7a52;letter-spacing:1px;text-transform:uppercase;font-weight:700;">Order Summary</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:13px;color:#7d6a55;padding:8px 0;border-bottom:1px solid #ede5d8;">Customer</td>
            <td style="font-size:14px;color:#1a1008;font-weight:700;text-align:right;padding:8px 0;border-bottom:1px solid #ede5d8;">{{customer_name}}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#7d6a55;padding:8px 0;border-bottom:1px solid #ede5d8;">Order ID</td>
            <td style="font-size:13px;color:#1a1008;font-weight:700;text-align:right;padding:8px 0;border-bottom:1px solid #ede5d8;font-family:monospace;">{{order_id}}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#7d6a55;padding:10px 0 0;">Order Total</td>
            <td style="font-size:20px;color:#3d2314;font-weight:800;text-align:right;padding:10px 0 0;">Rs. {{order_total}}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- CTA -->
    <div style="padding:0 40px 40px;text-align:center;">
      <a href="https://magnifiscent.com.pk/admin/orders" style="display:inline-block;background:linear-gradient(135deg,#3d2314,#1a1008);color:#f5e6c8;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:1px;padding:14px 36px;border-radius:8px;">
        View in Admin Dashboard
      </a>
    </div>
  `),
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
      year: String(new Date().getFullYear()),
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
