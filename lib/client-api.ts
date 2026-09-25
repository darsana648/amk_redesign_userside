/* Browser-side API helpers. They go through the Next.js proxy route
   (app/api/amk/[...path]) so the backend's CORS policy never blocks them. */
import type { ApiBrand } from "./types";

/** /products/brands/?x=1 → /api/amk/products/brands?x=1 (the proxy re-adds the slash). */
export const proxyUrl = (path: string) => {
  const [p, q] = path.split("?");
  const clean = `/${p.replace(/^\/+|\/+$/g, "")}`;
  return `/api/amk${clean}${q ? `?${q}` : ""}`;
};

export async function clientGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(proxyUrl(path), { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function clientPost<T = unknown>(path: string, body: unknown): Promise<T> {
  const res = await fetch(proxyUrl(path), {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json().catch(() => ({}) as T);
}

/** Brand list for the enquiry picker — fetched once per page load. */
let brandsPromise: Promise<ApiBrand[]> | null = null;
export const getBrandsCached = () =>
  (brandsPromise ||= clientGet<ApiBrand[]>("/products/brands/").then((d) => (Array.isArray(d) ? d : [])));
