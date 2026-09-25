"use client";

/* Home carousel. Staff slides (GET /hero/) play first, then the built-in
   HERO_SLIDES (lib/site.ts). The markup mirrors the previous build exactly,
   because the phone "white hero" styles in globals.css target it. */
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { HERO_SLIDES, type HeroSlide } from "@/lib/site";
import type { HeroBanner } from "@/lib/types";
import { img } from "@/lib/utils";

const SLIDE_MS = 4500;

/* A staff slide with neither a link nor a button label is treated as an
   unfinished draft and skipped. When a staff slide has the same headline as a
   built-in slide, the staff text and link are kept but the built-in photo is
   used, and the built-in duplicate is dropped. */
function buildSlides(staff: HeroBanner[]): HeroSlide[] {
  const key = (s: { title: string }) => s.title.trim().toLowerCase();
  const builtInByTitle = new Map(HERO_SLIDES.map((s) => [key(s), s]));
  const ready: HeroSlide[] = staff
    .filter((s) => (s.link || s.cta_label) && s.title)
    .map((s) => {
      const twin = builtInByTitle.get(key(s));
      return twin ? { ...s, image: twin.image, tab: twin.tab, eyebrow: s.eyebrow || twin.eyebrow } : s;
    });
  const seen = new Set(ready.map(key));
  return [...ready, ...HERO_SLIDES.filter((s) => !seen.has(key(s)))];
}
const tabLabel = (s: HeroSlide) => s.tab || s.eyebrow || s.title.split(/\s+/).slice(0, 3).join(" ");
const pad = (i: number) => String(i + 1).padStart(2, "0");

export function HeroCarousel({ staffSlides }: { staffSlides: HeroBanner[] }) {
  const [slides] = useState(() => buildSlides(staffSlides));
  const n = slides.length;
  const [index, setIndex] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const tabRef = useRef<HTMLButtonElement>(null);
  const x0 = useRef<number | null>(null);

  const go = useCallback((i: number) => setIndex(((i % n) + n) % n), [n]);

  // Phones hide the tabs (whose progress bar drives autoplay), so a timer takes over there.
  useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => {
      if (!tabRef.current?.offsetParent && !rootRef.current?.matches(":hover")) setIndex((i) => (i + 1) % n);
    }, SLIDE_MS);
    return () => clearInterval(t);
  }, [n]);

  const s = slides[index];

  return (
    <article
      id="hero-carousel"
      ref={rootRef}
      tabIndex={-1}
      aria-roledescription="carousel"
      aria-label="Featured"
      style={{ ["--slide-ms" as string]: `${SLIDE_MS}ms` }}
      className="relative isolate flex h-[500px] min-w-0 flex-col overflow-hidden rounded-xl bg-navy text-white outline-none sm:h-[460px] lg:h-[470px]"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
      onTouchStart={(e) => (x0.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (x0.current === null) return;
        const dx = e.changedTouches[0].clientX - x0.current;
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
        x0.current = null;
      }}
    >
      {slides.map((sl, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${sl.title}-${i}`}
          src={img(sl.image, 1600)}
          alt=""
          aria-hidden="true"
          {...(i === 0 ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
          className={`hero-img absolute inset-0 h-full w-full object-cover ${i === index ? "is-active" : ""}`}
        />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,13,31,.94)_0%,rgba(6,13,31,.82)_38%,rgba(10,21,48,.35)_72%,rgba(10,21,48,.05)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#060d1f]/85 to-transparent" />

      {n > 1 && (
        <div className="absolute right-4 top-4 z-10 flex items-center gap-1 sm:right-6 sm:top-6">
          <span className="mr-2 font-mono text-[13px] text-white/80">
            <b className="text-white">{pad(index)}</b> / {pad(n - 1)}
          </span>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="grid h-9 w-9 place-items-center border border-white/30 bg-white/5 text-white backdrop-blur transition hover:border-accent hover:bg-accent hover:text-white"
          >
            <Icon name="chevron-left" className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="grid h-9 w-9 place-items-center border border-white/30 bg-white/5 text-white backdrop-blur transition hover:border-accent hover:bg-accent hover:text-white"
          >
            <Icon name="chevron-right" className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="relative flex flex-1 flex-col">
        <div data-copy className="flex min-h-0 max-w-[620px] flex-1 flex-col justify-center px-6 pb-6 pt-14 sm:px-10 lg:px-12" aria-live="polite">
          <div key={index} className="fade-up">
            <p className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.14em] text-[#ff5c6c]">
              <span className="h-[2px] w-8 bg-accent" />
              {s.eyebrow || "AMK Industrial Trading"}
            </p>
            <h1 className="mt-3 line-clamp-3 text-[26px] font-extrabold leading-[1.12] tracking-tight text-white sm:text-[36px] lg:text-[40px]">{s.title}</h1>
            {s.subtitle && (
              <p className="mt-3 line-clamp-4 max-w-[540px] text-[15px] leading-relaxed text-white/80 sm:line-clamp-3 sm:text-[16px]">{s.subtitle}</p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={s.link || "/shop"} className="btn btn-accent btn-lg">
                {s.cta_label || "Shop Now"} <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
              <Link href="/contact#rfq" className="btn btn-ghost-light btn-lg">
                Request a Quote
              </Link>
            </div>
          </div>
        </div>

        {n > 1 && (
          <>
            <div className="hidden border-t border-white/15 sm:flex" role="tablist" aria-label="Choose slide">
              {slides.map((sl, i) => {
                const on = i === index;
                return (
                  <button
                    key={`${sl.title}-${i}`}
                    ref={i === 0 ? tabRef : undefined}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-label={`Slide ${i + 1}: ${tabLabel(sl)}`}
                    onClick={() => go(i)}
                    className={`hero-tab relative min-w-0 flex-1 border-r border-white/10 px-3 py-3.5 text-left last:border-r-0 hover:bg-white/5 xl:px-4 ${on ? "text-white" : "text-white/60"}`}
                  >
                    {/* Autoplay: the active bar's CSS animation ends → next slide (hover pauses it). */}
                    <span
                      key={on ? `run-${index}` : "idle"}
                      className={`hero-bar absolute left-0 top-[-1px] h-[3px] bg-accent ${on ? "is-running" : ""}`}
                      onAnimationEnd={(e) => {
                        if (on && (e.currentTarget as HTMLElement).offsetParent) go(index + 1);
                      }}
                    />
                    <span className="block font-mono text-[11px] text-white/50">{pad(i)}</span>
                    <span className="block truncate text-[13px] font-semibold">{tabLabel(sl)}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-center gap-1.5 pb-4 sm:hidden">
              {slides.map((sl, i) => (
                <button
                  key={`${sl.title}-${i}`}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`hero-dot h-1.5 w-5 ${i === index ? "bg-accent" : "bg-white/40"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </article>
  );
}
