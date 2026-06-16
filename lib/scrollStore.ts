// Module-level scroll signal. Written once per Lenis scroll tick / RAF fallback,
// read every animation frame by the background canvas, HUD, skew wrapper, and cursor.
// Intentionally NOT React state — keeps the hot path free of re-renders.

import { clamp } from "@/lib/utils";

export type RGB = [number, number, number];

// Section order on the page → its accent color. Background interpolates between
// consecutive entries as you scroll, so the whole scene morphs hue by hue.
export const SECTION_IDS = [
  "hero",
  "about",
  "skills",
  "experience",
  "projects",
  "contact",
] as const;

export const SECTION_THEMES: RGB[] = [
  [14, 165, 233], // hero       — electric blue
  [139, 92, 246], // about      — violet
  [6, 182, 212], // skills      — cyan
  [245, 158, 11], // experience — gold
  [14, 165, 233], // projects   — electric blue
  [139, 92, 246], // contact    — violet
];

export const SECTION_LABELS = [
  "HOME",
  "ABOUT",
  "SKILLS",
  "EXPERIENCE",
  "PROJECTS",
  "CONTACT",
];

interface ScrollState {
  progress: number; // 0..1 across the whole page
  rawScroll: number; // px
  velocity: number; // smoothed px/frame, signed
  sectionIndex: number; // index into SECTION_THEMES of the dominant section
  blend: number; // 0..1 blend toward the next section's theme
  themeColor: RGB; // interpolated current accent
  nextColor: RGB; // the section we are heading toward
  mouseX: number;
  mouseY: number;
  ready: boolean;
}

export const scrollStore: ScrollState = {
  progress: 0,
  rawScroll: 0,
  velocity: 0,
  sectionIndex: 0,
  blend: 0,
  themeColor: [...SECTION_THEMES[0]] as RGB,
  nextColor: [...SECTION_THEMES[1]] as RGB,
  mouseX: -9999,
  mouseY: -9999,
  ready: false,
};

export function lerpColor(a: RGB, b: RGB, t: number): RGB {
  const k = clamp(t, 0, 1);
  return [
    a[0] + (b[0] - a[0]) * k,
    a[1] + (b[1] - a[1]) * k,
    a[2] + (b[2] - a[2]) * k,
  ];
}

export function rgbStr([r, g, b]: RGB, alpha = 1): string {
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
}

let lastScroll = 0;

// Recompute the whole signal from the current scroll position.
// Driven from LenisProvider's scroll callback (and a rAF fallback there).
export function updateScroll(scrollY?: number): void {
  if (typeof window === "undefined") return;

  const y = scrollY ?? window.scrollY;
  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? clamp(y / docHeight, 0, 1) : 0;

  // Smooth velocity so the skew/energy feels weighted, not jittery.
  const instant = y - lastScroll;
  lastScroll = y;
  scrollStore.velocity += (instant - scrollStore.velocity) * 0.25;
  scrollStore.rawScroll = y;
  scrollStore.progress = progress;

  // Find which section the viewport center currently sits in.
  const viewCenter = y + window.innerHeight * 0.5;
  let idx = 0;
  let localBlend = 0;
  for (let i = 0; i < SECTION_IDS.length; i++) {
    const el = document.getElementById(SECTION_IDS[i]);
    if (!el) continue;
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    if (viewCenter >= top && viewCenter < bottom) {
      idx = i;
      localBlend = (viewCenter - top) / Math.max(el.offsetHeight, 1);
      break;
    }
    if (viewCenter >= bottom) idx = i; // past this one, keep advancing
  }

  scrollStore.sectionIndex = idx;
  scrollStore.blend = localBlend;

  const current = SECTION_THEMES[idx];
  const next = SECTION_THEMES[Math.min(idx + 1, SECTION_THEMES.length - 1)];
  scrollStore.themeColor = lerpColor(current, next, localBlend);
  scrollStore.nextColor = next;
  scrollStore.ready = true;
}

export function updateMouse(x: number, y: number): void {
  scrollStore.mouseX = x;
  scrollStore.mouseY = y;
}
