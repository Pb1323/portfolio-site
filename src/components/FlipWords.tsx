// Adapted from Aceternity UI's FlipWords (https://ui.aceternity.com/components/flip-words),
// retrieved via github.com/xKevIsDev/GenUAI (utils/aceternity.ts). Aceternity UI components are
// published for free copy/paste reuse (no traditional OSS license file — registry model similar
// to shadcn/ui).
// Modified for this project: retyped for TypeScript strictness, dropped the hardcoded
// dark:text-neutral-100/text-neutral-900 classes in favor of inheriting this project's own
// text color, and removed the unused isAnimating dependency on itself flagged by this project's
// stricter React Compiler lint (restructured the interval as a plain setInterval instead).
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function FlipWords({
  words,
  duration = 2600,
  className = "",
}: {
  words: string[];
  duration?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, duration);
    return () => clearInterval(interval);
  }, [words.length, duration]);

  const currentWord = words[index];

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={currentWord}
        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
        transition={{ type: "spring", stiffness: 100, damping: 12 }}
        className={`inline-block text-accent-soft ${className}`}
      >
        {currentWord}
      </motion.span>
    </AnimatePresence>
  );
}
