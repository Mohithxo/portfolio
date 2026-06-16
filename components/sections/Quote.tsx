"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";

/**
 * Cinematic interlude — a quiet, full-bleed manifesto line that plays into the
 * site's eye / chasing-the-light motif. Words fade up in sequence.
 */

const LINES = [
  "Aren't we all chasin' the light, mate?",
  "Lookin' everywhere to find it —",
  "everywhere but within.",
];

export default function Quote() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.4 });

  return (
    <section ref={ref} className="relative py-32 lg:py-44 overflow-hidden">
      {/* soft central glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[60vh] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(14,165,233,0.10), rgba(139,92,246,0.05) 40%, transparent 70%)",
        }}
      />

      <div className="section-container relative text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="block text-[11px] tracking-[0.5em] uppercase text-white/30 mb-8 font-display"
        >
          ✶ &nbsp;Within&nbsp; ✶
        </motion.span>

        <blockquote className="max-w-3xl mx-auto">
          {LINES.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.9, delay: 0.2 + i * 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-light text-2xl sm:text-3xl lg:text-4xl leading-tight text-white/75"
            >
              {line}
            </motion.p>
          ))}

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 + LINES.length * 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display font-semibold text-3xl sm:text-4xl lg:text-5xl leading-tight"
          >
            <span className="text-gradient">Look within &amp; wake up.</span>
          </motion.p>
        </blockquote>

        {/* thin underline beam */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 + LINES.length * 0.35 }}
          className="mx-auto mt-12 h-px w-40 origin-center"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.7), transparent)",
          }}
        />
      </div>
    </section>
  );
}
