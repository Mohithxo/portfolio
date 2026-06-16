"use client";

import { useState, useRef, MouseEvent } from "react";
import { motion } from "framer-motion";
import { projects } from "@/lib/data";
import { Project } from "@/types";
import { useInView } from "@/hooks/useInView";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import ProjectModal from "@/components/modals/ProjectModal";

function ProjectCard({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const rotateRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !spotlightRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const targetX = y * -10;
    const targetY = x * 10;
    cancelAnimationFrame(rafRef.current);
    const animate = () => {
      rotateRef.current.x += (targetX - rotateRef.current.x) * 0.15;
      rotateRef.current.y += (targetY - rotateRef.current.y) * 0.15;
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(900px) rotateX(${rotateRef.current.x}deg) rotateY(${rotateRef.current.y}deg)`;
      }
    };
    animate();
    spotlightRef.current.style.background = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, ${project.color}14 0%, transparent 55%)`;
  };

  const onMouseLeave = () => {
    const ease = () => {
      rotateRef.current.x *= 0.85;
      rotateRef.current.y *= 0.85;
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(900px) rotateX(${rotateRef.current.x}deg) rotateY(${rotateRef.current.y}deg)`;
      }
      if (Math.abs(rotateRef.current.x) > 0.05 || Math.abs(rotateRef.current.y) > 0.05) {
        rafRef.current = requestAnimationFrame(ease);
      }
    };
    rafRef.current = requestAnimationFrame(ease);
    if (spotlightRef.current) spotlightRef.current.style.background = "none";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group cursor-pointer"
      onClick={onClick}
      data-cursor="hover"
      data-cursor-label="Open"
    >
      <div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onMouseEnter={() => {
          if (sheenRef.current) {
            sheenRef.current.classList.remove("sweeping");
            void sheenRef.current.offsetWidth;
            sheenRef.current.classList.add("sweeping");
          }
        }}
        className="relative rounded-2xl overflow-hidden h-full"
        style={{
          background: "rgba(255,255,255,0.025)",
          backdropFilter: "blur(16px)",
          border: `1px solid ${project.color}22`,
          willChange: "transform",
        }}
      >
        {/* ── Visual header ── */}
        <div className="relative h-32 overflow-hidden" style={{ background: `linear-gradient(135deg, ${project.color}26, ${project.accentColor}14)` }}>
          {/* circuit / dot pattern */}
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `radial-gradient(${project.color}55 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
              maskImage: "linear-gradient(120deg, black, transparent 80%)",
              WebkitMaskImage: "linear-gradient(120deg, black, transparent 80%)",
            }}
          />
          {/* big outlined index */}
          <span
            className="absolute -bottom-4 right-3 font-display font-bold leading-none select-none"
            style={{ fontSize: "5.5rem", color: "transparent", WebkitTextStroke: `1.5px ${project.color}40` }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          {/* category tag */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-display font-bold tracking-[0.15em] uppercase"
              style={{ background: `${project.color}1f`, color: project.color, border: `1px solid ${project.color}44` }}>
              {project.category}
            </span>
            {project.featured && (
              <span className="px-2 py-1 rounded-full text-[9px] font-display font-bold tracking-wider uppercase text-gold border border-gold/40 bg-gold/10">
                Featured
              </span>
            )}
          </div>
          {/* glowing orb / icon */}
          <div className="absolute bottom-4 left-4 w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${project.color}40, ${project.accentColor}20)`, border: `1px solid ${project.color}40`, boxShadow: `0 0 18px ${project.color}33` }}>
            <div className="w-4 h-4 rounded-full" style={{ background: `linear-gradient(135deg, ${project.color}, ${project.accentColor})`, boxShadow: `0 0 10px ${project.color}` }} />
          </div>
          {/* bottom hairline */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${project.color}66, transparent)` }} />
        </div>

        {/* spotlight + sheen */}
        <div ref={spotlightRef} className="absolute inset-0 pointer-events-none" />
        <div ref={sheenRef} className="holo-sheen" />

        {/* ── Body ── */}
        <div className="relative p-6">
          <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-gradient transition-colors">{project.title}</h3>
          <p className="text-white/50 text-sm leading-relaxed mb-5 line-clamp-2">{project.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tech.slice(0, 4).map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-full text-xs font-display"
                style={{ background: `${project.color}10`, color: project.color, border: `1px solid ${project.color}20` }}>
                {t}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-display text-white/30">+{project.tech.length - 4}</span>
            )}
          </div>

          {/* footer CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <span className="text-xs font-display font-semibold tracking-wide text-white/60 group-hover:text-white transition-colors">
              View case study
            </span>
            <span className="flex items-center justify-center w-8 h-8 rounded-full transition-transform group-hover:translate-x-1"
              style={{ background: `${project.color}14`, color: project.color, border: `1px solid ${project.color}33` }}>
              →
            </span>
          </div>
        </div>

        {/* HUD corner brackets on hover */}
        <span className="absolute top-3 left-3 w-4 h-4 border-t border-l rounded-tl-sm opacity-0 group-hover:opacity-100 transition-opacity" style={{ borderColor: `${project.color}99` }} />
        <span className="absolute bottom-3 right-3 w-4 h-4 border-b border-r rounded-br-sm opacity-0 group-hover:opacity-100 transition-opacity" style={{ borderColor: `${project.color}99` }} />
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sectionRef, inView] = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section id="projects" ref={sectionRef} className="relative py-24 lg:py-36 overflow-hidden">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <SectionEyebrow index="04" label="Projects" color="#f59e0b" />
          <h2 className="section-heading mt-3">Things I&apos;ve <span className="text-gradient">Built</span></h2>
          <p className="text-white/40 mt-3 max-w-md mx-auto text-sm">Selected work — click any card to dive into the case study.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} onClick={() => setSelectedProject(project)} />
          ))}
        </div>
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
