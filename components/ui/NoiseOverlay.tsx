"use client";

export default function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9997]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        opacity: 0.035,
        mixBlendMode: "overlay",
      }}
    />
  );
}
