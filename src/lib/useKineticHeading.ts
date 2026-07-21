"use client";

// Kinetic typography: attach to any heading ref. Skew + blur proportional to scroll
// velocity via GSAP ScrollTrigger, snapping back to neutral at rest.

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useKineticHeading(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let snapTween: gsap.core.Tween | null = null;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const velocity = self.getVelocity() / 1000;
        const clamped = gsap.utils.clamp(-2.5, 2.5, velocity);
        snapTween?.kill();
        gsap.set(el, {
          skewX: clamped * 4,
          filter: `blur(${Math.min(Math.abs(clamped) * 1.5, 4)}px)`,
          transformOrigin: "center",
        });
      },
    });

    // ScrollTrigger has no native "scroll stop" event for non-scrubbed triggers, so debounce
    // a snap-back here once scroll input goes quiet.
    let idleTimer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        snapTween?.kill();
        snapTween = gsap.to(el, { skewX: 0, filter: "blur(0px)", duration: 0.6, ease: "power3.out" });
      }, 120);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      trigger.kill();
      snapTween?.kill();
      clearTimeout(idleTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [ref]);
}
