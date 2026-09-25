"use client";

import { useState } from "react";

/** Main image + thumbnail strip (click a thumbnail to show it). */
export function ProductGallery({ name, image, gallery, badges }: { name: string; image: string; gallery: string[]; badges: React.ReactNode }) {
  const [main, setMain] = useState(image);
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-xl border border-line bg-white">
        <div className="absolute left-3 top-3 z-10 flex gap-1">{badges}</div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={main} alt={name} className="h-full w-full object-contain p-6" />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2.5">
        {gallery.slice(0, 4).map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            aria-label={`Show image ${i + 1}`}
            onClick={() => {
              setMain(src);
              setActive(i);
            }}
            className={`aspect-square overflow-hidden rounded-lg border-2 ${i === active ? "border-accent" : "border-line"} bg-white p-1.5 hover:border-accent`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" className="h-full w-full object-contain" />
          </button>
        ))}
      </div>
    </div>
  );
}
