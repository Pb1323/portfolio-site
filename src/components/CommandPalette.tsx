"use client";

// Cmd+K / Ctrl+K palette using cmdk (MIT-licensed — see THIRD_PARTY_NOTICES.md).
// Styled entirely from this project's existing design tokens (--canvas, --accent,
// --accent-soft, --hairline) — no new colors introduced.

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { projects } from "@/data/projects";

type Action = {
  id: string;
  label: string;
  hint?: string;
  onSelect: () => void;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    function onOpenEvent() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("open-command-palette", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("open-command-palette", onOpenEvent);
    };
  }, []);

  function go(hash: string) {
    setOpen(false);
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  }

  const navActions: Action[] = [
    { id: "top", label: "Go to top", onSelect: () => go("#top") },
    { id: "work", label: "View work", hint: "Projects", onSelect: () => go("#work") },
    { id: "about", label: "About", onSelect: () => go("#about") },
    { id: "contact", label: "Contact", onSelect: () => go("#contact") },
  ];

  const projectActions: Action[] = projects.map((p) => ({
    id: p.slug,
    label: p.title,
    hint: p.stack.join(" · "),
    onSelect: () => go(`#${p.slug}`),
  }));

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-canvas/70 px-4 pt-[15vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <Command
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-hairline bg-canvas shadow-[0_0_0_1px_rgba(228,219,250,0.08),0_30px_80px_-20px_rgba(139,92,246,0.35)]"
        label="Command palette"
      >
        <div className="flex items-center gap-3 border-b border-hairline px-4 py-3">
          <span className="font-mono text-xs text-accent-soft">⌘K</span>
          <Command.Input
            autoFocus
            placeholder="Jump to a section or project…"
            className="w-full bg-transparent font-sans text-sm text-ink placeholder:text-ink-dim/60 focus:outline-none"
          />
        </div>
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center font-mono text-xs text-ink-dim">
            No matches.
          </Command.Empty>

          <Command.Group
            heading="Navigate"
            className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-ink-dim"
          >
            {navActions.map((a) => (
              <Command.Item
                key={a.id}
                onSelect={a.onSelect}
                className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm text-ink data-[selected=true]:bg-accent/15 data-[selected=true]:text-accent-soft"
              >
                <span>{a.label}</span>
                {a.hint && <span className="font-mono text-[11px] text-ink-dim">{a.hint}</span>}
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group
            heading="Projects"
            className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-ink-dim"
          >
            {projectActions.map((a) => (
              <Command.Item
                key={a.id}
                onSelect={a.onSelect}
                className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm text-ink data-[selected=true]:bg-accent/15 data-[selected=true]:text-accent-soft"
              >
                <span>{a.label}</span>
                {a.hint && <span className="font-mono text-[11px] text-ink-dim">{a.hint}</span>}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
