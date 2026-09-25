import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/Icon";
import { EnquireButton } from "@/components/enquiry/buttons";
import type { Product } from "@/lib/types";
import { cn, img, toEnquiryProduct } from "@/lib/utils";

export function Rating({ value, count, size = "xs" }: { value: number; count?: number | null; size?: "xs" | "md" }) {
  const cls = size === "md" ? "h-4 w-4" : "h-3 w-3";
  return (
    <span className="inline-flex items-center gap-1" title={`${value} out of 5`}>
      <Icon name="star" className={`${cls} fill-current text-[#ffb400]`} />
      <span className="text-[12px] font-semibold text-ink">{Number(value).toFixed(1)}</span>
      {count != null && <span className="text-[12px] text-ink-soft">({count})</span>}
    </span>
  );
}

/** Marketplace product card — no price (trading model), one clear CTA. */
export function ProductCard({ p }: { p: Product }) {
  const href = `/product/${p.slug}`;
  return (
    <article className="card card-hover group relative flex flex-col overflow-hidden">
      <div className="absolute left-2.5 top-2.5 z-10 flex gap-1">
        {p.isHot && <span className="badge badge-hot">HOT</span>}
        {p.isNew && <span className="badge badge-new">NEW</span>}
      </div>
      <Link href={href} className="block bg-white" aria-label={p.name}>
        <div className="relative aspect-square w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img(p.image, 360)}
            alt={p.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 border-t border-line px-3.5 pb-3.5 pt-3">
        <Link
          href={href}
          title={p.name}
          className="line-clamp-2 min-h-[2.6em] text-[14px] font-semibold leading-snug text-ink hover:text-accent"
        >
          {p.name}
        </Link>
        {p.brands.length ? (
          <p className="truncate text-[12px] text-ink-soft" title={p.brands.map((b) => b.name).join(", ")}>
            {p.brands.slice(0, 2).map((b) => b.name).join(" · ")}
            {p.brands.length > 2 ? ` +${p.brands.length - 2}` : ""}
          </p>
        ) : (
          <p className="text-[12px] text-ink-soft">Multiple brands</p>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-[12px] font-medium text-trust">
            <Icon name="badge-check" className="h-3.5 w-3.5" /> In Stock
          </span>
          <Rating value={p.rating.value} count={p.rating.count} />
        </div>
        <EnquireButton
          product={toEnquiryProduct(p)}
          className="btn btn-outline-accent btn-sm mt-1.5 w-full group-hover:!border-accent group-hover:!bg-accent group-hover:!text-white"
        >
          Request Quote
        </EnquireButton>
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  cols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
}: {
  products: Product[];
  cols?: string;
}) {
  return (
    <div className={`grid ${cols} gap-3 sm:gap-4`}>
      {products.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}

export function SkeletonGrid({ n = 5, cols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" }: { n?: number; cols?: string }) {
  return (
    <div className={`grid ${cols} gap-3 sm:gap-4`}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="skeleton aspect-square w-full !rounded-none" />
          <div className="p-3.5">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton mt-1.5 h-4 w-2/3" />
            <div className="skeleton mt-3 h-3 w-1/3" />
            <div className="skeleton mt-3 h-8 w-full !rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  const all = [{ label: "Home", href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="container-site">
      <ol className="flex flex-wrap items-center gap-1 py-3.5 text-[13px] text-ink-soft">
        {all.map((it, i) => {
          const last = i === all.length - 1;
          const label = (
            <span className="max-w-[260px] truncate" title={it.label}>
              {it.label}
            </span>
          );
          return (
            <li key={`${it.label}-${i}`} className="inline-flex items-center gap-1">
              {!last && it.href ? (
                <Link href={it.href} className="inline-flex items-center hover:text-accent">
                  {i === 0 && <Icon name="house" className="mr-1 h-3.5 w-3.5" />}
                  {label}
                </Link>
              ) : (
                <span className={cn("inline-flex", last && "font-medium text-ink")}>{label}</span>
              )}
              {!last && <Icon name="chevron-right" className="h-3.5 w-3.5 text-line-strong" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function SectionHead({
  eyebrow,
  title,
  sub,
  right,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  right?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={cn("mb-5 flex flex-wrap items-end justify-between gap-3", center && "justify-center text-center")}>
      <div className={center ? "mx-auto max-w-2xl" : "min-w-0 max-w-3xl"}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className={cn("section-title", eyebrow && "mt-1")}>{title}</h2>
        {sub && <p className="mt-1 text-[14px] text-ink-muted">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function MoreLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="link-more">
      {children} <Icon name="chevron-right" className="h-4 w-4" />
    </Link>
  );
}

export function EmptyState({ title, body, cta }: { title: string; body: string; cta?: ReactNode }) {
  return (
    <div className="panel px-6 py-14 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-light text-accent">
        <Icon name="package-search" className="h-6 w-6" />
      </span>
      <h2 className="mt-4 text-lg font-bold">{title}</h2>
      <p className="mx-auto mt-1.5 max-w-md text-[14px] text-ink-muted">{body}</p>
      {cta}
    </div>
  );
}

export function NotFoundBlock({ what = "page" }: { what?: string }) {
  return (
    <section className="container-site py-16">
      <div className="panel mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-6xl font-extrabold tracking-tight text-accent">404</p>
        <h1 className="mt-3 text-2xl font-bold">We couldn&apos;t find that {what}.</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-muted">
          It may have moved or is no longer listed. Browse the catalogue, or tell us what you need and we&apos;ll source it.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn btn-accent">
            Browse catalogue
          </Link>
          <Link href="/contact#rfq" className="btn btn-outline">
            Request a quote
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Dark header band used by listing / detail pages. */
export function PageHeader({
  eyebrow,
  title,
  sub,
  image,
  meta,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  image?: string;
  meta?: ReactNode;
}) {
  return (
    <section className="container-site pb-2">
      <div className="bg-hero relative overflow-hidden rounded-2xl text-white">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img(image, 1400)}
            alt=""
            className="absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover opacity-40 md:block [mask-image:linear-gradient(90deg,transparent,black_45%)]"
          />
        )}
        <div className="bg-dots pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative px-6 py-8 md:px-10 md:py-10">
          {eyebrow && <p className="eyebrow eyebrow-light">{eyebrow}</p>}
          <h1 className="mt-2 max-w-3xl text-[26px] font-extrabold leading-tight tracking-tight text-white md:text-[34px]">{title}</h1>
          {sub && <p className="mt-2 max-w-2xl text-[15px] text-white/75">{sub}</p>}
          {meta}
        </div>
      </div>
    </section>
  );
}

/** Small translucent stat chip for PageHeader meta rows. */
export function StatChip({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <span className="chip bg-white/10 text-white backdrop-blur">
      <Icon name={icon} className="h-3.5 w-3.5 text-[#ff5c6c]" />
      {children}
    </span>
  );
}
