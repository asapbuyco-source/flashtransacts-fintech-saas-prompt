import { motion } from "framer-motion";
import {
  Mail,
  Send,
  LayoutTemplate,
  Calendar,
  TrendingUp,
  Plus,
  Clock,
  ArrowRight,
  Activity,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { analyticsData } from "@/lib/data";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { buildWhatsAppUrl, getDaysRemaining, isSubscriptionActive } from "@/lib/subscription";

const COLORS = ["#D4AF37", "#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function Dashboard() {
  const { notifications, templates, emailLogs, platformSettings, addSubscriptionRequest } = useAppStore();
  const { user } = useAuthStore();
  const subscriptionActive = user?.role === "super_admin" || user?.role === "admin" || isSubscriptionActive(user);
  const daysRemaining = getDaysRemaining(user);

  const requestSubscription = () => {
    if (!user) {
      return;
    }

    addSubscriptionRequest({
      id: `subreq-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      plan: "Manual activation",
      price: `Contact admin (${platformSettings.currencyLabel})`,
      status: "open",
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 19),
    });
  };

  const deliveredCount = emailLogs.filter((l) => l.status === "delivered").length;

  const stats = [
    {
      label: "Total Notifications",
      value: notifications.length.toString(),
      change: "+12%",
      up: true,
      icon: Mail,
    },
    {
      label: "Emails Delivered",
      value: deliveredCount.toString(),
      change: "+8%",
      up: true,
      icon: Send,
    },
    {
      label: "Templates",
      value: templates.length.toString(),
      change: "+3",
      up: true,
      icon: LayoutTemplate,
    },
    {
      label: "Days Remaining",
      value: daysRemaining || "Inactive",
      change: subscriptionActive ? "Active" : "Manual",
      up: subscriptionActive,
      icon: Calendar,
    },
  ];

  const recentNotifications = notifications.slice(0, 5);
  const recentLogs = emailLogs.slice(0, 5);

  const pieData = analyticsData.templateUsage;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-text-secondary">Welcome back, {user?.name}</p>
        </div>
        <Link
          to="/notifications"
          className="btn-gold px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Notification
        </Link>
      </div>

      {!subscriptionActive && (
        <div className="glass-gold rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold mb-1">Activate server access</h2>
            <p className="text-sm text-text-secondary">
              Subscriptions are managed manually in {platformSettings.currencyLabel}. Contact the admin on WhatsApp and your plan will be activated from the admin panel.
            </p>
          </div>
          <a
            href={buildWhatsAppUrl(
              platformSettings.adminWhatsApp,
              `Hello admin, I want to activate my FlashTransacts subscription. My account email is ${user?.email || ""}.`
            )}
            target="_blank"
            rel="noreferrer"
            onClick={requestSubscription}
            className="btn-gold px-4 py-2.5 rounded-lg text-sm inline-flex items-center justify-center gap-2 shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            Contact Admin
          </a>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="glass rounded-xl p-5 card-hover"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-5 h-5 text-gold" />
              <span className={`text-xs ${stat.up ? "text-success" : "text-danger"}`}>{stat.change}</span>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-xs text-text-muted">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 glass rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold mb-4">Daily Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={analyticsData.dailyActivity}>
              <defs>
                <linearGradient id="colorSent2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="sent" stroke="#D4AF37" fill="url(#colorSent2)" strokeWidth={2} />
              <Area type="monotone" dataKey="delivered" stroke="#22c55e" fill="transparent" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold mb-4">Template Usage</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {pieData.slice(0, 4).map((item, index) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-text-secondary truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Recent Notifications</h3>
            <Link to="/notifications" className="text-xs text-gold hover:text-gold-light flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentNotifications.map((n) => (
              <div key={n.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${n.status === "delivered" ? "bg-success" : n.status === "failed" ? "bg-danger" : "bg-warning"}`} />
                  <div>
                    <div className="text-sm font-medium">{n.type}</div>
                    <div className="text-xs text-text-muted">{n.recipient}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium gold-text">{n.amount}</div>
                  <div className="text-xs text-text-muted">{n.date}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Email Delivery Logs</h3>
            <Link to="/email-logs" className="text-xs text-gold hover:text-gold-light flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${log.status === "delivered" ? "bg-success" : log.status === "failed" ? "bg-danger" : "bg-warning"}`} />
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{log.subject}</div>
                    <div className="text-xs text-text-muted truncate">{log.recipient}</div>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <div className={`text-xs capitalize ${log.status === "delivered" ? "text-success" : log.status === "failed" ? "text-danger" : "text-warning"}`}>
                    {log.status}
                  </div>
                  <div className="text-xs text-text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {log.timestamp.split(" ")[0]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="glass rounded-xl p-5"
      >
        <h3 className="text-sm font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Create Notification", icon: Plus, path: "/notifications" },
            { label: "View Templates", icon: LayoutTemplate, path: "/templates" },
            { label: "View Logs", icon: Activity, path: "/email-logs" },
            { label: "Analytics", icon: TrendingUp, path: "/analytics" },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 hover:border-gold/20 border border-transparent transition-all"
            >
              <action.icon className="w-5 h-5 text-gold" />
              <span className="text-xs text-text-secondary text-center">{action.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
