"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEasterEgg } from "@/hooks/useEasterEgg";

/**
 * "MOHITH" easter egg — a neon reality-glitch burst (no more powder):
 * expanding shockwave rings + rotating light beams + a giant eye snapping
 * open, with chromatic RGB-split glitch slices flickering over it all.
 */

const NEON = ["#ff2d95", "#b14aed", "#2de2e6", "#0ea5e9", "#f5d300"];
const DURATION = 3000;

export default function EasterEgg() {
  const [active, setActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const trigger = useCallback(() => setActive(true), []);
  useEasterEgg(trigger);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = W / 2;
    const cy = H / 2;
    const start = performance.now();

    const drawEye = (scale: number, open: number, color: string, alpha: number) => {
      const w = scale;
      const h = scale * 0.5;
      const ap = (h / 2) * Math.max(0, Math.min(1, open));
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 30;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = Math.max(2, scale * 0.004);
      ctx.beginPath();
      ctx.moveTo(cx - w / 2, cy);
      ctx.quadraticCurveTo(cx, cy - ap * 2, cx + w / 2, cy);
      ctx.quadraticCurveTo(cx, cy + ap * 2, cx - w / 2, cy);
      ctx.closePath();
      ctx.stroke();
      if (open > 0.2) {
        const irisR = Math.min(w * 0.27, ap * 1.2);
        const pupilR = irisR * 0.42;
        ctx.lineWidth = Math.max(1, scale * 0.0022);
        for (let k = 0; k < 64; k++) {
          const a = (k / 64) * Math.PI * 2;
          ctx.globalAlpha = alpha * (0.4 + 0.5 * (k % 2));
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * pupilR * 1.1, cy + Math.sin(a) * pupilR * 1.1);
          ctx.lineTo(cx + Math.cos(a) * irisR, cy + Math.sin(a) * irisR);
          ctx.stroke();
        }
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(cx, cy, pupilR, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };

    const loop = (now: number) => {
      const t = now - start;
      const p = Math.min(t / DURATION, 1);
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      // Expanding shockwave rings (staggered)
      for (let i = 0; i < 5; i++) {
        const rt = (t - i * 140) / 1100;
        if (rt < 0 || rt > 1) continue;
        const r = rt * Math.max(W, H) * 0.75;
        ctx.strokeStyle = NEON[i % NEON.length];
        ctx.globalAlpha = (1 - rt) * 0.8;
        ctx.lineWidth = 3 * (1 - rt) + 0.5;
        ctx.shadowColor = NEON[i % NEON.length];
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // Rotating light beams (first ~1.4s)
      const beamFade = Math.max(0, 1 - t / 1400);
      if (beamFade > 0) {
        const beams = 16;
        const rot = t * 0.002;
        const len = Math.max(W, H) * 0.7;
        for (let i = 0; i < beams; i++) {
          const a = rot + (i / beams) * Math.PI * 2;
          const g = ctx.createLinearGradient(cx, cy, cx + Math.cos(a) * len, cy + Math.sin(a) * len);
          g.addColorStop(0, NEON[i % NEON.length]);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.strokeStyle = g;
          ctx.globalAlpha = beamFade * 0.5;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      // Giant eye snapping open, blinking near the end
      const openCurve = t < 1800 ? Math.min(1, t / 400) : 1 - Math.abs(Math.sin((t - 1800) / 500)) * (t > 2300 ? 1 : 0);
      const eyeScale = Math.min(W * 0.8, H * 1.4) * (0.4 + p * 0.25);
      drawEye(eyeScale, Math.max(0.1, openCurve), "#2de2e6", 0.9 * (1 - p * 0.3));

      // Chromatic RGB-split glitch slices (flicker at start + end)
      const glitching = t < 700 || t > 2400;
      if (glitching && Math.random() > 0.4) {
        ctx.globalCompositeOperation = "screen";
        const slices = 6;
        for (let i = 0; i < slices; i++) {
          const sy = Math.random() * H;
          const sh = 8 + Math.random() * 40;
          const off = (Math.random() - 0.5) * 60;
          ctx.fillStyle = ["rgba(255,0,90,0.25)", "rgba(45,226,230,0.25)", "rgba(177,74,237,0.25)"][i % 3];
          ctx.fillRect(off, sy, W, sh);
        }
      }

      ctx.globalCompositeOperation = "source-over";

      if (p < 1) rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const dismiss = setTimeout(() => setActive(false), DURATION);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(dismiss);
    };
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="easter-egg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[10001] pointer-events-none flex items-center justify-center"
          onClick={() => setActive(false)}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, scale: 1, letterSpacing: "0.35em" }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="relative z-10 text-center"
          >
            <p
              className="font-display text-3xl md:text-5xl font-bold uppercase"
              style={{
                color: "#2de2e6",
                textShadow: "0 0 24px rgba(45,226,230,0.9), 2px 0 #ff2d95, -2px 0 #b14aed",
              }}
            >
              You Found Me
            </p>
            <p className="text-white/50 text-xs mt-3 tracking-[0.4em] uppercase">
              — Mohith Raagesh B
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
