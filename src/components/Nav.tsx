export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 sm:px-10">
      <a href="#top" data-cursor="Top" className="font-serif-display text-lg italic">
        JR
      </a>
      <div className="hidden gap-8 font-mono text-xs uppercase tracking-widest text-ink-dim sm:flex">
        <a href="#work" data-cursor="Go" className="transition-colors hover:text-ink">
          Work
        </a>
        <a href="#about" data-cursor="Go" className="transition-colors hover:text-ink">
          About
        </a>
        <a href="#contact" data-cursor="Go" className="transition-colors hover:text-ink">
          Contact
        </a>
      </div>
    </nav>
  );
}
