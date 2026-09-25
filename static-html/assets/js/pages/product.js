/* /product?slug= — gallery, enquiry CTAs (form / WhatsApp / call), brands, specs, similar products. */
(function () {
  const AMK = window.AMK;
  const E = AMK.esc;
  const I = AMK.i;
  const S = AMK.SITE;
  const slug = AMK.qs("slug") || "";
  const root = document.getElementById("product-root");

  if (!slug) { root.innerHTML = AMK.ui.notFound("product"); return; }

  Promise.all([AMK.get(`/products/${encodeURIComponent(slug)}/`), AMK.get("/products/?limit=5")]).then(([raw, relatedRaw]) => {
    if (!raw || !raw.slug) { root.innerHTML = AMK.ui.notFound("product"); return; }
    const related = AMK.mapProducts(relatedRaw || []);
    const p = AMK.mapProduct(raw);
    const sku = p.id.toUpperCase();
    const prettyCategory = p.category.replace(/-/g, " ");
    const gallery = p.gallery?.length ? p.gallery : [p.image, p.image, p.image, p.image];
    const brands = p.brands || [];
    const features = p.features || [];
    document.title = `${p.name} · ${S.fullName}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", p.shortDescription || p.name);

    const attrRows = [
      ["Category", `<a href="${AMK.url(`/category/${p.category}`)}" class="capitalize text-brand hover:underline">${E(prettyCategory)}</a>`],
      ["SKU", `<span class="font-mono">${E(sku)}</span>`],
      ["Availability", `<span class="font-semibold text-trust">In stock</span>`],
      ...features.slice(0, 5).map((f) => [E(f.key), E(f.value)]),
    ];

    root.innerHTML = `
      ${AMK.ui.breadcrumb([{ label: "Shop", href: "/shop" }, { label: p.name }])}
      <div class="container-site">
        <div class="grid items-start gap-5 xl:grid-cols-[1fr_330px]">
          <!-- Main listing -->
          <div class="panel grid gap-8 p-5 md:grid-cols-2 md:p-6">
            <!-- Gallery -->
            <div>
              <div class="relative aspect-square overflow-hidden rounded-xl border border-line bg-white">
                <div class="absolute left-3 top-3 z-10 flex gap-1">
                  ${p.isHot ? `<span class="badge badge-hot">HOT</span>` : ""}${p.isNew ? `<span class="badge badge-new">NEW</span>` : ""}
                </div>
                <img id="main-img" src="${E(p.image)}" alt="${E(p.name)}" class="h-full w-full object-contain p-6" />
              </div>
              <div class="mt-3 grid grid-cols-4 gap-2.5">
                ${gallery.slice(0, 4).map((src, i) => `<button type="button" data-thumb="${E(src)}" aria-label="Show image ${i + 1}"
                  class="aspect-square overflow-hidden rounded-lg border-2 ${i === 0 ? "border-accent" : "border-line"} bg-white p-1.5 hover:border-accent">
                  <img src="${E(src)}" alt="" loading="lazy" class="h-full w-full object-contain" /></button>`).join("")}
              </div>
            </div>

            <!-- Info -->
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-1.5">
                ${brands.length
                  ? brands.map((b) => `<span class="chip bg-canvas text-ink">${E(b.name)}</span>`).join("")
                  : p.brand ? `<span class="chip bg-canvas text-ink">${E(p.brand)}</span>` : ""}
              </div>
              <h1 class="mt-3 text-[24px] font-bold leading-tight tracking-tight md:text-[28px]">${E(p.name)}</h1>
              <div class="mt-2 flex flex-wrap items-center gap-3 text-[13px]">
                ${AMK.ui.rating(p.rating.value, null, "md")}
                <span class="text-ink-soft">${p.rating.count} reviews</span>
                <span class="h-3.5 w-px bg-line"></span>
                <span class="inline-flex items-center gap-1 font-medium text-trust">${I("badge-check", "h-4 w-4")} In stock · Authorised</span>
              </div>

              <p class="mt-4 text-[15px] leading-relaxed text-ink-muted">${E(p.shortDescription ||
                "Authorised, warranty-backed stock for industrial procurement. Add specs and quantity in the enquiry form — an AMK application engineer responds within 24 hours with stock visibility, lead times and indicative landed pricing.")}</p>

              <div class="mt-5 overflow-hidden rounded-xl border border-line">
                <p class="border-b border-line bg-paper px-4 py-2.5 text-[13px] font-bold">Key attributes</p>
                <dl class="divide-y divide-line text-[13.5px]">
                  ${attrRows.map(([k, v]) => `<div class="grid grid-cols-[130px_1fr] gap-3 px-4 py-2.5"><dt class="text-ink-soft">${k}</dt><dd class="min-w-0 text-ink">${v}</dd></div>`).join("")}
                </dl>
              </div>

              ${brands.length ? `
                <div class="mt-5">
                  <p class="mb-2 text-[13px] font-semibold">${brands.length === 1 ? "Main brand" : "Main brands"} <span class="font-normal text-ink-soft">· Others on request</span></p>
                  ${AMK.ui.brandSlider(brands, "compact")}
                </div>` : ""}

              <div class="mt-5 flex flex-wrap gap-3 xl:hidden">
                <button type="button" data-enquire="${E(p.slug)}" class="btn btn-accent btn-lg">${I("message-square", "h-4 w-4")} Enquire Now</button>
                <a href="#" data-whatsapp="${E(p.slug)}" class="btn btn-whatsapp btn-lg">${I("message-circle", "h-4 w-4")} WhatsApp</a>
                <a href="tel:${S.phoneTel}" class="btn btn-outline btn-lg">${I("phone", "h-4 w-4")} Call Now</a>
              </div>
            </div>
          </div>

          <!-- Supplier / contact card -->
          <aside class="space-y-4 xl:sticky xl:top-16">
            <div class="panel overflow-hidden">
              <div class="border-b border-line p-5">
                <div class="flex items-center gap-3">
                  <span class="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-line bg-white p-1"><img src="assets/img/logo.png" alt="" class="w-full" /></span>
                  <div class="min-w-0">
                    <p class="truncate text-[15px] font-bold">${E(S.fullName)}</p>
                    <p class="flex items-center gap-1 text-[12.5px] text-trust">${I("badge-check", "h-3.5 w-3.5")} Authorised OEM channel · India</p>
                  </div>
                </div>
                <div class="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div class="rounded-lg bg-canvas px-1 py-2"><p class="text-[15px] font-bold">15+</p><p class="text-[11px] text-ink-soft">Years</p></div>
                  <div class="rounded-lg bg-canvas px-1 py-2"><p class="text-[15px] font-bold">30+</p><p class="text-[11px] text-ink-soft">OEM brands</p></div>
                  <div class="rounded-lg bg-canvas px-1 py-2"><p class="text-[15px] font-bold">&lt;24h</p><p class="text-[11px] text-ink-soft">Quote time</p></div>
                </div>
              </div>
              <div class="space-y-2.5 p-5">
                <button type="button" data-enquire="${E(p.slug)}" class="btn btn-accent btn-lg hidden w-full xl:inline-flex">${I("message-square", "h-4 w-4")} Enquire Now</button>
                <a href="#" data-whatsapp="${E(p.slug)}" aria-label="Enquire on WhatsApp" class="btn btn-whatsapp hidden w-full xl:inline-flex">${I("message-circle", "h-4 w-4")} WhatsApp</a>
                <a href="tel:${S.phoneTel}" aria-label="Call to enquire" class="btn btn-outline hidden w-full xl:inline-flex">${I("phone", "h-4 w-4")} Call Now</a>
                <div class="text-[12.5px] leading-relaxed text-ink-soft xl:pt-2">
                  <p>WhatsApp / Phone: <b class="text-ink">${E(S.hotline)}</b></p>
                  <p>Mon – Sat · 9 AM – 7 PM IST</p>
                  <p class="mt-2">No cart. No price tag. Send specs &amp; quantity — we quote within 24 hours.</p>
                </div>
              </div>
            </div>

            <div class="panel divide-y divide-line">
              ${[["badge-check", "Authorised OEM", "Direct from manufacturer channel"], ["truck", "Pan-India dispatch", "Same/next business day on stock"], ["hard-hat", "Engineer support", "Commissioning available on request"]]
                .map(([ic, t, s]) => `<div class="flex items-start gap-3 px-5 py-3.5"><span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-light text-accent">${I(ic, "h-4 w-4")}</span><div><p class="text-[13.5px] font-semibold">${t}</p><p class="text-[12.5px] text-ink-soft">${s}</p></div></div>`).join("")}
            </div>
          </aside>
        </div>

        <!-- Details -->
        <div class="panel mt-5">
          <div class="flex gap-6 border-b border-line px-5 text-[14px] font-semibold">
            <span class="border-b-2 border-accent py-3.5 text-ink">Product details</span>
            ${features.length ? `<a href="#specs" class="py-3.5 text-ink-soft hover:text-accent">Specifications</a>` : ""}
            ${brands.length ? `<a href="#brands" class="py-3.5 text-ink-soft hover:text-accent">Brands</a>` : ""}
          </div>
          <div class="space-y-8 p-5 md:p-6">
            <section>
              <h2 class="text-[17px] font-bold">Description</h2>
              <p class="mt-2 max-w-4xl text-[15px] leading-relaxed text-ink-muted">${E(p.description ||
                `${p.name} is part of our authorised trading catalogue, supplied directly through the manufacturer channel. Used across industrial, commercial and energy applications. Lead times, accessory bundles and project-rate pricing confirmed on enquiry.`)}</p>
            </section>
            ${features.length ? `
            <section id="specs" class="scroll-mt-20">
              <h2 class="text-[17px] font-bold">Specifications</h2>
              <table class="mt-3 w-full max-w-4xl overflow-hidden rounded-xl border border-line text-[14px]">
                <tbody class="divide-y divide-line">
                  ${features.map((f) => `<tr><th scope="row" class="w-1/3 bg-paper px-4 py-2.5 text-left font-medium text-ink-muted">${E(f.key)}</th><td class="px-4 py-2.5">${E(f.value)}</td></tr>`).join("")}
                </tbody>
              </table>
            </section>` : ""}
            ${brands.length ? `
            <section id="brands" class="scroll-mt-20">
              <h2 class="text-[17px] font-bold">Brands available for this product</h2>
              <p class="mt-1 max-w-2xl text-[14px] text-ink-muted">Looking for a brand not listed? We trade many more — just mention it in your enquiry and we'll source it for you.</p>
              <div class="mt-4">${AMK.ui.brandSlider(brands, "gallery")}</div>
            </section>` : ""}
          </div>
        </div>

        <section class="panel mt-5 p-5">
          ${AMK.ui.sectionHead({ title: "Similar products", right: `<a href="shop.html" class="link-more">View more ${I("chevron-right", "h-4 w-4")}</a>` })}
          ${AMK.ui.productGrid(related.slice(0, 5))}
        </section>
      </div>`;

    AMK.products[p.slug] = p; // related list may share a slug with a thinner record
    AMK.initBrandSliders(root);
    root.addEventListener("click", (e) => {
      const t = e.target.closest("[data-thumb]");
      if (!t) return;
      document.getElementById("main-img").src = t.dataset.thumb;
      root.querySelectorAll("[data-thumb]").forEach((b) => {
        b.classList.toggle("border-accent", b === t);
        b.classList.toggle("border-line", b !== t);
      });
    });
  });
})();
