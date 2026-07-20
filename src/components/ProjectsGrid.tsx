"use client";

import { projects } from "@/data/projects";
import ScrollReveal from "./ScrollReveal";
import SpotlightCard from "./SpotlightCard";
import Magnetic from "./Magnetic";

export default function ProjectsGrid() {
  const [feature, ...rest] = projects;

  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-32 text-center">
      <ScrollReveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          Selected work
        </p>
        <h2 className="mt-4 font-serif-display text-4xl italic sm:text-5xl">
          Things I&rsquo;ve built
        </h2>
      </ScrollReveal>

      <div className="mt-14 grid grid-cols-1 gap-5 text-left md:grid-cols-2">
        {feature && (
          <ScrollReveal className="md:col-span-2">
            <ProjectCard project={feature} featured />
          </ScrollReveal>
        )}
        {rest.map((project, i) => (
          <ScrollReveal key={project.slug} delay={(i + 1) * 0.08}>
            <ProjectCard project={project} />
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
}: {
  project: (typeof projects)[number];
  featured?: boolean;
}) {
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
            <a
              href={`#${project.slug}`}
              data-cursor="View"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-ink/30 px-4 py-2 font-mono text-xs uppercase tracking-wide transition-colors group-hover:border-accent group-hover:text-accent"
            >
              View project
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </Magnetic>
        </div>
      </div>
    </SpotlightCard>
  );
}
