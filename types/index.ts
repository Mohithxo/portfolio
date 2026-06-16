export interface Skill {
  name: string;
  category: "frontend" | "backend" | "database" | "mobile" | "tool";
  ring: "outer" | "inner";
  icon?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
  tech: string[];
  current?: boolean;
  type: "full-time" | "freelance" | "internship";
}

export interface Project {
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  github?: string;
  live?: string;
  color: string;
  accentColor: string;
  featured?: boolean;
  category: string;
}

export interface NavItem {
  label: string;
  href: string;
  sectionId: string;
}

export interface Certification {
  title: string;
  issuer: string;
  code: string;
  color: string;
}

export interface SocialLink {
  label: string;
  handle: string;
  href: string;
  color: string;
  icon: "github" | "linkedin" | "naukri" | "mail" | "whatsapp";
}

export interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  isClicking: boolean;
  isText: boolean;
}
