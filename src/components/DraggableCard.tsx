"use client";

// Physics-based draggable wrapper — Framer Motion drag + spring constraints. Cards can be
// flicked around and settle back via spring. Disabled under prefers-reduced-motion.

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function DraggableCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div>{children}</div>;

  return (
    <motion.div
      ref={ref}
      drag
      dragElastic={0.15}
      dragConstraints={{ top: -40, bottom: 40, left: -40, right: 40 }}
      style={{ x: springX, y: springY, cursor: "grab" }}
      whileDrag={{ cursor: "grabbing", scale: 1.03, zIndex: 10 }}
      onDragEnd={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
