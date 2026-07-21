"use client";

// Soft directional hover/click tones (synthesized via Web Audio API, no asset files) panned
// to cursor X position. Quiet by default — atmosphere, not gimmick. Never autoplay; only
// fires on explicit hover/click, since most visitors browse muted-by-default.

import { useCallback, useEffect, useRef } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

export function useSpatialHoverAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      ctxRef.current?.close();
    };
  }, []);

  function ensureContext() {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }

  const play = useCallback((clientX: number, freq: number, duration: number, gainPeak: number) => {
    const ctx = ensureContext();
    if (ctx.state === "suspended") ctx.resume();

    const pan = (clientX / window.innerWidth) * 2 - 1;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = new StereoPannerNode(ctx, { pan: Math.max(-1, Math.min(1, pan)) });

    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(gainPeak, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain).connect(panner).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, []);

  const bindHover = useCallback(
    () => ({
      onMouseEnter: (e: ReactMouseEvent) => play(e.clientX, 720, 0.12, 0.025),
      onClick: (e: ReactMouseEvent) => play(e.clientX, 480, 0.18, 0.04),
    }),
    [play]
  );

  return { bindHover };
}
