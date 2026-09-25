# Portfolio Audit — pranav-bonagiri.vercel.app

Date: 2026-09-25. Docs/research only — no live-site code changed, nothing deployed, per the brief. This continues a run cut off by a usage cap; no partial output from that run existed on disk or in git (`git status` was clean, no prior `PORTFOLIO-AUDIT.md` or screenshots found), so this is a full pass. Screenshots from this session are in `audit-screens/` (captured against a local `next build && next start`, not the live URL — see Finding #1).

---

## TOP 5 FIXES (do these first)

1. **The live site is not publicly reachable — fix this before anything else.** `https://pranav-bonagiri.vercel.app` currently 302-redirects every visitor to `vercel.com/login` (Vercel Deployment Protection / SSO is enabled on the `portfolio-site` project under the `summit-tuition-team` org). Reproducible right now: `curl -I https://pranav-bonagiri.vercel.app` returns `302` to `vercel.com/sso-api?...`. Anyone without a login to that Vercel team — every recruiter, tutor, or accelerator reviewer — hits a login wall, not the portfolio. This is a Vercel dashboard setting (Project → Settings → Deployment Protection → set to "Only Preview Deployments" or "Disabled" for Production), not a code change, so it's outside this audit's "docs only" scope to flip — but it should be the very first thing fixed, ahead of any content work below, because none of the content fixes matter while the site is invisible.
2. **The live "QUALS" section is showing literal placeholder brackets to real visitors.** `src/data/qualifications.ts` still has `credential: "[Qualification — e.g. A-Levels]"`, `detail: "[Subjects & grades]"`, `institution: "[School/college name]"`, `year: "[Year]"` — and `src/components/Qualifications.tsx` renders these fields with no fallback, so the public nav's "QUALS" tab shows bracketed template text. Confirmed live via local build screenshot. Fix: replace with real data — the brief itself confirms "Year 11, predicted 8-9s" as a usable real fact if exact grades aren't ready yet (see exact copy below).
3. **The projects grid is showing a literal placeholder disclaimer to real visitors.** `src/components/ProjectsGrid.tsx:85` renders the hard-coded line `[placeholder projects — swap in real case studies, links, and demo loops]` directly under the two real project cards — visible on every page load, not a comment. Confirmed live via local build screenshot (`audit-screens/nav-work-click.png`). This reads as unfinished/abandoned to anyone who scrolls past the first two cards.
4. **Fly Brain Pong isn't on the site at all, and it's the strongest project.** `src/data/projects.ts` currently has exactly two projects (Summit Tuition, QuickDraw AI). Fly Brain Pong — now polished, approved to go public, with a rigorous, honestly-labeled result (real connectome wiring returns 93.7% of balls vs. 23.1% for degree-shuffled random wiring, 3,921–79 over 4,000 points, methodology in `fly-brain-pong/RESULTS.md`) — is a far more distinctive, talking-point-worthy project than either current entry for admissions/accelerator/recruiter audiences (see research below on what those audiences actually reward: demonstrated original thinking > tutorial-shaped CRUD apps). It should be added as the featured/first project. Exact copy and honesty constraints below.
5. **The £6k ARR stat is wrong everywhere it appears, and it appears four times.** The brief's confirmed real fact is **£12k ARR in 6 weeks** (a past milestone). The live site instead says "£6k ARR in 3 weeks" / "£6k ARR within 3 weeks" in four separate places: `src/app/layout.tsx` (meta description — also becomes the Google/social preview text), `src/app/page.tsx` (hero subhead), `src/components/About.tsx` (about paragraph), `src/components/Experience.tsx` ("Journey" timeline), and again inside `src/data/projects.ts`'s Summit Tuition tagline/overview. An admissions tutor, recruiter, or accelerator reviewer who cross-references this against anything else Pranav has said (CV, LinkedIn, a call) will catch the mismatch — small factual inconsistencies are exactly the kind of thing that erodes credibility with exactly the audiences this site is for. Fix all five locations to the same number.

---

## Research: what the target audiences actually reward

*(15 searches + 2 page fetches, all sourced below; kept to a hard budget as instructed — this is a representative, not exhaustive, sample.)*

### What recruiters/hiring managers say (2026)
- 84% of hiring managers want to see **working, deployed applications**, not just source — "clone" projects (Netflix/Spotify/Twitter clones) actively hurt because they signal tutorial-following, not initiative. 73% rate a strong portfolio above a polished CV. A recruiter gives a portfolio **~15 seconds** before deciding whether to keep reading — the job of the first screen is to answer "is there enough here to click into" fast. Quality beats quantity: 3 excellent projects beat 10 mediocre ones. — [Developer Portfolio Guide 2026 (Hakia)](https://hakia.com/skills/building-portfolio/), [Codeboards.io 2026 guide](https://codeboards.io/blog/developer-portfolio-guide-2026)
- Dark mode remains the dominant 2026 aesthetic for dev portfolios (already the case here); a custom domain signals professionalism. — [SiteBuilderReport, Software Engineer Portfolios](https://www.sitebuilderreport.com/inspiration/software-engineer-portfolios)

### What YC/accelerators say
- For early-stage applicants, **founder background and demonstrated resourcefulness matter more than the idea** — YC explicitly treats side projects (not just startups) as a proxy for "can this person build and finish things." Speed of current progress is the second-strongest signal after past accomplishment. — [Arc.dev, 31 YC Application Tips](https://arc.dev/employer-blog/y-combinator-application-tips/), [Flowjam, How to Get Into YC in 2026](https://www.flowjam.com/blog/yc-application-tips-2025)
- **Z Fellows** selects on "what you've already built" + clarity of what's next; technical skill is valued but not required, and the application is a short written form plus a 1-minute personal video — not a polished product demo. Applicants skew late-teens to mid-20s, so age is explicitly not a barrier. — [Z Fellows official](https://www.zfellows.com/), [Causo Hub, How to Apply to Z Fellows 2026](https://hub.causo.ai/guides/how-to-apply-to-z-fellows-2026)
- **1517 Fund** (Thiel-Fellowship lineage) backs "dropouts working on hard problems," explicitly weighting curiosity, "hyperfluency" (going deep with an expert then explaining it simply), and demonstrated progress over the act of applying itself — "you don't get the fellowship for applying... you get it for making progress on your work." — [1517 Fund](https://www.1517fund.com/), [Danielle Strachman interview, ejorgenson.com](https://www.ejorgenson.com/podcast/danielle-strachman)

### What UK university admissions tutors say (relevant since Pranav is UK, Year 11, medicine-track but the site is the general "builder" portfolio)
- Admissions tutors explicitly say **a single project reasoned about carefully beats a long list of technologies touched** — depth over breadth, and they're turned off by clichés ("I want to do computing because it's the future"). For CS/tech-adjacent statements they want to see the applicant understand *why* something works, not just that they built it. — [The Uni Guide, CS personal statement expert advice](https://www.theuniguide.co.uk/advice/personal-statements/writing-a-computer-science-personal-statement-expert-advice-from-universities), [UCAS CS personal statement guide](https://www.ucas.com/applying/applying-to-university/writing-your-personal-statement/personal-statement-guides/computer-science-personal-statement-guide)
- This is directly relevant to the Fly Brain Pong case study: it should be written up as one carefully-reasoned project (a hypothesis, a method, a falsifiable result, an honest statement of limits), which is exactly the depth-over-breadth signal admissions tutors say they reward — much more than another CRUD SaaS tagline.

### 15 named, real, sourced portfolios (with honest career-stage labels — most are not literally teenagers; verified student/early-career ones are flagged)
Real teen-founder portfolio *sites* specifically (as opposed to teen-founder press coverage) were hard to source individually within budget — search results returned press profiles of teen founders (Nick D'Aloisio/Summly, Catherine Cook/MyYearbook, etc.) but not their personal portfolio URLs, so those are named here as context, not as sites to copy. The list below is real, individually-verified developer portfolios with sourced career-stage notes, pulled from two independent 2026 roundups:

| # | Name | URL | Career stage (as reported by source) |
|---|---|---|---|
| 1 | Diogo Correia | diogotc.com | **Student/early-career** |
| 2 | Om Patel | om.dev | **Student** (University of Michigan) |
| 3 | Holden Casey | holdencasey.com | **Student/junior** (4th-year student) |
| 4 | Brittany Chiang | brittanychiang.com | Senior (widely cited as the reference "clean engineer portfolio" layout — sticky left nav, one-line-per-role experience) |
| 5 | Andrew McCarthy | andrevv.com | Senior — notable for an original infinite-scroll interaction, not template-shaped |
| 6 | Cassie Evans | cassie.codes | Senior — notable for personality/illustration over generic "AI slop" gradients |
| 7 | Anthony Fu | antfu.me | Senior (open-source leadership) — notable for project depth over visual flash |
| 8 | Arpit Bhayani | arpitbhayani.me | Senior (staff/principal) — notable for writing alongside projects |
| 9 | Tania Rascia | taniarascia.com | Senior — notable for clarity/plain writing |
| 10 | Tom Weightman | tomweightman.com | Senior (Staff Eng, Figma) |
| 11 | Julian Ozen | julianozen.com | Senior/founder |
| 12 | Leland Jansen | lelandjansen.com | Mid-level |
| 13 | Arshin Jain | arshin.me | Mid-to-senior |
| 14 | William Falcon | williamfalcon.com | Senior (PyTorch Lightning creator) — notable for one flagship project carrying the whole site |
| 15 | Christine Munar | christinemunar.com | Career-changer |

Sources for the table: [Colorlib, 21 Best Developer Portfolio Websites 2026](https://colorlib.com/wp/developer-portfolios/), [SiteBuilderReport, Software Engineer Portfolios 2026](https://www.sitebuilderreport.com/inspiration/software-engineer-portfolios)

**Honest takeaway, not an inflated one:** almost none of the individually-named "best portfolio" examples online are literal teenagers — the genre skews senior/professional. The three flagged **student/early-career** ones (Diogo Correia, Om Patel, Holden Casey) are the closest real comparables; all three lead with 2–4 real projects each with a one-line story and a working link, not a long list. That pattern — few projects, each with a real stack + a real result — is the one worth copying, and it's also exactly what recruiters and admissions tutors both said above.

---

## Site audit

### First 5 seconds / hero
- Screenshot: `audit-screens/desktop-hero.png`, `audit-screens/mobile-hero.png`.
- The 2026-09-06/07 hero rebuild replaced the decorative purple icosahedron with a data-driven GitHub-language particle helix (`src/lib/useGitHubLanguages.ts` + `HeroScene.tsx`) specifically to avoid the "generic AI-purple-glow" look flagged in that session's research. **The full-bleed page background gradient is still solid purple** (`bg-canvas` + the radial-gradient accent wash in `page.tsx`), so the actual on-screen first impression is still a dark-purple gradient page — the exact visual signature the rebuild was trying to move away from, just without the floating shape. This is worth a second pass: either desaturate/darken the base gradient toward near-black with only a subtle purple accent, or make the language-helix visually load-bearing enough (bigger, higher in the frame) that it's what reads first instead of the background wash.
- The floating "AI" chat-widget launcher (bottom-right, visible from first paint per `AIGuide.tsx`) competes for attention in the exact 15-second window recruiters actually spend. It's not disclosed on-screen that its default state (no API key configured — confirmed still true, see `status.md`) is a rule-based keyword matcher, not a live model — recommend either labeling it more visibly or delaying its appearance until after the hero (e.g. fade in on first scroll) so it doesn't visually compete with the name/tagline on load.
- Hero copy repeats the £6k/3-week stat (Finding #5 above).

### Project case studies
- Only 2 projects exist in `src/data/projects.ts` (Summit Tuition, QuickDraw AI); both have real problem/approach/results/stack/links except QuickDraw AI has no `problem` field (only `overview`/`approach`/`results`), making its case study thinner than the type system it's built on allows.
- **Missing:** Fly Brain Pong (should be added, see below), and no mention of EchoPal or the AAC prototype (not required by this brief, but worth a follow-up decision since they show a different skill — accessibility-minded product work — that neither current project demonstrates. AAC involves the user's sister; if added, keep the copy scoped to the technical build only, no personal/medical detail, consistent with how it's handled elsewhere in this account's projects).
- `ProjectsGrid.tsx:85`'s literal placeholder line (Finding #3) undermines whatever real projects are above it.

### Proof (demos, GitHub, metrics)
- GitHub links present and correct for both existing projects (`github.com/Pb1323/summit-tuition`, `github.com/Pb1323/quickdraw-ai`).
- No live-demo link for either project — Summit Tuition is a real, live paid product; linking to it (or a safe demo-mode URL) would satisfy the "84% of hiring managers want working demos, not just repos" finding above. QuickDraw AI has no deployed inference demo referenced.
- `src/components/Contact.tsx`: the LinkedIn link is a dead placeholder — `<a href="#" ...>LinkedIn</a>` with an inline comment "LinkedIn href pending — swap in real profile URL." Confirmed still unset. This is a real, currently-broken link on the live contact section.
- Metrics: Summit Tuition's £6k/3-week figure needs correcting (Finding #5); everything else checked (stack lists, GitHub repo links, project years) is accurate as far as verifiable from the repos themselves.

### Performance / console health
- `npm run build` (Next 16.2.10, Turbopack) completes clean: no type errors, no build warnings, all routes static except `/api/ai-guide` (correctly dynamic).
- Local `next start` + Playwright: page loads in **~870ms** to network-idle on desktop, no horizontal scroll on a 390px mobile viewport, **zero console/page errors**. Only warnings seen: `THREE.Clock` deprecation notices (cosmetic, from an R3F/three.js dependency chain, no user-visible effect) and one **real minor bug** — `Invalid keyframe value for property filter: blur(-0.66529px)` on mobile, i.e. a filter/blur animation (likely a Framer Motion spring on `filter: blur(...)` in `FlipWords.tsx` or `TextReveal.tsx` overshooting past 0 during its spring easing) briefly produces an invalid negative blur value. Not visually catastrophic but worth switching those specific animations to `type: "tween"` or clamping, since invalid CSS keyframes can silently drop frames in some browsers.
- **Could not run Lighthouse or profile the actual production deployment**, because the live URL is behind the SSO wall (Finding #1) — all performance data above is from a local `next build && next start`, which is a reasonable proxy for the same Next.js output but is not identical to what Vercel's edge actually serves (headers, caching, image optimization config are unverified). Re-run Lighthouse against the live URL once deployment protection is fixed.

### Accessibility
- Not deeply audited (out of the search/time budget for this pass) — flagging as **unverified**, not "clean." Spot-checks: heading structure looks sequential in the sections read (`About`, `Experience`, `Qualifications` all use one `<h2>` per section); the qualifications/projects grids use semantic `<h3>`/`<p>`, not divs-only. Not checked: color contrast of `text-ink-dim` on the purple hero background (the muted grey-on-purple hero subtext in the screenshot looks borderline low-contrast — worth running an actual contrast checker), keyboard-only navigation through the 3D scene and command palette, and screen-reader behavior of the scroll-triggered/opacity-animated sections (a common R3F/GSAP failure mode is content that's technically in the DOM but never reaches `opacity: 1` for assistive tech if JS/animation timing differs).

### Mobile
- No horizontal scroll at 390×844 (verified). Hero, nav (hamburger "Menu" button), and text reflow correctly in the one mobile screenshot captured (`audit-screens/mobile-hero.png`). Deeper mobile-specific interaction (3D scene performance, command palette on touch, AI widget panel sizing) not fully verified this session.

### SEO / OG tags
- `src/app/layout.tsx` sets `title`, `description`, a basic `openGraph` block (`type: website`, `siteName`), and a `twitter` card of type `summary` — but **no `openGraph.images` and no `twitter.images`** are set anywhere, so any link shared to LinkedIn/Twitter/Slack/iMessage will render with no preview image, just text. This matters specifically for the "build in public" / outreach use case this account already runs (cold emails, LinkedIn posts) — an OG image showing the hero or a project screenshot would meaningfully improve click-through on shared links. Recommend adding a static `opengraph-image.png` (Next.js App Router auto-picks up `src/app/opengraph-image.png|jpg` with zero code) or a generated `opengraph-image.tsx`.
- `robots.ts` and `sitemap.ts` are both correctly implemented and depend on `NEXT_PUBLIC_SITE_URL` — confirm that env var is actually set in Vercel (if unset, the sitemap/robots/canonical URLs all silently fall back to `http://localhost:3000`, which would be a serious SEO bug if shipped like that — this needs a live check once Finding #1 is fixed and the real site is reachable).
- Meta `description` repeats the wrong ARR figure (Finding #5) and is also the text most likely to be quoted verbatim in a Google search snippet — highest-leverage place to fix first.

### Does the 3D hero help or hurt?
- On balance: **helps, conditionally.** The GitHub-language double-helix is a genuinely differentiated, data-driven visual (not a stock effect) and is the kind of "did something non-templated" signal that both the YC/Z-Fellows research and the admissions-tutor research above reward. It hurts to the extent that (a) the background gradient behind it still reads as generic "AI purple" per the note above, and (b) any 3D/WebGL hero risks a slow first paint on low-end mobile devices — not measured this session against the real device population, only against a desktop headless Chromium locally (870ms is not evidence either way for a mid-range Android phone). Recommend keeping the concept, tightening the background treatment, and getting one real low-end-device load-time reading before calling this settled.

---

## Prioritised fix list (impact vs. effort)

| Priority | Fix | Impact | Effort |
|---|---|---|---|
| P0 | Turn off/relax Vercel Deployment Protection so the production URL is public | Site is currently invisible to every intended audience | Trivial (dashboard toggle, not code) |
| P0 | Replace `qualifications.ts` placeholder brackets with real content | Live embarrassing bug | Trivial (data edit) |
| P0 | Delete the `[placeholder projects...]` line in `ProjectsGrid.tsx:85` | Live embarrassing bug | Trivial (one-line delete) |
| P0 | Fix £6k/3-week → correct ARR figure in all 5 locations | Credibility / factual-consistency risk with any audience that cross-checks | Trivial (find-replace, 5 files) |
| P1 | Add Fly Brain Pong as the featured project | Single highest-quality "depth of thinking" signal available across the whole account, directly matches what admissions tutors + YC/Z-Fellows/1517 all said they reward | Medium (new project entry + honest copy, below) |
| P1 | Fix dead LinkedIn `href="#"` | Broken CTA on the one section whose whole purpose is contact | Trivial |
| P1 | Add `opengraph-image` | Every shared link currently has no preview image | Small |
| P2 | Verify `NEXT_PUBLIC_SITE_URL` is actually set in Vercel prod env | Silent SEO/canonical-URL bug if unset | Trivial to check, can't verify from here (site unreachable) |
| P2 | Add a live-demo link (or safe demo-mode link) to Summit Tuition's project card | Matches the "84% want working demos" finding | Small |
| P2 | Fix the negative-blur invalid-keyframe warning (`FlipWords.tsx`/`TextReveal.tsx` filter animations) | Minor visual polish / very occasional dropped frame | Small |
| P3 | Tone down the purple background wash behind the new hero helix | The rebuild's own stated goal ("avoid generic AI purple") isn't fully realized yet | Small–Medium |
| P3 | Move/delay the AI-guide launcher so it doesn't compete with the hero in the first 15 seconds | Attention economy in the exact window recruiters use to decide | Small |
| P3 | Full accessibility pass (contrast check, keyboard nav through 3D/command palette, screen-reader check on scroll-triggered content) | Unverified, flagged not audited | Medium |
| P4 | Consider adding EchoPal / AAC prototype as a third project (different skill: accessibility-minded product work) | Diversifies the two-project set | Medium — needs a scoping decision first, not just a copy task |

---

## Exact copy rewrites

### Hero (`src/app/page.tsx`)
Current:
> "I build full-stack products solo, end-to-end. Most recently: Summit Tuition, which hit £6k ARR in its first 3 weeks."

Rewrite:
> "I build full-stack products solo, end-to-end. Most recently: Summit Tuition, which reached £12k ARR in its first 6 weeks — and Fly Brain Pong, a real fruit-fly connectome playing Pong against a random one."

### About (`src/components/About.tsx`)
Current:
> "I'm Pranav — a self-taught developer who builds full-stack products end-to-end, solo. I built Summit Tuition from scratch and took it to £6k ARR in 3 weeks. I like scoping ruthlessly, shipping something real fast, and iterating against actual users rather than polishing in a vacuum."

Rewrite:
> "I'm Pranav — a self-taught developer who builds full-stack products end-to-end, solo. I built Summit Tuition from scratch and took it to £12k ARR in 6 weeks with real paying families. More recently I've been going the other direction — asking whether a small piece of a real fruit-fly's brain wiring can actually steer a game of Pong better than the same neurons wired at random (it can, by a lot). I like scoping ruthlessly, shipping something real fast, and iterating against actual evidence rather than polishing in a vacuum."

### Experience / Journey (`src/components/Experience.tsx`)
Fix the £6k/3-week line in the first `JOURNEY` entry to £12k ARR / 6 weeks, and add one new entry:
```
{
  meta: "2026",
  title: "Fly Brain Pong",
  accent: "#22d3ee",
  description:
    "Extracted a real 651-neuron slice of the FlyWire fruit-fly connectome (eye-tracking → steering neurons) and simulated it controlling one Pong paddle, against the same neurons wired at random controlling the other. The real wiring wins 93.7% of rallies to 23.1% — a connectome-constrained simulation, not an uploaded or conscious fly. I designed the question and the fair test; built with AI coding tools.",
},
```

### Qualifications (`src/data/qualifications.ts`)
Replace the bracketed placeholders with the one fact already confirmed in this account's records — swap in exact grades/school when ready:
```
{
  id: "quals-1",
  credential: "GCSEs (in progress)",
  detail: "Triple science + full GCSE spread, predicted grades 8–9",
  institution: "[School name — fill in]",
  year: "2027",
},
```
(Keep the bracket only on the one field genuinely not confirmed anywhere in this account's records — the school name — rather than shipping four bracketed fields.)

### New project entry — Fly Brain Pong (`src/data/projects.ts`)
Add as the **first** entry in the array (featured position):
```ts
{
  slug: "fly-brain-pong",
  title: "Fly Brain Pong",
  tagline: "A real fruit-fly connectome plays Pong against the same neurons wired at random — and wins 93.7% to 23.1%.",
  stack: ["JavaScript", "Node.js", "LIF neuron simulation"],
  accent: "#22d3ee",
  template: "experiment",
  year: "2026",
  role: "Designer & Developer",
  overview:
    "A connectome-constrained simulation, not an uploaded or conscious fly: one paddle is driven by a real 651-neuron slice of the FlyWire fruit-fly brain (eye-tracking cells through to steering neurons), the other by the identical neurons and edge count with connections shuffled at random. Nothing learns; nothing is trained. The only difference between the paddles is who's wired to whom.",
  problem:
    "Does a small, real piece of a real brain's wiring actually carry a useful signal — or would any similarly-sized random network do just as well? I wanted a fair, falsifiable test, not a demo dressed up to look impressive.",
  approach: [
    "Extracted a 651-neuron / 17,203-edge subgraph from the FlyWire v783 connectome (published, CC-BY data) covering the LC10a visual pathway through to the DNa01/DNa02 steering neurons.",
    "Built a random control with identical neuron count, identical in/out-degree per neuron, and identical excitatory/inhibitory synapse totals — only the specific wiring is shuffled — so the comparison isolates wiring, not scale.",
    "Ran the same leaky-integrate-and-fire neuron model (Shiu et al. 2024 parameters) for both paddles, calibrated once on the real brain only, then reused unchanged for every random brain, and evaluated across 8 independently-shuffled random brains and 4,000 total simulated points to rule out one lucky wiring.",
  ],
  results: [
    { label: "Real-wiring hit rate", value: "93.7%" },
    { label: "Random-wiring hit rate", value: "23.1% (≈ a paddle that never moves)" },
    { label: "Score, 4,000 points", value: "3,921–79" },
  ],
  links: [{ label: "GitHub", href: "https://github.com/Pb1323/fly-brain-pong" }],
},
```
Honesty constraints respected in the copy above (per the brief): says "connectome-constrained simulation," never "uploaded" or "conscious"; states plainly that Pranav designed the question and the fair test and that it was built with AI coding tools, rather than implying the neuroscience or the code was hand-written line-by-line unaided.

---

## Anything unverified

- **Live-site behavior for everything below "was the site reachable" is unverified this session** — all screenshots/console/performance checks are from a local `next build && next start`, not the actual Vercel production deployment, because that deployment is behind the SSO wall (Finding #1). Re-run this whole check once that's fixed.
- Whether `NEXT_PUBLIC_SITE_URL` is actually set in Vercel's environment variables (affects sitemap/robots/OG URLs) — could not check without dashboard/CLI env access beyond `vercel ls`.
- Full accessibility (contrast ratios, keyboard/screen-reader behavior of animated sections) — flagged as not done, not as clean.
- Real low-end-mobile-device load time for the 3D hero — only measured against desktop headless Chromium locally.
- Whether the AI-guide widget's NVIDIA NIM key has since been configured (per `status.md` it was still unconfigured as of the last update) — not re-checked this session since it doesn't change local build behavior either way.
- The "15 standout portfolios" list above could not include verified individual portfolio URLs for actual named teen founders (Summly's Nick D'Aloisio, MyYearbook's Catherine Cook, etc.) — press coverage of them was easy to find, their personal sites were not, within the search budget for this task. Flagging rather than guessing at URLs.

---

## What was done vs. what remains

Done this session: repo pulled clean (no prior uncommitted work existed despite the brief's expectation), full code read of hero/about/experience/qualifications/projects/contact/layout/robots/sitemap, local production build + Playwright screenshots (desktop + mobile) against `next start`, live-URL reachability check (`curl -I`, `npx vercel ls`) confirming the SSO wall, 15 web searches + 2 page fetches for the research section (within the ~20 budget), this document, and the summary Gmail draft.

Not done (explicitly out of scope for a docs-only pass, or blocked): no code changes to the live site, no deploy, no attempt to change Vercel's Deployment Protection setting (a settings change, deliberately left as a documented recommendation rather than acted on unsupervised), no Lighthouse run against production (unreachable).
