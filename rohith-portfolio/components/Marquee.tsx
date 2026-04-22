import { marqueeTech } from "@/lib/portfolio-data";

export default function Marquee() {
  return (
    <div className="relative left-1/2 mb-28 w-screen -translate-x-1/2 overflow-hidden border-y border-[var(--color-rule)] bg-[var(--color-panel)] py-8 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] md:mb-36 md:py-10">
      <div className="marquee-track flex whitespace-nowrap">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-10 px-5 md:gap-20 md:px-10"
          >
            {marqueeTech.map((tech) => (
              <span key={tech} className="flex items-center gap-10 md:gap-20">
                <span className="font-mono text-4xl font-semibold uppercase italic tracking-[-0.06em] text-[var(--color-foreground)] opacity-80 md:text-6xl">
                  {tech}
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
