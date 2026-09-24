/* AMK — data layer.
 * Same endpoints and mapping as lib/api/*.ts in the Next.js storefront.
 * Every getter tries the live API first and falls back to the bundled
 * AMK_DATA so the static pages always render. */
(function () {
  const CFG = window.AMK_CONFIG;
  const DATA = window.AMK_DATA || {};
  const AMK = (window.AMK = window.AMK || {});

  /* ------------------------------------------------------------------ */
  /* URL helpers — translate storefront routes to static pages           */
  /* ------------------------------------------------------------------ */
  const url = {
    home: () => "index.html",
    shop: (params) => "shop.html" + (params ? "?" + new URLSearchParams(params) : ""),
    category: (slug) => "category.html?slug=" + encodeURIComponent(slug),
    product: (slug) => "product.html?slug=" + encodeURIComponent(slug),
    segment: (slug) => "segment.html?slug=" + encodeURIComponent(slug),
    collection: (slug) => "collection.html?slug=" + encodeURIComponent(slug),
    /** Convert a Next.js route ("/category/x", "/contact#rfq") into a static page URL. */
    fromPath(path) {
      if (!path) return "#";
      if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
      if (/\.html/.test(path)) return path;
      const m = path.match(/^\/?([^?#]*)(\?[^#]*)?(#.*)?$/);
      const parts = (m[1] || "").split("/").filter(Boolean);
      const query = m[2] || "";
      const hash = m[3] || "";
      if (!parts.length) return "index.html" + hash;
      const [first, slug] = parts;
      if (slug && ["category", "product", "segment", "collection"].includes(first)) {
        return url[first](slug) + hash;
      }
      return first + ".html" + query + hash;
    },
  };
  AMK.url = url;
  AMK.param = (name) => new URLSearchParams(location.search).get(name);

  /* ------------------------------------------------------------------ */
  /* Fetch with timeout + circuit breaker                                */
  /* ------------------------------------------------------------------ */
  let apiDown = !CFG.apiBase || location.protocol === "file:";
  const cache = new Map();

  function apiUrl(path) {
    return CFG.apiBase.replace(/\/$/, "") + (path.startsWith("/") ? path : "/" + path);
  }

  async function fetchApi(path) {
    if (apiDown) return null;
    if (cache.has(path)) return cache.get(path);
    const p = (async () => {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), CFG.apiTimeoutMs);
      try {
        const res = await fetch(apiUrl(path), {
          headers: { Accept: "application/json" },
          signal: ctrl.signal,
        });
        if (!res.ok) return null;
        return await res.json();
      } catch (e) {
        apiDown = true; // network / CORS failure — use bundled data from now on
        return null;
      } finally {
        clearTimeout(t);
      }
    })();
    cache.set(path, p);
    return p;
  }

  /* ------------------------------------------------------------------ */
  /* Mappers (mirror lib/api/catalog.ts)                                 */
  /* ------------------------------------------------------------------ */
  const num = (v) => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  const mapBrand = (b) => ({ id: b.id, name: b.name, slug: b.slug, image: b.image });
  const mapNode = (c) => {
    const node = { slug: c.slug, name: c.name, image: c.image };
    if (c.children && c.children.length) node.children = c.children.map(mapNode);
    return node;
  };
  function mapProduct(p) {
    const brands = (p.brands || []).map(mapBrand);
    return {
      id: String(p.id),
      slug: p.slug,
      name: p.name,
      brand: brands[0] && brands[0].name,
      brands,
      category: p.category_slug || (p.category && p.category.slug) || "",
      categoryName: p.category_name || (p.category && p.category.name) || "",
      image: p.image,
      gallery: p.images && p.images.length ? p.images.map((i) => i.image) : undefined,
      price: num(p.price),
      shortDescription: p.short_description || undefined,
      description: p.description || undefined,
      inStock: p.stock > 0,
      isHot: !!p.is_hot,
      isNew: !!p.is_new,
      features: p.features || [],
      tags: (p.tags || []).map((t) => t.tag_name),
    };
  }
  const mapProducts = (list) => (list || []).map(mapProduct);

  /* Local products get the same derived fields as API ones. */
  function local(p) {
    return Object.assign({ brand: p.brands && p.brands[0] && p.brands[0].name, features: [], tags: [] }, p);
  }
  const LOCAL_PRODUCTS = (DATA.PRODUCTS || []).map(local);
  const localBySlug = (slug) => LOCAL_PRODUCTS.find((p) => p.slug === slug);

  /* ------------------------------------------------------------------ */
  /* Tree helpers                                                        */
  /* ------------------------------------------------------------------ */
  function findBySlug(slug, tree) {
    for (const n of tree) {
      if (n.slug === slug) return n;
      if (n.children) {
        const hit = findBySlug(slug, n.children);
        if (hit) return hit;
      }
    }
    return null;
  }
  function pathFor(slug, tree) {
    const path = [];
    (function walk(nodes) {
      for (const n of nodes) {
        path.push(n);
        if (n.slug === slug) return true;
        if (n.children && walk(n.children)) return true;
        path.pop();
      }
      return false;
    })(tree);
    return path;
  }
  function descendantSlugs(node) {
    const out = [];
    (function walk(n) {
      out.push(n.slug);
      (n.children || []).forEach(walk);
    })(node);
    return out;
  }
  function flatLeaves(tree) {
    const out = [];
    (function walk(nodes) {
      nodes.forEach((n) => (n.children && n.children.length ? walk(n.children) : out.push(n)));
    })(tree);
    return out;
  }
  const shortLabel = (name) => name.replace(/\s+Segment$/i, "").trim();
  AMK.tree = { findBySlug, pathFor, descendantSlugs, flatLeaves, shortLabel };

  function uniqueBrands(products) {
    const seen = new Map();
    products.forEach((p) => (p.brands || []).forEach((b) => seen.set(b.name, b)));
    return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  function segmentById(idOrSlug) {
    return CFG.segments.find((s) => s.id === idOrSlug || s.slug === idOrSlug) || null;
  }

  /* ------------------------------------------------------------------ */
  /* Public API                                                          */
  /* ------------------------------------------------------------------ */
  const api = {};

  api.getCategoryTree = async () => {
    const data = await fetchApi("/categories/tree/");
    return data ? data.map(mapNode) : DATA.CATEGORY_TREE || [];
  };

  api.getBrands = async () => {
    const data = await fetchApi("/products/brands/");
    return data && data.length ? data.map(mapBrand) : DATA.BRANDS || [];
  };

  api.getHero = async () => {
    const data = await fetchApi("/hero/");
    const fix = (b) => ({
      id: b.id, eyebrow: b.eyebrow || "", title: b.title || "", subtitle: b.subtitle || "",
      image: b.image || "", link: url.fromPath(b.link || "/shop"), ctaLabel: b.cta_label || b.ctaLabel || "",
    });
    const slides = data && data.slides && data.slides.length ? data.slides.map(fix) : DATA.HOME.hero.slides;
    const cards = data && data.cards && data.cards.length ? data.cards.map(fix) : DATA.HOME.hero.cards;
    return { slides, cards };
  };

  api.getHomePage = async () => {
    const data = await fetchApi("/home/");
    if (data && data.sections) {
      return data.sections.map((s) => ({
        id: s.id,
        kind: s.kind,
        eyebrow: s.eyebrow || "",
        title: s.title || "",
        subtitle: s.subtitle || "",
        config: s.config || {},
        viewAllHref: url.fromPath(s.view_all_href || (s.promo_slug ? "/collection/" + s.promo_slug : "/shop")),
        bannerImage: s.banner_image || null,
        ctaLabel: s.cta_label || "",
        link: s.link ? url.fromPath(s.link) : null,
        products: mapProducts(s.products),
        totalCount: s.total_count || 0,
      }));
    }
    return DATA.HOME.sections.map((s) => ({
      ...s,
      config: {},
      viewAllHref: url.collection(s.promoSlug),
      link: url.collection(s.promoSlug),
      products: s.products.map(localBySlug).filter(Boolean),
    }));
  };

  api.getCollection = async (slug, page = 1) => {
    const data = await fetchApi(`/collections/${encodeURIComponent(slug)}/?page=${page}`);
    if (data && data.block) {
      return {
        slug: data.block.slug, eyebrow: data.block.eyebrow, title: data.block.title,
        subtitle: data.block.subtitle, bannerImage: data.block.banner_image,
        products: mapProducts(data.results), count: data.count, page: data.page, pageSize: data.page_size,
      };
    }
    const c = (DATA.COLLECTIONS || {})[slug];
    if (!c) return null;
    const all = c.products.map(localBySlug).filter(Boolean);
    const pageSize = 24;
    return {
      ...c,
      products: all.slice((page - 1) * pageSize, page * pageSize),
      count: all.length, page, pageSize,
    };
  };

  api.getCategoryPage = async (slug) => {
    const data = await fetchApi(`/categories/${encodeURIComponent(slug)}/page/`);
    if (data && data.category) {
      return {
        category: mapNode(data.category),
        path: (data.path || []).map(mapNode),
        children: (data.children || []).map(mapNode),
        isLeaf: !!data.is_leaf,
        products: mapProducts(data.products),
        segmentProducts: mapProducts(data.segment_products),
        brands: (data.brands || []).map(mapBrand),
      };
    }
    const tree = DATA.CATEGORY_TREE || [];
    const node = findBySlug(slug, tree);
    if (!node) return null;
    const path = pathFor(slug, tree);
    const slugs = new Set(descendantSlugs(node));
    const rootSlugs = new Set(descendantSlugs(path[0]));
    const products = LOCAL_PRODUCTS.filter((p) => slugs.has(p.category));
    const segmentProducts = LOCAL_PRODUCTS.filter((p) => rootSlugs.has(p.category) && !slugs.has(p.category));
    return {
      category: node,
      path,
      children: node.children || [],
      isLeaf: !(node.children && node.children.length),
      products,
      segmentProducts: segmentProducts.length ? segmentProducts : LOCAL_PRODUCTS.slice(0, 10),
      brands: uniqueBrands(products),
    };
  };

  api.getProducts = async (opts = {}) => {
    const params = new URLSearchParams();
    if (opts.category) params.set("category", opts.category);
    if (opts.segment) params.set("segment", opts.segment);
    if (opts.q) params.set("q", opts.q);
    if (opts.limit) params.set("limit", String(opts.limit));
    if (opts.sort && opts.sort !== "default") params.set("sort", opts.sort);
    const qs = params.toString();
    const data = await fetchApi("/products/" + (qs ? "?" + qs : ""));
    if (Array.isArray(data)) return mapProducts(data);
    if (data && Array.isArray(data.results)) return mapProducts(data.results);

    let list = LOCAL_PRODUCTS.slice();
    const tree = DATA.CATEGORY_TREE || [];
    if (opts.category) {
      const node = findBySlug(opts.category, tree);
      const slugs = new Set(node ? descendantSlugs(node) : [opts.category]);
      list = list.filter((p) => slugs.has(p.category));
    }
    if (opts.segment) {
      const seg = segmentById(opts.segment);
      const root = seg && findBySlug(seg.rootSlug, tree);
      const slugs = new Set(root ? descendantSlugs(root) : []);
      list = list.filter((p) => p.segment === (seg && seg.id) || slugs.has(p.category));
    }
    if (opts.q) {
      const q = opts.q.toLowerCase();
      list = list.filter((p) =>
        [p.name, p.category, ...(p.brands || []).map((b) => b.name)].join(" ").toLowerCase().includes(q)
      );
    }
    if (opts.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    if (opts.sort === "brand") list.sort((a, b) => (a.brand || "").localeCompare(b.brand || ""));
    if (opts.sort === "oldest") list.reverse();
    if (opts.sort === "new") list.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    return opts.limit ? list.slice(0, opts.limit) : list;
  };

  api.getProduct = async (slug) => {
    const data = await fetchApi(`/products/${encodeURIComponent(slug)}/`);
    if (data && data.slug) return mapProduct(data);
    return localBySlug(slug) || null;
  };

  /** Dynamic spec form for the product enquiry (empty groups when none). */
  api.getProductSpecForm = async (slug) => {
    const data = await fetchApi(`/products/${encodeURIComponent(slug)}/spec-form/`);
    return data && data.groups ? data : { product: { id: 0, name: "", slug: "" }, groups: [] };
  };

  /** Active popup ads for a path (never falls back — popups are optional). */
  api.getPopups = async (path) => {
    const data = await fetchApi(`/ad-popups/?path=${encodeURIComponent(path || "/")}`);
    return (data && data.results) || [];
  };

  /** POST /inquiries/ — throws on failure so the form can show an error. */
  api.createInquiry = async (payload) => {
    if (!CFG.apiBase) throw new Error("No API configured");
    const res = await fetch(apiUrl("/inquiries/"), {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Unable to submit enquiry");
    return res.json();
  };

  api.segmentById = segmentById;
  AMK.api = api;
})();
