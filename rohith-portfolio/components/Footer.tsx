import { navItems, socialLinks } from "@/lib/portfolio-data";

export default function Footer() {
  return (
    <footer className="relative z-10 mx-auto w-[min(1220px,calc(100%-1.5rem))] px-0 pb-12 pt-20 border-t border-[var(--color-rule)]">
      <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
        
        {/* Brand / Status Column */}
        <div className="flex flex-col items-start gap-6">
          <div className="font-sans text-2xl font-black uppercase tracking-tighter text-[var(--color-foreground)]">
            Rohith<br />Singamaneni
          </div>
          <div className="inline-flex items-center gap-3 rounded-full border border-[var(--color-rule)] bg-[var(--color-background)] px-4 py-2 font-mono text-xs uppercase tracking-widest text-[var(--color-label)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            </span>
            Active
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-[var(--color-muted)]">
            Backend software engineer specializing in distributed systems, AI infrastructure, and resilient platform design.
          </p>
        </div>

        {/* Sitemap Column */}
        <div className="flex flex-col gap-5 font-mono text-xs uppercase tracking-widest">
          <h4 className="text-[var(--color-foreground)] font-semibold mb-2">Sitemap</h4>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Connect Column */}
        <div className="flex flex-col gap-5 font-mono text-xs uppercase tracking-widest">
          <h4 className="text-[var(--color-foreground)] font-semibold mb-2">Connect</h4>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
            >
              {link.label}
            </a>
          ))}
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-[var(--color-rule)] pt-8 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--color-subtle)] md:flex-row">
        <p>© {new Date().getFullYear()} Rohith Singamaneni</p>
        <div className="flex items-center gap-6">
          <span>Pacific Time (PT)</span>
          <span>Optimized for scale.</span>
        </div>
      </div>
    </footer>
  );
}
