"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";

/** Floating "Post your need" button (compact "Need help?" on phones). */
export function Fab() {
  const { openGeneral, modalOpen } = useEnquiry();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 250);
    return () => clearTimeout(t);
  }, []);

  const hidden = !shown || modalOpen;

  return (
    <div
      id="amk-fab"
      className={`fixed bottom-4 right-3 z-[120] transition-all duration-500 sm:bottom-6 sm:right-6 ${hidden ? "pointer-events-none translate-y-6 opacity-0" : ""}`}
    >
      <button
        type="button"
        onClick={() => openGeneral()}
        aria-label="Post a buy requirement"
        className="group inline-flex items-center gap-2 rounded-xl bg-accent py-1.5 pl-1.5 pr-3 text-white shadow-[0_16px_40px_-12px_rgba(200,16,46,.75)] transition hover:scale-[1.03] hover:bg-accent-dark active:scale-95 sm:gap-2.5 sm:py-2 sm:pl-2 sm:pr-5"
      >
        <span className="relative grid h-7 w-7 place-items-center rounded-lg bg-white/20 sm:h-9 sm:w-9">
          <span className="absolute inset-0 animate-ping rounded-lg bg-white/30" />
          <Icon name="clipboard-list" className="relative h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </span>
        <span className="text-[12.5px] font-semibold sm:hidden">Need help?</span>
        <span className="hidden flex-col text-left leading-tight sm:flex">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white/75">Buy Requirement</span>
          <span className="text-[14px] font-bold">Post your need</span>
        </span>
      </button>
    </div>
  );
}
