"use client";
import { motion } from "framer-motion";

const ADVENTURES = [
  {
    name: "Yosemite",
    loc: "High Sierra",
    bio: "Architectural Granite",
    icon: "🏔️",
  },
  {
    name: "Lake Tahoe",
    loc: "Alpine Zone",
    bio: "Deep Water Logic",
    icon: "❄️",
  },
  { name: "Burney Falls", loc: "Cascade", bio: "Systemic Flow", icon: "🌊" },
  { name: "Redwoods", loc: "Coast", bio: "Scalable Growth", icon: "🌲" },
];

export default function Travel() {
  return (
    <section className="mb-48">
      <div className="flex justify-between items-center mb-16">
        <h2 className="text-4xl font-bold text-white tracking-tighter italic">
          Landscape Inspiration
        </h2>
        <div className="h-[1px] flex-1 mx-8 bg-white/5" />
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          Off-Grid_Inputs
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {ADVENTURES.map((place, i) => (
          <motion.div
            key={place.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-center group"
          >
            <div className="text-4xl mb-4 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12 inline-block">
              {place.icon}
            </div>
            <h3 className="text-white font-bold group-hover:text-blue-400 transition-colors">
              {place.name}
            </h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">
              {place.loc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
