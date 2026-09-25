"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/Icon";
import { COUNTRY_CODES } from "@/lib/site";

export function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="field-label">
        <span>
          {label}
          {required && <span className="req"> *</span>}
        </span>
        {hint != null && <span className="hint">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

/** Name, phone (with country code), email and buyer category — shared by both forms. */
export function ContactFields() {
  return (
    <>
      <Field label="Full name" required>
        <input required name="name" type="text" placeholder="e.g. Anand Sharma" className="input" autoComplete="name" />
      </Field>
      <Field label="Phone" required>
        <div className="flex gap-2">
          <select name="cc" aria-label="Country code" className="input w-[150px] shrink-0" defaultValue="+91">
            {COUNTRY_CODES.map(([c, l]) => (
              <option key={c} value={c}>
                {`${c}  ${l}`}
              </option>
            ))}
          </select>
          <input
            required
            name="phone"
            type="tel"
            pattern="[0-9 ]{6,15}"
            inputMode="numeric"
            placeholder="98765 43210"
            className="input flex-1"
            autoComplete="tel-national"
          />
        </div>
      </Field>
      <Field label="Email" required>
        <input required name="email" type="email" placeholder="name@company.com" className="input" autoComplete="email" />
      </Field>
      <div>
        <span className="field-label">
          <span>
            Buyer category<span className="req"> *</span>
          </span>
        </span>
        <div className="grid grid-cols-2 gap-2">
          <label className="choice">
            <input type="radio" name="category" value="individual" defaultChecked /> Individual
          </label>
          <label className="choice">
            <input type="radio" name="category" value="company" /> Company
          </label>
        </div>
      </div>
    </>
  );
}

export function FormFooter({
  label,
  error,
  submitting,
  onCancel,
}: {
  label: string;
  error: string;
  submitting: boolean;
  onCancel: () => void;
}) {
  return (
    <>
      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p>
      )}
      <div className="flex items-center justify-between gap-3 border-t border-line pt-5">
        <button type="button" onClick={onCancel} className="text-sm font-semibold text-ink-soft hover:text-navy">
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="btn btn-accent">
          {submitting ? (
            "Submitting…"
          ) : (
            <>
              {label} <Icon name="send" className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </>
  );
}

export function SuccessPanel({ title, body, onClose }: { title: string; body: string; onClose: () => void }) {
  return (
    <div className="px-6 py-12 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-trust-light text-trust">
        <Icon name="check" className="h-8 w-8" />
      </div>
      <h3 className="mt-5 text-2xl font-bold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-ink-muted">{body}</p>
      <button type="button" onClick={onClose} className="btn btn-accent mt-7">
        Done
      </button>
    </div>
  );
}

/** Common payload fields read from the form. */
export function commonPayload(fd: FormData) {
  return {
    name: String(fd.get("name") || ""),
    country_code: String(fd.get("cc") || "+91"),
    phone: String(fd.get("phone") || ""),
    email: String(fd.get("email") || ""),
    buyer_category: fd.get("category") === "company" ? ("company" as const) : ("individual" as const),
    model_number: String(fd.get("model") || ""),
    quantity: Number(fd.get("quantity") || 1),
  };
}
