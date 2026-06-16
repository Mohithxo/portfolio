"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { experiences, certifications } from "@/lib/data";
import { useInView } from "@/hooks/useInView";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

/* Rotating medal/seal with a crest */
function Seal({ color }: { color: string }) {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <motion.svg
        viewBox="0 0 64 64"
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {/* notched outer ring */}
        <circle cx="32" cy="32" r="29" fill="none" stroke={color} strokeWidth="2" strokeDasharray="2 4" opacity="0.7" />
        <circle cx="32" cy="32" r="24" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      </motion.svg>
      {/* static crest */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ background: `${color}1a`, border: `1.5px solid ${color}`, boxShadow: `0 0 14px ${color}55` }}
      >
        <span className="font-display font-bold text-[10px] tracking-tight" style={{ color }}>IIT</span>
      </div>
      {/* ribbon tails */}
      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
        <span className="block w-1.5 h-3 rotate-12" style={{ background: `${color}cc` }} />
        <span className="block w-1.5 h-3 -rotate-12" style={{ background: `${color}cc` }} />
      </span>
    </div>
  );
}

function Certifications() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });
  return (
    <div ref={ref} className="mt-28">
      <div className="text-center mb-12">
        <SectionEyebrow index="03+" label="Credentials" color="#06b6d4" />
        <h3 className="font-display font-bold text-2xl lg:text-3xl mt-3">
          Certifications <span className="text-gradient">&amp; Training</span>
        </h3>
      </div>
      <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {certifications.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 36, rotateX: -14 }}
            animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -6 }}
            className="group relative rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
              backdropFilter: "blur(14px)",
              border: `1px solid ${c.color}40`,
              boxShadow: `0 10px 40px ${c.color}12`,
            }}
            data-cursor="hover"
          >
            {/* guilloché pattern */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.12]" aria-hidden preserveAspectRatio="none" viewBox="0 0 200 240">
              {[20, 40, 60, 80, 100].map((r) => (
                <circle key={r} cx="100" cy="120" r={r} fill="none" stroke={c.color} strokeWidth="0.5" />
              ))}
              {Array.from({ length: 24 }).map((_, k) => {
                const a = (k / 24) * Math.PI * 2;
                return <line key={k} x1="100" y1="120" x2={100 + Math.cos(a) * 110} y2={120 + Math.sin(a) * 110} stroke={c.color} strokeWidth="0.3" />;
              })}
            </svg>

            <div className="holo-sheen group-hover:[animation:sheen-sweep_0.9s_ease-out]" />

            {/* CERTIFIED ribbon */}
            <div
              className="absolute -right-9 top-4 rotate-45 px-10 py-1 text-[9px] font-display font-bold tracking-[0.2em] text-white"
              style={{ background: `linear-gradient(90deg, ${c.color}, ${c.color}aa)`, boxShadow: `0 0 14px ${c.color}66` }}
            >
              CERTIFIED
            </div>

            <div className="relative p-6 flex flex-col items-center text-center">
              <Seal color={c.color} />
              <h4 className="font-display font-bold text-white text-sm leading-snug mt-5 mb-1">{c.title}</h4>
              <div className="flex items-center gap-1.5 text-xs text-white/50 mb-4">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.color, boxShadow: `0 0 6px ${c.color}` }} />
                Issued by {c.issuer}
              </div>

              {/* serial strip */}
              <div className="w-full mt-auto pt-3 border-t border-dashed border-white/10 flex items-center justify-between text-[10px] font-display tracking-wider">
                <span className="text-white/30">ID · {c.code}</span>
                <span className="flex items-center gap-1" style={{ color: c.color }}>
                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  VERIFIED
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const TYPE_COLORS = {
  "full-time": { bg: "rgba(14,165,233,0.12)", border: "rgba(14,165,233,0.35)", text: "#0ea5e9" },
  freelance: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.35)", text: "#f59e0b" },
  internship: { bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.35)", text: "#8b5cf6" },
};

