/* =========================================================================
   Site chrome — rendered once per page from a single source:
     AMK.renderTop()    → utility bar, header (logo / search / actions), category nav
     AMK.renderBottom() → trust band, footer, floating "Post your need" button, ad popups
   ========================================================================= */
(function () {
  const AMK = window.AMK;
  const E = AMK.esc;
  const I = AMK.i;
  const S = AMK.SITE;

  const TOP_LEFT = [
    { label: "About AMK", href: "/about" },
    { label: "Our Brands", href: "/about#partners" },
    { label: "Careers", href: "/about#careers" },
  ];
  const TOP_RIGHT = [
    { label: "FAQs", href: "/faqs" },
    { label: "Contact", href: "/contact" },
  ];
  const UTILITY_LINKS = [
    { label: "About AMK", href: "/about", icon: "info" },
    { label: "Our Brands", href: "/about#partners", icon: "award" },
    { label: "Careers", href: "/about#careers", icon: "briefcase" },
    { label: "FAQs", href: "/faqs", icon: "circle-help" },
    { label: "Contact", href: "/contact", icon: "mail" },
  ];
  const COMPANY_LINKS = [
    { label: "About AMK", href: "/about" },
    { label: "Our Brands", href: "/about#partners" },
    { label: "Careers", href: "/about#careers" },
    { label: "News & Insights", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];
  const SUPPORT_LINKS = [
    { label: "Request Quote", href: "/contact#rfq" },
    { label: "Returns & Warranty", href: "/returns" },
    { label: "Logistics & Delivery", href: "/shipping" },
    { label: "FAQs", href: "/faqs" },
  ];
  const LEGAL_LINKS = [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Returns & Refunds", href: "/returns" },
  ];
  const TRUST = [
    { icon: "shield-check", title: "100% Genuine products", sub: "Authorised OEM channel, full traceability" },
    { icon: "badge-percent", title: "Best prices, guaranteed", sub: "Project & bulk pricing on every quote" },
    { icon: "truck", title: "Pan-India fast delivery", sub: "Same / next-day dispatch on stock" },
    { icon: "headset", title: "Engineer support", sub: "Quotes within 24 hours, Mon – Sat" },
  ];

  const shortLabel = (name) => String(name).replace(/\s+Segment$/i, "").trim();
  const ROOT_ICONS = {
    "industrial-segment": "factory",
    "commercial-segment": "building-2",
    "retail-consumer-segment": "lamp",
    "energy-sustainability-segment": "sun",
    "mro-general-trading-segment": "wrench",
    "industrial-it-smart-solutions-segment": "cpu",
    "project-engineering-solutions-segment": "hard-hat",
  };
  const rootIcon = (slug) => ROOT_ICONS[slug] || "layout-grid";

  /* ------------------------------------------------------------------ */
  /* Top                                                                 */
  /* ------------------------------------------------------------------ */
  AMK.renderTop = function () {
    const q = AMK.esc(AMK.qs("q") || "");
    const html = `
    <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[300] focus:rounded focus:bg-white focus:px-3 focus:py-2">Skip to content</a>

    <!-- Utility bar -->
    <div class="hidden border-b border-line bg-white text-[12.5px] text-ink-muted md:block">
      <div class="container-site flex h-9 items-center justify-between">
        <div class="flex items-center gap-5">
          <span class="inline-flex items-center gap-1.5 text-ink">${I("globe", "h-3.5 w-3.5 text-accent")} Welcome to ${E(S.fullName)}</span>
          <span class="h-3.5 w-px bg-line"></span>
          ${TOP_LEFT.map((l) => `<a href="${AMK.url(l.href)}" class="hover:text-accent">${E(l.label)}</a>`).join("")}
        </div>
        <div class="flex items-center gap-5">
          <a href="mailto:${S.email}" class="hidden items-center gap-1.5 hover:text-accent lg:inline-flex">${I("mail", "h-3.5 w-3.5")}${S.email}</a>
          ${TOP_RIGHT.map((l) => `<a href="${AMK.url(l.href)}" class="hover:text-accent">${E(l.label)}</a>`).join("")}
          <a href="${AMK.url("/contact#rfq")}" class="font-semibold text-accent hover:text-accent-dark">Request Quote</a>
        </div>
      </div>
    </div>

    <!-- Header -->
    <header class="bg-white">
      <div class="container-site flex h-[76px] items-center gap-4 lg:gap-8">
        <a href="index.html" class="shrink-0" aria-label="${E(S.fullName)}">
          <img src="assets/img/logo.png" alt="${E(S.fullName)}" width="515" height="264" class="h-10 w-auto md:h-12" />
        </a>

        <form action="shop.html" method="get" role="search" class="relative hidden flex-1 md:block">
          <label for="site-search" class="sr-only">Search the catalogue</label>
          <div class="flex h-12 items-center rounded-full border-2 border-accent bg-white pl-5 pr-1 transition focus-within:shadow-[0_0_0_4px_rgba(200,16,46,.12)]">
            ${I("search", "h-4 w-4 shrink-0 text-ink-soft")}
            <input id="site-search" type="text" name="q" value="${q}" placeholder="What are you looking for? Products, brands, SKU…"
                   class="h-full min-w-0 flex-1 bg-transparent px-3 text-[15px] outline-none placeholder:text-ink-soft" />
            <button type="submit" class="btn btn-accent h-9 px-6 !shadow-none">Search</button>
          </div>
        </form>

        <div class="ml-auto flex items-center gap-1 md:ml-0 lg:gap-2">
          <a href="tel:${S.phoneTel}" class="hidden items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-canvas xl:flex" aria-label="Sales hotline ${E(S.hotline)}">
            ${I("phone-call", "h-6 w-6 text-ink")}
            <span class="leading-tight"><span class="block text-[11.5px] text-ink-soft">${E(S.hotlineLabel)}</span>
            <span class="block text-[13.5px] font-semibold text-ink">${E(S.hotline)}</span></span>
          </a>
          <button type="button" data-post-requirement class="hidden items-center gap-2.5 rounded-lg px-2 py-1.5 text-left hover:bg-canvas lg:flex">
            ${I("clipboard-list", "h-6 w-6 text-ink")}
            <span class="leading-tight"><span class="block text-[11.5px] text-ink-soft">Can't find it?</span>
            <span class="block text-[13.5px] font-semibold text-ink">Post Requirement</span></span>
          </button>
          <a href="${AMK.url("/contact#rfq")}" class="btn btn-accent ml-1 hidden lg:inline-flex">${I("file-text", "h-4 w-4")} Request Quote</a>
          <a href="tel:${S.phoneTel}" class="grid h-10 w-10 place-items-center rounded-full border border-line text-ink md:hidden" aria-label="Call sales">${I("phone", "h-4 w-4")}</a>
        </div>
      </div>

      <div class="container-site pb-3 md:hidden">
        <form action="shop.html" method="get" role="search" class="flex h-11 items-center rounded-full border-2 border-accent bg-white pl-4 pr-1">
          ${I("search", "h-4 w-4 shrink-0 text-ink-soft")}
          <input type="text" name="q" value="${q}" placeholder="Search products, brands, SKU…" aria-label="Search the catalogue"
                 class="h-full min-w-0 flex-1 bg-transparent px-2.5 text-[15px] outline-none" />
          <button type="submit" aria-label="Search" class="btn btn-accent btn-sm !shadow-none">Search</button>
        </form>
      </div>
    </header>

    <!-- Category navigation -->
    <nav id="amk-nav" aria-label="Product categories" class="sticky top-0 z-40 border-y border-line bg-white shadow-[0_4px_12px_-10px_rgba(16,24,40,.35)]">
      <div class="container-site flex h-12 items-center gap-2">
        <button type="button" id="amk-menu-btn" aria-label="All categories" aria-expanded="false"
                class="inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-navy px-4 text-[13.5px] font-semibold text-white hover:bg-navy-900">
          ${I("menu", "h-4 w-4")}<span class="hidden sm:inline">All Categories</span>
        </button>
        <div class="relative min-w-0 flex-1">
          <span aria-hidden="true" class="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent"></span>
          <ul id="amk-nav-list" class="no-scrollbar flex min-w-0 items-center overflow-x-auto whitespace-nowrap text-[14px] font-medium text-ink">
            ${Array.from({ length: 6 }, () => `<li class="px-3"><span class="skeleton block h-3 w-24"></span></li>`).join("")}
          </ul>
        </div>
        <a href="${AMK.url("/segments")}" class="hidden shrink-0 items-center gap-1.5 border-l border-line pl-4 text-[13.5px] font-semibold text-ink hover:text-accent 2xl:inline-flex">${I("layers", "h-4 w-4 text-accent")} Business Segments</a>
      </div>
    </nav>`;

    document.currentScript.insertAdjacentHTML("beforebegin", html);
    initNav();
  };

  /* ------------------------------------------------------------------ */
  /* Category navigation: mega menu (desktop) + drawer (mobile)          */
  /* ------------------------------------------------------------------ */
  let tree = [];
  let closeTimer;
  const desktop = window.matchMedia("(min-width: 1024px)");

  function initNav() {
    AMK.get("/categories/tree/").then((data) => {
      tree = Array.isArray(data) ? data : [];
      const list = document.getElementById("amk-nav-list");
      list.innerHTML = tree.map((root) => `
        <li class="shrink-0">
          <a href="${AMK.url(`/category/${root.slug}`)}" data-root="${E(root.slug)}"
             class="nav-root relative flex h-12 items-center gap-1 px-3 transition hover:text-accent">
            ${E(shortLabel(root.name))}
            ${root.children && root.children.length ? I("chevron-down", "hidden h-3.5 w-3.5 text-ink-soft lg:inline-block") : ""}
          </a>
        </li>`).join("");
      list.querySelectorAll(".nav-root").forEach((a) => {
        const open = () => {
          if (!desktop.matches) return;
          const root = tree.find((n) => n.slug === a.dataset.root);
          if (!root || !(root.children || []).length) return closeMega();
          openCascade(root.children, a, false);
        };
        a.addEventListener("mouseenter", open);
        a.addEventListener("focus", open);
        a.addEventListener("mouseleave", scheduleClose);
      });
    });

    const btn = document.getElementById("amk-menu-btn");
    btn.addEventListener("click", () => {
      if (!desktop.matches) return openDrawer();
      if (document.getElementById("amk-mega")?.dataset.pinned === "1") closeMega();
      else openCascade(tree, btn, true);
    });
    window.addEventListener("scroll", () => {
      if (document.getElementById("amk-mega")?.dataset.pinned !== "1") closeMega();
    }, { passive: true });
    window.addEventListener("resize", closeMega);
    document.addEventListener("keydown", (e) => e.key === "Escape" && closeMega());
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#amk-mega") && !e.target.closest("#amk-menu-btn")) closeMega();
    });
  }

  function scheduleClose() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      if (document.getElementById("amk-mega")?.dataset.pinned !== "1") closeMega();
    }, 200);
  }
  function closeMega() {
    clearTimeout(closeTimer);
    document.getElementById("amk-mega")?.remove();
    document.getElementById("amk-menu-btn")?.setAttribute("aria-expanded", "false");
    document.querySelectorAll(".nav-root.is-open").forEach((a) => a.classList.remove("is-open", "!text-accent", "bg-canvas"));
  }

  /* Cascading flyout menu, same behaviour as the live site:
     level 1 drops below the nav item; hovering an item with children opens
     the next level beside it (flips left near the right edge and slides up
     to stay on screen). Every item is a link to /category/<slug>. */
  const COL_W = 270;
  function openCascade(nodes, anchor, pinned) {
    const current = document.getElementById("amk-mega");
    if (current && current.dataset.anchor === (anchor.dataset.root || "all")) return clearTimeout(closeTimer);
    closeMega();
    anchor.classList.add("is-open");
    if (pinned) anchor.setAttribute("aria-expanded", "true");
    else anchor.classList.add("!text-accent", "bg-canvas");

    const box = document.createElement("div");
    box.id = "amk-mega";
    box.dataset.pinned = pinned ? "1" : "0";
    box.dataset.anchor = anchor.dataset.root || "all";
    box.addEventListener("mouseenter", () => clearTimeout(closeTimer));
    box.addEventListener("mouseleave", scheduleClose);
    document.body.appendChild(box);

    const navBottom = document.getElementById("amk-nav").getBoundingClientRect().bottom;
    const r = anchor.getBoundingClientRect();
    showLevel(box, 0, nodes, { left: Math.min(r.left, window.innerWidth - COL_W - 8), top: navBottom }, pinned);
  }

  function showLevel(box, depth, nodes, pos, withIcons) {
    box.querySelectorAll("[data-level]").forEach((ul) => { if (Number(ul.dataset.level) >= depth) ul.remove(); });
    const ul = document.createElement("ul");
    ul.dataset.level = String(depth);
    ul.setAttribute("role", "menu");
    ul.className = "fixed z-[95] overflow-y-auto border border-line bg-white py-1 shadow-pop";
    ul.style.width = `${COL_W}px`;
    ul.style.maxHeight = `${window.innerHeight - 16}px`;
    ul.innerHTML = nodes.map((n, i) => {
      const kids = (n.children || []).length;
      return `<li role="none"><a role="menuitem" href="${AMK.url(`/category/${n.slug}`)}" data-i="${i}"
        class="cas-item flex items-center gap-3 px-4 py-2.5 text-[14px] text-ink hover:bg-canvas hover:text-accent">
        ${withIcons && depth === 0 ? I(rootIcon(n.slug), "h-4 w-4 shrink-0 text-ink-soft") : ""}
        <span class="min-w-0 flex-1">${E(depth === 0 && withIcons ? shortLabel(n.name) : n.name)}</span>
        ${kids ? I("chevron-right", "h-4 w-4 shrink-0 text-ink-soft") : ""}</a></li>`;
    }).join("");
    box.appendChild(ul);

    // Position: keep inside the viewport vertically.
    const h = ul.offsetHeight;
    const top = Math.max(8, Math.min(pos.top, window.innerHeight - h - 8));
    ul.style.left = `${Math.max(8, pos.left)}px`;
    ul.style.top = `${top}px`;

    ul.addEventListener("mouseover", (e) => {
      const a = e.target.closest(".cas-item");
      if (!a || a.classList.contains("is-active")) return;
      ul.querySelectorAll(".is-active").forEach((x) => x.classList.remove("is-active", "bg-canvas", "!text-accent"));
      a.classList.add("is-active", "bg-canvas", "!text-accent");
      const node = nodes[Number(a.dataset.i)];
      const kids = node.children || [];
      if (!kids.length) {
        box.querySelectorAll("[data-level]").forEach((x) => { if (Number(x.dataset.level) > depth) x.remove(); });
        return;
      }
      const ar = a.getBoundingClientRect();
      const ulr = ul.getBoundingClientRect();
      let left = ulr.right - 1;
      if (left + COL_W > window.innerWidth - 8) left = ulr.left - COL_W + 1;
      showLevel(box, depth + 1, kids, { left, top: ar.top - 5 }, false);
    });
  }

  function openDrawer() {
    const btn = document.getElementById("amk-menu-btn");
    btn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";

    const mobileNode = (n, depth) => {
      const kids = n.children && n.children.length;
      return `<li>
        <div class="flex items-stretch" style="padding-left:${depth * 14}px">
          <a href="${AMK.url(`/category/${n.slug}`)}" class="flex flex-1 items-center gap-3 py-3 pl-4 pr-2 text-[14.5px] ${depth ? "text-ink-muted" : "font-semibold text-ink"} hover:text-accent">
            ${depth === 0 ? I(rootIcon(n.slug), "h-4 w-4 text-accent") : ""}${E(depth === 0 ? shortLabel(n.name) : n.name)}</a>
          ${kids ? `<button type="button" class="dr-toggle grid w-12 place-items-center text-ink-soft hover:bg-canvas" aria-expanded="false" aria-label="Expand ${E(n.name)}">${I("chevron-down", "h-4 w-4")}</button>` : ""}
        </div>
        ${kids ? `<ul class="hidden bg-paper">${n.children.map((c) => mobileNode(c, depth + 1)).join("")}</ul>` : ""}
      </li>`;
    };

    const wrap = document.createElement("div");
    wrap.id = "amk-drawer";
    wrap.innerHTML = `
      <button type="button" data-close class="fixed inset-0 z-[60] cursor-default bg-navy-950/50" aria-label="Close menu"></button>
      <div role="dialog" aria-modal="true" aria-label="Categories" class="fade-up fixed inset-y-0 left-0 z-[70] flex w-[86%] max-w-[360px] flex-col bg-white text-ink shadow-2xl">
        <div class="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <img src="assets/img/logo.png" alt="${E(S.fullName)}" class="h-9 w-auto" />
          <button type="button" data-close class="grid h-9 w-9 place-items-center rounded-full bg-canvas hover:bg-line" aria-label="Close menu">${I("x", "h-5 w-5")}</button>
        </div>
        <div class="grid grid-cols-2 gap-2 border-b border-line p-3">
          <button type="button" data-post-requirement class="btn btn-accent btn-sm">${I("clipboard-list", "h-4 w-4")} Post Need</button>
          <a href="tel:${S.phoneTel}" class="btn btn-outline btn-sm">${I("phone", "h-4 w-4")} Call Sales</a>
        </div>
        <div class="flex-1 overflow-y-auto">
          <p class="px-4 pb-1 pt-4 text-[11.5px] font-bold uppercase tracking-[0.08em] text-ink-soft">All Categories</p>
          <ul class="divide-y divide-line">${tree.map((n) => mobileNode(n, 0)).join("") || `<li class="px-4 py-4 text-sm text-ink-soft">Loading categories…</li>`}</ul>
          <p class="border-t border-line px-4 pb-1 pt-4 text-[11.5px] font-bold uppercase tracking-[0.08em] text-ink-soft">Information</p>
          <ul>
            ${UTILITY_LINKS.map((l) => `<li><a href="${AMK.url(l.href)}" class="flex items-center gap-3 px-4 py-2.5 text-[14.5px] text-ink hover:text-accent">${I(l.icon, "h-4 w-4 text-ink-soft")}${E(l.label)}</a></li>`).join("")}
          </ul>
          <div class="p-4"><a href="${AMK.url("/contact#rfq")}" class="btn btn-primary w-full">${I("file-text", "h-4 w-4")} Request a Quote</a></div>
        </div>
      </div>`;

    const close = () => {
      wrap.remove();
      document.body.style.overflow = "";
      btn.setAttribute("aria-expanded", "false");
      document.removeEventListener("keydown", onKey);
    };
    const onKey = (e) => e.key === "Escape" && close();
    wrap.addEventListener("click", (e) => {
      if (e.target.closest("[data-close]") || e.target.closest("a") || e.target.closest("[data-post-requirement]")) return close();
      const t = e.target.closest(".dr-toggle");
      if (t) {
        const ul = t.closest("li").querySelector(":scope > ul");
        const open = ul.classList.toggle("hidden") === false;
        t.setAttribute("aria-expanded", String(open));
        t.firstElementChild?.classList.toggle("rotate-180", open);
      }
    });
    document.addEventListener("keydown", onKey);
    document.body.appendChild(wrap);
  }

  /* ------------------------------------------------------------------ */
  /* Bottom                                                              */
  /* ------------------------------------------------------------------ */
  AMK.renderBottom = function () {
    const col = (title, links) => `
      <div>
        <h3 class="text-[14px] font-semibold text-white">${E(title)}</h3>
        <ul class="mt-4 space-y-2.5 text-[13.5px] text-slate-400">
          ${links.map((l) => `<li><a href="${AMK.url(l.href)}" class="transition hover:text-white">${E(l.label)}</a></li>`).join("")}
        </ul>
      </div>`;

    const socials = [
      { label: "LinkedIn", icon: "linkedin", href: "#" },
      { label: "YouTube", icon: "youtube", href: "#" },
      { label: "WhatsApp", icon: "message-circle", href: `https://wa.me/${S.whatsapp}` },
      { label: "Email", icon: "mail", href: `mailto:${S.email}` },
    ];

    const html = `
    <!-- Trust band -->
    <section class="mt-12 border-t border-line bg-white">
      <div class="container-site grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
        ${TRUST.map((t) => `<div class="flex items-center gap-3.5">
          <span class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent-light text-accent">${I(t.icon, "h-5 w-5")}</span>
          <span><span class="block text-[14px] font-semibold text-ink">${t.title}</span><span class="block text-[12.5px] text-ink-soft">${t.sub}</span></span>
        </div>`).join("")}
      </div>
    </section>

    <footer class="bg-[#070f24] text-slate-400">
      <div class="container-site grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr]">
        <div>
          <a href="index.html" class="inline-block rounded-lg bg-white px-3 py-2"><img src="assets/img/logo.png" alt="${E(S.fullName)}" class="h-10 w-auto" loading="lazy" /></a>
          <p class="mt-5 max-w-xs text-[13.5px] leading-relaxed">${E(S.tagline)}.</p>
          <div class="mt-5 flex gap-2">
            ${socials.map((s) => `<a href="${s.href}" aria-label="${s.label}" class="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-slate-300 transition hover:bg-accent hover:text-white">${I(s.icon, "h-4 w-4")}</a>`).join("")}
          </div>
        </div>
        ${col("Business Segments", AMK.SEGMENTS.map((s) => ({ label: s.name, href: `/segment/${s.slug}` })))}
        ${col("Company", COMPANY_LINKS)}
        ${col("Customer Support", SUPPORT_LINKS)}
        <div>
          <h3 class="text-[14px] font-semibold text-white">Get in touch</h3>
          <ul class="mt-4 space-y-3 text-[13.5px]">
            <li><a href="tel:${S.phoneTel}" class="flex items-start gap-2.5 hover:text-white">${I("phone", "mt-0.5 h-4 w-4 shrink-0 text-accent")}<span><span class="block text-white">${E(S.hotline)}</span>${E(S.hotlineLabel)}</span></a></li>
            <li><a href="mailto:${S.email}" class="flex items-start gap-2.5 hover:text-white">${I("mail", "mt-0.5 h-4 w-4 shrink-0 text-accent")}<span><span class="block text-white">${E(S.email)}</span>${E(S.emailInfo)}</span></a></li>
            <li class="flex items-start gap-2.5">${I("map-pin", "mt-0.5 h-4 w-4 shrink-0 text-accent")}<address class="not-italic leading-relaxed">${E(S.address)}</address></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/10">
        <div class="container-site flex flex-col items-center justify-between gap-3 py-5 text-[12.5px] md:flex-row">
          <span>© ${new Date().getFullYear()} ${E(S.fullName)}. All rights reserved.</span>
          <nav class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            ${LEGAL_LINKS.map((l) => `<a href="${AMK.url(l.href)}" class="hover:text-white">${E(l.label)}</a>`).join("")}
          </nav>
        </div>
      </div>
    </footer>

    <div id="amk-fab" class="fixed bottom-5 right-4 z-[120] translate-y-6 opacity-0 transition-all duration-500 sm:bottom-6 sm:right-6">
      <button type="button" data-post-requirement aria-label="Post a buy requirement"
              class="group inline-flex items-center gap-2.5 rounded-full bg-accent py-2 pl-2 pr-4 text-white shadow-[0_16px_40px_-12px_rgba(200,16,46,.75)] transition hover:scale-[1.03] hover:bg-accent-dark active:scale-95 sm:pr-5">
        <span class="relative grid h-9 w-9 place-items-center rounded-full bg-white/20">
          <span class="absolute inset-0 animate-ping rounded-full bg-white/30"></span>
          ${I("clipboard-list", "relative h-4 w-4")}
        </span>
        <span class="hidden flex-col text-left leading-tight sm:flex">
          <span class="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white/75">Buy Requirement</span>
          <span class="text-[14px] font-bold">Post your need</span>
        </span>
        <span class="text-[14px] font-bold sm:hidden">Need help?</span>
      </button>
    </div>`;

    document.currentScript.insertAdjacentHTML("beforebegin", html);
    setTimeout(() => document.getElementById("amk-fab")?.classList.remove("translate-y-6", "opacity-0"), 250);
    initPopups();
  };

  /* ------------------------------------------------------------------ */
  /* Staff-managed popup ads (GET /ad-popups/?path=…)                    */
  /* ------------------------------------------------------------------ */
  const WINDOW_MS = { once_per_day: 86400000, once_per_week: 604800000 };
  function seenRecently(p) {
    try {
      const key = `amk_popup_${p.id}`;
      if (p.frequency === "every_visit") return false;
      if (p.frequency === "once_per_session") return sessionStorage.getItem(key) === "1";
      if (p.frequency === "once_ever") return localStorage.getItem(key) === "1";
      return Date.now() - Number(localStorage.getItem(key) || 0) < (WINDOW_MS[p.frequency] ?? 0);
    } catch { return true; }
  }
  function markSeen(p) {
    try {
      const key = `amk_popup_${p.id}`;
      if (p.frequency === "once_per_session") sessionStorage.setItem(key, "1");
      else if (p.frequency === "once_ever") localStorage.setItem(key, "1");
      else localStorage.setItem(key, String(Date.now()));
    } catch { /* ignore */ }
  }

  function initPopups() {
    AMK.get(`/ad-popups/?path=${encodeURIComponent(AMK.currentRoute())}`).then((data) => {
      const p = (data?.results || []).find((x) => !seenRecently(x));
      if (!p) return;
      const show = () => { markSeen(p); renderPopup(p); };
      if (p.trigger === "immediate") show();
      else if (p.trigger === "delay") setTimeout(show, (p.delay_seconds || 5) * 1000);
      else if (p.trigger === "scroll") {
        const onScroll = () => {
          const max = document.body.scrollHeight - window.innerHeight;
          if ((max > 0 ? (window.scrollY / max) * 100 : 100) >= (p.scroll_pct || 50)) {
            window.removeEventListener("scroll", onScroll);
            show();
          }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
      } else if (p.trigger === "exit_intent") {
        const onLeave = (e) => {
          if (e.clientY <= 0) { document.removeEventListener("mouseout", onLeave); show(); }
        };
        document.addEventListener("mouseout", onLeave);
      }
    });
  }

  function renderPopup(p) {
    if (document.querySelector("[role=dialog][aria-modal=true]")) return; // never stack over a form
    const el = document.createElement("div");
    el.className = "fixed inset-0 z-[150] flex items-center justify-center bg-navy-950/55 p-4";
    el.innerHTML = `
      <div class="fade-up relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl" data-card>
        ${p.dismissable ? `<button type="button" data-x aria-label="Close" class="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/45 text-white hover:bg-black/65">${I("x", "h-4 w-4")}</button>` : ""}
        ${p.image ? `<img src="${E(p.image)}" alt="${E(p.title)}" class="h-48 w-full object-cover" />` : ""}
        <div class="p-6">
          <h3 class="text-xl font-bold">${E(p.title)}</h3>
          ${p.subtitle ? `<p class="mt-1.5 text-[14.5px] text-ink-muted">${E(p.subtitle)}</p>` : ""}
          ${p.body ? `<p class="mt-2 text-sm text-ink-muted">${E(p.body)}</p>` : ""}
          ${p.cta_label ? `<a href="${AMK.url(p.link || "#")}" data-x class="btn btn-accent mt-5">${E(p.cta_label)} ${I("arrow-right", "h-4 w-4")}</a>` : ""}
        </div>
      </div>`;
    const close = () => el.remove();
    el.addEventListener("click", (e) => {
      if (e.target.closest("[data-x]")) return close();
      if (!e.target.closest("[data-card]") && p.dismissable) close();
    });
    document.body.appendChild(el);
    if (p.auto_close_seconds) setTimeout(close, p.auto_close_seconds * 1000);
  }
})();
