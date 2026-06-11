import { motion } from "framer-motion";
import { Check, ClipboardCheck, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { pricingPlans } from "@/lib/data";
import { buildWhatsAppUrl } from "@/lib/subscription";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";

const manualSteps = [
  { icon: ClipboardCheck, title: "Choose a CFA plan", description: "No card checkout or payment API is used." },
  { icon: MessageCircle, title: "Contact admin", description: "The WhatsApp number is controlled from admin settings." },
  { icon: ShieldCheck, title: "Get activated", description: "Admin approves the account and sets access duration." },
];

export default function PricingSection() {
  const { user, isAuthenticated } = useAuthStore();
  const { platformSettings, addSubscriptionRequest } = useAppStore();

  const requestPlan = (plan: (typeof pricingPlans)[number]) => {
    if (user) {
      addSubscriptionRequest({
        id: `subreq-${Date.now()}-${plan.name}`,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        plan: plan.name,
        price: plan.price,
        status: "open",
        createdAt: new Date().toISOString().replace("T", " ").slice(0, 19),
      });
    }
  };

  return (
    <section id="pricing" className="relative py-24 lg:py-32">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-medium tracking-widest uppercase mb-4 block">Pricing</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Simple, Transparent{" "}
            <span className="gold-text">Pricing</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Choose a CFA plan, then contact the admin on WhatsApp. Subscriptions are activated manually from the admin panel.
          </p>
        </motion.div>

        <div className="mb-8 grid gap-3 md:grid-cols-3">
          {manualSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="premium-panel p-5"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/25 bg-gold/10">
                  <step.icon className="h-5 w-5 text-gold" />
                </div>
                <span className="text-xs text-text-muted">Step 0{index + 1}</span>
              </div>
              <h3 className="mb-2 text-base font-semibold">{step.title}</h3>
              <p className="text-sm leading-6 text-text-secondary">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`relative rounded-lg p-6 card-hover ${
                plan.highlighted
                  ? "glass-gold border-glow"
                  : "glass"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gold text-bg-primary text-xs font-semibold">
                    <Sparkles className="w-3 h-3" />
                    Popular
                  </div>
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                <p className="text-xs text-text-muted">{plan.description}</p>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-text-muted">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                    <Check className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {isAuthenticated ? (
                <a
                  href={buildWhatsAppUrl(
                    platformSettings.adminWhatsApp,
                    `Hello admin, I want to subscribe to the ${plan.name} plan (${plan.price}) for FlashTransacts. My account email is ${user?.email}.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => requestPlan(plan)}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    plan.highlighted
                      ? "btn-gold"
                      : "border border-white/10 hover:border-gold/30 hover:bg-white/5 text-white"
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact Admin
                </a>
              ) : (
                <Link
                  to="/register"
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    plan.highlighted
                      ? "btn-gold"
                      : "border border-white/10 hover:border-gold/30 hover:bg-white/5 text-white"
                  }`}
                >
                  Create Account
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
