"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { skills } from "@/lib/data";
import { useInView } from "@/hooks/useInView";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import type { Skill } from "@/types";

const CATEGORY_META: Record<Skill["category"], { label: string; color: string }> = {
  frontend: { label: "Frontend", color: "#0ea5e9" },
  backend: { label: "Backend", color: "#8b5cf6" },
  database: { label: "Database", color: "#06b6d4" },
  mobile: { label: "Mobile", color: "#f59e0b" },
  tool: { label: "Tooling", color: "#a78bfa" },
};
const catColor = (c: Skill["category"]) => CATEGORY_META[c].color;

/* ring-sector path for a roulette pocket */
function ringSector(C: number, r1: number, r2: number, a0: number, a1: number) {
  const p = (r: number, a: number) => `${(C + r * Math.cos(a)).toFixed(2)} ${(C + r * Math.sin(a)).toFixed(2)}`;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${p(r2, a0)} A ${r2} ${r2} 0 ${large} 1 ${p(r2, a1)} L ${p(r1, a1)} A ${r1} ${r1} 0 ${large} 0 ${p(r1, a0)} Z`;
}

/* ── Tech Arsenal as a roulette wheel ─────────────────────────────── */
function SkillWheel() {
  const wheelRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement[]>([]);
  const fitRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const speedRef = useRef(0.16);
  const targetRef = useRef(0.16);
  const rafRef = useRef<number>(0);
  const [scale, setScale] = useState(1);

  const SIZE = 460;
  const C = SIZE / 2;
  const N = skills.length;
  const step = (Math.PI * 2) / N;
  const segR1 = 92;
  const segR2 = 210;
  const labelR = 152;

  useEffect(() => {
    const loop = () => {
      speedRef.current += (targetRef.current - speedRef.current) * 0.05;
      angleRef.current += speedRef.current;
      if (wheelRef.current) wheelRef.current.style.transform = `rotate(${angleRef.current}deg)`;
      if (ballRef.current) ballRef.current.style.transform = `rotate(${-angleRef.current * 2.6}deg)`;
      badgesRef.current.forEach((el) => {
        if (el) el.style.transform = `translate(-50%,-50%) rotate(${-angleRef.current}deg)`;
      });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Scale the whole wheel (SVG + absolutely-positioned badges/ball) as one unit
  // so it never breaks apart when the viewport / resolution changes.
  useEffect(() => {
    const el = fitRef.current;
    if (!el) return;
    const fit = () => {
      const avail = el.clientWidth;
      setScale(Math.min(1, avail / SIZE));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={fitRef} className="w-full flex items-center justify-center" style={{ height: SIZE * scale }}>
    <div
      className="relative"
      style={{ width: SIZE, height: SIZE, transform: `scale(${scale})`, transformOrigin: "center center", flex: "0 0 auto" }}
      onMouseEnter={() => (targetRef.current = 0.85)}
      onMouseLeave={() => (targetRef.current = 0.16)}
    >
      {/* fixed pointer */}
      <div className="absolute left-1/2 -translate-x-1/2 z-30" style={{ top: -6 }}>
        <div
          style={{
            width: 0, height: 0,
            borderLeft: "11px solid transparent",
            borderRight: "11px solid transparent",
            borderTop: "18px solid #f59e0b",
            filter: "drop-shadow(0 0 6px #f59e0b)",
          }}
        />
      </div>

      {/* rotating wheel */}
      <div ref={wheelRef} className="absolute inset-0" style={{ willChange: "transform" }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 w-full h-full">
          {/* dark backdrop so neon reads against the bright background */}
          <circle cx={C} cy={C} r={segR2 + 8} fill="rgba(7,9,15,0.82)" />
          {/* outer rim */}
          <circle cx={C} cy={C} r={222} fill="none" stroke="rgba(245,158,11,0.6)" strokeWidth="2.5" />
          <circle cx={C} cy={C} r={segR2 + 4} fill="none" stroke="rgba(245,158,11,0.3)" strokeWidth="7" />
          {/* pockets */}
          {skills.map((s, i) => {
            const a0 = i * step - Math.PI / 2;
            const a1 = a0 + step;
            const col = catColor(s.category);
            return (
              <path
                key={s.name}
                d={ringSector(C, segR1, segR2, a0, a1)}
                fill={i % 2 ? `${col}55` : "rgba(12,15,26,0.9)"}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            );
          })}
          {/* rim studs */}
          {skills.map((s, i) => {
            const a = i * step - Math.PI / 2;
            return (
              <circle
                key={`stud-${i}`}
                cx={C + (segR2 + 4) * Math.cos(a)}
                cy={C + (segR2 + 4) * Math.sin(a)}
                r="2.2"
                fill="rgba(245,158,11,0.65)"
              />
            );
          })}
          {/* inner hub ring */}
          <circle cx={C} cy={C} r={segR1} fill="rgba(10,10,15,0.55)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
        </svg>

        {/* skill badges (counter-rotated to stay upright) */}
        {skills.map((s, i) => {
          const mid = i * step - Math.PI / 2 + step / 2;
          const x = C + labelR * Math.cos(mid);
          const y = C + labelR * Math.sin(mid);
          const col = catColor(s.category);
          return (
            <div
              key={s.name}
              ref={(el) => { if (el) badgesRef.current[i] = el; }}
              className="absolute whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-display font-semibold flex items-center gap-1.5"
              style={{
                left: x, top: y,
                background: `${col}33`,
                border: `1px solid ${col}aa`,
                color: col,
                boxShadow: `0 0 12px ${col}55`,
              }}
            >
              <span className="w-1 h-1 rounded-full" style={{ background: col, boxShadow: `0 0 4px ${col}` }} />
              {s.name}
            </div>
          );
        })}

        {/* orbiting ball */}
        <div ref={ballRef} className="absolute inset-0" style={{ willChange: "transform" }}>
          <div
            className="absolute rounded-full"
            style={{
              left: C + (segR2 - 10), top: C, width: 11, height: 11, marginLeft: -5.5, marginTop: -5.5,
              background: "#ffffff",
              boxShadow: "0 0 12px #fff, 0 0 22px #f59e0b",
            }}
          />
        </div>
      </div>

      {/* center hub (fixed) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center" style={{ width: 150, height: 150 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="absolute rounded-full border"
            style={{ width: 128, height: 128, borderColor: "rgba(14,165,233,0.35)", animation: `sonar 2.6s ease-out ${i * 0.8}s infinite` }} />
        ))}
        <div className="w-28 h-28 rounded-full flex flex-col items-center justify-center animate-pulse-glow"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,0.22), rgba(139,92,246,0.12))", border: "1px solid rgba(14,165,233,0.4)" }}>
          <span className="font-display font-bold text-2xl text-gradient leading-none">MR</span>
          <span className="text-[8px] tracking-[0.3em] text-white/40 mt-1 uppercase">Stack</span>
        </div>
      </div>
    </div>
    </div>
  );
}

/* ── Patterned, category-grouped grid ─────────────────────────────── */
function SkillGrid({ inView }: { inView: boolean }) {
  const categories = Object.keys(CATEGORY_META) as Skill["category"][];
  const grouped = categories
    .map((cat) => ({ cat, items: skills.filter((s) => s.category === cat) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
      {grouped.map((g, gi) => {
        const meta = CATEGORY_META[g.cat];
        return (
          <motion.div
            key={g.cat}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: gi * 0.08 }}
            className="relative rounded-2xl p-5 overflow-hidden"
            style={{ border: `1px solid ${meta.color}26`, background: "rgba(255,255,255,0.02)", backdropFilter: "blur(10px)" }}
            data-cursor="hover"
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage: `radial-gradient(${meta.color}30 1px, transparent 1px)`,
                backgroundSize: "14px 14px",
                maskImage: "radial-gradient(circle at 80% 0%, black, transparent 70%)",
                WebkitMaskImage: "radial-gradient(circle at 80% 0%, black, transparent 70%)",
              }}
            />
            <div className="absolute top-0 left-5 right-5 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)` }} />
            <div className="relative flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}` }} />
                <span className="font-display font-bold text-sm tracking-wide" style={{ color: meta.color }}>{meta.label}</span>
              </div>
              <span className="text-[10px] font-display text-white/30">{String(g.items.length).padStart(2, "0")}</span>
            </div>
            <div className="relative flex flex-wrap gap-2">
              {g.items.map((s) => (
                <span
                  key={s.name}
                  className="px-2.5 py-1 rounded-lg text-xs font-display font-medium text-white/70 transition-all hover:text-white hover:scale-105"
                  style={{ background: `${meta.color}10`, border: `1px solid ${meta.color}26` }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function Skills() {
  const [sectionRef, inView] = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section id="skills" ref={sectionRef} className="relative py-24 lg:py-36 overflow-hidden">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-14">
          <SectionEyebrow index="02" label="Skills" color="#8b5cf6" />
          <h2 className="section-heading mt-3">Tech <span className="text-gradient">Arsenal</span></h2>
          <p className="text-white/40 mt-3 max-w-md mx-auto text-sm">
            Spin the wheel — hover to accelerate. Full breakdown below.
          </p>
        </motion.div>

        {/* Roulette — self-scales to any width (desktop + mobile) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex items-center justify-center mb-12 w-full max-w-[480px] mx-auto px-4"
        >
          <SkillWheel />
        </motion.div>

        {/* Categorized grid */}
        <div>
          <SkillGrid inView={inView} />
        </div>
      </div>
    </section>
  );
}
