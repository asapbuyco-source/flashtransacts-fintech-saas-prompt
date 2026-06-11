import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  Coins,
  Gauge,
  Globe2,
  LayoutTemplate,
  Mail,
  Send,
  Shield,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { features } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  Mail,
  BarChart3,
  LayoutTemplate,
  Bell,
  Users,
  Shield,
};

const workflow = [
  {
    icon: LayoutTemplate,
    title: "Pick a payment layout",
    description: "Start from a saved notification design for bank, wallet, crypto, or custom workflows.",
  },
  {
    icon: SlidersHorizontal,
    title: "Edit every field",
    description: "Update recipient details, amount, currency, notes, IDs, and service-specific fields with live preview.",
  },
  {
    icon: Send,
    title: "Send from your domain",
    description: "Use your verified Resend sender, inline email styling, and production rate limits.",
  },
  {
    icon: BarChart3,
    title: "Review the logs",
    description: "Track sent, failed, and manual subscription activity from Firestore-backed admin views.",
  },
];

const operationHighlights = [
  {
    icon: Gauge,
    title: "Know the message before it sends",
    description: "Every amount, currency, receiver, note, and transaction field updates inside the preview before delivery.",
  },
  {
    icon: Globe2,
    title: "Use the sender you configured",
    description: "Run through your verified Resend domain or Gmail SMTP setup, with the visible sender controlled in one place.",
  },
  {
    icon: CheckCircle2,
    title: "Approve access manually",
    description: "Users request plans through WhatsApp and admins activate subscription status from the protected admin section.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-3xl"
        >
          <span className="mb-4 block text-sm font-medium uppercase tracking-widest text-gold">Product Tour</span>
          <h2 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            A complete workspace for payment notification operations.
          </h2>
          <p className="mt-4 max-w-2xl text-text-secondary">
            FlashTransacts now presents the full workflow clearly: design, preview, deliver, log, and manually activate users without a payment API.
          </p>
        </motion.div>

        <div className="premium-panel mb-12 grid overflow-hidden md:grid-cols-3">
          {operationHighlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="border-b border-white/10 p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-teal-400/25 bg-teal-400/10">
                <item.icon className="h-5 w-5 text-teal-300" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-white">{item.title}</h3>
              <p className="text-sm leading-6 text-text-secondary">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mb-12 grid gap-3 lg:grid-cols-4">
          {workflow.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
                className="group premium-panel relative overflow-hidden p-5"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/25 bg-gold/10">
                  <step.icon className="h-5 w-5 text-gold" />
                </div>
                <span className="text-xs text-text-muted">0{index + 1}</span>
              </div>
              <h3 className="mb-2 text-base font-semibold">{step.title}</h3>
              <p className="text-sm leading-6 text-text-secondary">{step.description}</p>
              {index < workflow.length - 1 && (
                <ArrowRight className="absolute right-4 top-6 hidden h-4 w-4 text-gold/40 transition-transform group-hover:translate-x-1 lg:block" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Mail;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="card-hover premium-panel p-5"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                  {index === 0 && (
                    <div className="flex items-center gap-1 rounded-md border border-success/25 bg-success/10 px-2 py-1 text-[11px] text-success">
                      <Coins className="h-3 w-3" />
                      CFA, USD, EUR
                    </div>
                  )}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-6 text-text-secondary">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
