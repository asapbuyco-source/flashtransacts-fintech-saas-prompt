import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { modules } from "@/lib/data";

export default function ModulesSection() {
  return (
    <section id="modules" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 radial-overlay" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-medium tracking-widest uppercase mb-4 block">Supported Platforms</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Multi-Platform{" "}
            <span className="gold-text">Notifications</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Create consistent transaction notification previews for major finance workflows with reusable templates.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {modules.map((module, index) => (
            <motion.div
              key={module.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="glass rounded-xl p-5 card-hover group cursor-pointer"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-white font-bold text-sm"
                style={{ backgroundColor: module.color }}
              >
                {module.name.charAt(0)}
              </div>
              <h3 className="text-sm font-semibold mb-1">{module.name}</h3>
              <p className="text-xs text-text-muted mb-4 line-clamp-2">{module.description}</p>
              <button className="flex items-center gap-1.5 text-xs text-gold hover:text-gold-light transition-colors">
                <Eye className="w-3 h-3" />
                Preview
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
