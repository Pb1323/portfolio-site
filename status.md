# portfolio-site — status

Next.js 16 + React Three Fiber portfolio for Pranav Bonagiri. Live at **https://pranav-bonagiri.vercel.app** (canonical — same deployment also answers at portfolio-site-three-gray-34.vercel.app; Vercel project name is `portfolio-site`, local repo linked to it via `.vercel/project.json`).

## 2026-09-06/07 session

- **Deploy hygiene:** found and removed a duplicate Vercel project (`pranav-bonagiri`, an older separate project also serving live content). Re-added `pranav-bonagiri.vercel.app` as an alias on the canonical `portfolio-site` project — one project, two aliases, no more split traffic.
- **Hero rebuild:** the previous hero centerpiece (a shader-morphing purple icosahedron with bloom/chromatic aberration, in `src/components/canvas/HeroScene.tsx`) was diagnosed as matching 2026's most-called-out "generic AI-built site" visual signature (dark bg + purple glow + decorative floating primitive — see indiehackers.com/post/the-ai-purple-problem, sailop.com AI Slop 2026 report). Replaced with a **data-driven particle "signature"**: a double-helix where each strand is one of the account's real GitHub languages (via new `src/lib/useGitHubLanguages.ts`, unauthenticated GitHub REST API, one call), sized by repo count, colored with that language's real linguist color. Camera dolly / scroll-trigger behavior kept from before. Typechecks + builds clean; **not yet visually confirmed in a live browser** (no Chrome extension connection available this session) — user was going to eyeball it live and report back.
- **Duplicate-repo check (user's original ask):** `Downloads\Portfolio redesign for Pranav\` (+ zip) is a stale 2026-08-07 Claude Design concept sketch (`.dc.html` + README only, no code) — confirmed not a competing build, safe to ignore/delete whenever.
- **Tool research done, not yet acted on:** Higgsfield (video gen) free tier is ~10 credits/day + watermark — not practical to build around unless upgraded. Motion (ex-Framer Motion) and KokonutUI are good free additions for flat-UI polish (nav/cards), layered alongside existing GSAP+R3F rather than replacing it. Anime.js, Manus, HorizonX.so are not a fit (redundant, unrelated, or paid-only respectively).

## Next action

1. User to visually confirm the new hero looks right (was mid-review when they went to sleep).
2. Open idea, not yet scoped: an AI guide embedded *in* the 3D scene (answering visitor questions live via a free NVIDIA NIM model call) instead of a bolted-on chat widget — ties to user's stated wish to showcase AI integration skills. Needs a NIM account created first (see `free-ai-credits-stack` in the Downloads index).
3. Smaller follow-up idea, same session: turn project cards into physical "locations" in the 3D scene instead of scroll-triggered cards (Bruno Simon–style, scoped to existing project data, not a full game).
4. If pursued later: pull 1-2 components from KokonutUI (free, copy-paste, React/Tailwind) for flat-UI sections, animate with Motion.
