"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, type Project } from "@/data/projects";
import ScrollReveal from "./ScrollReveal";
import SpotlightCard from "./SpotlightCard";
import Magnetic from "./Magnetic";
import DraggableCard from "./DraggableCard";
import { useKineticHeading } from "@/lib/useKineticHeading";
import { useSpatialHoverAudio } from "@/lib/useSpatialHoverAudio";
import { useReducedMotion } from "@/lib/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsGrid({ onOpenProject }: { onOpenProject: (project: Project) => void }) {
  const [feature, ...rest] = projects;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  useKineticHeading(headingRef);

  // The "landing" beat for the exploded-stack thread above (see ExplodedLayerCaseStudy): the
  // featured card doesn't just fade up like the rest of the grid, it settles in from a slight
  // scale with a brief glow pulse in the project's own accent colour — read as the same object
  // the stack just reassembled into, arriving.
  useEffect(() => {
    if (reduceMotion) return;
    const el = featureRef.current;
    if (!el || !feature) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 82%" },
      });
      tl.fromTo(
        el,
        { opacity: 0, y: 32, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" }
      ).fromTo(
        el,
        { boxShadow: `0 0 0 0 ${feature.accent}00` },
        {
          boxShadow: `0 0 48px 6px ${feature.accent}33`,
          duration: 0.5,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        },
        "-=0.5"
      );
    }, el);
    return () => ctx.revert();
  }, [reduceMotion, feature]);

  return (
    <section id="work" className="mx-auto max-w-6xl px-6 pb-32 pt-4 text-center">
      <ScrollReveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          Selected work
        </p>
        <h2 ref={headingRef} className="mt-4 font-serif-display text-4xl italic sm:text-5xl">
          Things I&rsquo;ve built
        </h2>
      </ScrollReveal>

      <div className="mt-14 grid grid-cols-1 gap-5 text-left md:grid-cols-2">
        {feature && (
          <div ref={featureRef} className="rounded-2xl md:col-span-2">
            <DraggableCard>
              <ProjectCard project={feature} featured onOpen={() => onOpenProject(feature)} />
            </DraggableCard>
          </div>
        )}
        {rest.map((project, i) => (
          <ScrollReveal key={project.slug} delay={(i + 1) * 0.08}>
            <DraggableCard>
              <ProjectCard project={project} onOpen={() => onOpenProject(project)} />
            </DraggableCard>
          </ScrollReveal>
        ))}
      </div>

      <p className="mt-8 font-mono text-xs text-ink-dim">
        [placeholder projects — swap in real case studies, links, and demo loops]
      </p>
    </section>
  );
}

function ProjectCard({
  project,
  featured = false,
  onOpen,
}: {
  project: Project;
  featured?: boolean;
  onOpen: () => void;
}) {
  const { bindHover } = useSpatialHoverAudio();
  const hoverAudio = bindHover();

  return (
    <SpotlightCard
      color={project.accent}
      className={`group transition-colors hover:border-accent/40 ${featured ? "min-h-[280px]" : "min-h-[220px]"}`}
    >
      <div className="flex h-full flex-col justify-between p-8">
        <div>
          <h3 className={`font-serif-display ${featured ? "text-3xl" : "text-2xl"}`}>
            {project.title}
          </h3>
          <p className="mt-3 max-w-md text-sm text-ink-dim">{project.tagline}</p>
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-hairline px-3 py-1 font-mono text-[11px] text-ink-dim"
              >
                {tech}
              </span>
            ))}
          </div>

          <Magnetic strength={0.4}>
            <button
              type="button"
              data-cursor="View"
              onMouseEnter={hoverAudio.onMouseEnter}
              onClick={(e) => {
                hoverAudio.onClick(e);
                onOpen();
              }}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-ink/30 px-4 py-2 font-mono text-xs uppercase tracking-wide transition-colors group-hover:border-accent group-hover:text-accent"
            >
              View project
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </Magnetic>
        </div>
      </div>
    </SpotlightCard>
  );
}
