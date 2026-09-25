"use client";

import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/Icon";

/** Catalogue search → /shop?q=… (keeps the current query in the box). */
export function SearchForm({ variant }: { variant: "desktop" | "mobile" }) {
  const q = useSearchParams().get("q") || "";

  if (variant === "mobile") {
    return (
      <form action="/shop" method="get" role="search" className="flex h-11 items-center rounded-lg border-2 border-accent bg-white pl-4 pr-1">
        <Icon name="search" className="h-4 w-4 shrink-0 text-ink-soft" />
        <input
          key={q}
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search products, brands, SKU…"
          aria-label="Search the catalogue"
          className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-[15px] outline-none"
        />
        <button type="submit" aria-label="Search" className="btn btn-accent btn-sm !shadow-none">
          Search
        </button>
      </form>
    );
  }

  return (
    <form action="/shop" method="get" role="search" className="relative hidden flex-1 md:block">
      <label htmlFor="site-search" className="sr-only">
        Search the catalogue
      </label>
      <div className="flex h-12 items-center rounded-lg border-2 border-accent bg-white pl-5 pr-1 transition focus-within:shadow-[0_0_0_4px_rgba(200,16,46,.12)]">
        <Icon name="search" className="h-4 w-4 shrink-0 text-ink-soft" />
        <input
          key={q}
          id="site-search"
          type="text"
          name="q"
          defaultValue={q}
          placeholder="What are you looking for? Products, brands, SKU…"
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-[15px] outline-none placeholder:text-ink-soft"
        />
        <button type="submit" className="btn btn-accent h-9 px-6 !shadow-none">
          Search
        </button>
      </div>
    </form>
  );
}
