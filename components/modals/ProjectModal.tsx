"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9980] flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-base/80 backdrop-blur-xl" />

          {/* Modal */}
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 40 }}
            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative z-10 max-w-2xl w-full rounded-3xl p-8 glass overflow-hidden"
            style={{ border: `1px solid ${project.color}30` }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient accent top */}
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
              style={{ background: `linear-gradient(90deg, ${project.color}, ${project.accentColor})` }}
            />

            {/* Category badge */}
            <div className="flex items-center justify-between mb-6">
              <span
                className="px-3 py-1 rounded-full text-xs font-display font-semibold"
                style={{ background: `${project.color}15`, color: project.color, border: `1px solid ${project.color}30` }}
              >
                {project.category}
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                ✕
              </button>
            </div>

            <h2 className="font-display font-bold text-3xl text-white mb-3">{project.title}</h2>
            <p className="text-white/60 leading-relaxed mb-6">{project.longDescription}</p>

            {/* Tech stack */}
            <div className="mb-8">
              <div className="text-white/30 text-xs font-display font-semibold tracking-widest uppercase mb-3">Tech Stack</div>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className="px-3 py-1.5 rounded-full text-xs font-display font-semibold"
                    style={{ background: `${project.color}10`, color: project.color, border: `1px solid ${project.color}25` }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-3">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl text-center text-sm font-display font-semibold transition-all hover:opacity-80"
                  style={{ background: `${project.color}15`, color: project.color, border: `1px solid ${project.color}30` }}>
                  GitHub →
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl text-center text-sm font-display font-semibold text-white transition-all hover:opacity-80"
                  style={{ background: `linear-gradient(135deg, ${project.color}, ${project.accentColor})` }}>
                  Live Demo →
                </a>
              )}
              {!project.github && !project.live && (
                <div className="text-white/30 text-sm">Private project — contact for details.</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
