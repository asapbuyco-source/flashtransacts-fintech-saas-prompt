import { useState } from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import {
  Users,
  CreditCard,
  Bell,
  LayoutTemplate,
  Mail,
  BarChart3,
  Shield,
  Search,
  CheckCircle2,
  PauseCircle,
  Trash2,
  Clock,
  Activity,
  TrendingUp,
  AlertTriangle,
  MessageCircle,
  Save,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";
import { durations, analyticsData, activityLogs } from "@/lib/data";
import { addDaysToToday, buildWhatsAppUrl } from "@/lib/subscription";
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
} from "recharts";

const adminTabs = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "users", label: "Users", icon: Users },
  { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "logs", label: "Email Logs", icon: Mail },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "security", label: "Security", icon: Shield },
];

export default function AdminPanel() {
  const { user } = useAuthStore();
  const {
    users,
    notifications,
    templates,
    emailLogs,
    updateUserStatus,
    updateUserSubscription,
    platformSettings,
    updatePlatformSettings,
    subscriptionRequests,
    completeSubscriptionRequest,
  } = useAppStore();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchUsers, setSearchUsers] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id || "");
  const [selectedPlan, setSelectedPlan] = useState("Monthly");
  const [whatsAppNumber, setWhatsAppNumber] = useState(platformSettings.adminWhatsApp);
  const [settingsSaved, setSettingsSaved] = useState(false);

  if (user?.role !== "super_admin" && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchUsers.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUsers.toLowerCase())
  );

  const stats = [
    { label: "Total Users", value: users.length.toString(), icon: Users },
    { label: "Open Requests", value: subscriptionRequests.filter((request) => request.status === "open").length.toString(), icon: Clock },
    { label: "Active Subscriptions", value: users.filter((u) => u.status === "active").length.toString(), icon: CreditCard },
    { label: "Notifications Sent", value: notifications.length.toString(), icon: Bell },
    { label: "Templates", value: templates.length.toString(), icon: LayoutTemplate },
    { label: "Email Logs", value: emailLogs.length.toString(), icon: Mail },
  ];

  const selectedUser = users.find((candidate) => candidate.id === selectedUserId) || users[0];

  const saveWhatsAppNumber = () => {
    updatePlatformSettings({ adminWhatsApp: whatsAppNumber });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 1800);
  };

  const extendSubscription = () => {
    if (!selectedUser) {
      return;
    }

    updateUserSubscription(selectedUser.id, {
      status: "active",
      subscriptionEnd: addDaysToToday(selectedDuration),
      subscriptionType: selectedPlan,
    });
  };

  const grantLifetime = () => {
    if (!selectedUser) {
      return;
    }

    updateUserSubscription(selectedUser.id, {
      status: "active",
      subscriptionEnd: "2099-12-31",
      subscriptionType: "Lifetime",
    });
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass rounded-xl p-5 card-hover"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-5 h-5 text-gold" />
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-text-muted">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={analyticsData.userGrowth}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="users" stroke="#D4AF37" fill="url(#colorUsers)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">Monthly Notifications</h3>
          <ResponsiveContainer width="100%" height={250}>
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
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchUsers}
            onChange={(e) => setSearchUsers(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
          />
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">User</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Role</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Created</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Subscription</th>
                <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">{u.name}</div>
                    <div className="text-xs text-text-muted">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-white/5 capitalize">{u.role.replace("_", " ")}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize status-${u.status}`}>{u.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{u.createdAt}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    <div>{u.subscriptionType || "Not subscribed"}</div>
                    <div className="text-xs text-text-muted">{u.subscriptionEnd || "-"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {(u.status === "pending" || u.status === "expired") && (
                        <button
                          onClick={() => updateUserStatus(u.id, "active")}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-success transition-colors"
                          title="Activate"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      {u.status === "active" && (
                        <button
                          onClick={() => updateUserStatus(u.id, "suspended")}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-warning transition-colors"
                          title="Suspend"
                        >
                          <PauseCircle className="w-4 h-4" />
                        </button>
                      )}
                      {u.status === "suspended" && (
                        <button
                          onClick={() => updateUserStatus(u.id, "active")}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-success transition-colors"
                          title="Reactivate"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-danger transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSubscriptions = () => (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Subscription Management</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium mb-1.5">Select User</label>
            <select
              value={selectedUserId}
              onChange={(event) => setSelectedUserId(event.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Plan</label>
            <select
              value={selectedPlan}
              onChange={(event) => setSelectedPlan(event.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm"
            >
              <option>Trial</option>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
              <option>Lifetime</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Subscription Duration</label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-lg text-sm"
            >
              {durations.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={extendSubscription} className="btn-gold px-6 py-2.5 rounded-lg text-sm">Extend Subscription</button>
          <button onClick={grantLifetime} className="px-6 py-2.5 rounded-lg text-sm border border-white/10 hover:bg-white/5 transition-colors">Grant Lifetime</button>
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="w-5 h-5 text-gold" />
          <h3 className="text-lg font-semibold">Manual Contact Settings</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3">
          <div>
            <label className="block text-xs font-medium mb-1.5">Admin WhatsApp Number</label>
            <input
              value={whatsAppNumber}
              onChange={(event) => setWhatsAppNumber(event.target.value)}
              placeholder="237690000000"
              className="w-full px-3 py-2.5 rounded-lg text-sm"
            />
          </div>
          <div className="flex items-end">
            <button onClick={saveWhatsAppNumber} className="btn-gold px-5 py-2.5 rounded-lg text-sm inline-flex items-center gap-2">
              <Save className="w-4 h-4" />
              {settingsSaved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
        <a
          href={buildWhatsAppUrl(platformSettings.adminWhatsApp, "Hello admin, I want to activate my FlashTransacts subscription.")}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex text-xs text-gold hover:text-gold-light"
        >
          Test WhatsApp subscription link
        </a>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">Subscription Requests</h3>
          <span className="text-xs text-text-muted">{subscriptionRequests.filter((request) => request.status === "open").length} open</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">User</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Plan</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Price</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Requested</th>
                <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptionRequests.map((request) => (
                <tr key={request.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">{request.userName}</div>
                    <div className="text-xs text-text-muted">{request.userEmail}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">{request.plan}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{request.price}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{request.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${request.status === "open" ? "status-pending" : "status-active"}`}>
                        {request.status}
                      </span>
                      {request.status === "open" && (
                        <button
                          onClick={() => completeSubscriptionRequest(request.id)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-success transition-colors"
                          title="Mark completed"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {subscriptionRequests.length === 0 && (
          <div className="py-10 text-center text-text-muted text-sm">No manual subscription requests yet</div>
        )}
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">User</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Plan</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Start Date</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">End Date</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.filter((u) => u.subscriptionEnd).map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">{u.name}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">{u.subscriptionType || "Manual"}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{u.createdAt}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{u.subscriptionEnd}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize status-${u.status}`}>{u.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-4">
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Action</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">User</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Target</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Timestamp</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {activityLogs.map((log) => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-white/5">{log.action}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">{log.user}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{log.target}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{log.timestamp}</td>
                  <td className="px-4 py-3 text-sm text-text-muted">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-gold" />
          <h3 className="text-lg font-semibold">Security Overview</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-white/5">
            <div className="text-2xl font-bold text-success">100%</div>
            <div className="text-xs text-text-muted">2FA Enabled</div>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <div className="text-2xl font-bold text-warning">2</div>
            <div className="text-xs text-text-muted">Failed Logins (24h)</div>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <div className="text-2xl font-bold text-gold">0</div>
            <div className="text-xs text-text-muted">Security Alerts</div>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h3 className="text-lg font-semibold">Audit Log</h3>
        </div>
        <div className="space-y-3">
          {activityLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <div className="w-2 h-2 rounded-full bg-gold" />
              <div className="flex-1">
                <div className="text-sm">{log.action}</div>
                <div className="text-xs text-text-muted">{log.user} - {log.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-sm text-text-secondary">Manage users, subscriptions, and platform settings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 shrink-0">
          <div className="glass rounded-xl p-2 space-y-1">
            {adminTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-gold/10 text-gold border border-gold/20"
                    : "text-text-secondary hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "users" && renderUsers()}
          {activeTab === "subscriptions" && renderSubscriptions()}
          {activeTab === "notifications" && (
            <div className="glass rounded-xl p-6 text-center text-text-muted">
              <Bell className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p>Manage all platform notifications</p>
            </div>
          )}
          {activeTab === "templates" && (
            <div className="glass rounded-xl p-6 text-center text-text-muted">
              <LayoutTemplate className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p>Manage platform templates</p>
            </div>
          )}
          {activeTab === "logs" && (
            <div className="glass rounded-xl p-6 text-center text-text-muted">
              <Mail className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p>View all email delivery logs</p>
            </div>
          )}
          {activeTab === "activity" && renderActivity()}
          {activeTab === "security" && renderSecurity()}
        </div>
      </div>
    </div>
  );
}
