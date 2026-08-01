"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full border border-hairline px-4 py-2 font-mono text-xs uppercase tracking-wide print:hidden"
    >
      Print / Save as PDF
    </button>
  );
}
