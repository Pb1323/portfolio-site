// Shared knowledge base for the AI Guide (see src/components/AIGuide.tsx and
// src/app/api/ai-guide/route.ts). This is the single source of truth the guide draws on,
// built from the same content already on the page (projects, bio, stack) rather than a
// separately-maintained copy — keep it in sync when project/bio copy changes.

import { projects } from "@/data/projects";

export const BIO = {
  name: "Pranav Bonagiri",
  headline: "Self-taught software engineer who builds full-stack products solo, end-to-end.",
  summary:
    "I'm Pranav — a self-taught developer who builds full-stack products end-to-end, solo. I built Summit Tuition from scratch and took it to £12k ARR in 6 weeks. More recently I built Fly Brain Pong, where a real fruit-fly connectome plays Pong. I like scoping ruthlessly, shipping something real fast, and iterating against actual evidence rather than polishing in a vacuum.",
  stack: [
    "TypeScript",
    "React",
    "Next.js",
    "Three.js",
    "Python",
    "LLM tooling",
    "GSAP",
    "Postgres",
    "Framer Motion",
  ],
  contact: {
    email: "pranav.bgri@gmail.com",
    github: "https://github.com/Pb1323",
  },
};

// Flattened into plain text blocks so both the rule-based fallback (simple keyword search)
// and the LLM system prompt (as grounding context) can consume the same source.
export function buildKnowledgeText(): string {
  const projectBlocks = projects
    .map((p) => {
      const lines = [
        `Project: ${p.title} (${p.slug})`,
        `Tagline: ${p.tagline}`,
        `Stack: ${p.stack.join(", ")}`,
        `Role: ${p.role}, ${p.year}`,
        `Overview: ${p.overview}`,
      ];
      if (p.problem) lines.push(`Problem it solves: ${p.problem}`);
      if (p.approach?.length) lines.push(`Approach: ${p.approach.join(" | ")}`);
      if (p.architecture?.length) lines.push(`Architecture: ${p.architecture.join(" | ")}`);
      if (p.results?.length) {
        lines.push(`Results: ${p.results.map((r) => `${r.label}: ${r.value}`).join(", ")}`);
      }
      if (p.links?.length) lines.push(`Links: ${p.links.map((l) => `${l.label} -> ${l.href}`).join(", ")}`);
      return lines.join("\n");
    })
    .join("\n\n");

  return [
    `Name: ${BIO.name}`,
    `Headline: ${BIO.headline}`,
    `Bio: ${BIO.summary}`,
    `Core stack: ${BIO.stack.join(", ")}`,
    `Contact: ${BIO.contact.email} / ${BIO.contact.github}`,
    "",
    "Projects:",
    projectBlocks,
  ].join("\n");
}

export const SYSTEM_PROMPT = `You are the embedded AI guide on Pranav Bonagiri's portfolio site. You answer visitor questions about Pranav's background, skills, and projects, using ONLY the context below. Be concise (2-4 sentences unless asked for detail), friendly, and specific — cite real project names/numbers rather than generic praise. If asked something outside this context (e.g. general coding help, unrelated topics), politely redirect to what you can answer: Pranav's projects, stack, and background. Never invent facts not present in the context.

Context:
${buildKnowledgeText()}`;

// --- Rule-based fallback (no API key configured) -----------------------------------------
// A small keyword router over the same knowledge base, so the guide is genuinely useful
// (not just a "coming soon" stub) even before an LLM key is wired in.

export type GuideAnswer = { text: string; suggestions?: string[] };

const DEFAULT_SUGGESTIONS = [
  "What's Summit Tuition?",
  "What's your stack?",
  "How can I contact you?",
];

export function ruleBasedAnswer(question: string): GuideAnswer {
  const q = question.toLowerCase().trim();

  if (!q) {
    return {
      text: `Hi, I'm the guide for ${BIO.name}'s site. Ask me about a project, the stack, or how to get in touch.`,
      suggestions: DEFAULT_SUGGESTIONS,
    };
  }

  // Direct project match by title/slug/stack keyword.
  const matchedProject = projects.find((p) => {
    const haystack = [p.title, p.slug, p.tagline, ...p.stack].join(" ").toLowerCase();
    return q.includes(p.slug) || q.includes(p.title.toLowerCase()) || haystack.split(/\W+/).some((w) => w.length > 3 && q.includes(w));
  });

  if (matchedProject) {
    const bits = [matchedProject.tagline];
    if (matchedProject.results?.length) {
      bits.push(matchedProject.results.map((r) => `${r.label}: ${r.value}`).join(" · "));
    }
    bits.push(`Stack: ${matchedProject.stack.join(", ")}.`);
    const link = matchedProject.links?.[0];
    return {
      text: `${matchedProject.title} — ${bits.join(" ")}`,
      suggestions: link ? [`Show me the ${matchedProject.title} repo`, "What's your stack?"] : DEFAULT_SUGGESTIONS,
    };
  }

  if (/stack|tech|technolog|language|framework/.test(q)) {
    return {
      text: `Pranav's daily-driver stack is ${BIO.stack.join(", ")}. Most projects on this site use TypeScript/Next.js on the frontend, with Python for ML/data work like QuickDraw AI.`,
      suggestions: ["Tell me about Summit Tuition", "Tell me about QuickDraw AI"],
    };
  }

  if (/contact|email|reach|hire|linkedin|github/.test(q)) {
    return {
      text: `You can reach Pranav at ${BIO.contact.email} or find his code at ${BIO.contact.github}. There's also a contact section further down the page.`,
      suggestions: DEFAULT_SUGGESTIONS,
    };
  }

  if (/who|about|bio|background|age|old|self.?taught/.test(q)) {
    return { text: BIO.summary, suggestions: ["What's Summit Tuition?", "What's QuickDraw AI?"] };
  }

  if (/project|built|work|portfolio|experience/.test(q)) {
    const list = projects.map((p) => `${p.title} — ${p.tagline}`).join(" | ");
    return { text: `Pranav's shipped projects: ${list}`, suggestions: projects.map((p) => `Tell me about ${p.title}`) };
  }

  return {
    text: "I'm not sure about that one yet — I can talk about Pranav's projects, his stack, or how to get in touch. Try one of the suggestions below.",
    suggestions: DEFAULT_SUGGESTIONS,
  };
}
