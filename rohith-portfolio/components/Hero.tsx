"use client";
import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const STATUS_CYCLES = [
  "Active @ Apple HQ",
  "Optimizing RAG Pipelines",
  "High Strain @ Gym",
  "Clustering M2 Pro Nodes",
];

export default function Hero() {
  const [statusIndex, setStatusIndex] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(springY, [0, 1000], [10, -10]);
  const rotateY = useTransform(springX, [0, 1920], [-10, 10]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    const interval = setInterval(
      () => setStatusIndex((s) => (s + 1) % STATUS_CYCLES.length),
      3000
    );
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, [mouseX, mouseY]);

  return (
    <section className="relative mb-48 pt-32 lg:pt-48 perspective-1000">
      <motion.div className="flex items-center gap-4 mb-10">
        <div className="h-[1px] w-12 bg-blue-500/50" />
        <div className="px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative h-2 w-2 rounded-full bg-blue-500"></span>
          </span>
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">
            {STATUS_CYCLES[statusIndex]}
          </span>
        </div>
      </motion.div>

      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
        <h1 className="text-7xl md:text-9xl font-bold text-white mb-12 tracking-tighter leading-[0.8] drop-shadow-2xl">
          ROHITH <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-600">
            SINGAMANENI
          </span>
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-end">
        <p className="text-xl md:text-2xl text-slate-400 leading-relaxed font-light">
          Engineering <span className="text-white">Distributed Resilience</span>{" "}
          and <span className="text-white">AI Infrastructure</span> at Apple.
          Focusing on gRPC pipelines and non-blocking RAG architectures.
        </p>
        <div className="md:text-right">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">
            Deployment Zone
          </p>
          <p className="text-sm font-mono text-white tracking-widest uppercase">
            Newark, CA // 37.52° N, 122.03° W
          </p>
        </div>
      </div>
    </section>
  );
}
