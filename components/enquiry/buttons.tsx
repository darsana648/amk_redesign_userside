"use client";

import type { ReactNode } from "react";
import { SITE } from "@/lib/site";
import type { EnquiryProduct } from "@/lib/types";
import { useEnquiry } from "./EnquiryProvider";

/** "Request Quote" / "Enquire Now" — opens the product enquiry form. */
export function EnquireButton({
  product,
  className,
  children,
  ariaLabel,
}: {
  product: EnquiryProduct;
  className: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const { openProduct } = useEnquiry();
  return (
    <button type="button" aria-label={ariaLabel} className={className} onClick={() => openProduct(product)}>
      {children}
    </button>
  );
}

/** "Post requirement" — opens the general buy-requirement form.
 *  `descriptionFrom` pre-fills the description from a textarea on the page. */
export function PostRequirementButton({
  className,
  children,
  category,
  descriptionFrom,
  ariaLabel,
  type = "button",
  onOpen,
}: {
  className: string;
  children: ReactNode;
  category?: string;
  descriptionFrom?: string;
  ariaLabel?: string;
  type?: "button" | "submit";
  onOpen?: () => void;
}) {
  const { openGeneral } = useEnquiry();
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        const description = descriptionFrom
          ? (document.querySelector(descriptionFrom) as HTMLTextAreaElement | null)?.value || ""
          : "";
        onOpen?.();
        openGeneral({ category: category || "", description });
      }}
    >
      {children}
    </button>
  );
}

/** WhatsApp deep link with the product name, SKU and the current page URL. */
export function WhatsAppButton({
  product,
  className,
  children,
  ariaLabel,
}: {
  product: EnquiryProduct;
  className: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <a
      href="#"
      aria-label={ariaLabel}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        const msg = `Hi AMK,\n\nI'd like to enquire about ${product.name} (SKU ${String(product.id).toUpperCase()}).\n\nProduct link: ${location.href}\n\nPlease share availability, lead time and indicative pricing.`;
        window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
      }}
    >
      {children}
    </a>
  );
}
