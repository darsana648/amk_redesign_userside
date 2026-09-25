"use client";

/* =========================================================================
   Enquiry workflow — same flow & payloads as the previous storefront.
     • Product enquiry  (EnquireButton)          → POST /inquiries/
     • Buy requirement  (PostRequirementButton)  → POST /inquiries/
   One modal lives here; any component opens it through useEnquiry().
   ========================================================================= */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/Icon";
import type { EnquiryProduct } from "@/lib/types";
import { GeneralEnquiryForm, type GeneralEnquiryOptions } from "./GeneralEnquiryForm";
import { ProductEnquiryForm, productCategoryLabel } from "./ProductEnquiryForm";

type Open =
  | { kind: "product"; product: EnquiryProduct; key: number }
  | { kind: "general"; options: GeneralEnquiryOptions; key: number }
  | null;

type Ctx = {
  openProduct: (p: EnquiryProduct) => void;
  openGeneral: (o?: GeneralEnquiryOptions) => void;
  modalOpen: boolean;
};

const EnquiryContext = createContext<Ctx | null>(null);

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error("useEnquiry must be used inside <EnquiryProvider>");
  return ctx;
}

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<Open>(null);
  const close = useCallback(() => setOpen(null), []);
  const openProduct = useCallback((product: EnquiryProduct) => setOpen({ kind: "product", product, key: Date.now() }), []);
  const openGeneral = useCallback(
    (options: GeneralEnquiryOptions = {}) => setOpen({ kind: "general", options, key: Date.now() }),
    [],
  );
  const value = useMemo(() => ({ openProduct, openGeneral, modalOpen: !!open }), [openProduct, openGeneral, open]);

  return (
    <EnquiryContext.Provider value={value}>
      {children}
      {open && (
        <EnquiryModal
          key={open.key}
          onClose={close}
          eyebrow={open.kind === "product" ? "Product enquiry" : "Buy requirement"}
          eyebrowIcon={open.kind === "general" ? "clipboard-list" : undefined}
          title={open.kind === "product" ? open.product.name : "Tell us what you're looking for"}
          subtitle={
            open.kind === "product" ? (
              <>
                SKU&nbsp;<span className="font-mono">{String(open.product.id).toUpperCase()}</span>
                <span className="px-1.5">·</span>
                <span className="capitalize">{productCategoryLabel(open.product)}</span>
              </>
            ) : (
              "For products or categories not in our catalogue — we trade many more."
            )
          }
        >
          {open.kind === "product" ? (
            <ProductEnquiryForm product={open.product} onClose={close} />
          ) : (
            <GeneralEnquiryForm options={open.options} onClose={close} />
          )}
        </EnquiryModal>
      )}
    </EnquiryContext.Provider>
  );
}

function EnquiryModal({
  eyebrow,
  eyebrowIcon,
  title,
  subtitle,
  onClose,
  children,
}: {
  eyebrow: string;
  eyebrowIcon?: string;
  title: string;
  subtitle: ReactNode;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="amk-modal-title"
      className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-4"
    >
      <div className="absolute inset-0 bg-navy-950/55 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fade-up relative max-h-[94vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-xl sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-white px-6 py-5">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-[0.08em] text-accent">
              {eyebrowIcon && <Icon name={eyebrowIcon} className="h-3.5 w-3.5" />}
              {eyebrow}
            </p>
            <h2 id="amk-modal-title" className="mt-1 truncate text-lg font-bold text-ink" title={title}>
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 truncate text-[13px] text-ink-soft">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close form"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-paper hover:text-navy"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
