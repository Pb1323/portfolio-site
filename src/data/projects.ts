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
    slug: "fly-brain-pong",
    title: "Fly Brain Pong",
    tagline: "Play Pong against a real fruit-fly connectome. Its wiring returns 93.7% of balls; the same neurons shuffled, 23.1%.",
    stack: ["JavaScript", "Canvas", "Spiking neural simulation", "Node.js"],
    accent: "#22d3ee",
    template: "experiment",
    year: "2026",
    role: "Designer & Developer",
    overview:
      "A connectome-constrained simulation, not an uploaded or conscious fly. One paddle is steered by a real 651-neuron slice of the FlyWire fruit-fly brain, from its eyes' target-tracking cells to its steering neurons, simulated as spiking neurons. You can play against it, pit it against a classic CPU paddle, or run the original experiment against the same neurons randomly rewired. Nothing learns or is trained; the only difference between the brains is who's wired to whom.",
    problem:
      "Does a small, real piece of a real brain's wiring actually carry a useful signal, or would any similar-sized random network do as well? I wanted a fair, falsifiable test, not a demo dressed up to look impressive.",
    approach: [
      "Extracted a 651-neuron / 17,203-edge subgraph from the FlyWire v783 connectome (published CC BY data), from the LC10a visual pathway to the DNa01/DNa02 steering neurons.",
      "Built a random control with identical neurons, per-neuron in/out-degree and excitatory/inhibitory synapse totals, so only the specific wiring differs.",
      "Ran the same leaky integrate-and-fire model (Shiu et al. 2024 parameters) for both, calibrated once on the real brain and reused unchanged, across 8 shuffled brains and 4,000 simulated points. I designed the question and the fair test; built with AI coding tools.",
    ],
    results: [
      { label: "Real wiring", value: "93.7% of balls returned" },
      { label: "Shuffled wiring", value: "23.1% (≈ a paddle that never moves)" },
      { label: "Score over 4,000 points", value: "3,921–79" },
    ],
    links: [{ label: "Play it", href: "https://neural-network-pranav-bonagiri.vercel.app" }],
  },
  {
    slug: "summit-tuition",
    title: "Summit Tuition",
    tagline: "A premium online 11+ tuition platform — built solo, £12k ARR within 6 weeks of launch.",
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
      { label: "Revenue", value: "£12k ARR in 6 weeks" },
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
