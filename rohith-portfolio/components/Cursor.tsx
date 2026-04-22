"use client";

import { useEffect, useRef, useState } from "react";

type CursorMode = "default" | "link" | "button" | "toggle" | "hide";

const RING_LERP = 0.18;
const SQUASH_LERP = 0.25;
const DOT_SIZE = 6;

const BUTTON_SELECTOR =
  ".signal-pill, .signal-pill--secondary, .tech-chip, .nav-link, .icon-tile, button[type='button']";
const TOGGLE_SELECTOR = ".theme-toggle, [role='switch']";
const LINK_SELECTOR = "a[href], [role='link']";
const HIDE_SELECTOR = "[data-cursor='hide']";

const MODE_SIZES: Record<CursorMode, number> = {
  default: 34,
  link: 44,
  button: 34,
  toggle: 34,
  hide: 34,
};

const MODE_RESTING_SCALE: Record<CursorMode, number> = {
  default: 1,
  link: 1,
  button: 1.6,
  toggle: 1.8,
  hide: 1,
};

function readAccent(): string {
  const styles = getComputedStyle(document.documentElement);
  const raw = styles.getPropertyValue("--color-accent").trim();
  return raw || "#f39a62";
}

function readAccentSoft(): string {
  const styles = getComputedStyle(document.documentElement);
  const raw = styles.getPropertyValue("--color-accent-soft").trim();
  return raw || "rgba(243, 154, 98, 0.16)";
}

function isExternalLink(el: Element): boolean {
  if (el.getAttribute("target") === "_blank") {
    return true;
  }
  const href = el.getAttribute("href");
  if (!href) {
    return false;
  }
  if (href.startsWith("http://") || href.startsWith("https://")) {
    try {
      const parsed = new URL(href, window.location.href);
      return parsed.origin !== window.location.origin;
    } catch {
      return false;
    }
  }
  return false;
}

