"use client";

// Drafted in a Claude Design session and ported in via steal-ui-style handoff (see
// THIRD_PARTY_NOTICES.md). A scroll-driven "exploded view" of Summit Tuition's real stack —
// four layers separate apart in Z-depth as the section scrolls into view, hold apart while
// centered, then reassemble on the way out.
//
// The Claude Design demo drove this off a raw `window.addEventListener("scroll", ...)`
// listener, explicitly flagged in its own README as a stand-in ("production port assumes
// GSAP + ScrollTrigger, already a project dependency") — this is that port. The site's
// scroll is owned by Lenis (SmoothScroll.tsx), which only notifies GSAP's ScrollTrigger
// (`lenis.on("scroll", ScrollTrigger.update)`), not native `scroll` events on a reliable
// cadence — a raw listener here would read stale/late positions against Lenis's smoothing,
// which is almost certainly the "scroll one seems buggy" behavior reported after the demo
// was dropped into the real site. Using ScrollTrigger directly (matching the exact pattern
// HeroScene.tsx already uses for its own scroll-scrubbed camera dolly) fixes that.
//
// Positioned directly above ProjectsSection (see page.tsx) so it reads as a prologue to the
// Summit Tuition case study rather than an orphaned toy — the reassembly caption and the
// connecting thread beneath it are what tie it to the real project card that follows.

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { projects } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

const LAYERS = [
  { label: "Frontend", tech: "Next.js", accent: "#8b5cf6" },
  { label: "API", tech: "API routes", accent: "#c4b5fd" },
  { label: "Database", tech: "Postgres + Prisma", accent: "#d946ef" },
  { label: "Payments", tech: "Stripe", accent: "#5b21b6" },
];

const SEPARATION = 90;

// Separate from computeLayers so the reduced-motion path can pass a constant explode
// value (1 — fully separated, the whole point of the component) without ever touching
// scroll-derived state, and so the default 0 the scroll path starts at genuinely matches
// reality (the section is off-screen pre-scroll) instead of snapping from a fake "middle"
// value on first paint — that snap was the visible glitch.
function explodeFromProgress(progress: number) {
  let explode: number;
  if (progress < 0.3) explode = progress / 0.3;
  else if (progress < 0.7) explode = 1;
  else explode = 1 - (progress - 0.7) / 0.3;
  return Math.max(0, Math.min(1, explode));
}

function computeLayers(explode: number) {
  return LAYERS.map((d, i) => {
    const z = i * SEPARATION * explode;
    const y = (i - 1.5) * 6 * explode;
    const rot = (i - 1.5) * -1.2 * explode;
    const opacity = 0.55 + explode * 0.25;
    // At rest (explode 0) all 4 layers sit exactly on top of each other — stacking 4 full
    // borders + 4 backdrop-blurs + 4 fills there reads as a jumbled glowing blob, not a
    // clean card. Fade the border/blur/fill in as the layers actually separate, so at rest
    // it resolves to one settled panel instead of four overlapping translucent ones.
    const borderOpacity = 0.03 + explode * 0.22;
    const blurPx = 1 + explode * 9;
    const fillOpacity = 0.02 + explode * (0.05 + i * 0.025);
    return {
      ...d,
      style: {
        transform: `translate3d(0px, ${y}px, ${z}px) rotateX(${rot}deg)`,
        opacity,
        zIndex: LAYERS.length - i,
        border: `1px solid rgba(228, 219, 250, ${borderOpacity})`,
        backdropFilter: `blur(${blurPx}px)`,
        background: `rgba(139, 92, 246, ${fillOpacity})`,
      },
    };
  });
}

export default function ExplodedLayerCaseStudy() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reduced motion renders a constant fully-separated view below (explode = 1) without
    // touching state at all — no scroll trigger needed for that path.
    if (reduceMotion) return;
    const el = trackRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => setProgress(self.progress),
    });

    return () => trigger.kill();
  }, [reduceMotion]);

  const explode = reduceMotion ? 1 : explodeFromProgress(progress);
  const layers = computeLayers(explode);
  const accent = projects[0]?.accent ?? "#8b5cf6";

  // Reassembly readout: as the layers settle back together (last 30% of the scroll track),
  // fade in a line naming what they just settled into — the real case study card the thread
  // below points at, not a second unrelated caption.
  const reassemblePhase = reduceMotion ? 0 : Math.max(0, (progress - 0.75) / 0.25);
  const settledOpacity = Math.max(0, Math.min(1, reassemblePhase));

  return (
    <section className="relative">
      <div className="flex h-[50vh] flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-widest text-ink-dim">
          Before the case study — scroll to open up the stack ↓
        </p>
      </div>

      <div ref={trackRef} className="relative h-[300vh]">
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
          <p className="mb-12 font-mono text-sm text-ink-dim">Summit Tuition — built solo, full stack</p>
          <div
            className="relative"
            style={{ width: 560, maxWidth: "88vw", height: 340, perspective: 1400 }}
          >
            <div
              className={`relative h-full w-full ${!reduceMotion ? "animate-turntable" : ""}`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {layers.map((layer) => (
                <div
                  key={layer.label}
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl"
                  style={layer.style}
                >
                  <p
                    className="font-mono text-[11px] uppercase tracking-widest"
                    style={{ color: layer.accent }}
                  >
                    {layer.label}
                  </p>
                  <p className="mt-1.5 text-xl font-semibold text-ink">{layer.tech}</p>
                </div>
              ))}
            </div>
          </div>
          <p
            className="mt-10 font-mono text-xs uppercase tracking-widest text-ink-dim"
            style={{ opacity: settledOpacity }}
          >
            One product, one case study ↓
          </p>
        </div>
      </div>

      {/* Connecting thread: the same accent the reassembled stack settles on, drawn straight
          down into the featured project card that opens ProjectsGrid — the visual claim that
          what you just watched come apart is the same thing about to appear as a real card. */}
      <div className="flex h-[26vh] flex-col items-center justify-end pb-2">
        <div
          aria-hidden
          className="w-px"
          style={{
            height: 96,
            background: `linear-gradient(to bottom, transparent, ${accent}80)`,
          }}
        />
        <div
          aria-hidden
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: accent, boxShadow: `0 0 12px 2px ${accent}` }}
        />
      </div>
    </section>
  );
}
