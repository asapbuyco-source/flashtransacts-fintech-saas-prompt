import { motion } from "framer-motion";
import { CreditCard, Mail, MessageCircle, Shield, Users, Wallet } from "lucide-react";

const useCases = [
  {
    icon: Mail,
    title: "Send polished payment emails",
    description: "Create responsive transaction notifications with inline styles that survive real inbox rendering.",
  },
  {
    icon: CreditCard,
    title: "Switch amounts and currencies",
    description: "Move from CFA to USD, EUR, CAD, crypto amounts, and custom values without rebuilding templates.",
  },
  {
    icon: MessageCircle,
    title: "Run manual subscriptions",
    description: "Users contact the admin on WhatsApp, then access is activated from the admin panel.",
  },
  {
    icon: Shield,
    title: "Protect sender reputation",
    description: "Rate limits, verified domains, clear sender profiles, and logs help keep sending controlled.",
  },
  {
    icon: Users,
    title: "Control roles and access",
    description: "Separate admin, super admin, and user permissions across dashboards and protected routes.",
  },
  {
    icon: Wallet,
    title: "Support many payment contexts",
    description: "Cover wallets, banks, crypto exchanges, custom business receipts, and operational alerts.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative border-y border-white/10 bg-[linear-gradient(180deg,rgba(7,13,19,0.86),rgba(5,7,13,0.94))] py-20 backdrop-blur-sm lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-3xl"
        >
          <span className="mb-4 block text-sm font-medium uppercase tracking-widest text-gold">What It Does</span>
          <h2 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            Built around the jobs operators open the app to finish.
          </h2>
          <p className="mt-4 text-text-secondary">
            FlashTransacts keeps the daily workflow focused: prepare a notification, confirm the preview, send through the configured provider, and manage access without a payment gateway.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="premium-panel p-5"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-gold/25 bg-gold/10">
                <item.icon className="h-5 w-5 text-gold" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
              <p className="text-sm leading-6 text-text-secondary">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
