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

    let particles: Particle[] = [];
    let animationFrame = 0;
    let meshColors = readMeshColors();
    let pointer: PointerState = { x: 0, y: 0, active: false };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const initializeParticles = () => {
      const count = reducedMotion.matches
        ? 52
        : Math.min(150, Math.max(84, Math.floor(window.innerWidth / 12)));

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        ...createMotionVector(reducedMotion.matches),
        radius: Math.random() * 2.6 + 1.15,
      }));
    };

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      initializeParticles();
    };

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const connectionDistance = Math.min(220, Math.max(150, width * 0.105));
      const connectionDistanceSquared = connectionDistance * connectionDistance;

      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        if (!reducedMotion.matches) {
          applyPointerForce(particle, pointer, reducedMotion.matches);
          particle.x += particle.vx;
          particle.y += particle.vy;
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
      animationFrame = requestAnimationFrame(draw);
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
    draw();

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
  isReducedMotion: boolean
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
  const force = (1 - distance / radius) * 2.8;

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
