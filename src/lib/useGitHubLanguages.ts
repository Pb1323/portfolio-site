"use client";

// Real per-repo primary-language data from the GitHub REST API (public, unauthenticated —
// 60 req/hr rate limit, one request total). Used to drive the hero scene so its form is
// built from actual repo data instead of a decorative placeholder shape.

import { useEffect, useState } from "react";

export type LanguageGroup = { name: string; color: string; count: number };

type GitHubRepo = { language: string | null; fork: boolean };

// GitHub's own linguist colors for the languages this account actually uses — keeps the
// hero recognizable as "real language data" rather than an arbitrary palette.
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  Shell: "#89e051",
  "C++": "#f34b7d",
  C: "#555555",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Ruby: "#701516",
  Go: "#00ADD8",
  PHP: "#4F5D95",
};
const FALLBACK_COLOR = "#ada4c9";

// Shown only while the live feed loads or if it errors — a plausible, clearly-fallback mix,
// mirroring the fallback convention already used by useGitHubActivity / Terminal.tsx.
export const PLACEHOLDER_LANGUAGES: LanguageGroup[] = [
  { name: "TypeScript", color: LANGUAGE_COLORS.TypeScript, count: 9 },
  { name: "JavaScript", color: LANGUAGE_COLORS.JavaScript, count: 4 },
  { name: "Python", color: LANGUAGE_COLORS.Python, count: 3 },
  { name: "CSS", color: LANGUAGE_COLORS.CSS, count: 2 },
];

export function useGitHubLanguages(username: string) {
  const [languages, setLanguages] = useState<LanguageGroup[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&type=owner`
        );
        if (!res.ok) throw new Error(`GitHub API ${res.status}`);
        const repos: GitHubRepo[] = await res.json();
        const counts = new Map<string, number>();
        repos
          .filter((r) => !r.fork && r.language)
          .forEach((r) => counts.set(r.language!, (counts.get(r.language!) ?? 0) + 1));
        const groups = Array.from(counts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([name, count]) => ({ name, color: LANGUAGE_COLORS[name] ?? FALLBACK_COLOR, count }));
        if (!cancelled && groups.length > 0) setLanguages(groups);
      } catch {
        // leave languages null; caller falls back to PLACEHOLDER_LANGUAGES
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [username]);

  return languages;
}
