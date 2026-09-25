"use client";

import { useRef } from "react";
import ScrollReveal from "./ScrollReveal";
import Meteors from "./Meteors";
import Magnetic from "./Magnetic";
import { useKineticHeading } from "@/lib/useKineticHeading";

export default function Contact() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useKineticHeading(headingRef);

  return (
    <section
      id="contact"
      className="relative mx-auto max-w-4xl overflow-hidden px-6 py-32 text-center"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Meteors number={16} />
      </div>

      <ScrollReveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Contact</p>
        <h2 ref={headingRef} className="mt-4 font-serif-display text-4xl italic sm:text-6xl">
          Let&rsquo;s build something.
        </h2>
        <Magnetic strength={0.3} className="mt-10">
          <a
            href="mailto:pranav.bgri@gmail.com"
            data-cursor="Email"
            className="inline-block border-b border-ink pb-1 font-mono text-lg tracking-wide"
          >
            pranav.bgri@gmail.com
          </a>
        </Magnetic>
        <div className="mt-6 flex justify-center gap-6 font-mono text-xs uppercase tracking-widest text-ink-dim">
          <a href="https://github.com/Pb1323" data-cursor="Go" className="transition-colors hover:text-accent-soft">
            GitHub
          </a>
          <a href="https://neural-network-pranav-bonagiri.vercel.app" data-cursor="Go" className="transition-colors hover:text-accent-soft">
            Fly Brain Pong
          </a>
        </div>
      </ScrollReveal>
      <footer className="relative mt-24 flex flex-col items-center gap-2 border-t border-hairline pt-8 font-mono text-xs text-ink-dim">
        <p>&copy; {new Date().getFullYear()} Pranav Bonagiri. Built with Next.js, Three.js &amp; GSAP.</p>
      </footer>
    </section>
  );
}
