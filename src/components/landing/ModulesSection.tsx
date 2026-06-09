import { motion } from "framer-motion";
import { ArrowUpRight, Eye, MailCheck } from "lucide-react";
import { modules } from "@/lib/data";

const moduleDetails: Record<string, { amount: string; status: string; tag: string }> = {
  PayPal: { amount: "245.00 USD", status: "Receipt ready", tag: "Wallet" },
  "Apple Pay": { amount: "29.88 USD", status: "Invoice preview", tag: "Card" },
  Venmo: { amount: "84.20 USD", status: "Transfer note", tag: "P2P" },
  "Cash App": { amount: "500.00 USD", status: "Payment notice", tag: "Wallet" },
  Zelle: { amount: "1,000.00 USD", status: "Bank transfer", tag: "Bank" },
  Chime: { amount: "350.00 USD", status: "Deposit alert", tag: "Bank" },
  Interac: { amount: "725.00 CAD", status: "e-Transfer", tag: "Canada" },
  Coinbase: { amount: "0.042 BTC", status: "Crypto deposit", tag: "Crypto" },
  Binance: { amount: "1.25 ETH", status: "Asset received", tag: "Exchange" },
  Custom: { amount: "60,000 CFA", status: "Custom layout", tag: "Brand" },
};

export default function ModulesSection() {
  return (
    <section id="modules" className="relative border-y border-white/10 bg-[#07090d] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-3xl">
            <span className="mb-4 block text-sm font-medium uppercase tracking-widest text-gold">Template Library</span>
            <h2 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              Payment previews that feel polished before you press send.
            </h2>
            <p className="mt-4 max-w-2xl text-text-secondary">
              Pick a payment channel, adjust the editable fields, and preview a responsive email design that keeps its inline styling when delivered.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-text-secondary">
            <span className="text-white">{modules.length} layouts</span> across wallet, bank, crypto, and custom notifications
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {modules.map((module, index) => {
            const detail = moduleDetails[module.name] || moduleDetails.Custom;
            return (
              <motion.div
                key={module.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="card-hover overflow-hidden rounded-lg border border-white/10 bg-[#0d1118]"
              >
                <div className="p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
                        style={{ backgroundColor: module.color }}
                      >
                        {module.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">{module.name}</h3>
                        <p className="text-[11px] uppercase text-text-muted">{detail.tag}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-text-muted" />
                  </div>

                  <div className="rounded-lg border border-white/10 bg-[#f8fafc] p-3 text-[#101828]">
                    <div className="mb-3 flex items-center justify-between border-b border-[#e4e7ec] pb-2">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: module.color }} />
                        <span className="text-xs font-semibold">{module.name}</span>
                      </div>
                      <MailCheck className="h-3.5 w-3.5 text-[#667085]" />
                    </div>
                    <div className="text-[11px] uppercase text-[#667085]">Amount</div>
                    <div className="mt-1 text-lg font-bold">{detail.amount}</div>
                    <div className="mt-3 rounded-md bg-[#eef2f7] px-2 py-1.5 text-[11px] font-medium text-[#475467]">
                      {detail.status}
                    </div>
                  </div>

                  <p className="mt-4 min-h-12 text-xs leading-5 text-text-secondary">{module.description}</p>
                  <button className="mt-4 flex items-center gap-1.5 text-xs text-gold transition-colors hover:text-gold-light">
                    <Eye className="h-3.5 w-3.5" />
                    Preview layout
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
