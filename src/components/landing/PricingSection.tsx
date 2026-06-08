import { motion } from "framer-motion";
import { Check, MessageCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { pricingPlans } from "@/lib/data";
import { buildWhatsAppUrl } from "@/lib/subscription";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";

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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/3 rounded-full blur-[150px]" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`relative rounded-2xl p-6 card-hover ${
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
