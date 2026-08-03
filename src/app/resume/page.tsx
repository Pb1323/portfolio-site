import PrintButton from "./PrintButton";
import { qualifications } from "@/data/qualifications";

export const metadata = {
  title: "Resume — Pranav Bonagiri",
};

export default function ResumePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 print:py-0">
      <div className="flex items-baseline justify-between border-b border-hairline pb-4">
        <div>
          <h1 className="font-serif-display text-3xl italic">Pranav Bonagiri</h1>
          <p className="mt-1 font-mono text-xs text-ink-dim">
            pranav.bgri@gmail.com · github.com/Pb1323
          </p>
        </div>
        <PrintButton />
      </div>

      <section className="mt-8">
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Summary</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Self-taught developer who builds full-stack products end-to-end, solo. Built and shipped
          Summit Tuition, reaching £6k ARR within 3 weeks of launch. Grew a public audience
          (1,000+ LinkedIn followers, 150k+ monthly impressions; 250k+ YouTube Shorts views)
          documenting the build process.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Education</h2>
        <div className="mt-4 space-y-4">
          {qualifications.map((q) => (
            <div key={q.id} className="flex items-baseline justify-between">
              <div>
                <h3 className="font-semibold">{q.credential}</h3>
                <p className="text-sm text-ink-dim">
                  {q.detail} · {q.institution}
                </p>
              </div>
              <span className="font-mono text-xs text-ink-dim">{q.year}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Projects</h2>

        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <h3 className="font-semibold">Summit Tuition — Founder & Solo Developer</h3>
            <span className="font-mono text-xs text-ink-dim">2026</span>
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-dim">
            <li>
              Built and shipped a full-stack tutoring platform (Next.js, TypeScript, PostgreSQL,
              Prisma, Stripe) — reached £6k ARR within 3 weeks of launch.
            </li>
            <li>
              Designed auth, student/admin workflows, an online mock-exam engine, and payments
              end-to-end, solo.
            </li>
          </ul>
        </div>

        <div className="mt-5">
          <div className="flex items-baseline justify-between">
            <h3 className="font-semibold">QuickDraw AI — Personal Project</h3>
            <span className="font-mono text-xs text-ink-dim">2026</span>
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-dim">
            <li>
              Built a real-time doodle-recognition app: PyTorch CNN trained from scratch on
              Google&rsquo;s Quick, Draw! dataset (20 categories), served via FastAPI to a live
              canvas frontend.
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Skills</h2>
        <p className="mt-3 text-sm text-ink-dim">
          TypeScript, React, Next.js, Python, PyTorch, FastAPI, PostgreSQL, Prisma, Stripe
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Other</h2>
        <p className="mt-3 text-sm text-ink-dim">
          Competed in 2 hackathons (incl. a Solana-based prediction market build). Self-taught —
          no formal CS degree.
        </p>
      </section>
    </main>
  );
}
