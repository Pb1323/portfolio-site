"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (coarse) return;

    const ring = { x: 0, y: 0 };
    let raf = 0;

    function onMove(e: PointerEvent) {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      ring.x = e.clientX;
      ring.y = e.clientY;

      const target = e.target as HTMLElement;
      const magnet = target?.closest<HTMLElement>("[data-cursor]");
      setLabel(magnet?.dataset.cursor ?? null);
    }

    function tick() {
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="hidden [@media(hover:hover)_and_(pointer:fine)]:block">
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-50 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-50 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/40 text-[10px] uppercase tracking-wide text-ink transition-[width,height,background-color] duration-200 ease-out"
        style={
          label
            ? { width: 72, height: 72, background: "rgba(255,138,61,0.9)", color: "#0b0b0d", borderColor: "transparent" }
            : undefined
        }
      >
        {label}
      </div>
    </div>
  );
}
