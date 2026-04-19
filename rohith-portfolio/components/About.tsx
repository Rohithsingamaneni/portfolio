"use client";
export default function About() {
  return (
    <section className="mb-48">
      <h2 className="text-sm font-mono uppercase tracking-[0.5em] text-slate-600 mb-12">
        Beyond Deployment
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-tight italic">
          Engineering is <br className="hidden md:block" /> professional play.
        </h3>
        <div className="space-y-6 text-xl text-slate-400 font-light leading-relaxed">
          <p>
            Whether it's optimizing search ranking at <strong>Apple</strong> or
            building multi-modal RAG systems in my home lab, I'm driven by the
            "What if?".
          </p>
          <p>
            I treat my personal infrastructure with the same rigor as
            production code—constantly tuning, optimizing, or simply
            context-switching with a Fender CD-60S acoustic session.
          </p>
        </div>
      </div>
    </section>
  );
}
