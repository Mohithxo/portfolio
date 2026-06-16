"use client";

import { useEffect, useRef, useState } from "react";
import { isTouchDevice } from "@/lib/utils";

export interface CursorData {
  x: number;
  y: number;
  isHovering: boolean;
  isClicking: boolean;
  isText: boolean;
  isTouch: boolean;
  label: string | null;
  snapX: number | null; // magnetic target center
  snapY: number | null;
}

export function useCustomCursor(): CursorData {
  const [cursor, setCursor] = useState<CursorData>({
    x: -100,
    y: -100,
    isHovering: false,
    isClicking: false,
    isText: false,
    isTouch: false,
    label: null,
    snapX: null,
    snapY: null,
  });

  const isTouch = useRef(false);

  useEffect(() => {
    isTouch.current = isTouchDevice();
    if (isTouch.current) {
      setCursor((prev) => ({ ...prev, isTouch: true }));
      return;
    }

    const onMove = (e: MouseEvent) => {
      setCursor((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
    };

    const onDown = () => setCursor((prev) => ({ ...prev, isClicking: true }));
    const onUp = () => setCursor((prev) => ({ ...prev, isClicking: false }));

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName.toLowerCase();
      const interactiveEl =
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor='hover']") ||
        (target.getAttribute("role") === "button" ? target : null);
      const isInteractive = interactiveEl !== null;
      const isTextInput =
        tag === "input" || tag === "textarea" || tag === "select";

      // Contextual label + magnetic snap target (when small enough to snap to).
      const labelEl = target.closest("[data-cursor-label]") as HTMLElement | null;
      const label = labelEl?.getAttribute("data-cursor-label") ?? null;

      let snapX: number | null = null;
      let snapY: number | null = null;
      const magnetEl = target.closest("[data-magnetic]") as HTMLElement | null;
      if (magnetEl) {
        const r = magnetEl.getBoundingClientRect();
        if (r.width < 220 && r.height < 220) {
          snapX = r.left + r.width / 2;
          snapY = r.top + r.height / 2;
        }
      }

      setCursor((prev) => ({
        ...prev,
        isHovering: isInteractive,
        isText: isTextInput,
        label,
        snapX,
        snapY,
      }));
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseover", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseover", onEnter);
    };
  }, []);

  return cursor;
}
