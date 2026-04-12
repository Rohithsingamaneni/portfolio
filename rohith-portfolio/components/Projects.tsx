"use client";
import { motion } from "framer-motion";

export default function Projects() {
  return (
    <section className="mb-48">
      <div className="flex items-center gap-4 mb-16">
        <h2 className="text-sm font-mono uppercase tracking-[0.5em] text-slate-600">
          Active_Projects
        </h2>
        <div className="h-[1px] flex-1 bg-white/5" />
      </div>

      <div className="group relative p-12 rounded-[3rem] bg-[#050505] border border-white/5 overflow-hidden transition-all hover:border-blue-500/30">
        <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-start">
          <div className="lg:w-2/3">
            <span className="inline-block px-3 py-1 rounded-md bg-blue-500/10 text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-6">
              AI-Powered Talent Analysis
            </span>
            <h3 className="text-5xl font-bold text-white mb-6 tracking-tighter italic">
              AI Resume Intelligence
            </h3>
            <p className="text-xl text-slate-400 leading-relaxed mb-8">
              A high-performance evaluator built with{" "}
              <span className="text-blue-400 font-mono text-lg">
                Spring Boot WebFlux
              </span>
              . Implementing a non-blocking pipeline that coordinates{" "}
              <span className="text-white">document parsing</span>,
              <span className="text-white">semantic retrieval</span>, and{" "}
              <span className="text-white">local LLM inference</span> (Ollama)
              to provide deep-context feedback on engineering candidates.
            </p>
            <div className="flex gap-4">
              {["Spring Boot", "pgvector", "Ollama", "WebFlux"].map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] font-mono text-slate-500 uppercase"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:w-1/3 w-full aspect-square rounded-2xl bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-white/5 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            <div className="text-center">
              <div className="text-6xl mb-4">📑</div>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                System Architecture: RAG-V1
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
