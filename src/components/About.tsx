"use client";

import { useRef } from "react";
import ScrollReveal from "./ScrollReveal";
import TextReveal from "./TextReveal";
import TechMarquee from "./TechMarquee";
import { useKineticHeading } from "@/lib/useKineticHeading";

const STACK = [
  "TypeScript",
  "React",
  "Next.js",
  "Three.js",
  "Python",
  "LLM tooling",
  "GSAP",
  "Postgres",
  "Framer Motion",
];

export default function About() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useKineticHeading(headingRef);

  return (
    <section id="about" className="mx-auto max-w-4xl px-6 py-32 text-center">
      <ScrollReveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">About</p>
        <h2
          ref={headingRef}
          className="mx-auto mt-4 max-w-2xl font-serif-display text-3xl italic sm:text-4xl"
        >
          Self-taught developer who ships fast and builds in public.
        </h2>
      </ScrollReveal>

      <TextReveal
        className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-dim"
        words="I'm Pranav — a self-taught developer who builds full-stack products end-to-end, solo. I built Summit Tuition from scratch and took it to £12k ARR in 6 weeks with real paying families. More recently I've been asking whether a small piece of a real fruit fly's brain wiring can steer a game of Pong better than the same neurons wired at random (it can, by a lot). I like scoping ruthlessly, shipping something real fast, and iterating against actual evidence rather than polishing in a vacuum."
      />

      <div className="mt-16">
        <TechMarquee items={STACK} />
      </div>
    </section>
  );
}
