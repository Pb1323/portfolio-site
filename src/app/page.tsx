import HeroCanvas from "@/components/canvas/HeroCanvas";
import Nav from "@/components/Nav";
import About from "@/components/About";
import Skills from "@/components/Skills";
import ProjectsSection from "@/components/ProjectsSection";
import Experience from "@/components/Experience";
import Terminal from "@/components/Terminal";
import Contact from "@/components/Contact";
import FlipWords from "@/components/FlipWords";
import HoverBorderGradient from "@/components/HoverBorderGradient";
import TracingBeam from "@/components/TracingBeam";
import CommandPalette from "@/components/CommandPalette";
import CursorParticleTrail from "@/components/CursorParticleTrail";

const FLIP_WORDS = ["interfaces", "products", "experiences", "systems"];

export default function Home() {
  return (
    <>
      <HeroCanvas />
      <Nav />
      <CommandPalette />
      <CursorParticleTrail />

      <main id="top" className="relative">
        <div id="hero-scroll-track" className="relative h-[160vh]">
          <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-6 text-center sm:px-10">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent-soft">
              Pranav Bonagiri — Self-taught developer
            </p>
            <h1 className="mx-auto mt-6 max-w-3xl font-serif-display text-5xl italic leading-[1.05] sm:text-7xl">
              I design and build <FlipWords words={FLIP_WORDS} /> that feel inevitable.
            </h1>
            <p className="mx-auto mt-6 max-w-md text-lg text-ink-dim">
              I build full-stack products solo, end-to-end. Most recently: Summit Tuition,
              which hit £6k ARR in its first 3 weeks.
            </p>
            <div className="mt-12 flex flex-col items-center gap-6">
              <HoverBorderGradient
                as="a"
                href="#work"
                className="font-mono text-xs uppercase tracking-widest"
              >
                View my work
              </HoverBorderGradient>
              <a
                href="#work"
                data-cursor="Scroll"
                className="font-mono text-xs uppercase tracking-widest text-ink-dim"
              >
                Scroll to explore ↓
              </a>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-canvas">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[1600px] opacity-[0.14] blur-3xl"
            style={{
              background:
                "radial-gradient(60% 40% at 50% 0%, var(--accent) 0%, transparent 70%), radial-gradient(50% 35% at 15% 55%, var(--accent-pink) 0%, transparent 70%), radial-gradient(50% 35% at 85% 90%, var(--accent-soft) 0%, transparent 70%)",
            }}
          />
          <TracingBeam>
            <About />
            <Skills />
          </TracingBeam>
          <ProjectsSection />
          <Experience />
          <TracingBeam>
            <Terminal />
            <Contact />
          </TracingBeam>
        </div>
      </main>

      <div className="noise-overlay" />
    </>
  );
}
