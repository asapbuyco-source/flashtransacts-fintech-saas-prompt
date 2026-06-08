import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, Mail, Eye, Clock, CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import EmailPreview from "@/components/EmailPreview";
import type { EmailLog } from "@/store/appStore";

export default function EmailLogs() {
  const { emailLogs, notifications } = useAppStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);

  const filtered = emailLogs.filter((log) => {
    const matchesSearch =
      log.recipient.toLowerCase().includes(search.toLowerCase()) ||
      log.subject.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || log.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-danger" />;
      default:
        return <AlertCircle className="w-4 h-4 text-warning" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Email Logs</h1>
          <p className="text-sm text-text-secondary">Track all email delivery activity</p>
        </div>
        <button
          onClick={() => {
            const csv = [
              "recipient,subject,status,timestamp,opened,clicked",
              ...emailLogs.map((log) => `"${log.recipient}","${log.subject}","${log.status}","${log.timestamp}","${log.opened}","${log.clicked}"`),
            ].join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "flashtransacts-email-logs.csv";
            link.click();
            URL.revokeObjectURL(url);
          }}
          className="px-4 py-2 rounded-lg text-sm border border-white/10 hover:bg-white/5 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg text-sm"
        >
          <option value="all">All Status</option>
          <option value="delivered">Delivered</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Recipient</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Subject</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Timestamp</th>
                <th className="text-center text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Opened</th>
                <th className="text-center text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Clicked</th>
                <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <span className={`text-xs capitalize ${log.status === "delivered" ? "text-success" : log.status === "failed" ? "text-danger" : "text-warning"}`}>
                        {log.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{log.recipient}</td>
                  <td className="px-4 py-3 text-sm max-w-xs truncate">{log.subject}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-text-secondary">
                      <Clock className="w-3 h-3" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {log.opened ? (
                      <CheckCircle2 className="w-4 h-4 text-success mx-auto" />
                    ) : (
                      <span className="text-xs text-text-muted">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {log.clicked ? (
                      <CheckCircle2 className="w-4 h-4 text-success mx-auto" />
                    ) : (
                      <span className="text-xs text-text-muted">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-gold transition-colors ml-auto block"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            <Mail className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p>No email logs found</p>
          </div>
        )}
      </div>

      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border-glow"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h2 className="text-lg font-semibold">Logged Email Preview</h2>
              <button onClick={() => setSelectedLog(null)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <EmailPreview
                data={{
                  ...notifications.find((notification) => notification.id === selectedLog.notificationId),
                  recipient: selectedLog.recipient,
                  subject: selectedLog.subject,
                  status: selectedLog.status,
                  brand: selectedLog.brand,
                  amount: selectedLog.amount,
                  metadata: {
                    ...notifications.find((notification) => notification.id === selectedLog.notificationId)?.metadata,
                    ...selectedLog.metadata,
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
