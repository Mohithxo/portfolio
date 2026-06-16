"use client";

import { useEffect, useRef, ReactNode } from "react";
import { scrollStore } from "@/lib/scrollStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Wraps the page in a layer that applies a subtle velocity-driven skew, giving
 * scroll a liquid, weighted feel. Direct style mutation per RAF — no re-renders.
 * Disabled on mobile and under prefers-reduced-motion.
 */
export default function SkewScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const el = ref.current;
    if (!el || isMobile) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let current = 0;
    const loop = () => {
      // Map smoothed velocity → a small skew, clamped so text stays readable.
      const target = Math.max(-4, Math.min(4, scrollStore.velocity * 0.12));
      current += (target - current) * 0.1;
      el.style.transform = `skewY(${current.toFixed(3)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isMobile]);

  return (
    <div ref={ref} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
