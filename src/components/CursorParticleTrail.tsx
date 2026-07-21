"use client";

// Lightweight canvas trail following the cursor, opacity tuned way down — atmosphere,
// not a gimmick. Disabled on touch devices and under prefers-reduced-motion.

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; life: number };

export default function CursorParticleTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const isCoarse = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isCoarse || reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let raf = 0;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function onMove(e: MouseEvent) {
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        life: 1,
      });
      if (particles.length > 40) particles.shift();
    }
    window.addEventListener("mousemove", onMove);

    function tick() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      particles = particles.filter((p) => p.life > 0.02);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life *= 0.94;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 2.2 * p.life, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(196, 181, 253, ${0.18 * p.life})`;
        ctx!.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-20" />;
}
