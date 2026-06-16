"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { scrollStore, rgbStr, type RGB } from "@/lib/scrollStore";
import { clamp } from "@/lib/utils";

/**
 * Background "watching eye". A single line-art eye blinks and tracks the
 * cursor, periodically blooming into a rotating mandala/lotus of eyes, then
 * collapsing back. Iris pattern cycles each bloom. Themed by scrollStore and
 * faded out as the visitor scrolls past the hero so it never fights content.
 */

const PI2 = Math.PI * 2;

interface MiniEye {
  fx: number; // fractional position
  fy: number;
  size: number;
  phase: number;
  speed: number;
}

export default function EyeScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0;
    let H = 0;

    // Scattered ambient eyes that blink independently in the background.
    const miniEyes: MiniEye[] = (isMobile ? [0.18, 0.82] : [0.1, 0.27, 0.74, 0.9, 0.5]).map(
      (fx, i) => ({
        fx,
        fy: [0.18, 0.7, 0.22, 0.78, 0.12][i] ?? Math.random(),
        size: 26 + (i % 3) * 10,
        phase: Math.random() * 1000,
        speed: 0.4 + Math.random() * 0.5,
      })
    );

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // ── one eye ───────────────────────────────────────────────────────
    const drawEye = (
      cx: number,
      cy: number,
      w: number,
      h: number,
      open: number,
      lookX: number,
      lookY: number,
      color: RGB,
      lw: number,
      alpha: number,
      pattern: number,
      ornate: boolean
    ) => {
      const halfW = w / 2;
      const ap = (h / 2) * clamp(open, 0, 1); // aperture half-height

      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      const lid = () => {
        ctx.beginPath();
        ctx.moveTo(cx - halfW, cy);
        ctx.quadraticCurveTo(cx, cy - ap * 2, cx + halfW, cy);
        ctx.quadraticCurveTo(cx, cy + ap * 2, cx - halfW, cy);
        ctx.closePath();
      };

      // Eye outline
      ctx.strokeStyle = rgbStr(color, alpha);
      ctx.lineWidth = lw;
      lid();
      ctx.stroke();

      if (open > 0.14) {
        ctx.save();
        lid();
        ctx.clip();

        const irisR = Math.min(w * 0.27, ap * 1.2);
        const lx = clamp(lookX, -irisR * 0.5, irisR * 0.5);
        const ly = clamp(lookY, -irisR * 0.45, irisR * 0.45);
        const ix = cx + lx;
        const iy = cy + ly;
        const pupilR = irisR * 0.4;

        // Iris outer ring
        ctx.strokeStyle = rgbStr(color, alpha * 0.85);
        ctx.lineWidth = lw * 0.7;
        ctx.beginPath();
        ctx.arc(ix, iy, irisR, 0, PI2);
        ctx.stroke();

        if (pattern === 0 || pattern === 3) {
          // Sunburst rays (the reference look)
          const N = ornate ? 64 : 34;
          ctx.lineWidth = lw * 0.45;
          for (let k = 0; k < N; k++) {
            const a = (k / N) * PI2;
            const ca = Math.cos(a);
            const sa = Math.sin(a);
            ctx.strokeStyle = rgbStr(color, alpha * (0.4 + 0.5 * (k % 2)));
            ctx.beginPath();
            ctx.moveTo(ix + ca * pupilR * 1.08, iy + sa * pupilR * 1.08);
            ctx.lineTo(ix + ca * irisR * 0.97, iy + sa * irisR * 0.97);
            ctx.stroke();
          }
        }
        if (pattern === 1) {
          // Concentric rings
          ctx.lineWidth = lw * 0.4;
          for (let r = pupilR * 1.3; r < irisR; r += Math.max(4, irisR * 0.13)) {
            ctx.strokeStyle = rgbStr(color, alpha * 0.5);
            ctx.beginPath();
            ctx.arc(ix, iy, r, 0, PI2);
            ctx.stroke();
          }
        }
        if (pattern === 2) {
          // Dotted radial
          const N = ornate ? 40 : 24;
          for (let k = 0; k < N; k++) {
            const a = (k / N) * PI2;
            for (let rr = pupilR * 1.4; rr < irisR; rr += irisR * 0.22) {
              ctx.fillStyle = rgbStr(color, alpha * 0.6);
              ctx.beginPath();
              ctx.arc(ix + Math.cos(a) * rr, iy + Math.sin(a) * rr, lw * 0.5, 0, PI2);
              ctx.fill();
            }
          }
        }
        if (pattern === 3) {
          // extra outer ring
          ctx.strokeStyle = rgbStr(color, alpha * 0.5);
          ctx.lineWidth = lw * 0.4;
          ctx.beginPath();
          ctx.arc(ix, iy, irisR * 0.78, 0, PI2);
          ctx.stroke();
        }

        // Pupil ring (dark hole reads through) + highlight
        ctx.strokeStyle = rgbStr(color, alpha);
        ctx.lineWidth = lw * 0.9;
        ctx.beginPath();
        ctx.arc(ix, iy, pupilR, 0, PI2);
        ctx.stroke();
        ctx.fillStyle = rgbStr([0, 0, 0], alpha * 0.55);
        ctx.beginPath();
        ctx.arc(ix, iy, pupilR * 0.92, 0, PI2);
        ctx.fill();
        ctx.fillStyle = rgbStr([255, 255, 255], alpha * 0.9);
        ctx.beginPath();
        ctx.arc(ix - pupilR * 0.32, iy - pupilR * 0.4, Math.max(1.4, pupilR * 0.16), 0, PI2);
        ctx.fill();

        ctx.restore();
      }

      if (ornate) {
        // Brow arcs above
        ctx.strokeStyle = rgbStr(color, alpha * 0.6);
        ctx.lineWidth = lw;
        for (let bi = 1; bi <= 2; bi++) {
          const off = ap * 2 + h * 0.14 * bi + h * 0.06;
          ctx.beginPath();
          ctx.moveTo(cx - halfW * 0.92, cy - ap * 0.2);
          ctx.quadraticCurveTo(cx, cy - off, cx + halfW * 0.92, cy - ap * 0.2);
          ctx.stroke();
        }
        // Lower lashes radiating down
        const LN = 20;
        ctx.lineWidth = lw * 0.7;
        ctx.strokeStyle = rgbStr(color, alpha * 0.7);
        for (let k = 1; k < LN; k++) {
          const t = k / LN;
          const mt = 1 - t;
          // point on lower lid bezier
          const bx = mt * mt * (cx - halfW) + 2 * mt * t * cx + t * t * (cx + halfW);
          const by =
            mt * mt * cy + 2 * mt * t * (cy + ap * 2) + t * t * cy;
          const dx = bx - cx;
          const dy = by - cy + 0.001;
          const dist = Math.hypot(dx, dy) || 1;
          const len = h * 0.16;
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(bx + (dx / dist) * len, by + (dy / dist) * len + len * 0.4);
          ctx.stroke();
        }
      }
    };

    let raf = 0;
    const start = performance.now();
    const CYCLE = 15000; // full single → bloom → mandala → collapse loop

    const ease = (t: number) => t * t * (3 - 2 * t); // smoothstep

    const draw = (now: number) => {
      if (document.hidden) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const t = now - start;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      const theme = scrollStore.ready ? scrollStore.themeColor : ([14, 165, 233] as RGB);

      // Fade the eye out past the hero so sections stay legible.
      const fade = 1 - clamp(scrollStore.progress * 2.4, 0, 0.78);
      const baseAlpha = (isMobile ? 0.55 : 0.6) * fade;

      const cx = W / 2;
      const cy = H * (isMobile ? 0.4 : 0.46);
      const eyeW = Math.min(W * 0.92, H * 1.5) * (isMobile ? 0.72 : 0.58);
      const eyeH = eyeW * 0.5;
      const lw = Math.max(1.4, eyeW * 0.0045);

      // Cursor look
      const lookX = clamp((scrollStore.mouseX - cx) / (W / 2), -1, 1) * eyeW * 0.05;
      const lookY = clamp((scrollStore.mouseY - cy) / (H / 2), -1, 1) * eyeH * 0.1;

      // Blink for the central eye (quick dips every ~3.6s)
      const blinkPeriod = 3600;
      const bt = t % blinkPeriod;
      let open = 1;
      if (bt < 220) open = Math.abs(Math.cos((bt / 220) * Math.PI)); // close+open
      if (reduce) open = 1;

      // Phase machine for the mandala bloom
      const ct = reduce ? 0 : t % CYCLE;
      let petal = 0; // 0..1 how bloomed
      if (ct >= 6000 && ct < 7400) petal = ease((ct - 6000) / 1400);
      else if (ct >= 7400 && ct < 12000) petal = 1;
      else if (ct >= 12000 && ct < 13400) petal = 1 - ease((ct - 12000) / 1400);

      const pattern = Math.floor(t / CYCLE) % 4;

      // ── Mandala petals (behind the central eye) ──
      if (petal > 0.01) {
        const count = 8;
        const Rmax = eyeW * 0.62;
        const R = petal * Rmax;
        const rot = t * 0.00012;
        const petalW = eyeW * 0.34;
        const petalH = petalW * 0.5;
        // faint connecting star/lotus polygon
        ctx.strokeStyle = rgbStr(theme, baseAlpha * 0.18 * petal);
        ctx.lineWidth = lw * 0.5;
        ctx.beginPath();
        for (let i = 0; i <= count; i++) {
          const a = rot + (i / count) * PI2;
          const x = cx + Math.cos(a) * R;
          const y = cy + Math.sin(a) * R;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        for (let i = 0; i < count; i++) {
          const a = rot + (i / count) * PI2;
          const x = cx + Math.cos(a) * R;
          const y = cy + Math.sin(a) * R;
          const pOpen = 0.5 + 0.5 * Math.sin(t * 0.004 + i); // shimmer/blink
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(a + Math.PI / 2); // point outward → lotus petals
          drawEye(
            0,
            0,
            petalW,
            petalH,
            Math.max(0.2, pOpen),
            0,
            0,
            theme,
            lw * 0.8,
            baseAlpha * 0.75 * petal,
            pattern,
            false
          );
          ctx.restore();
        }
      }

      // ── Ambient mini-eyes ──
      if (!reduce) {
        for (const m of miniEyes) {
          const mx = m.fx * W;
          const my = m.fy * H;
          const mb = (t * 0.001 * m.speed + m.phase) % 4;
          const mOpen = mb < 0.25 ? Math.abs(Math.cos((mb / 0.25) * Math.PI)) : 1;
          drawEye(
            mx,
            my,
            m.size * 2.2,
            m.size,
            mOpen,
            lookX * 0.3,
            lookY * 0.3,
            theme,
            1.1,
            baseAlpha * 0.35,
            0,
            false
          );
        }
      }

      // ── Central eye (scales down slightly while mandala is open) ──
      const centerScale = 1 - petal * 0.25;
      drawEye(
        cx,
        cy,
        eyeW * centerScale,
        eyeH * centerScale,
        open,
        lookX,
        lookY,
        theme,
        lw,
        baseAlpha,
        pattern,
        true
      );

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden
    />
  );
}
