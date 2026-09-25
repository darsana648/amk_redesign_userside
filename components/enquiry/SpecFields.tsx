"use client";

import { Field } from "./fields";
import type { InquirySpecAnswer, SpecFormItem, SpecFormPayload } from "@/lib/types";

/** Answers keyed by field id. Multi-selects keep an array; "other" text is kept separately. */
export type SpecValues = Record<number, { value?: string; values?: string[]; other?: string; checked?: boolean }>;

const OTHER = "__other__";

/** Initial values from each item's default_value. */
export function initialSpecValues(payload: SpecFormPayload): SpecValues {
  const out: SpecValues = {};
  for (const g of payload.groups) {
    for (const item of g.items) {
      const def = item.default_value || "";
      const f = item.field;
      if (f.field_type === "multi_select") out[f.id] = { values: def && (f.options || []).includes(def) ? [def] : [], other: "" };
      else if (f.field_type === "boolean") out[f.id] = f.render_as === "checkbox" ? { checked: def === "true" } : { value: def };
      else if (f.field_type === "single_select") out[f.id] = { value: def, other: "" };
      else out[f.id] = { value: def };
    }
  }
  return out;
}

/** Build the payload + find the first missing required field (same rules as before). */
export function collectSpecs(payload: SpecFormPayload, values: SpecValues) {
  const out: InquirySpecAnswer[] = [];
  let missing: string | null = null;
  for (const g of payload.groups) {
    for (const item of g.items) {
      const f = item.field;
      const v = values[f.id] || {};
      let answer: InquirySpecAnswer | undefined;
      if (f.field_type === "multi_select") {
        const vals = [...(v.values || [])];
        (v.other || "").split(",").map((s) => s.trim()).filter(Boolean).forEach((x) => vals.push(x));
        if (vals.length) answer = { field_id: f.id, values: vals };
      } else if (f.field_type === "boolean") {
        if (f.render_as === "checkbox") answer = { field_id: f.id, value: !!v.checked };
        else if (v.value === "true" || v.value === "false") answer = { field_id: f.id, value: v.value === "true" };
      } else if (f.field_type === "single_select") {
        const val = v.value === OTHER ? (v.other || "").trim() : v.value || "";
        if (val) answer = { field_id: f.id, value: val };
      } else {
        const val = (v.value || "").trim();
        if (val) answer = { field_id: f.id, value: val };
      }
      if (answer) out.push(answer);
      else if (item.is_required && !missing) missing = f.name;
    }
  }
  return { payload: out, missing };
}

function Req({ on }: { on: boolean }) {
  return on ? <span className="req"> *</span> : null;
}

function SpecItem({
  item,
  value,
  set,
}: {
  item: SpecFormItem;
  value: SpecValues[number];
  set: (v: SpecValues[number]) => void;
}) {
  const f = item.field;
  const label = `${f.name}${f.unit ? ` (${f.unit})` : ""}`;
  const v = value || {};

  switch (f.field_type) {
    case "number":
      return (
        <Field label={label} required={item.is_required}>
          <input type="number" inputMode="decimal" value={v.value || ""} placeholder="0" className="input" onChange={(e) => set({ ...v, value: e.target.value })} />
        </Field>
      );
    case "date":
      return (
        <Field label={label} required={item.is_required}>
          <input type="date" value={v.value || ""} className="input" onChange={(e) => set({ ...v, value: e.target.value })} />
        </Field>
      );
    case "boolean":
      if (f.render_as === "checkbox") {
        return (
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" checked={!!v.checked} onChange={(e) => set({ checked: e.target.checked })} className="mt-1 h-4 w-4 accent-[#c8102e]" />
            <span className="text-[15px] font-semibold text-navy">
              {f.name}
              <Req on={item.is_required} />
            </span>
          </label>
        );
      }
      return (
        <div>
          <span className="field-label">
            <span>
              {label}
              <Req on={item.is_required} />
            </span>
          </span>
          <div className="grid grid-cols-2 gap-2">
            {["true", "false"].map((opt) => (
              <label key={opt} className="choice">
                <input type="radio" name={`spec-bool-${f.id}`} value={opt} checked={v.value === opt} onChange={() => set({ value: opt })} />{" "}
                {opt === "true" ? "Yes" : "No"}
              </label>
            ))}
          </div>
        </div>
      );
    case "single_select":
      return (
        <div>
          <Field label={label} required={item.is_required}>
            <select className="input" value={v.value || ""} onChange={(e) => set({ ...v, value: e.target.value })}>
              <option value="">Select…</option>
              {(f.options || []).map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
              <option value={OTHER}>Other (specify)</option>
            </select>
          </Field>
          {v.value === OTHER && (
            <input type="text" placeholder="Specify other…" className="input mt-2" value={v.other || ""} onChange={(e) => set({ ...v, other: e.target.value })} />
          )}
        </div>
      );
    case "multi_select": {
      const vals = v.values || [];
      return (
        <div>
          <span className="field-label">
            <span>
              {label}
              <Req on={item.is_required} />
            </span>
            <span className="hint">select all that apply</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {(f.options || []).map((o) => (
              <label key={o} className="choice !py-1.5 !text-[13.5px]">
                <input
                  type="checkbox"
                  value={o}
                  checked={vals.includes(o)}
                  onChange={(e) => set({ ...v, values: e.target.checked ? [...vals, o] : vals.filter((x) => x !== o) })}
                />{" "}
                {o}
              </label>
            ))}
          </div>
          <input
            type="text"
            placeholder="Other — separate multiple with commas"
            className="input mt-2"
            value={v.other || ""}
            onChange={(e) => set({ ...v, other: e.target.value })}
          />
        </div>
      );
    }
    default:
      if (f.render_as === "textarea") {
        return (
          <Field label={label} required={item.is_required}>
            <textarea rows={3} placeholder={item.default_value || ""} className="input" value={v.value || ""} onChange={(e) => set({ ...v, value: e.target.value })} />
          </Field>
        );
      }
      return (
        <Field label={label} required={item.is_required}>
          <input type="text" className="input" value={v.value || ""} onChange={(e) => set({ ...v, value: e.target.value })} />
        </Field>
      );
  }
}

/** Dynamic spec fields from GET /products/<slug>/spec-form/. */
export function SpecFields({
  payload,
  values,
  onChange,
}: {
  payload: SpecFormPayload;
  values: SpecValues;
  onChange: (v: SpecValues) => void;
}) {
  return (
    <>
      {payload.groups
        .filter((g) => g.items.length)
        .map((g) => (
          <fieldset key={g.id} className="fieldset">
            <legend>{g.name}</legend>
            {g.description && <p className="mt-1 text-[13px] text-ink-muted">{g.description}</p>}
            <div className="mt-3 space-y-3">
              {g.items.map((item) => (
                <SpecItem
                  key={item.id}
                  item={item}
                  value={values[item.field.id]}
                  set={(nv) => onChange({ ...values, [item.field.id]: nv })}
                />
              ))}
            </div>
          </fieldset>
        ))}
    </>
  );
}
