"use client";

import { useEffect, useRef } from "react";
import { EASTER_EGG_SEQUENCE } from "@/lib/constants";

export function useEasterEgg(onTrigger: () => void) {
  const bufferRef = useRef("");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      bufferRef.current = (bufferRef.current + e.key.toUpperCase()).slice(
        -EASTER_EGG_SEQUENCE.length
      );
      if (bufferRef.current === EASTER_EGG_SEQUENCE) {
        onTrigger();
        bufferRef.current = "";
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onTrigger]);
}
