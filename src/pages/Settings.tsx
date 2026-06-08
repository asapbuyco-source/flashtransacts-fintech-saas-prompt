import { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Bell, Shield, Camera, Save } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function Settings() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      updateUser({ name: profile.name });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 600);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-text-secondary">Manage your account preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 shrink-0">
          <div className="glass rounded-xl p-2 space-y-1">
            {tabs.map((tab) => (
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

        <div className="flex-1">
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-lg font-semibold mb-6">Profile Settings</h2>

              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border-2 border-gold/30 flex items-center justify-center text-gold text-2xl font-bold">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gold text-bg-primary flex items-center justify-center">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-sm text-text-muted">{user?.email}</div>
                  <div className="text-xs text-gold capitalize mt-1">{user?.role.replace("_", " ")}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-medium mb-1.5">Full Name</label>
                  <input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">Email</label>
                  <input
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg text-sm"
                    disabled
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-gold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-bg-primary/30 border-t-bg-primary rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saved ? "Saved!" : "Save Changes"}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-lg font-semibold mb-6">Security Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5">Current Password</label>
                  <input type="password" placeholder="Enter current password" className="w-full px-3 py-2.5 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">New Password</label>
                  <input type="password" placeholder="Enter new password" className="w-full px-3 py-2.5 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" className="w-full px-3 py-2.5 rounded-lg text-sm" />
                </div>
                <button className="btn-gold px-6 py-2.5 rounded-lg text-sm">Update Password</button>
              </div>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-lg font-semibold mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: "Email delivery confirmations", desc: "Receive email when a notification is delivered" },
                  { label: "Failed delivery alerts", desc: "Get notified when an email fails to deliver" },
                  { label: "Weekly analytics summary", desc: "Receive weekly performance reports" },
                  { label: "Account activity alerts", desc: "Get notified about important account events" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div>
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs text-text-muted">{item.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold" />
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "privacy" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-lg font-semibold mb-6">Privacy Settings</h2>
              <div className="space-y-4">
                {[
                  { label: "Two-Factor Authentication", desc: "Add an extra layer of security to your account" },
                  { label: "Activity History", desc: "Keep a log of all your account activities" },
                  { label: "Data Sharing", desc: "Allow sharing anonymized data for platform improvements" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div>
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs text-text-muted">{item.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold" />
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
