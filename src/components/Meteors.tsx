// Adapted from Aceternity UI's Meteors (https://ui.aceternity.com/components/meteors),
// retrieved via github.com/xKevIsDev/GenUAI (utils/aceternity.ts). Aceternity UI components are
// published for free copy/paste reuse (no traditional OSS license file — registry model similar
// to shadcn/ui).
// Modified for this project: retinted the streak color to this project's purple accent tokens,
// and swapped Math.random() for a deterministic index-seeded pseudo-random function — the
// original calls Math.random() directly in the render body, which is impure and (since this
// is a server-rendered client component, not a client-only island) would produce a server/client
// hydration mismatch; a seeded hash keeps the "random-looking" spread but stays pure and
// consistent between server and client render passes.

function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export default function Meteors({ number = 20 }: { number?: number }) {
  const meteors = Array.from({ length: number }, (_, i) => ({
    left: Math.floor(seededRandom(i + 1) * 800 - 400) + "px",
    delay: (seededRandom(i + 101) * 0.6 + 0.2).toFixed(2) + "s",
    duration: Math.floor(seededRandom(i + 201) * 8 + 2) + "s",
  }));

  return (
    <>
      {meteors.map((m, idx) => (
        <span
          key={idx}
          className="animate-meteor-effect absolute left-1/2 top-1/2 h-0.5 w-0.5 rotate-[215deg] rounded-full bg-accent-soft shadow-[0_0_0_1px_rgba(196,181,253,0.1)] before:absolute before:top-1/2 before:h-px before:w-12 before:-translate-y-1/2 before:bg-gradient-to-r before:from-accent before:to-transparent before:content-['']"
          style={{
            top: 0,
            left: m.left,
            animationDelay: m.delay,
            animationDuration: m.duration,
          }}
        />
      ))}
    </>
  );
}
