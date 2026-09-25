"use client";

/* /shop — full catalogue: ?q= search, ?sort=, brand filter, 12-per-page pagination. */
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/Icon";
import { PostRequirementButton } from "@/components/enquiry/buttons";
import { EmptyState, ProductGrid } from "@/components/ui";
import { SEGMENTS } from "@/lib/site";
import type { ApiBrand, ApiCategory, Product } from "@/lib/types";
import { pageList } from "@/lib/utils";

const PAGE_SIZE = 12;
const GRID = "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4";

export function ShopClient({
  products,
  categories,
  brands,
  q,
  sort,
}: {
  products: Product[];
  categories: ApiCategory[];
  brands: ApiBrand[];
  q: string;
  sort: string;
}) {
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const filtered = useMemo(
    () => (selected.size ? products.filter((p) => p.brands.some((b) => selected.has(b.id))) : products),
    [products, selected],
  );
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(page, pages);
  const first = total ? (current - 1) * PAGE_SIZE + 1 : 0;
  const last = Math.min(current * PAGE_SIZE, total);

  const toggleBrand = (id: number, on: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
    setPage(1);
  };
  const clear = () => {
    setSelected(new Set());
    setPage(1);
  };
  const goPage = (n: number) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const onSort = (value: string) => {
    const params = new URLSearchParams(search.toString());
    if (value === "default") params.delete("sort");
    else params.set("sort", value);
    router.push(`${pathname}${params.toString() ? `?${params}` : ""}`);
  };

  const selectedBrands = brands.filter((b) => selected.has(b.id));

  const filters = (
    <Filters
      categories={categories}
      brands={brands}
      selected={selected}
      onToggle={toggleBrand}
      onClear={clear}
      onPost={() => setDrawer(false)}
    />
  );

  const pgBtn = (label: React.ReactNode, target: number, disabled: boolean, isCurrent = false, key?: string) => (
    <button
      key={key}
      type="button"
      disabled={disabled}
      aria-current={isCurrent ? "page" : undefined}
      onClick={() => !disabled && goPage(target)}
      className={`inline-flex h-10 min-w-[40px] items-center justify-center gap-1 rounded-full border px-3 text-sm font-semibold transition ${
        isCurrent
          ? "border-accent bg-accent text-white"
          : disabled
            ? "cursor-not-allowed border-line bg-canvas text-line-strong"
            : "border-line bg-white text-ink hover:border-accent hover:text-accent"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="container-site">
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="hidden space-y-4 lg:block">{filters}</aside>

        <div className="min-w-0">
          <div className="panel mb-4 flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="min-w-0">
              <h1 className="text-[22px] font-bold tracking-tight md:text-[26px]">{q ? `Results for “${q}”` : "AMK Catalog"}</h1>
              <p className="mt-0.5 text-[13.5px] text-ink-muted">
                Showing <b className="text-ink">{first}–{last}</b> of <b className="text-ink">{total}</b> products
              </p>
            </div>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <button type="button" onClick={() => setDrawer(true)} className="btn btn-outline flex-1 lg:hidden">
                <Icon name="sliders-horizontal" className="h-4 w-4" /> Filters
              </button>
              <label className="flex flex-1 items-center gap-2 sm:flex-none">
                <span className="hidden text-[13px] text-ink-soft sm:inline">Sort by</span>
                <select value={sort} onChange={(e) => onSort(e.target.value)} aria-label="Sort products" className="input !h-10 !rounded-full sm:w-48">
                  <option value="default">Best match</option>
                  <option value="new">Newest first</option>
                  <option value="brand">Brand A–Z</option>
                  <option value="name">Name A–Z</option>
                </select>
              </label>
            </div>
          </div>

          {selectedBrands.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {selectedBrands.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => toggleBrand(b.id, false)}
                  className="chip border border-accent-soft bg-accent-light text-[#a50d25] hover:border-accent"
                >
                  {b.name} <Icon name="x" className="h-3 w-3" />
                </button>
              ))}
              <button type="button" onClick={clear} className="text-[13px] font-semibold text-accent hover:underline">
                Clear all
              </button>
            </div>
          )}

          {total ? (
            <ProductGrid products={filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)} cols={GRID} />
          ) : (
            <EmptyState
              title="No products found"
              body={q ? `Nothing matched “${q}”. Try another term, or post your requirement and we'll source it.` : "Try clearing the brand filter."}
              cta={<PostRequirementButton className="btn btn-accent mt-6">Post your requirement</PostRequirementButton>}
            />
          )}

          {pages > 1 && (
            <nav aria-label="Pagination" className="panel mt-5 flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <p className="text-sm text-ink-muted">
                Page <b className="text-ink">{current}</b> of <b className="text-ink">{pages}</b>
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                {pgBtn(
                  <>
                    <Icon name="chevron-left" className="h-4 w-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </>,
                  current - 1,
                  current === 1,
                )}
                {pageList(current, pages).map((p, i) =>
                  p === "..." ? (
                    <span key={`gap-${i}`} className="px-1 text-ink-soft">
                      …
                    </span>
                  ) : (
                    pgBtn(p, p, false, p === current, `p-${p}`)
                  ),
                )}
                {pgBtn(
                  <>
                    <span className="hidden sm:inline">Next</span>
                    <Icon name="chevron-right" className="h-4 w-4" />
                  </>,
                  current + 1,
                  current === pages,
                )}
              </div>
            </nav>
          )}
        </div>
      </div>

      {drawer && <FilterDrawer onClose={() => setDrawer(false)}>{filters}</FilterDrawer>}
    </div>
  );
}

