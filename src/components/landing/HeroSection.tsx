import { motion } from "framer-motion";
import { ArrowRight, Play, TrendingUp, Mail, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function AnimatedCounter({ end, duration = 2000, prefix = "", suffix = "" }: { end: number; duration?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 radial-overlay" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/3 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-glow mb-8"
        >
          <Zap className="w-4 h-4 text-gold" />
          <span className="text-sm text-text-secondary">Premium Transaction Notification Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
        >
          Next Generation{" "}
          <span className="gold-text">Transaction</span>
          <br />
          Notification Platform
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10"
        >
          Generate, deliver, and track beautiful transaction notification emails with enterprise-grade reliability and luxury design.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link to="/register" className="btn-gold px-8 py-3.5 rounded-xl text-base flex items-center gap-2 gold-glow-strong">
            Create Account
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="px-8 py-3.5 rounded-xl text-base text-white border border-white/10 hover:border-gold/30 hover:bg-white/5 transition-all flex items-center gap-2">
            <Play className="w-4 h-4" />
            View Features
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative mx-auto max-w-4xl"
        >
          <div className="glass rounded-2xl p-1 border-glow">
            <div className="bg-bg-secondary rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-danger/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-text-muted">FlashTransacts Dashboard</span>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-4 h-4 text-gold" />
                    <span className="text-xs text-text-muted">Notifications Sent</span>
                  </div>
                  <div className="text-2xl font-bold gold-text">
                    <AnimatedCounter end={24583} suffix="+" />
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-success">
                    <TrendingUp className="w-3 h-3" />
                    <span>+23% this month</span>
                  </div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-gold" />
                    <span className="text-xs text-text-muted">Delivery Rate</span>
                  </div>
                  <div className="text-2xl font-bold gold-text">
                    <AnimatedCounter end={99} suffix=".8%" />
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-success">
                    <TrendingUp className="w-3 h-3" />
                    <span>+0.3% this week</span>
                  </div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-gold" />
                    <span className="text-xs text-text-muted">Active Users</span>
                  </div>
                  <div className="text-2xl font-bold gold-text">
                    <AnimatedCounter end={1284} />
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-success">
                    <TrendingUp className="w-3 h-3" />
                    <span>+45 new today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-12 flex items-center justify-center gap-8 text-text-muted"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs">99.8% Uptime</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs">SOC 2 Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs">Enterprise Security</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
