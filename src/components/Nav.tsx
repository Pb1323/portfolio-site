"use client";

import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 transition-all duration-300 sm:px-10 ${
        scrolled ? "border-b border-hairline bg-canvas/70 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <a href="#top" data-cursor="Top" className="font-serif-display text-lg italic">
        JR
      </a>
      <div className="hidden gap-8 font-mono text-xs uppercase tracking-widest text-ink-dim sm:flex">
        <a href="#work" data-cursor="Go" className="transition-colors hover:text-accent-soft">
          Work
        </a>
        <a href="#about" data-cursor="Go" className="transition-colors hover:text-accent-soft">
          About
        </a>
        <a href="#contact" data-cursor="Go" className="transition-colors hover:text-accent-soft">
          Contact
        </a>
      </div>
    </nav>
  );
}
