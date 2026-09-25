"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/Icon";
import { clientGet, clientPost } from "@/lib/client-api";
import type { EnquiryProduct, SpecFormPayload } from "@/lib/types";
import { BrandPicker } from "./BrandPicker";
import { collectSpecs, initialSpecValues, SpecFields, type SpecValues } from "./SpecFields";
import { commonPayload, ContactFields, Field, FormFooter, SuccessPanel } from "./fields";

const MAX = 120;

export const productCategoryLabel = (p: EnquiryProduct) => (p.categoryName || p.category || "").replace(/-/g, " ");

/** Product enquiry — same fields and payload as before → POST /inquiries/. */
export function ProductEnquiryForm({ product: p, onClose }: { product: EnquiryProduct; onClose: () => void }) {
  const sku = String(p.id).toUpperCase();
  const category = productCategoryLabel(p);
  const [brands, setBrands] = useState<string[]>(() =>
    p.brands.length ? p.brands.map((b) => b.name) : p.brand ? [p.brand] : [],
  );
  const [desc, setDesc] = useState("");
  const [spec, setSpec] = useState<SpecFormPayload | null>(null);
  const [specValues, setSpecValues] = useState<SpecValues>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!p.slug) return;
    let alive = true;
    clientGet<SpecFormPayload>(`/products/${encodeURIComponent(p.slug)}/spec-form/`).then((d) => {
      if (!alive || !d || !d.groups || !d.groups.length) return;
      setSpec(d);
      setSpecValues(initialSpecValues(d));
    });
    return () => {
      alive = false;
    };
  }, [p.slug]);

  useEffect(() => {
    formRef.current?.querySelector<HTMLInputElement>("input:not([type=hidden])")?.focus({ preventScroll: true });
  }, []);

  if (done) {
    return (
      <SuccessPanel
        title="Enquiry received"
        body="An AMK application engineer will reach out within 24 hours with stock visibility, lead times and indicative pricing."
        onClose={onClose}
      />
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setError("");
    let spec_values;
    if (spec) {
      const res = collectSpecs(spec, specValues);
      if (res.missing) {
        setError(`Please fill in: ${res.missing}`);
        return;
      }
      spec_values = res.payload;
    }
    const fd = new FormData(form);
    setSubmitting(true);
    try {
      await clientPost("/inquiries/", {
        ...commonPayload(fd),
        product_slug: p.slug,
        product_name: p.name,
        product_sku: sku,
        product_category: category,
        product_brand: p.brand,
        requested_brands: brands,
        other_option: String(fd.get("other") || ""),
        description: desc,
        spec_values,
      });
      setDone(true);
    } catch {
      setError("Could not submit right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const summary = category + (brands.length ? ` · ${brands.slice(0, 3).join(", ")}${brands.length > 3 ? ` +${brands.length - 3}` : ""}` : "");

  return (
    <form ref={formRef} className="space-y-4 px-6 py-6" noValidate onSubmit={onSubmit}>
      <ContactFields />
      <fieldset className="fieldset">
        <legend>Material selection</legend>
        <p className="mt-1 flex items-center gap-2 text-[13px] font-medium text-ink-muted">
          <Icon name="shield-check" className="h-3.5 w-3.5 text-trust" />
          <span className="capitalize">{summary}</span>
        </p>
        <div className="mt-3 space-y-3">
          <div>
            <span className="field-label">
              <span>Brands</span>
              <span className="hint">{brands.length ? `${brands.length} selected` : "pick or type"}</span>
            </span>
            <BrandPicker value={brands} onChange={setBrands} placeholder="Search brands or type a new one…" />
            <p className="mt-1.5 text-[12px] text-ink-soft">
              Don&apos;t see your brand? Type the name and pick <b>Add “…”</b> — we trade many brands outside our catalogue too.
            </p>
          </div>
          <Field label="Model number" hint="if any">
            <input name="model" type="text" placeholder="e.g. NSX160F" className="input" />
          </Field>
          <Field label="Other option" hint="optional">
            <input name="other" type="text" placeholder="Alternative make, rating, accessory…" className="input" />
          </Field>
        </div>
      </fieldset>
      {spec && (
        <div className="space-y-3">
          <SpecFields payload={spec} values={specValues} onChange={setSpecValues} />
        </div>
      )}
      <Field label="Quantity" required>
        <input required name="quantity" type="number" min={1} defaultValue={1} inputMode="numeric" className="input w-32" />
      </Field>
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
      <FormFooter label="Submit enquiry" error={error} submitting={submitting} onCancel={onClose} />
    </form>
  );
}
