import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { analyticsData } from "@/lib/data";
import { TrendingUp, TrendingDown, Mail, Clock, Activity } from "lucide-react";

export default function DashboardPreview() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/3 rounded-full blur-[150px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-medium tracking-widest uppercase mb-4 block">Dashboard</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Powerful{" "}
            <span className="gold-text">Analytics</span>
            {" "}at Your Fingertips
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Real-time insights into your notification performance with beautiful, interactive charts and widgets.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass rounded-2xl border-glow overflow-hidden"
        >
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Analytics Overview</h3>
                <p className="text-sm text-text-muted">Real-time notification performance</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Clock className="w-3 h-3" />
                <span>Updated just now</span>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Sent", value: "24,583", change: "+12.5%", up: true, icon: Mail },
              { label: "Delivered", value: "24,102", change: "+11.8%", up: true, icon: Activity },
              { label: "Open Rate", value: "68.4%", change: "+3.2%", up: true, icon: TrendingUp },
              { label: "Bounce Rate", value: "1.2%", change: "-0.4%", up: false, icon: TrendingDown },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-4 h-4 text-gold" />
                  <span className={`text-xs ${stat.up ? "text-success" : "text-danger"}`}>{stat.change}</span>
                </div>
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 pt-0">
            <div className="glass rounded-xl p-4">
              <h4 className="text-sm font-medium mb-4">Daily Activity</h4>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={analyticsData.dailyActivity}>
                  <defs>
                    <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="sent" stroke="#D4AF37" fill="url(#colorSent)" strokeWidth={2} />
                  <Area type="monotone" dataKey="delivered" stroke="#22c55e" fill="transparent" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="glass rounded-xl p-4">
              <h4 className="text-sm font-medium mb-4">Monthly Growth</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analyticsData.monthlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="sent" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="delivered" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
