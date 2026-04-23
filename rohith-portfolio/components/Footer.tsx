import { socialLinks } from "@/lib/portfolio-data";

export default function Footer() {
  return (
    <footer className="relative z-10 mx-auto flex w-[min(1220px,calc(100%-1.5rem))] flex-col gap-6 border-t border-[var(--color-rule)] px-0 py-12 font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-label)] md:flex-row md:items-center md:justify-between">
      <p>© 2026 Rohith Singamaneni // Optimized for scale.</p>
      <div className="flex flex-wrap gap-6">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--color-accent)]"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
