import SectionEyebrow from "@/components/SectionEyebrow";
import { featuredProject } from "@/lib/portfolio-data";

export default function Projects() {
  return (
    // Outer stage provides scroll runway; inner pin stays sticky while the
    // RAG diagram assembles itself one node/arrow at a time.
    <section id="projects" className="project-stage section-block scroll-reveal">
      <div className="project-pin">
        <SectionEyebrow label="Active_Projects" />

        <article className="glass-panel relative overflow-hidden rounded-[2.5rem] p-6 md:rounded-[3rem] md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_50%,var(--color-accent-soft),transparent_35%)]" />
          <div className="relative grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <span className="mb-8 inline-flex rounded-xl border border-[var(--color-border)] bg-[var(--color-accent-soft)] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                {featuredProject.eyebrow}
              </span>
              <h3 className="mb-7 max-w-xl text-5xl font-black italic leading-[0.95] tracking-[-0.08em] text-[var(--color-foreground)] md:text-7xl">
                {featuredProject.title}
              </h3>
              <p className="max-w-3xl text-lg leading-9 text-[var(--color-muted)] md:text-xl">
                {featuredProject.description}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                {featuredProject.technologies.map((tech) => (
                  <span key={tech} className="tech-chip">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="project-diagram project-diagram-dramatic min-h-[26rem] rounded-[2rem]">
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 420 340"
                aria-hidden="true"
              >
                {/* pathLength="1" normalizes each path so stroke-dasharray:1
                    and stroke-dashoffset:1 hide it completely; scroll-driven
                    keyframes animate dashoffset 1→0 to draw each arrow. */}
                <path
                  className="arrow-path arrow-doc-rag"
                  d="M 210 62 L 210 145"
                  pathLength="1"
                />
                <path
                  className="arrow-path arrow-rag-vec"
                  d="M 210 145 L 98 220"
                  pathLength="1"
                />
                <path
                  className="arrow-path arrow-rag-llm"
                  d="M 210 145 L 322 220"
                  pathLength="1"
                />
                <path
                  className="arrow-path arrow-vec-out"
                  d="M 98 220 L 210 286"
                  pathLength="1"
                />
                <path
                  className="arrow-path arrow-llm-out"
                  d="M 322 220 L 210 286"
                  pathLength="1"
                />
              </svg>
              <span className="diagram-node diagram-node--doc left-1/2 top-[14%] -translate-x-1/2">
                DOC
              </span>
              <span className="diagram-node diagram-node--rag diagram-node--active left-1/2 top-[40%] -translate-x-1/2">
                RAG
              </span>
              <span className="diagram-node diagram-node--vec left-[18%] top-[60%]">
                VEC
              </span>
              <span className="diagram-node diagram-node--llm right-[18%] top-[60%]">
                LLM
              </span>
              <span className="diagram-node diagram-node--out bottom-[12%] left-1/2 -translate-x-1/2">
                OUT
              </span>
              <p className="absolute inset-x-8 top-[53%] text-center font-mono text-xs uppercase tracking-[0.32em] text-[var(--color-label)]">
                {featuredProject.diagramLabel}
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
