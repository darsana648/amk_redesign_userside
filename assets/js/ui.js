/* AMK — shared UI: site chrome (top bar, header, category nav, footer),
 * product cards, paginated product strips, enquiry modals, the floating
 * "Post your need" button, popup ads and small helpers.
 *
 * Every page includes:
 *   <div id="site-header"></div> ... <div id="site-footer"></div>
 * and calls AMK.init() once its own content is on the page. */
(function () {
  const CFG = window.AMK_CONFIG;
  const SITE = CFG.site;
  const AMK = (window.AMK = window.AMK || {});

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */
  const esc = (v) =>
    String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const icon = (name, cls = "h-4 w-4") => `<i data-lucide="${name}" class="${cls}" aria-hidden="true"></i>`;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function refreshIcons() {
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  }
  function lockScroll(on) {
    document.body.style.overflow = on ? "hidden" : "";
  }

  /** Resize Unsplash URLs for card-sized images (no-op for other hosts). */
  function sized(src, w = 400, q = 70) {
    if (!src || !/images\.unsplash\.com/.test(src)) return src || "";
    const u = new URL(src);
    u.searchParams.set("w", w);
    u.searchParams.set("q", q);
    u.searchParams.set("auto", "format");
    u.searchParams.set("fit", "crop");
    return u.toString();
  }

  const whatsappHref = (text) =>
    `https://wa.me/${SITE.whatsapp}${text ? "?text=" + encodeURIComponent(text) : ""}`;

  Object.assign(AMK, { esc, icon, $, $$, refreshIcons, sized, whatsappHref });

  /* Registry so product cards can open the enquiry modal with full context */
  const productRegistry = new Map();
  AMK.registerProducts = (list) => (list || []).forEach((p) => productRegistry.set(p.slug, p));

  /* ------------------------------------------------------------------ */
  /* Top bar                                                             */
  /* ------------------------------------------------------------------ */
  function topBar() {
    const left = CFG.topBarLeft
      .map((i) => `<li class="px-4 first:pl-0"><a href="${i.href}" class="transition-colors hover:text-white">${esc(i.label)}</a></li>`)
      .join("");
    const right = CFG.topBarRight
      .map((i) =>
        i.label === "Request Quote"
          ? `<li class="h-full"><a href="${i.href}" class="flex h-full items-center bg-brand-gold px-4 font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-brand-gold-dark">${esc(i.label)}</a></li>`
          : `<li class="h-full"><a href="${i.href}" class="flex h-full items-center transition-colors hover:text-white">${esc(i.label)}</a></li>`
      )
      .join("");
    return `
    <div class="hidden bg-brand-deep text-[#c9d2e3] md:block">
      <div class="container-x flex h-9 items-center justify-between text-xs tracking-wide">
        <ul class="flex items-center divide-x divide-white/15">${left}</ul>
        <ul class="flex h-full items-center gap-5">
          <li class="hidden items-center gap-1.5 lg:flex">${icon("phone", "h-3.5 w-3.5 text-brand-gold")}
            <a href="tel:${SITE.phoneTel}" class="hover:text-white">${SITE.hotline}</a></li>
          <li class="hidden items-center gap-1.5 border-r border-white/15 pr-5 lg:flex">${icon("mail", "h-3.5 w-3.5 text-brand-gold")}
            <a href="mailto:${SITE.email}" class="hover:text-white">${SITE.email}</a></li>
          ${right}
        </ul>
      </div>
    </div>`;
  }

  /* ------------------------------------------------------------------ */
  /* Header — logo, search, hotline, Request Quote                       */
  /* ------------------------------------------------------------------ */
  function header() {
    const q = esc(AMK.param("q") || "");
    return `
    <div class="border-b border-line bg-white">
      <div class="container-x flex h-20 items-center gap-6 md:h-24">
        <a href="index.html" class="shrink-0" aria-label="${SITE.fullName}">
          <img src="assets/img/logo.png" alt="${SITE.fullName}" width="515" height="264" class="h-11 w-auto md:h-14" />
        </a>
        <form action="shop.html" class="relative hidden max-w-2xl flex-1 items-stretch md:flex lg:mx-auto" role="search">
          <input type="text" name="q" value="${q}" placeholder="Search for products, brands, SKU…" aria-label="Search products"
            class="h-12 w-full rounded-l-sm border border-r-0 border-line-strong bg-white px-4 text-[15px] text-ink outline-none transition placeholder:text-ink-soft focus:border-brand-navy" />
          <button type="submit" aria-label="Search" class="flex h-12 shrink-0 items-center justify-center gap-2 rounded-r-sm bg-brand-navy px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-brand-deep">
            ${icon("search")}<span class="hidden lg:inline">Search</span>
          </button>
        </form>
        <a href="tel:${SITE.phoneTel}" class="ml-auto hidden items-center gap-3 lg:ml-0 lg:flex" aria-label="Sales hotline ${SITE.hotline}">
          <span class="flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/50 bg-brand-gold-soft">${icon("phone", "h-4 w-4 text-brand-gold")}</span>
          <span class="leading-tight">
            <span class="block text-[11px] uppercase tracking-[0.16em] text-ink-soft">${SITE.hotlineLabel}</span>
            <span class="block font-serif text-base font-bold text-brand-navy">${SITE.hotline}</span>
          </span>
        </a>
        <a href="contact.html#rfq" class="btn btn-outline hidden h-12 lg:ml-2 lg:inline-flex">Request Quote</a>
      </div>
      <div class="container-x pb-3 md:hidden">
        <form action="shop.html" class="relative flex items-stretch" role="search">
          <input type="text" name="q" value="${q}" placeholder="Search for products, brands, SKU…" aria-label="Search products"
            class="h-11 w-full rounded-l-sm border border-r-0 border-line-strong bg-white px-3.5 text-base outline-none focus:border-brand-navy" />
          <button type="submit" aria-label="Search" class="flex h-11 w-12 shrink-0 items-center justify-center rounded-r-sm bg-brand-navy text-white">${icon("search")}</button>
        </form>
      </div>
    </div>`;
  }

  /* ------------------------------------------------------------------ */
  /* Category navigation (sticky) + desktop dropdown + mobile drawer     */
  /* ------------------------------------------------------------------ */
  function navShell() {
    return `
    <nav id="category-nav" aria-label="Product categories" class="sticky top-0 z-30 border-b-2 border-brand-gold bg-brand-navy text-white shadow-[0_6px_18px_-12px_rgba(7,29,64,0.6)]">
      <div class="container-x relative flex h-12 items-center gap-1 sm:gap-2">
        <button type="button" id="nav-burger" aria-label="Open menu" aria-expanded="false"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm hover:bg-white/10 lg:hidden">${icon("menu", "h-5 w-5")}</button>
        <div class="relative min-w-0 flex-1">
          <span aria-hidden="true" class="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-brand-navy to-transparent lg:hidden"></span>
          <span aria-hidden="true" class="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-brand-navy to-transparent lg:hidden"></span>
          <ul id="nav-roots" class="no-scrollbar flex min-w-0 items-center overflow-x-auto whitespace-nowrap text-[12.5px] font-semibold uppercase tracking-[0.1em]">
            ${'<li class="h-3 w-40 animate-pulse rounded-xs bg-white/10"></li>'.repeat(5)}
          </ul>
        </div>
      </div>
    </nav>`;
  }

  function mountNav(tree) {
    const ul = $("#nav-roots");
    if (!ul) return;
    ul.innerHTML = tree
      .map(
        (root) => `
        <li class="shrink-0">
          <a href="${AMK.url.category(root.slug)}" data-root="${esc(root.slug)}"
             class="nav-root relative flex h-12 items-center gap-1 px-3.5 text-white/90 transition hover:bg-white/5 hover:text-white after:absolute after:inset-x-3.5 after:bottom-0 after:h-[2px] after:scale-x-0 after:bg-brand-gold after:transition-transform hover:after:scale-x-100">
            ${esc(AMK.tree.shortLabel(root.name))}
            ${root.children && root.children.length ? icon("chevron-down", "hidden h-3.5 w-3.5 opacity-70 lg:inline-block") : ""}
          </a>
        </li>`
      )
      .join("");

    /* ---- Desktop dropdown (fixed panel so the scrolling <ul> can't clip it) */
    const panel = document.createElement("div");
    panel.id = "nav-dropdown";
    panel.hidden = true;
    panel.className = "fixed z-[100] min-w-[270px] border border-t-0 border-line bg-white py-2 text-ink shadow-elev";
    panel.style.borderTop = "3px solid var(--color-brand-gold)";
    document.body.appendChild(panel);

    let closeTimer;
    const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;
    const close = () => {
      panel.hidden = true;
      $$(".nav-root").forEach((a) => a.classList.remove("bg-white/5", "text-white"));
    };
    const scheduleClose = () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(close, 150);
    };

    function subList(items) {
      return items
        .map((item) => {
          const kids = item.children && item.children.length;
          return `
          <li class="nav-sub relative">
            <a href="${AMK.url.category(item.slug)}" class="flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-ivory hover:text-brand-navy">
              <span>${esc(item.name)}</span>${kids ? icon("chevron-right", "h-3.5 w-3.5 text-ink-soft") : ""}
            </a>
            ${kids ? `<ul class="nav-flyout absolute top-0 left-full z-[100] ml-px hidden min-w-[240px] max-w-[290px] border border-line bg-white py-2 shadow-elev" style="border-top:3px solid var(--color-brand-gold)">${subList(item.children)}</ul>` : ""}
          </li>`;
        })
        .join("");
    }

    function openAt(a) {
      const node = tree.find((n) => n.slug === a.dataset.root);
      if (!node || !node.children || !node.children.length) return close();
      clearTimeout(closeTimer);
      $$(".nav-root").forEach((x) => x.classList.toggle("bg-white/5", x === a));
      panel.innerHTML = `<ul role="menu">${subList(node.children)}</ul>`;
      refreshIcons();
      const r = a.getBoundingClientRect();
      const maxLeft = Math.max(8, window.innerWidth - 270 - 8);
      panel.style.left = Math.min(r.left, maxLeft) + "px";
      panel.style.top = r.bottom + 2 + "px";
      panel.hidden = false;
    }

    ul.addEventListener("mouseover", (e) => {
      const a = e.target.closest(".nav-root");
      if (a && isDesktop()) openAt(a);
    });
    ul.addEventListener("focusin", (e) => {
      const a = e.target.closest(".nav-root");
      if (a && isDesktop()) openAt(a);
    });
    ul.addEventListener("mouseleave", scheduleClose);
    panel.addEventListener("mouseenter", () => clearTimeout(closeTimer));
    panel.addEventListener("mouseleave", scheduleClose);
    /* Nested fly-outs: show on hover, flip left / nudge up at viewport edges */
    panel.addEventListener("mouseover", (e) => {
      const li = e.target.closest(".nav-sub");
      if (!li) return;
      const fly = li.querySelector(":scope > .nav-flyout");
      $$(":scope > .nav-sub > .nav-flyout", li.parentElement).forEach((f) => f !== fly && f.classList.add("hidden"));
      if (!fly || !fly.classList.contains("hidden")) return;
      fly.classList.remove("hidden");
      fly.style.transform = "";
      fly.classList.remove("right-full", "mr-px");
      fly.classList.add("left-full", "ml-px");
      const lr = li.getBoundingClientRect();
      const fr = fly.getBoundingClientRect();
      if (lr.right + fr.width + 8 > window.innerWidth && lr.left - fr.width - 8 >= 0) {
        fly.classList.remove("left-full", "ml-px");
        fly.classList.add("right-full", "mr-px");
      }
      const over = lr.top + fr.height + 8 - window.innerHeight;
      if (over > 0) fly.style.transform = `translateY(${-Math.min(over, lr.top - 8)}px)`;
    });
    panel.addEventListener("focusin", (e) => {
      const li = e.target.closest(".nav-sub");
      const fly = li && li.querySelector(":scope > .nav-flyout");
      if (fly) fly.classList.remove("hidden");
    });
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);

    /* ---- Mobile drawer */
    $("#nav-burger").addEventListener("click", () => openDrawer(tree));
  }

  function mobileNode(node, depth) {
    const kids = node.children && node.children.length;
    return `
      <li>
        <div class="flex items-stretch" style="padding-left:${depth * 12}px">
          <a href="${AMK.url.category(node.slug)}" class="flex flex-1 items-center py-3.5 pl-4 pr-2 text-sm font-medium text-brand-navy hover:text-brand-gold">${esc(node.name)}</a>
          ${kids ? `<button type="button" data-expand aria-expanded="false" aria-label="Expand" class="flex w-12 items-center justify-center border-l border-line/60 hover:bg-ivory">${icon("chevron-down", "h-4 w-4 text-ink-soft transition-transform")}</button>` : ""}
        </div>
        ${kids ? `<ul class="hidden divide-y divide-line/60 bg-ivory">${node.children.map((c) => mobileNode(c, depth + 1)).join("")}</ul>` : ""}
      </li>`;
  }

  function openDrawer(tree) {
    const utility = [
      ["About AMK", "about.html", "info"],
      ["Our Brands", "about.html#partners", "award"],
      ["Careers", "about.html#careers", "briefcase"],
      ["FAQs", "faqs.html", "help-circle"],
      ["Contact", "contact.html", "mail"],
    ];
    const wrap = document.createElement("div");
    wrap.className = "lg:hidden";
    wrap.innerHTML = `
      <button type="button" data-close aria-label="Close menu" class="fixed inset-0 z-[60] cursor-default bg-brand-deep/55 backdrop-blur-[2px]"></button>
      <div role="dialog" aria-modal="true" aria-label="Categories" class="fixed inset-y-0 left-0 z-[70] flex w-[86%] max-w-[360px] flex-col bg-white text-ink shadow-elev animate-rise">
        <div class="flex items-center justify-between gap-3 border-b-2 border-brand-gold bg-brand-navy px-4 py-4 text-white">
          <div>
            <p class="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-brand-gold">Browse</p>
            <p class="font-serif text-lg font-bold leading-tight">All Categories</p>
          </div>
          <button type="button" data-close aria-label="Close category menu" class="flex h-9 w-9 items-center justify-center rounded-sm bg-white/10 hover:bg-white/20">${icon("x", "h-5 w-5")}</button>
        </div>
        <div class="grid grid-cols-2 border-b border-line bg-ivory text-xs font-semibold uppercase tracking-[0.12em]">
          <a href="contact.html" class="flex items-center justify-center gap-1.5 py-2.5 text-brand-navy hover:bg-white">Contact</a>
          <a href="faqs.html" class="flex items-center justify-center gap-1.5 border-l border-line py-2.5 text-brand-navy hover:bg-white">FAQs</a>
        </div>
        <div class="flex-1 overflow-y-auto">
          <p class="border-b border-line bg-parchment px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft">All Categories</p>
          <ul class="divide-y divide-line/60">${tree.map((n) => mobileNode(n, 0)).join("")}</ul>
          <p class="border-y border-line bg-parchment px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft">Information</p>
          <ul class="divide-y divide-line/60">
            ${utility.map(([l, h, i]) => `<li><a href="${h}" class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-brand-navy hover:bg-ivory">${icon(i, "h-4 w-4 text-brand-gold")}${l}</a></li>`).join("")}
          </ul>
          <div class="border-t border-line bg-ivory p-4">
            <a href="contact.html#rfq" class="btn btn-primary w-full">${icon("phone")} Request a Quote</a>
          </div>
        </div>
        <div class="border-t border-line bg-white p-3">
          <button type="button" data-close class="btn btn-outline w-full">${icon("x")} Close menu</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    lockScroll(true);
    refreshIcons();
    const closeDrawer = () => {
      wrap.remove();
      lockScroll(false);
      document.removeEventListener("keydown", onKey);
    };
    const onKey = (e) => e.key === "Escape" && closeDrawer();
    document.addEventListener("keydown", onKey);
    wrap.addEventListener("click", (e) => {
      if (e.target.closest("[data-close]")) return closeDrawer();
      const btn = e.target.closest("[data-expand]");
      if (btn) {
        const sub = btn.closest("li").querySelector(":scope > ul");
        const open = sub.classList.toggle("hidden") === false;
        btn.setAttribute("aria-expanded", String(open));
        btn.querySelector("svg").style.transform = open ? "rotate(180deg)" : "";
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Footer                                                              */
  /* ------------------------------------------------------------------ */
  function footer() {
    const col = (title, links) => `
      <div>
        <h3 class="mb-5 border-b border-white/10 pb-3 font-serif text-base font-bold tracking-wide text-white">
          <span class="relative inline-block after:absolute after:-bottom-[13px] after:left-0 after:h-[2px] after:w-full after:bg-brand-gold">${title}</span>
        </h3>
        <ul class="space-y-2.5 text-sm">
          ${links.map((l) => `<li><a href="${l.href}" class="inline-block text-white/70 transition hover:translate-x-0.5 hover:text-white">${esc(l.label)}</a></li>`).join("")}
        </ul>
      </div>`;
    const socials = [
      ["LinkedIn", "linkedin", "#"],
      ["YouTube", "youtube", "#"],
      ["WhatsApp", "message-circle", whatsappHref()],
      ["Email", "at-sign", `mailto:${SITE.email}`],
    ];
    return `
    <footer class="mt-16 border-t-4 border-brand-gold bg-brand-navy text-white/75">
      <div class="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <a href="index.html" aria-label="${SITE.fullName}" class="inline-flex rounded-sm bg-white px-3 py-2">
            <img src="assets/img/logo.png" alt="${SITE.fullName}" width="515" height="264" class="h-10 w-auto" loading="lazy" />
          </a>
          <p class="mt-5 max-w-xs text-sm leading-relaxed text-white/65">${SITE.tagline}.</p>
          <ul class="mt-5 space-y-2.5 text-sm">
            <li class="flex items-start gap-2.5">${icon("phone", "mt-0.5 h-4 w-4 shrink-0 text-brand-gold")}
              <span><span class="text-white/55">${SITE.hotlineLabel}: </span><a href="tel:${SITE.phoneTel}" class="font-semibold text-white hover:text-brand-gold">${SITE.hotline}</a></span></li>
            <li class="flex items-start gap-2.5">${icon("mail", "mt-0.5 h-4 w-4 shrink-0 text-brand-gold")}
              <span class="flex flex-col"><a href="mailto:${SITE.email}" class="hover:text-white">${SITE.email}</a><a href="mailto:${SITE.emailInfo}" class="hover:text-white">${SITE.emailInfo}</a></span></li>
            <li class="flex items-start gap-2.5">${icon("map-pin", "mt-0.5 h-4 w-4 shrink-0 text-brand-gold")}<span class="leading-relaxed">${SITE.address}</span></li>
          </ul>
          <div class="mt-6 flex gap-2.5">
            ${socials.map(([l, i, h]) => `<a href="${h}" aria-label="${l}" ${h.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""} class="flex h-9 w-9 items-center justify-center rounded-sm border border-white/20 text-white/75 transition hover:border-brand-gold hover:bg-brand-gold hover:text-white">${icon(i)}</a>`).join("")}
          </div>
        </div>
        ${col("Business Segments", CFG.segments.map((s) => ({ label: s.name, href: AMK.url.segment(s.slug) })))}
        ${col("Company", CFG.footer.company)}
        ${col("Customer Support", CFG.footer.support)}
      </div>
      <div class="border-t border-white/10 bg-black/20">
        <div class="container-x flex flex-col items-center justify-between gap-3 py-4 text-xs text-white/55 md:flex-row">
          <span>© ${new Date().getFullYear()} ${SITE.fullName}. All rights reserved.</span>
          <nav class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            ${CFG.footer.legal.map((l) => `<a href="${l.href}" class="transition hover:text-brand-gold">${l.label}</a>`).join("")}
          </nav>
        </div>
      </div>
    </footer>`;
  }

  /* ------------------------------------------------------------------ */
  /* Building blocks used by pages                                       */
  /* ------------------------------------------------------------------ */
  function stars(value, count) {
    const full = Math.round(value);
    return `<span class="inline-flex items-center gap-1" title="${value} out of 5">
      <span class="flex text-brand-gold">${[1, 2, 3, 4, 5].map((i) => icon("star", `h-3 w-3 ${i <= full ? "fill-current" : "opacity-30"}`)).join("")}</span>
      ${count ? `<span class="text-[11px] text-ink-soft">(${count})</span>` : ""}
    </span>`;
  }

  /** Compact trading-mode product card (no prices — quotes only). */
  function productCard(p, opts = {}) {
    AMK.registerProducts([p]);
    const brands = p.brands && p.brands.length ? p.brands : p.brand ? [{ name: p.brand }] : [];
    const rating = p.rating || { value: p.isHot ? 4.8 : p.isNew ? 4.6 : 4.5, count: 24 };
    return `
    <article class="group relative flex flex-col rounded-sm border border-line bg-white p-3 transition duration-300 hover:border-brand-gold/60 hover:shadow-card">
      <div class="absolute left-3 top-3 z-10 flex flex-col gap-1">
        ${p.isHot ? '<span class="badge badge-hot">Hot</span>' : ""}
        ${p.isNew ? '<span class="badge badge-new">New</span>' : ""}
      </div>
      <a href="${AMK.url.product(p.slug)}" class="block" aria-label="${esc(p.name)}">
        <div class="relative aspect-square w-full overflow-hidden rounded-xs bg-ivory">
          <img src="${esc(sized(p.image, 320))}" alt="${esc(p.name)}" loading="lazy" decoding="async"
               class="absolute inset-0 h-full w-full object-contain p-3 mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
        </div>
      </a>
      <div class="mt-3 flex flex-1 flex-col gap-1.5 border-t border-line/70 pt-3">
        <a href="${AMK.url.product(p.slug)}" title="${esc(p.name)}"
           class="line-clamp-2 min-h-[2.6em] text-sm font-semibold leading-snug text-brand-navy transition hover:text-brand-gold">${esc(p.name)}</a>
        ${brands.length ? `<div class="flex flex-wrap items-center gap-1">
            ${brands.slice(0, 2).map((b) => `<span class="chip-brand">${esc(b.name)}</span>`).join("")}
            ${brands.length > 2 ? `<span class="text-[11px] font-medium text-ink-soft">+${brands.length - 2} more</span>` : ""}
          </div>` : ""}
        <div class="mt-auto flex items-center justify-between gap-2 pt-1.5">
          <span class="inline-flex items-center gap-1 text-xs font-semibold text-brand-green">${icon("check-circle-2", "h-3.5 w-3.5")} In Stock</span>
          ${stars(rating.value, rating.count)}
        </div>
        ${opts.hideActions ? "" : `<button type="button" data-enquire-product="${esc(p.slug)}" class="btn btn-sm btn-outline mt-2 w-full">Request Quote</button>`}
      </div>
    </article>`;
  }

  function sectionHeader({ eyebrow, title, subtitle, align = "left", action = "" }) {
    const center = align === "center";
    return `
    <div class="mb-7 flex flex-wrap items-end ${center ? "justify-center text-center" : "justify-between"} gap-4">
      <div class="${center ? "mx-auto max-w-2xl" : "max-w-2xl"}">
        ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ""}
        <h2 class="section-title mt-1.5">${esc(title)}</h2>
        <span class="title-rule ${center ? "mx-auto" : ""}"></span>
        ${subtitle ? `<p class="mt-3 text-[15px] leading-relaxed text-ink-muted">${esc(subtitle)}</p>` : ""}
      </div>
      ${action}
    </div>`;
  }

  /** Breadcrumb: items = [{label, href?}] — last item is the current page. */
  function breadcrumb(items) {
    const all = [{ label: "Home", href: "index.html" }, ...items];
    return `
    <nav aria-label="Breadcrumb" class="text-[13px]">
      <ol class="flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-soft">
        ${all
          .map((it, i) => {
            const last = i === all.length - 1;
            return `<li class="flex items-center gap-2">
              ${i ? icon("chevron-right", "h-3 w-3 text-line-strong") : ""}
              ${last || !it.href ? `<span class="${last ? "font-semibold text-brand-navy" : ""}" ${last ? 'aria-current="page"' : ""}>${esc(it.label)}</span>` : `<a href="${it.href}" class="transition hover:text-brand-gold">${esc(it.label)}</a>`}
            </li>`;
          })
          .join("")}
      </ol>
    </nav>`;
  }

  /** Classic page banner used at the top of inner pages. */
  function pageHero({ eyebrow, title, subtitle, crumbs = [], image }) {
    return `
    <section class="relative isolate overflow-hidden border-b border-line bg-brand-navy text-white">
      ${image ? `<img src="${esc(sized(image, 1600, 70))}" alt="" aria-hidden="true" class="absolute inset-0 -z-10 h-full w-full object-cover opacity-25" />` : ""}
      <div class="absolute inset-0 -z-10 bg-gradient-to-r from-brand-deep via-brand-navy/95 to-brand-navy/70"></div>
      <div class="absolute inset-0 -z-10 bg-blueprint opacity-60"></div>
      <div class="container-x py-10 md:py-14">
        <div class="[&_a]:text-white/70 [&_a:hover]:text-brand-gold [&_span]:text-white/85 [&_li]:text-white/60">${breadcrumb(crumbs)}</div>
        ${eyebrow ? `<p class="eyebrow mt-6">${esc(eyebrow)}</p>` : '<div class="mt-6"></div>'}
        <h1 class="mt-2 max-w-3xl font-serif text-3xl font-bold leading-tight text-white md:text-[2.6rem]">${esc(title)}</h1>
        <span class="mt-4 block h-[2px] w-16 bg-brand-gold"></span>
        ${subtitle ? `<p class="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-white/75">${esc(subtitle)}</p>` : ""}
      </div>
    </section>`;
  }

  /**
   * Paginated product strip (Prev/Next + dots). Returns HTML; call
   * AMK.initStrips() after inserting (AMK.init does it automatically).
   */
  let stripSeq = 0;
  function productStrip({ eyebrow, title, products, viewAllHref = "shop.html", bg = "white", perPage = 5 }) {
    const id = "strip-" + ++stripSeq;
    AMK.registerProducts(products);
    const pages = Math.max(1, Math.ceil(products.length / perPage));
    const cards = products.map((p, i) => `<div data-page="${Math.floor(i / perPage)}" class="${i >= perPage ? "hidden" : ""}">${productCard(p)}</div>`).join("");
    const arrows =
      pages > 1
        ? `<div class="flex items-center gap-1.5">
            <button type="button" data-strip-prev aria-label="Previous page" class="flex h-9 w-9 items-center justify-center rounded-sm border border-line-strong bg-white text-brand-navy transition hover:border-brand-navy disabled:cursor-not-allowed disabled:opacity-40" disabled>${icon("chevron-left")}</button>
            <button type="button" data-strip-next aria-label="Next page" class="flex h-9 w-9 items-center justify-center rounded-sm border border-line-strong bg-white text-brand-navy transition hover:border-brand-navy disabled:cursor-not-allowed disabled:opacity-40">${icon("chevron-right")}</button>
          </div>`
        : "";
    const dots =
      pages > 1
        ? `<div class="mt-7 flex items-center justify-center gap-1">${Array.from({ length: pages }, (_, i) => `<button type="button" data-strip-dot="${i}" aria-label="Go to page ${i + 1}" class="flex h-9 items-center px-1.5"><span class="block h-1 rounded-full transition-all ${i ? "w-2.5 bg-line-strong" : "w-8 bg-brand-gold"}"></span></button>`).join("")}</div>`
        : "";
    return `
    <section class="${bg === "soft" ? "bg-ivory" : "bg-white"} py-12 lg:py-14" data-strip="${id}" data-pages="${pages}">
      <div class="container-x">
        ${sectionHeader({
          eyebrow,
          title,
          action: `<div class="flex items-center gap-4">${arrows}<a href="${viewAllHref}" class="link-arrow">View All ${icon("arrow-right")}</a></div>`,
        })}
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-4">${cards}</div>
        ${dots}
      </div>
    </section>`;
  }

  function initStrips(root = document) {
    $$("[data-strip]", root).forEach((sec) => {
      if (sec.dataset.ready) return;
      sec.dataset.ready = "1";
      const pages = Number(sec.dataset.pages);
      let page = 0;
      const go = (n) => {
        page = Math.max(0, Math.min(pages - 1, n));
        $$("[data-page]", sec).forEach((el) => el.classList.toggle("hidden", Number(el.dataset.page) !== page));
        const prev = $("[data-strip-prev]", sec);
        const next = $("[data-strip-next]", sec);
        if (prev) prev.disabled = page === 0;
        if (next) next.disabled = page === pages - 1;
        $$("[data-strip-dot]", sec).forEach((d) => {
          const on = Number(d.dataset.stripDot) === page;
          d.firstElementChild.className = `block h-1 rounded-full transition-all ${on ? "w-8 bg-brand-gold" : "w-2.5 bg-line-strong"}`;
          d.toggleAttribute("aria-current", on);
        });
      };
      sec.addEventListener("click", (e) => {
        if (e.target.closest("[data-strip-prev]")) go(page - 1);
        else if (e.target.closest("[data-strip-next]")) go(page + 1);
        else if (e.target.closest("[data-strip-dot]")) go(Number(e.target.closest("[data-strip-dot]").dataset.stripDot));
      });
    });
  }

  /* "Can't find what you're looking for?" band (category / shop pages) */
  function enquireGeneralBanner({ contextLabel = "", defaultCategory = "" } = {}) {
    return `
    <section class="bg-ivory py-10 lg:py-14">
      <div class="mx-auto max-w-5xl px-4">
        <div class="relative overflow-hidden rounded-sm border border-line bg-white p-6 shadow-card md:p-8">
          <span class="absolute inset-y-0 left-0 w-1 bg-brand-gold"></span>
          <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div class="flex items-start gap-4">
              <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-brand-gold/50 bg-brand-gold-soft text-brand-gold">${icon("sparkles", "h-5 w-5")}</span>
              <div>
                <h3 class="font-serif text-lg font-bold leading-snug md:text-xl">Can't find what you're looking for${contextLabel ? " " + esc(contextLabel) : ""}?</h3>
                <p class="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-muted">We trade thousands of items beyond our catalogue. Tell us the product, brand or model — we'll source it and quote within 24 hours.</p>
              </div>
            </div>
            <button type="button" data-enquire-general data-category="${esc(defaultCategory)}" class="btn btn-primary shrink-0">${icon("clipboard-list")} Post requirement</button>
          </div>
        </div>
      </div>
    </section>`;
  }

  /* Closing CTA band — "Ready when your project is." */
  function finalCta({
    eyebrow = "Start your project",
    title = "Ready when your project is.",
    subtitle = "Send us your spec, BOQ or shortlist. An AMK application engineer will respond with project-scoped pricing within 24 hours.",
    ctaLabel = "Request a Quote",
    ctaHref = "contact.html#rfq",
  } = {}) {
    return `
    <section class="bg-white py-16 md:py-20">
      <div class="container-x">
        <div class="relative isolate overflow-hidden rounded-sm bg-brand-navy px-6 py-14 text-center text-white md:px-12 md:py-20">
          <div class="absolute inset-0 -z-10 bg-blueprint [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"></div>
          <div class="absolute inset-3 -z-10 border border-brand-gold/30"></div>
          <div class="relative mx-auto max-w-3xl">
            <p class="eyebrow-rule justify-center">${esc(eyebrow)}</p>
            <h2 class="display mt-4 !text-white">${esc(title)}</h2>
            <p class="mx-auto mt-5 max-w-xl text-base text-white/75 md:text-lg">${esc(subtitle)}</p>
            <div class="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a href="${ctaHref}" class="btn btn-lg btn-gold group">${esc(ctaLabel)} ${icon("arrow-right", "h-4 w-4 transition-transform group-hover:translate-x-1")}</a>
              <a href="tel:${SITE.phoneTel}" class="btn btn-lg btn-outline-light">${icon("phone")} ${SITE.hotline}</a>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  function emptyState({ title, text, action = "" }) {
    return `
    <div class="rounded-sm border border-dashed border-line-strong bg-ivory px-6 py-14 text-center">
      <span class="mx-auto grid h-12 w-12 place-items-center rounded-full border border-brand-gold/40 bg-white text-brand-gold">${icon("package-search", "h-5 w-5")}</span>
      <h3 class="mt-4 font-serif text-lg font-bold">${esc(title)}</h3>
      ${text ? `<p class="mx-auto mt-2 max-w-md text-sm text-ink-muted">${esc(text)}</p>` : ""}
      ${action ? `<div class="mt-5">${action}</div>` : ""}
    </div>`;
  }

  function skeletonGrid(n = 5) {
    return `<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-4">${'<div class="h-80 animate-pulse rounded-sm border border-line bg-ivory"></div>'.repeat(n)}</div>`;
  }

  Object.assign(AMK, {
    ui: { productCard, productStrip, sectionHeader, breadcrumb, pageHero, stars, enquireGeneralBanner, finalCta, emptyState, skeletonGrid },
    initStrips,
  });

  /* ------------------------------------------------------------------ */
  /* Modal shell                                                         */
  /* ------------------------------------------------------------------ */
  function openModal({ eyebrow, eyebrowIcon, title, sub, body, labelId }) {
    const el = document.createElement("div");
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", labelId);
    el.className = "fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-4";
    el.innerHTML = `
      <div data-backdrop class="absolute inset-0 bg-brand-deep/55 backdrop-blur-[2px]"></div>
      <div class="relative max-h-[92vh] w-full overflow-y-auto rounded-t-md border-t-4 border-brand-gold bg-white shadow-elev animate-rise sm:max-w-xl sm:rounded-sm">
        <div class="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-white/95 px-6 py-5 backdrop-blur">
          <div class="min-w-0">
            <p class="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gold">${eyebrowIcon ? icon(eyebrowIcon, "h-3.5 w-3.5") : ""}${esc(eyebrow)}</p>
            <h2 id="${labelId}" class="mt-1 truncate font-serif text-xl font-bold" title="${esc(title)}">${esc(title)}</h2>
            ${sub ? `<p class="mt-1 truncate text-[12.5px] text-ink-soft">${sub}</p>` : ""}
          </div>
          <button type="button" data-modal-close aria-label="Close form" class="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-ink-soft transition hover:bg-ivory hover:text-brand-navy">${icon("x", "h-5 w-5")}</button>
        </div>
        <div data-modal-body>${body}</div>
      </div>`;
    document.body.appendChild(el);
    lockScroll(true);
    refreshIcons();
    const close = () => {
      el.remove();
      if (!$('[role="dialog"][aria-modal="true"]')) lockScroll(false);
      document.removeEventListener("keydown", onKey);
      document.dispatchEvent(new CustomEvent("amk:modal-close"));
    };
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    el.addEventListener("click", (e) => {
      if (e.target.matches("[data-backdrop]") || e.target.closest("[data-modal-close]")) close();
    });
    document.dispatchEvent(new CustomEvent("amk:modal-open"));
    return { el, close };
  }

  function successPanel(title, text) {
    return `
    <div class="px-6 py-12 text-center">
      <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-brand-green/30 bg-brand-green/5 text-brand-green">${icon("check-circle-2", "h-7 w-7")}</div>
      <h3 class="mt-5 font-serif text-xl font-bold">${esc(title)}</h3>
      <p class="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">${esc(text)}</p>
      <button type="button" data-modal-close class="btn btn-primary mt-7">Close</button>
    </div>`;
  }

  /* Form field primitives */
  const field = (label, control, { required, hint, hintId } = {}) => `
    <label class="block">
      <span class="field-label"><span>${esc(label)}${required ? ' <span class="text-[#9b2c2c]">*</span>' : ""}</span>
        ${hint != null ? `<span class="field-hint" ${hintId ? `id="${hintId}"` : ""}>${esc(hint)}</span>` : ""}</span>
      <span class="mt-1.5 block">${control}</span>
    </label>`;
  const phoneField = () =>
    field(
      "Phone",
      `<span class="flex gap-2">
        <select name="cc" aria-label="Country code" class="input w-28 shrink-0 px-2.5">${CFG.countryCodes.map((c) => `<option value="${c.code}">${c.code}&nbsp;&nbsp;${c.label}</option>`).join("")}</select>
        <input required type="tel" name="phone" pattern="[0-9 ]{6,15}" inputmode="numeric" placeholder="98765 43210" class="input flex-1" />
      </span>`,
      { required: true }
    );
  const buyerCategory = () =>
    field(
      "Buyer category",
      `<span class="grid grid-cols-2 gap-2">
        <label class="radio-card"><input type="radio" name="category" value="individual" checked class="h-4 w-4 accent-[#0b2b5c]" /> Individual</label>
        <label class="radio-card"><input type="radio" name="category" value="company" class="h-4 w-4 accent-[#0b2b5c]" /> Company</label>
      </span>`,
      { required: true }
    );
  const brandHelp = `<span class="mt-1.5 block text-[11.5px] text-ink-soft">Don't see your brand? Type the name and pick <span class="font-semibold">Add "…"</span> — we trade many brands beyond our catalogue.</span>`;

  /* ------------------------------------------------------------------ */
  /* Creatable multi-select brand picker                                 */
  /* ------------------------------------------------------------------ */
  let brandsPromise = null;
  const getBrandsCached = () => (brandsPromise = brandsPromise || AMK.api.getBrands().catch(() => []));

  function brandSelect(container, { initial = [], placeholder = "Pick or type a brand", onChange }) {
    let value = initial.slice();
    let brands = [];
    let open = false;
    let active = 0;
    container.innerHTML = `
      <div class="relative" data-brand-root>
        <div data-trigger tabindex="0" role="combobox" aria-expanded="false" class="flex min-h-11 w-full cursor-text flex-wrap items-center gap-1.5 rounded-sm border border-line-strong bg-white px-2 py-1.5 text-sm transition focus-within:border-brand-navy focus-within:ring-2 focus-within:ring-brand-navy/10">
          <span data-chips class="contents"></span>
          <input data-q type="text" autocomplete="off" class="min-w-[8rem] flex-1 border-0 bg-transparent px-1.5 py-1 text-sm text-ink outline-none placeholder:text-ink-soft/70" placeholder="${esc(placeholder)}" />
          ${icon("chevron-down", "ml-auto h-4 w-4 shrink-0 text-ink-soft")}
        </div>
        <div data-list hidden class="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-sm border border-line bg-white py-1 shadow-elev"></div>
      </div>`;
    const chips = $("[data-chips]", container);
    const q = $("[data-q]", container);
    const list = $("[data-list]", container);
    const trigger = $("[data-trigger]", container);
    const has = (n) => value.some((v) => v.toLowerCase() === n.toLowerCase());

    function emit() {
      onChange && onChange(value);
    }
    function renderChips() {
      chips.innerHTML = value
        .map((v, i) => `<span class="inline-flex items-center gap-1 rounded-xs border border-brand-navy/20 bg-brand-navy/[0.05] py-0.5 pl-2 pr-1 text-xs font-semibold text-brand-navy">${esc(v)}<button type="button" data-remove="${i}" aria-label="Remove ${esc(v)}" class="rounded-xs p-0.5 hover:bg-brand-navy/10">${icon("x", "h-3 w-3")}</button></span>`)
        .join("");
      q.placeholder = value.length ? "" : placeholder;
      refreshIcons();
    }
    function options() {
      const term = q.value.trim().toLowerCase();
      const filtered = brands.filter((b) => b.name.toLowerCase().includes(term)).slice(0, 60);
      const exact = brands.some((b) => b.name.toLowerCase() === term) || has(term);
      const opts = filtered.map((b) => ({ type: "brand", name: b.name }));
      if (term && !exact) opts.push({ type: "add", name: q.value.trim() });
      return opts;
    }
    function renderList() {
      const opts = options();
      active = Math.min(active, Math.max(0, opts.length - 1));
      list.innerHTML = opts.length
        ? opts
            .map((o, i) =>
              o.type === "add"
                ? `<button type="button" data-opt="${i}" class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-brand-gold ${i === active ? "bg-ivory" : ""}">${icon("plus", "h-4 w-4")} Add "${esc(o.name)}"</button>`
                : `<button type="button" data-opt="${i}" class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-ink ${i === active ? "bg-ivory" : ""} hover:bg-ivory">
                    <span class="grid h-4 w-4 place-items-center rounded-xs border ${has(o.name) ? "border-brand-navy bg-brand-navy text-white" : "border-line-strong"}">${has(o.name) ? icon("check", "h-3 w-3") : ""}</span>${esc(o.name)}</button>`
            )
            .join("")
        : `<p class="px-3 py-2 text-sm text-ink-soft">${brands.length ? "No matches — keep typing to add a brand." : "Loading brands…"}</p>`;
      list._opts = opts;
      refreshIcons();
    }
    function setOpen(o) {
      open = o;
      list.hidden = !o;
      trigger.setAttribute("aria-expanded", String(o));
      if (o) renderList();
    }
    function pick(o) {
      if (!o) return;
      if (has(o.name)) value = value.filter((v) => v.toLowerCase() !== o.name.toLowerCase());
      else value.push(o.name);
      q.value = "";
      renderChips();
      renderList();
      emit();
      q.focus();
    }
    trigger.addEventListener("click", (e) => {
      const rm = e.target.closest("[data-remove]");
      if (rm) {
        value.splice(Number(rm.dataset.remove), 1);
        renderChips();
        emit();
        if (open) renderList();
        return;
      }
      q.focus();
      setOpen(true);
    });
    q.addEventListener("focus", () => setOpen(true));
    q.addEventListener("input", () => {
      active = 0;
      setOpen(true);
    });
    q.addEventListener("keydown", (e) => {
      const opts = list._opts || [];
      if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(active + 1, opts.length - 1); renderList(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(active - 1, 0); renderList(); }
      else if (e.key === "Enter") { e.preventDefault(); pick(opts[active]); }
      else if (e.key === "Backspace" && !q.value && value.length) { value.pop(); renderChips(); emit(); }
      else if (e.key === "Escape" && open) { e.stopPropagation(); setOpen(false); }
    });
    list.addEventListener("mousedown", (e) => e.preventDefault());
    list.addEventListener("click", (e) => {
      const b = e.target.closest("[data-opt]");
      if (b) pick(list._opts[Number(b.dataset.opt)]);
    });
    document.addEventListener("click", (e) => {
      if (open && !container.contains(e.target)) setOpen(false);
    });
    renderChips();
    getBrandsCached().then((b) => {
      brands = b;
      if (open) renderList();
    });
    return { get: () => value.slice() };
  }

  /* ------------------------------------------------------------------ */
  /* Dynamic spec fields (mirrors components/forms/SpecFields.tsx)       */
  /* ------------------------------------------------------------------ */
  const OTHER = "__other__";
  function specFields(payload) {
    return payload.groups
      .filter((g) => g.items.length)
      .map(
        (g) => `
      <fieldset class="fieldset">
        <legend class="legend">${esc(g.name)}</legend>
        ${g.description ? `<p class="mt-1 text-xs text-ink-soft">${esc(g.description)}</p>` : ""}
        <div class="mt-3 space-y-3">${g.items.map(specItem).join("")}</div>
      </fieldset>`
      )
      .join("");
  }
  function specItem(item) {
    const f = item.field;
    const n = `spec_${f.id}`;
    const label = f.name + (f.unit ? ` (${f.unit})` : "");
    const req = item.is_required ? "required" : "";
    const dv = item.default_value || "";
    const opts = f.options || [];
    let control = "";
    if (f.field_type === "text") {
      control = f.render_as === "textarea"
        ? `<textarea name="${n}" rows="2" ${req} placeholder="${esc(dv)}" class="textarea">${esc(dv)}</textarea>`
        : `<input name="${n}" type="text" ${req} value="${esc(dv)}" class="input" />`;
    } else if (f.field_type === "number") {
      control = `<input name="${n}" type="number" step="any" ${req} value="${esc(dv)}" placeholder="${esc(dv || "0")}" class="input" />`;
    } else if (f.field_type === "boolean") {
      control = f.render_as === "checkbox"
        ? `<label class="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="${n}" value="true" ${String(dv).toLowerCase() === "true" ? "checked" : ""} class="h-4 w-4 accent-[#0b2b5c]" /> Yes</label>`
        : `<span class="grid grid-cols-2 gap-2">${["true", "false"].map((v) => `<label class="radio-card"><input type="radio" name="${n}" value="${v}" ${String(dv).toLowerCase() === v ? "checked" : ""} class="h-4 w-4 accent-[#0b2b5c]" /> ${v === "true" ? "Yes" : "No"}</label>`).join("")}</span>`;
    } else if (f.field_type === "date") {
      control = `<input name="${n}" type="date" ${req} value="${esc(dv)}" class="input" />`;
    } else if (f.field_type === "single_select") {
      control = f.render_as === "radio"
        ? `<span class="flex flex-wrap gap-2">${opts.map((o) => `<label class="radio-card py-2"><input type="radio" name="${n}" value="${esc(o)}" ${o === dv ? "checked" : ""} class="h-4 w-4 accent-[#0b2b5c]" /> ${esc(o)}</label>`).join("")}
            <label class="radio-card py-2"><input type="radio" name="${n}" value="${OTHER}" class="h-4 w-4 accent-[#0b2b5c]" /> Other</label></span>
           <input data-other-for="${n}" type="text" placeholder="Type your value…" class="input mt-2 hidden" />`
        : `<select name="${n}" ${req} class="input"><option value="">Select…</option>${opts.map((o) => `<option ${o === dv ? "selected" : ""}>${esc(o)}</option>`).join("")}<option value="${OTHER}">Other (specify)</option></select>
           <input data-other-for="${n}" type="text" placeholder="Type your value…" class="input mt-2 hidden" />`;
    } else if (f.field_type === "multi_select") {
      control = `<span class="flex flex-wrap gap-2">${opts.map((o) => `<label class="radio-card py-2"><input type="checkbox" name="${n}" value="${esc(o)}" ${o === dv ? "checked" : ""} class="h-4 w-4 accent-[#0b2b5c]" /> ${esc(o)}</label>`).join("")}</span>
        <input data-extra-for="${n}" type="text" placeholder="Add another (comma separated)…" class="input mt-2" />`;
    }
    return field(label, control, { required: item.is_required });
  }
  function wireSpecOther(form) {
    form.addEventListener("change", (e) => {
      const t = e.target;
      if (!t.name || !t.name.startsWith("spec_")) return;
      const other = form.querySelector(`[data-other-for="${t.name}"]`);
      if (other) {
        const val = t.type === "radio" ? form.querySelector(`[name="${t.name}"]:checked`).value : t.value;
        other.classList.toggle("hidden", val !== OTHER);
      }
    });
  }
  /** Returns { values: InquirySpecAnswer[], missing: label|null } */
  function collectSpecs(form, payload) {
    const out = [];
    let missing = null;
    payload.groups.forEach((g) =>
      g.items.forEach((item) => {
        const f = item.field;
        const n = `spec_${f.id}`;
        if (f.field_type === "multi_select") {
          const vals = $$(`[name="${n}"]:checked`, form).map((i) => i.value);
          const extra = ($(`[data-extra-for="${n}"]`, form) || {}).value || "";
          extra.split(",").map((s) => s.trim()).filter(Boolean).forEach((v) => vals.push(v));
          if (vals.length) out.push({ field_id: f.id, values: vals });
          else if (item.is_required && !missing) missing = f.name;
          return;
        }
        let v;
        const els = $$(`[name="${n}"]`, form);
        if (!els.length) return;
        if (els[0].type === "radio") v = (els.find((e) => e.checked) || {}).value;
        else if (els[0].type === "checkbox") v = els[0].checked ? "true" : "false";
        else v = els[0].value;
        if (v === OTHER) v = ($(`[data-other-for="${n}"]`, form) || {}).value;
        if (f.field_type === "boolean") {
          if (v !== undefined) out.push({ field_id: f.id, value: String(v).toLowerCase() === "true" });
          else if (item.is_required && !missing) missing = f.name;
          return;
        }
        if (v === undefined || v === null || String(v).trim() === "") {
          if (item.is_required && !missing) missing = f.name;
          return;
        }
        out.push({ field_id: f.id, value: f.field_type === "number" ? Number(v) : v });
      })
    );
    return { values: out, missing };
  }

  function charCounter(form, name, hintId, max) {
    const ta = form.querySelector(`[name="${name}"]`);
    const hint = form.querySelector("#" + hintId);
    const upd = () => (hint.textContent = `${ta.value.length}/${max}`);
    ta.addEventListener("input", upd);
    upd();
  }

  async function submitInquiry(form, modal, payload, successTitle, successText) {
    const err = $("[data-error]", form);
    const btn = $('[type="submit"]', form);
    err.hidden = true;
    btn.disabled = true;
    const label = btn.innerHTML;
    btn.textContent = "Submitting...";
    try {
      await AMK.api.createInquiry(payload);
      $("[data-modal-body]", modal.el).innerHTML = successPanel(successTitle, successText);
      refreshIcons();
    } catch (e) {
      err.textContent = "Could not submit right now. Please try again.";
      err.hidden = false;
      btn.disabled = false;
      btn.innerHTML = label;
      refreshIcons();
    }
  }

  /* ------------------------------------------------------------------ */
  /* General enquiry — "Post your buy requirement"                       */
  /* ------------------------------------------------------------------ */
  function openGeneralEnquiry({ productName = "", category = "", description = "" } = {}) {
    const MAX = 300;
    const body = `
      <form class="space-y-4 px-6 py-6" novalidate>
        <fieldset class="fieldset">
          <legend class="legend">What you're looking for</legend>
          <div class="mt-3 space-y-3">
            ${field("Product / item name", `<input required name="product_name" type="text" value="${esc(productName)}" placeholder="e.g. 250A 4P MCCB, Industrial sensors…" class="input" />`, { required: true })}
            ${field("Category", `<input name="product_category" type="text" value="${esc(category)}" placeholder="e.g. MCCB, Cable Trays, VFD Drives…" class="input" />`, { hint: "if you know it" })}
            ${field("Brands", `<span data-brands></span>${brandHelp}`, { hint: "pick or type", hintId: "g-brand-hint" })}
            ${field("Model number", `<input name="model" type="text" placeholder="e.g. NSX160F" class="input" />`, { hint: "optional" })}
          </div>
        </fieldset>
        <div class="grid gap-4 sm:grid-cols-[1fr_140px]">
          ${field("Description", `<textarea required name="description" rows="3" maxlength="${MAX}" placeholder="Application, voltage class, environment, target dates…" class="textarea">${esc(description)}</textarea>`, { required: true, hint: "", hintId: "g-desc-hint" })}
          ${field("Quantity", `<input required type="number" name="quantity" min="1" value="1" inputmode="numeric" class="input" />`, { required: true })}
        </div>
        ${field("Full name", `<input required name="name" type="text" placeholder="e.g. Anand Sharma" class="input" />`, { required: true })}
        ${phoneField()}
        ${field("Email", `<input required name="email" type="email" placeholder="name@company.com" class="input" />`, { required: true })}
        ${buyerCategory()}
        <p data-error hidden class="rounded-sm border border-[#9b2c2c]/20 bg-[#9b2c2c]/5 px-3 py-2 text-sm font-medium text-[#9b2c2c]"></p>
        <div class="flex items-center justify-between gap-3 border-t border-line pt-4">
          <button type="button" data-modal-close class="text-sm font-medium text-ink-soft hover:text-brand-navy">Cancel</button>
          <button type="submit" class="btn btn-primary">Send requirement ${icon("send")}</button>
        </div>
      </form>`;
    const modal = openModal({
      eyebrow: "Buy requirement",
      eyebrowIcon: "clipboard-list",
      title: "Tell us what you're looking for",
      sub: "For products or categories not in our catalogue — we trade many more.",
      body,
      labelId: "enquire-general-title",
    });
    const form = $("form", modal.el);
    charCounter(form, "description", "g-desc-hint", MAX);
    const brands = brandSelect($("[data-brands]", form), {
      placeholder: "Pick brands or type a new one…",
      onChange: (v) => ($("#g-brand-hint", form).textContent = v.length ? `${v.length} selected` : "pick or type"),
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const fd = new FormData(form);
      submitInquiry(
        form,
        modal,
        {
          product_slug: "",
          product_name: String(fd.get("product_name") || ""),
          product_sku: "",
          product_category: String(fd.get("product_category") || ""),
          name: String(fd.get("name") || ""),
          country_code: String(fd.get("cc") || "+91"),
          phone: String(fd.get("phone") || ""),
          email: String(fd.get("email") || ""),
          buyer_category: fd.get("category") === "company" ? "company" : "individual",
          requested_brands: brands.get(),
          model_number: String(fd.get("model") || ""),
          other_option: "",
          quantity: Number(fd.get("quantity") || 1),
          description: String(fd.get("description") || ""),
        },
        "Request received",
        "An AMK sourcing engineer will reach out within 24 hours with availability, lead times and indicative pricing."
      );
    });
    return modal;
  }

  /* ------------------------------------------------------------------ */
  /* Product enquiry — "Request Quote" / "Enquire Now"                   */
  /* ------------------------------------------------------------------ */
  function openProductEnquiry(p) {
    const MAX = 120;
    const sku = String(p.sku || p.id || "").toUpperCase();
    const category = p.categoryName || p.category || "";
    const initialBrands = p.brands && p.brands.length ? p.brands.map((b) => b.name) : p.brand ? [p.brand] : [];
    const body = `
      <form class="space-y-4 px-6 py-6" novalidate>
        ${field("Full name", `<input required name="name" type="text" placeholder="e.g. Anand Sharma" class="input" />`, { required: true })}
        ${phoneField()}
        ${field("Email", `<input required name="email" type="email" placeholder="name@company.com" class="input" />`, { required: true })}
        ${buyerCategory()}
        <fieldset class="fieldset">
          <legend class="legend">Material selection</legend>
          <p class="mt-1 flex items-center gap-2 text-[12.5px] font-medium text-ink-muted">${icon("shield-check", "h-3.5 w-3.5 text-brand-gold")}<span data-material class="capitalize"></span></p>
          <div class="mt-3 space-y-3">
            ${field("Brands", `<span data-brands></span>${brandHelp}`, { hint: "", hintId: "p-brand-hint" })}
            ${field("Model number", `<input name="model" type="text" placeholder="e.g. NSX160F" class="input" />`, { hint: "if any" })}
            ${field("Other option", `<input name="other" type="text" placeholder="Alternative make, rating, accessory…" class="input" />`, { hint: "optional" })}
          </div>
        </fieldset>
        <div data-specs class="space-y-3"></div>
        ${field("Quantity", `<input required type="number" name="quantity" min="1" value="1" inputmode="numeric" class="input w-32" />`, { required: true })}
        ${field("Description", `<textarea required name="description" rows="3" maxlength="${MAX}" placeholder="Application, voltage class, environment, target dates…" class="textarea"></textarea>`, { required: true, hint: "", hintId: "p-desc-hint" })}
        <p data-error hidden class="rounded-sm border border-[#9b2c2c]/20 bg-[#9b2c2c]/5 px-3 py-2 text-sm font-medium text-[#9b2c2c]"></p>
        <div class="flex items-center justify-between gap-3 border-t border-line pt-4">
          <button type="button" data-modal-close class="text-sm font-medium text-ink-soft hover:text-brand-navy">Cancel</button>
          <button type="submit" class="btn btn-primary">Submit enquiry ${icon("send")}</button>
        </div>
      </form>`;
    const modal = openModal({
      eyebrow: "Product enquiry",
      title: p.name,
      sub: `SKU&nbsp;<span class="font-mono">${esc(sku)}</span><span class="px-1.5">·</span><span class="capitalize">${esc(category.replace(/-/g, " "))}</span>`,
      body,
      labelId: "enquiry-title",
    });
    const form = $("form", modal.el);
    charCounter(form, "description", "p-desc-hint", MAX);
    const material = $("[data-material]", form);
    const updMaterial = (v) => {
      material.textContent = category.replace(/-/g, " ") + (v.length ? ` · ${v.slice(0, 3).join(", ")}${v.length > 3 ? ` +${v.length - 3}` : ""}` : "");
      $("#p-brand-hint", form).textContent = v.length ? `${v.length} selected` : "pick or type";
    };
    const brands = brandSelect($("[data-brands]", form), { initial: initialBrands, placeholder: "Search brands or type a new one…", onChange: updMaterial });
    updMaterial(initialBrands);

    let specForm = null;
    AMK.api.getProductSpecForm(p.slug).then((payload) => {
      specForm = payload;
      if (payload.groups.length) {
        $("[data-specs]", form).innerHTML = specFields(payload);
        wireSpecOther(form);
        refreshIcons();
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      let specs;
      if (specForm && specForm.groups.length) {
        specs = collectSpecs(form, specForm);
        if (specs.missing) {
          const err = $("[data-error]", form);
          err.textContent = `Please fill in: ${specs.missing}`;
          err.hidden = false;
          return;
        }
      }
      const fd = new FormData(form);
      submitInquiry(
        form,
        modal,
        {
          product_slug: p.slug,
          product_name: p.name,
          product_sku: sku,
          product_category: p.category || "",
          product_brand: p.brand,
          name: String(fd.get("name") || ""),
          country_code: String(fd.get("cc") || "+91"),
          phone: String(fd.get("phone") || ""),
          email: String(fd.get("email") || ""),
          buyer_category: fd.get("category") === "company" ? "company" : "individual",
          requested_brands: brands.get(),
          model_number: String(fd.get("model") || ""),
          other_option: String(fd.get("other") || ""),
          quantity: Number(fd.get("quantity") || 1),
          description: String(fd.get("description") || ""),
          spec_values: specs ? specs.values : undefined,
        },
        "Enquiry received",
        "An AMK application engineer will reach out within 24 hours with stock visibility, lead times and indicative pricing."
      );
    });
    return modal;
  }

  AMK.openGeneralEnquiry = openGeneralEnquiry;
  AMK.openProductEnquiry = openProductEnquiry;

  /** WhatsApp enquiry with the current page URL embedded. */
  AMK.openWhatsAppEnquiry = (name, sku) => {
    const msg = `Hi AMK,\n\nI'd like to enquire about ${name} (SKU ${sku}).\n\nProduct link: ${location.href}\n\nPlease share availability, lead time and indicative pricing.`;
    window.open(whatsappHref(msg), "_blank", "noopener,noreferrer");
  };

  /* ------------------------------------------------------------------ */
  /* Floating "Post your need" button                                    */
  /* ------------------------------------------------------------------ */
  function mountFab() {
    const wrap = document.createElement("div");
    wrap.className = "fixed bottom-5 right-4 z-[120] translate-y-6 opacity-0 transition-all duration-500 ease-out sm:bottom-6 sm:right-6 [padding-bottom:env(safe-area-inset-bottom,0)]";
    wrap.innerHTML = `
      <button type="button" data-enquire-general aria-label="Post a buy requirement"
        class="group relative inline-flex items-center gap-2.5 rounded-full border border-brand-gold/40 bg-brand-navy py-2 pl-2 pr-4 text-white shadow-[0_18px_45px_-12px_rgba(7,29,64,0.6)] transition-all duration-300 hover:scale-[1.04] active:scale-95 sm:py-2.5 sm:pr-5">
        <span class="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-gold">
          <span aria-hidden="true" class="absolute inset-0 animate-ping rounded-full bg-brand-gold opacity-50"></span>
          ${icon("sparkles", "fab-wiggle relative h-4 w-4")}
        </span>
        <span class="hidden flex-col text-left leading-tight sm:flex">
          <span class="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-gold">Buy Requirement</span>
          <span class="text-[13.5px] font-bold tracking-tight">Post your need</span>
        </span>
        <span class="text-[13px] font-bold tracking-tight sm:hidden">Need help?</span>
      </button>`;
    document.body.appendChild(wrap);
    setTimeout(() => wrap.classList.remove("translate-y-6", "opacity-0"), 250);
    document.addEventListener("amk:modal-open", () => wrap.classList.add("pointer-events-none", "opacity-0"));
    document.addEventListener("amk:modal-close", () => wrap.classList.remove("pointer-events-none", "opacity-0"));
  }

  /* ------------------------------------------------------------------ */
  /* Popup ads (staff-managed; silently skipped when API is offline)     */
  /* ------------------------------------------------------------------ */
  const WINDOW_MS = { once_per_day: 86400000, once_per_week: 604800000 };
  function seen(p) {
    try {
      const key = `amk_popup_${p.id}`;
      if (p.frequency === "every_visit") return false;
      if (p.frequency === "once_per_session") return sessionStorage.getItem(key) === "1";
      if (p.frequency === "once_ever") return localStorage.getItem(key) === "1";
      return Date.now() - Number(localStorage.getItem(key) || 0) < (WINDOW_MS[p.frequency] || 0);
    } catch (e) {
      return false;
    }
  }
  function markSeen(p) {
    try {
      const key = `amk_popup_${p.id}`;
      if (p.frequency === "once_per_session") sessionStorage.setItem(key, "1");
      else if (p.frequency === "once_ever") localStorage.setItem(key, "1");
      else localStorage.setItem(key, String(Date.now()));
    } catch (e) {}
  }
  async function mountPopups() {
    const routePath = "/" + (location.pathname.split("/").pop() || "").replace(/\.html$/, "").replace(/^index$/, "");
    const list = await AMK.api.getPopups(routePath);
    const p = list.find((x) => !seen(x));
    if (!p) return;
    const show = () => {
      markSeen(p);
      const el = document.createElement("div");
      el.className = "fixed inset-0 z-[100] flex items-center justify-center bg-brand-deep/55 p-4";
      el.innerHTML = `
        <div class="relative w-full max-w-md overflow-hidden rounded-sm border-t-4 border-brand-gold bg-white shadow-elev animate-rise" data-card>
          ${p.dismissable ? `<button type="button" data-x aria-label="Close" class="absolute right-2 top-2 z-10 rounded-sm bg-black/40 p-1 text-white hover:bg-black/60">${icon("x")}</button>` : ""}
          ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.title)}" class="h-44 w-full object-cover" />` : ""}
          <div class="p-6">
            <h3 class="font-serif text-xl font-bold">${esc(p.title)}</h3>
            ${p.subtitle ? `<p class="mt-1 text-sm text-ink-soft">${esc(p.subtitle)}</p>` : ""}
            ${p.body ? `<p class="mt-2 text-sm text-ink-muted">${esc(p.body)}</p>` : ""}
            ${p.cta_label ? `<a href="${esc(AMK.url.fromPath(p.link || "#"))}" data-x class="btn btn-primary mt-5">${esc(p.cta_label)}</a>` : ""}
          </div>
        </div>`;
      document.body.appendChild(el);
      refreshIcons();
      const close = () => el.remove();
      el.addEventListener("click", (e) => {
        if (e.target.closest("[data-x]") || (p.dismissable && !e.target.closest("[data-card]"))) close();
      });
      if (p.auto_close_seconds) setTimeout(close, p.auto_close_seconds * 1000);
    };
    if (p.trigger === "immediate") show();
    else if (p.trigger === "delay") setTimeout(show, (p.delay_seconds || 5) * 1000);
    else if (p.trigger === "scroll") {
      const onScroll = () => {
        const max = document.body.scrollHeight - innerHeight;
        if ((max > 0 ? (scrollY / max) * 100 : 100) >= (p.scroll_pct || 50)) {
          removeEventListener("scroll", onScroll);
          show();
        }
      };
      addEventListener("scroll", onScroll, { passive: true });
    } else if (p.trigger === "exit_intent") {
      const onLeave = (e) => {
        if (e.clientY <= 0) {
          document.removeEventListener("mouseout", onLeave);
          show();
        }
      };
      document.addEventListener("mouseout", onLeave);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Init                                                                */
  /* ------------------------------------------------------------------ */
  let initialised = false;
  AMK.init = function () {
    if (!initialised) {
      initialised = true;
      const h = $("#site-header");
      if (h) h.outerHTML = topBar() + header() + navShell();
      const f = $("#site-footer");
      if (f) f.outerHTML = footer();
      AMK.api.getCategoryTree().then(mountNav).then(refreshIcons);
      mountFab();
      mountPopups();

      /* Delegated triggers for modals */
      document.addEventListener("click", (e) => {
        const pb = e.target.closest("[data-enquire-product]");
        if (pb) {
          e.preventDefault();
          const p = productRegistry.get(pb.dataset.enquireProduct);
          if (p) openProductEnquiry(p);
          return;
        }
        const gb = e.target.closest("[data-enquire-general]");
        if (gb) {
          e.preventDefault();
          openGeneralEnquiry({
            category: gb.dataset.category || "",
            productName: gb.dataset.productName || "",
            description: gb.dataset.description || "",
          });
        }
      });
    }
    initStrips();
    refreshIcons();
  };
})();
