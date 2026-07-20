export type Project = {
  slug: string;
  title: string;
  tagline: string;
  stack: string[];
  accent: string;
};

// Placeholder content — swap in real projects, taglines, and stacks.
export const projects: Project[] = [
  {
    slug: "project-one",
    title: "Project One",
    tagline: "A short one-liner about what this project does and why it matters.",
    stack: ["Next.js", "TypeScript", "Postgres"],
    accent: "#ff8a3d",
  },
  {
    slug: "project-two",
    title: "Project Two",
    tagline: "Another placeholder project — replace with real outcome and scope.",
    stack: ["Python", "AI/ML"],
    accent: "#3d6dff",
  },
  {
    slug: "project-three",
    title: "Project Three",
    tagline: "Third placeholder slot for a shipped product or experiment.",
    stack: ["React", "WebGL"],
    accent: "#5ce6a6",
  },
];
