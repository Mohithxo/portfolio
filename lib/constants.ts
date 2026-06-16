import type { NavItem } from "@/types";

export const COLORS = {
  base: "#0a0a0f",
  blue: "#0ea5e9",
  violet: "#8b5cf6",
  cyan: "#06b6d4",
  gold: "#f59e0b",
} as const;

export const NAV_ITEMS: NavItem[] = [
  { label: "Hero", href: "#hero", sectionId: "hero" },
  { label: "About", href: "#about", sectionId: "about" },
  { label: "Skills", href: "#skills", sectionId: "skills" },
  { label: "Experience", href: "#experience", sectionId: "experience" },
  { label: "Projects", href: "#projects", sectionId: "projects" },
  { label: "Contact", href: "#contact", sectionId: "contact" },
];

export const HERO_ROLES = [
  "Full Stack Developer",
  "Backend Engineer",
  "Mobile Developer",
  "Builder of Things",
];

export const EASTER_EGG_SEQUENCE = "MOHITH";

export const ANIMATION = {
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.8,
    verySlow: 1.2,
  },
  ease: {
    smooth: [0.25, 0.46, 0.45, 0.94],
    spring: [0.34, 1.56, 0.64, 1],
    inOut: [0.83, 0, 0.17, 1],
  },
} as const;
