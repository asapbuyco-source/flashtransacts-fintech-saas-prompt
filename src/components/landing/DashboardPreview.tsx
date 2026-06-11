import { motion } from "framer-motion";
import {
  Activity,
  Calendar,
  Clock,
  Database,
  MailCheck,
  MessageCircle,
  Send,
  Settings,
  Shield,
} from "lucide-react";

const builderFields = [
  { label: "Layout", value: "Coinbase" },
  { label: "Message", value: "Deposit Notice" },
  { label: "Amount", value: "1,250.00 USD" },
  { label: "Recipient", value: "client@email.com" },
];

const adminQueue = [
  { name: "Monthly plan", value: "60,000 CFA", status: "WhatsApp request" },
  { name: "Lifetime plan", value: "1,500,000 CFA", status: "Admin approval" },
  { name: "Trial access", value: "7 days", status: "Auto-created" },
];

const deliveryEvents = [
  { label: "Email rendered", status: "Inline styles applied", icon: MailCheck },
  { label: "Rate limit checked", status: "Free plan protected", icon: Clock },
  { label: "Firestore synced", status: "Logs saved", icon: Database },
];

export default function DashboardPreview() {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-3xl"
        >
          <span className="mb-4 block text-sm font-medium uppercase tracking-widest text-gold">Application Preview</span>
          <h2 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            One dashboard for templates, delivery, subscriptions, and logs.
          </h2>
          <p className="mt-4 max-w-2xl text-text-secondary">
            The workspace keeps the full operation in view: build the message, choose the currency, send from the configured provider, and review every attempt from Firestore-backed records.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75 }}
          className="premium-panel overflow-hidden shadow-2xl shadow-black/40"
        >
          <div className="flex flex-col border-b border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(212,175,55,0.05))] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold text-bg-primary">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">FlashTransacts Workspace</h3>
                <p className="text-xs text-text-muted">Production-ready notification operations</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 px-3 py-2 text-xs text-success sm:mt-0">
              <Shield className="h-3.5 w-3.5" />
              Verified domain sender
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[240px_1fr]">
            <aside className="border-b border-white/10 bg-black/20 p-4 lg:border-b-0 lg:border-r">
              <div className="space-y-2">
                {[
                  ["Notifications", Send],
                  ["Templates", MailCheck],
                  ["Email Logs", Activity],
                  ["Admin Settings", Settings],
                ].map(([label, Icon], index) => (
                  <div
                    key={label as string}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                      index === 0 ? "bg-gold text-bg-primary" : "text-text-secondary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label as string}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="mb-2 flex items-center gap-2 text-xs text-text-muted">
                  <MessageCircle className="h-3.5 w-3.5 text-gold" />
                  Manual subscription
                </div>
                <p className="text-xs leading-5 text-text-secondary">
                  Users choose a plan, contact admin on WhatsApp, and get activated from the admin panel.
                </p>
              </div>
            </aside>

            <div className="grid gap-5 p-4 md:p-6 xl:grid-cols-[1fr_360px]">
              <div className="space-y-5">
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-semibold">Notification Builder</h4>
                      <p className="text-xs text-text-muted">All editable fields update the email preview instantly.</p>
                    </div>
                    <button className="btn-gold inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs">
                      <Send className="h-3.5 w-3.5" />
                      Send
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {builderFields.map((field) => (
                      <div key={field.label}>
                        <div className="mb-1 text-[11px] uppercase text-text-muted">{field.label}</div>
                        <div className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white">{field.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {["CFA", "USD", "EUR"].map((currency, index) => (
                      <div
                        key={currency}
                        className={`rounded-lg border px-3 py-2 text-center text-sm ${
                          index === 1
                            ? "border-gold/40 bg-gold/10 text-gold"
                            : "border-white/10 bg-black/25 text-text-secondary"
                        }`}
                      >
                        {currency}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {deliveryEvents.map((event) => (
                    <div key={event.label} className="rounded-lg border border-white/10 bg-[#0d1118] p-4">
                      <event.icon className="mb-3 h-5 w-5 text-gold" />
                      <div className="text-sm font-semibold">{event.label}</div>
                      <div className="mt-1 text-xs text-text-muted">{event.status}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-lg border border-white/10 bg-[#f8fafc] p-4 text-[#101828]">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold">Email Preview</h4>
                      <p className="text-xs text-[#667085]">Responsive receipt layout</p>
                    </div>
                    <span className="rounded-md bg-[#e7f0ff] px-2 py-1 text-[11px] font-semibold text-[#0052ff]">USD</span>
                  </div>
                  <div className="rounded-lg border border-[#d9e0ea] bg-white p-4">
                    <div className="mb-4 flex items-center justify-between border-b border-[#e4e7ec] pb-3">
                      <span className="text-sm font-bold">Payment Received</span>
                      <span className="h-2.5 w-2.5 rounded-full bg-success" />
                    </div>
                    <div className="text-[11px] uppercase text-[#667085]">Amount</div>
                    <div className="mt-1 text-2xl font-bold">1,250.00 USD</div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-md bg-[#f2f4f7] p-2">
                        <div className="text-[10px] text-[#667085]">ID</div>
                        <div className="text-xs font-semibold">FT-829401</div>
                      </div>
                      <div className="rounded-md bg-[#f2f4f7] p-2">
                        <div className="text-[10px] text-[#667085]">Status</div>
                        <div className="text-xs font-semibold">Delivered</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Admin Queue</h4>
                    <Calendar className="h-4 w-4 text-gold" />
                  </div>
                  <div className="space-y-3">
                    {adminQueue.map((item) => (
                      <div key={item.name} className="rounded-lg border border-white/10 bg-black/25 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm">{item.name}</span>
                          <span className="text-xs text-gold">{item.value}</span>
                        </div>
                        <div className="mt-1 text-xs text-text-muted">{item.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
