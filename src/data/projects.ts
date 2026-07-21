export type ProjectTemplate = "case-study" | "experiment" | "oss";

export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectStat = {
  label: string;
  value: string;
};

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  stack: string[];
  accent: string;
  template: ProjectTemplate;
  year: string;
  role: string;
  overview: string;
  problem?: string;
  approach?: string[];
  architecture?: string[];
  results?: ProjectStat[];
  links?: ProjectLink[];
};

// Placeholder content — swap in real projects, taglines, and stacks.
// `template` picks the detail-view layout: "case-study" (full problem/approach/architecture/
// results breakdown), "experiment" (shorter narrative read for prototypes/explorations), or
// "oss" (stack + links up front, for published open-source work).
export const projects: Project[] = [
  {
    slug: "project-one",
    title: "Project One",
    tagline: "A short one-liner about what this project does and why it matters.",
    stack: ["Next.js", "TypeScript", "Postgres"],
    accent: "#8b5cf6",
    template: "case-study",
    year: "[Year]",
    role: "[Your role]",
    overview:
      "[Placeholder — 2-3 sentences on what this product is, who it's for, and the outcome it drives. Write it like you'd explain it to a smart stranger at a party.]",
    problem:
      "[Placeholder — the specific pain point or gap that existed before this shipped. Be concrete: what were people doing instead, and why did it hurt?]",
    approach: [
      "[Placeholder step — how you scoped the first version and what you deliberately left out.]",
      "[Placeholder step — the key technical decision that shaped everything downstream.]",
      "[Placeholder step — how you validated it was actually working before scaling it up.]",
    ],
    architecture: [
      "[Placeholder — client layer: framework, rendering strategy, state approach.]",
      "[Placeholder — data layer: database, caching, or queueing choices and why.]",
      "[Placeholder — the one integration or constraint that made this interesting to build.]",
    ],
    results: [
      { label: "[Metric]", value: "[Value]" },
      { label: "[Metric]", value: "[Value]" },
      { label: "[Metric]", value: "[Value]" },
    ],
    links: [{ label: "Live site", href: "#" }],
  },
  {
    slug: "project-two",
    title: "Project Two",
    tagline: "Another placeholder project — replace with real outcome and scope.",
    stack: ["Python", "AI/ML"],
    accent: "#d946ef",
    template: "experiment",
    year: "[Year]",
    role: "[Your role]",
    overview:
      "[Placeholder — what this experiment set out to test, and the one-line result. Experiments read best as a hypothesis and an answer.]",
    approach: ["Rapid prototype", "Small eval set", "Manual review", "Iterate on prompt/pipeline"],
    results: [{ label: "[Outcome]", value: "[Value]" }],
    links: [{ label: "Write-up", href: "#" }],
  },
  {
    slug: "project-three",
    title: "Project Three",
    tagline: "Third placeholder slot for a shipped product or experiment.",
    stack: ["React", "WebGL"],
    accent: "#6366f1",
    template: "oss",
    year: "[Year]",
    role: "Maintainer",
    overview:
      "[Placeholder — what the package/library does in one sentence, and why you built it instead of using an existing one.]",
    links: [
      { label: "GitHub", href: "#" },
      { label: "npm", href: "#" },
      { label: "Docs", href: "#" },
    ],
  },
];
