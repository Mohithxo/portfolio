"use client";

import { useEffect, useRef } from "react";
import { useCustomCursor } from "@/hooks/useCustomCursor";
import { lerp } from "@/lib/utils";
import { scrollStore, rgbStr } from "@/lib/scrollStore";

/**
 * Custom cursor: a precise dot, a lagging ring that snaps magnetically to
 * marked targets and morphs to show a contextual label, a canvas comet trail
 * tinted by the active section theme, and a shockwave ring on click.
 */
export default function CustomCursor() {
  const cursor = useCustomCursor();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLCanvasElement>(null);
  const ringPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  // Latest cursor snapshot for the rAF loops, without re-subscribing effects.
  const cur = useRef(cursor);
  cur.current = cursor;

  // ── Comet trail canvas ──
  useEffect(() => {
    if (cursor.isTouch) return;
    const canvas = trailRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const trail: { x: number; y: number; life: number }[] = [];
    let raf = 0;
    let last = { x: -100, y: -100 };

    const loop = () => {
      const c = cur.current;
      const moved = Math.hypot(c.x - last.x, c.y - last.y);
      if (moved > 2) {
        trail.push({ x: c.x, y: c.y, life: 1 });
        last = { x: c.x, y: c.y };
      }
      if (trail.length > 26) trail.shift();

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        p.life -= 0.045;
        if (p.life <= 0) continue;
        const r = p.life * 5 + 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = rgbStr(scrollStore.themeColor, p.life * 0.4);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [cursor.isTouch]);

  // ── Dot + ring + label follow loop ──
  useEffect(() => {
    if (cursor.isTouch) return;

    const animate = () => {
      const c = cur.current;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${c.x - 4}px, ${c.y - 4}px)`;
      }

      // Ring target: magnetic snap toward marked targets, else follow cursor.
      const tx = c.snapX ?? c.x;
      const ty = c.snapY ?? c.y;
      const ease = c.snapX !== null ? 0.25 : 0.14;
      ringPos.current.x = lerp(ringPos.current.x, tx, ease);
      ringPos.current.y = lerp(ringPos.current.y, ty, ease);

      if (ringRef.current) {
        const scale = c.label
          ? 2.8
          : c.isHovering
            ? 2.2
            : c.isClicking
              ? 0.8
              : 1;
        ringRef.current.style.transform = `translate(${ringPos.current.x - 18}px, ${ringPos.current.y - 18}px) scale(${scale})`;
        ringRef.current.style.opacity = c.isHovering || c.label ? "0.7" : "1";
        ringRef.current.style.borderColor = rgbStr(scrollStore.themeColor, 1);
        ringRef.current.style.background = c.label
          ? rgbStr(scrollStore.themeColor, 0.08)
          : "transparent";
      }

      if (labelRef.current) {
        labelRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
        labelRef.current.style.opacity = c.label ? "1" : "0";
        if (c.label) labelRef.current.textContent = c.label;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [cursor.isTouch]);

  // ── Click shockwave ──
  useEffect(() => {
    if (cursor.isTouch) return;
    const onDown = (e: MouseEvent) => {
      const ring = document.createElement("div");
      ring.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:10px;height:10px;border-radius:50%;border:1.5px solid ${rgbStr(
        scrollStore.themeColor,
        0.9
      )};transform:translate(-50%,-50%);pointer-events:none;z-index:9994;`;
      document.body.appendChild(ring);
      const start = performance.now();
      const expand = (now: number) => {
        const t = Math.min((now - start) / 500, 1);
        const size = 10 + t * 60;
        ring.style.width = size + "px";
        ring.style.height = size + "px";
        ring.style.opacity = String(1 - t);
        if (t < 1) requestAnimationFrame(expand);
        else ring.remove();
      };
      requestAnimationFrame(expand);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [cursor.isTouch]);

  if (cursor.isTouch) return null;

  return (
    <>
      <canvas
        ref={trailRef}
        className="fixed inset-0 pointer-events-none z-[9993]"
      />
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999] w-2 h-2 rounded-full"
        style={{
          background: "#fff",
          boxShadow: "0 0 8px 2px rgba(14,165,233,0.8)",
          willChange: "transform",
        }}
      />
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998] w-9 h-9 rounded-full flex items-center justify-center"
        style={{
          border: "1.5px solid #0ea5e9",
          transition: "border-color 0.3s, opacity 0.3s, background 0.2s",
          willChange: "transform",
        }}
      />
      <div
        ref={labelRef}
        className="fixed pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 text-[9px] font-display font-bold tracking-[0.2em] text-white uppercase"
        style={{ opacity: 0, transition: "opacity 0.2s", willChange: "transform" }}
      />
    </>
  );
}
