import React, { useState } from "react";
import {
  Check, Eye, EyeOff, Send, RefreshCw, Trash2, Mail,
  Server, FileText, Clock, Bell,
} from "lucide-react";
import {
  getEmailSettings, saveEmailSettings, type EmailSettings,
  getEmailTemplates, saveEmailTemplates, type EmailTemplates, type EmailTemplateKey,
  getEmailLog, addEmailLog, type EmailLogEntry,
  getEmailToggles, saveEmailToggles, type EmailToggles,
} from "@/data/liveData";

const TEMPLATE_LABELS: Record<EmailTemplateKey, string> = {
  order_confirmation: "Order Confirmation",
  contact_reply: "Contact Form Reply",
  shipping_update: "Shipping Update",
};

const TEMPLATE_VARS: Record<EmailTemplateKey, string[]> = {
  order_confirmation: ["{{firstName}}", "{{orderId}}", "{{total}}", "{{paymentMethod}}", "{{address}}", "{{carrier}}"],
  contact_reply: ["{{firstName}}", "{{email}}", "{{message}}"],
  shipping_update: ["{{firstName}}", "{{orderId}}", "{{carrier}}", "{{trackingNumber}}"],
};

type ToggleInfo = {
  key: keyof EmailToggles;
  label: string;
  description: string;
  recipient: "customer" | "admin";
};

const TOGGLE_LIST: ToggleInfo[] = [
  { key: "order_confirmation", label: "Order Confirmation", description: "Sent to the customer immediately after a successful order is placed.", recipient: "customer" },
  { key: "order_shipped", label: "Order Shipped", description: "Sent to the customer when their order has been dispatched.", recipient: "customer" },
  { key: "order_delivered", label: "Order Delivered", description: "Sent to the customer once delivery is confirmed.", recipient: "customer" },
  { key: "abandoned_cart", label: "Abandoned Cart Reminder", description: "Reminder sent to customers who left items in their cart.", recipient: "customer" },
  { key: "welcome_email", label: "Welcome Email", description: "Sent to the customer on their very first order.", recipient: "customer" },
  { key: "new_order_alert", label: "New Order Alert", description: "Alerts the store admin whenever a new order is placed.", recipient: "admin" },
  { key: "low_stock_alert", label: "Low Stock Alert", description: "Alerts the store admin when a product's stock falls below the threshold.", recipient: "admin" },
];

