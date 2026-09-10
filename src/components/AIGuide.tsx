"use client";

// Embedded AI guide — a floating chat widget that answers visitor questions about Pranav's
// background/stack/projects. Styled from the same tokens as CommandPalette.tsx (rounded-2xl,
// border-hairline, bg-canvas, accent-soft) so it reads as part of this site, not a bolted-on
// third-party widget.
//
// Backend: POSTs to /api/ai-guide (src/app/api/ai-guide/route.ts). That route calls an
// OpenAI-compatible LLM (NVIDIA NIM by default) when AI_GUIDE_API_KEY is set in the
// environment; with no key configured, it answers from the rule-based fallback in
// src/lib/aiGuideKnowledge.ts, so this widget is fully functional (never a dead "coming
// soon" stub) even before a key is wired in — it just answers from the site's own data
// instead of a general-purpose model.

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BIO } from "@/lib/aiGuideKnowledge";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  mode?: "live" | "offline" | "fallback";
};

const OPENING_MESSAGE: Message = {
  id: "opening",
  role: "assistant",
  text: `Hi, I'm the AI guide for ${BIO.name}'s site. Ask me about a project, the stack, or how to reach out.`,
  mode: "offline",
};

const STARTER_SUGGESTIONS = ["What's Summit Tuition?", "What's your stack?", "How can I contact you?"];

function newId() {
  return Math.random().toString(36).slice(2);
}

export default function AIGuide() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([OPENING_MESSAGE]);
  const [suggestions, setSuggestions] = useState<string[]>(STARTER_SUGGESTIONS);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function toggleOpen() {
    setOpen((v) => !v);
    setHasOpenedOnce(true);
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = { id: newId(), role: "user", text: trimmed };
    const history = messages
      .filter((m) => m.id !== "opening")
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.text }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSuggestions([]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Request failed");
      }

      setMessages((prev) => [
        ...prev,
        { id: newId(), role: "assistant", text: data.reply, mode: data.mode },
      ]);
      setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "assistant",
          text: "Something went wrong reaching the guide — try again, or email pranav.bgri@gmail.com directly.",
          mode: "offline",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <motion.button
        type="button"
        aria-label={open ? "Close AI guide" : "Open AI guide"}
        data-cursor={open ? "Close" : "Ask AI"}
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-hairline bg-canvas shadow-[0_10px_40px_-10px_rgba(139,92,246,0.55)]"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span
          className="absolute inset-0 rounded-full opacity-70"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 40%, rgba(139,92,246,0.35) 0%, transparent 70%)",
          }}
          aria-hidden
        />
        {!hasOpenedOnce && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent-pink" />
        )}
        <span className="relative font-mono text-[10px] uppercase tracking-widest text-accent-soft">
          {open ? "✕" : "AI"}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="AI guide chat"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-40 flex w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-hairline bg-canvas shadow-[0_0_0_1px_rgba(228,219,250,0.08),0_30px_80px_-20px_rgba(139,92,246,0.35)]"
          >
            <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent-soft">AI Guide</p>
                <p className="text-xs text-ink-dim">Ask about my projects, stack, or background</p>
              </div>
              <button
                type="button"
                aria-label="Close"
                data-cursor="Close"
                onClick={() => setOpen(false)}
                className="rounded-full border border-hairline px-2 py-1 font-mono text-[10px] text-ink-dim"
              >
                ✕
              </button>
            </div>

            <div ref={scrollRef} className="themed-scroll max-h-96 min-h-[220px] space-y-3 overflow-y-auto p-4">
              {messages.map((m) => (
                <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-2xl rounded-br-sm bg-accent/20 px-3 py-2 text-sm text-ink"
                        : "max-w-[85%] rounded-2xl rounded-bl-sm border border-hairline bg-white/[0.03] px-3 py-2 text-sm text-ink"
                    }
                  >
                    {m.text}
                    {m.role === "assistant" && m.mode && m.mode !== "live" && (
                      <p className="mt-1.5 font-mono text-[9px] uppercase tracking-wider text-ink-dim/70">
                        rule-based answer · no AI key configured yet
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm border border-hairline bg-white/[0.03] px-3 py-2 text-sm text-ink-dim">
                    <span className="cursor-blink">…</span>
                  </div>
                </div>
              )}
            </div>

            {suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t border-hairline px-4 py-3">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    data-cursor="Ask"
                    onClick={() => send(s)}
                    className="rounded-full border border-hairline px-3 py-1.5 font-mono text-[11px] text-ink-dim transition-colors hover:border-accent hover:text-accent-soft"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-hairline p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                maxLength={500}
                className="w-full bg-transparent px-2 py-2 text-sm text-ink placeholder:text-ink-dim/60 focus:outline-none"
              />
              <button
                type="submit"
                data-cursor="Send"
                disabled={loading || !input.trim()}
                className="rounded-full border border-hairline px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-accent-soft disabled:opacity-30"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
