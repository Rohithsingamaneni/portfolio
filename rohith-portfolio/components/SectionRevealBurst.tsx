"use client";

import { useEffect, useRef, useState } from "react";

type BurstParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  radius: number;
  color: string;
};

type BurstColors = {
  accent: string;
  node: string;
};

const TARGET_SELECTOR = ".section-block.scroll-reveal, .hero-section";
const PARTICLE_CAP = 360;
const MIN_PER_BURST = 36;
const MAX_PER_BURST = 48;
const MIN_SPEED = 1.6;
const MAX_SPEED = 3.4;
const MIN_RADIUS = 1.4;
const MAX_RADIUS = 2.6;
const VELOCITY_DAMPING = 0.96;
const LIFE_DECAY = 1 / 36;
const EYEBROW_SELECTOR = ".section-eyebrow";
const FALLBACK_INSET = 48;
const FALLBACK_STAGGER_MS = 80;

function readBurstColors(): BurstColors {
  const styles = getComputedStyle(document.documentElement);
  return {
    accent: styles.getPropertyValue("--color-accent").trim() || "#f39a62",
    node:
      styles.getPropertyValue("--color-node-canvas").trim() ||
      "rgba(243,154,98,.76)",
  };
}

export default function SectionRevealBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Track reduced-motion preference separately so we can re-render (and skip
  // rendering the canvas entirely) when it flips on.
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const onChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };
    mql.addEventListener("change", onChange);
    return () => {
      mql.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let particles: BurstParticle[] = [];
    let colors = readBurstColors();
    let animationFrame = 0;
    const fallbackTimeouts: number[] = [];

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const resolveOrigin = (section: Element): { x: number; y: number } => {
      const eyebrow = section.querySelector(EYEBROW_SELECTOR);
      if (eyebrow) {
        const rect = eyebrow.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }
      const rect = section.getBoundingClientRect();
      return {
        x: rect.left + FALLBACK_INSET,
        y: rect.top + FALLBACK_INSET,
      };
    };

    const spawnBurst = (section: Element) => {
      const origin = resolveOrigin(section);
      const count =
        MIN_PER_BURST +
        Math.floor(Math.random() * (MAX_PER_BURST - MIN_PER_BURST + 1));
      const step = (Math.PI * 2) / count;

      for (let i = 0; i < count; i += 1) {
        if (particles.length >= PARTICLE_CAP) {
          break;
        }
        const angle = i * step + (Math.random() * 0.4 - 0.2);
        const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
        const radius = MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS);
        const color = Math.random() < 0.5 ? colors.accent : colors.node;
        particles.push({
          x: origin.x,
          y: origin.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          radius,
          color,
        });
      }
    };

    const step = () => {
      animationFrame = requestAnimationFrame(step);

      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (particles.length === 0) {
        return;
      }

      const next: BurstParticle[] = [];
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= VELOCITY_DAMPING;
        p.vy *= VELOCITY_DAMPING;
        p.life -= LIFE_DECAY;
        if (p.life <= 0) {
          continue;
        }
        context.globalAlpha = p.life;
        context.fillStyle = p.color;
        context.beginPath();
        context.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
        context.fill();
        next.push(p);
      }
      context.globalAlpha = 1;
      particles = next;
    };

    const updateColors = () => {
      colors = readBurstColors();
    };

    const themeObserver = new MutationObserver(updateColors);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    window.addEventListener("resize", resize);
    resize();
    animationFrame = requestAnimationFrame(step);

    const targets = Array.from(document.querySelectorAll(TARGET_SELECTOR));

    let intersectionObserver: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      intersectionObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }
            spawnBurst(entry.target);
            obs.unobserve(entry.target);
          });
        },
        {
          threshold: 0.18,
          rootMargin: "0px 0px -8% 0px",
        }
      );
      targets.forEach((el) => intersectionObserver?.observe(el));
    } else {
      // Fallback: stagger bursts so a non-IO browser doesn't spike load.
      targets.forEach((el, index) => {
        const id = window.setTimeout(
          () => spawnBurst(el),
          index * FALLBACK_STAGGER_MS
        );
        fallbackTimeouts.push(id);
      });
    }

    return () => {
      window.removeEventListener("resize", resize);
      intersectionObserver?.disconnect();
      themeObserver.disconnect();
      cancelAnimationFrame(animationFrame);
      fallbackTimeouts.forEach((id) => window.clearTimeout(id));
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 4 }}
      data-testid="section-reveal-burst"
    />
  );
}
