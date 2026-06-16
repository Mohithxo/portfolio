"use client";

import { useEffect, useRef, useState } from "react";

export function useStatCounter(target: number, duration = 2000, startOnMount = false): number {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  const start = () => {
    if (started.current) return;
    started.current = true;

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  useEffect(() => {
    if (startOnMount) start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startOnMount]);

  return count;
}
