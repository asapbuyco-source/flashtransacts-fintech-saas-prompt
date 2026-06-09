import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Send,
  Eye,
  Copy,
  Archive,
  X,
  MessageCircle,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { currencies, notificationTypes, modules } from "@/lib/data";
import { buildWhatsAppUrl, isSubscriptionActive } from "@/lib/subscription";
import { useAuthStore } from "@/store/authStore";
import EmailPreview from "@/components/EmailPreview";
import type { Notification } from "@/store/appStore";
import { sendNotificationEmail } from "@/lib/emailDelivery";
import { getEmailSubject, getTemplateDefaults, getTemplateFields } from "@/lib/emailTemplates";

type NotificationForm = {
  recipientName: string;
  recipientEmail: string;
  amount: string;
  currency: string;
  reference: string;
  description: string;
  transactionId: string;
  notes: string;
  type: string;
  brand: string;
  metadata: Record<string, string>;
};

const createInitialForm = (brand = "PayPal"): NotificationForm => {
  const defaults = getTemplateDefaults(brand);

  return {
    recipientName: "",
    recipientEmail: "",
    amount: "",
    currency: defaults.currency || "XAF",
    reference: "",
    description: "",
    transactionId: "",
    notes: "",
    type: "Deposit Notice",
    brand,
    metadata: defaults,
  };
};

const normalizeAmountInput = (input: string) => input.replace(/,/g, "").trim();

const formatAmountWithCurrency = (input: string, currency: string) => {
  const trimmed = input.trim();
  const selectedCurrency = currency || "XAF";

  if (!trimmed) {
    return `0 ${selectedCurrency}`;
  }

  const currencyPattern = /\b[A-Z]{3}\b|[$€£¥₦₵]/;
  if (currencyPattern.test(trimmed)) {
    return trimmed;
  }

  const numericValue = Number(normalizeAmountInput(trimmed));
  if (!Number.isFinite(numericValue)) {
    return `${trimmed} ${selectedCurrency}`;
  }

  return `${numericValue.toLocaleString()} ${selectedCurrency}`;
};

