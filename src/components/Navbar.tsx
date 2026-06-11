import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, LogOut, User, LayoutDashboard, Shield } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLanding = location.pathname === "/";
  const isAdmin = user?.role === "super_admin" || user?.role === "admin";

  const scrollToSection = (id: string) => {
    if (!isLanding) {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isLanding
          ? "bg-bg-primary/95 border-b border-white/10 shadow-2xl shadow-black/30 backdrop-blur-xl"
          : "bg-bg-primary/95 border-b border-white/10 shadow-2xl shadow-black/30 backdrop-blur-xl"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center group-hover:gold-glow transition-all duration-300">
              <Zap className="w-5 h-5 text-bg-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Flash<span className="gold-text">Transacts</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {isLanding && (
              <>
                <button onClick={() => scrollToSection("features")} className="text-sm text-text-secondary hover:text-white transition-colors">Features</button>
                <button onClick={() => scrollToSection("modules")} className="text-sm text-text-secondary hover:text-white transition-colors">Modules</button>
                <button onClick={() => scrollToSection("pricing")} className="text-sm text-text-secondary hover:text-white transition-colors">Pricing</button>
                <button onClick={() => scrollToSection("faq")} className="text-sm text-text-secondary hover:text-white transition-colors">FAQ</button>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-1.5 text-sm text-gold hover:text-gold-light transition-colors">
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-white transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/30 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <span className="text-sm text-text-secondary">{user?.name}</span>
                </div>
                <button onClick={logout} className="p-2 text-text-muted hover:text-danger transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-text-secondary hover:text-white transition-colors px-4 py-2">
                  Sign In
                </Link>
                <Link to="/register" className="btn-gold text-sm px-5 py-2 rounded-lg">
                  Create Account
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-white">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg-primary border-t border-white/10 shadow-2xl shadow-black/40"
          >
            <div className="px-4 py-4 space-y-2">
              {isLanding && (
                <>
                  <button onClick={() => scrollToSection("features")} className="block w-full rounded-lg px-3 py-3 text-left text-sm text-text-secondary hover:bg-white/5 hover:text-white">Features</button>
                  <button onClick={() => scrollToSection("modules")} className="block w-full rounded-lg px-3 py-3 text-left text-sm text-text-secondary hover:bg-white/5 hover:text-white">Modules</button>
                  <button onClick={() => scrollToSection("pricing")} className="block w-full rounded-lg px-3 py-3 text-left text-sm text-text-secondary hover:bg-white/5 hover:text-white">Pricing</button>
                  <button onClick={() => scrollToSection("faq")} className="block w-full rounded-lg px-3 py-3 text-left text-sm text-text-secondary hover:bg-white/5 hover:text-white">FAQ</button>
                </>
              )}
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-3 text-sm text-text-secondary hover:bg-white/5 hover:text-white">Dashboard</Link>
                  {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-3 text-sm text-gold hover:bg-gold/10">Admin Panel</Link>}
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full rounded-lg px-3 py-3 text-left text-sm text-danger hover:bg-danger/10">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-3 text-sm text-text-secondary hover:bg-white/5 hover:text-white">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-3 text-sm text-gold hover:bg-gold/10">Create Account</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
