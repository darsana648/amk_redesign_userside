"use client";

/* Staff-managed popup ads (GET /ad-popups/?path=…).
   Same trigger (immediate / delay / scroll / exit intent) and frequency rules
   as before. Presentation: centred two-column card on desktop, bottom sheet
   that slides up on phones. */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/Icon";
import { clientGet } from "@/lib/client-api";
import type { Popup } from "@/lib/types";

const WINDOW_MS: Record<string, number> = { once_per_day: 86400000, once_per_week: 604800000 };

function seenRecently(p: Popup) {
  try {
    const key = `amk_popup_${p.id}`;
    if (p.frequency === "every_visit") return false;
    if (p.frequency === "once_per_session") return sessionStorage.getItem(key) === "1";
    if (p.frequency === "once_ever") return localStorage.getItem(key) === "1";
    return Date.now() - Number(localStorage.getItem(key) || 0) < (WINDOW_MS[p.frequency] ?? 0);
  } catch {
    return true;
  }
}
function markSeen(p: Popup) {
  try {
    const key = `amk_popup_${p.id}`;
    if (p.frequency === "once_per_session") sessionStorage.setItem(key, "1");
    else if (p.frequency === "once_ever") localStorage.setItem(key, "1");
    else localStorage.setItem(key, String(Date.now()));
  } catch {
    /* ignore */
  }
}

export function PopupAds() {
  const pathname = usePathname() || "/";
  const [popup, setPopup] = useState<Popup | null>(null);

  useEffect(() => {
    let cancelled = false;
    const cleanups: (() => void)[] = [];
    clientGet<{ results?: Popup[] }>(`/ad-popups/?path=${encodeURIComponent(pathname)}`).then((data) => {
      const p = (data?.results || []).find((x) => !seenRecently(x));
      if (!p || cancelled) return;
      const show = () => {
        if (cancelled) return;
        if (document.querySelector("[role=dialog][aria-modal=true]")) return; // never stack over a form
        markSeen(p);
        setPopup(p);
      };
      if (p.trigger === "immediate") show();
      else if (p.trigger === "delay") {
        const t = setTimeout(show, (p.delay_seconds || 5) * 1000);
        cleanups.push(() => clearTimeout(t));
      } else if (p.trigger === "scroll") {
        const onScroll = () => {
          const max = document.body.scrollHeight - window.innerHeight;
          if ((max > 0 ? (window.scrollY / max) * 100 : 100) >= (p.scroll_pct || 50)) {
            window.removeEventListener("scroll", onScroll);
            show();
          }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        cleanups.push(() => window.removeEventListener("scroll", onScroll));
      } else if (p.trigger === "exit_intent") {
        const onLeave = (e: MouseEvent) => {
          if (e.clientY <= 0) {
            document.removeEventListener("mouseout", onLeave);
            show();
          }
        };
        document.addEventListener("mouseout", onLeave);
        cleanups.push(() => document.removeEventListener("mouseout", onLeave));
      }
    });
    return () => {
      cancelled = true;
      cleanups.forEach((c) => c());
    };
  }, [pathname]);

  if (!popup) return null;
  return <PopupDialog key={popup.id} p={popup} onDone={() => setPopup(null)} />;
}

function PopupDialog({ p, onDone }: { p: Popup; onDone: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const closing = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hasImg = !!p.image;

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    setIsOpen(false);
    setTimeout(onDone, 260);
  };

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setIsOpen(true)));
    cardRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && p.dismissable && close();
    document.addEventListener("keydown", onKey);
    const auto = p.auto_close_seconds ? setTimeout(close, p.auto_close_seconds * 1000) : undefined;
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      if (auto) clearTimeout(auto);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div
      className={`amk-popup fixed inset-0 z-[150] flex items-end justify-center sm:items-center sm:p-6 ${isOpen ? "is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="amk-popup-title"
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("[data-card]") && p.dismissable) close();
      }}
    >
      <div className="amk-popup-backdrop absolute inset-0 bg-navy-950/60 backdrop-blur-[3px]" />
      <div
        ref={cardRef}
        data-card
        tabIndex={-1}
        className={`amk-popup-card relative w-full overflow-hidden rounded-t-2xl bg-white shadow-[0_30px_80px_-20px_rgba(6,13,31,.55)] outline-none sm:rounded-2xl ${hasImg ? "sm:grid sm:max-w-[760px] sm:grid-cols-[46%_54%]" : "sm:max-w-[460px]"}`}
      >
        <span className={`absolute left-1/2 top-2 z-20 h-1 w-10 -translate-x-1/2 rounded-full bg-white/80 sm:hidden ${hasImg ? "" : "!bg-line-strong"}`} />
        {p.dismissable && (
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-ink shadow-md transition hover:bg-white hover:text-accent sm:bg-canvas sm:shadow-none sm:hover:bg-line"
          >
            <Icon name="x" className="h-4 w-4" />
          </button>
        )}
        {hasImg && (
          <div className="relative h-44 sm:h-auto sm:min-h-[380px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-transparent sm:to-navy-950/10" />
            <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-navy shadow sm:bottom-auto sm:top-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/logo.png" alt="" className="h-3.5 w-auto" /> Authorised OEM channel
            </span>
          </div>
        )}
        <div className="flex flex-col px-6 pb-6 pt-5 sm:px-8 sm:py-8">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent-light px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
            <Icon name="sparkles" className="h-3.5 w-3.5" /> Special offer
          </span>
          <h3 id="amk-popup-title" className="mt-3 pr-8 text-[22px] font-extrabold leading-tight tracking-tight text-ink sm:text-[26px]">
            {p.title}
          </h3>
          {p.subtitle && <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{p.subtitle}</p>}
          {p.body && <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">{p.body}</p>}
          <ul className="mt-5 grid gap-2 border-t border-line pt-4 text-[13px] text-ink-muted">
            <li className="flex items-center gap-2">
              <Icon name="badge-check" className="h-4 w-4 shrink-0 text-trust" /> Genuine, warranty-backed OEM stock
            </li>
            <li className="flex items-center gap-2">
              <Icon name="clock" className="h-4 w-4 shrink-0 text-trust" /> Quotes within 24 hours
            </li>
            <li className="flex items-center gap-2">
              <Icon name="truck" className="h-4 w-4 shrink-0 text-trust" /> Pan-India delivery
            </li>
          </ul>
          <div className="mt-auto pt-6">
            {p.cta_label && (
              <Link href={p.link || "#"} onClick={close} className="btn btn-accent btn-lg w-full">
                {p.cta_label} <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            )}
            {p.dismissable && (
              <button type="button" onClick={close} className="mt-2 w-full py-2 text-[13px] font-medium text-ink-soft transition hover:text-ink">
                Maybe later
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