/* Branching connector — the snake spine forks out and fans into the card.
   Drawn for a left-side card; mirrored via scaleX(-1) for right-side cards. */
function Connector({ color, inView, flip }: { color: string; inView: boolean; flip: boolean }) {
  // base geometry (spine junction on the RIGHT at x≈108, prongs fan LEFT to x≈14)
  const trunk = "M108 45 L62 45";
  const prongs = [
    "M62 45 C44 45 42 20 16 20", // up
    "M62 45 L16 45", // mid
    "M62 45 C44 45 42 70 16 70", // down
  ];
  const ends: [number, number][] = [[16, 20], [16, 45], [16, 70]];

  const draw = {
    initial: { pathLength: 0, opacity: 0 },
    animate: inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 },
  };

  return (
    <svg
      viewBox="0 0 110 90"
      className="w-full h-full overflow-visible"
      style={{ transform: flip ? "scaleX(-1)" : "none", filter: `drop-shadow(0 0 5px ${color}aa)` }}
      aria-hidden
    >
      {/* trunk out of the spine */}
      <motion.path
        d={trunk}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        {...draw}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      {/* fan prongs */}
      {prongs.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          {...draw}
          transition={{ duration: 0.5, delay: 0.35 + i * 0.08, ease: "easeOut" }}
          style={{ opacity: 0.85 }}
        />
      ))}
      {/* tip dots where prongs meet the card */}
      {ends.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r="2.4"
          fill={color}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.6 + i * 0.08 }}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      ))}
      {/* glowing junction on the spine */}
      <motion.circle
        cx="108"
        cy="45"
        r="4"
        fill="#0a0a0f"
        stroke={color}
        strokeWidth="2"
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.35, delay: 0.15, type: "spring", stiffness: 300 }}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />
    </svg>
  );
}

