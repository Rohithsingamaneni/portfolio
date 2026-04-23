"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

type PointerState = {
  x: number;
  y: number;
  active: boolean;
};

type NoiseField = {
  angleAt: (x: number, y: number, t: number) => number;
};

const GENERATIVE_SEED = 0xa04e4744;
const NOISE_SPATIAL_SCALE = 0.0015;
const NOISE_TIME_STEP = 0.0004;
const NOISE_STEER_STRENGTH = 0.06;
const NOISE_VELOCITY_DAMPING = 0.94;
const DESKTOP_PARTICLE_CAP = 160;
const LOW_TIER_PARTICLE_CAP = 70;
const REDUCED_MOTION_PARTICLE_CAP = 52;
const LOW_TIER_FRAME_INTERVAL_MS = 33;

function createSeededRng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createNoiseField(seed: number): NoiseField {
  const rng = createSeededRng(seed);
  const tableSize = 256;
  const mask = tableSize - 1;
  const permutation = new Uint8Array(tableSize * 2);
  const base = new Uint8Array(tableSize);

  for (let i = 0; i < tableSize; i += 1) {
    base[i] = i;
  }
  for (let i = tableSize - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = base[i];
    base[i] = base[j];
    base[j] = tmp;
  }
  for (let i = 0; i < tableSize * 2; i += 1) {
    permutation[i] = base[i & mask];
  }

  const gradients = new Float32Array(tableSize * 2);
  for (let i = 0; i < tableSize; i += 1) {
    const angle = rng() * Math.PI * 2;
    gradients[i * 2] = Math.cos(angle);
    gradients[i * 2 + 1] = Math.sin(angle);
  }

  const fade = (u: number) => u * u * u * (u * (u * 6 - 15) + 10);
  const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

  const gradIndex = (ix: number, iy: number) =>
    permutation[(permutation[ix & mask] + (iy & mask)) & mask];

  const sample = (x: number, y: number) => {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const xf = x - x0;
    const yf = y - y0;
    const u = fade(xf);
    const v = fade(yf);

    const g00 = gradIndex(x0, y0) * 2;
    const g10 = gradIndex(x0 + 1, y0) * 2;
    const g01 = gradIndex(x0, y0 + 1) * 2;
    const g11 = gradIndex(x0 + 1, y0 + 1) * 2;

    const n00 = gradients[g00] * xf + gradients[g00 + 1] * yf;
    const n10 = gradients[g10] * (xf - 1) + gradients[g10 + 1] * yf;
    const n01 = gradients[g01] * xf + gradients[g01 + 1] * (yf - 1);
    const n11 = gradients[g11] * (xf - 1) + gradients[g11 + 1] * (yf - 1);

    return lerp(lerp(n00, n10, u), lerp(n01, n11, u), v);
  };

  return {
    angleAt(x, y, t) {
      // Sample two offset slices of the field so the angle evolves with t
      // without introducing a full 3D noise implementation.
      const a = sample(x, y + t);
      const b = sample(x + 41.3, y - t + 17.7);
      return Math.atan2(b, a) * 2;
    },
  };
}

function readMeshColors() {
  const styles = getComputedStyle(document.documentElement);

  return {
    node:
      styles.getPropertyValue("--color-node-canvas").trim() ||
      "rgba(243,154,98,.76)",
    line:
      styles.getPropertyValue("--color-line-canvas").trim() ||
      "rgba(243,154,98,.34)",
  };
}

function classifyDeviceTier() {
  const cores =
    typeof navigator !== "undefined" && navigator.hardwareConcurrency
      ? navigator.hardwareConcurrency
      : 4;
  return cores < 8 || window.innerWidth < 768;
}

