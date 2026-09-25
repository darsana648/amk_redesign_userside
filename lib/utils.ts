import type { CategoryNode, EnquiryProduct, Product } from "./types";

/** Join class names, skipping falsy values. */
export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/** Resize Unsplash CDN images to the rendered size (no-op for other hosts). */
export function img(url: string | undefined | null, width: number, quality = 70): string {
  if (!url) return "";
  if (!/images\.unsplash\.com|plus\.unsplash\.com/.test(url)) return url;
  try {
    const u = new URL(url);
    u.searchParams.set("w", String(Math.round(width)));
    u.searchParams.set("q", String(quality));
    if (!u.searchParams.has("auto")) u.searchParams.set("auto", "format");
    if (!u.searchParams.has("fit")) u.searchParams.set("fit", "crop");
    return u.toString();
  } catch {
    return url;
  }
}

/** Trim the verbose "Segment" suffix for menus. */
export const shortLabel = (name: string) => String(name).replace(/\s+Segment$/i, "").trim();

export const titleCase = (slug: string) =>
  String(slug || "")
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");

export const leafCount = (nodes: CategoryNode[]): number =>
  nodes.reduce((n, c) => n + (c.children?.length ? leafCount(c.children) : 1), 0);

/** Compact page list with ellipsis: [1, "...", 4, 5, 6, "...", 10] */
export function pageList(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "...")[] = [1];
  const win = [current - 1, current, current + 1].filter((n) => n > 1 && n < total);
  if ((win[0] ?? total) > 2) out.push("...");
  out.push(...win);
  if ((win[win.length - 1] ?? 1) < total - 1) out.push("...");
  out.push(total);
  return out;
}

/** Strip a product down to what the enquiry form needs. */
export function toEnquiryProduct(p: Product): EnquiryProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    brands: p.brands.map((b) => ({ id: b.id, name: b.name })),
    category: p.category,
    categoryName: p.categoryName,
  };
}
