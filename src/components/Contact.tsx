import ScrollReveal from "./ScrollReveal";

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-4xl px-6 py-32 text-center">
      <ScrollReveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Contact</p>
        <h2 className="mt-4 font-serif-display text-4xl italic sm:text-6xl">
          Let&rsquo;s build something.
        </h2>
        <a
          href="mailto:hello@example.com"
          data-cursor="Email"
          className="mt-10 inline-block border-b border-ink pb-1 font-mono text-lg tracking-wide"
        >
          hello@example.com
        </a>
        <p className="mt-4 font-mono text-xs text-ink-dim">[placeholder email — swap in the real one]</p>
      </ScrollReveal>
      <footer className="mt-24 flex flex-col items-center gap-2 border-t border-hairline pt-8 font-mono text-xs text-ink-dim">
        <p>&copy; {new Date().getFullYear()} Jordan Rivers. Built with Next.js, Three.js &amp; GSAP.</p>
      </footer>
    </section>
  );
}
