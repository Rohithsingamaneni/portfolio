import { Radio, Sparkles, Workflow } from "lucide-react";
import ChapterMarker from "@/components/ChapterMarker";
import SectionEyebrow from "@/components/SectionEyebrow";
import { contactContent } from "@/lib/portfolio-data";

export default function Contact() {
  return (
    <section id="contact" className="section-block scroll-reveal">
      <ChapterMarker label="V — SIGNAL" />
      <SectionEyebrow label={contactContent.eyebrow} />

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-6">
          <h2 className="display-title max-w-[10ch] text-balance">
            {contactContent.titleLead}{" "}
            <span className="text-[var(--color-accent-strong)]">
              {contactContent.titleAccent}
            </span>
          </h2>
          <p className="max-w-2xl text-lg leading-8 text-[var(--color-muted)] md:text-[1.35rem]">
            {contactContent.description}
          </p>
        </div>

        <aside className="contact-signal-card glass-panel relative overflow-hidden rounded-[2rem] p-6 md:p-8">
          <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[var(--color-accent-soft)] blur-3xl" />
          <div className="relative space-y-8">
            <div className="flex items-center gap-3 text-[var(--color-accent)]">
              <span className="icon-tile h-12 w-12">
                <Radio size={20} />
              </span>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-label)]">
                  Signal Status
                </p>
                <p className="mt-1 text-lg font-semibold text-[var(--color-foreground)]">
                  Open for focused technical conversations
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-panel)] p-4">
                <Sparkles className="mb-4 text-[var(--color-accent)]" size={20} />
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-label)]">
                  Best Fit
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  AI infrastructure, search quality, and distributed backend systems.
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-panel)] p-4">
                <Workflow className="mb-4 text-[var(--color-accent)]" size={20} />
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-label)]">
                  Working Style
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  Deep ownership, resilient systems, and crisp technical execution.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
