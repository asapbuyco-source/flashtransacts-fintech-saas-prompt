import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { analyticsData } from "@/lib/data";
import { TrendingUp, Users, Mail, Activity } from "lucide-react";

const COLORS = ["#D4AF37", "#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-text-secondary">Comprehensive performance insights</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: "285", change: "+12%", icon: Users },
          { label: "Notifications Sent", value: "24,583", change: "+23%", icon: Mail },
          { label: "Delivery Rate", value: "99.8%", change: "+0.3%", icon: TrendingUp },
          { label: "Avg. Response", value: "1.2s", change: "-0.1s", icon: Activity },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl p-5 card-hover"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-5 h-5 text-gold" />
              <span className="text-xs text-success">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-text-muted">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold mb-4">Monthly Activity</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={analyticsData.monthlyActivity}>
              <defs>
                <linearGradient id="colorSent3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDel3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="sent" stroke="#D4AF37" fill="url(#colorSent3)" strokeWidth={2} />
              <Area type="monotone" dataKey="delivered" stroke="#22c55e" fill="url(#colorDel3)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={analyticsData.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#D4AF37" strokeWidth={2} dot={{ fill: "#D4AF37", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold mb-4">Daily Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData.dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
              <Tooltip />
              <Bar dataKey="sent" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              <Bar dataKey="delivered" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold mb-4">Template Usage Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analyticsData.templateUsage}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {analyticsData.templateUsage.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {analyticsData.templateUsage.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-text-secondary">{item.name}</span>
                <span className="text-text-muted ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
