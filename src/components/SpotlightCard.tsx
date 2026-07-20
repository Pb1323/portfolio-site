// Adapted from Aceternity UI's CardSpotlight (https://ui.aceternity.com/components/card-spotlight),
// retrieved via github.com/xKevIsDev/GenUAI (utils/aceternity.ts), which embeds the component's
// source for programmatic use. Aceternity UI publishes components for free copy/paste reuse
// (registry model, no traditional OSS license file) — see ui.aceternity.com for terms.
// Modified for this project: dropped the optional CanvasRevealEffect dot-grid layer (extra
// dependency not needed here), retyped for React 19 event handlers, and retextured the glow
// color/border to this project's purple/violet accent tokens instead of the original neutral gray.
"use client";

import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import { type MouseEvent, type ReactNode, useState } from "react";

export default function SpotlightCard({
  children,
  radius = 350,
  color = "var(--accent)",
  className = "",
}: {
  children: ReactNode;
  radius?: number;
  color?: string;
  className?: string;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className={`group/spotlight relative overflow-hidden rounded-2xl border border-hairline bg-white/[0.03] ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px z-0 rounded-2xl opacity-0 transition duration-300 group-hover/spotlight:opacity-100"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 70%)`,
          opacity: isHovering ? 0.18 : 0,
          maskImage: useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent 80%
            )
          `,
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
