import SectionEyebrow from "@/components/SectionEyebrow";
import { experiences } from "@/lib/portfolio-data";

export default function Experience() {
  return (
    <section id="experience" className="section-block scroll-reveal">
      <SectionEyebrow label="Professional_History" />

      <div className="relative pl-7 md:pl-10">
        <div className="timeline-rail absolute bottom-0 left-2 top-0 w-px bg-[linear-gradient(to_bottom,transparent,var(--color-accent),var(--color-rule),transparent)] md:left-3" />

        <div className="timeline-deck space-y-8">
          {experiences.map((experience, index) => {
            const fanClass =
              ["exp-card--a", "exp-card--b", "exp-card--c"][index] ?? "";
            return (
            <div className={`relative ${fanClass}`} key={`${experience.company}-${experience.date}`}>
              <span className="absolute -left-[1.75rem] top-8 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-[var(--color-accent)] bg-[var(--color-background)] md:-left-[2.25rem]">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_20px_var(--color-accent)]" />
              </span>

              <article
                className={`timeline-card timeline-card-alt surface-panel relative overflow-hidden p-6 pb-12 md:p-8 md:pb-14 ${
                  experience.featured ? "border-[var(--color-border)]" : ""
                }`}
              >
                <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--color-foreground)] md:text-3xl">
                      {experience.role}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <p className="font-mono text-sm uppercase tracking-[0.22em] text-[var(--color-accent)]">
                        @ {experience.company}
                      </p>
                      {experience.featured && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/60 bg-[var(--color-accent-soft)] px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.26em] text-[var(--color-accent)]">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-70" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                          </span>
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-label)] lg:text-right">
                    <p>{experience.date}</p>
                    <p className="mt-2 tracking-[0.12em] text-[var(--color-subtle)]">
                      {experience.location}
                    </p>
                  </div>
                </div>

                <p className="mt-8 max-w-5xl text-base leading-8 text-[var(--color-muted)] md:text-lg">
                  {experience.description}
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {experience.tech.map((tech) => (
                    <span key={tech} className="tech-chip px-3 py-2">
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
