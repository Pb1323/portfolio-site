"use client";

import { useRef } from "react";
import StickyScroll, { type StickyScrollEntry } from "./StickyScroll";
import ScrollReveal from "./ScrollReveal";
import { useKineticHeading } from "@/lib/useKineticHeading";

const JOURNEY: StickyScrollEntry[] = [
  {
    meta: "2026 — Present",
    title: "Founder & Solo Developer @ Summit Tuition",
    accent: "#8b5cf6",
    description:
      "Designed, built, and shipped a full-stack 11+ tutoring platform solo — auth, mock exam engine, admin workflows, and Stripe payments. Reached £6k ARR within 3 weeks of launch and continue to own the entire stack, from product decisions to production incidents.",
  },
  {
    meta: "2026",
    title: "Building in public",
    accent: "#d946ef",
    description:
      "Grew a LinkedIn following past 1,000 sharing the build process behind Summit Tuition, hitting 150k+ impressions in a month. Also run a YouTube Shorts channel with 250k+ views on dev/build content.",
  },
  {
    meta: "2026",
    title: "Hackathons & side projects",
    accent: "#6366f1",
    description:
      "Competed in hackathons (incl. a Solana-based prediction market build) and shipped independent projects like QuickDraw AI, a real-time doodle-recognition CNN served over FastAPI.",
  },
  {
    meta: "Ongoing",
    title: "Self-taught, project-first",
    accent: "#c4b5fd",
    description:
      "No CS degree — learned by shipping real products end-to-end and iterating against actual users rather than tutorials.",
  },
];

export default function Experience() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useKineticHeading(headingRef);

  return (
    <section id="experience" className="mx-auto max-w-4xl px-6 py-32">
      <ScrollReveal className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Journey</p>
        <h2 ref={headingRef} className="mt-4 font-serif-display text-4xl italic sm:text-5xl">
          How I got here
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-ink-dim">Scroll inside the panel below.</p>
      </ScrollReveal>

      <ScrollReveal delay={0.1} className="mt-14">
        <StickyScroll content={JOURNEY} />
      </ScrollReveal>
    </section>
  );
}
