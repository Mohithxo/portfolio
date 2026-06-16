"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { updateScroll, updateMouse } from "@/lib/scrollStore";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    setLenis(lenisInstance);

    lenisInstance.on("scroll", ({ scroll }: { scroll: number }) => {
      ScrollTrigger.update();
      updateScroll(scroll);
    });

    // Initial compute + a light RAF fallback so the scene has a signal even
    // before the first scroll event (e.g. when loaded mid-page or resized).
    updateScroll();
    let fallbackRaf = 0;
    const fallback = () => {
      updateScroll();
      fallbackRaf = requestAnimationFrame(fallback);
    };
    fallbackRaf = requestAnimationFrame(fallback);

    const onMouse = (e: MouseEvent) => updateMouse(e.clientX, e.clientY);
    window.addEventListener("mousemove", onMouse);

    // Save reference so cleanup can use the exact same function
    const tickerFn = (time: number) => lenisInstance.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    return () => {
      cancelAnimationFrame(fallbackRaf);
      window.removeEventListener("mousemove", onMouse);
      gsap.ticker.remove(tickerFn);
      lenisInstance.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
