"use client";

import { useEffect, useRef } from "react";

interface HaloParticle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  alpha: number;
  alphaDir: number;
  color: string;
}

const COLORS = ["#0ea5e9", "#8b5cf6", "#06b6d4"];

export default function ParticleHalo({ size = 240 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size * 2.5;
    canvas.height = size * 2.5;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const particles: HaloParticle[] = Array.from({ length: 120 }, (_, i) => ({
      angle: (i / 120) * Math.PI * 2,
      radius: size * 0.5 + Math.random() * size * 0.15,
      speed: 0.002 + Math.random() * 0.004,
      size: Math.random() * 2.5 + 0.5,
      alpha: Math.random(),
      alphaDir: Math.random() > 0.5 ? 1 : -1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.angle += p.speed;
        p.alpha += p.alphaDir * 0.015;
        if (p.alpha > 1) { p.alpha = 1; p.alphaDir = -1; }
        if (p.alpha < 0.1) { p.alpha = 0.1; p.alphaDir = 1; }

        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;

        ctx.save();
        ctx.globalAlpha = p.alpha * 0.8;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute pointer-events-none"
      style={{
        width: size * 2.5,
        height: size * 2.5,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}
