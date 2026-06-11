import { motion } from "framer-motion";
import { ArrowRight, CircleDollarSign, LayoutTemplate, MessageCircle, Play, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import cryptoWalletHero from "@/assets/crypto-wallet-hero.png";

const heroProof = [
  { label: "Payment layouts", value: "10", icon: LayoutTemplate },
  { label: "Currencies", value: "14", icon: CircleDollarSign },
  { label: "Subscriptions", value: "Manual", icon: MessageCircle },
];

const cryptoMarquee = [
  ["BTC", "Bitcoin", "#f7931a"],
  ["ETH", "Ethereum", "#8b9cff"],
  ["USDT", "Tether", "#26a17b"],
  ["BNB", "BNB", "#f0b90b"],
  ["SOL", "Solana", "#d946ef"],
  ["XRP", "XRP", "#a3a3a3"],
  ["ADA", "Cardano", "#3b82f6"],
  ["DOGE", "Dogecoin", "#c2a633"],
  ["TRX", "TRON", "#ef4444"],
  ["LTC", "Litecoin", "#94a3b8"],
];

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
  const marqueeItems = [...cryptoMarquee, ...cryptoMarquee];

  return (
    <section className="relative isolate min-h-[82vh] overflow-hidden bg-[linear-gradient(135deg,rgba(5,7,13,0.96)_0%,rgba(10,18,32,0.94)_52%,rgba(5,5,5,0.98)_100%)] pt-20 pb-0 md:pt-28 lg:pt-28">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(118deg,rgba(212,175,55,0.16)_0%,transparent_34%),linear-gradient(244deg,rgba(20,184,166,0.12)_0%,transparent_36%)]" />
      <div className="premium-grid absolute inset-0 -z-10 opacity-55" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-44 bg-gradient-to-t from-bg-primary to-transparent" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-5 px-4 pb-7 sm:gap-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:items-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          className="max-w-4xl"
        >
          <div className="mb-5 inline-flex max-w-full flex-wrap items-center gap-2 rounded-lg border border-gold/20 bg-white/[0.06] px-3.5 py-2 shadow-xl shadow-black/20 backdrop-blur-md">
            <Zap className="h-4 w-4 text-gold" />
            <span className="text-sm text-text-secondary">
              Manual access, verified senders, Firestore logs, and live email previews
            </span>
          </div>

          <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            FlashTransacts
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary sm:text-base md:text-xl md:leading-8">
            A complete payment notification workspace for building responsive email layouts, changing amounts and currencies live, sending through your configured sender, and activating users manually through WhatsApp.
          </p>

          <div className="mt-6 flex flex-row flex-wrap gap-3 sm:mt-8">
            <Link
              to="/register"
              className="btn-gold inline-flex min-w-[148px] flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm sm:flex-none sm:px-6"
            >
              Create Account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex min-w-[148px] flex-1 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm text-white transition-all hover:border-gold/40 hover:bg-white/10 sm:flex-none sm:px-6"
            >
              <Play className="h-4 w-4" />
              View Product Tour
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] leading-4 text-text-secondary sm:hidden">
            <span className="rounded-lg border border-white/10 bg-white/[0.06] px-2 py-2 backdrop-blur-md">10 layouts</span>
            <span className="rounded-lg border border-white/10 bg-white/[0.06] px-2 py-2 backdrop-blur-md">14 currencies</span>
            <span className="rounded-lg border border-white/10 bg-white/[0.06] px-2 py-2 backdrop-blur-md">Manual access</span>
          </div>

          <div className="mt-8 hidden max-w-3xl grid-cols-3 gap-2 sm:grid sm:gap-3">
            {heroProof.map((item, index) => (
              <div key={item.label} className="premium-panel p-3 sm:p-4">
                <item.icon className="mb-3 h-4 w-4 text-gold sm:h-5 sm:w-5" />
                <div className="text-xl font-bold text-white sm:text-2xl">
                  {index < 2 ? <AnimatedCounter end={Number(item.value)} /> : item.value}
                </div>
                <div className="mt-1 text-[10px] leading-4 text-text-muted sm:text-xs">{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.12 }}
          className="relative mx-auto w-full max-w-[285px] sm:max-w-[420px] lg:max-w-[520px]"
        >
          <div className="absolute inset-x-8 bottom-3 h-24 rounded-[999px] bg-gold/25 blur-3xl" />
          <div className="absolute left-4 right-8 top-6 h-44 rounded-[999px] bg-white/10 blur-3xl" />
          <div className="absolute -inset-5 rounded-lg border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] shadow-2xl shadow-black/40 backdrop-blur-sm" />
          <div className="relative">
            <img
              src={cryptoWalletHero}
              alt="Crypto wallet with Bitcoin, Ethereum, Solana, Cardano, and other coins"
              className="relative z-10 h-auto w-full object-contain drop-shadow-[0_32px_48px_rgba(0,0,0,0.58)]"
            />
            <div className="absolute right-2 top-5 z-20 rounded-lg border border-white/10 bg-black/45 px-3 py-2 text-xs text-white shadow-xl shadow-black/25 backdrop-blur-md sm:right-6">
              Crypto ready
            </div>
            <div className="absolute bottom-7 left-2 z-20 rounded-lg border border-gold/20 bg-[#0b0f17]/70 px-3 py-2 text-xs text-gold shadow-xl shadow-black/25 backdrop-blur-md sm:left-6">
              Live wallet rails
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 overflow-hidden border-y border-white/10 bg-[#05070d]/80 py-3 shadow-2xl shadow-black/30 backdrop-blur-md">
        <div className="crypto-marquee flex w-max items-center gap-3">
          {marqueeItems.map(([symbol, name, color], index) => (
            <div
              key={`${symbol}-${index}`}
              className="flex min-w-max items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white shadow-lg shadow-black/15 backdrop-blur-md"
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-bg-primary"
                style={{ backgroundColor: color }}
              >
                {symbol}
              </span>
              <span className="font-medium">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
