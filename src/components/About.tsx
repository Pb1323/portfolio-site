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
          A short paragraph about who I am, what I build, and how I think.
        </h2>
      </ScrollReveal>

      <TextReveal
        className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-dim"
        words="[Placeholder bio — replace with a real 2-3 sentence summary: background, the kind of problems you like solving, and what makes your approach distinct. Keep it specific rather than generic.]"
      />

      <div className="mt-16">
        <TechMarquee items={STACK} />
      </div>
    </section>
  );
}
