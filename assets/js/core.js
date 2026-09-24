/* =========================================================================
   Core: routing, icons, API client (with offline snapshot fallback),
   data mappers and the small UI components shared by every page.
   ========================================================================= */
(function () {
  const AMK = window.AMK;

  /* ----------------------------------------------------------------------
     Helpers
     ---------------------------------------------------------------------- */
  AMK.esc = function (value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  AMK.qs = function (name) {
    return new URLSearchParams(window.location.search).get(name);
  };

  AMK.titleCase = function (slug) {
    return String(slug || "")
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
  };

  /** Resize Unsplash CDN images to the rendered size (no-op for other hosts). */
  AMK.img = function (url, width, quality = 70) {
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
  };

  /* ----------------------------------------------------------------------
     Routing — the backend and staff portal speak in the original Next.js
     routes (/category/x, /collection/x …). Map them onto the static pages.
     ---------------------------------------------------------------------- */
  AMK.url = function (path) {
    if (!path) return "index.html";
    if (/^(https?:|mailto:|tel:|#|javascript:)/i.test(path)) return path;
    if (/\.html(?:[?#]|$)/.test(path)) return path;

    let rest = path;
    let hash = "";
    let query = "";
    const h = rest.indexOf("#");
    if (h >= 0) { hash = rest.slice(h); rest = rest.slice(0, h); }
    const q = rest.indexOf("?");
    if (q >= 0) { query = rest.slice(q + 1); rest = rest.slice(0, q); }

    const [a, b] = rest.replace(/^\/+|\/+$/g, "").split("/");
    const withQuery = (page, extra) => {
      const params = new URLSearchParams(query);
      if (extra) Object.entries(extra).forEach(([k, v]) => params.set(k, v));
      const s = params.toString();
      return `${page}${s ? `?${s}` : ""}${hash}`;
    };

    const detail = { category: "category.html", product: "product.html", collection: "collection.html", segment: "segment.html" };
    if (!a) return withQuery("index.html");
    if (detail[a] && b) return withQuery(detail[a], { slug: decodeURIComponent(b) });

    const simple = {
      shop: "shop.html", products: "shop.html", segments: "segments.html", about: "about.html",
      contact: "contact.html", faqs: "faqs.html", terms: "terms.html", privacy: "privacy.html",
      returns: "returns.html", shipping: "shipping.html",
    };
    if (simple[a] && !b) return withQuery(simple[a]);
    return "404.html";
  };

  /** The original route of the current page — used for ad-popup targeting. */
  AMK.currentRoute = function () {
    const page = (location.pathname.split("/").pop() || "index.html").replace(/\.html$/, "");
    const slug = AMK.qs("slug");
    if (page === "index" || page === "") return "/";
    if (slug && ["category", "product", "collection", "segment"].includes(page)) return `/${page}/${slug}`;
    return `/${page}`;
  };

  /* ----------------------------------------------------------------------
     Icons (Lucide). Components emit <i data-lucide="…">; an observer turns
     them into SVGs whenever new markup lands in the page.
     ---------------------------------------------------------------------- */
  AMK.i = function (name, cls = "h-4 w-4") {
    return `<i data-lucide="${name}" class="${cls}" aria-hidden="true"></i>`;
  };
  let iconQueued = false;
  AMK.refreshIcons = function () {
    if (iconQueued) return;
    iconQueued = true;
    requestAnimationFrame(() => {
      iconQueued = false;
      if (window.lucide && document.querySelector("i[data-lucide]")) {
        window.lucide.createIcons({ attrs: { "stroke-width": 1.75 } });
      }
    });
  };
  document.addEventListener("DOMContentLoaded", () => {
    AMK.refreshIcons();
    new MutationObserver(() => {
      if (document.querySelector("i[data-lucide]")) AMK.refreshIcons();
    }).observe(document.body, { childList: true, subtree: true });
  });

  /* ----------------------------------------------------------------------
     API client
     ---------------------------------------------------------------------- */
  const DOWN_KEY = "amk_api_down_until";
  function apiMarkedDown() {
    try { return Number(sessionStorage.getItem(DOWN_KEY) || 0) > Date.now(); } catch { return false; }
  }
  function markApiDown() {
    try { sessionStorage.setItem(DOWN_KEY, String(Date.now() + 5 * 60 * 1000)); } catch { /* ignore */ }
  }

  AMK.apiUrl = function (path) {
    const clean = path.startsWith("/") ? path : `/${path}`;
    return `${AMK.config.API_BASE.replace(/\/$/, "")}${clean}`;
  };

  let snapshotPromise = null;
  function loadSnapshot() {
    if (window.AMK_SNAPSHOT) return Promise.resolve(window.AMK_SNAPSHOT);
    if (!snapshotPromise) {
      snapshotPromise = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = AMK.config.SNAPSHOT_SRC;
        s.onload = () => resolve(window.AMK_SNAPSHOT);
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    return snapshotPromise;
  }

  /** GET a backend path. Returns parsed JSON, or null (404 / unavailable). */
  const inflight = new Set();
  AMK.get = async function (path) {
    if (!apiMarkedDown()) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 10000);
      inflight.add(ctrl);
      try {
        const res = await fetch(AMK.apiUrl(path), { headers: { Accept: "application/json" }, signal: ctrl.signal });
        if (res.ok) return await res.json();
        if (res.status === 404) return null;
      } catch {
        // One failure (CORS / offline / timeout) means the API is unreachable:
        // stop waiting on the other requests and serve everything from the snapshot.
        markApiDown();
        inflight.forEach((c) => c.abort());
      } finally {
        clearTimeout(timer);
        inflight.delete(ctrl);
      }
    }
    if (!AMK.config.SNAPSHOT_FALLBACK) return null;
    try {
      const snap = await loadSnapshot();
      if (!AMK.usingSnapshot) {
        AMK.usingSnapshot = true;
        console.info("[AMK] Live API unreachable — showing bundled snapshot data.");
      }
      return resolveSnapshot(snap, path);
    } catch {
      return null;
    }
  };

  /** POST JSON to the live backend (never falls back). */
  AMK.post = async function (path, body) {
    const res = await fetch(AMK.apiUrl(path), {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return res.json().catch(() => ({}));
  };

  /* ----------------------------------------------------------------------
     Snapshot resolver — answers the same endpoints from bundled data.
     ---------------------------------------------------------------------- */
  let snapIndex = null;
  function indexSnapshot(snap) {
    if (snapIndex) return snapIndex;
    const bySlug = {};
    const parent = {};
    (function walk(nodes, par) {
      nodes.forEach((n) => {
        bySlug[n.slug] = n;
        parent[n.slug] = par;
        if (n.children) walk(n.children, n.slug);
      });
    })(snap.tree, null);
    snapIndex = { bySlug, parent };
    return snapIndex;
  }
  function descendants(snap, slug) {
    const { bySlug } = indexSnapshot(snap);
    const out = new Set();
    (function walk(n) {
      if (!n) return;
      out.add(n.slug);
      (n.children || []).forEach(walk);
    })(bySlug[slug]);
    return out;
  }
  function productsUnder(snap, slug) {
    const set = descendants(snap, slug);
    return snap.products.filter((p) => set.has(p.category_slug));
  }
  function uniqueBrands(products) {
    const seen = new Map();
    products.forEach((p) => (p.brands || []).forEach((b) => seen.set(b.id, b)));
    return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
  }
  function stripKids(n) {
    return { ...n, children: (n.children || []).map((c) => ({ ...c })) };
  }

  function resolveSnapshot(snap, path) {
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
      if (category) list = productsUnder(snap, category);
      if (segment) {
        const s = AMK.SEGMENTS.find((x) => x.id === segment);
        if (s) list = productsUnder(snap, s.root);
      }
      if (q) {
        list = list.filter((p) =>
          [p.name, p.short_description, p.category_name, ...(p.brands || []).map((b) => b.name)]
            .join(" ").toLowerCase().includes(q));
      }
      const sort = params.get("sort");
      if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
      if (sort === "brand") list.sort((a, b) => ((a.brands || [])[0]?.name || "~").localeCompare((b.brands || [])[0]?.name || "~"));
      if (sort === "oldest") list.sort((a, b) => a.id - b.id);
      const limit = Number(params.get("limit"));
      return limit ? list.slice(0, limit) : list;
    }

    if (seg[0] === "products" && seg[1] && seg[2] === "spec-form") return null;
    if (seg[0] === "products" && seg[1]) {
      const p = snap.products.find((x) => x.slug === seg[1]);
      if (!p) return null;
      const { bySlug } = indexSnapshot(snap);
      const cat = bySlug[p.category_slug];
      return { ...p, category: cat ? { id: cat.id, name: cat.name, slug: cat.slug, image: cat.image } : undefined };
    }

    if (seg[0] === "categories" && seg[1] && seg[2] === "children") {
      const n = indexSnapshot(snap).bySlug[seg[1]];
      return n ? { children: n.children || [] } : null;
    }

    if (seg[0] === "categories" && seg[1] && seg[2] === "page") {
      const { bySlug, parent } = indexSnapshot(snap);
      const node = bySlug[seg[1]];
      if (!node) return null;
      const path = [];
      for (let s = node.slug; s; s = parent[s]) path.unshift(stripKids(bySlug[s]));
      const isLeaf = !(node.children || []).length;
      const all = productsUnder(snap, node.slug);
      return {
        category: stripKids(node),
        path,
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
      let list;
      if (indexSnapshot(snap).bySlug[slug]) list = productsUnder(snap, slug);
      else if (slug === "industrial-automation") list = productsUnder(snap, "industrial-segment");
      else if (slug === "clean-energy") list = productsUnder(snap, "energy-sustainability-segment");
      else if (slug === "new-arrivals") list = snap.products.slice().sort((a, b) => b.id - a.id).slice(0, 48);
      else list = sections.flatMap((s) => s.products || []);
      const page = Math.max(1, Number(params.get("page")) || 1);
      const size = 24;
      return {
        block: {
          slug, kind: "product_category", eyebrow: grid.eyebrow || "", title: grid.title || AMK.titleCase(slug),
          subtitle: grid.subtitle || (banner && banner.subtitle) || "", banner_image: (banner && banner.banner_image) || "",
        },
        count: list.length, page, page_size: size,
        results: list.slice((page - 1) * size, page * size),
      };
    }
    return null;
  }

  /* ----------------------------------------------------------------------
     Mappers (API → UI shape) — identical rules to the Next.js site.
     ---------------------------------------------------------------------- */
  const num = (v) => {
    if (v === null || v === undefined || v === "") return 0;
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  AMK.mapProduct = function (p) {
    const brands = (p.brands || []).map((b) => ({ id: b.id, name: b.name, slug: b.slug, image: b.image }));
    const product = {
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
    AMK.products[product.slug] = product;
    return product;
  };
  AMK.mapProducts = (list) => (list || []).map(AMK.mapProduct);

  /** Registry so "Request Quote" buttons can find their product by slug. */
  AMK.products = {};

  /* ----------------------------------------------------------------------
     Shared UI components (return HTML strings)
     ---------------------------------------------------------------------- */
  AMK.ui = {};

  AMK.ui.rating = function (value, count, size = "xs") {
    const cls = size === "md" ? "h-4 w-4" : "h-3 w-3";
    return `<span class="inline-flex items-center gap-1" title="${value} out of 5">
      ${AMK.i("star", `${cls} fill-current text-[#ffb400]`)}
      <span class="text-[12px] font-semibold text-ink">${Number(value).toFixed(1)}</span>
      ${count != null ? `<span class="text-[12px] text-ink-soft">(${count})</span>` : ""}
    </span>`;
  };

  /** Marketplace product card — no price (trading model), one clear CTA. */
  AMK.ui.productCard = function (p) {
    const E = AMK.esc;
    const href = AMK.url(`/product/${p.slug}`);
    const brands = p.brands && p.brands.length
      ? `<p class="truncate text-[12px] text-ink-soft" title="${E(p.brands.map((b) => b.name).join(", "))}">
           ${E(p.brands.slice(0, 2).map((b) => b.name).join(" · "))}${p.brands.length > 2 ? ` +${p.brands.length - 2}` : ""}
         </p>`
      : `<p class="text-[12px] text-ink-soft">Multiple brands</p>`;
    return `
    <article class="card card-hover group relative flex flex-col overflow-hidden">
      <div class="absolute left-2.5 top-2.5 z-10 flex gap-1">
        ${p.isHot ? `<span class="badge badge-hot">HOT</span>` : ""}
        ${p.isNew ? `<span class="badge badge-new">NEW</span>` : ""}
      </div>
      <a href="${href}" class="block bg-white" aria-label="${E(p.name)}">
        <div class="relative aspect-square w-full overflow-hidden">
          <img src="${E(AMK.img(p.image, 360))}" alt="${E(p.name)}" loading="lazy" decoding="async"
               class="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105" />
        </div>
      </a>
      <div class="flex flex-1 flex-col gap-1.5 border-t border-line px-3.5 pb-3.5 pt-3">
        <a href="${href}" title="${E(p.name)}"
           class="line-clamp-2 min-h-[2.6em] text-[14px] font-semibold leading-snug text-ink hover:text-accent">${E(p.name)}</a>
        ${brands}
        <div class="flex items-center justify-between gap-2">
          <span class="inline-flex items-center gap-1 text-[12px] font-medium text-trust">
            ${AMK.i("badge-check", "h-3.5 w-3.5")} In Stock
          </span>
          ${AMK.ui.rating(p.rating.value, p.rating.count)}
        </div>
        <button type="button" data-enquire="${E(p.slug)}" class="btn btn-outline-accent btn-sm mt-1.5 w-full group-hover:!border-accent group-hover:!bg-accent group-hover:!text-white">
          Request Quote
        </button>
      </div>
    </article>`;
  };

  AMK.ui.productGrid = function (products, cols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5") {
    return `<div class="grid ${cols} gap-3 sm:gap-4">${products.map(AMK.ui.productCard).join("")}</div>`;
  };

  AMK.ui.skeletonGrid = function (n = 5, cols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5") {
    return `<div class="grid ${cols} gap-3 sm:gap-4">${Array.from({ length: n }, () => `
      <div class="card overflow-hidden"><div class="skeleton aspect-square w-full !rounded-none"></div>
      <div class="p-3.5"><div class="skeleton h-4 w-full"></div><div class="skeleton mt-1.5 h-4 w-2/3"></div>
      <div class="skeleton mt-3 h-3 w-1/3"></div><div class="skeleton mt-3 h-8 w-full !rounded-full"></div></div></div>`).join("")}</div>`;
  };

  AMK.ui.breadcrumb = function (items) {
    const E = AMK.esc;
    const all = [{ label: "Home", href: "/" }, ...items];
    return `<nav aria-label="Breadcrumb" class="container-site">
      <ol class="flex flex-wrap items-center gap-1 py-3.5 text-[13px] text-ink-soft">
        ${all.map((it, i) => {
          const last = i === all.length - 1;
          const label = `<span class="max-w-[260px] truncate" title="${E(it.label)}">${E(it.label)}</span>`;
          const node = !last && it.href
            ? `<a href="${AMK.url(it.href)}" class="inline-flex items-center hover:text-accent">${i === 0 ? AMK.i("house", "mr-1 h-3.5 w-3.5") : ""}${label}</a>`
            : `<span class="inline-flex ${last ? "font-medium text-ink" : ""}">${label}</span>`;
          return `<li class="inline-flex items-center gap-1">${node}${last ? "" : AMK.i("chevron-right", "h-3.5 w-3.5 text-line-strong")}</li>`;
        }).join("")}
      </ol>
    </nav>`;
  };

  AMK.ui.sectionHead = function ({ eyebrow, title, sub, right = "", center = false }) {
    const E = AMK.esc;
    return `<div class="mb-5 flex flex-wrap items-end justify-between gap-3 ${center ? "justify-center text-center" : ""}">
      <div class="${center ? "mx-auto max-w-2xl" : "min-w-0 max-w-3xl"}">
        ${eyebrow ? `<p class="eyebrow">${E(eyebrow)}</p>` : ""}
        <h2 class="section-title ${eyebrow ? "mt-1" : ""}">${E(title)}</h2>
        ${sub ? `<p class="mt-1 text-[14px] text-ink-muted">${E(sub)}</p>` : ""}
      </div>
      ${right}
    </div>`;
  };

  /** Brand logo strip with prev/next arrows when it overflows. */
  AMK.ui.brandSlider = function (brands, variant = "gallery") {
    const E = AMK.esc;
    if (!brands || !brands.length) return `<p class="text-sm text-ink-soft">No brands available yet.</p>`;
    const chip = (b) => {
      const initials = b.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
      const logo = b.image
        ? `<img src="${E(b.image)}" alt="" loading="lazy" class="h-full w-full object-contain" />`
        : `<span class="text-[13px] font-bold text-navy">${E(initials)}</span>`;
      return variant === "compact"
        ? `<span class="inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-white py-1 pl-1 pr-3 text-[13px] font-medium text-ink">
             <span class="grid h-6 w-6 place-items-center overflow-hidden rounded-full bg-canvas p-0.5">${logo}</span>${E(b.name)}</span>`
        : `<span class="inline-flex w-36 shrink-0 flex-col items-center gap-2 rounded-xl border border-line bg-white px-3 py-3 text-center text-[13px] font-medium text-ink transition hover:border-accent">
             <span class="grid h-12 w-full place-items-center overflow-hidden">${logo}</span><span class="w-full truncate">${E(b.name)}</span></span>`;
    };
    const arrow = (dir) => `<button type="button" data-dir="${dir}" aria-label="${dir < 0 ? "Previous" : "Next"} brands"
      class="brand-arrow absolute top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink shadow-lift hover:text-accent ${dir < 0 ? "-left-3" : "-right-3"}">
      ${AMK.i(dir < 0 ? "chevron-left" : "chevron-right", "h-4 w-4")}</button>`;
    return `<div class="relative" data-brand-slider>
      ${arrow(-1)}
      <div class="brand-track no-scrollbar flex gap-2.5 overflow-x-auto scroll-smooth py-1">${brands.map(chip).join("")}</div>
      ${arrow(1)}
    </div>`;
  };

  AMK.initBrandSliders = function (root = document) {
    root.querySelectorAll("[data-brand-slider]:not([data-ready])").forEach((wrap) => {
      wrap.setAttribute("data-ready", "1");
      const track = wrap.querySelector(".brand-track");
      const [prev, next] = wrap.querySelectorAll(".brand-arrow");
      const update = () => {
        const over = track.scrollWidth > track.clientWidth + 4;
        const canPrev = track.scrollLeft > 4;
        const canNext = over && track.scrollLeft + track.clientWidth < track.scrollWidth - 4;
        prev.classList.toggle("hidden", !canPrev);
        prev.classList.toggle("flex", canPrev);
        next.classList.toggle("hidden", !canNext);
        next.classList.toggle("flex", canNext);
      };
      [prev, next].forEach((btn) => btn.addEventListener("click", () => {
        track.scrollBy({ left: Number(btn.dataset.dir) * Math.max(200, track.clientWidth * 0.8), behavior: "smooth" });
      }));
      track.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      update();
    });
  };

  /** Compact page list with ellipsis: [1, "...", 4, 5, 6, "...", 10] */
  AMK.pageList = function (current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const out = [1];
    const win = [current - 1, current, current + 1].filter((n) => n > 1 && n < total);
    if ((win[0] ?? total) > 2) out.push("...");
    out.push(...win);
    if ((win[win.length - 1] ?? 1) < total - 1) out.push("...");
    out.push(total);
    return out;
  };

  AMK.ui.emptyState = function (title, body, cta = "") {
    return `<div class="panel px-6 py-14 text-center">
      <span class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-light text-accent">${AMK.i("package-search", "h-6 w-6")}</span>
      <h2 class="mt-4 text-lg font-bold">${AMK.esc(title)}</h2>
      <p class="mx-auto mt-1.5 max-w-md text-[14px] text-ink-muted">${AMK.esc(body)}</p>
      ${cta}
    </div>`;
  };

  AMK.ui.notFound = function (what = "page") {
    return `<section class="container-site py-16">
      <div class="panel mx-auto max-w-2xl px-6 py-16 text-center">
        <p class="text-6xl font-extrabold tracking-tight text-accent">404</p>
        <h1 class="mt-3 text-2xl font-bold">We couldn't find that ${AMK.esc(what)}.</h1>
        <p class="mx-auto mt-3 max-w-md text-ink-muted">It may have moved or is no longer listed. Browse the catalogue, or tell us what you need and we'll source it.</p>
        <div class="mt-7 flex flex-wrap justify-center gap-3">
          <a href="shop.html" class="btn btn-accent">Browse catalogue</a>
          <a href="contact.html#rfq" class="btn btn-outline">Request a quote</a>
        </div>
      </div>
    </section>`;
  };

  /** Dark header band used by listing / detail pages. */
  AMK.ui.pageHeader = function ({ eyebrow, title, sub, image, meta = "" }) {
    const E = AMK.esc;
    return `<section class="container-site pb-2">
      <div class="bg-hero relative overflow-hidden rounded-2xl text-white">
        ${image ? `<img src="${E(AMK.img(image, 1400))}" alt="" class="absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover opacity-40 md:block [mask-image:linear-gradient(90deg,transparent,black_45%)]" />` : ""}
        <div class="bg-dots pointer-events-none absolute inset-0 opacity-40"></div>
        <div class="relative px-6 py-8 md:px-10 md:py-10">
          ${eyebrow ? `<p class="eyebrow eyebrow-light">${E(eyebrow)}</p>` : ""}
          <h1 class="mt-2 max-w-3xl text-[26px] font-extrabold leading-tight tracking-tight text-white md:text-[34px]">${E(title)}</h1>
          ${sub ? `<p class="mt-2 max-w-2xl text-[15px] text-white/75">${E(sub)}</p>` : ""}
          ${meta}
        </div>
      </div>
    </section>`;
  };
})();
