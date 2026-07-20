// Adapted from Aceternity UI's InfiniteMovingCards (https://ui.aceternity.com/components/infinite-moving-cards),
// retrieved via github.com/xKevIsDev/GenUAI (utils/aceternity.ts). Aceternity UI components are
// published for free copy/paste reuse (registry model, no traditional OSS license file).
// Modified for this project: swapped the testimonial-quote card layout for a simple scrolling
// row of tech-stack chips (dropped the quote/name/title item shape entirely), kept the core
// technique — clone the list into the DOM, drive it with a CSS `animate-scroll` keyframe,
// pause on hover, fade the edges with a mask-image.
"use client";

import { useEffect, useRef, useState } from "react";

export default function TechMarquee({
  items,
  speed = "normal",
}: {
  items: string[];
  speed?: "fast" | "normal" | "slow";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;
    const scrollerContent = Array.from(scrollerRef.current.children);
    scrollerContent.forEach((item) => {
      scrollerRef.current?.appendChild(item.cloneNode(true));
    });

    const duration = speed === "fast" ? "20s" : speed === "slow" ? "80s" : "40s";
    containerRef.current.style.setProperty("--animation-duration", duration);
    setStart(true);
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className="scroller relative z-10 mx-auto max-w-4xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]"
    >
      <ul
        ref={scrollerRef}
        className={`flex w-max shrink-0 flex-nowrap gap-3 py-2 ${start ? "animate-scroll" : ""} hover:[animation-play-state:paused]`}
      >
        {items.map((item) => (
          <li
            key={item}
            className="shrink-0 rounded-full border border-hairline bg-white/[0.03] px-5 py-2 font-mono text-xs uppercase tracking-wide text-ink-dim"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
