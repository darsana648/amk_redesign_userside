"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";

type B = { id: number; name: string; image?: string };

/** Brand logo strip with prev/next arrows when it overflows. */
export function BrandSlider({ brands, variant = "gallery" }: { brands: B[]; variant?: "gallery" | "compact" }) {
  const track = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const t = track.current;
    if (!t) return;
    const over = t.scrollWidth > t.clientWidth + 4;
    setCanPrev(t.scrollLeft > 4);
    setCanNext(over && t.scrollLeft + t.clientWidth < t.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  if (!brands.length) return <p className="text-sm text-ink-soft">No brands available yet.</p>;

  const scroll = (dir: number) => {
    const t = track.current;
    if (t) t.scrollBy({ left: dir * Math.max(200, t.clientWidth * 0.8), behavior: "smooth" });
  };

  const arrow = (dir: -1 | 1, show: boolean) => (
    <button
      type="button"
      onClick={() => scroll(dir)}
      aria-label={`${dir < 0 ? "Previous" : "Next"} brands`}
      className={`absolute top-1/2 z-10 h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink shadow-lift hover:text-accent ${dir < 0 ? "-left-3" : "-right-3"} ${show ? "flex" : "hidden"}`}
    >
      <Icon name={dir < 0 ? "chevron-left" : "chevron-right"} className="h-4 w-4" />
    </button>
  );

  return (
    <div className="relative">
      {arrow(-1, canPrev)}
      <div ref={track} onScroll={update} className="no-scrollbar flex gap-2.5 overflow-x-auto scroll-smooth py-1">
        {brands.map((b) => {
          const initials = b.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
          const logo = b.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={b.image} alt="" loading="lazy" className="h-full w-full object-contain" />
          ) : (
            <span className="text-[13px] font-bold text-navy">{initials}</span>
          );
          return variant === "compact" ? (
            <span
              key={b.id}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-white py-1 pl-1 pr-3 text-[13px] font-medium text-ink"
            >
              <span className="grid h-6 w-6 place-items-center overflow-hidden rounded-full bg-canvas p-0.5">{logo}</span>
              {b.name}
            </span>
          ) : (
            <span
              key={b.id}
              className="inline-flex w-36 shrink-0 flex-col items-center gap-2 rounded-xl border border-line bg-white px-3 py-3 text-center text-[13px] font-medium text-ink transition hover:border-accent"
            >
              <span className="grid h-12 w-full place-items-center overflow-hidden">{logo}</span>
              <span className="w-full truncate">{b.name}</span>
            </span>
          );
        })}
      </div>
      {arrow(1, canNext)}
    </div>
  );
}
