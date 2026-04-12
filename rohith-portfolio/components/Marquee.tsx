"use client";
const TECH = [
  "Spring Boot",
  "Kafka",
  "Snowflake",
  "gRPC",
  "RAG",
  "PostgreSQL",
  "WebFlux",
  "LangChain",
  "Ollama",
  "Redis",
];

export default function Marquee() {
  return (
    <div className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-hidden mb-48 py-10 border-y border-white/5 bg-white/[0.01]">
      <div className="flex whitespace-nowrap animate-infinite-scroll">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-20 items-center px-10">
            {TECH.map((t) => (
              <span
                key={t}
                className="text-4xl md:text-6xl font-bold text-white/5 hover:text-blue-500/30 transition-colors uppercase font-mono italic"
              >
                {t}
              </span>
            ))}
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-infinite-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