function TimelineItem({
  exp,
  index,
  total,
  isMobile,
}: {
  exp: (typeof experiences)[0];
  index: number;
  total: number;
  isMobile: boolean;
}) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.35 });
  const isLeft = index % 2 === 0;
  const colors = TYPE_COLORS[exp.type];

  // Card contents — shared between mobile and desktop layouts
  const cardInner = (
    <>
      {/* Snake wrapping the card — animated border draw */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <rect x="1.5" y="1.5" width="97" height="97" rx="6" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <motion.rect
          x="1.5"
          y="1.5"
          width="97"
          height="97"
          rx="6"
          fill="none"
          stroke={colors.text}
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          style={{ filter: `drop-shadow(0 0 6px ${colors.text})` }}
        />
      </svg>

      {/* Card number + status */}
      <div className="relative flex items-center justify-between mb-3">
        <span className="text-[10px] font-display tracking-[0.3em] text-white/30">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        {exp.current ? (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-electric-blue/15 text-electric-blue border border-electric-blue/30">
            <span className="w-1.5 h-1.5 rounded-full bg-electric-blue animate-pulse" style={{ boxShadow: "0 0 6px #0ea5e9" }} />
            ACTIVE
          </span>
        ) : (
          <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: `${colors.text}99` }}>
            {exp.type}
          </span>
        )}
      </div>

      <div className="relative">
        <h3 className="font-display font-bold text-lg text-white">{exp.role}</h3>
        <div className="text-sm font-semibold mt-0.5" style={{ color: colors.text }}>
          {exp.company}
        </div>
        <div className="text-white/40 text-xs mt-1 mb-4 font-display tracking-wide">{exp.period}</div>

        <ul className="space-y-1.5 mb-4">
          {exp.description.map((d, i) => (
            <li key={i} className="text-white/55 text-sm flex items-start gap-2.5">
              <span className="mt-[7px] flex-shrink-0" style={{ color: colors.text }}>
                <span className="block w-2 h-[2px] rounded-full" style={{ background: colors.text, boxShadow: `0 0 4px ${colors.text}` }} />
              </span>
              {d}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-1.5">
          {exp.tech.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-full text-xs font-display transition-transform hover:scale-105"
              style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </>
  );

  const cardStyle = {
    background: "rgba(255,255,255,0.025)",
    backdropFilter: "blur(16px)",
    boxShadow: inView ? `0 20px 60px ${colors.text}12` : "none",
    transition: "box-shadow 0.6s",
  } as const;

  /* ── Mobile: single column, spine on the left ─────────────────────── */
  if (isMobile) {
    return (
      <div ref={ref} className="relative pl-12">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative w-full p-5 rounded-2xl group"
          style={cardStyle}
          data-cursor="hover"
        >
          {cardInner}
        </motion.div>

        {/* connector: spine (left) → fans right into the card */}
        <div className="absolute top-1/2 z-10 pointer-events-none" style={{ left: 2, width: 58, height: 80, transform: "translateY(-50%)" }}>
          <Connector color={colors.text} inView={inView} flip />
        </div>
      </div>
    );
  }

  /* ── Desktop: alternating sides around a centred spine ────────────── */
  return (
    <div ref={ref} className={cn("relative flex items-center", isLeft ? "flex-row" : "flex-row-reverse")}>
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn("relative w-5/12 p-6 rounded-2xl group", isLeft ? "mr-auto" : "ml-auto")}
        style={cardStyle}
        data-cursor="hover"
      >
        {cardInner}
      </motion.div>

      {/* Branching connector from the spine into the card */}
      <div
        className="absolute top-1/2 z-10 pointer-events-none"
        style={{
          width: 120,
          height: 100,
          [isLeft ? "right" : "left"]: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <Connector color={colors.text} inView={inView} flip={!isLeft} />
      </div>

      <div className="w-5/12" />
    </div>
  );
}

export default function Experience() {
  const [sectionRef, inView] = useInView<HTMLElement>({ threshold: 0.1 });
  const timelineRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Drive the crawling snake by scroll position through the timeline.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });
  const snakeHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" ref={sectionRef} className="relative py-24 lg:py-36 overflow-hidden">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-20">
          <SectionEyebrow index="03" label="Experience" />
          <h2 className="section-heading mt-3">Career <span className="text-gradient">Journey</span></h2>
          <p className="text-white/40 mt-3 max-w-md mx-auto text-sm">A serpent of light traces the path — scroll to follow.</p>
        </motion.div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Faint spine track — left on mobile, centred on desktop */}
          <div className="absolute left-[5px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-white/5 rounded-full" />

          {/* Crawling snake — head rides the tip of the fill, so the line and
              dot are always one connected element, aligned to the spine. */}
          <motion.div
            className="absolute left-[4px] md:left-1/2 md:-translate-x-1/2 top-0 w-[3px] rounded-full origin-top"
            style={{
              height: snakeHeight,
              background: "linear-gradient(to bottom, rgba(14,165,233,0), #0ea5e9 28%, #8b5cf6 70%, #06b6d4)",
              boxShadow: "0 0 12px rgba(14,165,233,0.55)",
            }}
          >
            {/* trailing pulse segments just above the head */}
            {[12, 20, 28].map((d, i) => (
              <span
                key={d}
                className="absolute left-1/2 -translate-x-1/2 rounded-full"
                style={{
                  width: 5 - i,
                  height: 5 - i,
                  bottom: d,
                  background: "#0ea5e9",
                  opacity: 0.5 - i * 0.14,
                  boxShadow: "0 0 6px #0ea5e9",
                }}
              />
            ))}
            {/* glowing head at the exact tip */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 rounded-full"
              style={{
                background: "radial-gradient(circle, #ffffff, #0ea5e9 60%, #8b5cf6)",
                boxShadow: "0 0 16px #0ea5e9, 0 0 28px rgba(139,92,246,0.6)",
              }}
            />
          </motion.div>

          <div className="space-y-14 py-4">
            {experiences.map((exp, i) => (
              <TimelineItem key={exp.company} exp={exp} index={i} total={experiences.length} isMobile={isMobile} />
            ))}
          </div>
        </div>

        <Certifications />
      </div>
    </section>
  );
}
