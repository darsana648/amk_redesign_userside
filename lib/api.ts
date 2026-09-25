/* =========================================================================
   Server-side API client for the AMK backend.
   Pages are server components, so the browser never calls the backend
   directly for page data (no CORS issues). Browser-side calls (brands,
   spec forms, popups, enquiry submissions) go through /api/amk/*, a small
   proxy route in app/api/amk/[...path]/route.ts.
   ========================================================================= */
import "server-only";
import { API_BASE, SEGMENTS, SNAPSHOT_FALLBACK } from "./site";
import { resolveSnapshot } from "./snapshot";
import type {
  ApiBrand,
  ApiCategory,
  ApiProduct,
  CategoryNode,
  CategoryPage,
  CollectionPage,
  HeroBanner,
  HomeSection,
  Product,
} from "./types";

/** GET a backend path. Returns parsed JSON, or null (404 / unavailable). */
export async function apiGet<T>(path: string): Promise<T | null> {
  const clean = path.startsWith("/") ? path : `/${path}`;
  try {
    const res = await fetch(`${API_BASE}${clean}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) return (await res.json()) as T;
    if (res.status === 404) return null;
  } catch {
    /* network error / timeout — fall through to the snapshot */
  }
  if (!SNAPSHOT_FALLBACK) return null;
  return resolveSnapshot(clean) as T | null;
}

/* ---------------------------------------------------------------------- */
/* Mappers (API → UI shape) — identical rules to the previous storefront. */
/* ---------------------------------------------------------------------- */
const num = (v: string | number | null | undefined) => {
  if (v === null || v === undefined || v === "") return 0;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
};

export function mapProduct(p: ApiProduct): Product {
  const brands = (p.brands || []).map((b) => ({ id: b.id, name: b.name, slug: b.slug, image: b.image }));
  return {
    id: String(p.id),
    slug: p.slug,
    name: p.name,
    brand: brands[0]?.name,
    brands,
    category: p.category_slug || p.category?.slug || "",
    categoryName: p.category_name || p.category?.name || "",
    image: p.image,
    gallery: p.images?.length ? p.images.map((i) => i.image) : undefined,
    price: num(p.price),
    shortDescription: p.short_description || undefined,
    description: p.description || undefined,
    inStock: p.stock > 0,
    isHot: !!p.is_hot,
    isNew: !!p.is_new,
    rating: {
      value: p.is_hot ? 4.8 : p.is_new ? 4.6 : 4.5,
      count: Math.max(8, Math.min(180, p.stock || 24)),
    },
    features: p.features || [],
    tags: (p.tags || []).map((t) => t.tag_name),
  };
}
export const mapProducts = (list?: ApiProduct[] | null) => (list || []).map(mapProduct);

/* ---------------------------------------------------------------------- */
/* Typed getters                                                          */
/* ---------------------------------------------------------------------- */
export async function getCategoryTree(): Promise<CategoryNode[]> {
  const d = await apiGet<CategoryNode[]>("/categories/tree/");
  return Array.isArray(d) ? d : [];
}

export async function getHero(): Promise<{ slides: HeroBanner[]; cards: HeroBanner[] }> {
  const d = await apiGet<{ slides?: HeroBanner[]; cards?: HeroBanner[] }>("/hero/");
  return { slides: d?.slides || [], cards: d?.cards || [] };
}

export async function getHomeSections(): Promise<HomeSection[]> {
  const d = await apiGet<{ sections?: HomeSection[] }>("/home/");
  return d?.sections || [];
}

export async function getBrands(): Promise<ApiBrand[]> {
  const d = await apiGet<ApiBrand[]>("/products/brands/");
  return Array.isArray(d) ? d : [];
}

export async function getCategories(): Promise<ApiCategory[]> {
  const d = await apiGet<ApiCategory[]>("/categories/");
  return Array.isArray(d) ? d : [];
}

export async function getProducts(opts: { q?: string; sort?: string; segment?: string; limit?: number } = {}) {
  const params = new URLSearchParams();
  if (opts.q) params.set("q", opts.q);
  if (opts.sort && opts.sort !== "default") params.set("sort", opts.sort);
  if (opts.segment) params.set("segment", opts.segment);
  if (opts.limit) params.set("limit", String(opts.limit));
  const qs = params.toString();
  const d = await apiGet<ApiProduct[]>(`/products/${qs ? `?${qs}` : ""}`);
  return mapProducts(Array.isArray(d) ? d : []);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const d = await apiGet<ApiProduct>(`/products/${encodeURIComponent(slug)}/`);
  return d && d.slug ? mapProduct(d) : null;
}

export async function getCategoryPage(slug: string): Promise<CategoryPage | null> {
  const d = await apiGet<CategoryPage>(`/categories/${encodeURIComponent(slug)}/page/`);
  return d && d.category ? d : null;
}

export async function getCategoryChildren(slug: string): Promise<CategoryNode[]> {
  const d = await apiGet<{ children?: CategoryNode[] }>(`/categories/${encodeURIComponent(slug)}/children/`);
  return d?.children || [];
}

export async function getCollection(slug: string, page = 1): Promise<CollectionPage | null> {
  const d = await apiGet<CollectionPage>(`/collections/${encodeURIComponent(slug)}/?page=${page}`);
  return d && d.block ? d : null;
}

export const segmentBySlug = (slug: string) => SEGMENTS.find((s) => s.slug === slug) || null;
