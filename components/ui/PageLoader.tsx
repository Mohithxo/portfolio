"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fast, smooth boot sequence: a ray-of-light backdrop whose rays light up with
 * colour as the loader fills, behind a big eye that grows and snaps open —
 * then a quick flash and we're in.
 */

const RAY_COLORS = ["#0ea5e9", "#06b6d4", "#22d3ee", "#8b5cf6", "#a78bfa", "#f59e0b"];
const GROW_MS = 1500;
const FADE_MS = 360;
const TOTAL = GROW_MS + FADE_MS;

export default function PageLoader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    const resize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();
    let raf = 0;
    let lastPct = -1;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const drawEye = (cx: number, cy: number, scale: number, open: number, lw: number) => {
      const w = scale, h = scale * 0.52;
      const ap = (h / 2) * open;
      ctx.lineJoin = "round"; ctx.lineCap = "round";
      const lid = () => {
        ctx.beginPath();
        ctx.moveTo(cx - w / 2, cy);
        ctx.quadraticCurveTo(cx, cy - ap * 2, cx + w / 2, cy);
        ctx.quadraticCurveTo(cx, cy + ap * 2, cx - w / 2, cy);
        ctx.closePath();
      };
      ctx.shadowColor = "#0ea5e9"; ctx.shadowBlur = 24;
      ctx.strokeStyle = "#0ea5e9"; ctx.globalAlpha = 0.95; ctx.lineWidth = lw;
      lid(); ctx.stroke();
      if (open > 0.15) {
        ctx.save(); lid(); ctx.clip();
        const irisR = Math.min(w * 0.28, ap * 1.2);
        const pupilR = irisR * 0.42;
        ctx.lineWidth = lw * 0.5;
        for (let k = 0; k < 72; k++) {
          const a = (k / 72) * Math.PI * 2;
          ctx.globalAlpha = 0.95 * (0.35 + 0.5 * (k % 2));
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * pupilR * 1.1, cy + Math.sin(a) * pupilR * 1.1);
          ctx.lineTo(cx + Math.cos(a) * irisR, cy + Math.sin(a) * irisR);
          ctx.stroke();
        }
        ctx.globalAlpha = 0.95; ctx.lineWidth = lw;
        ctx.beginPath(); ctx.arc(cx, cy, irisR, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, pupilR, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = "#05060a"; ctx.beginPath(); ctx.arc(cx, cy, pupilR * 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath();
        ctx.arc(cx - pupilR * 0.3, cy - pupilR * 0.38, Math.max(2, pupilR * 0.16), 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    };

    const draw = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / GROW_MS, 1);
      const grow = easeOut(p);
      const fadeT = Math.max(0, Math.min((elapsed - GROW_MS) / FADE_MS, 1));

      const cx0 = W / 2, cy0 = H / 2;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#05060a"; ctx.fillRect(0, 0, W, H);

      // gentle settle-shake, eases out near the end
      const shakeAmp = (1 - p) * 4 + (fadeT > 0 && fadeT < 0.4 ? 8 : 0);
      const cx = cx0 + (Math.random() - 0.5) * shakeAmp;
      const cy = cy0 + (Math.random() - 0.5) * shakeAmp;

      ctx.globalCompositeOperation = "lighter";

      // ── Rays that light up with colour as the loader fills ──
      const rays = 40;
      const rot = elapsed * 0.0003;
      const rayLen = Math.max(W, H) * 0.85;
      for (let i = 0; i < rays; i++) {
        const a = rot + (i / rays) * Math.PI * 2;
        const lit = i / rays <= p;
        const col = lit ? RAY_COLORS[i % RAY_COLORS.length] : "#0ea5e9";
        const alpha = lit ? 0.22 : 0.05;
        const spread = 0.05;
        const g = ctx.createLinearGradient(cx, cy, cx + Math.cos(a) * rayLen, cy + Math.sin(a) * rayLen);
        g.addColorStop(0, col + Math.round(alpha * 255).toString(16).padStart(2, "0"));
        g.addColorStop(1, col + "00");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a - spread) * rayLen, cy + Math.sin(a - spread) * rayLen);
        ctx.lineTo(cx + Math.cos(a + spread) * rayLen, cy + Math.sin(a + spread) * rayLen);
        ctx.closePath();
        ctx.fill();
      }

      // central glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.4);
      glow.addColorStop(0, `rgba(139,92,246,${0.22 * grow})`);
      glow.addColorStop(1, "rgba(139,92,246,0)");
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

      // ── Growing eye ──
      const maxScale = Math.min(W * 0.92, H * 1.7) * 0.5;
      const scale = maxScale * (0.14 + grow * 0.86);
      drawEye(cx, cy, scale, Math.min(1, grow * 1.4), Math.max(1.6, scale * 0.004));

      // ── Completion flash ──
      if (fadeT > 0) {
        const flash = Math.sin(Math.min(fadeT / 0.4, 1) * Math.PI);
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = `rgba(255,255,255,${flash * 0.8})`;
        ctx.fillRect(0, 0, W, H);
      }
      ctx.globalCompositeOperation = "source-over";

      const np = Math.floor(p * 100);
      if (np !== lastPct) { lastPct = np; setPct(np); }

      if (elapsed >= TOTAL) { setDone(true); return; }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  if (done) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] overflow-hidden"
      style={{
        opacity: pct >= 100 ? 0 : 1,
        transition: "opacity 0.3s ease-out 0.1s",
        pointerEvents: pct >= 100 ? "none" : "auto",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center select-none">
        <div className="font-display font-bold tracking-[0.5em] text-electric-blue" style={{ textShadow: "0 0 20px rgba(14,165,233,0.8)" }}>
          {String(pct).padStart(3, "0")}%
        </div>
        <div className="mt-2 text-[10px] tracking-[0.5em] text-white/30 uppercase">Initializing Vision</div>
      </div>
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-electric-blue/40" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-electric-blue/40" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-electric-blue/40" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-electric-blue/40" />
    </div>
  );
}
