import { motion } from "framer-motion";
import { Clock, MessageCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppStore } from "@/store/appStore";

export default function PendingApproval() {
  const { platformSettings } = useAppStore();
  const whatsappLink = `https://wa.me/${platformSettings.adminWhatsApp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello admin, I want to activate my FlashTransacts subscription.")}`;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 radial-overlay" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg text-center"
      >
        <div className="glass rounded-2xl p-10 border-glow">
          <div className="w-20 h-20 rounded-full bg-warning/10 border border-warning/20 flex items-center justify-center mx-auto mb-6 pulse-gold">
            <Clock className="w-10 h-10 text-warning" />
          </div>

          <h1 className="text-2xl font-bold mb-3">Subscription Activation Required</h1>
          <p className="text-text-secondary mb-6">
            Your account is ready. Server access is activated manually by the admin after you choose a plan and make contact on WhatsApp.
          </p>

          <div className="glass rounded-xl p-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-gold mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium mb-1">What happens next?</p>
                <ul className="text-xs text-text-secondary space-y-1.5">
                  <li>Contact the admin on WhatsApp with your preferred plan</li>
                  <li>The admin confirms payment manually</li>
                  <li>Your subscription is activated from the admin panel</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="btn-gold px-5 py-2.5 rounded-lg text-sm inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Contact Admin
            </a>
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
