# portfolio-site — status

Next.js 16 + React Three Fiber portfolio for Pranav Bonagiri. Live at **https://pranav-bonagiri.vercel.app** (canonical — same deployment also answers at portfolio-site-three-gray-34.vercel.app; Vercel project name is `portfolio-site`, local repo linked to it via `.vercel/project.json`).

## 2026-09-06/07 session

- **Deploy hygiene:** found and removed a duplicate Vercel project (`pranav-bonagiri`, an older separate project also serving live content). Re-added `pranav-bonagiri.vercel.app` as an alias on the canonical `portfolio-site` project — one project, two aliases, no more split traffic.
- **Hero rebuild:** the previous hero centerpiece (a shader-morphing purple icosahedron with bloom/chromatic aberration, in `src/components/canvas/HeroScene.tsx`) was diagnosed as matching 2026's most-called-out "generic AI-built site" visual signature (dark bg + purple glow + decorative floating primitive — see indiehackers.com/post/the-ai-purple-problem, sailop.com AI Slop 2026 report). Replaced with a **data-driven particle "signature"**: a double-helix where each strand is one of the account's real GitHub languages (via new `src/lib/useGitHubLanguages.ts`, unauthenticated GitHub REST API, one call), sized by repo count, colored with that language's real linguist color. Camera dolly / scroll-trigger behavior kept from before. Typechecks + builds clean; **not yet visually confirmed in a live browser** (no Chrome extension connection available this session) — user was going to eyeball it live and report back.
- **Duplicate-repo check (user's original ask):** `Downloads\Portfolio redesign for Pranav\` (+ zip) is a stale 2026-08-07 Claude Design concept sketch (`.dc.html` + README only, no code) — confirmed not a competing build, safe to ignore/delete whenever.
- **Tool research done, not yet acted on:** Higgsfield (video gen) free tier is ~10 credits/day + watermark — not practical to build around unless upgraded. Motion (ex-Framer Motion) and KokonutUI are good free additions for flat-UI polish (nav/cards), layered alongside existing GSAP+R3F rather than replacing it. Anime.js, Manus, HorizonX.so are not a fit (redundant, unrelated, or paid-only respectively).

## 2026-09-10 session (unattended, 30 min)

- **Built the embedded AI guide** (previously just an open idea in this doc): a floating chat widget, not embedded in the 3D scene — scoped it as a bolted-on-but-on-brand chat panel (bottom-right launcher + panel) rather than a scene-embedded guide, since wiring chat state into the R3F hero scene was a much larger lift than a 30-min session should take and the widget approach ships something real today. The 3D-embedded version is still a valid future upgrade if wanted (see below).
  - `src/components/AIGuide.tsx` — floating launcher button + chat panel, styled entirely from existing tokens (`--canvas`/`--accent`/`--hairline`, `rounded-2xl`, `font-mono` labels) to match `CommandPalette.tsx`'s look. Uses `framer-motion` (already a dependency) for open/close, wires into `CustomCursor`'s `data-cursor` magnetic-label pattern.
  - `src/app/api/ai-guide/route.ts` — Next.js API route, OpenAI-compatible chat-completions proxy. Defaults to NVIDIA NIM's base URL (`https://integrate.api.nvidia.com/v1`) and a small Llama instruct model, both overridable via env vars so any OpenAI-compatible provider (Groq, OpenRouter, etc.) works without code changes.
  - `src/lib/aiGuideKnowledge.ts` — single source of truth for the guide's knowledge (bio + `src/data/projects.ts` reformatted into prose), used both as the LLM system-prompt context *and* as a standalone rule-based keyword-matching answerer.
  - **No API key configured yet → the widget is NOT a dead stub.** With no `AI_GUIDE_API_KEY` env var set, the route answers from the rule-based fallback (keyword match over projects/bio/stack/contact) — verified locally (`next start` + `curl`) that it returns real, correct answers about Summit Tuition, stack, and contact info with zero external calls. Each fallback answer is labeled in the UI ("rule-based answer · no AI key configured yet") so it's honest about its own mode rather than pretending to be a live model. Any upstream error/timeout when a key *is* configured also degrades to this same fallback rather than erroring the widget.
  - Verified: `npx tsc --noEmit` clean, `npx eslint` clean (one `react-hooks/set-state-in-effect` lint error caught and fixed — moved `setHasOpenedOnce` out of an effect into the click handler), `npx next build` succeeds with `/api/ai-guide` registered as a dynamic route, and a local `next start` smoke test confirms both the Summit Tuition and contact-info fallback answers are correct.
  - Committed and pushed to `origin/master` (commit `38dd270`).

### To make it fully live (not done this session — needs a human-created account/key)
1. Sign up for a free NVIDIA NIM account at build.nvidia.com (no card required, ~1000 free credits) and grab an API key — or use any other OpenAI-compatible provider (Groq, OpenRouter, etc.).
2. In Vercel's project settings (`portfolio-site`) → Environment Variables, set:
   - `AI_GUIDE_API_KEY` — required. Without this the widget stays in rule-based-fallback mode (safe, not broken, just not a real LLM).
   - `AI_GUIDE_BASE_URL` — optional, only needed if using a provider other than NIM (defaults to `https://integrate.api.nvidia.com/v1`).
   - `AI_GUIDE_MODEL` — optional, only needed to pick a different model than the NIM default (`meta/llama-3.1-8b-instruct`).
3. Redeploy. No code changes needed — the route already branches on whether the key is present.

## Next action

1. User to visually confirm the new hero looks right (was mid-review when they went to sleep) — still open from last session.
2. User to visually confirm the new AI guide widget (bottom-right chat bubble) looks/feels right, and decide whether to actually create a NIM key to go live, or leave it in rule-based mode.
3. Smaller follow-up idea, still open: turn project cards into physical "locations" in the 3D scene instead of scroll-triggered cards (Bruno Simon–style, scoped to existing project data, not a full game). A scene-embedded version of the AI guide (vs. the bolted-on widget built this session) could piggyback on this same 3D-navigation work if pursued.
4. If pursued later: pull 1-2 components from KokonutUI (free, copy-paste, React/Tailwind) for flat-UI sections, animate with Motion.
5. `src/data/qualifications.ts` is still placeholder content (`[Qualification — e.g. A-Levels]` etc.) — flagged here since it was noticed in passing this session, not acted on (out of scope for the AI-guide task, and needs real personal data from the user).

## 2026-09-25: portfolio audit fixes applied
From `PORTFOLIO-AUDIT.md`:
- Removed the placeholder text (Qualifications brackets and the ProjectsGrid "[placeholder projects…]" line).
- Corrected the Summit figure from £6k ARR / 3 weeks to **£12k ARR / 6 weeks** everywhere it appeared: meta, hero, about, resume, experience, terminal, projects and the AI guide.
- Added **Fly Brain Pong** as the first featured project, plus a Journey entry and a terminal line, linking to https://neural-network-pranav-bonagiri.vercel.app. The copy follows the honesty rule ("connectome-constrained simulation"; built with AI coding tools, and Pranav designed the question and the fair test).
- Replaced the dead LinkedIn `href="#"` with the Fly Pong link. LinkedIn was left out on purpose (it's 16+).
- The Qualifications institution reads "State grammar school, north London" until the exact school name is confirmed.

Deployment Protection was turned off by the user (the site returns 200). `tsc` and `next build` are clean. Still open: the P1/P2 items in the audit (OG image, the blur-keyframe warning, the purple hero wash).
