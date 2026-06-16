"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { scrollStore, rgbStr, lerpColor, type RGB } from "@/lib/scrollStore";

/**
 * Scroll-morphing layered background (canvas2D).
 * Three composited layers, all themed by `scrollStore` each frame:
 *   1. Aurora flow   — large drifting gradient blobs on a low-res offscreen
 *                      canvas (cheap blur), color interpolated per section.
 *   2. Node mesh     — neural network, themed + energized by scroll velocity.
 *   3. Parallax dust — depth-layered specks drifting with scroll.
 * Foreground vignette + the existing NoiseOverlay sit on top.
 */

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface Blob {
  bx: number; // base position (0..1)
  by: number;
  rx: number; // radius factor
  phase: number;
  speed: number;
  hueShift: number; // which theme offset this blob leans toward
}

interface Dust {
  x: number;
  y: number;
  z: number; // depth 0.2..1 → parallax + size
  r: number;
}

export default function ScrollScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const auroraRef = useRef<HTMLCanvasElement | null>(null);
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
    const nodeCount = isMobile ? 52 : 70;
    const dustCount = isMobile ? 85 : 110;
    const maxDist = isMobile ? 160 : 175;

    // Offscreen low-res aurora buffer (≈1/6 res → blurs for free when scaled up)
    const aurora = document.createElement("canvas");
    const actx = aurora.getContext("2d")!;
    auroraRef.current = aurora;

    let W = 0;
    let H = 0;
    let aW = 0;
    let aH = 0;

    const nodes: Node[] = [];
    const dust: Dust[] = [];
    const blobs: Blob[] = [
      { bx: 0.2, by: 0.3, rx: 0.55, phase: 0, speed: 0.00018, hueShift: 0 },
      { bx: 0.78, by: 0.25, rx: 0.5, phase: 2, speed: 0.00023, hueShift: 1 },
      { bx: 0.5, by: 0.7, rx: 0.65, phase: 4, speed: 0.0002, hueShift: 2 },
      { bx: 0.85, by: 0.8, rx: 0.45, phase: 1, speed: 0.00026, hueShift: 1 },
    ];

    const seed = () => {
      nodes.length = 0;
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.4 + 0.8,
        });
      }
      dust.length = 0;
      for (let i = 0; i < dustCount; i++) {
        const z = Math.random() * 0.8 + 0.2;
        dust.push({
          x: Math.random() * W,
          y: Math.random() * H,
          z,
          r: z * 1.6 + 0.3,
        });
      }
    };

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      aW = Math.max(1, Math.round(W / 6));
      aH = Math.max(1, Math.round(H / 6));
      aurora.width = aW;
      aurora.height = aH;
      seed();
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;

    const drawAurora = (theme: RGB, next: RGB) => {
      actx.clearRect(0, 0, aW, aH);
      actx.globalCompositeOperation = "lighter";
      const palette: RGB[] = [theme, next, lerpColor(theme, next, 0.5)];

      for (const b of blobs) {
        b.phase += b.speed * (reduce ? 0 : 16);
        const drift = reduce ? 0 : Math.sin(b.phase) * 0.06;
        const cx = (b.bx + drift) * aW;
        const cy = (b.by + Math.cos(b.phase * 0.8) * 0.05) * aH;
        const rad = b.rx * Math.max(aW, aH);
        const col = palette[b.hueShift % palette.length];
        const g = actx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, rgbStr(col, 0.5));
        g.addColorStop(0.4, rgbStr(col, 0.18));
        g.addColorStop(1, rgbStr(col, 0));
        actx.fillStyle = g;
        actx.beginPath();
        actx.arc(cx, cy, rad, 0, Math.PI * 2);
        actx.fill();
      }
      actx.globalCompositeOperation = "source-over";
    };

    const draw = () => {
      if (document.hidden) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const theme = scrollStore.ready
        ? scrollStore.themeColor
        : ([14, 165, 233] as RGB);
      const next = scrollStore.nextColor;
      const vel = scrollStore.velocity;
      const energy = Math.min(Math.abs(vel) / 40, 1); // 0..1 scroll energy

      ctx.clearRect(0, 0, W, H);

      // ── Layer 1: aurora (drawn small, scaled up = soft) ──
      drawAurora(theme, next);
      ctx.globalAlpha = isMobile ? 0.68 : 0.7;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(aurora, 0, 0, W, H);
      ctx.globalAlpha = 1;

      if (reduce) {
        // Static themed wash only — no motion.
        raf = requestAnimationFrame(draw);
        return;
      }

      // ── Layer 3: parallax dust (drawn behind mesh) ──
      const par = scrollStore.rawScroll;
      for (const d of dust) {
        const py = (d.y - par * d.z * 0.08) % H;
        const yy = py < 0 ? py + H : py;
        ctx.beginPath();
        ctx.arc(d.x, yy, d.r, 0, Math.PI * 2);
        ctx.fillStyle = rgbStr(theme, 0.12 + d.z * 0.18);
        ctx.fill();
      }

      // ── Layer 2: node mesh ──
      const speedBoost = 1 + energy * 2.2;
      for (const n of nodes) {
        n.x += n.vx * speedBoost;
        n.y += n.vy * speedBoost;
        if (n.x < 0) n.x = W;
        if (n.x > W) n.x = 0;
        if (n.y < 0) n.y = H;
        if (n.y > H) n.y = 0;
      }

      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const a = (1 - dist / maxDist) * (0.14 + energy * 0.16);
            ctx.strokeStyle = rgbStr(theme, a);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.shadowBlur = 6;
      ctx.shadowColor = rgbStr(theme, 0.8);
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = rgbStr(theme, 0.55 + energy * 0.3);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // ── Foreground vignette ──
      const vg = ctx.createRadialGradient(
        W / 2,
        H / 2,
        Math.min(W, H) * 0.3,
        W / 2,
        H / 2,
        Math.max(W, H) * 0.75
      );
      vg.addColorStop(0, "rgba(10,10,15,0)");
      vg.addColorStop(1, "rgba(10,10,15,0.55)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

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
      style={{ background: "#0a0a0f" }}
    />
  );
}
