import { ArrowUpRight, Code } from "lucide-react";
import { otherProjects } from "@/lib/portfolio-data";

export default function OtherProjects() {
  return (
    <section className="section-block scroll-reveal mt-16">
      <h4 className="mb-10 text-center font-mono text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-label)]">
        Other Engineering Work
      </h4>

      <div className="grid gap-6 md:grid-cols-2">
        {otherProjects.map((project) => (
          <a
            key={project.title}
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="glass-panel group flex flex-col justify-between rounded-3xl p-6 transition-all hover:-translate-y-1 hover:border-[var(--color-accent)] md:p-8"
          >
            <div>
              <div className="mb-6 flex items-center justify-between text-[var(--color-accent)]">
                <Code size={24} />
                <ArrowUpRight
                  size={20}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                />
              </div>
              <h3 className="mb-4 text-xl font-bold tracking-tight text-[var(--color-foreground)] transition-colors group-hover:text-[var(--color-accent)]">
                {project.title}
              </h3>
              <p className="mb-8 text-sm leading-relaxed text-[var(--color-muted)]">
                {project.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-[var(--color-rule)] bg-[var(--color-background)] px-2 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-[var(--color-label)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