function Box({ title, icon, extra, children }: { title: string; icon: string; extra?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h3 className="flex items-center gap-2 text-[14px] font-bold">
          <Icon name={icon} className="h-4 w-4 text-accent" />
          {title}
        </h3>
        {extra}
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}

function LinkList({ items }: { items: [string, string][] }) {
  return (
    <ul className="space-y-0.5 text-[13.5px] text-ink-muted">
      {items.map(([label, href]) => (
        <li key={href}>
          <Link href={href} className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent-light hover:text-accent">
            <span className="truncate">{label}</span>
            <Icon name="chevron-right" className="h-3.5 w-3.5 shrink-0 text-line-strong" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Filters({
  categories,
  brands,
  selected,
  onToggle,
  onClear,
  onPost,
}: {
  categories: ApiCategory[];
  brands: ApiBrand[];
  selected: Set<number>;
  onToggle: (id: number, on: boolean) => void;
  onClear: () => void;
  onPost: () => void;
}) {
  return (
    <>
      <Box title="Business Segments" icon="layers">
        <LinkList items={SEGMENTS.map((s) => [s.name, `/segment/${s.slug}`])} />
      </Box>
      <Box title="Product Categories" icon="layout-grid">
        <LinkList items={categories.slice(0, 14).map((c) => [c.name, `/category/${c.slug}`])} />
      </Box>
      <Box
        title="Brands"
        icon="award"
        extra={
          selected.size > 0 && (
            <button type="button" onClick={onClear} className="text-[12.5px] font-semibold text-accent hover:underline">
              Clear ({selected.size})
            </button>
          )
        }
      >
        {brands.length ? (
          <ul className="max-h-64 space-y-1 overflow-y-auto pr-1 text-[13.5px] text-ink-muted">
            {brands.map((b) => (
              <li key={b.id}>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1 hover:bg-canvas hover:text-ink">
                  <input
                    type="checkbox"
                    checked={selected.has(b.id)}
                    onChange={(e) => onToggle(b.id, e.target.checked)}
                    className="h-4 w-4 rounded accent-[#c8102e]"
                  />
                  <span className="flex-1 truncate">{b.name}</span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-soft">No brands available.</p>
        )}
      </Box>
      <Box title="Availability" icon="package-check">
        <ul className="space-y-1 text-[13.5px] text-ink-muted">
          {["In stock", "Ships in 24 hrs", "Project lead time"].map((s) => (
            <li key={s}>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1 hover:bg-canvas">
                <input type="checkbox" className="h-4 w-4 rounded accent-[#c8102e]" />
                {s}
              </label>
            </li>
          ))}
        </ul>
      </Box>
      <div className="panel bg-accent-light p-4 !border-accent-soft">
        <p className="text-[14px] font-bold">Can&apos;t find your product?</p>
        <p className="mt-1 text-[13px] text-ink-muted">Tell us what you need — we trade thousands of items beyond the catalogue.</p>
        <PostRequirementButton className="btn btn-accent btn-sm mt-3 w-full" onOpen={onPost}>
          <Icon name="clipboard-list" className="h-4 w-4" /> Post Requirement
        </PostRequirementButton>
      </div>
    </>
  );
}

function FilterDrawer({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
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
    <div className="fixed inset-0 z-[60] lg:hidden">
      <button type="button" onClick={onClose} className="absolute inset-0 cursor-default bg-navy-950/50" aria-label="Close filters" />
      <div role="dialog" aria-modal="true" aria-label="Filters" className="fade-up absolute inset-y-0 left-0 flex w-[86%] max-w-[360px] flex-col bg-canvas shadow-2xl">
        <div className="flex items-center justify-between border-b border-line bg-white px-4 py-3.5">
          <p className="text-[16px] font-bold">Filters</p>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-canvas" aria-label="Close filters">
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-4">{children}</div>
        <div className="border-t border-line bg-white p-3">
          <button type="button" onClick={onClose} className="btn btn-accent w-full">
            Show results
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
