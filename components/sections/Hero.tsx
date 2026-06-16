"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import { HERO_ROLES } from "@/lib/constants";
import { useLenis } from "@/components/providers/LenisProvider";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const GLITCH_CHARS = "!<>-_\\/[]{}@#$%^&*";

function GlitchText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);
  const prevText = useRef(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    if (text === prevText.current) return;
    progressRef.current = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      progressRef.current += 0.06;
      const t = Math.min(progressRef.current, 1);
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i / text.length < t) return char;
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join("")
      );
      if (t >= 1) {
        setDisplay(text);
        clearInterval(intervalRef.current!);
        prevText.current = text;
      }
    }, 30);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [text]);

  return <span>{display}</span>;
}

const line1 = "MOHITH".split("");
const line2 = "RAAGESH B".split("");

const letterTransition = (i: number) => ({
  delay: 0.04 * i,
  duration: 0.6,
  ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
});

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const lenis = useLenis();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const heroRef = useRef<HTMLElement>(null);

  // Scrub the hero content as it leaves — dissolves into the next section.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const contentBlur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(8px)"]);

  useEffect(() => {
    // Wait for page loader to finish
    const t = setTimeout(() => setShowContent(true), 1900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((i) => (i + 1) % HERO_ROLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToProjects = () => {
    if (lenis) lenis.scrollTo("#projects", { duration: 1.4 });
    else document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    if (lenis) lenis.scrollTo("#contact", { duration: 1.4 });
    else document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Gradient overlay — keeps the background eye legible behind text */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% 46%, rgba(10,10,15,0) 0%, rgba(10,10,15,0.55) 70%, rgba(10,10,15,0.9) 100%)",
        }}
      />

      {/* Vertical side rails */}
      {!isMobile && (
        <>
          <div
            className="absolute left-6 top-1/2 -translate-y-1/2 z-[2] text-[10px] tracking-[0.4em] text-white/30 uppercase"
            style={{ writingMode: "vertical-rl", fontFamily: "var(--font-space-grotesk)" }}
          >
            Based in Bengaluru · India
          </div>
          <div
            className="absolute right-6 top-1/2 -translate-y-1/2 z-[2] text-[10px] tracking-[0.4em] text-white/30 uppercase rotate-180"
            style={{ writingMode: "vertical-rl", fontFamily: "var(--font-space-grotesk)" }}
          >
            Portfolio · MMXXV
          </div>
        </>
      )}

      {/* Grid floor */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 z-[1] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(14,165,233,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
        }}
      />

      {/* Content */}
      <motion.div
        style={{
          y: contentY,
          scale: contentScale,
          opacity: contentOpacity,
          filter: contentBlur,
        }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        {/* Eyebrow index tag */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={showContent ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-6"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          <span className="h-[1px] w-10 bg-gradient-to-r from-transparent to-electric-blue/60" />
          <span className="text-[11px] tracking-[0.45em] text-electric-blue/80 uppercase whitespace-nowrap">
            ( 01 ) — Full Stack Developer
          </span>
          <span className="h-[1px] w-10 bg-gradient-to-l from-transparent to-electric-blue/60" />
        </motion.div>

        {/* Name with HUD frame */}
        <div className="relative inline-block mb-5">
          {/* Corner brackets */}
          {!isMobile &&
            [
              "-top-6 -left-8 border-t-2 border-l-2",
              "-top-6 -right-8 border-t-2 border-r-2",
              "-bottom-4 -left-8 border-b-2 border-l-2",
              "-bottom-4 -right-8 border-b-2 border-r-2",
            ].map((cls, i) => (
              <motion.span
                key={cls}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={showContent ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.7 + i * 0.08, duration: 0.4 }}
                className={`absolute w-7 h-7 ${cls} border-electric-blue/50`}
              />
            ))}

          {/* Scanline over the headline */}
          {showContent && !isMobile && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
              <div
                className="absolute left-0 right-0 h-12 animate-scanline"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(14,165,233,0.12), transparent)",
                }}
              />
            </div>
          )}

          <div aria-label="Mohith Raagesh B" className="leading-[0.9]">
            {/* Line 1 — filled gradient */}
            <div className="overflow-hidden py-1">
              <div className="flex justify-center">
                {line1.map((letter, i) => (
                  <motion.span
                    key={`l1-${i}`}
                    initial={{ y: "110%", opacity: 0 }}
                    animate={showContent ? { y: 0, opacity: 1 } : { y: "110%", opacity: 0 }}
                    transition={letterTransition(i)}
                    className="font-display font-bold text-6xl md:text-8xl lg:text-9xl tracking-tighter inline-block text-gradient"
                    style={{ textShadow: "0 0 60px rgba(14,165,233,0.25)" }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </div>
            {/* Line 2 — outlined / stroked */}
            <div className="overflow-hidden py-1">
              <div className="flex justify-center">
                {line2.map((letter, i) => (
                  <motion.span
                    key={`l2-${i}`}
                    initial={{ y: "110%", opacity: 0 }}
                    animate={showContent ? { y: 0, opacity: 1 } : { y: "110%", opacity: 0 }}
                    transition={letterTransition(line1.length + i)}
                    className="font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-[0.08em] inline-block"
                    style={{
                      color: "transparent",
                      WebkitTextStroke:
                        letter === " " ? "0" : "1.3px rgba(255,255,255,0.55)",
                      minWidth: letter === " " ? "0.6rem" : undefined,
                    }}
                  >
                    {letter === " " ? " " : letter}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Role cycling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={showContent ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mb-8 h-10 flex items-center justify-center gap-3"
        >
          <span className="text-electric-blue/40 font-display text-sm">[</span>
          <span className="text-electric-blue font-display font-semibold text-xl md:text-2xl tracking-wide">
            <GlitchText text={HERO_ROLES[roleIndex]} />
          </span>
          <span className="text-electric-blue/40 font-display text-sm">]</span>
        </motion.div>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={showContent ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="text-white/50 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Building high-performance web & mobile applications from Bengaluru, India.
          VIT Chennai B.Tech CSE &apos;25.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={showContent ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <MagneticButton variant="primary" onClick={scrollToProjects}>
            View My Work
          </MagneticButton>
          <MagneticButton variant="secondary" onClick={scrollToContact}>
            Contact Me
          </MagneticButton>
          <MagneticButton variant="ghost" href="/resume.pdf">
            Résumé ↗
          </MagneticButton>
        </motion.div>

        {/* Stat chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={showContent ? { opacity: 1 } : {}}
          transition={{ delay: 1.3 }}
          className="flex flex-wrap justify-center gap-3 mt-10"
        >
          {["3+ Yrs Freelance", "1 Yr Professional", "20+ Projects"].map((s) => (
            <span
              key={s}
              className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide border border-white/10 text-white/40 backdrop-blur-sm"
            >
              {s}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={showContent ? { opacity: 1 } : {}}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/20 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-electric-blue/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
