import SectionEyebrow from "@/components/SectionEyebrow";
import { education } from "@/lib/portfolio-data";

export default function Education() {
  return (
    <section id="education" className="section-block scroll-reveal">
      <SectionEyebrow label="Credentials_&_Education" />

      <div className="grid gap-6 md:grid-cols-2">
        {education.map((item) => (
          <article
            key={item.degree}
            className="surface-panel flex flex-col justify-between p-6 md:p-8"
          >
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-rule)] bg-[var(--color-background)] px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-accent)]">
                {item.date}
              </div>
              <h3 className="mb-2 text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
                {item.degree}
              </h3>
              <p className="font-mono text-sm uppercase tracking-widest text-[var(--color-muted)]">
                {item.university}
              </p>
            </div>
            <div className="mt-8 font-mono text-sm font-semibold text-[var(--color-foreground)]">
              {item.gpa}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
