"use client";
import React from "react";
import { motion } from "framer-motion";

const ACTIVITIES = [
  {
    title: "Physical Latency",
    value: "High Intensity",
    detail: "Leg Day @ 6:00 AM",
    icon: "🏋️",
    color: "from-orange-500/20",
    border: "border-orange-500/20",
  },
  {
    title: "RAG Throughput",
    value: "1.2k tokens/sec",
    detail: "Local Llama 3.1 Node",
    icon: "🤖",
    color: "from-blue-500/20",
    border: "border-blue-500/20",
  },
  {
    title: "System Recovery",
    value: "94%",
    detail: "WHOOP Data Sync Complete",
    icon: "⌚",
    color: "from-green-500/20",
    border: "border-green-500/20",
  },
  {
    title: "Context Switching",
    value: "Acoustic Mode",
    detail: "Fender CD-60S Session",
    icon: "🎸",
    color: "from-purple-500/20",
    border: "border-purple-500/20",
  },
];

export default function Activity() {
  return (
    <section className="mb-48">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-3xl font-bold text-white tracking-tighter">
          Live Activity Feed
        </h2>
        <div className="h-[1px] flex-1 bg-white/5" />
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">
          Status: Operational
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ACTIVITIES.map((act, i) => (
          <motion.div
            key={act.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-[2rem] bg-gradient-to-br ${act.color} to-transparent border ${act.border} backdrop-blur-md relative overflow-hidden group cursor-default`}
          >
            <div className="relative z-10">
              <span className="text-3xl mb-4 block">{act.icon}</span>
              <h3 className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-1">
                {act.title}
              </h3>
              <p className="text-2xl font-bold text-white mb-2">{act.value}</p>
              <p className="text-[10px] text-slate-500 font-mono italic">
                {act.detail}
              </p>
            </div>

            {/* Animated Grid Background Overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
