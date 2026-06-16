"use client";

import { useState, useRef, useCallback, useEffect, FormEvent, PointerEvent as ReactPointerEvent } from "react";
import { motion } from "framer-motion";
import { personalInfo, socialLinks } from "@/lib/data";
import { useInView } from "@/hooks/useInView";
import { clamp, mapRange } from "@/lib/utils";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

/* ── Brand icons (inline) ─────────────────────────────────────────── */
function SocialIcon({ icon, className }: { icon: string; className?: string }) {
  const common = { className, fill: "currentColor", viewBox: "0 0 24 24" } as const;
  switch (icon) {
    case "github":
      return (
        <svg {...common}><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0C17 4.6 18 4.9 18 4.9c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" /></svg>
      );
    case "linkedin":
      return (
        <svg {...common}><path d="M4.98 3.5a2.5 2.5 0 11-.02 5.001A2.5 2.5 0 014.98 3.5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.3c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9z" /></svg>
      );
    case "mail":
      return (
        <svg {...common}><path d="M2 5a2 2 0 012-2h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2 .4v.2l8 5 8-5v-.2H4zm16 2.3l-7.4 4.6a1 1 0 01-1.2 0L4 7.7V19h16V7.7z" /></svg>
      );
    case "whatsapp":
      return (
        <svg {...common}><path d="M12 2a10 10 0 00-8.6 15l-1 3.6 3.7-1A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-2.2.6.6-2.1-.2-.3A8 8 0 1112 20zm4.4-5.6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.8c-.1.2-.3.2-.5.1a6.6 6.6 0 01-1.9-1.2 7 7 0 01-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4.1-.3v-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 3.9 3.5.5.2 1 .3 1.3.4.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1z" /></svg>
      );
    case "naukri":
      return (
        <svg {...common}><path d="M3 7a2 2 0 012-2h3V4a2 2 0 012-2h4a2 2 0 012 2v1h3a2 2 0 012 2v3H3V7zm0 5h7v2h4v-2h7v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7zM10 4v1h4V4h-4z" /></svg>
      );
    default:
      return null;
  }
}

