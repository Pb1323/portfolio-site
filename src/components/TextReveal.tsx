// Adapted from Aceternity UI's TextGenerateEffect (https://ui.aceternity.com/components/text-generate-effect),
// retrieved via github.com/xKevIsDev/GenUAI (utils/aceternity.ts). Aceternity UI components are
// published for free copy/paste reuse (registry model, no traditional OSS license file).
// Modified for this project: retyped for TypeScript strictness, swapped the hardcoded
// dark:text-white/text-black classes for this project's `text-ink` token, and dropped the
// extra wrapper divs the original used for its own demo layout.
"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate, useInView } from "framer-motion";

export default function TextReveal({
  words,
  className = "",
  duration = 0.6,
}: {
  words: string;
  className?: string;
  duration?: number;
}) {
  const [scope, animate] = useAnimate();
  const inView = useInView(scope, { once: true, amount: 0.6 });
  const wordsArray = words.split(" ");

  useEffect(() => {
    if (!inView) return;
    animate(
      "span",
      { opacity: 1, filter: "blur(0px)" },
      { duration, delay: stagger(0.08) }
    );
  }, [inView, animate, duration]);

  return (
    <motion.div ref={scope} className={className}>
      {wordsArray.map((word, idx) => (
        <motion.span
          key={word + idx}
          className="text-ink opacity-0"
          style={{ filter: "blur(10px)" }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </motion.div>
  );
}
