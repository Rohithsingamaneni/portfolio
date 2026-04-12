"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Tinker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.2, y: y * 0.2 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <section className="mb-48 py-20 border-y border-white/5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <h2 className="text-5xl font-bold text-white mb-8 tracking-tighter">
            Engineering is <br />
            <span className="italic text-blue-500">Professional Play.</span>
          </h2>
          <p className="text-xl text-slate-400 font-light leading-relaxed mb-8">
            Whether it's optimizing search ranking at <strong>Apple</strong> or
            building multi-modal RAG systems in my home lab, I'm driven by the
            "What if?" I treat my personal infrastructure with the same rigor as
            production code.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-[#020202] bg-slate-800 flex items-center justify-center text-xs"
                >
                  {i === 1 ? "☕" : i === 2 ? "💻" : "⚡"}
                </div>
              ))}
            </div>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              Fueled by Data & Discipline
            </span>
          </div>
        </div>

        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={reset}
          animate={{ x: position.x, y: position.y }}
          className="relative aspect-square rounded-[3rem] bg-white/[0.02] border border-white/10 flex items-center justify-center group overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="text-center z-10">
            <div className="text-6xl mb-4 animate-bounce">🛠️</div>
            <p className="text-sm font-mono text-blue-400 tracking-widest uppercase">
              Hover to Interact
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
