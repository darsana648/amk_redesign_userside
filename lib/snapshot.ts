/* =========================================================================
   Offline snapshot resolver (server only).
   Answers the same backend endpoints from lib/data/snapshot.json when the
   live API can't be reached. Refresh the data with `npm run snapshot`.
   ========================================================================= */
import "server-only";
import snapshotData from "./data/snapshot.json";
import { SEGMENTS } from "./site";
import { titleCase } from "./utils";
import type { ApiBrand, ApiProduct, HomeSection } from "./types";

type SnapNode = { id: number; name: string; slug: string; image: string; children?: SnapNode[] };
type Snapshot = {
  home: { sections: HomeSection[] };
  hero: unknown;
  tree: SnapNode[];
  categories: unknown;
  brands: unknown;
  products: ApiProduct[];
  popups: unknown;
};

const snap = snapshotData as unknown as Snapshot;

let index: { bySlug: Record<string, SnapNode>; parent: Record<string, string | null> } | null = null;
function indexSnapshot() {
  if (index) return index;
  const bySlug: Record<string, SnapNode> = {};
  const parent: Record<string, string | null> = {};
  const walk = (nodes: SnapNode[], par: string | null) =>
    nodes.forEach((n) => {
      bySlug[n.slug] = n;
      parent[n.slug] = par;
      if (n.children) walk(n.children, n.slug);
    });
  walk(snap.tree, null);
  index = { bySlug, parent };
  return index;
}

function descendants(slug: string) {
  const out = new Set<string>();
  const walk = (n?: SnapNode) => {
    if (!n) return;
    out.add(n.slug);
    (n.children || []).forEach(walk);
  };
  walk(indexSnapshot().bySlug[slug]);
  return out;
}

const productsUnder = (slug: string) => {
  const set = descendants(slug);
  return snap.products.filter((p) => set.has(p.category_slug || ""));
};

function uniqueBrands(products: ApiProduct[]) {
  const seen = new Map<number, ApiBrand>();
  products.forEach((p) => (p.brands || []).forEach((b) => seen.set(b.id, b)));
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
}

const stripKids = (n: SnapNode) => ({ ...n, children: (n.children || []).map((c) => ({ ...c })) });

export function resolveSnapshot(path: string): unknown {
  const [pathname, query = ""] = path.split("?");
  const params = new URLSearchParams(query);
  const seg = pathname.replace(/^\/+|\/+$/g, "").split("/");

  if (pathname === "/home/") return snap.home;
  if (pathname === "/hero/") return snap.hero;
  if (pathname === "/categories/tree/") return snap.tree;
  if (pathname === "/categories/") return snap.categories;
  if (pathname === "/products/brands/") return snap.brands;
  if (pathname.startsWith("/ad-popups/")) return snap.popups;

  if (pathname === "/products/") {
    let list = snap.products.slice();
    const category = params.get("category");
    const segment = params.get("segment");
    const q = (params.get("q") || "").trim().toLowerCase();
    if (category) list = productsUnder(category);
    if (segment) {
      const s = SEGMENTS.find((x) => x.id === segment);
      if (s) list = productsUnder(s.root);
    }
    if (q) {
      list = list.filter((p) =>
        [p.name, p.short_description, p.category_name, ...(p.brands || []).map((b) => b.name)]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    const sort = params.get("sort");
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "brand")
      list.sort((a, b) => ((a.brands || [])[0]?.name || "~").localeCompare((b.brands || [])[0]?.name || "~"));
    if (sort === "oldest") list.sort((a, b) => a.id - b.id);
    const limit = Number(params.get("limit"));
    return limit ? list.slice(0, limit) : list;
  }

  if (seg[0] === "products" && seg[1] && seg[2] === "spec-form") return null;
  if (seg[0] === "products" && seg[1]) {
    const p = snap.products.find((x) => x.slug === seg[1]);
    if (!p) return null;
    const cat = indexSnapshot().bySlug[p.category_slug || ""];
    return { ...p, category: cat ? { id: cat.id, name: cat.name, slug: cat.slug, image: cat.image } : undefined };
  }

  if (seg[0] === "categories" && seg[1] && seg[2] === "children") {
    const n = indexSnapshot().bySlug[seg[1]];
    return n ? { children: n.children || [] } : null;
  }

  if (seg[0] === "categories" && seg[1] && seg[2] === "page") {
    const { bySlug, parent } = indexSnapshot();
    const node = bySlug[seg[1]];
    if (!node) return null;
    const trail = [];
    for (let s: string | null = node.slug; s; s = parent[s]) trail.unshift(stripKids(bySlug[s]));
    const isLeaf = !(node.children || []).length;
    const all = productsUnder(node.slug);
    return {
      category: stripKids(node),
      path: trail,
      children: node.children || [],
      is_leaf: isLeaf,
      products: isLeaf ? all : [],
      segment_products: isLeaf ? [] : all.slice(0, 10),
      brands: uniqueBrands(all),
    };
  }

  if (seg[0] === "collections" && seg[1]) {
    const slug = seg[1];
    const sections = (snap.home.sections || []).filter((s) => s.promo_slug === slug);
    if (!sections.length) return null;
    const grid = sections.find((s) => s.kind === "product_grid") || sections[0];
    const banner = sections.find((s) => s.kind === "banner");
    let list: ApiProduct[];
    if (indexSnapshot().bySlug[slug]) list = productsUnder(slug);
    else if (slug === "industrial-automation") list = productsUnder("industrial-segment");
    else if (slug === "clean-energy") list = productsUnder("energy-sustainability-segment");
    else if (slug === "new-arrivals") list = snap.products.slice().sort((a, b) => b.id - a.id).slice(0, 48);
    else list = sections.flatMap((s) => s.products || []);
    const page = Math.max(1, Number(params.get("page")) || 1);
    const size = 24;
    return {
      block: {
        slug,
        kind: "product_category",
        eyebrow: grid.eyebrow || "",
        title: grid.title || titleCase(slug),
        subtitle: grid.subtitle || banner?.subtitle || "",
        banner_image: banner?.banner_image || "",
      },
      count: list.length,
      page,
      page_size: size,
      results: list.slice((page - 1) * size, page * size),
    };
  }
  return null;
}
