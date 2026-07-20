// Adapted from Aceternity UI's HoverBorderGradient
// (https://ui.aceternity.com/components/hover-border-gradient), retrieved via
// github.com/xKevIsDev/GenUAI (utils/aceternity.ts). Aceternity UI components are published
// for free copy/paste reuse (no traditional OSS license file — registry model similar to
// shadcn/ui).
// Modified for this project: swapped the hardcoded black/white theme for this project's
// canvas/ink tokens, and retinted the hover highlight from blue (#3275F8) to the project's
// purple accent.
"use client";

import { createElement, useEffect, useState, type ComponentPropsWithoutRef, type ElementType, type PropsWithChildren } from "react";
import { motion } from "framer-motion";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

const DIRECTIONS: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];

const MOVING_MAP: Record<Direction, string> = {
  TOP: "radial-gradient(20.7% 50% at 50% 0%, hsl(262, 83%, 74%) 0%, rgba(139,92,246,0) 100%)",
  LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, hsl(262, 83%, 74%) 0%, rgba(139,92,246,0) 100%)",
  BOTTOM: "radial-gradient(20.7% 50% at 50% 100%, hsl(262, 83%, 74%) 0%, rgba(139,92,246,0) 100%)",
  RIGHT: "radial-gradient(16.2% 41.2% at 100% 50%, hsl(262, 83%, 74%) 0%, rgba(139,92,246,0) 100%)",
};

const HIGHLIGHT =
  "radial-gradient(75% 181% at 50% 50%, #d946ef 0%, rgba(217,70,239,0) 100%)";

export default function HoverBorderGradient<T extends ElementType = "button">({
  children,
  containerClassName = "",
  className = "",
  as,
  duration = 1,
  ...props
}: PropsWithChildren<
  {
    as?: T;
    containerClassName?: string;
    className?: string;
    duration?: number;
  } & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">
>) {
  const Tag = (as ?? "button") as ElementType;
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  useEffect(() => {
    if (hovered) return;
    const interval = setInterval(() => {
      setDirection((prev) => {
        const currentIndex = DIRECTIONS.indexOf(prev);
        return DIRECTIONS[(currentIndex - 1 + DIRECTIONS.length) % DIRECTIONS.length];
      });
    }, duration * 1000);
    return () => clearInterval(interval);
  }, [hovered, duration]);

  return createElement(
    Tag,
    {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      className: `relative flex h-min w-fit flex-nowrap items-center justify-center gap-2 overflow-visible rounded-full border border-hairline bg-canvas/40 p-px content-center transition duration-500 ${containerClassName}`,
      ...props,
    },
    <div key="content" className={`z-10 w-auto rounded-[inherit] bg-canvas px-6 py-3 ${className}`}>
      {children}
    </div>,
    <motion.div
      key="gradient"
      className="absolute inset-0 z-0 flex-none overflow-hidden rounded-[inherit]"
      style={{ filter: "blur(2px)", position: "absolute", width: "100%", height: "100%" }}
      initial={{ background: MOVING_MAP[direction] }}
      animate={{ background: hovered ? [MOVING_MAP[direction], HIGHLIGHT] : MOVING_MAP[direction] }}
      transition={{ ease: "linear", duration }}
    />,
    <div key="mask" className="absolute inset-[1.5px] z-[1] rounded-[100px] bg-canvas" />
  );
}
