"use client";

import { useRef } from "react";
import StickyScroll, { type StickyScrollEntry } from "./StickyScroll";
import ScrollReveal from "./ScrollReveal";
import { useKineticHeading } from "@/lib/useKineticHeading";

const JOURNEY: StickyScrollEntry[] = [
  {
    meta: "[Year] — Present",
    title: "[Role] @ [Company]",
    accent: "#8b5cf6",
    description:
      "[Placeholder — one tight paragraph: scope of the role, the kind of problems you own, and a concrete outcome you're proud of. Specifics beat adjectives.]",
  },
  {
    meta: "[Year] — [Year]",
    title: "[Role] @ [Company]",
    accent: "#d946ef",
    description:
      "[Placeholder — what changed because you were there. A metric, a launch, a system that didn't exist before you built it.]",
  },
  {
    meta: "[Year] — [Year]",
    title: "Independent / freelance work",
    accent: "#6366f1",
    description:
      "[Placeholder — the shape of projects you took on solo: who they were for, what you shipped, what you learned running the whole stack yourself.]",
  },
  {
    meta: "Ongoing",
    title: "Open source & side projects",
    accent: "#c4b5fd",
    description:
      "[Placeholder — the things you build because you want them to exist. Link the ones worth linking in the projects section above.]",
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
