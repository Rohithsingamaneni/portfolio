"use client";
export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs font-mono uppercase tracking-[0.2em] text-slate-600">
      <p>© 2026 Rohith Singamaneni // Optimized for scale.</p>
      <div className="flex gap-8">
        <a
          href="https://linkedin.com/in/rohithsingamaneni"
          target="_blank"
          className="hover:text-blue-500 transition-colors"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/singamanenirohith98"
          target="_blank"
          className="hover:text-blue-500 transition-colors"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
