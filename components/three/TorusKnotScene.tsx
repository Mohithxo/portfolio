"use client";

import dynamic from "next/dynamic";
import { Component, ReactNode } from "react";

class ThreeErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? this.props.fallback : this.props.children;
  }
}

const TorusKnotSceneInner = dynamic(
  () => import("./TorusKnotSceneInner"),
  {
    ssr: false,
    loading: () => (
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 55% 45%, rgba(14,165,233,0.12) 0%, rgba(139,92,246,0.08) 50%, transparent 100%)",
        }}
      />
    ),
  }
);

const CSSFallback = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div
      className="w-64 h-64 rounded-full animate-pulse"
      style={{
        background:
          "radial-gradient(circle, rgba(14,165,233,0.2) 0%, rgba(139,92,246,0.1) 50%, transparent 100%)",
        boxShadow:
          "0 0 80px rgba(14,165,233,0.15), 0 0 160px rgba(139,92,246,0.08)",
        animation: "float 6s ease-in-out infinite",
      }}
    />
  </div>
);

export default function TorusKnotScene() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <ThreeErrorBoundary fallback={<CSSFallback />}>
        <TorusKnotSceneInner />
      </ThreeErrorBoundary>
    </div>
  );
}
