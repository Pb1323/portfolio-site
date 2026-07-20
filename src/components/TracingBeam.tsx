// Adapted from Aceternity UI's TracingBeam (https://ui.aceternity.com/components/tracing-beam),
// retrieved via github.com/xKevIsDev/GenUAI (utils/aceternity.ts). Aceternity UI components are
// published for free copy/paste reuse (no traditional OSS license file — registry model similar
// to shadcn/ui).
// Modified for this project: retinted the gradient stops and the "start" dot color from the
// original's emerald/cyan-to-purple scheme to this project's own violet/pink accent tokens, and
// added a window-resize re-measure of the content height (the original only measures once on
// mount, which drifts if content reflows after fonts/animations settle).
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function TracingBeam({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    function measure() {
      if (contentRef.current) setSvgHeight(contentRef.current.offsetHeight);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const y1 = useSpring(useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]), {
    stiffness: 500,
    damping: 90,
  });
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]), {
    stiffness: 500,
    damping: 90,
  });

  return (
    <motion.div ref={ref} className={`relative mx-auto h-full w-full max-w-4xl ${className}`}>
      <div className="absolute -left-4 top-3 hidden md:-left-14 md:block">
        <motion.div className="ml-[27px] flex h-4 w-4 items-center justify-center rounded-full border border-hairline">
          <motion.div
            animate={{
              backgroundColor: scrollYProgress.get() > 0 ? "var(--accent)" : "var(--canvas)",
            }}
            className="h-2 w-2 rounded-full border border-accent bg-canvas"
          />
        </motion.div>
        <svg viewBox={`0 0 20 ${svgHeight}`} width="20" height={svgHeight} className="ml-4 block" aria-hidden="true">
          <path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="var(--hairline)"
          />
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="url(#tracing-beam-gradient)"
            strokeWidth="1.5"
            className="motion-reduce:hidden"
          />
          <defs>
            <motion.linearGradient
              id="tracing-beam-gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1}
              y2={y2}
            >
              <stop stopColor="#8b5cf6" stopOpacity="0" />
              <stop stopColor="#8b5cf6" />
              <stop offset="0.5" stopColor="#c4b5fd" />
              <stop offset="1" stopColor="#d946ef" stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef}>{children}</div>
    </motion.div>
  );
}
