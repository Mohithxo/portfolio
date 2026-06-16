"use client";

import { ReactNode } from "react";

/**
 * Passthrough wrapper around the page content.
 *
 * Previously this applied a velocity-driven `skewY` to the whole page for a
 * "weighted scroll" feel, but a transform on the entire document shears content
 * during scroll (very visible on dense sections) and distorts pointer
 * hit-testing on lower-powered machines. The effect isn't worth those bugs, so
 * the wrapper now just renders its children untouched.
 */
export default function SkewScroll({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
