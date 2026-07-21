"use client";

// Clicking a project card doesn't link out — it transitions into a full-screen, GSAP-paced
// walkthrough scene, then closes back to the grid in place.
//
// Originally used a clip-path circle-reveal (growing `circle(0%)` to `circle(150%)`), but that
// interpolation reliably froze near 0% in testing — GSAP's CSS string-interpolation for
// clip-path's percentage-in-a-function syntax isn't dependable here. Swapped to a scale+fade
// reveal instead: same "materializes into a full-screen scene" feel, built entirely on GSAP's
// well-supported opacity/scale tweening.

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Project } from "@/data/projects";

export default function ProjectDetailView({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project || !overlayRef.current || !contentRef.current) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tl = gsap.timeline();
    if (reduceMotion) {
      gsap.set(overlayRef.current, { autoAlpha: 1 });
      gsap.set(contentRef.current, { autoAlpha: 1, y: 0 });
      return;
    }
    tl.fromTo(
      overlayRef.current,
      { autoAlpha: 0, scale: 1.06 },
      { autoAlpha: 1, scale: 1, duration: 0.55, ease: "power3.out" }
    ).fromTo(
      contentRef.current,
      { autoAlpha: 0, y: 40 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.25"
    );
    return () => {
      tl.kill();
    };
  }, [project]);

  function handleClose() {
    if (!overlayRef.current) return onClose();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return onClose();
    gsap.to(overlayRef.current, {
      autoAlpha: 0,
      scale: 1.04,
      duration: 0.4,
      ease: "power3.inOut",
      onComplete: onClose,
    });
  }

  useEffect(() => {
    if (!project) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  if (!project) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-40 flex items-center justify-center bg-canvas"
      style={{ visibility: "hidden" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 blur-3xl"
        style={{ background: `radial-gradient(45% 45% at 50% 40%, ${project.accent} 0%, transparent 70%)` }}
      />
      <button
        onClick={handleClose}
        data-cursor="Close"
        className="absolute right-8 top-8 font-mono text-xs uppercase tracking-widest text-ink-dim transition-colors hover:text-accent-soft"
      >
        Close ✕
      </button>
      <div ref={contentRef} className="relative max-w-2xl px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent-soft">
          {project.stack.join(" · ")}
        </p>
        <h2 className="mt-6 font-serif-display text-5xl italic">{project.title}</h2>
        <p className="mx-auto mt-6 max-w-md text-lg text-ink-dim">{project.tagline}</p>
      </div>
    </div>
  );
}
