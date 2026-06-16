"use client";

import { useEffect, useRef, useState, MouseEvent } from "react";
import { motion, type Variants } from "framer-motion";
import ParticleHalo from "@/components/three/ParticleHalo";
import { personalInfo, stats } from "@/lib/data";
import { useInView } from "@/hooks/useInView";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import BrandLogo from "@/components/ui/BrandLogo";

/**
 * Holographic depth card — three layers parallax at different rates on
 * mouse-move for a real depth illusion, plus a sheen sweep on enter and
 * live "spec" chips.
 */
function HoloCard() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 12}deg) rotateX(${-py * 12}deg)`;
    if (backRef.current) backRef.current.style.transform = `translate(${px * 14}px, ${py * 14}px)`;
    if (midRef.current) midRef.current.style.transform = `translate(${px * 26}px, ${py * 26}px)`;
    if (frontRef.current) frontRef.current.style.transform = `translate(${px * 40}px, ${py * 40}px)`;
  };

  const onLeave = () => {
    const el = wrapRef.current;
    if (el) el.style.transform = "perspective(900px) rotateY(0) rotateX(0)";
    [backRef, midRef, frontRef].forEach((ref) => {
      if (ref.current) ref.current.style.transform = "translate(0,0)";
    });
  };

  const onEnter = () => {
    if (sheenRef.current) {
      sheenRef.current.classList.remove("sweeping");
      void sheenRef.current.offsetWidth; // restart animation
      sheenRef.current.classList.add("sweeping");
    }
  };

  const hh = String(Math.floor(uptime / 3600)).padStart(2, "0");
  const mm = String(Math.floor((uptime % 3600) / 60)).padStart(2, "0");
  const ss = String(uptime % 60).padStart(2, "0");

  return (
    <div className="relative" data-cursor="hover">
      <ParticleHalo size={160} />
      <div
        ref={wrapRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onMouseEnter={onEnter}
        className="relative z-10 w-56 h-72 md:w-64 md:h-80 rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(139,92,246,0.15) 100%)",
          border: "1px solid rgba(14,165,233,0.25)",
          boxShadow:
            "0 0 40px rgba(14,165,233,0.1), inset 0 0 40px rgba(139,92,246,0.05)",
          transition: "transform 0.3s ease-out",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* Back layer — grid */}
        <div
          ref={backRef}
          className="absolute inset-[-20px]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(14,165,233,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.12) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            transition: "transform 0.2s ease-out",
          }}
        />
        {/* Mid layer — glow blob */}
        <div
          ref={midRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ transition: "transform 0.2s ease-out" }}
        >
          <div
            className="w-40 h-40 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)",
              filter: "blur(6px)",
            }}
          />
        </div>
        {/* Front layer — brand mark */}
        <div
          ref={frontRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ transition: "transform 0.2s ease-out" }}
        >
          <BrandLogo size={150} className="drop-shadow-[0_0_24px_rgba(14,165,233,0.45)]" />
        </div>

        {/* Holographic sheen */}
        <div ref={sheenRef} className="holo-sheen" />

        {/* HUD corner brackets */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-electric-blue/50 rounded-tl-sm" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-violet/50 rounded-br-sm" />

        {/* Live spec readout */}
        <div
          className="absolute bottom-3 left-3 text-[8px] leading-tight tracking-widest text-electric-blue/70"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          <div>LOC: BENGALURU</div>
          <div>STATUS: OPEN</div>
          <div>UPTIME {hh}:{mm}:{ss}</div>
        </div>
      </div>
    </div>
  );
}

function StatCounter({
  value,
  suffix,
  label,
  inView,
}: {
  value: number;
  suffix: string;
  label: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const duration = 2000;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * value));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <div className="text-center">
      <div className="font-display font-bold text-4xl md:text-5xl text-gradient">
        {count}
        {suffix}
      </div>
      <div className="text-white/40 text-sm mt-1 tracking-wide">{label}</div>
    </div>
  );
}

export default function About() {
  const [sectionRef, inView] = useInView<HTMLElement>({ threshold: 0.2 });

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section id="about" ref={sectionRef} className="relative py-24 lg:py-36 overflow-hidden">
      <div className="section-container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center"
        >
          {/* Portrait */}
          <motion.div variants={itemVariants} className="flex justify-center lg:justify-end">
            <HoloCard />
          </motion.div>

          {/* Text */}
          <motion.div variants={containerVariants} className="space-y-6">
            <motion.div variants={itemVariants}>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <SectionEyebrow index="01" label="About" />
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-display font-semibold tracking-wider uppercase border border-green-400/30 bg-green-400/10 text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" style={{ boxShadow: "0 0 6px #4ade80" }} />
                  Available for work
                </span>
              </div>
              <h2 className="section-heading">
                Crafting Digital{" "}
                <span className="text-gradient">Experiences</span>
              </h2>
            </motion.div>

            <motion.p variants={itemVariants} className="text-white/60 leading-relaxed">
              {personalInfo.bio}
            </motion.p>
            <motion.p variants={itemVariants} className="text-white/50 leading-relaxed text-sm">
              {personalInfo.longBio}
            </motion.p>

            {/* Highlights */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2.5">
              {[
                { icon: "📍", text: personalInfo.location },
                { icon: "🎓", text: "B.Tech CSE — VIT Chennai '25" },
                { icon: "⚡", text: "Fast response · < 24h" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-xs text-white/55 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02]">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/5"
            >
              {stats.map((stat) => (
                <StatCounter
                  key={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  inView={inView}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* What I do — focus areas */}
        <div className="mt-20">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-display font-semibold tracking-[0.3em] uppercase text-white/40">What I Do</span>
            <span className="flex-1 h-[1px] bg-gradient-to-r from-white/15 to-transparent" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Web Applications", desc: "Next.js & React — fast SSR/SPA products", color: "#0ea5e9", glyph: "◧" },
              { title: "Mobile Apps", desc: "Cross-platform apps with Flutter", color: "#f59e0b", glyph: "▤" },
              { title: "Backend & APIs", desc: "Node, Express & clean REST design", color: "#8b5cf6", glyph: "⬡" },
              { title: "Real-time Systems", desc: "Socket.IO, Redis & live data", color: "#06b6d4", glyph: "◈" },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                className="group relative rounded-2xl p-5 overflow-hidden"
                style={{ border: `1px solid ${f.color}26`, background: "rgba(255,255,255,0.02)" }}
                data-cursor="hover"
              >
                <div className="holo-sheen rounded-2xl group-hover:[animation:sheen-sweep_0.9s_ease-out]" />
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl mb-3 text-lg"
                  style={{ background: `${f.color}14`, border: `1px solid ${f.color}33`, color: f.color, boxShadow: `0 0 14px ${f.color}22` }}
                >
                  {f.glyph}
                </div>
                <h4 className="font-display font-bold text-white text-sm mb-1">{f.title}</h4>
                <p className="text-white/45 text-xs leading-relaxed">{f.desc}</p>
                <span className="absolute bottom-3 right-3 text-[10px] font-display text-white/20">0{i + 1}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
