import SectionEyebrow from "@/components/SectionEyebrow";
import { aboutContent } from "@/lib/portfolio-data";

export default function About() {
  return (
    <section id="about" className="section-block scroll-reveal">
      <SectionEyebrow label="Beyond Deployment" />
      <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
        <h3 className="display-title max-w-[9ch] text-balance italic text-[var(--color-foreground)]">
          {aboutContent.title}
        </h3>
        <div className="space-y-8 text-lg leading-9 text-[var(--color-muted)] md:text-[1.35rem] md:leading-10">
          {aboutContent.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
