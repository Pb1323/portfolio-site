"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-10 bg-canvas" />,
});

export default function HeroCanvas() {
  return <HeroScene />;
}
