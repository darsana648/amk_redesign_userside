/* Home — fixed hero band + staff-managed promo sections (GET /hero/, GET /home/). */
(function () {
  const AMK = window.AMK;
  const E = AMK.esc;
  const I = AMK.i;

  /* ---------------- Left rail: top categories ---------------- */
  const TOP = [
    ["Switchgear", "switchgear", "zap"],
    ["Automation & Control", "automation-and-control", "cpu"],
    ["Electrical Systems", "electrical-systems", "layout-grid"],
    ["Industrial Cabling", "industrial-cabling", "cable"],
    ["Solar Solutions", "solar-solutions", "sun"],
    ["Power Distribution", "power-distribution", "activity"],
    ["Pumps & Motors", "pumps-and-accessories", "droplet"],
    ["Industrial Networking", "industrial-networking", "network"],
    ["Safety & PPE", "ppe-equipment", "shield-check"],
    ["MRO & Tools", "mro-general-trading-segment", "wrench"],
  ];
  document.getElementById("home-top-cats").innerHTML = TOP.map(([name, slug, icon]) => `
    <li><a href="${AMK.url(`/category/${slug}`)}" class="group flex items-center gap-3 px-4 py-[7px] text-[13.5px] text-ink transition hover:bg-accent-light hover:text-accent">
      ${I(icon, "h-4 w-4 shrink-0 text-ink-soft group-hover:text-accent")}
      <span class="min-w-0 flex-1 truncate">${E(name)}</span>
      ${I("chevron-right", "h-3.5 w-3.5 text-line-strong group-hover:text-accent")}
    </a></li>`).join("");

  /* ---------------- Sourcing tools (below hero) ---------------- */
  const SIDEKICK = [
    { eyebrow: "Free service", title: "Post your buy requirement", sub: "Get verified suppliers in 24 hours", cta: "Post Now", icon: "clipboard-list", tone: "bg-accent-light text-accent", href: "/contact#rfq" },
    { eyebrow: "Talk to an engineer", title: "Application support", sub: "Spec, source, ship — one call", cta: "WhatsApp", icon: "message-circle", tone: "bg-trust-light text-trust", href: `https://wa.me/${AMK.SITE.whatsapp}?text=Hi%20AMK%2C%20I%20need%20product%20support`, external: true },
    { eyebrow: "Just landed", title: "New launches this week", sub: "Drives, inverters, IoT gateways", cta: "Browse", icon: "trending-up", tone: "bg-brand-light text-brand", href: "/shop?sort=new" },
  ];
  document.getElementById("hero-sidekick").innerHTML = SIDEKICK.map((c) => `
    <a href="${AMK.url(c.href)}" ${c.external ? 'target="_blank" rel="noopener noreferrer"' : ""}
       class="panel group flex items-center gap-4 p-4 transition hover:border-transparent hover:shadow-lift">
      <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl ${c.tone}">${I(c.icon, "h-5 w-5")}</span>
      <span class="min-w-0 flex-1">
        <span class="block text-[11.5px] font-semibold uppercase tracking-[0.06em] text-ink-soft">${E(c.eyebrow)}</span>
        <span class="block text-[15px] font-bold leading-snug text-ink group-hover:text-accent">${E(c.title)}</span>
        <span class="block text-[13px] text-ink-muted">${E(c.sub)}</span>
      </span>
      <span class="hidden shrink-0 items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[12.5px] font-semibold text-ink group-hover:border-accent group-hover:text-accent sm:inline-flex md:hidden xl:inline-flex">
        ${E(c.cta)} ${I("arrow-right", "h-3.5 w-3.5")}
      </span>
    </a>`).join("");

  /* ---------------- Hero carousel + promo cards ---------------- */
  const FALLBACK_CARDS = [
    { id: -1, eyebrow: "Upgrade to", title: "Smart Automation", subtitle: "PLC, Drives, Sensors & more", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=70&auto=format&fit=crop", link: "/category/automation-and-control", cta_label: "Shop Now" },
    { id: -2, eyebrow: "Clean Energy", title: "Better Tomorrow", subtitle: "Solar solutions for homes & industries", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=70&auto=format&fit=crop", link: "/category/solar-solutions", cta_label: "Explore Now" },
  ];
  const SLIDE_MS = 4500;

  /* Staff slides (GET /hero/) play first, then the built-in AMK.HERO_SLIDES.
     A staff slide with neither a link nor a button label is treated as an
     unfinished draft and skipped. When a staff slide has the same headline
     as a built-in slide, the staff text and link are kept but the built-in
     photo is used, and the built-in duplicate is dropped. */
  function buildSlides(staff) {
    const key = (s) => s.title.trim().toLowerCase();
    const builtInByTitle = new Map((AMK.HERO_SLIDES || []).map((s) => [key(s), s]));
    const ready = staff
      .filter((s) => (s.link || s.cta_label) && s.title)
      .map((s) => {
        const twin = builtInByTitle.get(key(s));
        return twin ? { ...s, image: twin.image, tab: s.tab || twin.tab, eyebrow: s.eyebrow || twin.eyebrow } : s;
      });
    const seen = new Set(ready.map(key));
    const builtIn = (AMK.HERO_SLIDES || []).filter((s) => !seen.has(key(s)));
    return [...ready, ...builtIn];
  }
  const tabLabel = (s) => s.tab || s.eyebrow || s.title.split(/\s+/).slice(0, 3).join(" ");

  function renderHero(staffSlides, cards) {
    const slides = buildSlides(staffSlides);
    cards = (cards.length ? cards : FALLBACK_CARDS).slice(0, 2);
    const root = document.getElementById("hero-carousel");
    const n = slides.length;
    const pad = (i) => String(i + 1).padStart(2, "0");
    let index = 0;

    root.setAttribute("aria-roledescription", "carousel");
    root.setAttribute("aria-label", "Featured");
    root.style.setProperty("--slide-ms", `${SLIDE_MS}ms`);
    root.innerHTML = `
      ${slides.map((s, i) => `<img src="${E(AMK.img(s.image, 1600))}" alt="" aria-hidden="true" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}
          data-slide-img="${i}" class="hero-img absolute inset-0 h-full w-full object-cover" />`).join("")}
      <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,22,49,.94)_0%,rgba(6,22,49,.82)_38%,rgba(11,43,92,.35)_72%,rgba(11,43,92,.05)_100%)]"></div>
      <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#061631]/85 to-transparent"></div>

      ${n > 1 ? `
      <div class="absolute right-4 top-4 z-10 flex items-center gap-1 sm:right-6 sm:top-6">
        <span class="mr-2 font-mono text-[13px] text-white/80"><b data-count class="text-white">01</b> / ${pad(n - 1)}</span>
        <button type="button" data-go="-1" aria-label="Previous slide" class="grid h-9 w-9 place-items-center border border-white/30 bg-white/5 text-white backdrop-blur transition hover:border-accent hover:bg-accent">${I("chevron-left", "h-4 w-4")}</button>
        <button type="button" data-go="1" aria-label="Next slide" class="grid h-9 w-9 place-items-center border border-white/30 bg-white/5 text-white backdrop-blur transition hover:border-accent hover:bg-accent">${I("chevron-right", "h-4 w-4")}</button>
      </div>` : ""}

      <div class="relative flex flex-1 flex-col">
        <div data-copy class="flex min-h-0 max-w-[620px] flex-1 flex-col justify-center px-6 pb-6 pt-14 sm:px-10 lg:px-12" aria-live="polite"></div>
        ${n > 1 ? `
        <div class="hidden border-t border-white/15 sm:flex" role="tablist" aria-label="Choose slide">
          ${slides.map((s, i) => `<button type="button" role="tab" data-tab="${i}" aria-label="Slide ${i + 1}: ${E(tabLabel(s))}"
              class="hero-tab relative min-w-0 flex-1 border-r border-white/10 px-3 py-3.5 xl:px-4 text-left last:border-r-0 hover:bg-white/5">
              <span class="hero-bar absolute left-0 top-[-1px] h-[3px] bg-accent"></span>
              <span class="block font-mono text-[11px] text-white/50">${pad(i)}</span>
              <span class="block truncate text-[13px] font-semibold">${E(tabLabel(s))}</span>
            </button>`).join("")}
        </div>
        <div class="flex justify-center gap-1.5 pb-4 sm:hidden">
          ${slides.map((_, i) => `<button type="button" data-tab="${i}" aria-label="Slide ${i + 1}" class="hero-dot h-1.5 w-5 bg-white/40"></button>`).join("")}
        </div>` : ""}
      </div>`;

    const copy = root.querySelector("[data-copy]");
    const paint = () => {
      const s = slides[index];
      copy.innerHTML = `<div class="fade-up">
        <p class="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.14em] text-[#ffb07a]">
          <span class="h-[2px] w-8 bg-accent"></span>${E(s.eyebrow || "AMK Industrial Trading")}
        </p>
        <h1 class="mt-3 line-clamp-3 text-[26px] font-extrabold leading-[1.12] tracking-tight text-white sm:text-[36px] lg:text-[40px]">${E(s.title)}</h1>
        ${s.subtitle ? `<p class="mt-3 line-clamp-4 max-w-[540px] sm:line-clamp-3 text-[15px] leading-relaxed text-white/80 sm:text-[16px]">${E(s.subtitle)}</p>` : ""}
        <div class="mt-6 flex flex-wrap gap-3">
          <a href="${AMK.url(s.link || "/shop")}" class="btn btn-accent btn-lg">${E(s.cta_label || "Shop Now")} ${I("arrow-right", "h-4 w-4")}</a>
          <a href="${AMK.url("/contact#rfq")}" class="btn btn-ghost-light btn-lg">Request a Quote</a>
        </div>
      </div>`;
      root.querySelectorAll("[data-slide-img]").forEach((img, i) => img.classList.toggle("is-active", i === index));
      root.querySelectorAll(".hero-tab").forEach((t, i) => {
        const on = i === index;
        t.setAttribute("aria-selected", String(on));
        t.classList.toggle("text-white", on);
        t.classList.toggle("text-white/60", !on);
        const bar = t.querySelector(".hero-bar");
        bar.classList.remove("is-running");
        if (on) { void bar.offsetWidth; bar.classList.add("is-running"); }
      });
      root.querySelectorAll(".hero-dot").forEach((d, i) => {
        d.classList.toggle("bg-accent", i === index);
        d.classList.toggle("bg-white/40", i !== index);
      });
      const count = root.querySelector("[data-count]");
      if (count) count.textContent = pad(index);
    };
    const go = (i) => { index = ((i % n) + n) % n; paint(); };

    root.addEventListener("click", (e) => {
      const b = e.target.closest("[data-go]");
      const t = e.target.closest("[data-tab]");
      if (b) go(index + Number(b.dataset.go));
      if (t) go(Number(t.dataset.tab));
    });
    // On desktop, autoplay is driven by the active tab's progress bar, so
    // hovering (which pauses the bar's CSS animation) pauses the carousel.
    root.addEventListener("animationend", (e) => {
      if (e.target.classList.contains("hero-bar") && e.target.offsetParent) go(index + 1);
    });
    // Phones hide the tabs, so a timer takes over there.
    if (n > 1) setInterval(() => {
      if (!root.querySelector(".hero-tab")?.offsetParent && !root.matches(":hover")) go(index + 1);
    }, SLIDE_MS);
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    });
    let x0 = null;
    root.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    root.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    paint();

    document.getElementById("hero-cards").innerHTML = cards.map((c) => `
      <a href="${AMK.url(c.link || "/shop")}" class="group relative flex min-h-[150px] overflow-hidden rounded-2xl bg-navy text-white">
        ${c.image ? `<img src="${E(AMK.img(c.image, 600))}" alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />` : ""}
        <div class="absolute inset-0 bg-gradient-to-t from-[#061631]/90 via-[#061631]/45 to-transparent"></div>
        <div class="relative mt-auto p-4">
          ${c.eyebrow ? `<p class="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#ffb07a]">${E(c.eyebrow)}</p>` : ""}
          <h3 class="text-[17px] font-bold leading-tight text-white">${E(c.title)}</h3>
          ${c.subtitle ? `<p class="mt-0.5 line-clamp-2 text-[12.5px] text-white/80">${E(c.subtitle)}</p>` : ""}
          <span class="mt-2 inline-flex items-center gap-1 text-[12.5px] font-semibold text-white group-hover:text-[#ffb07a]">${E(c.cta_label || "Shop Now")} ${I("arrow-right", "h-3.5 w-3.5")}</span>
        </div>
      </a>`).join("");
  }

  document.getElementById("home-skeleton").innerHTML = AMK.ui.skeletonGrid(5);
  AMK.get("/hero/").then((d) => renderHero(d?.slides || [], d?.cards || []));

  /* ---------------- Promo sections ---------------- */
  function bannerSection(s) {
    const href = AMK.url(s.link || s.view_all_href || "#");
    return `<section class="container-site pt-8">
      <a href="${href}" class="group relative block aspect-[3/2] overflow-hidden rounded-2xl bg-navy sm:aspect-[21/9] lg:aspect-[24/7]">
        ${s.banner_image ? `<img src="${E(AMK.img(s.banner_image, 1600))}" alt="${E(s.title)}" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />` : ""}
        <div class="absolute inset-0 bg-gradient-to-r from-[#061631]/90 via-[#0b2b5c]/55 to-transparent"></div>
        <div class="relative flex h-full max-w-xl flex-col justify-center gap-2 p-6 text-white md:p-12">
          ${s.eyebrow ? `<span class="chip w-fit bg-white/15 text-white backdrop-blur">${E(s.eyebrow)}</span>` : ""}
          ${s.title ? `<h2 class="text-2xl font-extrabold tracking-tight text-white md:text-4xl">${E(s.title)}</h2>` : ""}
          ${s.subtitle ? `<p class="text-[15px] text-white/80 md:text-base">${E(s.subtitle)}</p>` : ""}
          <span class="btn btn-accent mt-3 w-fit">${E(s.cta_label || "Shop now")} ${I("arrow-right", "h-4 w-4")}</span>
        </div>
      </a>
    </section>`;
  }

  function gridSection(s) {
    const products = AMK.mapProducts(s.products);
    return `<section class="container-site pt-8">
      <div class="panel p-4 sm:p-5">
        ${AMK.ui.sectionHead({
          eyebrow: s.eyebrow, title: s.title, sub: s.subtitle,
          right: `<a href="${AMK.url(s.view_all_href || "/shop")}" class="link-more">View more ${I("chevron-right", "h-4 w-4")}</a>`,
        })}
        ${products.length ? AMK.ui.productGrid(products) : AMK.ui.emptyState("Products coming soon", "This collection is being stocked. Request a quote and we'll confirm availability.")}
      </div>
    </section>`;
  }

  /* ---------------- Source by industry (segments) ---------------- */
  document.getElementById("home-segments").innerHTML = AMK.SEGMENTS.map((s) => `
    <a href="${AMK.url(`/segment/${s.slug}`)}" class="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-xl bg-navy">
      <img src="${E(AMK.img(s.image, 400))}" alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#061631]/95 via-[#061631]/40 to-transparent"></div>
      <div class="relative mt-auto p-3.5">
        <span class="mb-2 grid h-8 w-8 place-items-center rounded-lg bg-white/15 text-white backdrop-blur group-hover:bg-accent">${I(s.icon, "h-4 w-4")}</span>
        <h3 class="text-[15px] font-bold leading-tight text-white">${E(s.name)}</h3>
        <p class="mt-0.5 line-clamp-2 text-[12px] text-white/75">${E(s.tagline)}</p>
      </div>
    </a>`).join("");

  /* ---------------- Top brands wall ---------------- */
  AMK.get("/products/brands/").then((list) => {
    const brands = (Array.isArray(list) ? list : []).filter((b) => b.image).slice(0, 16);
    if (!brands.length) return;
    document.getElementById("home-brands").innerHTML = brands.map((b) => `
      <a href="${AMK.url(`/shop?q=${encodeURIComponent(b.name)}`)}" title="${E(b.name)}"
         class="group flex h-24 flex-col items-center justify-center gap-1.5 bg-white p-3 transition hover:bg-accent-light">
        <img src="${E(b.image)}" alt="${E(b.name)}" loading="lazy" class="max-h-10 max-w-[80%] object-contain grayscale transition group-hover:grayscale-0" />
        <span class="text-[11.5px] font-medium text-ink-soft group-hover:text-ink">${E(b.name)}</span>
      </a>`).join("");
    document.getElementById("home-brands-wrap").classList.remove("hidden");
  });

  AMK.get("/home/").then((d) => {
    const sections = d?.sections || [];
    document.getElementById("home-sections").innerHTML = sections
      .map((s) => (s.kind === "banner" ? bannerSection(s) : gridSection(s)))
      .join("");
  });
})();
