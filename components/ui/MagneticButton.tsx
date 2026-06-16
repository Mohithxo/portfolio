"use client";

import { useRef, ReactNode, MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  strength?: number;
}

export default function MagneticButton({
  children,
  className,
  onClick,
  href,
  variant = "primary",
  strength = 0.35,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const baseClass = cn(
    "relative inline-flex items-center justify-center px-8 py-3.5 rounded-full font-display font-semibold text-sm tracking-wide transition-all duration-200 select-none overflow-hidden",
    {
      "bg-gradient-to-r from-electric-blue to-violet text-white shadow-lg hover:shadow-electric-blue/30":
        variant === "primary",
      "border border-electric-blue/40 text-electric-blue hover:bg-electric-blue/10 backdrop-blur-sm":
        variant === "secondary",
      "text-white/70 hover:text-white": variant === "ghost",
    },
    className
  );

  const content = (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="inline-block"
    >
      {href ? (
        <a href={href} className={baseClass}>
          {children}
        </a>
      ) : (
        <button onClick={onClick} className={baseClass}>
          {children}
        </button>
      )}
    </motion.div>
  );

  return content;
}
