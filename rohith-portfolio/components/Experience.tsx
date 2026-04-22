import SectionEyebrow from "@/components/SectionEyebrow";
import { experiences } from "@/lib/portfolio-data";

export default function Experience() {
  return (
    <section id="experience" className="section-block scroll-reveal">
      <SectionEyebrow label="Professional_History" />

      <div className="relative pl-7 md:pl-10">
        <div className="timeline-rail absolute bottom-0 left-2 top-0 w-px bg-[linear-gradient(to_bottom,transparent,var(--color-accent),var(--color-rule),transparent)] md:left-3" />

        <div className="space-y-8">
          {experiences.map((experience) => (
            <article
              key={`${experience.company}-${experience.date}`}
              className={`timeline-card surface-panel relative overflow-hidden p-6 md:p-8 ${
                experience.featured ? "border-[var(--color-border)]" : ""
              }`}
            >
              <span className="absolute -left-[1.75rem] top-8 flex h-5 w-5 items-center justify-center rounded-full border border-[var(--color-accent)] bg-[var(--color-background)] md:-left-[2.25rem]">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_20px_var(--color-accent)]" />
              </span>

              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
                <div>
                  <h3 className="text-2xl font-bold text-[var(--color-foreground)] md:text-3xl">
                    {experience.role}
                  </h3>
                  <p className="mt-2 font-mono text-sm uppercase tracking-[0.22em] text-[var(--color-accent)]">
                    @ {experience.company}
                  </p>
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

              {experience.featured && (
                <p className="absolute right-6 top-6 hidden font-mono text-[0.66rem] uppercase tracking-[0.32em] text-[var(--color-accent)] md:block">
                  Current
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
