"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { clientPost } from "@/lib/client-api";
import { BrandPicker } from "./BrandPicker";
import { commonPayload, ContactFields, Field, FormFooter, SuccessPanel } from "./fields";

const MAX = 300;

export type GeneralEnquiryOptions = { productName?: string; category?: string; description?: string };

/** General buy requirement (no product) — same fields and payload as before → POST /inquiries/. */
export function GeneralEnquiryForm({ options, onClose }: { options: GeneralEnquiryOptions; onClose: () => void }) {
  const [brands, setBrands] = useState<string[]>([]);
  const [desc, setDesc] = useState((options.description || "").slice(0, MAX));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.querySelector<HTMLInputElement>("input:not([type=hidden])")?.focus({ preventScroll: true });
  }, []);

  if (done) {
    return (
      <SuccessPanel
        title="Request received"
        body="An AMK sourcing engineer will reach out within 24 hours with availability, lead times and indicative pricing."
        onClose={onClose}
      />
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setError("");
    const fd = new FormData(form);
    setSubmitting(true);
    try {
      await clientPost("/inquiries/", {
        ...commonPayload(fd),
        product_slug: "",
        product_name: String(fd.get("product_name") || ""),
        product_sku: "",
        product_category: String(fd.get("product_category") || ""),
        requested_brands: brands,
        other_option: "",
        description: desc,
      });
      setDone(true);
    } catch {
      setError("Could not submit right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form ref={formRef} className="space-y-4 px-6 py-6" noValidate onSubmit={onSubmit}>
      <fieldset className="fieldset">
        <legend>What you&apos;re looking for</legend>
        <div className="mt-3 space-y-3">
          <Field label="Product / item name" required>
            <input
              required
              name="product_name"
              type="text"
              defaultValue={options.productName || ""}
              placeholder="e.g. 250A 4P MCCB, Industrial sensors…"
              className="input"
            />
          </Field>
          <Field label="Category" hint="if you know it">
            <input
              name="product_category"
              type="text"
              defaultValue={options.category || ""}
              placeholder="e.g. MCCB, Cable Trays, VFD Drives…"
              className="input"
            />
          </Field>
          <div>
            <span className="field-label">
              <span>Brands</span>
              <span className="hint">{brands.length ? `${brands.length} selected` : "pick or type"}</span>
            </span>
            <BrandPicker value={brands} onChange={setBrands} placeholder="Pick brands or type a new one…" />
            <p className="mt-1.5 text-[12px] text-ink-soft">
              Don&apos;t see your brand? Type the name and pick <b>Add “…”</b> — we trade many brands beyond our catalogue.
            </p>
          </div>
          <Field label="Model number" hint="optional">
            <input name="model" type="text" placeholder="e.g. NSX160F" className="input" />
          </Field>
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
        <Field label="Description" required hint={`${desc.length}/${MAX}`}>
          <textarea
            required
            name="description"
            rows={3}
            maxLength={MAX}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Application, voltage class, environment, target dates…"
            className="input"
          />
        </Field>
        <Field label="Quantity" required>
          <input required name="quantity" type="number" min={1} defaultValue={1} inputMode="numeric" className="input" />
        </Field>
      </div>
      <ContactFields />
      <FormFooter label="Send requirement" error={error} submitting={submitting} onCancel={onClose} />
    </form>
  );
}
