import type { Skill, Experience, Project, Certification, SocialLink } from "@/types";

export const personalInfo = {
  name: "Mohith Raagesh B",
  firstName: "Mohith",
  lastName: "Raagesh B",
  role: "Full Stack Developer",
  email: "mohithbalakumar12@gmail.com",
  phone: "+91 94876 04349",
  whatsapp: "919487604349",
  linkedin: "https://www.linkedin.com/in/bmohithraagesh21102003",
  github: "https://github.com/Mohithxo",
  naukri: "https://www.naukri.com/mnjuser/profile?id=&altresid",
  location: "Bengaluru, India",
  bio: "Full Stack Developer with 1 year professional experience and 3+ years freelance, building web and mobile applications. Graduated B.Tech CSE from VIT Chennai in May 2025.",
  longBio:
    "I craft high-performance web and mobile applications using modern stacks. From real-time Socket.IO systems to AI-powered mobile apps, I focus on clean architecture and exceptional user experience. Currently building backend infrastructure at MotoDoctor.",
};

export const certifications: Certification[] = [
  {
    title: "Python 3.4.3 Training Certificate",
    issuer: "IIT Bombay",
    code: "PY-343",
    color: "#0ea5e9",
  },
  {
    title: "C Training Certificate",
    issuer: "IIT Bombay",
    code: "C-LANG",
    color: "#8b5cf6",
  },
  {
    title: "Advanced C++ Training Certificate",
    issuer: "IIT Bombay",
    code: "CPP-ADV",
    color: "#06b6d4",
  },
];

// Social "tracks" for the Contact boombox player.
export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    handle: "@Mohithxo",
    href: personalInfo.github,
    color: "#ffffff",
    icon: "github",
  },
  {
    label: "LinkedIn",
    handle: "in/bmohithraagesh21102003",
    href: personalInfo.linkedin,
    color: "#0a66c2",
    icon: "linkedin",
  },
  {
    label: "Naukri",
    handle: "Mohith Raagesh B",
    href: personalInfo.naukri,
    color: "#4a90e2",
    icon: "naukri",
  },
  {
    label: "Email",
    handle: personalInfo.email,
    href: `mailto:${personalInfo.email}`,
    color: "#f59e0b",
    icon: "mail",
  },
  {
    label: "WhatsApp",
    handle: personalInfo.phone,
    href: `https://wa.me/${personalInfo.whatsapp}`,
    color: "#25d366",
    icon: "whatsapp",
  },
];

export const skills: Skill[] = [
  { name: "JavaScript", category: "frontend", ring: "outer" },
  { name: "TypeScript", category: "frontend", ring: "outer" },
  { name: "React.js", category: "frontend", ring: "outer" },
  { name: "Next.js", category: "frontend", ring: "outer" },
  { name: "Node.js", category: "backend", ring: "outer" },
  { name: "Express.js", category: "backend", ring: "outer" },
  { name: "Flutter", category: "mobile", ring: "outer" },
  { name: "MongoDB", category: "database", ring: "outer" },
  { name: "MySQL", category: "database", ring: "inner" },
  { name: "Redis", category: "database", ring: "inner" },
  { name: "Socket.IO", category: "backend", ring: "inner" },
  { name: "REST APIs", category: "backend", ring: "inner" },
  { name: "JWT", category: "tool", ring: "inner" },
  { name: "Git", category: "tool", ring: "inner" },
  { name: "Python", category: "backend", ring: "inner" },
  { name: "SQL", category: "database", ring: "inner" },
];

export const allSkillsMarquee = [
  "JavaScript",
  "TypeScript",
  "React.js",
  "Next.js",
  "Node.js",
  "Express.js",
  "Flutter",
  "MongoDB",
  "MySQL",
  "Redis",
  "Socket.IO",
  "WebSockets",
  "REST APIs",
  "JWT",
  "Git",
  "Postman",
  "Python",
  "SQL",
];

