"use client";

import { useEffect } from "react";

const MAGNET_SELECTOR =
  ".signal-pill, .signal-pill--secondary, .tech-chip, .nav-link, .theme-toggle";
const FALLOFF_RADIUS = 120;
const MAX_STRENGTH = 8;
const TRANSITION = "transform 160ms cubic-bezier(0.16, 1, 0.3, 1)";

type TargetState = {
  element: HTMLElement;
  prevTransform: string;
  prevTransition: string;
  prevWillChange: string;
};

export default function MagneticLayer() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const coarse = window.matchMedia("(pointer: coarse)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let targets: TargetState[] = [];
    let observer: MutationObserver | null = null;
    let queryFrame = 0;
    let attached = false;

    const resetElement = (state: TargetState) => {
      state.element.style.transform = state.prevTransform;
      state.element.style.transition = state.prevTransition;
      state.element.style.willChange = state.prevWillChange;
    };

    const resetAll = () => {
      targets.forEach(resetElement);
    };

    const collect = () => {
      const next: TargetState[] = [];
      const seen = new Set<HTMLElement>();
      document.querySelectorAll<HTMLElement>(MAGNET_SELECTOR).forEach((el) => {
        if (el.hasAttribute("data-no-magnet")) {
          return;
        }
        seen.add(el);
        const existing = targets.find((t) => t.element === el);
        if (existing) {
          next.push(existing);
          return;
        }
        next.push({
          element: el,
          prevTransform: el.style.transform,
          prevTransition: el.style.transition,
          prevWillChange: el.style.willChange,
        });
        el.style.transition = TRANSITION;
        el.style.willChange = "transform";
      });
      // Reset anything that dropped out of the DOM / matches.
      targets.forEach((t) => {
        if (!seen.has(t.element) && t.element.isConnected) {
          resetElement(t);
        }
      });
      targets = next;
    };

    const scheduleCollect = () => {
      if (queryFrame) {
        return;
      }
      queryFrame = requestAnimationFrame(() => {
        queryFrame = 0;
        collect();
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      const px = event.clientX;
      const py = event.clientY;
      for (const state of targets) {
        const el = state.element;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = px - cx;
        const dy = py - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > FALLOFF_RADIUS || dist === 0) {
          el.style.transform = "translate3d(0, 0, 0)";
          continue;
        }
        // Linear falloff keeps the feel snappy near edge, soft at the boundary.
        const strength = (1 - dist / FALLOFF_RADIUS) * MAX_STRENGTH;
        const ox = (dx / dist) * strength;
        const oy = (dy / dist) * strength;
        // Clamp to +-MAX_STRENGTH to guarantee no overflow that could shift layout.
        const clampedX = Math.max(-MAX_STRENGTH, Math.min(MAX_STRENGTH, ox));
        const clampedY = Math.max(-MAX_STRENGTH, Math.min(MAX_STRENGTH, oy));
        el.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0)`;
      }
    };

    const handlePointerLeave = () => {
      for (const state of targets) {
        state.element.style.transform = "translate3d(0, 0, 0)";
      }
    };

    const attach = () => {
      if (attached) {
        return;
      }
      attached = true;
      collect();
      observer = new MutationObserver(scheduleCollect);
      observer.observe(document.body, { childList: true, subtree: true });
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("pointerleave", handlePointerLeave);
    };

    const detach = () => {
      if (!attached) {
        return;
      }
      attached = false;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      observer?.disconnect();
      observer = null;
      if (queryFrame) {
        cancelAnimationFrame(queryFrame);
        queryFrame = 0;
      }
      resetAll();
      targets = [];
    };

    const shouldRun = () => !coarse.matches && !reducedMotion.matches;

    const handlePreferenceChange = () => {
      if (shouldRun()) {
        attach();
      } else {
        detach();
      }
    };

    if (shouldRun()) {
      attach();
    }
    coarse.addEventListener("change", handlePreferenceChange);
    reducedMotion.addEventListener("change", handlePreferenceChange);

    return () => {
      coarse.removeEventListener("change", handlePreferenceChange);
      reducedMotion.removeEventListener("change", handlePreferenceChange);
      detach();
    };
  }, []);

  return null;
}
