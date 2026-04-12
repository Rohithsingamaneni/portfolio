"use client";
export default function About() {
  return (
    <section className="mb-48">
      <h2 className="text-sm font-mono uppercase tracking-[0.5em] text-slate-600 mb-12">
        Beyond Deployment
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <h3 className="text-5xl font-bold text-white tracking-tighter leading-tight italic">
          If it's a system, <br /> I'll tune it.
        </h3>
        <div className="space-y-6 text-xl text-slate-400 font-light">
          <p>
            Treating physical recovery with the same precision as system
            latency—utilizing{" "}
            <span className="text-blue-400">WHOOP biometrics</span> for training
            optimization.
          </p>
          <p>
            Spending weekends building{" "}
            <span className="text-indigo-400">RAG applications</span> or
            context-switching with a Fender CD-60S acoustic session.
          </p>
        </div>
      </div>
    </section>
  );
}
