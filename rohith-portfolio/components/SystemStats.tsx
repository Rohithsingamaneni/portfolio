"use client";
import { motion } from "framer-motion";

const STATS = [
  { label: "RAG Latency", value: "84ms", color: "text-blue-400" },
  { label: "WHOOP Recovery", value: "92%", color: "text-green-400" },
  { label: "Leg Day Strain", value: "18.4", color: "text-red-400" },
  { label: "Throughput", value: "125k/s", color: "text-blue-400" },
];

export default function SystemStats() {
  return (
    <section className="mb-48 grid grid-cols-2 md:grid-cols-4 gap-4">
      {STATS.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-8 rounded-3xl bg-white/[0.02] border border-white/5"
        >
          <span
            className={`text-4xl font-bold tracking-tighter ${s.color} block mb-1`}
          >
            {s.value}
          </span>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            {s.label}
          </span>
        </motion.div>
      ))}
    </section>
  );
}
