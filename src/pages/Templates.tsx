import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Eye, Copy, Trash2, X, LayoutTemplate } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import EmailPreview from "@/components/EmailPreview";
import type { Template } from "@/store/appStore";
import { getTemplateDefaults } from "@/lib/emailTemplates";

export default function Templates() {
  const { templates, addTemplate, deleteTemplate } = useAppStore();
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState({ name: "", category: "Deposit Notice", brand: "Custom" });

  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.brand.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    addTemplate({
      id: `template-${Date.now()}`,
      name: newTemplate.name,
      category: newTemplate.category,
      brand: newTemplate.brand,
      status: "draft",
      usage: 0,
    });
    setShowCreate(false);
    setNewTemplate({ name: "", category: "Deposit Notice", brand: "Custom" });
  };

  const duplicateTemplate = (template: Template) => {
    addTemplate({
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} Copy`,
      status: "draft",
      usage: 0,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-sm text-text-secondary">Manage your notification templates</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-gold px-4 py-2 rounded-lg text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="glass rounded-xl p-5 card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                <LayoutTemplate className="w-5 h-5 text-gold" />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-gold transition-colors"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => duplicateTemplate(template)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-gold transition-colors"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-danger transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold mb-1">{template.name}</h3>
            <p className="text-xs text-text-muted mb-3">{template.category}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-1 rounded-full bg-white/5">{template.brand}</span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  template.status === "active" ? "status-active" : template.status === "draft" ? "status-pending" : "status-expired"
                }`}
              >
                {template.status}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-text-muted">
              <span>{template.usage} uses</span>
              <span>Last used: 2d ago</span>
            </div>
          </motion.div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl w-full max-w-md border-glow"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-lg font-semibold">New Template</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5">Template Name</label>
                <input
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="e.g., PayPal Deposit"
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Category</label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                >
                  <option>Deposit Notice</option>
                  <option>Withdrawal Notice</option>
                  <option>Transfer Notice</option>
                  <option>Verification Notice</option>
                  <option>Custom Notice</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Brand</label>
                <input
                  value={newTemplate.brand}
                  onChange={(e) => setNewTemplate({ ...newTemplate, brand: e.target.value })}
                  placeholder="e.g., PayPal"
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 p-6 border-t border-white/5">
              <button onClick={handleCreate} className="btn-gold px-6 py-2.5 rounded-lg text-sm">
                Create Template
              </button>
              <button onClick={() => setShowCreate(false)} className="px-6 py-2.5 rounded-lg text-sm text-text-secondary hover:text-white">
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border-glow"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h2 className="text-lg font-semibold">{previewTemplate.name}</h2>
              <button onClick={() => setPreviewTemplate(null)} className="p-1 hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <EmailPreview
                data={{
                  recipient: "client@example.com",
                  recipientName: "Sample Client",
                  amount: "750,000 CFA",
                  currency: "XAF",
                  type: previewTemplate.category,
                  brand: previewTemplate.brand,
                  status: "draft",
                  date: new Date().toISOString().split("T")[0],
                  reference: "REF-123456",
                  transactionId: "TXN-789012",
                  description: previewTemplate.content,
                  metadata: {
                    ...getTemplateDefaults(previewTemplate.brand),
                    recipientName: "Sample Client",
                    recipientEmail: "client@example.com",
                    amount: "750,000 CFA",
                    currency: "XAF",
                    transactionId: "TXN-789012",
                  },
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