function detectMode(target: Element | null): CursorMode {
  if (!target) {
    return "default";
  }
  if (target.closest(HIDE_SELECTOR)) {
    return "hide";
  }
  if (target.closest(TOGGLE_SELECTOR)) {
    return "toggle";
  }
  const link = target.closest(LINK_SELECTOR);
  if (link && isExternalLink(link)) {
    return "link";
  }
  if (target.closest(BUTTON_SELECTOR)) {
    return "button";
  }
  return "default";
}

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const coarse = window.matchMedia("(pointer: coarse)");
    setEnabled(!coarse.matches);

    const handleCoarseChange = (event: MediaQueryListEvent) => {
      setEnabled(!event.matches);
    };
    coarse.addEventListener("change", handleCoarseChange);

    return () => {
      coarse.removeEventListener("change", handleCoarseChange);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const dot = dotRef.current;
    const ring = ringRef.current;
    const arrow = arrowRef.current;
    if (!dot || !ring || !arrow) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReducedMotion = reducedMotion.matches;

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let lastPointerX = pointerX;
    let lastPointerY = pointerY;
    let ringX = pointerX;
    let ringY = pointerY;

    // Physics state.
    let smoothStretch = 0;
    let smoothAngle = 0;
    let lastSpeed = 0;
    let landingPulse = 0;
    let pressed = false;
    let dotPulseUntil = 0;

    // Mode state.
    let mode: CursorMode = "default";
    let currentSize: number = MODE_SIZES.default;
    let currentRestingScale: number = MODE_RESTING_SCALE.default;
    let currentMode: CursorMode = "default";

    // Idle state.
    let lastMoveAt = performance.now();
    let revealed = false;
    let animationFrame = 0;
    let accent = readAccent();
    let accentSoft = readAccentSoft();

    const applyMode = (next: CursorMode) => {
      if (next === currentMode) {
        return;
      }
      currentMode = next;
      currentSize = MODE_SIZES[next];
      currentRestingScale = MODE_RESTING_SCALE[next];

      const px = `${currentSize}px`;
      ring.style.width = px;
      ring.style.height = px;

      if (next === "toggle") {
        ring.style.borderRadius = "20%";
      } else {
        ring.style.borderRadius = "50%";
      }

      if (next === "button" || next === "toggle") {
        ring.style.borderWidth = "1px";
        ring.style.backgroundColor = accentSoft;
      } else {
        ring.style.borderWidth = "1.5px";
        ring.style.backgroundColor = "transparent";
      }

      if (next === "hide") {
        dot.style.opacity = "0";
        ring.style.opacity = "0";
      } else {
        dot.style.opacity = revealed ? "1" : "0";
        ring.style.opacity = revealed ? "1" : "0";
      }

      arrow.style.opacity = next === "link" ? "1" : "0";
    };

    const applyTransforms = (now: number) => {
      // Dot: exact pointer follow, with optional click flash.
      const dotScale = now < dotPulseUntil ? 1.5 : 1;
      dot.style.transform = `translate3d(${pointerX - DOT_SIZE / 2}px, ${
        pointerY - DOT_SIZE / 2
      }px, 0) scale(${dotScale})`;

      // Ring position — centered on spring-lerped point.
      const halfSize = currentSize / 2;
      const pressScale = pressed ? 0.7 : 1;

      if (isReducedMotion) {
        // Flat transform — morph-only, no velocity physics.
        ring.style.transform = `translate3d(${ringX - halfSize}px, ${
          ringY - halfSize
        }px, 0) scale(${currentRestingScale * pressScale})`;
        return;
      }

      // Compose squash-and-stretch: scale along motion axis, squeeze perpendicular.
      const baseScale = currentRestingScale * pressScale + landingPulse;
      const stretch = smoothStretch; // 0..1ish
      const scaleX = baseScale * (1 + stretch * 0.4);
      const scaleY = baseScale * (1 - stretch * 0.5);

      // Idle breathing — subtle 3% sine pulse when fully at rest.
      const idleFor = now - lastMoveAt;
      let breath = 0;
      if (idleFor > 2000 && mode !== "hide") {
        breath = Math.sin((now - lastMoveAt - 2000) / 239) * 0.03;
      }

      const finalScaleX = scaleX * (1 + breath);
      const finalScaleY = scaleY * (1 + breath);

      ring.style.transform = `translate3d(${ringX - halfSize}px, ${
        ringY - halfSize
      }px, 0) rotate(${smoothAngle}rad) scale(${finalScaleX}, ${finalScaleY})`;
    };

    const step = () => {
      const now = performance.now();

      const vx = pointerX - lastPointerX;
      const vy = pointerY - lastPointerY;
      const speed = Math.sqrt(vx * vx + vy * vy);

      if (!isReducedMotion) {
        ringX += (pointerX - ringX) * RING_LERP;
        ringY += (pointerY - ringY) * RING_LERP;

        // Detect "just stopped" — trigger a landing squish.
        if (lastSpeed > 6 && speed < 1 && landingPulse < 0.04) {
          landingPulse = 0.05;
        }
        // Decay the landing pulse.
        landingPulse *= 0.82;
        if (landingPulse < 0.001) {
          landingPulse = 0;
        }

        // Smooth stretch target based on speed, clamped.
        const targetStretch = Math.min(speed / 120, 0.4);
        smoothStretch += (targetStretch - smoothStretch) * SQUASH_LERP;

        // Smooth angle — only update when there's real motion to avoid jitter.
        if (speed > 0.5) {
          const targetAngle = Math.atan2(vy, vx);
          // Shortest-arc interpolation to avoid snapping across pi boundary.
          let delta = targetAngle - smoothAngle;
          while (delta > Math.PI) {
            delta -= Math.PI * 2;
          }
          while (delta < -Math.PI) {
            delta += Math.PI * 2;
          }
          smoothAngle += delta * SQUASH_LERP;
        }
      } else {
        ringX = pointerX;
        ringY = pointerY;
        smoothStretch = 0;
        smoothAngle = 0;
        landingPulse = 0;
      }

      lastPointerX = pointerX;
      lastPointerY = pointerY;
      lastSpeed = speed;

      applyTransforms(now);
      animationFrame = requestAnimationFrame(step);
    };

    const reveal = () => {
      if (revealed) {
        return;
      }
      revealed = true;
      dot.style.display = "block";
      ring.style.display = "block";
      if (mode !== "hide") {
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      pointerX = event.clientX;
      pointerY = event.clientY;
      lastMoveAt = performance.now();
      if (!revealed) {
        // Seed ring & last-pointer at current pointer so it doesn't fly in.
        ringX = pointerX;
        ringY = pointerY;
        lastPointerX = pointerX;
        lastPointerY = pointerY;
        reveal();
      }
    };

    const handlePointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      const target = event.target instanceof Element ? event.target : null;
      const next = detectMode(target);
      mode = next;
      applyMode(next);
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      // If the related target is still interactive, keep the current mode.
      const related =
        event.relatedTarget instanceof Element ? event.relatedTarget : null;
      const nextMode = detectMode(related);
      if (nextMode !== mode) {
        mode = nextMode;
        applyMode(nextMode);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      pressed = true;
      dotPulseUntil = performance.now() + 80;
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      pressed = false;
    };

    const handleDocumentLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const handleDocumentEnter = () => {
      if (revealed && mode !== "hide") {
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };

    const updateAccent = () => {
      accent = readAccent();
      accentSoft = readAccentSoft();
      dot.style.backgroundColor = accent;
      ring.style.borderColor = accent;
      arrow.style.color = accent;
      if (currentMode === "button" || currentMode === "toggle") {
        ring.style.backgroundColor = accentSoft;
      }
    };

    const themeObserver = new MutationObserver(updateAccent);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      isReducedMotion = event.matches;
      if (isReducedMotion) {
        smoothStretch = 0;
        smoothAngle = 0;
        landingPulse = 0;
      }
    };

    // Prime initial color state.
    dot.style.backgroundColor = accent;
    ring.style.borderColor = accent;
    arrow.style.color = accent;
    applyMode("default");

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    document.addEventListener("pointerover", handlePointerOver, { passive: true });
    document.addEventListener("pointerout", handlePointerOut, { passive: true });
    document.addEventListener("pointerleave", handleDocumentLeave);
    document.addEventListener("pointerenter", handleDocumentEnter);
    reducedMotion.addEventListener("change", handleReducedMotionChange);

    animationFrame = requestAnimationFrame(step);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      document.removeEventListener("pointerleave", handleDocumentLeave);
      document.removeEventListener("pointerenter", handleDocumentEnter);
      reducedMotion.removeEventListener("change", handleReducedMotionChange);
      themeObserver.disconnect();
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: "50%",
          backgroundColor: "currentColor",
          pointerEvents: "none",
          zIndex: 60,
          mixBlendMode: "difference",
          display: "none",
          opacity: 0,
          willChange: "transform",
          transform: "translate3d(-100px, -100px, 0)",
          transition: "opacity 160ms ease",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: MODE_SIZES.default,
          height: MODE_SIZES.default,
          borderRadius: "50%",
          border: "1.5px solid currentColor",
          backgroundColor: "transparent",
          pointerEvents: "none",
          zIndex: 60,
          display: "none",
          opacity: 0,
          willChange: "transform",
          transform: "translate3d(-100px, -100px, 0)",
          transition:
            "width 220ms cubic-bezier(0.22, 1, 0.36, 1), height 220ms cubic-bezier(0.22, 1, 0.36, 1), border-radius 220ms cubic-bezier(0.22, 1, 0.36, 1), border-width 220ms cubic-bezier(0.22, 1, 0.36, 1), background-color 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 160ms ease",
        }}
      >
        <span
          ref={arrowRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            fontSize: 12,
            lineHeight: 1,
            color: "currentColor",
            opacity: 0,
            transition: "opacity 180ms ease",
            pointerEvents: "none",
          }}
        >
          {"↗"}
        </span>
      </div>
    </>
  );
}
