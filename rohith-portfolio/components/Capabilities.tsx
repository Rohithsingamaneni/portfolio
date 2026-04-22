import type { LucideIcon } from "lucide-react";
import { Code2, Monitor, Search } from "lucide-react";
import SectionEyebrow from "@/components/SectionEyebrow";
import { capabilities } from "@/lib/portfolio-data";

const iconMap: Record<(typeof capabilities)[number]["icon"], LucideIcon> = {
  search: Search,
  monitor: Monitor,
  code: Code2,
};

export default function Capabilities() {
  return (
    <section id="capabilities" className="section-block scroll-reveal">
      <SectionEyebrow label="Architecture & Engineering" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {capabilities.map((capability, index) => {
          const Icon = iconMap[capability.icon];
          const trajectoryClass =
            ["capability-card--a", "capability-card--b", "capability-card--c"][index] ?? "";

          return (
            <article
              key={capability.title}
              className={`signal-card surface-panel group relative min-h-[21rem] overflow-hidden p-7 transition-transform duration-300 hover:-translate-y-2 md:p-9 ${trajectoryClass}`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,var(--color-accent-soft),transparent_35%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <span className="icon-tile mb-12">
                  <Icon size={22} />
                </span>
                <h3 className="mb-5 text-2xl font-bold leading-tight text-[var(--color-foreground)]">
                  {capability.title}
                </h3>
                <p className="text-base leading-8 text-[var(--color-muted)]">
                  {capability.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
