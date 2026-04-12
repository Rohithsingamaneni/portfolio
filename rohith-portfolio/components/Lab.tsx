"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const LOGS = [
  "> Checking M2 Pro Cluster...",
  "> Node 01: Online (48GB RAM)",
  "> Connecting Local pgvector...",
  "> Vectorizing Resume Data...",
  "> Running Semantic Query...",
  "> SUCCESS: Latency 84ms",
];

export default function Lab() {
  const [active, setActive] = useState<string[]>([]);
  useEffect(() => {
    const i = setInterval(
      () => setActive((p) => [...p, LOGS[p.length % LOGS.length]].slice(-5)),
      1500
    );
    return () => clearInterval(i);
  }, []);

  return (
    <section className="mb-48">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold text-white mb-6">
            The Tinkerer's Lab
          </h2>
          <p className="text-slate-400 leading-relaxed mb-6">
            I build custom RAG applications on a local Mac cluster to handle
            talent analysis without external APIs. If it's a protocol, hardware
            fixture, or embedding pipeline, it's getting optimized.
          </p>
        </div>
        <div className="bg-[#050505] border border-white/10 rounded-3xl p-6 font-mono text-sm h-64 flex flex-col justify-end">
          {active.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={
                l.includes("SUCCESS") ? "text-green-400" : "text-blue-400/70"
              }
            >
              {l}
            </motion.div>
          ))}
          <div className="w-2 h-4 bg-blue-500 animate-pulse ml-1 inline-block" />
        </div>
      </div>
    </section>
  );
}
