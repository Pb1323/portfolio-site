"use client";

import { useRef } from "react";
import ScrollReveal from "./ScrollReveal";
import { useKineticHeading } from "@/lib/useKineticHeading";
import { qualifications } from "@/data/qualifications";

export default function Qualifications() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useKineticHeading(headingRef);

  return (
    <section id="qualifications" className="mx-auto max-w-4xl px-6 py-32">
      <ScrollReveal className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Qualifications</p>
        <h2 ref={headingRef} className="mt-4 font-serif-display text-4xl italic sm:text-5xl">
          Academic record
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-ink-dim">
          Self-taught as a developer — here&rsquo;s the formal side too.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1} className="mt-14 grid gap-4 sm:grid-cols-2">
        {qualifications.map((q) => (
          <div key={q.id} className="rounded-2xl border border-hairline bg-white/[0.02] p-6">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-semibold">{q.credential}</h3>
              <span className="shrink-0 font-mono text-xs text-ink-dim">{q.year}</span>
            </div>
            <p className="mt-2 text-sm text-ink-dim">{q.detail}</p>
            <p className="mt-3 font-mono text-xs uppercase tracking-widest text-accent-soft">
              {q.institution}
            </p>
          </div>
        ))}
      </ScrollReveal>
    </section>
  );
}
