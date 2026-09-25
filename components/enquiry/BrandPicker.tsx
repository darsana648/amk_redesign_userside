"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { getBrandsCached } from "@/lib/client-api";
import type { ApiBrand } from "@/lib/types";

/** Creatable multi-select: pick catalogue brands or type a new one ("Add …"). */
export function BrandPicker({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) {
  const [all, setAll] = useState<ApiBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let alive = true;
    getBrandsCached().then((list) => {
      if (!alive) return;
      setAll(list);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  const options = useMemo(() => {
    const term = q.trim().toLowerCase();
    const chosen = new Set(value.map((v) => v.toLowerCase()));
    const opts: { label: string; value: string; custom?: boolean }[] = all
      .filter((b) => !chosen.has(b.name.toLowerCase()) && b.name.toLowerCase().includes(term))
      .map((b) => ({ label: b.name, value: b.name }));
    if (term && !all.some((b) => b.name.toLowerCase() === term) && !chosen.has(term)) {
      opts.push({ label: `Add “${q.trim()}”`, value: q.trim(), custom: true });
    }
    return opts;
  }, [all, q, value]);

  const activeIdx = Math.min(active, Math.max(0, options.length - 1));

  const add = (v: string) => {
    if (!v) return;
    if (!value.some((x) => x.toLowerCase() === v.toLowerCase())) onChange([...value, v]);
    setQ("");
    setActive(0);
  };

  return (
    <div className="relative">
      <div
        className="input flex h-auto min-h-[44px] cursor-text flex-wrap items-center gap-1.5 py-1.5"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((v, i) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 rounded-full bg-accent-light px-2.5 py-1 text-[12.5px] font-semibold text-[#a50d25]"
          >
            {v}
            <button
              type="button"
              aria-label={`Remove ${v}`}
              className="opacity-70 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onChange(value.filter((_, j) => j !== i));
              }}
            >
              <Icon name="x" className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={q}
          role="combobox"
          aria-expanded={open}
          autoComplete="off"
          placeholder={placeholder}
          className="min-w-[140px] flex-1 border-0 bg-transparent py-1 text-[15px] outline-none"
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive(Math.min(activeIdx + 1, options.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive(Math.max(activeIdx - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              if (options[activeIdx]) add(options[activeIdx].value);
            } else if (e.key === "Backspace" && !q && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
        />
      </div>
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-xl border border-line bg-white py-1 shadow-lift"
        >
          {loading ? (
            <li className="px-3 py-2 text-sm text-ink-soft">Loading brands…</li>
          ) : options.length ? (
            options.map((o, i) => (
              <li
                key={`${o.value}-${i}`}
                role="option"
                aria-selected={i === activeIdx}
                onMouseDown={(e) => {
                  e.preventDefault();
                  add(o.value);
                }}
                className={`cursor-pointer px-3 py-2 text-sm ${i === activeIdx ? "bg-accent-light text-accent" : "text-ink"} ${o.custom ? "font-semibold" : ""}`}
              >
                {o.custom && <Icon name="plus" className="mr-1 inline h-3.5 w-3.5" />}
                {o.label}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-ink-soft">Type to add a brand</li>
          )}
        </ul>
      )}
    </div>
  );
}
