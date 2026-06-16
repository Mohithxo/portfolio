"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_ITEMS } from "@/lib/constants";
import { useLenis } from "@/components/providers/LenisProvider";
import { cn } from "@/lib/utils";
import BrandLogo from "@/components/ui/BrandLogo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [clock, setClock] = useState("");
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Live IST clock for the status chip
  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Kolkata",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const sectionRatios: Record<string, number> = {};

    NAV_ITEMS.forEach(({ sectionId }) => {
      const el = document.getElementById(sectionId);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          sectionRatios[sectionId] = entry.intersectionRatio;
          const best = Object.entries(sectionRatios).reduce((a, b) =>
            b[1] > a[1] ? b : a
          );
          if (best[1] > 0) setActiveSection(best[0]);
        },
        { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (sectionId: string) => {
    setMenuOpen(false);
    if (lenis) {
      lenis.scrollTo(`#${sectionId}`, { duration: 1.4 });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const links = NAV_ITEMS.filter((n) => n.sectionId !== "hero");

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 left-0 right-0 z-[9991]"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4">
          <div
            className={cn(
              "flex items-center justify-between gap-4 rounded-2xl px-4 md:px-5 py-2.5 transition-all duration-500",
              scrolled
                ? "backdrop-blur-xl bg-base/60 border border-white/10 shadow-[0_8px_40px_rgba(14,165,233,0.08)]"
                : "border border-transparent"
            )}
          >
            {/* Logo — half-human / half-AI brand mark */}
            <button
              onClick={() => scrollTo("hero")}
              className="group flex items-center gap-2.5"
              data-cursor="hover"
              data-cursor-label="Top"
            >
              <span
                className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-transform duration-300 group-hover:scale-105"
                style={{ filter: "drop-shadow(0 0 8px rgba(14,165,233,0.35))" }}
              >
                <BrandLogo size={34} />
              </span>
              <span className="font-display font-bold text-lg tracking-tight leading-none">
                <span className="text-gradient">MR</span>
                <span className="text-electric-blue/60">_</span>
              </span>
            </button>

            {/* Desktop pill links */}
            <div className="hidden md:flex items-center gap-1 rounded-full border border-white/5 bg-white/[0.02] p-1">
              {links.map((item) => {
                const isActive = activeSection === item.sectionId;
                return (
                  <button
                    key={item.sectionId}
                    onClick={() => scrollTo(item.sectionId)}
                    data-cursor="hover"
                    className="relative px-4 py-1.5 rounded-full text-xs font-display font-semibold tracking-wide transition-colors duration-200"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-electric-blue/20 to-violet/20 border border-electric-blue/40"
                        style={{ boxShadow: "0 0 16px rgba(14,165,233,0.25)" }}
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span
                      className={cn(
                        "relative z-10 transition-colors",
                        isActive ? "text-white" : "text-white/45 hover:text-white/80"
                      )}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right: live status + CTA */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02]">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-green-400"
                  style={{ boxShadow: "0 0 6px #4ade80" }}
                />
                <span
                  className="text-[10px] tracking-[0.2em] text-white/40 tabular-nums"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  IST {clock}
                </span>
              </div>

              {/* Résumé — drop your PDF at /public/resume.pdf */}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                data-cursor-label="CV"
                className="hidden lg:flex items-center gap-1.5 px-4 py-2 text-xs font-display font-semibold rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors"
              >
                Résumé
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>

              <button
                onClick={() => scrollTo("contact")}
                data-cursor="hover"
                data-cursor-label="Hire"
                className="hidden md:block relative px-5 py-2 text-xs font-display font-bold rounded-full text-white overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-electric-blue to-violet opacity-90 group-hover:opacity-100 transition-opacity" />
                <span className="absolute inset-0 bg-gradient-to-r from-electric-blue to-violet blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
                <span className="relative">Hire Me</span>
              </button>

              {/* Hamburger */}
              <button
                className="md:hidden w-8 h-8 flex flex-col justify-center gap-1.5 z-50"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
              >
                <span className={cn("block h-[2px] bg-white transition-all duration-300", menuOpen ? "w-6 rotate-45 translate-y-[7px]" : "w-6")} />
                <span className={cn("block h-[2px] bg-white transition-all duration-300", menuOpen ? "opacity-0 w-4" : "w-4")} />
                <span className={cn("block h-[2px] bg-white transition-all duration-300", menuOpen ? "w-6 -rotate-45 -translate-y-[7px]" : "w-5")} />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 95% 5%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 95% 5%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 95% 5%)" }}
            transition={{ duration: 0.5, ease: [0.83, 0, 0.17, 1] }}
            className="fixed inset-0 z-[9989] bg-base/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.button
                key={item.sectionId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                onClick={() => scrollTo(item.sectionId)}
                className="font-display font-bold text-3xl tracking-wide text-white/70 hover:text-electric-blue transition-colors"
              >
                <span className="text-electric-blue/40 text-base mr-2">0{i}</span>
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