export const experiences: Experience[] = [
  {
    company: "MotoDoctor Private Limited",
    role: "Backend Developer",
    period: "Jul 2025 – Present",
    description: [
      "Building and scaling backend infrastructure for automotive service platform",
      "Designing RESTful APIs and real-time communication systems",
      "Optimizing database performance with MongoDB and Redis caching",
    ],
    tech: ["Node.js", "Express.js", "MongoDB", "Redis", "Socket.IO"],
    current: true,
    type: "full-time",
  },
  {
    company: "Freelance",
    role: "Full Stack Developer",
    period: "2022 – 2025",
    description: [
      "Delivered 20+ web and mobile applications for clients globally",
      "Built full-stack solutions from concept to deployment",
      "Specialized in React, Next.js, Flutter, and Node.js ecosystems",
    ],
    tech: ["React.js", "Next.js", "Node.js", "Flutter", "MongoDB", "MySQL"],
    current: false,
    type: "freelance",
  },
  {
    company: "Mandy Technologies",
    role: "Software Development Intern",
    period: "Oct – Dec 2023",
    description: [
      "Contributed to full-stack feature development and bug resolution",
      "Worked on API integration and frontend components",
      "Participated in agile sprints and code reviews",
    ],
    tech: ["React.js", "Node.js", "Express.js", "MySQL"],
    current: false,
    type: "internship",
  },
];

export const projects: Project[] = [
  {
    title: "Tails",
    description: "Feature-rich cross-platform mobile app with real-time tracking, live chat, bookings, and integrated payments.",
    longDescription:
      "A complex, full-featured mobile platform packing real-time location tracking, in-app chat, scheduling and bookings, and end-to-end payment integration into one fluid experience. Built with Flutter for cross-platform mobile, a Node.js + Express backend, and Socket.IO powering live updates.",
    tech: ["Flutter", "Node.js", "MongoDB", "Socket.IO", "Express.js"],
    color: "#0ea5e9",
    accentColor: "#06b6d4",
    featured: true,
    category: "Mobile App",
  },
  {
    title: "ESpot",
    description: "EV Route Planning Web App with real-time charging station discovery and route optimization.",
    longDescription:
      "An intelligent EV route planner that integrates Mapbox for navigation, real-time charging station data, and range estimation. Features interactive map UI, saved routes, and station availability tracking.",
    tech: ["Next.js", "React.js", "Node.js", "Mapbox", "MongoDB"],
    color: "#8b5cf6",
    accentColor: "#a78bfa",
    featured: true,
    category: "Web App",
  },
  {
    title: "XAI for Smart Agriculture",
    description: "Explainable AI framework for precision agriculture using IoT sensor data and XGBoost analytics.",
    longDescription:
      "An explainable AI system that analyzes IoT sensor data from agricultural fields to provide actionable crop health insights. Uses XGBoost for prediction and SHAP values for explainability, helping farmers make data-driven decisions.",
    tech: ["Python", "XGBoost", "IoT Analytics", "SHAP", "Pandas"],
    color: "#f59e0b",
    accentColor: "#fbbf24",
    featured: false,
    category: "AI / ML",
  },
  {
    title: "Bipedal Robot Navigation",
    description: "Liquid Neural Networks for autonomous bipedal robot navigation using Deep Reinforcement Learning.",
    longDescription:
      "Research project implementing Liquid Neural Networks (LNNs) for adaptive bipedal locomotion. Uses ROS2 for robot middleware, Deep RL (PPO) for policy training, and custom reward shaping for stable gait generation.",
    tech: ["Python", "ROS2", "Deep RL", "PyTorch", "Gymnasium"],
    color: "#06b6d4",
    accentColor: "#22d3ee",
    featured: false,
    category: "Robotics / AI",
  },
];

export const stats = [
  { label: "Years Professional", value: 1, suffix: "+" },
  { label: "Years Freelance", value: 3, suffix: "+" },
  { label: "Projects Built", value: 20, suffix: "+" },
  { label: "Technologies", value: 15, suffix: "+" },
];
