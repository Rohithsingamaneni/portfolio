"use client";

import { useEffect, useRef } from "react";

type Burst = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  radius: number;
  color: string;
};

type AccentPalette = {
  accent: string;
  accentStrong: string;
};

const TARGET_SELECTOR = ".signal-pill, .signal-pill--secondary, .tech-chip";
const MAX_PARTICLES = 240;
const SPAWN_COOLDOWN_MS = 250;
const LIFE_DECAY = 1 / 48;

function toRgba(raw: string, fallback: string): string {
  const value = raw.trim() || fallback;

  if (value.startsWith("#")) {
    const hex = value.slice(1);
    const normalized =
      hex.length === 3
        ? hex
            .split("")
            .map((char) => char + char)
            .join("")
        : hex;
    const intVal = Number.parseInt(normalized, 16);
    if (Number.isNaN(intVal)) {
      return fallback;
    }
    const r = (intVal >> 16) & 255;
    const g = (intVal >> 8) & 255;
    const b = intVal & 255;
    return `rgba(${r}, ${g}, ${b}, 1)`;
  }

  if (value.startsWith("rgb")) {
    return value;
  }

  return fallback;
}

function readAccentPalette(): AccentPalette {
  const styles = getComputedStyle(document.documentElement);
  return {
    accent: toRgba(styles.getPropertyValue("--color-accent"), "rgba(243, 154, 98, 1)"),
    accentStrong: toRgba(
      styles.getPropertyValue("--color-accent-strong"),
      "rgba(255, 157, 92, 1)"
    ),
  };
}

export default function ParticleHoverLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let animationFrame = 0;
    let resizeFrame = 0;
    let palette = readAccentPalette();
    const particles: Burst[] = [];
    // WeakMap keyed by element so debounce info is GC'd alongside DOM nodes.
    const lastSpawnAt = new WeakMap<Element, number>();

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const scheduleResize = () => {
      if (resizeFrame) {
        cancelAnimationFrame(resizeFrame);
      }
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        resize();
      });
    };

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      context.clearRect(0, 0, width, height);

      if (particles.length === 0) {
        animationFrame = requestAnimationFrame(draw);
        return;
      }

      context.save();
      context.globalCompositeOperation = "lighter";

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.015;
        particle.vx *= 0.985;
        particle.vy *= 0.985;
        particle.life -= LIFE_DECAY;

        if (particle.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const drawRadius = Math.max(0.1, particle.radius * particle.life);
        context.globalAlpha = Math.max(0, Math.min(1, particle.life));
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(particle.x, particle.y, drawRadius, 0, Math.PI * 2);
        context.fill();
      }

      context.restore();
      animationFrame = requestAnimationFrame(draw);
    };

    const spawnBurst = (element: Element) => {
      if (particles.length >= MAX_PARTICLES) {
        return;
      }

      const now = performance.now();
      const previous = lastSpawnAt.get(element) ?? 0;
      // 250ms cooldown per-element prevents mash-hover from saturating the particle cap.
      if (now - previous < SPAWN_COOLDOWN_MS) {
        return;
      }
      lastSpawnAt.set(element, now);

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const count = 12 + Math.floor(Math.random() * 7);

      for (let i = 0; i < count; i += 1) {
        if (particles.length >= MAX_PARTICLES) {
          break;
        }

        const edgePick = Math.random();
        let spawnX: number;
        let spawnY: number;
        if (edgePick < 0.25) {
          spawnX = rect.left + Math.random() * rect.width;
          spawnY = rect.top;
        } else if (edgePick < 0.5) {
          spawnX = rect.left + Math.random() * rect.width;
          spawnY = rect.bottom;
        } else if (edgePick < 0.75) {
          spawnX = rect.left;
          spawnY = rect.top + Math.random() * rect.height;
        } else {
          spawnX = rect.right;
          spawnY = rect.top + Math.random() * rect.height;
        }

        const dx = spawnX - centerX;
        const dy = spawnY - centerY;
        const magnitude = Math.hypot(dx, dy) || 1;
        const speed = 0.6 + Math.random() * 1.4;
        const jitter = (Math.random() - 0.5) * 0.6;

        particles.push({
          x: spawnX,
          y: spawnY,
          vx: (dx / magnitude) * speed + jitter,
          vy: (dy / magnitude) * speed + jitter - 0.3,
          life: 1,
          radius: 1.4 + Math.random() * 1.8,
          color: Math.random() < 0.5 ? palette.accent : palette.accentStrong,
        });
      }
    };

    const handlePointerOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const match = target.closest(TARGET_SELECTOR);
      if (match) {
        spawnBurst(match);
      }
    };

    const updatePalette = () => {
      palette = readAccentPalette();
    };

    const themeObserver = new MutationObserver(updatePalette);

    const attach = () => {
      document.addEventListener("pointerover", handlePointerOver, { passive: true });
      window.addEventListener("resize", scheduleResize);
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
      resize();
      animationFrame = requestAnimationFrame(draw);
    };

    const detach = () => {
      document.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("resize", scheduleResize);
      themeObserver.disconnect();
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
      if (resizeFrame) {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = 0;
      }
      particles.length = 0;
      if (canvas) {
        const ratio = window.devicePixelRatio || 1;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    const handleReducedMotionChange = () => {
      if (disposed) {
        return;
      }
      if (reducedMotion.matches) {
        detach();
      } else {
        attach();
      }
    };

    if (!reducedMotion.matches) {
      attach();
    }
    reducedMotion.addEventListener("change", handleReducedMotionChange);

    return () => {
      disposed = true;
      reducedMotion.removeEventListener("change", handleReducedMotionChange);
      detach();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[5]"
      data-testid="particle-hover-layer"
    />
  );
}
