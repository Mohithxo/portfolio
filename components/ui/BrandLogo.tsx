"use client";

import { useId, useState, useEffect } from "react";

/**
 * Brand mark — a front-facing head split down the centre: an organic human
 * half (brow, eye, nose, lips) and an AI half rendered as PCB circuit traces
 * with nodes. Represents directing AI under human supervision.
 */

const HEAD =
  "M120 14 C78 14 46 44 44 92 C43 118 49 146 58 172 C67 197 83 219 106 231 C110 233 115 235 120 236 C125 235 130 233 134 231 C157 219 173 197 182 172 C191 146 197 118 196 92 C194 44 162 14 120 14 Z";
const NECK = "M104 233 L101 274 M136 231 L139 274";
const DIVIDE = "M120 20 V235";
const BROW = "M58 96 Q76 88 95 95";
const EYE = "M60 110 Q78 100 96 110 Q78 120 60 110 Z";
const NOSE = "M112 100 L106 152 Q110 160 99 157 M99 157 Q96 153 99 149";
const LIPS = "M85 180 Q104 188 117 179 M90 186 Q104 191 117 184";
const TRACES =
  "M120 32 H134 M120 46 H142 V38 M120 62 H158 M146 62 V52 M120 80 H172 M120 98 H150 V88 H170 M120 116 H182 M120 134 H158 M158 134 V122 M120 152 H184 M120 170 H162 M120 188 H146 M120 204 H138";

const NODE_CIRCLES: [number, number][] = [
  [134, 32], [158, 62], [146, 52], [172, 80], [182, 116],
  [158, 122], [184, 152], [162, 170], [146, 188], [138, 204],
];
const NODE_SQUARES: [number, number][] = [[142, 38], [170, 88]];

export default function BrandLogo({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const ai = `ai-${uid}`;
  const clip = `clip-${uid}`;
  const human = "rgba(255,255,255,0.92)";

  // Use a real logo image only if /public/logo.png actually loads — otherwise
  // render the built-in SVG mark (no broken-image flicker, no alt text).
  const [imgOk, setImgOk] = useState(false);
  useEffect(() => {
    let active = true;
    const im = new window.Image();
    im.onload = () => { if (active) setImgOk(true); };
    im.src = "/logo.png";
    return () => { active = false; };
  }, []);

  if (imgOk) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/logo.png"
        alt="Mohith"
        className={className}
        // Source art is black line-work on a white background. invert(1) flips
        // it to white lines on black, then mix-blend "screen" drops the black so
        // only the glowing line-art shows on the dark UI (no white box).
        style={{
          width: size,
          height: "auto",
          objectFit: "contain",
          filter: "invert(1) brightness(1.1) contrast(1.05)",
          mixBlendMode: "screen",
        }}
      />
    );
  }

  return (
    <svg
      width={size}
      height={(size * 290) / 240}
      viewBox="0 0 240 290"
      fill="none"
      className={className}
      role="img"
      aria-label="Mohith — human-supervised AI"
    >
      <defs>
        <linearGradient id={ai} x1="120" y1="20" x2="200" y2="240" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0ea5e9" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
        <clipPath id={clip}>
          <path d={HEAD} />
        </clipPath>
      </defs>

      {/* Head + neck */}
      <path d={HEAD} stroke={human} strokeWidth="3.4" strokeLinejoin="round" />
      <path d={NECK} stroke={human} strokeWidth="3" strokeLinecap="round" />

      {/* Human features (left) */}
      <g stroke={human} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d={BROW} />
        <path d={EYE} />
        <path d={NOSE} />
        <path d={LIPS} />
      </g>
      <circle cx="78" cy="110" r="6.5" stroke={human} strokeWidth="2.4" fill="none" />
      <circle cx="78" cy="110" r="2.6" fill={human} />

      {/* AI circuit (right, clipped to head) */}
      <g clipPath={`url(#${clip})`}>
        <path d={DIVIDE} stroke={`url(#${ai})`} strokeWidth="2.4" strokeLinecap="round" />
        <path d={TRACES} stroke={`url(#${ai})`} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <g fill="#06b6d4">
          {NODE_CIRCLES.map(([x, y]) => (
            <circle key={`c-${x}-${y}`} cx={x} cy={y} r="3.2" />
          ))}
        </g>
        <g fill={`url(#${ai})`}>
          {NODE_SQUARES.map(([x, y]) => (
            <rect key={`s-${x}-${y}`} x={x - 3} y={y - 3} width="6" height="6" rx="1" />
          ))}
        </g>
      </g>
    </svg>
  );
}
