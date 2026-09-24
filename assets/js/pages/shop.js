/* /shop — full catalogue: ?q= search, ?sort=, brand filter, 12-per-page pagination. */
(function () {
  const AMK = window.AMK;
  const E = AMK.esc;
  const I = AMK.i;
  const PAGE_SIZE = 12;

  const q = AMK.qs("q") || "";
  const sort = AMK.qs("sort") || "default";
  const state = { products: [], categories: [], brands: [], selected: new Set(), page: 1 };

  document.getElementById("crumbs").innerHTML = AMK.ui.breadcrumb(q ? [{ label: "Catalog", href: "/shop" }, { label: `“${q}”` }] : [{ label: "Catalog" }]);
  if (q) {
    document.getElementById("shop-title").textContent = `Results for “${q}”`;
    document.title = `Search: ${q} · AMK Industrial Trading`;
  }
  document.querySelectorAll("[data-sort]").forEach((sel) => {
    sel.value = sort;
    sel.addEventListener("change", () => {
      const params = new URLSearchParams(location.search);
      if (sel.value === "default") params.delete("sort");
      else params.set("sort", sel.value);
      location.search = params.toString();
    });
  });
  document.getElementById("shop-grid").innerHTML = AMK.ui.skeletonGrid(8, "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4");

  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (sort !== "default") params.set("sort", sort);
  Promise.all([
    AMK.get(`/products/${params.toString() ? `?${params}` : ""}`),
    AMK.get("/categories/"),
    AMK.get("/products/brands/"),
  ]).then(([products, categories, brands]) => {
    state.products = AMK.mapProducts(products || []);
    state.categories = categories || [];
    state.brands = brands || [];
    renderFilters();
    render();
  });

  /* ---------------- Filters ---------------- */
  function filtersHtml() {
    const box = (title, icon, inner, extra = "") => `
      <div class="panel overflow-hidden">
        <div class="flex items-center justify-between border-b border-line px-4 py-3">
          <h3 class="flex items-center gap-2 text-[14px] font-bold">${I(icon, "h-4 w-4 text-accent")}${title}</h3>${extra}
        </div>
        <div class="px-4 py-3">${inner}</div>
      </div>`;
    const linkList = (items) => `<ul class="space-y-0.5 text-[13.5px] text-ink-muted">${items.map(([label, href]) =>
      `<li><a href="${AMK.url(href)}" class="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent-light hover:text-accent"><span class="truncate">${E(label)}</span>${I("chevron-right", "h-3.5 w-3.5 shrink-0 text-line-strong")}</a></li>`).join("")}</ul>`;

    return [
      box("Business Segments", "layers", linkList(AMK.SEGMENTS.map((s) => [s.name, `/segment/${s.slug}`]))),
      box("Product Categories", "layout-grid", linkList(state.categories.slice(0, 14).map((c) => [c.name, `/category/${c.slug}`]))),
      box("Brands", "award",
        state.brands.length
          ? `<ul class="max-h-64 space-y-1 overflow-y-auto pr-1 text-[13.5px] text-ink-muted">${state.brands.map((b) => `
              <li><label class="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1 hover:bg-canvas hover:text-ink">
                <input type="checkbox" data-brand="${b.id}" ${state.selected.has(b.id) ? "checked" : ""} class="h-4 w-4 rounded accent-[#ff6a00]" />
                <span class="flex-1 truncate">${E(b.name)}</span></label></li>`).join("")}</ul>`
          : `<p class="text-sm text-ink-soft">No brands available.</p>`,
        state.selected.size ? `<button type="button" data-clear class="text-[12.5px] font-semibold text-accent hover:underline">Clear (${state.selected.size})</button>` : ""),
      box("Availability", "package-check", `<ul class="space-y-1 text-[13.5px] text-ink-muted">${["In stock", "Ships in 24 hrs", "Project lead time"].map((s) =>
        `<li><label class="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1 hover:bg-canvas"><input type="checkbox" class="h-4 w-4 rounded accent-[#ff6a00]" />${s}</label></li>`).join("")}</ul>`),
      `<div class="panel bg-accent-light p-4 !border-accent-soft">
        <p class="text-[14px] font-bold">Can't find your product?</p>
        <p class="mt-1 text-[13px] text-ink-muted">Tell us what you need — we trade thousands of items beyond the catalogue.</p>
        <button type="button" data-post-requirement class="btn btn-accent btn-sm mt-3 w-full">${I("clipboard-list", "h-4 w-4")} Post Requirement</button>
      </div>`,
    ].join("");
  }

  function renderFilters() {
    document.getElementById("filters-desktop").innerHTML = filtersHtml();
    const drawerBody = document.getElementById("filters-drawer-body");
    if (drawerBody) drawerBody.innerHTML = filtersHtml();
  }

  document.addEventListener("change", (e) => {
    const cb = e.target.closest("[data-brand]");
    if (!cb) return;
    const id = Number(cb.dataset.brand);
    if (cb.checked) state.selected.add(id);
    else state.selected.delete(id);
    state.page = 1;
    renderFilters();
    render();
  });
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-clear]")) {
      state.selected.clear();
      state.page = 1;
      renderFilters();
      render();
    }
    const rm = e.target.closest("[data-unbrand]");
    if (rm) {
      state.selected.delete(Number(rm.dataset.unbrand));
      state.page = 1;
      renderFilters();
      render();
    }
    const pg = e.target.closest("[data-page]");
    if (pg && !pg.disabled) {
      state.page = Number(pg.dataset.page);
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  /* ---------------- Grid + pagination ---------------- */
  function render() {
    const filtered = state.selected.size
      ? state.products.filter((p) => (p.brands || []).some((b) => state.selected.has(b.id)))
      : state.products;
    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const page = Math.min(state.page, pages);
    const first = total ? (page - 1) * PAGE_SIZE + 1 : 0;
    const last = Math.min(page * PAGE_SIZE, total);

    document.getElementById("shop-count").innerHTML =
      `Showing <b class="text-ink">${first}–${last}</b> of <b class="text-ink">${total}</b> products`;

    const chips = document.getElementById("active-filters");
    const selectedBrands = state.brands.filter((b) => state.selected.has(b.id));
    chips.classList.toggle("hidden", !selectedBrands.length);
    chips.classList.toggle("flex", !!selectedBrands.length);
    chips.innerHTML = selectedBrands.map((b) => `<button type="button" data-unbrand="${b.id}" class="chip border border-accent-soft bg-accent-light text-[#b54700] hover:border-accent">${E(b.name)} ${I("x", "h-3 w-3")}</button>`).join("")
      + (selectedBrands.length ? `<button type="button" data-clear class="text-[13px] font-semibold text-accent hover:underline">Clear all</button>` : "");

    document.getElementById("shop-grid").innerHTML = total
      ? AMK.ui.productGrid(filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4")
      : AMK.ui.emptyState("No products found", q ? `Nothing matched “${q}”. Try another term, or post your requirement and we'll source it.` : "Try clearing the brand filter.",
          `<button type="button" data-post-requirement class="btn btn-accent mt-6">Post your requirement</button>`);

    const btn = (label, target, disabled, current) => `<button type="button" data-page="${target}" ${disabled ? "disabled" : ""} ${current ? 'aria-current="page"' : ""}
      class="inline-flex h-10 min-w-[40px] items-center justify-center gap-1 rounded-full border px-3 text-sm font-semibold transition
      ${current ? "border-accent bg-accent text-white" : disabled ? "cursor-not-allowed border-line bg-canvas text-line-strong" : "border-line bg-white text-ink hover:border-accent hover:text-accent"}">${label}</button>`;
    document.getElementById("shop-pages").innerHTML = pages > 1 ? `
      <div class="panel mt-5 flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <p class="text-sm text-ink-muted">Page <b class="text-ink">${page}</b> of <b class="text-ink">${pages}</b></p>
        <div class="flex flex-wrap items-center gap-1.5">
          ${btn(`${I("chevron-left", "h-4 w-4")}<span class="hidden sm:inline">Prev</span>`, page - 1, page === 1)}
          ${AMK.pageList(page, pages).map((p) => (p === "..." ? `<span class="px-1 text-ink-soft">…</span>` : btn(p, p, false, p === page))).join("")}
          ${btn(`<span class="hidden sm:inline">Next</span>${I("chevron-right", "h-4 w-4")}`, page + 1, page === pages)}
        </div>
      </div>` : "";
  }

  /* ---------------- Mobile filter drawer ---------------- */
  document.getElementById("open-filters").addEventListener("click", () => {
    const wrap = document.createElement("div");
    wrap.className = "fixed inset-0 z-[60] lg:hidden";
    wrap.innerHTML = `
      <button type="button" data-x class="absolute inset-0 cursor-default bg-navy-950/50" aria-label="Close filters"></button>
      <div role="dialog" aria-modal="true" aria-label="Filters" class="fade-up absolute inset-y-0 left-0 flex w-[86%] max-w-[360px] flex-col bg-canvas shadow-2xl">
        <div class="flex items-center justify-between border-b border-line bg-white px-4 py-3.5">
          <p class="text-[16px] font-bold">Filters</p>
          <button type="button" data-x class="grid h-9 w-9 place-items-center rounded-full bg-canvas" aria-label="Close filters">${I("x", "h-5 w-5")}</button>
        </div>
        <div id="filters-drawer-body" class="flex-1 space-y-4 overflow-y-auto p-4">${filtersHtml()}</div>
        <div class="border-t border-line bg-white p-3"><button type="button" data-x class="btn btn-accent w-full">Show results</button></div>
      </div>`;
    const close = () => { wrap.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
    const onKey = (e) => e.key === "Escape" && close();
    wrap.addEventListener("click", (e) => (e.target.closest("[data-x]") || e.target.closest("[data-post-requirement]")) && close());
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    document.body.appendChild(wrap);
  });
})();
