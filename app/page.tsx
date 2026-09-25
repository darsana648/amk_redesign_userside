import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PostRequirementButton } from "@/components/enquiry/buttons";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { EmptyState, MoreLink, ProductGrid, SectionHead } from "@/components/ui";
import { getBrands, getHero, getHomeSections, mapProducts } from "@/lib/api";
import { SEGMENTS, SITE } from "@/lib/site";
import type { HeroBanner, HomeSection } from "@/lib/types";
import { img } from "@/lib/utils";

export const dynamic = "force-dynamic";

/* Left rail: top categories */
const TOP: [string, string, string][] = [
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

/* Sourcing tools (below hero) */
const SIDEKICK = [
  { eyebrow: "Free service", title: "Post your buy requirement", sub: "Get verified suppliers in 24 hours", cta: "Post Now", icon: "clipboard-list", tone: "bg-accent-light text-accent", href: "/contact#rfq" },
  { eyebrow: "Talk to an engineer", title: "Application support", sub: "Spec, source, ship — one call", cta: "WhatsApp", icon: "message-circle", tone: "bg-trust-light text-trust", href: `https://wa.me/${SITE.whatsapp}?text=Hi%20AMK%2C%20I%20need%20product%20support`, external: true },
  { eyebrow: "Just landed", title: "New launches this week", sub: "Drives, inverters, IoT gateways", cta: "Browse", icon: "trending-up", tone: "bg-brand-light text-brand", href: "/shop?sort=new" },
];

/* Built-in promo cards beside the carousel when the staff portal has none. */
const FALLBACK_CARDS: HeroBanner[] = [
  { id: -1, eyebrow: "Upgrade to", title: "Smart Automation", subtitle: "PLC, Drives, Sensors & more", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=70&auto=format&fit=crop", link: "/category/automation-and-control", cta_label: "Shop Now" },
  { id: -2, eyebrow: "Clean Energy", title: "Better Tomorrow", subtitle: "Solar solutions for homes & industries", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=70&auto=format&fit=crop", link: "/category/solar-solutions", cta_label: "Explore Now" },
];

function BannerSection({ s }: { s: HomeSection }) {
  return (
    <section className="container-site pt-8">
      <Link
        href={s.link || s.view_all_href || "#"}
        className="m-stack group relative block aspect-[3/2] overflow-hidden rounded-2xl bg-navy sm:aspect-[21/9] lg:aspect-[24/7]"
      >
        {s.banner_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img(s.banner_image, 1600)} alt={s.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060d1f]/90 via-[#0a1530]/55 to-transparent" />
        <div className="relative flex h-full max-w-xl flex-col justify-center gap-2 p-6 text-white md:p-12">
          {s.eyebrow && <span className="chip w-fit bg-white/15 text-white backdrop-blur">{s.eyebrow}</span>}
          {s.title && <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-4xl">{s.title}</h2>}
          {s.subtitle && <p className="text-[15px] text-white/80 md:text-base">{s.subtitle}</p>}
          <span className="btn btn-accent mt-3 w-fit">
            {s.cta_label || "Shop now"} <Icon name="arrow-right" className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </section>
  );
}

function GridSection({ s }: { s: HomeSection }) {
  const products = mapProducts(s.products);
  return (
    <section className="container-site pt-8">
      <div className="m-flat panel p-4 sm:p-5">
        <SectionHead eyebrow={s.eyebrow} title={s.title || ""} sub={s.subtitle} right={<MoreLink href={s.view_all_href || "/shop"}>View more</MoreLink>} />
        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyState title="Products coming soon" body="This collection is being stocked. Request a quote and we'll confirm availability." />
        )}
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [hero, sections, brandList] = await Promise.all([getHero(), getHomeSections(), getBrands()]);
  const cards = (hero.cards.length ? hero.cards : FALLBACK_CARDS).slice(0, 2);
  const brands = brandList.filter((b) => b.image).slice(0, 16);

  return (
    <>
      {/* ================= Hero band: categories + carousel + welcome / promo cards ================= */}
      <section className="pt-4">
        <div className="container-site">
          <div className="grid gap-4 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)_280px]">
            {/* Top categories */}
            <aside className="panel hidden overflow-hidden lg:block">
              <p className="flex items-center gap-2 border-b border-line px-4 py-3 text-[14px] font-bold text-ink">
                <Icon name="layout-grid" className="h-4 w-4 text-accent" /> Top Categories
              </p>
              <ul className="py-1">
                {TOP.map(([name, slug, icon]) => (
                  <li key={slug}>
                    <Link
                      href={`/category/${slug}`}
                      className="group flex items-center gap-3 px-4 py-[7px] text-[13.5px] text-ink transition hover:bg-accent-light hover:text-accent"
                    >
                      <Icon name={icon} className="h-4 w-4 shrink-0 text-ink-soft group-hover:text-accent" />
                      <span className="min-w-0 flex-1 truncate">{name}</span>
                      <Icon name="chevron-right" className="h-3.5 w-3.5 text-line-strong group-hover:text-accent" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/segments"
                className="flex items-center justify-center gap-1 border-t border-line py-2.5 text-[13px] font-semibold text-accent hover:bg-accent-light"
              >
                View All Categories <Icon name="chevron-right" className="h-4 w-4" />
              </Link>
            </aside>

            {/* Carousel */}
            <HeroCarousel staffSlides={hero.slides} />

            {/* Welcome + staff promo cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 xl:col-span-1 xl:grid-cols-1 xl:grid-rows-[auto_1fr]">
              <div className="panel p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy text-white">
                    <Icon name="building-2" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] text-ink-soft">Welcome to</p>
                    <p className="truncate text-[15px] font-bold text-ink">AMK Industrial Trading</p>
                  </div>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
                  One vendor for every industrial brand — tell us what you need and get a quote within 24 hours.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <PostRequirementButton className="btn btn-accent btn-sm">Post Need</PostRequirementButton>
                  <Link href="/contact#rfq" className="btn btn-outline btn-sm">
                    Get Quote
                  </Link>
                </div>
              </div>
              <div className="grid gap-4">
                {cards.map((c) => (
                  <Link
                    key={c.id}
                    href={c.link || "/shop"}
                    className="m-stack group relative flex min-h-[150px] overflow-hidden rounded-2xl bg-navy text-white"
                  >
                    {c.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img(c.image, 600)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060d1f]/90 via-[#060d1f]/45 to-transparent" />
                    <div className="relative mt-auto p-4">
                      {c.eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#ff5c6c]">{c.eyebrow}</p>}
                      <h3 className="text-[17px] font-bold leading-tight text-white">{c.title}</h3>
                      {c.subtitle && <p className="mt-0.5 line-clamp-2 text-[12.5px] text-white/80">{c.subtitle}</p>}
                      <span className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-semibold text-white group-hover:text-[#ff5c6c]">
                        {c.cta_label || "Shop Now"} <Icon name="arrow-right" className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sourcing tools */}
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {SIDEKICK.map((c) => {
              const inner = (
                <>
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${c.tone}`}>
                    <Icon name={c.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11.5px] font-semibold uppercase tracking-[0.06em] text-ink-soft">{c.eyebrow}</span>
                    <span className="block text-[15px] font-bold leading-snug text-ink group-hover:text-accent">{c.title}</span>
                    <span className="block text-[13px] text-ink-muted">{c.sub}</span>
                  </span>
                  <span className="hidden shrink-0 items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[12.5px] font-semibold text-ink group-hover:border-accent group-hover:text-accent sm:inline-flex md:hidden xl:inline-flex">
                    {c.cta} <Icon name="arrow-right" className="h-3.5 w-3.5" />
                  </span>
                </>
              );
              const cls = "panel group flex items-center gap-4 p-4 transition hover:border-transparent hover:shadow-lift";
              return c.external ? (
                <a key={c.title} href={c.href} target="_blank" rel="noopener noreferrer" className={cls}>
                  {inner}
                </a>
              ) : (
                <Link key={c.title} href={c.href} className={cls}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= Source by business segment ================= */}
      <section className="container-site pt-8">
        <div className="m-flat panel p-4 sm:p-5">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Six business segments</p>
              <h2 className="section-title mt-1">Source by industry</h2>
            </div>
            <MoreLink href="/segments">All segments</MoreLink>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
            {SEGMENTS.map((s) => (
              <Link
                key={s.slug}
                href={`/segment/${s.slug}`}
                className="m-stack m-stack-sm group relative flex aspect-[4/5] flex-col overflow-hidden rounded-xl bg-navy"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(s.image, 400)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060d1f]/95 via-[#060d1f]/40 to-transparent" />
                <div className="relative mt-auto p-3.5">
                  <span className="mb-2 grid h-8 w-8 place-items-center rounded-lg bg-white/15 text-white backdrop-blur group-hover:bg-accent group-hover:text-white">
                    <Icon name={s.icon} className="h-4 w-4" />
                  </span>
                  <h3 className="text-[15px] font-bold leading-tight text-white">{s.name}</h3>
                  <p className="mt-0.5 line-clamp-2 text-[12px] text-white/75">{s.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Staff-managed promo sections (GET /home/) ================= */}
      {sections.map((s) => (s.kind === "banner" ? <BannerSection key={s.id} s={s} /> : <GridSection key={s.id} s={s} />))}

      {/* ================= Top brands (GET /products/brands/) ================= */}
      {brands.length > 0 && (
        <section className="container-site pt-8">
          <div className="m-flat panel p-4 sm:p-5">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow">Authorised channel</p>
                <h2 className="section-title mt-1">Top brands we trade</h2>
              </div>
              <MoreLink href="/about#partners">Our brands</MoreLink>
            </div>
            <div id="home-brands" className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
              {brands.map((b) => (
                <Link
                  key={b.id}
                  href={`/shop?q=${encodeURIComponent(b.name)}`}
                  title={b.name}
                  className="group flex h-24 flex-col items-center justify-center gap-1.5 bg-white p-3 transition hover:bg-accent-light"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.image} alt={b.name} loading="lazy" className="max-h-10 max-w-[80%] object-contain grayscale transition group-hover:grayscale-0" />
                  <span className="text-[11.5px] font-medium text-ink-soft group-hover:text-ink">{b.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= Numbers band ================= */}
      <section className="container-site pt-8">
        <div className="m-light grid grid-cols-2 overflow-hidden rounded-2xl bg-navy text-white md:grid-cols-4">
          <div className="border-b border-r border-white/10 p-6 md:border-b-0">
            <p className="text-[30px] font-extrabold tracking-tight">15+</p>
            <p className="mt-1 text-[13px] text-white/70">Years in industrial trading</p>
          </div>
          <div className="border-b border-white/10 p-6 md:border-b-0 md:border-r">
            <p className="text-[30px] font-extrabold tracking-tight">25,000+</p>
            <p className="mt-1 text-[13px] text-white/70">SKUs across segments</p>
          </div>
          <div className="border-r border-white/10 p-6">
            <p className="text-[30px] font-extrabold tracking-tight">30+</p>
            <p className="mt-1 text-[13px] text-white/70">Authorised OEM brands</p>
          </div>
          <div className="p-6">
            <p className="text-[30px] font-extrabold tracking-tight text-[#ff5c6c]">&lt; 24 hrs</p>
            <p className="mt-1 text-[13px] text-white/70">Average quote turnaround</p>
          </div>
        </div>
      </section>

      {/* ================= Post your buy requirement ================= */}
      <section className="container-site pt-10">
        <div className="bg-hero relative overflow-hidden rounded-2xl">
          <div className="bg-dots pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative grid items-center gap-8 p-6 md:grid-cols-[1fr_1.1fr] md:p-10 lg:p-12">
            <div className="text-white">
              <span className="chip bg-accent text-white">
                <Icon name="sparkles" className="h-3.5 w-3.5" /> Free service
              </span>
              <h2 className="mt-4 text-[28px] font-extrabold leading-tight tracking-tight text-white md:text-[36px]">
                Can&apos;t find what you need?
                <br />
                <span className="text-[#ff5c6c]">We&apos;ll source it for you.</span>
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/75">
                Tell us the product, brand or model — even if it isn&apos;t in our catalogue. We&apos;ll come back with stock, lead times and
                indicative pricing within 24 hours.
              </p>
              <ul className="mt-6 grid gap-2.5 text-[14px] text-white/90 sm:grid-cols-1">
                {["No account needed — fill once, get a callback", "Verified application engineers respond", "Bulk & project pricing on tap"].map((t) => (
                  <li key={t} className="flex items-center gap-2.5">
                    <Icon name="circle-check" className="h-4 w-4 shrink-0 text-[#ff5c6c]" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <form id="quick-requirement" className="rounded-2xl bg-white p-5 shadow-pop md:p-7">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-accent-light text-accent">
                  <Icon name="clipboard-list" className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[16px] font-bold text-ink">Request for Quotation</p>
                  <p className="text-[13px] text-ink-soft">Describe in 1–2 lines, we&apos;ll handle the rest</p>
                </div>
              </div>
              <label htmlFor="quick-text" className="sr-only">
                Describe your requirement
              </label>
              <textarea id="quick-text" rows={4} className="input mt-5" placeholder="e.g. 10 × Schneider MCCB 250A 4P, delivery to Bengaluru next month." />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-soft">
                  <Icon name="clock" className="h-4 w-4" />
                  Replies within 24 hrs · Mon – Sat
                </span>
                <PostRequirementButton type="submit" descriptionFrom="#quick-text" className="btn btn-accent">
                  Post Requirement <Icon name="arrow-right" className="h-4 w-4" />
                </PostRequirementButton>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ================= Final CTA ================= */}
      <section className="container-site pt-10">
        <div className="panel flex flex-col items-center justify-between gap-6 px-6 py-10 text-center md:flex-row md:px-10 md:text-left">
          <div className="max-w-2xl">
            <p className="eyebrow">Start your project</p>
            <h2 className="mt-1.5 text-[26px] font-extrabold tracking-tight md:text-[30px]">Ready when your project is.</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
              Send us your spec, BOQ or shortlist. An AMK application engineer will respond with project-scoped pricing within 24 hours.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
            <Link href="/contact#rfq" className="btn btn-accent btn-lg">
              Request a Quote <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
            <a href={`tel:${SITE.phoneTel}`} className="btn btn-outline btn-lg">
              <Icon name="phone" className="h-4 w-4" /> {SITE.hotline}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