export default function Notifications() {
  const {
    notifications,
    addNotification,
    updateNotification,
    addEmailLog,
    updateEmailLog,
    platformSettings,
    addSubscriptionRequest,
  } = useAppStore();
  const { user } = useAuthStore();
  const [showCreate, setShowCreate] = useState(false);
  const [previewNotification, setPreviewNotification] = useState<Notification | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const subscriptionActive = user?.role === "super_admin" || user?.role === "admin" || isSubscriptionActive(user);

  const [form, setForm] = useState<NotificationForm>(() => createInitialForm());

  const filtered = notifications.filter((n) => {
    const matchesSearch =
      n.recipient.toLowerCase().includes(search.toLowerCase()) ||
      n.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || n.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formattedAmount = formatAmountWithCurrency(form.amount, form.currency);

  const templateFields = getTemplateFields(form.brand);
  const fieldValue = (key: string) => {
    if (key in form && key !== "metadata") {
      return String(form[key as keyof Omit<NotificationForm, "metadata">] || "");
    }

    return form.metadata[key] || "";
  };

  const setFieldValue = (key: string, value: string) => {
    setForm((current) => {
      const updates: Partial<NotificationForm> = {};

      if (key in current && key !== "metadata") {
        (updates as Record<string, string>)[key] = value;
      }

      if (key === "recipientEmail") {
        updates.recipientEmail = value;
      }
      if (key === "recipientName") {
        updates.recipientName = value;
      }
      if (key === "amount") {
        updates.amount = value;
      }
      if (key === "currency") {
        updates.currency = value;
      }
      if (key === "transactionId") {
        updates.transactionId = value;
      }
      if (key === "warningMessage") {
        updates.notes = value;
      }
      if (key === "paymentNote") {
        updates.description = value;
      }

      return {
        ...current,
        ...updates,
        metadata: {
          ...current.metadata,
          [key]: value,
        },
      };
    });
  };

  const changeBrand = (brand: string) => {
    const defaults = getTemplateDefaults(brand);

    setForm((current) => ({
      ...current,
      brand,
      currency: defaults.currency || current.currency || "XAF",
      metadata: {
        ...defaults,
        amount: current.amount,
        currency: defaults.currency || current.currency || "XAF",
        recipientEmail: current.recipientEmail,
        recipientName: current.recipientName,
      },
    }));
  };

  const draftNotification: Notification = {
    id: "preview",
    recipient: form.recipientEmail || "recipient@example.com",
    recipientName: form.recipientName || "Customer",
    amount: formattedAmount,
    currency: form.currency,
    type: form.type,
    status: "draft",
    date: new Date().toISOString().split("T")[0],
    brand: form.brand,
    reference: form.reference || "REF-123456",
    description: form.description,
    transactionId: form.transactionId || "TXN-789012",
    notes: form.notes,
    metadata: {
      ...form.metadata,
      amount: formattedAmount,
      currency: form.currency,
      recipientEmail: form.recipientEmail || form.metadata.recipientEmail,
      recipientName: form.recipientName || form.metadata.recipientName,
      transactionId: form.transactionId || form.metadata.transactionId,
    },
  };

  const requestSubscription = () => {
    if (!user) {
      return;
    }

    addSubscriptionRequest({
      id: `subreq-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      plan: "Manual activation",
      price: `Contact admin (${platformSettings.currencyLabel})`,
      status: "open",
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 19),
    });
  };

  const markSendFailure = (notificationId: string, logId: string, error: unknown) => {
    const message = error instanceof Error ? error.message : "Email delivery failed. Please check your sender configuration.";
    updateNotification(notificationId, { status: "failed" });
    updateEmailLog(logId, { status: "failed" });
    setSendError(message);
  };

  const handleCreate = async () => {
    if (!subscriptionActive) {
      return;
    }

    setIsSending(true);
    setSendError("");

    const newNotification = {
      id: `notif-${Date.now()}`,
      recipient: form.recipientEmail,
      recipientName: form.recipientName,
      amount: formattedAmount,
      currency: form.currency,
      type: form.type,
      status: "pending" as const,
      date: new Date().toISOString().split("T")[0],
      brand: form.brand,
      reference: form.reference,
      description: form.description,
      transactionId: form.transactionId,
      notes: form.notes,
      createdBy: user?.id || "",
      metadata: {
        ...form.metadata,
        amount: formattedAmount,
        currency: form.currency,
        recipientEmail: form.recipientEmail,
        recipientName: form.recipientName,
        transactionId: form.transactionId,
      },
    };
    const logId = `log-${Date.now()}`;

    addNotification(newNotification);
    addEmailLog({
      id: logId,
      recipient: form.recipientEmail,
      subject: getEmailSubject(newNotification),
      status: "pending",
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      opened: false,
      clicked: false,
      notificationId: newNotification.id,
      brand: form.brand,
      amount: formattedAmount,
      createdBy: user?.id || "",
      metadata: newNotification.metadata,
    });

    try {
      await sendNotificationEmail(newNotification);
      updateNotification(newNotification.id, { status: "delivered" });
      updateEmailLog(logId, { status: "delivered" });
      setShowCreate(false);
      setForm(createInitialForm(form.brand));
    } catch (error) {
      markSendFailure(newNotification.id, logId, error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSend = async (notification: Notification) => {
    if (!subscriptionActive) {
      requestSubscription();
      return;
    }

    setIsSending(true);
    setSendError("");
    updateNotification(notification.id, { status: "pending" });
    const logId = `log-${Date.now()}`;
    addEmailLog({
      id: logId,
      recipient: notification.recipient,
      subject: getEmailSubject(notification),
      status: "pending",
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      opened: false,
      clicked: false,
      notificationId: notification.id,
      brand: notification.brand,
      amount: notification.amount,
      createdBy: user?.id || "",
      metadata: notification.metadata,
    });

    try {
      await sendNotificationEmail(notification);
      updateNotification(notification.id, { status: "delivered" });
      updateEmailLog(logId, { status: "delivered" });
    } catch (error) {
      markSendFailure(notification.id, logId, error);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = async (notification: Notification) => {
    const copy = {
      ...notification,
      id: `notif-${Date.now()}`,
      status: "draft" as const,
      date: new Date().toISOString().split("T")[0],
    };
    addNotification(copy);
    await navigator.clipboard?.writeText(`${notification.type} for ${notification.recipient}: ${notification.amount}`);
  };

  const handleArchive = (id: string) => {
    updateNotification(id, { status: "draft" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-text-secondary">Create and manage transaction notifications</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-gold w-full justify-center px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Create Notification
        </button>
      </div>

      {!subscriptionActive && (
        <div className="glass-gold rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold mb-1">Manual subscription required</h2>
            <p className="text-sm text-text-secondary">
              Your account is created, but server access is activated by the admin. Contact WhatsApp to enable sending.
            </p>
          </div>
          <a
            href={buildWhatsAppUrl(
              platformSettings.adminWhatsApp,
              `Hello admin, I want to activate my FlashTransacts subscription. My account email is ${user?.email || ""}.`
            )}
            target="_blank"
            rel="noreferrer"
            onClick={requestSubscription}
            className="btn-gold px-4 py-2.5 rounded-lg text-sm inline-flex items-center justify-center gap-2 shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            Contact Admin
          </a>
        </div>
      )}

      {sendError && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {sendError}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-muted" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="delivered">Delivered</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Recipient</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Type</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Brand</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Date</th>
                <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((n) => (
                <tr key={n.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">{n.recipient}</div>
                    <div className="text-xs text-text-muted">{n.recipientName}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">{n.type}</td>
                  <td className="px-4 py-3 text-sm gold-text font-medium">{n.amount}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-white/5">{n.brand}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full capitalize ${
                        n.status === "delivered"
                          ? "status-active"
                          : n.status === "failed"
                          ? "status-suspended"
                          : n.status === "pending"
                          ? "status-pending"
                          : "status-expired"
                      }`}
                    >
                      {n.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{n.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setPreviewNotification(n)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-gold transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSend(n)}
                        disabled={isSending}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-gold transition-colors disabled:opacity-50"
                        title="Send"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => void handleCopy(n)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-gold transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleArchive(n.id)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-danger transition-colors"
                        title="Archive as draft"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            <p>No notifications found</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/85 p-0 sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex h-[100dvh] w-full flex-col overflow-hidden bg-bg-primary border border-white/10 shadow-2xl shadow-black/60 sm:h-auto sm:max-h-[90vh] sm:max-w-6xl sm:rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-bg-secondary px-4 py-4 sm:px-6">
              <h2 className="text-lg font-semibold">Create Notification</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid flex-1 grid-cols-1 gap-5 overflow-y-auto p-4 sm:p-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] lg:gap-6">
              <div className="grid grid-cols-1 content-start gap-4 rounded-xl border border-white/10 bg-bg-secondary p-4 sm:grid-cols-2 sm:p-5">
                <div>
                  <label className="block text-xs font-medium mb-1.5">Brand</label>
                  <select
                    value={form.brand}
                    onChange={(e) => changeBrand(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm"
                  >
                    {modules.map((m) => (
                      <option key={m.name} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">Notification Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg text-sm"
                  >
                    {notificationTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                {templateFields.map((field) => (
                  <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : undefined}>
                    <label className="block text-xs font-medium mb-1.5">{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={fieldValue(field.key)}
                        onChange={(e) => setFieldValue(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        required={field.required}
                        className="w-full px-3 py-2.5 rounded-lg text-sm"
                      />
                    ) : field.type === "select" ? (
                      <select
                        value={fieldValue(field.key)}
                        onChange={(e) => setFieldValue(field.key, e.target.value)}
                        required={field.required}
                        className="w-full px-3 py-2.5 rounded-lg text-sm"
                      >
                        {(field.options || []).map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type || "text"}
                        value={fieldValue(field.key)}
                        onChange={(e) => setFieldValue(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="w-full px-3 py-2.5 rounded-lg text-sm"
                      />
                    )}
                  </div>
                ))}
                {!templateFields.some((field) => field.key === "currency") && (
                  <div>
                    <label className="block text-xs font-medium mb-1.5">Currency</label>
                    <select
                      value={form.currency}
                      onChange={(e) => setFieldValue("currency", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg text-sm"
                    >
                      {currencies.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                )}
                {!templateFields.some((field) => field.key === "transactionId") && (
                  <div>
                    <label className="block text-xs font-medium mb-1.5">Transaction ID</label>
                    <input
                      value={form.transactionId}
                      onChange={(e) => setFieldValue("transactionId", e.target.value)}
                      placeholder="TXN-789012"
                      className="w-full px-3 py-2.5 rounded-lg text-sm"
                    />
                  </div>
                )}
              </div>
              <div className="min-w-0 rounded-xl border border-white/10 bg-bg-secondary p-4 sm:p-5">
                <div className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Live Email Preview</div>
                <div className="overflow-x-auto rounded-lg bg-white p-2 sm:p-3">
                  <div className="min-w-[320px]">
                    <EmailPreview data={draftNotification} compact />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-white/10 bg-bg-secondary p-4 sm:flex-row sm:items-center sm:p-6">
              <button
                onClick={handleCreate}
                disabled={!subscriptionActive || isSending}
                className="btn-gold inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
              >
                <Send className="w-4 h-4" />
                {isSending ? "Sending..." : "Generate & Send"}
              </button>
              <button
                onClick={() => setPreviewNotification(draftNotification)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-6 py-2.5 text-sm transition-colors hover:bg-white/5 sm:w-auto"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              {!subscriptionActive && (
                <a
                  href={buildWhatsAppUrl(
                    platformSettings.adminWhatsApp,
                    `Hello admin, I want to activate my FlashTransacts subscription. My account email is ${user?.email || ""}.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  onClick={requestSubscription}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gold/30 px-4 py-2.5 text-sm text-gold transition-colors hover:bg-gold/10 sm:w-auto"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact Admin
                </a>
              )}
              <button onClick={() => setShowCreate(false)} className="w-full rounded-lg px-6 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-white sm:ml-auto sm:w-auto">
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {previewNotification && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/85 p-0 sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex h-[100dvh] w-full flex-col overflow-hidden bg-bg-primary border border-white/10 shadow-2xl shadow-black/60 sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-bg-secondary p-4 sm:p-5">
              <h2 className="text-lg font-semibold">Email Preview</h2>
              <button onClick={() => setPreviewNotification(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-bg-primary p-4 sm:p-5">
              <div className="overflow-x-auto rounded-lg bg-white p-2 sm:p-3">
                <div className="min-w-[320px]">
                  <EmailPreview data={previewNotification} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
