"use client";

import { useEffect } from "react";

const LERP_FACTOR = 0.08;
const WHEEL_MULTIPLIER = 1;
const NAV_OFFSET = 96;
const ARROW_STEP = 40;
const PAGE_FRACTION = 0.9;
const SNAP_THRESHOLD = 0.1;
const EXTERNAL_JUMP_THRESHOLD = 50;
const TOUCH_INERTIA_FRICTION = 0.94;
const TOUCH_INERTIA_MIN_VELOCITY = 0.05;
const INPUT_COOLDOWN_MS = 80;

export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let attached = false;
    let currentY = 0;
    let targetY = 0;
    let rafId = 0;
    let lastInputAt = 0;
    let touchLastY = 0;
    let touchLastTime = 0;
    let touchVelocity = 0;
    let inertiaActive = false;
    let prevScrollBehavior = "";
    let resizeObserver: ResizeObserver | null = null;

    const getMaxScroll = () =>
      Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );

    const clampTarget = () => {
      const max = getMaxScroll();
      if (targetY < 0) targetY = 0;
      if (targetY > max) targetY = max;
    };

    const markInput = () => {
      lastInputAt = performance.now();
      inertiaActive = false;
    };

    const ensureFrame = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(step);
      }
    };

    const step = () => {
      // Detect external scroll (scrollbar drag, anchor reset, programmatic
      // scrollTo from some other module). If window.scrollY jumped far from
      // our currentY AND we haven't received recent input, assume external
      // actor and re-sync rather than fighting it.
      const actualY = window.scrollY;
      const delta = Math.abs(actualY - currentY);
      const hasRecentInput = performance.now() - lastInputAt < INPUT_COOLDOWN_MS;
      if (delta > EXTERNAL_JUMP_THRESHOLD && !hasRecentInput) {
        currentY = actualY;
        targetY = actualY;
        rafId = 0;
        return;
      }

      // Touch inertia: after touchend with residual velocity, keep feeding
      // targetY by the decaying velocity until it settles.
      if (inertiaActive) {
        targetY += touchVelocity;
        touchVelocity *= TOUCH_INERTIA_FRICTION;
        clampTarget();
        if (Math.abs(touchVelocity) < TOUCH_INERTIA_MIN_VELOCITY) {
          inertiaActive = false;
        }
      }

      const diff = targetY - currentY;
      if (Math.abs(diff) < SNAP_THRESHOLD) {
        currentY = targetY;
        window.scrollTo(0, currentY);
        rafId = 0;
        return;
      }
      currentY += diff * LERP_FACTOR;
      window.scrollTo(0, currentY);
      rafId = requestAnimationFrame(step);
    };

    const handleWheel = (event: WheelEvent) => {
      // Allow zoom gestures and modified scrolls to pass through natively.
      if (event.ctrlKey || event.metaKey) {
        return;
      }
      event.preventDefault();
      markInput();
      // Account for deltaMode (lines/pages vs pixels) by approximating.
      let delta = event.deltaY;
      if (event.deltaMode === 1) {
        delta *= 16;
      } else if (event.deltaMode === 2) {
        delta *= window.innerHeight;
      }
      targetY += delta * WHEEL_MULTIPLIER;
      clampTarget();
      ensureFrame();
    };

    const isTypingTarget = () => {
      const active = document.activeElement;
      if (!active) {
        return false;
      }
      const tag = active.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        return true;
      }
      if (active instanceof HTMLElement && active.isContentEditable) {
        return true;
      }
      return false;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget()) {
        return;
      }
      const vh = window.innerHeight;
      let handled = true;
      switch (event.key) {
        case "PageDown":
          targetY += vh * PAGE_FRACTION;
          break;
        case "PageUp":
          targetY -= vh * PAGE_FRACTION;
          break;
        case " ":
          if (event.shiftKey) {
            targetY -= vh * PAGE_FRACTION;
          } else {
            targetY += vh * PAGE_FRACTION;
          }
          break;
        case "Home":
          targetY = 0;
          break;
        case "End":
          targetY = getMaxScroll();
          break;
        case "ArrowDown":
          targetY += ARROW_STEP;
          break;
        case "ArrowUp":
          targetY -= ARROW_STEP;
          break;
        default:
          handled = false;
      }
      if (!handled) {
        return;
      }
      event.preventDefault();
      markInput();
      clampTarget();
      ensureFrame();
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }
      touchLastY = touch.clientY;
      touchLastTime = performance.now();
      touchVelocity = 0;
      inertiaActive = false;
      markInput();
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }
      event.preventDefault();
      const now = performance.now();
      const dy = touchLastY - touch.clientY;
      const dt = Math.max(1, now - touchLastTime);
      // Instantaneous velocity in px/frame (16.67ms reference).
      touchVelocity = (dy / dt) * 16.67;
      targetY += dy;
      touchLastY = touch.clientY;
      touchLastTime = now;
      markInput();
      clampTarget();
      ensureFrame();
    };

    const handleTouchEnd = () => {
      if (Math.abs(touchVelocity) > TOUCH_INERTIA_MIN_VELOCITY) {
        inertiaActive = true;
        ensureFrame();
      }
    };

    const handleAnchorClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }
      const href = anchor.getAttribute("href");
      if (!href || href.charAt(0) !== "#" || href.length < 2) {
        return;
      }
      // Skip cross-document hashes (different pathname/host).
      if (anchor.target && anchor.target !== "" && anchor.target !== "_self") {
        return;
      }
      let destination: Element | null = null;
      try {
        destination = document.querySelector(href);
      } catch {
        return;
      }
      if (!(destination instanceof HTMLElement)) {
        return;
      }
      event.preventDefault();
      markInput();
      const rect = destination.getBoundingClientRect();
      targetY = rect.top + window.scrollY - NAV_OFFSET;
      clampTarget();
      if (typeof window.history?.pushState === "function") {
        try {
          window.history.pushState(null, "", href);
        } catch {
          // Ignore — scrolling is still correct even without URL update.
        }
      }
      ensureFrame();
    };

    const handleResize = () => {
      clampTarget();
      ensureFrame();
    };

    const attach = () => {
      if (attached) {
        return;
      }
      attached = true;

      // Initialise from actual scroll position (handles scroll restoration).
      currentY = window.scrollY;
      targetY = currentY;

      // Disable native CSS smooth-scroll so it doesn't fight our RAF driver.
      prevScrollBehavior =
        document.documentElement.style.scrollBehavior || "";
      document.documentElement.style.scrollBehavior = "auto";

      window.addEventListener("wheel", handleWheel, { passive: false });
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd, { passive: true });
      window.addEventListener("touchcancel", handleTouchEnd, { passive: true });
      document.addEventListener("click", handleAnchorClick);
      window.addEventListener("resize", handleResize, { passive: true });

      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(document.body);
      }
    };

    const detach = () => {
      if (!attached) {
        return;
      }
      attached = false;
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
      resizeObserver = null;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      document.documentElement.style.scrollBehavior = prevScrollBehavior;
    };

    const shouldRun = () => !coarsePointer.matches && !reducedMotion.matches;

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

    coarsePointer.addEventListener("change", handlePreferenceChange);
    reducedMotion.addEventListener("change", handlePreferenceChange);

    return () => {
      coarsePointer.removeEventListener("change", handlePreferenceChange);
      reducedMotion.removeEventListener("change", handlePreferenceChange);
      detach();
    };
  }, []);

  return null;
}
