"use client";

import { useEffect, useRef, useState } from "react";
// `flubber` ships without type declarations; narrow the import locally so the
// rest of the module stays strictly typed.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error -- no bundled types for flubber
import { interpolate as flubberInterpolate } from "flubber";

type PathInterpolator = (t: number) => string;

const interpolate = flubberInterpolate as (
  pathA: string,
  pathB: string,
  options?: { maxSegmentLength?: number }
) => PathInterpolator;

// Four organic, similarly oriented blobs in a 600x600 coordinate space.
// Kept to ~6-8 bezier segments each with matching start points for a clean
// flubber morph.
const BLOB_SHAPES: readonly string[] = [
  "M 300 60 C 430 80, 540 200, 520 340 C 500 470, 370 550, 250 530 C 120 510, 50 390, 80 260 C 110 130, 210 50, 300 60 Z",
  "M 300 80 C 450 100, 500 220, 540 340 C 560 470, 400 560, 280 540 C 140 520, 70 400, 50 270 C 30 140, 180 70, 300 80 Z",
  "M 310 50 C 440 90, 560 180, 520 320 C 500 460, 390 540, 260 540 C 110 530, 40 380, 60 240 C 80 120, 200 40, 310 50 Z",
  "M 290 70 C 420 60, 540 170, 520 310 C 510 450, 400 560, 270 540 C 130 510, 60 380, 70 250 C 90 130, 170 60, 290 70 Z",
];

// Loop back to the first shape to keep the morph seamless.
const MORPH_LOOP: readonly string[] = [...BLOB_SHAPES, BLOB_SHAPES[0]];

// Progress advance per ms -> ~12s total cycle across the 4 shapes and back.
const PROGRESS_PER_MS = 0.00012 / 1.44; // 1 / 12000ms ≈ 0.0000833
const CYCLE_PROGRESS_PER_MS = 1 / 12000;

type BlendMode = "screen" | "multiply";

function readBlendMode(): BlendMode {
  if (typeof document === "undefined") return "screen";
  const theme = document.documentElement.dataset.theme;
  return theme === "light" ? "multiply" : "screen";
}

export default function HeroBlob() {
  const pathRef = useRef<SVGPathElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const lastTimestampRef = useRef<number | null>(null);
  const [blendMode, setBlendMode] = useState<BlendMode>("screen");

  useEffect(() => {
    if (typeof window === "undefined") return;

    setBlendMode(readBlendMode());

    const observer = new MutationObserver(() => {
      setBlendMode(readBlendMode());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Precompute the pairwise interpolators once; each pair morphs from
    // shape[i] to shape[i + 1], and the final pair closes the loop.
    const pairs: PathInterpolator[] = MORPH_LOOP.slice(0, -1).map((path, i) =>
      interpolate(path, MORPH_LOOP[i + 1], { maxSegmentLength: 2 })
    );
    const segmentCount = pairs.length;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Silence unused-variable linting while also giving a callable shortcut.
    void PROGRESS_PER_MS;

    const renderStatic = () => {
      const node = pathRef.current;
      if (!node) return;
      node.setAttribute("d", BLOB_SHAPES[0]);
    };

    const renderAt = (progress: number) => {
      const node = pathRef.current;
      if (!node) return;
      const wrapped = ((progress % 1) + 1) % 1;
      const scaled = wrapped * segmentCount;
      const idx = Math.min(Math.floor(scaled), segmentCount - 1);
      const localT = scaled - idx;
      node.setAttribute("d", pairs[idx](localT));
    };

    const tick = (now: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = now;
      }
      const dt = Math.min(64, now - lastTimestampRef.current);
      lastTimestampRef.current = now;

      progressRef.current += CYCLE_PROGRESS_PER_MS * dt;
      renderAt(progressRef.current);
      rafRef.current = window.requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (rafRef.current !== null) return;
      lastTimestampRef.current = null;
      rafRef.current = window.requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimestampRef.current = null;
    };

    const sync = () => {
      if (reducedMotion.matches) {
        stopLoop();
        renderStatic();
      } else {
        // Make sure the current frame reflects our stored progress so a late
        // start from reduced-motion mode still looks continuous.
        renderAt(progressRef.current);
        startLoop();
      }
    };

    sync();

    const handleReducedChange = () => sync();
    reducedMotion.addEventListener("change", handleReducedChange);

    return () => {
      reducedMotion.removeEventListener("change", handleReducedChange);
      stopLoop();
    };
  }, []);

  return (
    <svg
      className="hero-blob"
      viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-6%",
        top: "12%",
        width: "62%",
        height: "78%",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.9,
        mixBlendMode: blendMode,
      }}
    >
      <defs>
        <linearGradient
          id="hero-blob-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop
            offset="0%"
            stopColor="var(--color-accent)"
            stopOpacity="0.55"
          />
          <stop
            offset="100%"
            stopColor="var(--color-accent-strong)"
            stopOpacity="0.15"
          />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d={BLOB_SHAPES[0]}
        fill="url(#hero-blob-gradient)"
        style={{ filter: "blur(32px)" }}
      />
    </svg>
  );
}
