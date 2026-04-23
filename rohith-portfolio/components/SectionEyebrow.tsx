"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "cover" | "exit" | "done";

const PHASE_1_MS = 240;
const PHASE_2_MS = 240;
const RULE_DRAW_MS = 240;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function SectionEyebrow({ label }: { label: string }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) {
      setReducedMotion(true);
      setPhase("done");
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setPhase("done");
      return;
    }

    const node = rootRef.current;
    if (!node) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            observer.disconnect();
            // Phase 1: mask slides in from left and covers the text.
            setPhase("cover");
            // Phase 2: mask continues past the text, revealing it.
            timeouts.push(
              setTimeout(() => {
                setPhase("exit");
              }, PHASE_1_MS)
            );
            // Settled final state; triggers the trailing rule draw-in.
            timeouts.push(
              setTimeout(() => {
                setPhase("done");
              }, PHASE_1_MS + PHASE_2_MS)
            );
            break;
          }
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      for (const t of timeouts) clearTimeout(t);
    };
  }, []);

  // Mask transform:
  //   idle          -> translateX(-100%) (off-screen left)
  //   cover         -> translateX(0%)    (fully covers text)
  //   exit | done   -> translateX(100%)  (has swept off right)
  const maskTransform =
    phase === "idle"
      ? "translateX(-100%)"
      : phase === "cover"
        ? "translateX(0%)"
        : "translateX(100%)";

  const maskTransitionDuration =
    phase === "cover" ? `${PHASE_1_MS}ms` : phase === "exit" ? `${PHASE_2_MS}ms` : "0ms";

  // Text is hidden until phase 2 starts ("exit"), then reveals with a clip-path wipe
  // that tracks the mask's exit sweep.
  const textClip =
    phase === "idle" || phase === "cover" ? "inset(0 100% 0 0)" : "inset(0 0 0 0)";

  const textTransitionDuration = phase === "exit" || phase === "done" ? `${PHASE_2_MS}ms` : "0ms";

  // Trailing rule draws in only after both mask phases complete.
  const ruleScale = phase === "done" ? 1 : 0;

  return (
    <div ref={rootRef} className="mb-10 flex items-center gap-4 md:mb-14">
      <span
        className="relative inline-block overflow-hidden align-baseline"
        style={{ lineHeight: 1 }}
      >
        <span
          className="section-eyebrow"
          style={{
            display: "inline-block",
            clipPath: reducedMotion ? "inset(0 0 0 0)" : textClip,
            WebkitClipPath: reducedMotion ? "inset(0 0 0 0)" : textClip,
            transition: reducedMotion
              ? undefined
              : `clip-path ${textTransitionDuration} ${EASE}, -webkit-clip-path ${textTransitionDuration} ${EASE}`,
          }}
        >
          {label}
        </span>
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "var(--color-accent)",
            transform: reducedMotion ? "translateX(100%)" : maskTransform,
            transition: reducedMotion
              ? undefined
              : `transform ${maskTransitionDuration} ${EASE}`,
            willChange: "transform",
            pointerEvents: "none",
          }}
        />
      </span>
      <div
        className="h-px flex-1 bg-[var(--color-rule)]"
        style={{
          transform: `scaleX(${reducedMotion ? 1 : ruleScale})`,
          transformOrigin: "left",
          transition: reducedMotion ? undefined : `transform ${RULE_DRAW_MS}ms ${EASE}`,
          willChange: "transform",
        }}
      />
    </div>
  );
}
