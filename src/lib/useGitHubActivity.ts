"use client";

// Real commit data from the GitHub REST API (public, unauthenticated — 60 req/hr rate
// limit). Terminal.tsx falls back to its scripted lines on error/empty so the terminal
// never silently renders nothing.

import { useEffect, useState } from "react";

export type CommitLine = { repo: string; message: string; date: string };

type GitHubEvent = {
  type: string;
  repo: { name: string };
  payload: { commits?: { message: string }[] };
  created_at: string;
};

export function useGitHubActivity(username: string, limit = 6) {
  const [lines, setLines] = useState<CommitLine[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`https://api.github.com/users/${username}/events/public?per_page=30`);
        if (!res.ok) throw new Error(`GitHub API ${res.status}`);
        const events: GitHubEvent[] = await res.json();
        const pushes = events
          .filter((e) => e.type === "PushEvent")
          .flatMap((e) =>
            (e.payload.commits ?? []).map((c) => ({
              repo: e.repo.name.split("/")[1] ?? e.repo.name,
              message: c.message.split("\n")[0].slice(0, 64),
              date: e.created_at,
            }))
          )
          .slice(0, limit);
        if (!cancelled) setLines(pushes);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "failed to load");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [username, limit]);

  return { lines, error };
}

export function formatCommitLine(c: CommitLine) {
  return { command: `git log --oneline -1 ${c.repo}`, output: [c.message] };
}
