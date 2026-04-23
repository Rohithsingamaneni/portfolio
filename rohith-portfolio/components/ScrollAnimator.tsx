"use client";

import { useEffect } from "react";

const ANIMATED_SELECTOR = [
  ".scroll-reveal",
  ".signal-card",
  ".timeline-card",
  ".timeline-card .tech-chip",
  ".contact-signal-card",
].join(",");

export default function ScrollAnimator() {
  useEffect(() => {
    const root = document.documentElement;
    const animatedElements = Array.from(
      document.querySelectorAll<HTMLElement>(ANIMATED_SELECTOR)
    );
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    root.classList.add("motion-ready");

    animatedElements.forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${(index % 5) * 80}ms`);
    });

    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
      animatedElements.forEach((element) => element.classList.add("is-visible"));
      return () => {
        root.classList.remove("motion-ready");
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.16,
      }
    );

    animatedElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      root.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
