"use client";

import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { useGitHubActivity, formatCommitLine } from "@/lib/useGitHubActivity";

type Line = { command: string; output: string[] };

// Fallback shown if the live GitHub feed above (useGitHubActivity) errors or returns nothing.
const SCRIPTED_LINES: Line[] = [
  {
    command: "whoami",
    output: ["Pranav Bonagiri — self-taught software engineer, building full-stack products solo."],
  },
  {
    command: "projects --list",
    output: [
      "fly-brain-pong   real fly connectome vs shuffled wiring: 93.7% vs 23.1%",
      "summit-tuition   11+ tutoring platform, £12k ARR in 6 weeks",
      "quickdraw-ai     real-time doodle-recognition CNN + FastAPI",
    ],
  },
  {
    command: "skills --top 5",
    output: ["TypeScript, Python, React/Next.js, PyTorch, PostgreSQL/Prisma"],
  },
  {
    command: "contact",
    output: ["pranav.bgri@gmail.com  ->  github.com/Pb1323"],
  },
];

// Falls back to SCRIPTED_LINES below if the API errors or returns no recent push activity,
// so the terminal never silently renders empty.
const GITHUB_USERNAME = "Pb1323";

export default function Terminal() {
  const { lines: commits } = useGitHubActivity(GITHUB_USERNAME, 4);
  const [visibleLines, setVisibleLines] = useState(0);
  const [typed, setTyped] = useState("");
  const started = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const LINES: Line[] =
    commits && commits.length > 0
      ? [SCRIPTED_LINES[0], ...commits.map(formatCommitLine), SCRIPTED_LINES[SCRIPTED_LINES.length - 1]]
      : SCRIPTED_LINES;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function runSequence() {
      let lineIndex = 0;

      function typeCommand(cmd: string, onDone: () => void) {
        let i = 0;
        const interval = setInterval(() => {
          i += 1;
          setTyped(cmd.slice(0, i));
          if (i >= cmd.length) {
            clearInterval(interval);
            setTimeout(onDone, 250);
          }
        }, 45);
      }

      function nextLine() {
        if (lineIndex >= LINES.length) return;
        const line = LINES[lineIndex];
        setTyped("");
        typeCommand(line.command, () => {
          setVisibleLines((v) => v + 1);
          setTyped("");
          lineIndex += 1;
          setTimeout(nextLine, 400);
        });
      }

      nextLine();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          runSequence();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commits]);

  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <ScrollReveal>
        <div
          ref={containerRef}
          className="rounded-2xl border border-hairline bg-black/60 font-mono text-sm shadow-2xl"
        >
          <div className="flex items-center gap-2 border-b border-hairline px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            <span className="ml-3 text-xs text-ink-dim">guest@portfolio: ~</span>
          </div>
          <div className="min-h-[220px] space-y-3 p-5">
            {LINES.slice(0, visibleLines).map((line, i) => (
              <div key={`${line.command}-${i}`}>
                <div className="text-accent-soft">
                  <span className="text-ink-dim">$</span> {line.command}
                </div>
                {line.output.map((out) => (
                  <div key={out} className="text-ink-dim">
                    {out}
                  </div>
                ))}
              </div>
            ))}
            {visibleLines < LINES.length && (
              <div className="text-accent-soft">
                <span className="text-ink-dim">$</span> {typed}
                <span className="cursor-blink">_</span>
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
