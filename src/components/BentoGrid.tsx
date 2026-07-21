// Adapted from Aceternity UI's BentoGrid (https://ui.aceternity.com/components/bento-grid),
// source retrieved via github.com/xKevIsDev/GenUAI (utils/aceternity.ts) — the same mirror
// already used for SpotlightCard/TracingBeam/etc. in this project (see THIRD_PARTY_NOTICES.md).
// Aceternity UI publishes components for free copy/paste reuse (registry model, no traditional
// OSS license file) — see ui.aceternity.com for terms.
// Modified for this project: dropped the `cn`/tailwind-merge helper dependency (not present in
// this repo) in favor of a tiny local class-join, retextured from the original light/dark-mode
// neutral palette to this project's permanent-dark purple/violet tokens, and swapped the fixed
// `md:auto-rows-[18rem]` grid for an `auto-rows-[minmax(14rem,auto)]` one so items with more
// content (this project's skills copy runs longer than the original demo's) don't clip.
"use client";

import type { ReactNode } from "react";

function joinClasses(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={joinClasses(
        "grid grid-cols-1 gap-4 md:auto-rows-[minmax(14rem,auto)] md:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  header?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div
      className={joinClasses(
        "group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-2xl border border-hairline bg-white/[0.03] p-6 shadow-none transition duration-200 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/[0.06]",
        className
      )}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-1">
        {icon}
        <div className="mb-2 mt-3 font-serif-display text-lg italic text-ink">{title}</div>
        <div className="text-xs leading-relaxed text-ink-dim">{description}</div>
      </div>
    </div>
  );
}
