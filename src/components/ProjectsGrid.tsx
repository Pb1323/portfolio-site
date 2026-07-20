"use client";

import { projects } from "@/data/projects";
import ScrollReveal from "./ScrollReveal";

const sizeClasses: Record<string, string> = {
  lg: "md:col-span-4 md:row-span-2",
  md: "md:col-span-3 md:row-span-1",
  sm: "md:col-span-2 md:row-span-1",
};

export default function ProjectsGrid() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-32">
      <ScrollReveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          Selected work
        </p>
        <h2 className="mt-4 font-serif-display text-4xl italic sm:text-5xl">
          Things I&rsquo;ve built
        </h2>
      </ScrollReveal>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6">
        {projects.map((project, i) => (
          <ScrollReveal
            key={project.slug}
            delay={i * 0.08}
            className={`group relative overflow-hidden rounded-2xl border border-hairline bg-white/[0.03] p-8 transition-colors hover:bg-white/[0.06] ${sizeClasses[project.size]}`}
          >
            <a href={`#${project.slug}`} data-cursor="View" className="flex h-full flex-col justify-between">
              <div>
                <h3 className="font-serif-display text-2xl">{project.title}</h3>
                <p className="mt-3 max-w-sm text-sm text-ink-dim">{project.tagline}</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-hairline px-3 py-1 font-mono text-[11px] text-ink-dim"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
                style={{ background: project.accent }}
              />
            </a>
          </ScrollReveal>
        ))}
      </div>

      <p className="mt-8 font-mono text-xs text-ink-dim">
        [placeholder projects — swap in real case studies, links, and demo loops]
      </p>
    </section>
  );
}
