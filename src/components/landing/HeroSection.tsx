import { motion } from "framer-motion";
import { ArrowRight, Play, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import heroPaymentImage from "@/assets/landing-payment-terminal.jpg";

function AnimatedCounter({
  end,
  duration = 1600,
  prefix = "",
  suffix = "",
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
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

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function HeroSection() {
  return (
    <section className="relative isolate min-h-[84vh] overflow-hidden pt-24 pb-10 md:pt-28 lg:pt-32">
      <div className="absolute inset-0 -z-20">
        <img
          src={heroPaymentImage}
          alt="Contactless payment terminal"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#050505]/70" />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,#050505_0%,rgba(5,5,5,0.82)_40%,rgba(5,5,5,0.42)_78%,rgba(5,5,5,0.78)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg-primary to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          className="max-w-4xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3.5 py-2 backdrop-blur-md">
            <Zap className="h-4 w-4 text-gold" />
            <span className="text-sm text-text-secondary">
              Payment notification builder, sender, and admin workspace
            </span>
          </div>

          <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            FlashTransacts
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-text-secondary md:text-xl">
            Build polished payment notification emails, edit currencies and amounts in real time, send through your verified domain, and manage access manually from one admin-controlled app.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/register"
              className="btn-gold inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm"
            >
              Create Account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-6 py-3 text-sm text-white transition-all hover:border-gold/40 hover:bg-white/10"
            >
              <Play className="h-4 w-4" />
              View Product Tour
            </button>
          </div>

          <div className="mt-8 grid max-w-2xl grid-cols-3 overflow-hidden rounded-lg border border-white/10 bg-black/40 backdrop-blur-md">
            <div className="border-r border-white/10 p-4">
              <div className="text-2xl font-bold text-white">
                <AnimatedCounter end={10} />
              </div>
              <div className="mt-1 text-xs text-text-muted">Templates</div>
            </div>
            <div className="border-r border-white/10 p-4">
              <div className="text-2xl font-bold text-white">
                <AnimatedCounter end={14} />
              </div>
              <div className="mt-1 text-xs text-text-muted">Currencies</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-white">Manual</div>
              <div className="mt-1 text-xs text-text-muted">Subscriptions</div>
            </div>
          </div>
        </motion.div>

        <div className="h-1" />
      </div>
    </section>
  );
}