export default function ParticleBackground() {
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

    const noiseField = createNoiseField(GENERATIVE_SEED);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let particles: Particle[] = [];
    let animationFrame = 0;
    let meshColors = readMeshColors();
    let pointer: PointerState = { x: 0, y: 0, active: false };
    let isLowTier = classifyDeviceTier();
    let noiseTime = 0;
    let lastTimestamp = 0;
    let lastDrawTimestamp = 0;

    const initializeParticles = () => {
      const desktopCap = Math.min(
        DESKTOP_PARTICLE_CAP,
        Math.max(84, Math.floor(window.innerWidth / 12))
      );
      const count = reducedMotion.matches
        ? REDUCED_MOTION_PARTICLE_CAP
        : isLowTier
          ? Math.min(LOW_TIER_PARTICLE_CAP, desktopCap)
          : desktopCap;

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        ...createMotionVector(reducedMotion.matches),
        radius: Math.random() * 2.6 + 1.15,
      }));
    };

    const resize = () => {
      isLowTier = classifyDeviceTier();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      initializeParticles();
    };

    const step = (now: number) => {
      animationFrame = requestAnimationFrame(step);

      if (lastTimestamp === 0) {
        lastTimestamp = now;
        lastDrawTimestamp = now;
      }

      const rawDelta = now - lastTimestamp;
      lastTimestamp = now;
      // Clamp dt to avoid giant jumps after tab backgrounding.
      const dt = Math.min(3, Math.max(0, rawDelta / 16.667));

      if (isLowTier && now - lastDrawTimestamp < LOW_TIER_FRAME_INTERVAL_MS) {
        return;
      }
      lastDrawTimestamp = now;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const baseConnection = Math.min(220, Math.max(150, width * 0.105));
      const connectionDistance = isLowTier ? baseConnection * 0.75 : baseConnection;
      const connectionDistanceSquared = connectionDistance * connectionDistance;

      if (!reducedMotion.matches) {
        noiseTime += NOISE_TIME_STEP * dt;
      }

      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        if (!reducedMotion.matches) {
          const angle = noiseField.angleAt(
            particle.x * NOISE_SPATIAL_SCALE,
            particle.y * NOISE_SPATIAL_SCALE,
            noiseTime
          );
          particle.vx =
            particle.vx * NOISE_VELOCITY_DAMPING +
            Math.cos(angle) * NOISE_STEER_STRENGTH * dt;
          particle.vy =
            particle.vy * NOISE_VELOCITY_DAMPING +
            Math.sin(angle) * NOISE_STEER_STRENGTH * dt;

          particle.x += particle.vx * dt;
          particle.y += particle.vy * dt;

          applyPointerForce(particle, pointer, reducedMotion.matches, dt);
        }

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        context.beginPath();
        context.fillStyle = meshColors.node;
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });

      context.beginPath();
      context.strokeStyle = meshColors.line;
      context.lineWidth = 1.2;

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = dx * dx + dy * dy;

          if (distance < connectionDistanceSquared) {
            context.moveTo(particles[i].x, particles[i].y);
            context.lineTo(particles[j].x, particles[j].y);
          }
        }
      }

      context.stroke();
      drawPointerTethers(context, particles, pointer, meshColors.line, meshColors.node);
    };

    const updateColors = () => {
      meshColors = readMeshColors();
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer = {
        x: event.clientX,
        y: event.clientY,
        active: true,
      };
    };

    const handlePointerLeave = () => {
      pointer = { ...pointer, active: false };
    };

    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    reducedMotion.addEventListener("change", resize);

    resize();
    animationFrame = requestAnimationFrame(step);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      reducedMotion.removeEventListener("change", resize);
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div
      className="particle-background pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      data-testid="particle-background"
    >
      <div className="ambient-layer ambient-layer--one" />
      <div className="ambient-layer ambient-layer--two" />
      <div className="particle-depth" />
      <div className="dot-matrix" data-testid="particle-dot-matrix" />
      <canvas ref={canvasRef} className="mesh-canvas" data-testid="particle-canvas" />
    </div>
  );
}

function createMotionVector(isReducedMotion: boolean) {
  if (isReducedMotion) {
    return { vx: 0, vy: 0 };
  }

  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 0.28 + 0.2;

  return {
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
  };
}

function applyPointerForce(
  particle: Particle,
  pointer: PointerState,
  isReducedMotion: boolean,
  dt: number
) {
  if (!pointer.active || isReducedMotion) {
    return;
  }

  const dx = particle.x - pointer.x;
  const dy = particle.y - pointer.y;
  const distanceSquared = dx * dx + dy * dy;
  const radius = 190;

  if (distanceSquared <= 0.01 || distanceSquared > radius * radius) {
    return;
  }

  const distance = Math.sqrt(distanceSquared);
  const force = (1 - distance / radius) * 2.8 * dt;

  particle.x += (dx / distance) * force;
  particle.y += (dy / distance) * force;
}

function drawPointerTethers(
  context: CanvasRenderingContext2D,
  particles: Particle[],
  pointer: PointerState,
  lineColor: string,
  nodeColor: string
) {
  if (!pointer.active) {
    return;
  }

  const radius = 175;
  const radiusSquared = radius * radius;

  context.beginPath();
  context.strokeStyle = lineColor;
  context.lineWidth = 1.45;

  particles.forEach((particle) => {
    const dx = particle.x - pointer.x;
    const dy = particle.y - pointer.y;
    const distanceSquared = dx * dx + dy * dy;

    if (distanceSquared < radiusSquared) {
      context.moveTo(pointer.x, pointer.y);
      context.lineTo(particle.x, particle.y);
    }
  });

  context.stroke();
  context.beginPath();
  context.fillStyle = nodeColor;
  context.arc(pointer.x, pointer.y, 3.5, 0, Math.PI * 2);
  context.fill();
}