function EqualizerBars({ playing, color }: { playing: boolean; color: string }) {
  return (
    <div className="flex items-end gap-[3px] h-6">
      {[0.5, 0.8, 0.35, 0.95, 0.6, 0.75, 0.45, 0.85].map((base, i) => (
        <motion.span
          key={i}
          className="w-1 rounded-sm"
          style={{ background: color, boxShadow: `0 0 6px ${color}` }}
          animate={
            playing
              ? { height: [`${base * 30}%`, "100%", `${base * 50}%`, "80%"] }
              : { height: "18%" }
          }
          transition={
            playing
              ? { duration: 0.5 + (i % 3) * 0.18, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}

function Speaker({ playing, color }: { playing: boolean; color: string }) {
  return (
    <div className="relative aspect-square w-full max-w-[150px] mx-auto">
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: `2px solid ${color}`, boxShadow: `0 0 20px ${color}66, inset 0 0 20px ${color}33` }}
        animate={playing ? { scale: [1, 1.04, 1] } : { scale: 1 }}
        transition={{ duration: 0.6, repeat: playing ? Infinity : 0, ease: "easeInOut" }}
      />
      <div className="absolute inset-[12%] rounded-full" style={{ border: `1px solid ${color}55` }} />
      <motion.div
        className="absolute inset-[26%] rounded-full"
        style={{
          border: `1px solid ${color}99`,
          backgroundImage: `radial-gradient(${color}22 1px, transparent 1px)`,
          backgroundSize: "6px 6px",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: playing ? 4 : 16, repeat: Infinity, ease: "linear" }}
      />
      <div
        className="absolute inset-[42%] rounded-full"
        style={{ background: `radial-gradient(circle, ${color}, transparent 70%)`, boxShadow: `0 0 16px ${color}` }}
      />
    </div>
  );
}

export default function Contact() {
  const [sectionRef, inView] = useInView<HTMLElement>({ threshold: 0.15 });
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const knobRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const n = socialLinks.length;
  const current = socialLinks[index];

  // Message form + newsletter
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [news, setNews] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    window.open(
      `mailto:${personalInfo.email}?subject=${encodeURIComponent(`Portfolio message from ${form.name || "visitor"}`)}&body=${encodeURIComponent(body)}`
    );
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", message: "" });
  };

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!news) return;
    window.open(
      `mailto:${personalInfo.email}?subject=${encodeURIComponent("Newsletter signup")}&body=${encodeURIComponent(`Please add me to your updates: ${news}`)}`
    );
    setSubscribed(true);
    setNews("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  // Knob angle (-150°..150°) ↔ track index ↔ FM frequency.
  const [angle, setAngle] = useState(-150);
  const freq = mapRange(angle, -150, 150, 88.0, 108.0).toFixed(1);

  const selectIndex = useCallback(
    (i: number) => {
      const ni = (i + n) % n;
      setIndex(ni);
      setAngle(-150 + (ni / (n - 1)) * 300);
    },
    [n]
  );

  const open = useCallback(() => {
    setPlaying(true);
    window.open(current.href, "_blank", "noopener,noreferrer");
  }, [current]);

  // Draggable tuning knob
  const onKnobMove = useCallback(
    (clientX: number, clientY: number) => {
      const el = knobRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      let deg = (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI + 90;
      if (deg > 180) deg -= 360;
      deg = clamp(deg, -150, 150);
      setAngle(deg);
      const i = Math.round(((deg + 150) / 300) * (n - 1));
      setIndex(clamp(i, 0, n - 1));
    },
    [n]
  );

  useEffect(() => {
    const move = (e: globalThis.PointerEvent) => {
      if (draggingRef.current) onKnobMove(e.clientX, e.clientY);
    };
    const up = () => (draggingRef.current = false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [onKnobMove]);

  const onKnobDown = (e: ReactPointerEvent) => {
    draggingRef.current = true;
    onKnobMove(e.clientX, e.clientY);
  };

  const PINK = "#ff2d95";
  const PURPLE = "#b14aed";
  const CYAN = "#2de2e6";

  return (
    <section id="contact" ref={sectionRef} className="relative py-24 lg:py-36 overflow-hidden">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
          <SectionEyebrow index="05" label="Contact" color="#8b5cf6" />
          <h2 className="section-heading mt-3">Let&apos;s <span className="text-gradient">Connect</span></h2>
          <p className="text-white/40 mt-3 max-w-md mx-auto text-sm">
            Tune the dial. Hit play. Reach me on any frequency.
          </p>
        </motion.div>

        {/* ── Neon boombox ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Outer neon trace */}
          <div
            className="relative rounded-[28px] p-5 md:p-8"
            style={{
              background: "linear-gradient(160deg, rgba(20,10,30,0.85), rgba(8,8,16,0.9))",
              border: `2px solid ${PURPLE}`,
              boxShadow: `0 0 30px ${PURPLE}55, inset 0 0 40px rgba(177,74,237,0.08)`,
            }}
          >
            {/* Carry handle */}
            <div className="flex justify-center mb-4">
              <div className="h-3 w-40 rounded-t-xl" style={{ border: `2px solid ${PINK}`, borderBottom: "none", boxShadow: `0 0 14px ${PINK}88` }} />
            </div>

            {/* Top dial / frequency strip */}
            <div
              className="rounded-xl px-4 py-3 mb-5 flex items-center gap-4"
              style={{ border: `1.5px solid ${CYAN}`, boxShadow: `0 0 14px ${CYAN}44, inset 0 0 14px ${CYAN}11` }}
            >
              <div className="font-display tabular-nums text-2xl md:text-3xl font-bold tracking-wider" style={{ color: PINK, textShadow: `0 0 14px ${PINK}` }}>
                {freq}
                <span className="text-xs ml-1 text-white/40">MHz</span>
              </div>
              {/* dial ticks + needle */}
              <div className="relative flex-1 h-8 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-between">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <span key={i} className="w-px bg-white/15" style={{ height: i % 5 === 0 ? "100%" : "55%" }} />
                  ))}
                </div>
                <motion.div
                  className="absolute top-0 bottom-0 w-[2px]"
                  style={{ background: PINK, boxShadow: `0 0 10px ${PINK}`, left: `${((angle + 150) / 300) * 100}%` }}
                  animate={{ left: `${((angle + 150) / 300) * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>
              <EqualizerBars playing={playing} color={CYAN} />
            </div>

            {/* Body: speaker · cassette · speaker */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr_1fr] gap-5 items-center">
              <div className="hidden md:block"><Speaker playing={playing} color={PURPLE} /></div>

              {/* Cassette / display */}
              <div
                className="rounded-2xl p-5"
                style={{ border: `1.5px solid ${PINK}`, boxShadow: `0 0 16px ${PINK}33, inset 0 0 18px rgba(255,45,149,0.06)` }}
              >
                {/* now playing display */}
                <button
                  onClick={open}
                  data-cursor="hover"
                  data-cursor-label="Open"
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-3 mb-4 text-left transition-transform hover:scale-[1.02]"
                  style={{ border: `1px solid ${current.color}55`, background: `${current.color}0d`, boxShadow: `0 0 14px ${current.color}22` }}
                >
                  <span
                    className="flex items-center justify-center w-11 h-11 rounded-lg flex-shrink-0"
                    style={{ color: current.color, border: `1px solid ${current.color}55`, boxShadow: `0 0 12px ${current.color}44` }}
                  >
                    <SocialIcon icon={current.icon} className="w-6 h-6" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[9px] tracking-[0.3em] uppercase text-white/40">Now Playing</span>
                    <span className="block font-display font-bold text-white truncate">{current.label}</span>
                    <span className="block text-xs text-white/45 truncate">{current.handle}</span>
                  </span>
                </button>

                {/* two reels */}
                <div className="flex items-center justify-center gap-10 mb-4">
                  {[0, 1].map((r) => (
                    <motion.div
                      key={r}
                      className="relative w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ border: `2px solid ${CYAN}`, boxShadow: `0 0 10px ${CYAN}66` }}
                      animate={{ rotate: playing ? 360 : 0 }}
                      transition={{ duration: 2, repeat: playing ? Infinity : 0, ease: "linear" }}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ background: CYAN }} />
                      <div className="absolute w-6 h-[2px]" style={{ background: `${CYAN}66` }} />
                      <div className="absolute w-[2px] h-6" style={{ background: `${CYAN}66` }} />
                    </motion.div>
                  ))}
                </div>

                {/* transport controls */}
                <div className="flex items-center justify-center gap-5">
                  <button
                    onClick={() => selectIndex(index - 1)}
                    data-cursor="hover"
                    data-cursor-label="Prev"
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
                    style={{ border: `1px solid ${PURPLE}88`, boxShadow: `0 0 10px ${PURPLE}33` }}
                    aria-label="Previous"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M6 5h2v14H6zm3 7l9 7V5z" /></svg>
                  </button>
                  <button
                    onClick={() => (playing ? open() : open())}
                    onDoubleClick={() => setPlaying(false)}
                    data-cursor="hover"
                    data-cursor-label={playing ? "Open" : "Play"}
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white"
                    style={{ background: `linear-gradient(135deg, ${PINK}, ${PURPLE})`, boxShadow: `0 0 22px ${PINK}88` }}
                    aria-label="Play / Open"
                  >
                    {playing ? (
                      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M8 5h3v14H8zM13 5h3v14h-3z" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    )}
                  </button>
                  <button
                    onClick={() => selectIndex(index + 1)}
                    data-cursor="hover"
                    data-cursor-label="Next"
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
                    style={{ border: `1px solid ${PURPLE}88`, boxShadow: `0 0 10px ${PURPLE}33` }}
                    aria-label="Next"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M16 5h2v14h-2zM6 5l9 7-9 7z" /></svg>
                  </button>
                </div>
              </div>

              <div className="hidden md:block"><Speaker playing={playing} color={PURPLE} /></div>
            </div>

            {/* Knobs row — TUNE is draggable */}
            <div className="flex items-center justify-center gap-8 mt-6">
              {/* draggable tune knob */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  ref={knobRef}
                  onPointerDown={onKnobDown}
                  data-cursor="hover"
                  data-cursor-label="Tune"
                  className="relative w-14 h-14 rounded-full cursor-grab active:cursor-grabbing touch-none"
                  style={{ border: `2px solid ${PINK}`, boxShadow: `0 0 16px ${PINK}66, inset 0 0 12px ${PINK}22` }}
                >
                  <div
                    className="absolute left-1/2 top-1.5 w-[3px] h-4 rounded-full -translate-x-1/2 origin-bottom"
                    style={{ background: PINK, boxShadow: `0 0 8px ${PINK}`, transform: `translateX(-50%) rotate(${angle}deg)`, transformOrigin: "50% 26px" }}
                  />
                </div>
                <span className="text-[9px] tracking-[0.25em] text-white/40 uppercase">Tune</span>
              </div>

              {/* decorative knobs */}
              {[CYAN, PURPLE].map((c, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <motion.div
                    className="w-10 h-10 rounded-full"
                    style={{ border: `2px solid ${c}`, boxShadow: `0 0 12px ${c}55` }}
                    animate={{ rotate: playing ? 360 : 0 }}
                    transition={{ duration: 6 + i * 2, repeat: playing ? Infinity : 0, ease: "linear" }}
                  >
                    <div className="absolute left-1/2 top-1 w-[2px] h-3 -translate-x-1/2 rounded-full" style={{ background: c }} />
                  </motion.div>
                  <span className="text-[9px] tracking-[0.25em] text-white/40 uppercase">{i ? "Bass" : "Vol"}</span>
                </div>
              ))}
            </div>

            {/* bottom equalizer buttons (decor) */}
            <div className="flex justify-center gap-1.5 mt-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="w-5 h-2 rounded-sm"
                  style={{ background: i % 2 ? PINK : PURPLE }}
                  animate={playing ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.3 }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.08 }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Message · Newsletter · Details */}
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-5 mt-8 max-w-4xl mx-auto">
          {/* Send a message */}
          <motion.form
            onSubmit={handleSend}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative rounded-2xl p-6 glass overflow-hidden"
          >
            <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-electric-blue/60 to-transparent" />
            <h3 className="font-display font-bold text-white mb-1">Send a Message</h3>
            <p className="text-white/40 text-xs mb-4">Drop a line — it lands straight in my inbox.</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <input
                required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Your name"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-electric-blue/50 focus:bg-electric-blue/5 transition-all"
              />
              <input
                required type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="Your email"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-electric-blue/50 focus:bg-electric-blue/5 transition-all"
              />
            </div>
            <textarea
              required rows={3} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              placeholder="Your message"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-electric-blue/50 focus:bg-electric-blue/5 transition-all resize-none mb-3"
            />
            <button
              type="submit" data-cursor="hover" data-cursor-label="Send"
              className="relative w-full py-2.5 rounded-xl font-display font-semibold text-sm text-white overflow-hidden"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)", boxShadow: "0 0 22px rgba(14,165,233,0.35)" }}
            >
              {sent ? "✓ Sent — opening your mail client…" : "Send Message →"}
            </button>
          </motion.form>

          {/* Newsletter + details */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-5"
          >
            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="relative rounded-2xl p-5 glass overflow-hidden">
              <div className="absolute top-0 left-5 right-5 h-[1px] bg-gradient-to-r from-transparent via-violet/60 to-transparent" />
              <h3 className="font-display font-bold text-white text-sm mb-1">Newsletter</h3>
              <p className="text-white/40 text-xs mb-3">Occasional updates on what I&apos;m building. No spam.</p>
              <div className="flex gap-2">
                <input
                  required type="email" value={news} onChange={(e) => setNews(e.target.value)}
                  placeholder="you@email.com"
                  className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-violet/50 transition-all"
                />
                <button
                  type="submit" data-cursor="hover" data-cursor-label="Join"
                  className="px-4 py-2 rounded-xl text-sm font-display font-semibold text-white whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}
                >
                  {subscribed ? "✓ Joined" : "Subscribe"}
                </button>
              </div>
            </form>

            {/* Details */}
            <div className="rounded-2xl p-5 glass space-y-3">
              {[
                { k: "Email", v: personalInfo.email },
                { k: "Location", v: personalInfo.location },
                { k: "Availability", v: "Open to full-time & freelance" },
                { k: "Response", v: "Usually within 24 hours" },
              ].map((d) => (
                <div key={d.k} className="flex items-start justify-between gap-4 text-sm">
                  <span className="text-white/30 text-[10px] font-display tracking-[0.2em] uppercase pt-0.5">{d.k}</span>
                  <span className="text-white/70 text-right">{d.v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick-link chips (fallback / direct) */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {socialLinks.map((s, i) => (
            <button
              key={s.label}
              onClick={() => { selectIndex(i); window.open(s.href, "_blank", "noopener,noreferrer"); }}
              data-cursor="hover"
              data-cursor-label="Open"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-display font-semibold transition-all hover:scale-105"
              style={{ border: `1px solid ${s.color === "#ffffff" ? "rgba(255,255,255,0.25)" : s.color + "66"}`, color: s.color === "#ffffff" ? "#fff" : s.color }}
            >
              <SocialIcon icon={s.icon} className="w-4 h-4" />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-24 text-center text-white/20 text-xs font-display tracking-widest">
        <div className="text-gradient font-semibold text-sm mb-1">Mohith Raagesh B</div>
        <div>Built with Next.js · Framer Motion · Canvas · GSAP</div>
        <div className="mt-1">© 2025 · {personalInfo.location}</div>
      </div>
    </section>
  );
}
