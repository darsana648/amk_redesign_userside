/* /category?slug= — brands, sub-category drill-down or leaf stock (GET /categories/<slug>/page/). */
(function () {
  const AMK = window.AMK;
  const E = AMK.esc;
  const I = AMK.i;
  const slug = AMK.qs("slug") || "";
  const root = document.getElementById("category-root");
  document.getElementById("cat-skeleton").innerHTML = AMK.ui.skeletonGrid(5);

  const leafCount = (nodes) => nodes.reduce((n, c) => n + (c.children?.length ? leafCount(c.children) : 1), 0);

  if (!slug) { root.innerHTML = AMK.ui.notFound("category"); return; }

  AMK.get(`/categories/${encodeURIComponent(slug)}/page/`).then((d) => {
    if (!d || !d.category) { root.innerHTML = AMK.ui.notFound("category"); return; }
    const cat = d.category;
    const children = d.children || [];
    const brands = d.brands || [];
    const products = AMK.mapProducts(d.products);
    const featured = AMK.mapProducts(d.segment_products);
    document.title = `${cat.name} - AMK`;

    const trail = (d.path || []).slice(0, -1).map((n) => ({ label: n.name, href: `/category/${n.slug}` }));
    const parent = (d.path || []).length > 1 ? d.path[d.path.length - 2] : null;

    const stat = (icon, text) => `<span class="chip bg-white/10 text-white backdrop-blur">${I(icon, "h-3.5 w-3.5 text-[#ff5c6c]")}${text}</span>`;
    const header = AMK.ui.pageHeader({
      eyebrow: parent ? parent.name : "Product category",
      title: cat.name,
      image: cat.image,
      meta: `<div class="mt-5 flex flex-wrap gap-2">
        ${stat(d.is_leaf ? "package" : "layout-grid", d.is_leaf ? `${products.length} product${products.length === 1 ? "" : "s"} listed` : `${children.length} sub-categories`)}
        ${brands.length ? stat("award", `${brands.length} brands`) : ""}
        ${stat("shield-check", "Genuine OEM stock")}
        ${stat("clock", "Quotes within 24 hours")}
      </div>`,
    });

    const brandsHtml = brands.length ? `
      <section class="container-site pt-5">
        <div class="panel p-5">
          ${AMK.ui.sectionHead({ title: `Brands available in ${cat.name}`, sub: "Looking for a brand not listed? We trade many more — just mention it in your enquiry and we'll source it for you." })}
          ${AMK.ui.brandSlider(brands, "gallery")}
        </div>
      </section>` : "";

    const childCard = (n) => {
      const kids = n.children || [];
      return `<div class="card card-hover group flex flex-col overflow-hidden">
        <a href="${AMK.url(`/category/${n.slug}`)}" class="block">
          <div class="aspect-[4/3] overflow-hidden bg-canvas">
            <img src="${E(AMK.img(n.image, 400))}" alt="${E(n.name)}" loading="lazy" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          </div>
        </a>
        <div class="flex flex-1 flex-col p-3.5">
          <a href="${AMK.url(`/category/${n.slug}`)}" class="line-clamp-2 text-[14.5px] font-semibold leading-snug text-ink hover:text-accent">${E(n.name)}</a>
          <p class="mt-0.5 text-[12.5px] text-ink-soft">${kids.length ? `${leafCount(kids)} items` : "Product group"}</p>
          ${kids.length ? `<ul class="mt-2 space-y-1 text-[12.5px] text-ink-muted">
            ${kids.slice(0, 3).map((k) => `<li><a href="${AMK.url(`/category/${k.slug}`)}" class="block truncate hover:text-accent">• ${E(k.name)}</a></li>`).join("")}
          </ul>` : ""}
          <a href="${AMK.url(`/category/${n.slug}`)}" class="link-more mt-auto pt-3 !text-[12.5px] !text-accent">${kids.length ? "Browse all" : "View products"} ${I("chevron-right", "h-3.5 w-3.5")}</a>
        </div>
      </div>`;
    };

    const body = !d.is_leaf ? `
      <section class="container-site pt-5">
        <div class="panel p-5">
          ${AMK.ui.sectionHead({ title: `Categories under ${cat.name}`, right: `<span class="text-[13px] text-ink-soft">${children.length} listed</span>` })}
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">${children.map(childCard).join("")}</div>
        </div>
      </section>
      ${featured.length ? `
      <section class="container-site pt-5">
        <div class="panel p-5">
          ${AMK.ui.sectionHead({
            eyebrow: `Popular in ${cat.name}`, title: "Featured products", sub: `Top trading SKUs across ${cat.name.toLowerCase()}.`,
            right: `<a href="shop.html" class="link-more">View Full Catalog ${I("chevron-right", "h-4 w-4")}</a>`,
          })}
          ${AMK.ui.productGrid(featured.slice(0, 10))}
        </div>
      </section>` : ""}` : `
      <section class="container-site pt-5">
        ${products.length ? `<div class="panel p-5">
            ${AMK.ui.sectionHead({ title: "Available stock", right: `<span class="text-[13px] text-ink-soft">${products.length} listed</span>` })}
            ${AMK.ui.productGrid(products)}
          </div>`
          : AMK.ui.emptyState("Catalog being populated", "Stock for this product group is currently being uploaded. Request a quote and we'll get back with availability.",
              `<a href="contact.html#rfq" class="btn btn-accent mt-6">Request a quote ${I("arrow-right", "h-4 w-4")}</a>`)}
      </section>`;

    const banner = `
      <section class="container-site pt-5">
        <div class="panel flex flex-col gap-5 !border-accent-soft bg-accent-light p-6 md:flex-row md:items-center md:justify-between md:p-7">
          <div class="flex items-start gap-4">
            <span class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent text-white">${I("sparkles", "h-5 w-5")}</span>
            <div>
              <h3 class="text-[18px] font-bold">Can't find what you're looking for in ${E(cat.name)}?</h3>
              <p class="mt-1 max-w-xl text-[14px] text-ink-muted">We trade thousands of items beyond our catalogue. Tell us the product, brand or model — we'll source it and quote within 24 hours.</p>
            </div>
          </div>
          <button type="button" data-post-requirement data-category="${E(cat.name)}" class="btn btn-accent btn-lg shrink-0">${I("clipboard-list", "h-4 w-4")} Post requirement</button>
        </div>
      </section>`;

    root.innerHTML = AMK.ui.breadcrumb([...trail, { label: cat.name }]) + header + brandsHtml + body + banner;
    AMK.initBrandSliders(root);
  });
})();
