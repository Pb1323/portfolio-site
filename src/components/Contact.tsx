import ScrollReveal from "./ScrollReveal";
import Meteors from "./Meteors";
import Magnetic from "./Magnetic";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative mx-auto max-w-4xl overflow-hidden px-6 py-32 text-center"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Meteors number={16} />
      </div>

      <ScrollReveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Contact</p>
        <h2 className="mt-4 font-serif-display text-4xl italic sm:text-6xl">
          Let&rsquo;s build something.
        </h2>
        <Magnetic strength={0.3} className="mt-10">
          <a
            href="mailto:hello@example.com"
            data-cursor="Email"
            className="inline-block border-b border-ink pb-1 font-mono text-lg tracking-wide"
          >
            hello@example.com
          </a>
        </Magnetic>
        <p className="mt-4 font-mono text-xs text-ink-dim">[placeholder email — swap in the real one]</p>
      </ScrollReveal>
      <footer className="relative mt-24 flex flex-col items-center gap-2 border-t border-hairline pt-8 font-mono text-xs text-ink-dim">
        <p>&copy; {new Date().getFullYear()} Jordan Rivers. Built with Next.js, Three.js &amp; GSAP.</p>
      </footer>
    </section>
  );
}
