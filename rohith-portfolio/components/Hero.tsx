"use client";

import { ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { heroContent, RESUME_HREF, socialLinks } from "@/lib/portfolio-data";

export default function Hero() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () =>
        setStatusIndex(
          (current) => (current + 1) % heroContent.statusCycles.length
        ),
      3000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="top"
      className="hero-section relative mb-24 flex min-h-[calc(100vh-9rem)] items-center py-16 md:mb-28 md:py-20"
    >
      <div className="grid w-full gap-12">
        <div className="relative z-10 min-w-0">
          <div className="hero-status mb-10 flex items-center gap-4">
            <div className="h-px w-14 bg-[var(--color-accent)] opacity-60" />
            <div className="signal-pill px-4 py-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
              </span>
              {heroContent.statusCycles[statusIndex]}
            </div>
          </div>

          <h1 className="hero-title mb-8 text-[clamp(3.15rem,13vw,12.2rem)] font-black uppercase leading-[0.78] tracking-[-0.1em] text-[var(--color-foreground)] md:mb-10">
            {heroContent.firstName}
            <br />
            <span className="inline-block origin-left -skew-x-6 text-[var(--color-accent-strong)]">
              {heroContent.lastName}
            </span>
          </h1>

          <p className="hero-summary max-w-3xl text-[1.35rem] leading-[1.75] text-[var(--color-muted)] md:text-[1.75rem]">
            {heroContent.summary.intro}{" "}
            <strong className="font-semibold text-[var(--color-foreground)]">
              {heroContent.summary.emphasisOne}
            </strong>{" "}
            {heroContent.summary.middle}{" "}
            <strong className="font-semibold text-[var(--color-foreground)]">
              {heroContent.summary.emphasisTwo}
            </strong>{" "}
            {heroContent.summary.outro}
          </p>

          <div className="hero-actions mt-9 flex flex-wrap gap-4">
            <a href={RESUME_HREF} target="_blank" className="signal-pill">
              View Resume <ArrowUpRight size={14} />
            </a>
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="signal-pill--secondary"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <aside className="hero-panel glass-panel relative max-w-5xl overflow-hidden rounded-[2.5rem] p-6 md:p-8">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[var(--color-accent-soft)] blur-3xl" />
          <div className="relative space-y-8">
            <div className="flex items-center gap-3 text-[var(--color-accent)]">
              <Sparkles size={18} />
              <span className="font-mono text-xs uppercase tracking-[0.32em]">
                Current Signal
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {heroContent.currentFocus.map((focus) => (
                <div
                  key={focus}
                  className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-panel)] px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-foreground)]"
                >
                  {focus}
                </div>
              ))}
            </div>

            <div className="rounded-[1.75rem] border border-[var(--color-rule)] bg-[var(--color-panel)] p-5">
              <div className="mb-2 flex items-center gap-2 text-[var(--color-label)]">
                <MapPin size={16} />
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em]">
                  {heroContent.locationLabel}
                </span>
              </div>
              <p className="font-mono text-lg uppercase tracking-[0.16em] text-[var(--color-foreground)]">
                {heroContent.location}
              </p>
              <p className="mt-1 font-mono text-sm uppercase tracking-[0.18em] text-[var(--color-muted)]">
                {heroContent.coordinates}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
