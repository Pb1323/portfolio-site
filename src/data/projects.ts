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

export const projects: Project[] = [
  {
    slug: "summit-tuition",
    title: "Summit Tuition",
    tagline: "A premium online 11+ tuition platform — built solo, £6k ARR within 3 weeks of launch.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Stripe"],
    accent: "#8b5cf6",
    template: "case-study",
    year: "2026",
    role: "Founder & Solo Developer",
    overview:
      "Summit Tuition is a full-stack tutoring platform combining a marketing site with a working student/admin product: online mock exams, manual student approval and unlocks, admin marking, and released reports. I designed, built, and shipped the entire thing solo, then took it live to paying customers.",
    problem:
      "Parents shopping for 11+ tutoring were choosing between expensive 1:1 tuition and generic PDF practice packs with no feedback loop. There was no affordable, self-serve product that combined real exam-style mocks with a proper marking/reporting workflow.",
    approach: [
      "Shipped a narrow v1 first: online-only mocks with manual admin unlock, deliberately skipping self-serve payments until the core product worked.",
      "Built a real question bank and mock-generation pipeline (English + Maths, GL-exam style) rather than shipping generic quiz content.",
      "Validated pricing and demand directly with real paying families before investing further, iterating the funnel (landing → free sample → registration → paid tier) based on actual conversion, not guesses.",
    ],
    architecture: [
      "Next.js App Router frontend with a client state bridge (useSyncExternalStore) syncing to server APIs, with a localStorage demo-mode fallback for zero-config trials.",
      "PostgreSQL + Prisma for durable student, mock, attempt, and plan data; tiered product plans (Free/Pro/Max) computed dynamically from the content catalog.",
      "Stripe Checkout integration for paid tiers, with a WhatsApp manual-payment fallback wired in for markets/moments where full checkout wasn't yet live.",
    ],
    results: [
      { label: "Revenue", value: "£6k ARR in 3 weeks" },
      { label: "Build", value: "Solo, end-to-end" },
      { label: "Scope", value: "Auth, payments, admin, mocks" },
    ],
    links: [{ label: "GitHub", href: "https://github.com/Pb1323/summit-tuition" }],
  },
  {
    slug: "quickdraw-ai",
    title: "QuickDraw AI",
    tagline: "A real-time doodle-recognition game powered by a CNN trained on Google's Quick, Draw! dataset.",
    stack: ["Python", "PyTorch", "FastAPI"],
    accent: "#d946ef",
    template: "experiment",
    year: "2026",
    role: "Developer",
    overview:
      "Sketch on a canvas and a convolutional neural network guesses what you're drawing in real time, across 20 categories. Backend serves live inference over FastAPI; the model is trained from scratch on Quick, Draw! bitmap data.",
    approach: [
      "Built a data pipeline to pull and preprocess Quick, Draw! bitmaps",
      "Trained a small CNN (conv/pool ×2 + FC layers with dropout) from scratch",
      "Served real-time predictions over a FastAPI backend to a canvas frontend",
    ],
    results: [{ label: "Classes", value: "20 drawing categories" }],
    links: [{ label: "GitHub", href: "https://github.com/Pb1323/quickdraw-ai" }],
  },
];
