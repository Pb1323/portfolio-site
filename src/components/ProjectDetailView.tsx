"use client";

// Clicking a project card doesn't link out — it transitions into a full-screen, GSAP-paced
// case-study scene, then closes back to the grid in place. Layout varies by `project.template`:
// "case-study" gets the full problem/approach/architecture/results breakdown, "experiment" gets
// a shorter single-column narrative, and "oss" leads with stack + links for published packages.
//
// Originally used a clip-path circle-reveal (growing `circle(0%)` to `circle(150%)`), but that
// interpolation reliably froze near 0% in testing — GSAP's CSS string-interpolation for
// clip-path's percentage-in-a-function syntax isn't dependable here. Swapped to a scale+fade
// reveal instead: same "materializes into a full-screen scene" feel, built entirely on GSAP's
// well-supported opacity/scale tweening.

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Project } from "@/data/projects";

export default function ProjectDetailView({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project || !overlayRef.current || !contentRef.current) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tl = gsap.timeline();
    if (reduceMotion) {
      gsap.set(overlayRef.current, { autoAlpha: 1 });
      gsap.set(contentRef.current, { autoAlpha: 1, y: 0 });
      return;
    }
    tl.fromTo(
      overlayRef.current,
      { autoAlpha: 0, scale: 1.06 },
      { autoAlpha: 1, scale: 1, duration: 0.55, ease: "power3.out" }
    ).fromTo(
      contentRef.current,
      { autoAlpha: 0, y: 40 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.25"
    );
    return () => {
      tl.kill();
    };
  }, [project]);

  function handleClose() {
    if (!overlayRef.current) return onClose();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return onClose();
    gsap.to(overlayRef.current, {
      autoAlpha: 0,
      scale: 1.04,
      duration: 0.4,
      ease: "power3.inOut",
      onComplete: onClose,
    });
  }

  useEffect(() => {
    if (!project) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  if (!project) return null;

  return (
    <div
      ref={overlayRef}
      className="themed-scroll fixed inset-0 z-40 overflow-y-auto bg-canvas"
      style={{ visibility: "hidden" }}
    >
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-40 blur-3xl"
        style={{ background: `radial-gradient(45% 45% at 50% 0%, ${project.accent} 0%, transparent 70%)` }}
      />
      <button
        onClick={handleClose}
        data-cursor="Close"
        className="fixed right-8 top-8 z-10 font-mono text-xs uppercase tracking-widest text-ink-dim transition-colors hover:text-accent-soft"
      >
        Close ✕
      </button>

      <div ref={contentRef} className="relative mx-auto min-h-screen max-w-4xl px-6 py-28 sm:px-10">
        {project.template === "case-study" && <CaseStudyLayout project={project} />}
        {project.template === "experiment" && <ExperimentLayout project={project} />}
        {project.template === "oss" && <OssLayout project={project} />}
      </div>
    </div>
  );
}

function Eyebrow({ children, accent }: { children: string; accent: string }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.35em]" style={{ color: accent }}>
      {children}
    </p>
  );
}

function LinksRow({ links }: { links: Project["links"] }) {
  if (!links?.length) return null;
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          data-cursor="Open"
          className="rounded-full border border-hairline px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink-dim transition-colors hover:border-accent hover:text-accent-soft"
        >
          {link.label} ↗
        </a>
      ))}
    </div>
  );
}

