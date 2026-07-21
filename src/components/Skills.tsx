"use client";

import { useRef } from "react";
import { BentoGrid, BentoGridItem } from "./BentoGrid";
import ScrollReveal from "./ScrollReveal";
import { useKineticHeading } from "@/lib/useKineticHeading";

const SKILL_CELLS = [
  {
    title: "Languages & frameworks",
    description: "TypeScript, Python, React, Next.js — the daily-driver stack for shipping product fast.",
    className: "md:col-span-2",
  },
  {
    title: "AI / LLM tooling",
    description: "Agent orchestration, RAG pipelines, prompt/eval tooling, and model-provider integrations.",
    className: "md:col-span-1",
  },
  {
    title: "Realtime & 3D",
    description: "Three.js / React Three Fiber, WebGL shaders, GSAP scroll choreography, Framer Motion.",
    className: "md:col-span-1",
  },
  {
    title: "Systems & infra",
    description: "Postgres, Prisma, serverless deploys, CI pipelines, and the boring reliability work that holds it up.",
    className: "md:col-span-1",
  },
  {
    title: "Currently exploring",
    description: "[Placeholder — swap in whatever you're deep in right now: a framework, a paper, a hard problem.]",
    className: "md:col-span-1",
  },
  {
    title: "How I work",
    description: "Bias for shipping a rough version early, then iterating in public against real feedback rather than polishing in a vacuum.",
    className: "md:col-span-2 md:row-span-1",
  },
];

export default function Skills() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useKineticHeading(headingRef);

  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-32">
      <ScrollReveal className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Toolkit</p>
        <h2 ref={headingRef} className="mt-4 font-serif-display text-4xl italic sm:text-5xl">
          What I reach for
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={0.1} className="mt-14">
        <BentoGrid>
          {SKILL_CELLS.map((cell) => (
            <BentoGridItem
              key={cell.title}
              title={cell.title}
              description={cell.description}
              className={cell.className}
            />
          ))}
        </BentoGrid>
      </ScrollReveal>
    </section>
  );
}
