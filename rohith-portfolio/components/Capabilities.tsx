"use client";
import { motion } from "framer-motion";

export default function Capabilities() {
  return (
    <section className="mb-48">
      <h2 className="text-sm font-mono uppercase tracking-[0.5em] text-slate-600 mb-12">
        Architecture & Engineering
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 relative group overflow-hidden"
        >
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Search & AI Infrastructure</h3>
          <p className="text-slate-400 leading-relaxed text-sm md:text-base">
            Simulating production-scale traffic and validating ranking quality via domain-specific RAG layers.
          </p>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 hover:border-blue-500/20 transition-colors"
        >
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Distributed Backend</h3>
          <p className="text-slate-400 leading-relaxed text-sm md:text-base">
            Architecting resilient Spring Boot microservices, high-throughput gRPC pipelines, and real-time Kafka event flows.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 hover:border-blue-500/20 transition-colors"
        >
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Full Stack Systems</h3>
          <p className="text-slate-400 leading-relaxed text-sm md:text-base">
            Building responsive React dashboards integrated with low-latency WebSocket APIs and Redis caching.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
