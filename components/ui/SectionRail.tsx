"use client";

import { useEffect, useState } from "react";
import { scrollStore, SECTION_IDS } from "@/lib/scrollStore";
import { useLenis } from "@/components/providers/LenisProvider";

const ITEMS = [
  { id: "about", n: "01" },
  { id: "skills", n: "02" },
  { id: "experience", n: "03" },
  { id: "projects", n: "04" },
  { id: "contact", n: "05" },
];

/** Fixed left-edge index rail — numbers each section, highlights the active one. */
export default function SectionRail() {
  const lenis = useLenis();
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const id = setInterval(() => {
      setActive(SECTION_IDS[scrollStore.sectionIndex] ?? "hero");
    }, 150);
    return () => clearInterval(id);
  }, []);

  const go = (id: string) => {
    if (lenis) lenis.scrollTo(`#${id}`, { duration: 1.2 });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const onHero = active === "hero";

  return (
    <div
      className="hidden lg:flex fixed left-5 top-1/2 -translate-y-1/2 z-[9989] flex-col gap-5 transition-opacity duration-500"
      style={{ opacity: onHero ? 0 : 1, pointerEvents: onHero ? "none" : "auto" }}
    >
      {ITEMS.map((it) => {
        const on = active === it.id;
        return (
          <button
            key={it.id}
            onClick={() => go(it.id)}
            data-cursor="hover"
            className="group flex items-center gap-2.5"
            aria-label={`Go to section ${it.n}`}
          >
            <span
              className="font-display text-xs font-semibold tabular-nums transition-colors duration-300"
              style={{ color: on ? "#0ea5e9" : "rgba(255,255,255,0.28)" }}
            >
              {it.n}
            </span>
            <span
              className="h-[1.5px] rounded-full transition-all duration-300 group-hover:w-7"
              style={{
                width: on ? 26 : 10,
                background: on ? "#0ea5e9" : "rgba(255,255,255,0.22)",
                boxShadow: on ? "0 0 8px #0ea5e9" : "none",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
