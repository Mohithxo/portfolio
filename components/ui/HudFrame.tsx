"use client";

import { useEffect, useRef, useState } from "react";
import { scrollStore, SECTION_LABELS, rgbStr } from "@/lib/scrollStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { isTouchDevice } from "@/lib/utils";

/**
 * Fixed full-viewport sci-fi HUD overlay. Corner frame brackets, an animated
 * EKG line, and live telemetry chips that read real signal from `scrollStore`.
 * pointer-events-none — purely decorative, sits just under the cursor layer.
 */
export default function HudFrame() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);
  const [touch, setTouch] = useState(false);

  // Throttled readouts (10fps is plenty for text — keeps re-renders cheap)
  const [hud, setHud] = useState({
    section: "HOME",
    progress: 0,
    x: 0,
    y: 0,
    fps: 60,
  });
  const ekgRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
    setTouch(isTouchDevice());
  }, []);

  // Telemetry text — updated ~8x/sec
  useEffect(() => {
    let lastT = performance.now();
    let frames = 0;
    let fps = 60;
    let rafId = 0;
    const fpsLoop = (now: number) => {
      frames++;
      if (now - lastT >= 1000) {
        fps = frames;
        frames = 0;
        lastT = now;
      }
      rafId = requestAnimationFrame(fpsLoop);
    };
    rafId = requestAnimationFrame(fpsLoop);

    const id = setInterval(() => {
      setHud({
        section: SECTION_LABELS[scrollStore.sectionIndex] ?? "HOME",
        progress: Math.round(scrollStore.progress * 100),
        x: Math.round(scrollStore.mouseX < 0 ? 0 : scrollStore.mouseX),
        y: Math.round(scrollStore.mouseY < 0 ? 0 : scrollStore.mouseY),
        fps,
      });
    }, 120);

    return () => {
      clearInterval(id);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // EKG / sine telemetry line
  useEffect(() => {
    const canvas = ekgRef.current;
    if (!canvas || isMobile) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = 120;
    const h = 28;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    let raf = 0;
    let phase = 0;
    const loop = () => {
      if (document.hidden) {
        raf = requestAnimationFrame(loop);
        return;
      }
      phase += 0.08 + Math.min(Math.abs(scrollStore.velocity) / 60, 0.25);
      ctx.clearRect(0, 0, w, h);
      const col = rgbStr(scrollStore.themeColor, 0.9);
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.2;
      ctx.shadowColor = col;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      for (let x = 0; x <= w; x++) {
        const beat = Math.sin(x * 0.18 + phase);
        const spike =
          Math.abs((x % 40) - 20) < 2 ? Math.sin(phase * 2) * 6 : 0;
        const y = h / 2 + beat * 5 + spike;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isMobile]);

  if (!mounted) return null;

  const accent = "rgba(14,165,233,0.45)";

  return (
    <div className="fixed inset-0 z-[9990] pointer-events-none select-none">
      {/* Corner brackets */}
      {[
        "top-4 left-4 border-t border-l",
        "top-4 right-4 border-t border-r",
        "bottom-4 left-4 border-b border-l",
        "bottom-4 right-4 border-b border-r",
      ].map((cls) => (
        <div
          key={cls}
          className={`absolute w-5 h-5 ${cls}`}
          style={{ borderColor: accent }}
        />
      ))}

      {/* Top-left: section + EKG */}
      {!isMobile && (
        <div
          className="absolute top-7 left-9 flex items-center gap-3 animate-hud-flicker"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "#22c55e",
              boxShadow: "0 0 6px #22c55e",
            }}
          />
          <span className="text-[10px] tracking-[0.25em] text-white/45">
            SYS://{hud.section}
          </span>
          <canvas ref={ekgRef} width={120} height={28} className="opacity-70" />
        </div>
      )}

      {/* Top-right: scroll progress */}
      {!isMobile && (
        <div
          className="absolute top-7 right-9 text-right text-[10px] tracking-[0.25em] text-white/40"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          <div>SCROLL {String(hud.progress).padStart(3, "0")}%</div>
          <div className="mt-1 text-white/25">
            {hud.fps} FPS · STATUS: ONLINE
          </div>
        </div>
      )}

      {/* Bottom-left: cursor coordinates */}
      {!isMobile && !touch && (
        <div
          className="absolute bottom-7 left-9 text-[10px] tracking-[0.25em] text-white/35"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          PTR [{String(hud.x).padStart(4, "0")},
          {String(hud.y).padStart(4, "0")}]
        </div>
      )}

      {/* Bottom-right: identity tag */}
      {!isMobile && (
        <div
          className="absolute bottom-7 right-9 text-[10px] tracking-[0.25em] text-white/35"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          MR-PORTFOLIO · v2.0
        </div>
      )}
    </div>
  );
}
