import ScrollReveal from "./ScrollReveal";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-4xl px-6 py-32">
      <ScrollReveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">About</p>
        <h2 className="mt-4 font-serif-display text-3xl italic sm:text-4xl">
          A short paragraph about who I am, what I build, and how I think.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-dim">
          [Placeholder bio — replace with a real 2-3 sentence summary: background, the kind of
          problems you like solving, and what makes your approach distinct. Keep it specific
          rather than generic.]
        </p>
      </ScrollReveal>
    </section>
  );
}
