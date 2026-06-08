import { Link } from "react-router-dom";
import { Zap, Globe, MessageCircle, ExternalLink, Mail } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/subscription";
import { useAppStore } from "@/store/appStore";

export default function Footer() {
  const { platformSettings } = useAppStore();

  return (
    <footer className="relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <Zap className="w-5 h-5 text-bg-primary" />
              </div>
              <span className="text-lg font-bold">
                Flash<span className="gold-text">Transacts</span>
              </span>
            </Link>
            <p className="text-sm text-text-secondary max-w-sm mb-6">
              Premium transaction notification platform for modern fintech companies. Deliver beautiful, branded notifications at scale.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={buildWhatsAppUrl(platformSettings.adminWhatsApp, "Hello admin, I want to activate my FlashTransacts subscription.")}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-text-muted hover:text-gold hover:border-gold/30 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-text-muted hover:text-gold hover:border-gold/30 transition-all">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-text-muted hover:text-gold hover:border-gold/30 transition-all">
                <ExternalLink className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-text-muted hover:text-gold hover:border-gold/30 transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-sm text-text-secondary hover:text-gold transition-colors">Features</a></li>
              <li><a href="#modules" className="text-sm text-text-secondary hover:text-gold transition-colors">Modules</a></li>
              <li><a href="#pricing" className="text-sm text-text-secondary hover:text-gold transition-colors">Pricing</a></li>
              <li><Link to="/dashboard" className="text-sm text-text-secondary hover:text-gold transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-text-secondary hover:text-gold transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-gold transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-gold transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-gold transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-text-secondary hover:text-gold transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-gold transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-gold transition-colors">Security</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-gold transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} FlashTransacts. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            Generated through FlashTransacts Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
