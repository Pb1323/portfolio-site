// AI Guide backend — an OpenAI-compatible chat completion proxy, swappable to any
// OpenAI-compatible base URL (defaults to NVIDIA NIM's free-tier endpoint).
//
// Env vars (set these in Vercel / .env.local to go live — none are required to run):
//   AI_GUIDE_API_KEY   - required to enable live LLM calls. Without it, this route runs in
//                         "offline" mode and answers using the rule-based fallback below, so
//                         the feature never breaks/errors on a deploy with no key configured.
//   AI_GUIDE_BASE_URL  - optional, OpenAI-compatible base URL. Defaults to NVIDIA NIM
//                         (https://integrate.api.nvidia.com/v1). Swap to any other
//                         OpenAI-compatible provider (Groq, OpenRouter, etc.) if preferred.
//   AI_GUIDE_MODEL     - optional, model id for the chosen provider. Defaults to a small NIM
//                         instruct model.
//
// To get a NIM key: sign up at build.nvidia.com (no card required), grab an API key from
// the dashboard, then set AI_GUIDE_API_KEY in Vercel's project env vars and redeploy.

import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT, ruleBasedAnswer } from "@/lib/aiGuideKnowledge";

export const runtime = "nodejs";

const DEFAULT_BASE_URL = "https://integrate.api.nvidia.com/v1";
const DEFAULT_MODEL = "meta/llama-3.1-8b-instruct";
const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY = 8;

type ChatMessage = { role: "user" | "assistant"; content: string };

type RequestBody = {
  message?: string;
  history?: ChatMessage[];
};

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = (body.message ?? "").toString().slice(0, MAX_MESSAGE_LENGTH).trim();
  if (!message) {
    return NextResponse.json({ error: "Missing 'message'." }, { status: 400 });
  }

  const history = Array.isArray(body.history) ? body.history.slice(-MAX_HISTORY) : [];

  const apiKey = process.env.AI_GUIDE_API_KEY;

  // Offline mode: no key configured. Answer from the on-page project/bio data instead of
  // silently failing or calling out to nothing.
  if (!apiKey) {
    const answer = ruleBasedAnswer(message);
    return NextResponse.json({
      reply: answer.text,
      suggestions: answer.suggestions,
      mode: "offline",
    });
  }

  const baseUrl = process.env.AI_GUIDE_BASE_URL || DEFAULT_BASE_URL;
  const model = process.env.AI_GUIDE_MODEL || DEFAULT_MODEL;

  try {
    const upstream = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...history.map((m) => ({ role: m.role, content: String(m.content).slice(0, MAX_MESSAGE_LENGTH) })),
          { role: "user", content: message },
        ],
        temperature: 0.4,
        max_tokens: 300,
        stream: false,
      }),
      // Keep the live site responsive even if the upstream provider stalls.
      signal: AbortSignal.timeout(15_000),
    });

    if (!upstream.ok) {
      const fallback = ruleBasedAnswer(message);
      return NextResponse.json({
        reply: fallback.text,
        suggestions: fallback.suggestions,
        mode: "fallback",
        note: `Upstream AI provider returned ${upstream.status}; showing a rule-based answer instead.`,
      });
    }

    const data = await upstream.json();
    const reply: string | undefined = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      const fallback = ruleBasedAnswer(message);
      return NextResponse.json({
        reply: fallback.text,
        suggestions: fallback.suggestions,
        mode: "fallback",
      });
    }

    return NextResponse.json({ reply, mode: "live" });
  } catch {
    // Network error / timeout / provider outage — degrade gracefully rather than 500ing.
    const fallback = ruleBasedAnswer(message);
    return NextResponse.json({
      reply: fallback.text,
      suggestions: fallback.suggestions,
      mode: "fallback",
      note: "Couldn't reach the AI provider; showing a rule-based answer instead.",
    });
  }
}
