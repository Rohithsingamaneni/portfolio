"use client";
import { motion } from "framer-motion";

export default function Capabilities() {
  return (
    <section className="mb-48">
      <h2 className="text-sm font-mono uppercase tracking-[0.5em] text-slate-600 mb-12">
        Architecture & Engineering
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="md:col-span-8 p-10 rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 relative group overflow-hidden"
        >
          <h3 className="text-4xl font-bold text-white mb-6 tracking-tight">
            Search Evaluation Pipelines
          </h3>
          <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
            Simulating production-scale traffic with Java/Spring Boot to
            validate ranking quality across 12+ global regions.
          </p>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
        <motion.div
          whileHover={{ y: -5 }}
          className="md:col-span-4 p-10 rounded-[2.5rem] bg-[#0A0A0A] border border-white/5"
        >
          <h3 className="text-2xl font-bold text-white mb-4">RAG Systems</h3>
          <p className="text-slate-400 leading-relaxed">
            Identifying search regressions via domain-specific semantic
            retrieval layers.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
