"use client";
import { motion } from "framer-motion";

const EXPERIENCES = [
  {
    company: "Apple",
    role: "Software Engineer",
    location: "Cupertino, CA",
    date: "Mar 2025 – Present",
    description: "Leading backend development for Apple Maps search evaluation. Designing distributed gRPC pipelines and domain-specific RAG layers to automate ranking-quality validation across global regions.",
    tech: ["Java", "Spring Boot", "gRPC", "RAG", "Snowflake"],
  },
  {
    company: "Neuro Leap Corp",
    role: "Full Stack Developer",
    location: "Costa Mesa, CA",
    date: "May 2024 – Feb 2025",
    description: "Built resilient Spring Boot microservices and real-time WebSocket APIs for a cognitive-assessment platform, integrating edge devices with cloud infrastructure and clinician dashboards.",
    tech: ["Spring Boot", "Redis", "WebSocket", "React", "AWS S3"],
  },
  {
    company: "Cognizant",
    role: "Software Engineer",
    location: "Bangalore, India",
    date: "Apr 2021 – Jul 2022",
    description: "Modernized legacy HR infrastructure by transitioning to Spring Boot microservices, optimizing high-concurrency operations with GraphQL, and designing real-time Kafka event flows.",
    tech: ["Spring Boot", "GraphQL", "Kafka", "PostgreSQL", "AWS RDS"],
  },
];

export default function Experience() {
  return (
    <section className="mb-48 relative">
      <div className="flex items-center gap-4 mb-16">
        <h2 className="text-sm font-mono uppercase tracking-[0.5em] text-slate-600">
          Professional_History
        </h2>
        <div className="h-[1px] flex-1 bg-white/5" />
      </div>

      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
        {EXPERIENCES.map((exp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            {/* Timeline Dot */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-[#050505] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </div>

            {/* Content Box */}
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-3rem)] p-6 md:p-8 rounded-[2rem] md:rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm transition-colors hover:border-blue-500/30">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-4 gap-2">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {exp.role}
                  </h3>
                  <p className="text-blue-400 font-mono text-sm mt-1">
                    @ {exp.company}
                  </p>
                </div>
                <div className="text-left xl:text-right">
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                    {exp.date}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">{exp.location}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-slate-400 text-sm leading-relaxed">
                  {exp.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {exp.tech.map((t, j) => (
                  <span
                    key={j}
                    className="px-2 py-1 rounded bg-white/5 text-[10px] font-mono text-slate-400 uppercase tracking-wider"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