// Two-column: sticky meta rail (role/year/stack/links) + a full narrative down the right —
// problem, approach as numbered steps, architecture, and a closing results stat row.
function CaseStudyLayout({ project }: { project: Project }) {
  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_2fr]">
      <div className="md:sticky md:top-28 md:self-start">
        <Eyebrow accent={project.accent}>{project.stack.join(" · ")}</Eyebrow>
        <h2 className="mt-4 font-serif-display text-4xl italic sm:text-5xl">{project.title}</h2>
        <p className="mt-4 max-w-sm text-ink-dim">{project.tagline}</p>
        <dl className="mt-8 space-y-3 font-mono text-xs uppercase tracking-wide text-ink-dim">
          <div className="flex justify-between gap-4 border-b border-hairline pb-3">
            <dt>Year</dt>
            <dd className="text-ink">{project.year}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-hairline pb-3">
            <dt>Role</dt>
            <dd className="text-ink">{project.role}</dd>
          </div>
        </dl>
        {project.links?.length ? (
          <div className="mt-6 flex flex-col gap-2">
            {project.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-cursor="Open"
                className="font-mono text-xs uppercase tracking-wide text-ink-dim transition-colors hover:text-accent-soft"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        ) : null}
      </div>

      <div className="space-y-14 text-left">
        <section>
          <Eyebrow accent={project.accent}>Overview</Eyebrow>
          <p className="mt-4 text-lg leading-relaxed text-ink">{project.overview}</p>
        </section>

        {project.problem && (
          <section>
            <Eyebrow accent={project.accent}>The problem</Eyebrow>
            <p className="mt-4 leading-relaxed text-ink-dim">{project.problem}</p>
          </section>
        )}

        {project.approach?.length ? (
          <section>
            <Eyebrow accent={project.accent}>Approach</Eyebrow>
            <ol className="mt-4 space-y-4">
              {project.approach.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="font-mono text-sm" style={{ color: project.accent }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-relaxed text-ink-dim">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {project.architecture?.length ? (
          <section>
            <Eyebrow accent={project.accent}>Architecture</Eyebrow>
            <ul className="mt-4 space-y-3">
              {project.architecture.map((line) => (
                <li
                  key={line}
                  className="rounded-xl border border-hairline bg-white/[0.02] px-4 py-3 text-sm leading-relaxed text-ink-dim"
                >
                  {line}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {project.results?.length ? (
          <section>
            <Eyebrow accent={project.accent}>Results</Eyebrow>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {project.results.map((stat, i) => (
                <div key={`${stat.label}-${i}`} className="rounded-xl border border-hairline px-4 py-5 text-center">
                  <p className="font-serif-display text-2xl italic text-ink">{stat.value}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-dim">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

// Single centered column, quicker read — a hypothesis-and-answer framing for prototypes.
function ExperimentLayout({ project }: { project: Project }) {
  return (
    <div className="mx-auto max-w-xl text-center">
      <Eyebrow accent={project.accent}>{project.stack.join(" · ")}</Eyebrow>
      <h2 className="mt-6 font-serif-display text-4xl italic sm:text-5xl">{project.title}</h2>
      <p className="mx-auto mt-6 max-w-md text-lg text-ink-dim">{project.overview}</p>

      {project.approach?.length ? (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {project.approach.map((step) => (
            <span
              key={step}
              className="rounded-full border border-hairline px-3 py-1 font-mono text-[11px] text-ink-dim"
            >
              {step}
            </span>
          ))}
        </div>
      ) : null}

      {project.results?.length ? (
        <p className="mt-10 font-serif-display text-xl italic" style={{ color: project.accent }}>
          {project.results[0].value} — {project.results[0].label}
        </p>
      ) : null}

      <LinksRow links={project.links} />
    </div>
  );
}

// Minimal, links-forward — for published open-source work where the point is "go use it."
function OssLayout({ project }: { project: Project }) {
  return (
    <div className="mx-auto max-w-lg text-center">
      <Eyebrow accent={project.accent}>{project.role}</Eyebrow>
      <h2 className="mt-6 font-serif-display text-4xl italic sm:text-5xl">{project.title}</h2>
      <p className="mx-auto mt-6 max-w-md text-lg text-ink-dim">{project.overview}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-hairline px-3 py-1 font-mono text-[11px] text-ink-dim"
          >
            {tech}
          </span>
        ))}
      </div>
      <LinksRow links={project.links} />
    </div>
  );
}
