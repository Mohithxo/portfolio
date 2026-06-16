"use client";

import { useLayoutEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function GSAPProvider({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    ScrollTrigger.defaults({
      toggleActions: "play none none reverse",
    });
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