function Field({
  label, value, onChange, type = "text", placeholder = "", hint,
}: {
  label: string; value: string | number; onChange: (v: string) => void;
  type?: string; placeholder?: string; hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function ToggleSwitch({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-none cursor-pointer flex-shrink-0"
      style={{ background: enabled ? "#111827" : "#d1d5db" }}
    >
      <span
        className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
        style={{ transform: enabled ? "translateX(24px)" : "translateX(3px)" }}
      />
    </button>
  );
}

function StatusBadge({ status }: { status: EmailLogEntry["status"] }) {
  const styles: Record<string, string> = {
    sent: "bg-green-50 text-green-700 border-green-200",
    failed: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full border ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

type Tab = "smtp" | "notifications" | "templates" | "log";

export function AdminEmail() {
  const [activeTab, setActiveTab] = useState<Tab>("smtp");

  // SMTP state
  const [smtp, setSmtp] = useState<EmailSettings>(() => getEmailSettings());
  const [smtpSaved, setSmtpSaved] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testStatus, setTestStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [testError, setTestError] = useState("");

  // Notifications toggles state
  const [toggles, setToggles] = useState<EmailToggles>(() => getEmailToggles());
  const [togglesSaved, setTogglesSaved] = useState(false);

  // Templates state
  const [templates, setTemplates] = useState<EmailTemplates>(() => getEmailTemplates());
  const [templatesSaved, setTemplatesSaved] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<EmailTemplateKey>("order_confirmation");
  const [showPreview, setShowPreview] = useState(false);

  // Log state
  const [emailLog, setEmailLog] = useState<EmailLogEntry[]>(() => getEmailLog());

  const updateSmtp = (field: keyof EmailSettings) => (val: string | boolean | number) => {
    setSmtp((s) => ({ ...s, [field]: val }));
  };

  const handleSaveSmtp = () => {
    saveEmailSettings(smtp);
    setSmtpSaved(true);
    setTimeout(() => setSmtpSaved(false), 2500);
  };

  const handleToggleNotification = (key: keyof EmailToggles) => {
    setToggles((t) => ({ ...t, [key]: !t[key] }));
  };

  const handleSaveToggles = () => {
    saveEmailToggles(toggles);
    setTogglesSaved(true);
    setTimeout(() => setTogglesSaved(false), 2500);
  };

  const updateTemplate = (field: "subject" | "body", val: string) => {
    setTemplates((t) => ({
      ...t,
      [activeTemplate]: { ...t[activeTemplate], [field]: val },
    }));
  };

  const handleSaveTemplates = () => {
    saveEmailTemplates(templates);
    setTemplatesSaved(true);
    setTimeout(() => setTemplatesSaved(false), 2500);
  };

  const handleSendTestEmail = async () => {
    if (!testEmail.trim()) return;
    if (!smtp.apiUrl.trim()) {
      const log: EmailLogEntry = {
        id: Date.now().toString(),
        to: testEmail,
        subject: "MagnifiScent Test Email",
        status: "pending",
        date: new Date().toISOString(),
        message: "API URL not configured. Configure the API URL in SMTP settings to enable real sending.",
      };
      addEmailLog(log);
      setEmailLog(getEmailLog());
      setTestStatus("error");
      setTestError("API URL not configured. Please add your API server URL in the SMTP settings.");
      setTimeout(() => setTestStatus("idle"), 4000);
      return;
    }
    setTestStatus("sending");
    try {
      const res = await fetch(`${smtp.apiUrl.replace(/\/$/, "")}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          smtp: { host: smtp.host, port: smtp.port, secure: smtp.secure, auth: { user: smtp.username, pass: smtp.password } },
          from: `"${smtp.fromName}" <${smtp.fromEmail}>`,
          replyTo: smtp.replyTo,
          to: testEmail,
          subject: "MagnifiScent — Test Email",
          html: `<h2>Test Email</h2><p>Your SMTP settings are working correctly!</p><p><em>— MagnifiScent Admin Panel</em></p>`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        addEmailLog({ to: testEmail, subject: "MagnifiScent — Test Email", status: "sent", date: new Date().toISOString(), message: `Message ID: ${data.messageId ?? "n/a"}` });
        setTestStatus("ok");
      } else {
        addEmailLog({ to: testEmail, subject: "MagnifiScent — Test Email", status: "failed", date: new Date().toISOString(), message: data.error ?? "Unknown error" });
        setTestStatus("error");
        setTestError(data.error ?? "Failed to send.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      addEmailLog({ to: testEmail, subject: "MagnifiScent — Test Email", status: "failed", date: new Date().toISOString(), message: msg });
      setTestStatus("error");
      setTestError(msg);
    }
    setEmailLog(getEmailLog());
    setTimeout(() => setTestStatus("idle"), 4000);
  };

  const clearLog = () => {
    localStorage.removeItem("admin_email_log");
    setEmailLog([]);
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "smtp", label: "SMTP Config", icon: <Server size={14} /> },
    { key: "notifications", label: "Notifications", icon: <Bell size={14} /> },
    { key: "templates", label: "Templates", icon: <FileText size={14} /> },
    { key: "log", label: "Email Log", icon: <Clock size={14} /> },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Email & SMTP</h1>
        <p className="text-sm text-gray-500 mt-1">Configure outgoing mail settings, toggle notifications, edit templates, and review send history.</p>
      </div>

      {/* Tab bar */}
      <div className="flex border border-gray-200 rounded-xl overflow-hidden">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold transition-colors border-none cursor-pointer"
            style={{
              background: activeTab === t.key ? "#111827" : "#f9fafb",
              color: activeTab === t.key ? "#fff" : "#6b7280",
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* SMTP Tab */}
      {activeTab === "smtp" && (
        <div className="space-y-5">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
            <Mail size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800">How email sending works</p>
              <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                Enter your SMTP credentials and your backend API URL. The admin panel calls the API server to send emails via nodemailer. Common providers: Gmail (smtp.gmail.com:587), Mailgun, SendGrid, AWS SES.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100">SMTP Server</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="SMTP Host" value={smtp.host} onChange={updateSmtp("host")} placeholder="smtp.gmail.com" />
              <Field label="Port" value={smtp.port} onChange={(v) => updateSmtp("port")(parseInt(v) || 587)} type="number" placeholder="587" />
            </div>
            <div className="flex items-center gap-3">
              <ToggleSwitch enabled={smtp.secure} onToggle={() => updateSmtp("secure")(!smtp.secure)} />
              <div>
                <p className="text-sm font-medium text-gray-700">Use SSL/TLS</p>
                <p className="text-xs text-gray-400">Enable for port 465. Leave off for port 587 with STARTTLS.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100">Authentication</h2>
            <Field label="Username / Email" value={smtp.username} onChange={updateSmtp("username")} placeholder="hello@magnifiscent.com" type="email" />
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password / App Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 pr-10"
                  value={smtp.password}
                  onChange={(e) => updateSmtp("password")(e.target.value)}
                  placeholder="App password or SMTP password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">For Gmail, use an App Password from your Google Account security settings.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100">Sender Identity</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="From Name" value={smtp.fromName} onChange={updateSmtp("fromName")} placeholder="MagnifiScent" />
              <Field label="From Email" value={smtp.fromEmail} onChange={updateSmtp("fromEmail")} placeholder="hello@magnifiscent.com" type="email" />
            </div>
            <Field label="Reply-To Email" value={smtp.replyTo} onChange={updateSmtp("replyTo")} placeholder="support@magnifiscent.com" type="email" />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100">API Integration</h2>
            <Field
              label="Backend API Base URL"
              value={smtp.apiUrl}
              onChange={updateSmtp("apiUrl")}
              placeholder="https://your-api-server.replit.app"
              hint="Your Express/nodemailer API server URL. Used to send emails via POST /api/send-email."
            />
          </div>

          <button
            onClick={handleSaveSmtp}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-lg border-none cursor-pointer transition-colors"
            style={{ background: smtpSaved ? "#10b981" : "#111827" }}
          >
            {smtpSaved ? <><Check size={14} />Saved!</> : "Save SMTP Settings"}
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100">Send Test Email</h2>
            <p className="text-xs text-gray-500">Send a test email to verify your SMTP settings are working correctly.</p>
            <div className="flex gap-3">
              <input
                type="email"
                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="recipient@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSendTestEmail(); }}
              />
              <button
                onClick={handleSendTestEmail}
                disabled={testStatus === "sending"}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-lg border-none cursor-pointer transition-colors disabled:opacity-60"
                style={{
                  background: testStatus === "ok" ? "#10b981" : testStatus === "error" ? "#ef4444" : "#111827",
                }}
              >
                {testStatus === "sending" ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                {testStatus === "idle" ? "Send Test" : testStatus === "sending" ? "Sending…" : testStatus === "ok" ? "Sent!" : "Failed"}
              </button>
            </div>
            {testStatus === "error" && testError && (
              <p className="text-xs text-red-500">{testError}</p>
            )}
            {testStatus === "ok" && (
              <p className="text-xs text-green-600">Test email sent successfully! Check your inbox.</p>
            )}
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700">Email Notification Types</h2>
              <p className="text-xs text-gray-400 mt-1">Enable or disable each type of automated email. Changes take effect immediately after saving.</p>
            </div>

            {/* Customer emails */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Emails</p>
            </div>
            <div className="divide-y divide-gray-50">
              {TOGGLE_LIST.filter((t) => t.recipient === "customer").map((item) => (
                <div key={item.key} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                  </div>
                  <ToggleSwitch enabled={toggles[item.key]} onToggle={() => handleToggleNotification(item.key)} />
                </div>
              ))}
            </div>

            {/* Admin emails */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Admin Alerts</p>
            </div>
            <div className="divide-y divide-gray-50">
              {TOGGLE_LIST.filter((t) => t.recipient === "admin").map((item) => (
                <div key={item.key} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                  </div>
                  <ToggleSwitch enabled={toggles[item.key]} onToggle={() => handleToggleNotification(item.key)} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSaveToggles}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-lg border-none cursor-pointer transition-colors"
            style={{ background: togglesSaved ? "#10b981" : "#111827" }}
          >
            {togglesSaved ? <><Check size={14} />Saved!</> : "Save Notification Settings"}
          </button>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              {(Object.keys(TEMPLATE_LABELS) as EmailTemplateKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => { setActiveTemplate(key); setShowPreview(false); }}
                  className="flex-1 px-4 py-3 text-xs font-semibold transition-colors border-none cursor-pointer"
                  style={{
                    background: activeTemplate === key ? "#f9fafb" : "#fff",
                    color: activeTemplate === key ? "#111827" : "#9ca3af",
                    borderBottom: activeTemplate === key ? "2px solid #111827" : "2px solid transparent",
                  }}
                >
                  {TEMPLATE_LABELS[key]}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-4">
              <Field
                label="Email Subject"
                value={templates[activeTemplate].subject}
                onChange={(v) => updateTemplate("subject", v)}
                placeholder="Email subject line"
              />

              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs text-gray-400 font-semibold mr-1">Variables:</span>
                {TEMPLATE_VARS[activeTemplate].map((v) => (
                  <span key={v} className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded cursor-default">{v}</span>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">HTML Body</label>
                  <button
                    onClick={() => setShowPreview((p) => !p)}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 bg-transparent border-none cursor-pointer"
                  >
                    <Eye size={12} /> {showPreview ? "Edit" : "Preview"}
                  </button>
                </div>

                {showPreview ? (
                  <div
                    className="border border-gray-200 rounded-lg p-4 bg-white min-h-48 text-sm"
                    dangerouslySetInnerHTML={{ __html: templates[activeTemplate].body }}
                  />
                ) : (
                  <textarea
                    rows={14}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900 resize-y"
                    value={templates[activeTemplate].body}
                    onChange={(e) => updateTemplate("body", e.target.value)}
                    placeholder="Write your HTML email body here…"
                  />
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveTemplates}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-lg border-none cursor-pointer transition-colors"
            style={{ background: templatesSaved ? "#10b981" : "#111827" }}
          >
            {templatesSaved ? <><Check size={14} />Saved!</> : "Save Templates"}
          </button>
        </div>
      )}

      {/* Log Tab */}
      {activeTab === "log" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Last 50 email send attempts, newest first.</p>
            {emailLog.length > 0 && (
              <button
                onClick={clearLog}
                className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer"
              >
                <Trash2 size={12} /> Clear Log
              </button>
            )}
          </div>

          {emailLog.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Mail size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No emails sent yet.</p>
              <p className="text-xs text-gray-300 mt-1">Send a test email from the SMTP tab to see it here.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Recipient</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {emailLog.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-800 font-medium text-xs">{entry.to}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs max-w-xs truncate">{entry.subject}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                        {new Date(entry.date).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={entry.status} />
                        {entry.message && (
                          <p className="text-[10px] text-gray-400 mt-0.5 max-w-xs truncate">{entry.message}</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
