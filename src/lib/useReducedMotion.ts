"use client";

// Canonical useSyncExternalStore-based subscription to prefers-reduced-motion — the React-
// recommended primitive for external browser state, unlike a useState+useEffect pair (which
// this project's stricter React Compiler lint flags as a "setState in effect" cascading-render
// risk).

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
