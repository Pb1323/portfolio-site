// Adapted from Aceternity UI's Sticky Scroll Reveal
// (https://ui.aceternity.com/components/sticky-scroll-reveal), source retrieved via
// github.com/xKevIsDev/GenUAI (utils/aceternity.ts) — the same mirror already used for
// SpotlightCard/BentoGrid/etc. in this project (see THIRD_PARTY_NOTICES.md). Aceternity UI
// publishes components for free copy/paste reuse (registry model, no traditional OSS license
// file) — see ui.aceternity.com for terms.
// Modified for this project: dropped the `cn` helper dependency (not present in this repo) for a
// tiny local class-join, replaced the original demo's `--slate-900`/`--cyan-500` CSS-variable
// palette (not defined here) with this project's own canvas/accent tokens and a per-item accent
// color driving both the active heading tint and the sticky panel's gradient, and swapped the
// fixed `content[activeCard].content` node slot for a simple gradient-plus-metric panel so this
// component needs no per-entry custom JSX to use.
"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

function joinClasses(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export type StickyScrollEntry = {
  title: string;
  description: string;
  accent: string;
  meta?: string;
  panel?: ReactNode;
};

export default function StickyScroll({
  content,
  className,
}: {
  content: StickyScrollEntry[];
  className?: string;
}) {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const breakpoints = content.map((_, index) => index / cardLength);
    const closest = breakpoints.reduce((acc, breakpoint, index) => {
      const distance = Math.abs(latest - breakpoint);
      return distance < Math.abs(latest - breakpoints[acc]) ? index : acc;
    }, 0);
    setActiveCard(closest);
  });

  const active = content[activeCard];

  return (
    <div
      ref={ref}
      className={joinClasses(
        "themed-scroll relative flex h-[32rem] justify-center gap-10 overflow-y-auto rounded-2xl border border-hairline bg-white/[0.02] p-8 sm:p-10",
        className
      )}
    >
      <div className="relative max-w-2xl">
        {content.map((item, index) => (
          <div key={`${item.title}-${index}`} className="my-16 first:mt-2">
            <motion.p
              animate={{ opacity: activeCard === index ? 1 : 0.28 }}
              className="font-mono text-[11px] uppercase tracking-[0.25em]"
              style={{ color: item.accent }}
            >
              {item.meta}
            </motion.p>
            <motion.h3
              animate={{ opacity: activeCard === index ? 1 : 0.28 }}
              className="mt-2 font-serif-display text-2xl italic text-ink"
            >
              {item.title}
            </motion.h3>
            <motion.p
              animate={{ opacity: activeCard === index ? 1 : 0.28 }}
              className="mt-4 max-w-md text-sm leading-relaxed text-ink-dim"
            >
              {item.description}
            </motion.p>
          </div>
        ))}
        <div className="h-32" />
      </div>

      <div
        className="sticky top-8 hidden h-64 w-72 shrink-0 overflow-hidden rounded-2xl border border-hairline lg:block"
        style={{
          background: `radial-gradient(120% 120% at 20% 0%, ${active.accent}33 0%, transparent 60%), var(--canvas)`,
        }}
      >
        {active.panel ?? (
          <div className="flex h-full flex-col justify-end p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: active.accent }}>
              {String(activeCard + 1).padStart(2, "0")} / {String(cardLength).padStart(2, "0")}
            </p>
            <p className="mt-2 font-serif-display text-xl italic text-ink">{active.title}</p>
          </div>
        )}
      </div>
    </div>
  );
}
