"use client";

import { useEffect, useState } from "react";

type Section = {
  key: string;
  label: string;
  position: number;
};

const SECTIONS: readonly Section[] = [
  { key: "hero", label: "01 — SIGNAL", position: 5 },
  { key: "capabilities", label: "02 — CAPABILITIES", position: 24 },
  { key: "experience", label: "03 — EXPERIENCE", position: 42 },
  { key: "projects", label: "04 — PROJECTS", position: 62 },
  { key: "about", label: "05 — HUMAN LAYER", position: 80 },
  { key: "contact", label: "06 — SIGNAL OUT", position: 95 },
] as const;

export default function ScrollSignal() {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const motionMql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerMql = window.matchMedia("(pointer: coarse)");

    setIsReducedMotion(motionMql.matches);
    setIsCoarsePointer(pointerMql.matches);

    const onMotion = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    const onPointer = (e: MediaQueryListEvent) => setIsCoarsePointer(e.matches);
    motionMql.addEventListener("change", onMotion);
    pointerMql.addEventListener("change", onPointer);

    return () => {
      motionMql.removeEventListener("change", onMotion);
      pointerMql.removeEventListener("change", onPointer);
    };
  }, []);

  if (isReducedMotion || isCoarsePointer) return null;

  return (
    <div className="scroll-signal" aria-hidden="true">
      <div className="scroll-signal__track" />
      {SECTIONS.map((section) => (
        <div
          key={`dot-${section.key}`}
          className={`scroll-signal__dot scroll-signal__dot--${section.key}`}
          style={{ left: `${section.position}%` }}
        />
      ))}
      <div className="scroll-signal__trail scroll-signal__trail--three" />
      <div className="scroll-signal__trail scroll-signal__trail--two" />
      <div className="scroll-signal__trail scroll-signal__trail--one" />
      <div className="scroll-signal__traveller">
        <div className="scroll-signal__pulse" />
        <div className="scroll-signal__label-stack">
          {SECTIONS.map((section) => (
            <span
              key={`label-${section.key}`}
              className={`scroll-signal__label scroll-signal__label--${section.key}`}
            >
              {section.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
