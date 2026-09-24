/* =========================================================================
   Enquiry workflow — same flow & payloads as the Next.js site.
     • Product enquiry  (any [data-enquire="<slug>"] button)   → POST /inquiries/
     • Buy requirement  (any [data-post-requirement] button)   → POST /inquiries/
     • WhatsApp deep-link ([data-whatsapp])
   Brands come from GET /products/brands/ (cached); per-product spec fields
   come from GET /products/<slug>/spec-form/.
   ========================================================================= */
(function () {
  const AMK = window.AMK;
  const E = AMK.esc;
  const I = AMK.i;

  let brandsPromise = null;
  const getBrands = () => (brandsPromise ||= AMK.get("/products/brands/").then((d) => (Array.isArray(d) ? d : [])));

  /* ------------------------------------------------------------------ */
  /* Modal shell                                                         */
  /* ------------------------------------------------------------------ */
  function openModal({ eyebrow, eyebrowIcon, title, subtitle, body }) {
    const el = document.createElement("div");
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", "amk-modal-title");
    el.className = "fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-4";
    el.innerHTML = `
      <div class="absolute inset-0 bg-navy-950/55 backdrop-blur-[2px]" data-close></div>
      <div class="fade-up relative max-h-[94vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-xl sm:rounded-2xl">
        <div class="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-white px-6 py-5">
          <div class="min-w-0">
            <p class="inline-flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-[0.08em] text-accent">${eyebrowIcon ? I(eyebrowIcon, "h-3.5 w-3.5") : ""}${E(eyebrow)}</p>
            <h2 id="amk-modal-title" class="mt-1 truncate text-lg font-bold text-ink" title="${E(title)}">${E(title)}</h2>
            ${subtitle ? `<p class="mt-0.5 truncate text-[13px] text-ink-soft">${subtitle}</p>` : ""}
          </div>
          <button type="button" data-close aria-label="Close form" class="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-paper hover:text-navy">${I("x", "h-5 w-5")}</button>
        </div>
        <div data-body>${body}</div>
      </div>`;
    const fab = document.getElementById("amk-fab");
    const close = () => {
      el.remove();
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      fab?.classList.remove("opacity-0", "pointer-events-none");
    };
    const onKey = (e) => e.key === "Escape" && close();
    el.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) close(); });
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    fab?.classList.add("opacity-0", "pointer-events-none");
    document.body.appendChild(el);
    el.querySelector("input:not([type=hidden]), textarea")?.focus({ preventScroll: true });
    return { el, close };
  }

  function success(title, body) {
    return `<div class="px-6 py-12 text-center">
      <div class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-trust-light text-trust">${I("check", "h-8 w-8")}</div>
      <h3 class="mt-5 text-2xl font-bold text-ink">${E(title)}</h3>
      <p class="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-ink-muted">${E(body)}</p>
      <button type="button" data-close class="btn btn-accent mt-7">Done</button>
    </div>`;
  }

  /* ------------------------------------------------------------------ */
  /* Field primitives                                                    */
  /* ------------------------------------------------------------------ */
  const field = (label, control, { required, hint, hintId } = {}) => `
    <label class="block">
      <span class="field-label"><span>${E(label)}${required ? `<span class="req"> *</span>` : ""}</span>
        ${hint != null || hintId ? `<span class="hint" ${hintId ? `id="${hintId}"` : ""}>${E(hint ?? "")}</span>` : ""}</span>
      ${control}
    </label>`;

  const contactFields = () => `
    ${field("Full name", `<input required name="name" type="text" placeholder="e.g. Anand Sharma" class="input" autocomplete="name" />`, { required: true })}
    ${field("Phone", `<div class="flex gap-2">
        <select name="cc" aria-label="Country code" class="input w-[150px] shrink-0">
          ${AMK.COUNTRY_CODES.map(([c, l]) => `<option value="${c}">${c}&nbsp;&nbsp;${l}</option>`).join("")}
        </select>
        <input required name="phone" type="tel" pattern="[0-9 ]{6,15}" inputmode="numeric" placeholder="98765 43210" class="input flex-1" autocomplete="tel-national" />
      </div>`, { required: true })}
    ${field("Email", `<input required name="email" type="email" placeholder="name@company.com" class="input" autocomplete="email" />`, { required: true })}
    <div>
      <span class="field-label"><span>Buyer category<span class="req"> *</span></span></span>
      <div class="grid grid-cols-2 gap-2">
        <label class="choice"><input type="radio" name="category" value="individual" checked /> Individual</label>
        <label class="choice"><input type="radio" name="category" value="company" /> Company</label>
      </div>
    </div>`;

  const footer = (label) => `
    <p data-error class="hidden rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700"></p>
    <div class="flex items-center justify-between gap-3 border-t border-line pt-5">
      <button type="button" data-close class="text-sm font-semibold text-ink-soft hover:text-navy">Cancel</button>
      <button type="submit" class="btn btn-accent">${E(label)} ${I("send", "h-4 w-4")}</button>
    </div>`;

  function bindCounter(form, name, id, max) {
    const ta = form.querySelector(`[name=${name}]`);
    const out = form.querySelector(`#${id}`);
    const upd = () => (out.textContent = `${ta.value.length}/${max}`);
    ta.addEventListener("input", upd);
    upd();
  }

  /* ------------------------------------------------------------------ */
  /* Creatable multi-select brand picker                                 */
  /* ------------------------------------------------------------------ */
  function brandPicker(container, initial, placeholder) {
    let value = [...new Set(initial)];
    let all = [];
    let loading = true;
    let active = 0;

    container.innerHTML = `
      <div class="relative">
        <div data-box class="input flex h-auto min-h-[44px] cursor-text flex-wrap items-center gap-1.5 py-1.5">
          <span data-chips class="contents"></span>
          <input data-q type="text" class="min-w-[140px] flex-1 border-0 bg-transparent py-1 text-[15px] outline-none" placeholder="${E(placeholder)}" autocomplete="off" role="combobox" aria-expanded="false" />
        </div>
        <ul data-list role="listbox" class="absolute left-0 right-0 top-full z-20 mt-1 hidden max-h-56 overflow-y-auto rounded-xl border border-line bg-white py-1 shadow-lift"></ul>
      </div>`;
    const box = container.querySelector("[data-box]");
    const chips = container.querySelector("[data-chips]");
    const q = container.querySelector("[data-q]");
    const list = container.querySelector("[data-list]");

    const renderChips = () => {
      chips.innerHTML = value.map((v, i) => `
        <span class="inline-flex items-center gap-1 rounded-full bg-accent-light px-2.5 py-1 text-[12.5px] font-semibold text-[#a50d25]">
          ${E(v)}<button type="button" data-rm="${i}" aria-label="Remove ${E(v)}" class="opacity-70 hover:opacity-100">${I("x", "h-3 w-3")}</button>
        </span>`).join("");
      container.dispatchEvent(new CustomEvent("change-brands", { detail: value }));
    };
    const options = () => {
      const term = q.value.trim().toLowerCase();
      const chosen = new Set(value.map((v) => v.toLowerCase()));
      const opts = all.filter((b) => !chosen.has(b.name.toLowerCase()) && b.name.toLowerCase().includes(term)).map((b) => ({ label: b.name, value: b.name }));
      if (term && !all.some((b) => b.name.toLowerCase() === term) && !chosen.has(term)) {
        opts.push({ label: `Add “${q.value.trim()}”`, value: q.value.trim(), custom: true });
      }
      return opts;
    };
    const renderList = () => {
      const opts = options();
      active = Math.min(active, Math.max(0, opts.length - 1));
      list.innerHTML = loading
        ? `<li class="px-3 py-2 text-sm text-ink-soft">Loading brands…</li>`
        : opts.length
          ? opts.map((o, i) => `<li role="option" data-val="${E(o.value)}" class="cursor-pointer px-3 py-2 text-sm ${i === active ? "bg-accent-light text-accent" : "text-ink"} ${o.custom ? "font-semibold" : ""}">${o.custom ? I("plus", "mr-1 inline h-3.5 w-3.5") : ""}${E(o.label)}</li>`).join("")
          : `<li class="px-3 py-2 text-sm text-ink-soft">Type to add a brand</li>`;
    };
    const openList = () => { list.classList.remove("hidden"); q.setAttribute("aria-expanded", "true"); renderList(); };
    const closeList = () => { list.classList.add("hidden"); q.setAttribute("aria-expanded", "false"); };
    const add = (v) => {
      if (!v) return;
      if (!value.some((x) => x.toLowerCase() === v.toLowerCase())) value.push(v);
      q.value = "";
      active = 0;
      renderChips();
      renderList();
    };

    box.addEventListener("click", () => q.focus());
    q.addEventListener("focus", openList);
    q.addEventListener("input", () => { active = 0; openList(); });
    q.addEventListener("blur", () => setTimeout(closeList, 150));
    q.addEventListener("keydown", (e) => {
      const opts = options();
      if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(active + 1, opts.length - 1); renderList(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(active - 1, 0); renderList(); }
      else if (e.key === "Enter") { e.preventDefault(); if (opts[active]) add(opts[active].value); }
      else if (e.key === "Backspace" && !q.value && value.length) { value.pop(); renderChips(); renderList(); }
    });
    list.addEventListener("mousedown", (e) => {
      const li = e.target.closest("[data-val]");
      if (li) { e.preventDefault(); add(li.dataset.val); }
    });
    chips.addEventListener("click", (e) => {
      const b = e.target.closest("[data-rm]");
      if (b) { e.stopPropagation(); value.splice(Number(b.dataset.rm), 1); renderChips(); }
    });

    getBrands().then((list_) => { all = list_; loading = false; if (!list.classList.contains("hidden")) renderList(); });
    renderChips();
    return { get: () => value.slice() };
  }

  /* ------------------------------------------------------------------ */
  /* Dynamic spec fields (GET /products/<slug>/spec-form/)               */
  /* ------------------------------------------------------------------ */
  function specFieldsHtml(payload) {
    return payload.groups.filter((g) => g.items.length).map((g) => `
      <fieldset class="fieldset">
        <legend>${E(g.name)}</legend>
        ${g.description ? `<p class="mt-1 text-[13px] text-ink-muted">${E(g.description)}</p>` : ""}
        <div class="mt-3 space-y-3">${g.items.map(specItemHtml).join("")}</div>
      </fieldset>`).join("");
  }

  function specItemHtml(item) {
    const f = item.field;
    const id = f.id;
    const label = `${f.name}${f.unit ? ` (${f.unit})` : ""}`;
    const def = item.default_value || "";
    const attr = `data-spec="${id}"`;
    const wrap = (control) => field(label, control, { required: item.is_required });

    switch (f.field_type) {
      case "number":
        return wrap(`<input ${attr} type="number" inputmode="decimal" value="${E(def)}" placeholder="0" class="input" />`);
      case "date":
        return wrap(`<input ${attr} type="date" value="${E(def)}" class="input" />`);
      case "boolean":
        if (f.render_as === "checkbox") {
          return `<label class="flex cursor-pointer items-start gap-3"><input ${attr} type="checkbox" ${def === "true" ? "checked" : ""} class="mt-1 h-4 w-4 accent-[#c8102e]" />
            <span class="text-[15px] font-semibold text-navy">${E(f.name)}${item.is_required ? `<span class="req"> *</span>` : ""}</span></label>`;
        }
        return `<div><span class="field-label"><span>${E(label)}${item.is_required ? `<span class="req"> *</span>` : ""}</span></span>
          <div class="grid grid-cols-2 gap-2">
            <label class="choice"><input type="radio" name="spec-bool-${id}" value="true" ${attr} ${def === "true" ? "checked" : ""} /> Yes</label>
            <label class="choice"><input type="radio" name="spec-bool-${id}" value="false" ${attr} ${def === "false" ? "checked" : ""} /> No</label>
          </div></div>`;
      case "single_select": {
        const opts = f.options || [];
        return `<div data-single="${id}">${wrap(`
          <select ${attr} class="input">
            <option value="">Select…</option>
            ${opts.map((o) => `<option ${o === def ? "selected" : ""}>${E(o)}</option>`).join("")}
            <option value="__other__">Other (specify)</option>
          </select>`)}
          <input data-other="${id}" type="text" placeholder="Specify other…" class="input mt-2 hidden" /></div>`;
      }
      case "multi_select": {
        const opts = f.options || [];
        return `<div data-multi="${id}"><span class="field-label"><span>${E(label)}${item.is_required ? `<span class="req"> *</span>` : ""}</span><span class="hint">select all that apply</span></span>
          <div class="flex flex-wrap gap-2">
            ${opts.map((o) => `<label class="choice !py-1.5 !text-[13.5px]"><input type="checkbox" value="${E(o)}" ${o === def ? "checked" : ""} /> ${E(o)}</label>`).join("")}
          </div>
          <input data-other="${id}" type="text" placeholder="Other — separate multiple with commas" class="input mt-2" /></div>`;
      }
      default:
        if (f.render_as === "textarea") return wrap(`<textarea ${attr} rows="3" placeholder="${E(def)}" class="input">${E(def)}</textarea>`);
        return wrap(`<input ${attr} type="text" value="${E(def)}" class="input" />`);
    }
  }

  function bindSpecFields(root) {
    root.querySelectorAll("[data-single] select").forEach((sel) => {
      const other = sel.closest("[data-single]").querySelector("[data-other]");
      sel.addEventListener("change", () => other.classList.toggle("hidden", sel.value !== "__other__"));
    });
  }

  /** Read answers → { payload: InquirySpecAnswer[], missing: label|null } */
  function collectSpecs(root, payload) {
    const out = [];
    let missing = null;
    for (const g of payload.groups) {
      for (const item of g.items) {
        const f = item.field;
        const id = f.id;
        let answer;
        if (f.field_type === "multi_select") {
          const box = root.querySelector(`[data-multi="${id}"]`);
          const vals = [...box.querySelectorAll("input[type=checkbox]:checked")].map((c) => c.value);
          box.querySelector("[data-other]").value.split(",").map((s) => s.trim()).filter(Boolean).forEach((v) => vals.push(v));
          if (vals.length) answer = { field_id: id, values: vals };
        } else if (f.field_type === "boolean") {
          const els = root.querySelectorAll(`[data-spec="${id}"]`);
          if (els.length === 1 && els[0].type === "checkbox") answer = { field_id: id, value: els[0].checked };
          else {
            const picked = [...els].find((r) => r.checked);
            if (picked) answer = { field_id: id, value: picked.value === "true" };
          }
        } else if (f.field_type === "single_select") {
          const sel = root.querySelector(`select[data-spec="${id}"]`);
          const v = sel.value === "__other__" ? root.querySelector(`[data-other="${id}"]`).value.trim() : sel.value;
          if (v) answer = { field_id: id, value: v };
        } else {
          const v = root.querySelector(`[data-spec="${id}"]`).value.trim();
          if (v) answer = { field_id: id, value: v };
        }
        if (answer) out.push(answer);
        else if (item.is_required && !missing) missing = f.name;
      }
    }
    return { payload: out, missing };
  }

  /* ------------------------------------------------------------------ */
  /* Submit helper                                                       */
  /* ------------------------------------------------------------------ */
  async function submit(form, modal, payload, successHtml) {
    const err = form.querySelector("[data-error]");
    const btn = form.querySelector("button[type=submit]");
    err.classList.add("hidden");
    btn.disabled = true;
    const label = btn.innerHTML;
    btn.textContent = "Submitting…";
    try {
      await AMK.post("/inquiries/", payload);
      modal.el.querySelector("[data-body]").innerHTML = successHtml;
    } catch {
      err.textContent = "Could not submit right now. Please try again.";
      err.classList.remove("hidden");
      btn.disabled = false;
      btn.innerHTML = label;
    }
  }

  const common = (fd) => ({
    name: String(fd.get("name") || ""),
    country_code: String(fd.get("cc") || "+91"),
    phone: String(fd.get("phone") || ""),
    email: String(fd.get("email") || ""),
    buyer_category: fd.get("category") === "company" ? "company" : "individual",
    model_number: String(fd.get("model") || ""),
    quantity: Number(fd.get("quantity") || 1),
  });

  /* ------------------------------------------------------------------ */
  /* Product enquiry                                                     */
  /* ------------------------------------------------------------------ */
  AMK.openProductEnquiry = function (p) {
    const sku = String(p.id).toUpperCase();
    const category = (p.categoryName || p.category || "").replace(/-/g, " ");
    const MAX = 120;
    const modal = openModal({
      eyebrow: "Product enquiry",
      title: p.name,
      subtitle: `SKU&nbsp;<span class="font-mono">${E(sku)}</span><span class="px-1.5">·</span><span class="capitalize">${E(category)}</span>`,
      body: `
        <form class="space-y-4 px-6 py-6" novalidate>
          ${contactFields()}
          <fieldset class="fieldset">
            <legend>Material selection</legend>
            <p class="mt-1 flex items-center gap-2 text-[13px] font-medium text-ink-muted">${I("shield-check", "h-3.5 w-3.5 text-trust")}<span data-summary class="capitalize"></span></p>
            <div class="mt-3 space-y-3">
              <div><span class="field-label"><span>Brands</span><span class="hint" data-brand-hint></span></span>
                <div data-brands></div>
                <p class="mt-1.5 text-[12px] text-ink-soft">Don't see your brand? Type the name and pick <b>Add “…”</b> — we trade many brands outside our catalogue too.</p>
              </div>
              ${field("Model number", `<input name="model" type="text" placeholder="e.g. NSX160F" class="input" />`, { hint: "if any" })}
              ${field("Other option", `<input name="other" type="text" placeholder="Alternative make, rating, accessory…" class="input" />`, { hint: "optional" })}
            </div>
          </fieldset>
          <div data-specs class="space-y-3"></div>
          ${field("Quantity", `<input required name="quantity" type="number" min="1" value="1" inputmode="numeric" class="input w-32" />`, { required: true })}
          ${field("Description", `<textarea required name="description" rows="3" maxlength="${MAX}" placeholder="Application, voltage class, environment, target dates…" class="input"></textarea>`, { required: true, hintId: "desc-count" })}
          ${footer("Submit enquiry")}
        </form>`,
    });

    const form = modal.el.querySelector("form");
    bindCounter(form, "description", "desc-count", MAX);
    const brandsEl = form.querySelector("[data-brands]");
    const summary = form.querySelector("[data-summary]");
    const hint = form.querySelector("[data-brand-hint]");
    brandsEl.addEventListener("change-brands", (e) => {
      const v = e.detail;
      summary.textContent = category + (v.length ? ` · ${v.slice(0, 3).join(", ")}${v.length > 3 ? ` +${v.length - 3}` : ""}` : "");
      hint.textContent = v.length ? `${v.length} selected` : "pick or type";
    });
    const picker = brandPicker(brandsEl, (p.brands || []).map((b) => b.name).concat(p.brands?.length ? [] : p.brand ? [p.brand] : []), "Search brands or type a new one…");

    let specForm = null;
    if (p.slug) {
      AMK.get(`/products/${encodeURIComponent(p.slug)}/spec-form/`).then((data) => {
        if (!data || !data.groups || !data.groups.length || !form.isConnected) return;
        specForm = data;
        const box = form.querySelector("[data-specs]");
        box.innerHTML = specFieldsHtml(data);
        bindSpecFields(box);
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const err = form.querySelector("[data-error]");
      let spec_values;
      if (specForm) {
        const res = collectSpecs(form, specForm);
        if (res.missing) {
          err.textContent = `Please fill in: ${res.missing}`;
          err.classList.remove("hidden");
          return;
        }
        spec_values = res.payload;
      }
      const fd = new FormData(form);
      submit(form, modal, {
        ...common(fd),
        product_slug: p.slug,
        product_name: p.name,
        product_sku: sku,
        product_category: category,
        product_brand: p.brand,
        requested_brands: picker.get(),
        other_option: String(fd.get("other") || ""),
        description: String(fd.get("description") || ""),
        spec_values,
      }, success("Enquiry received", "An AMK application engineer will reach out within 24 hours with stock visibility, lead times and indicative pricing."));
    });
  };

  /* ------------------------------------------------------------------ */
  /* General buy requirement                                             */
  /* ------------------------------------------------------------------ */
  AMK.openGeneralEnquiry = function ({ productName = "", category = "", description = "" } = {}) {
    const MAX = 300;
    const modal = openModal({
      eyebrow: "Buy requirement",
      eyebrowIcon: "clipboard-list",
      title: "Tell us what you're looking for",
      subtitle: "For products or categories not in our catalogue — we trade many more.",
      body: `
        <form class="space-y-4 px-6 py-6" novalidate>
          <fieldset class="fieldset">
            <legend>What you're looking for</legend>
            <div class="mt-3 space-y-3">
              ${field("Product / item name", `<input required name="product_name" type="text" value="${E(productName)}" placeholder="e.g. 250A 4P MCCB, Industrial sensors…" class="input" />`, { required: true })}
              ${field("Category", `<input name="product_category" type="text" value="${E(category)}" placeholder="e.g. MCCB, Cable Trays, VFD Drives…" class="input" />`, { hint: "if you know it" })}
              <div><span class="field-label"><span>Brands</span><span class="hint" data-brand-hint>pick or type</span></span>
                <div data-brands></div>
                <p class="mt-1.5 text-[12px] text-ink-soft">Don't see your brand? Type the name and pick <b>Add “…”</b> — we trade many brands beyond our catalogue.</p>
              </div>
              ${field("Model number", `<input name="model" type="text" placeholder="e.g. NSX160F" class="input" />`, { hint: "optional" })}
            </div>
          </fieldset>
          <div class="grid gap-4 sm:grid-cols-[1fr_140px]">
            ${field("Description", `<textarea required name="description" rows="3" maxlength="${MAX}" placeholder="Application, voltage class, environment, target dates…" class="input">${E(description.slice(0, MAX))}</textarea>`, { required: true, hintId: "gdesc-count" })}
            ${field("Quantity", `<input required name="quantity" type="number" min="1" value="1" inputmode="numeric" class="input" />`, { required: true })}
          </div>
          ${contactFields()}
          ${footer("Send requirement")}
        </form>`,
    });
    const form = modal.el.querySelector("form");
    bindCounter(form, "description", "gdesc-count", MAX);
    const brandsEl = form.querySelector("[data-brands]");
    const hint = form.querySelector("[data-brand-hint]");
    brandsEl.addEventListener("change-brands", (e) => (hint.textContent = e.detail.length ? `${e.detail.length} selected` : "pick or type"));
    const picker = brandPicker(brandsEl, [], "Pick brands or type a new one…");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const fd = new FormData(form);
      submit(form, modal, {
        ...common(fd),
        product_slug: "",
        product_name: String(fd.get("product_name") || ""),
        product_sku: "",
        product_category: String(fd.get("product_category") || ""),
        requested_brands: picker.get(),
        other_option: "",
        description: String(fd.get("description") || ""),
      }, success("Request received", "An AMK sourcing engineer will reach out within 24 hours with availability, lead times and indicative pricing."));
    });
  };

  /* ------------------------------------------------------------------ */
  /* Global click delegation                                             */
  /* ------------------------------------------------------------------ */
  document.addEventListener("click", (e) => {
    const enquire = e.target.closest("[data-enquire]");
    if (enquire) {
      e.preventDefault();
      const p = AMK.products[enquire.dataset.enquire];
      if (p) AMK.openProductEnquiry(p);
      return;
    }
    const post = e.target.closest("[data-post-requirement]");
    if (post) {
      e.preventDefault();
      AMK.openGeneralEnquiry({
        category: post.dataset.category || "",
        description: post.dataset.descriptionFrom ? document.querySelector(post.dataset.descriptionFrom)?.value || "" : "",
      });
      return;
    }
    const wa = e.target.closest("[data-whatsapp]");
    if (wa) {
      e.preventDefault();
      const p = AMK.products[wa.dataset.whatsapp];
      const msg = `Hi AMK,\n\nI'd like to enquire about ${p?.name} (SKU ${String(p?.id).toUpperCase()}).\n\nProduct link: ${location.href}\n\nPlease share availability, lead time and indicative pricing.`;
      window.open(`https://wa.me/${AMK.SITE.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    }
  });
})();
