import HeroCanvas from "@/components/canvas/HeroCanvas";
import Nav from "@/components/Nav";
import About from "@/components/About";
import ProjectsGrid from "@/components/ProjectsGrid";
import Terminal from "@/components/Terminal";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <HeroCanvas />
      <Nav />

      <main id="top" className="relative">
        <div id="hero-scroll-track" className="relative h-[220vh]">
          <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-6 text-center sm:px-10">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent-soft">
              Software &amp; AI engineer
            </p>
            <h1 className="mx-auto mt-6 max-w-3xl font-serif-display text-5xl italic leading-[1.05] sm:text-7xl">
              I design and build interfaces that feel inevitable.
            </h1>
            <p className="mx-auto mt-6 max-w-md text-lg text-ink-dim">
              [Placeholder headline &amp; intro — replace with your real name, role, and one
              sentence about the kind of work you do.]
            </p>
            <a
              href="#work"
              data-cursor="Scroll"
              className="mt-12 font-mono text-xs uppercase tracking-widest text-ink-dim"
            >
              Scroll to explore ↓
            </a>
          </div>
        </div>

        <div className="relative bg-canvas">
          <About />
          <ProjectsGrid />
          <Terminal />
          <Contact />
        </div>
      </main>

      <div className="noise-overlay" />
    </>
  );
}
