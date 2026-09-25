import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/Icon";
import { EnquireButton, WhatsAppButton } from "@/components/enquiry/buttons";
import { ProductGallery } from "@/components/product/ProductGallery";
import { BrandSlider } from "@/components/ui/BrandSlider";
import { Breadcrumb, MoreLink, ProductGrid, Rating, SectionHead } from "@/components/ui";
import { getProduct, getProducts } from "@/lib/api";
import { SITE } from "@/lib/site";
import { toEnquiryProduct } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  return {
    title: p ? `${p.name} · ${SITE.fullName}` : `Product · ${SITE.fullName}`,
    description: p?.shortDescription || p?.name,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [p, related] = await Promise.all([getProduct(slug), getProducts({ limit: 5 })]);
  if (!p) notFound();

  const sku = p.id.toUpperCase();
  const prettyCategory = p.category.replace(/-/g, " ");
  const gallery = p.gallery?.length ? p.gallery : [p.image, p.image, p.image, p.image];
  const brands = p.brands;
  const features = p.features;
  const ep = toEnquiryProduct(p);

  const attrRows: [string, ReactNode][] = [
    [
      "Category",
      <Link key="c" href={`/category/${p.category}`} className="capitalize text-brand hover:underline">
        {prettyCategory}
      </Link>,
    ],
    ["SKU", <span key="s" className="font-mono">{sku}</span>],
    ["Availability", <span key="a" className="font-semibold text-trust">In stock</span>],
    ...features.slice(0, 5).map((f) => [f.key, f.value] as [string, ReactNode]),
  ];

  return (
    <>
      <Breadcrumb items={[{ label: "Shop", href: "/shop" }, { label: p.name }]} />
      <div className="container-site">
        <div className="grid items-start gap-5 xl:grid-cols-[1fr_330px]">
          {/* Main listing */}
          <div className="panel grid gap-8 p-5 md:grid-cols-2 md:p-6">
            <ProductGallery
              name={p.name}
              image={p.image}
              gallery={gallery}
              badges={
                <>
                  {p.isHot && <span className="badge badge-hot">HOT</span>}
                  {p.isNew && <span className="badge badge-new">NEW</span>}
                </>
              }
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                {brands.length
                  ? brands.map((b) => (
                      <span key={b.id} className="chip bg-canvas text-ink">
                        {b.name}
                      </span>
                    ))
                  : p.brand && <span className="chip bg-canvas text-ink">{p.brand}</span>}
              </div>
              <h1 className="mt-3 text-[24px] font-bold leading-tight tracking-tight md:text-[28px]">{p.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[13px]">
                <Rating value={p.rating.value} size="md" />
                <span className="text-ink-soft">{p.rating.count} reviews</span>
                <span className="h-3.5 w-px bg-line" />
                <span className="inline-flex items-center gap-1 font-medium text-trust">
                  <Icon name="badge-check" className="h-4 w-4" /> In stock · Authorised
                </span>
              </div>

              <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
                {p.shortDescription ||
                  "Authorised, warranty-backed stock for industrial procurement. Add specs and quantity in the enquiry form — an AMK application engineer responds within 24 hours with stock visibility, lead times and indicative landed pricing."}
              </p>

              <div className="mt-5 overflow-hidden rounded-xl border border-line">
                <p className="border-b border-line bg-paper px-4 py-2.5 text-[13px] font-bold">Key attributes</p>
                <dl className="divide-y divide-line text-[13.5px]">
                  {attrRows.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[130px_1fr] gap-3 px-4 py-2.5">
                      <dt className="text-ink-soft">{k}</dt>
                      <dd className="min-w-0 text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {brands.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 text-[13px] font-semibold">
                    {brands.length === 1 ? "Main brand" : "Main brands"} <span className="font-normal text-ink-soft">· Others on request</span>
                  </p>
                  <BrandSlider brands={brands} variant="compact" />
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-3 xl:hidden">
                <EnquireButton product={ep} className="btn btn-accent btn-lg">
                  <Icon name="message-square" className="h-4 w-4" /> Enquire Now
                </EnquireButton>
                <WhatsAppButton product={ep} className="btn btn-whatsapp btn-lg">
                  <Icon name="message-circle" className="h-4 w-4" /> WhatsApp
                </WhatsAppButton>
                <a href={`tel:${SITE.phoneTel}`} className="btn btn-outline btn-lg">
                  <Icon name="phone" className="h-4 w-4" /> Call Now
                </a>
              </div>
            </div>
          </div>

          {/* Supplier / contact card */}
          <aside className="space-y-4 xl:sticky xl:top-16">
            <div className="panel overflow-hidden">
              <div className="border-b border-line p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-line bg-white p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/img/logo.png" alt="" className="w-full" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-bold">{SITE.fullName}</p>
                    <p className="flex items-center gap-1 text-[12.5px] text-trust">
                      <Icon name="badge-check" className="h-3.5 w-3.5" /> Authorised OEM channel · India
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {[
                    ["15+", "Years"],
                    ["30+", "OEM brands"],
                    ["<24h", "Quote time"],
                  ].map(([v, l]) => (
                    <div key={l} className="rounded-lg bg-canvas px-1 py-2">
                      <p className="text-[15px] font-bold">{v}</p>
                      <p className="text-[11px] text-ink-soft">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2.5 p-5">
                <EnquireButton product={ep} className="btn btn-accent btn-lg hidden w-full xl:inline-flex">
                  <Icon name="message-square" className="h-4 w-4" /> Enquire Now
                </EnquireButton>
                <WhatsAppButton product={ep} ariaLabel="Enquire on WhatsApp" className="btn btn-whatsapp hidden w-full xl:inline-flex">
                  <Icon name="message-circle" className="h-4 w-4" /> WhatsApp
                </WhatsAppButton>
                <a href={`tel:${SITE.phoneTel}`} aria-label="Call to enquire" className="btn btn-outline hidden w-full xl:inline-flex">
                  <Icon name="phone" className="h-4 w-4" /> Call Now
                </a>
                <div className="text-[12.5px] leading-relaxed text-ink-soft xl:pt-2">
                  <p>
                    WhatsApp / Phone: <b className="text-ink">{SITE.hotline}</b>
                  </p>
                  <p>Mon – Sat · 9 AM – 7 PM IST</p>
                  <p className="mt-2">No cart. No price tag. Send specs &amp; quantity — we quote within 24 hours.</p>
                </div>
              </div>
            </div>

            <div className="panel divide-y divide-line">
              {[
                ["badge-check", "Authorised OEM", "Direct from manufacturer channel"],
                ["truck", "Pan-India dispatch", "Same/next business day on stock"],
                ["hard-hat", "Engineer support", "Commissioning available on request"],
              ].map(([ic, t, s]) => (
                <div key={t} className="flex items-start gap-3 px-5 py-3.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-light text-accent">
                    <Icon name={ic} className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[13.5px] font-semibold">{t}</p>
                    <p className="text-[12.5px] text-ink-soft">{s}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* Details */}
        <div className="panel mt-5">
          <div className="flex gap-6 border-b border-line px-5 text-[14px] font-semibold">
            <span className="border-b-2 border-accent py-3.5 text-ink">Product details</span>
            {features.length > 0 && (
              <a href="#specs" className="py-3.5 text-ink-soft hover:text-accent">
                Specifications
              </a>
            )}
            {brands.length > 0 && (
              <a href="#brands" className="py-3.5 text-ink-soft hover:text-accent">
                Brands
              </a>
            )}
          </div>
          <div className="space-y-8 p-5 md:p-6">
            <section>
              <h2 className="text-[17px] font-bold">Description</h2>
              <p className="mt-2 max-w-4xl text-[15px] leading-relaxed text-ink-muted">
                {p.description ||
                  `${p.name} is part of our authorised trading catalogue, supplied directly through the manufacturer channel. Used across industrial, commercial and energy applications. Lead times, accessory bundles and project-rate pricing confirmed on enquiry.`}
              </p>
            </section>
            {features.length > 0 && (
              <section id="specs" className="scroll-mt-20">
                <h2 className="text-[17px] font-bold">Specifications</h2>
                <table className="mt-3 w-full max-w-4xl overflow-hidden rounded-xl border border-line text-[14px]">
                  <tbody className="divide-y divide-line">
                    {features.map((f) => (
                      <tr key={f.id}>
                        <th scope="row" className="w-1/3 bg-paper px-4 py-2.5 text-left font-medium text-ink-muted">
                          {f.key}
                        </th>
                        <td className="px-4 py-2.5">{f.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
            {brands.length > 0 && (
              <section id="brands" className="scroll-mt-20">
                <h2 className="text-[17px] font-bold">Brands available for this product</h2>
                <p className="mt-1 max-w-2xl text-[14px] text-ink-muted">
                  Looking for a brand not listed? We trade many more — just mention it in your enquiry and we&apos;ll source it for you.
                </p>
                <div className="mt-4">
                  <BrandSlider brands={brands} variant="gallery" />
                </div>
              </section>
            )}
          </div>
        </div>

        <section className="panel mt-5 p-5">
          <SectionHead title="Similar products" right={<MoreLink href="/shop">View more</MoreLink>} />
          <ProductGrid products={related.slice(0, 5)} />
        </section>
      </div>
    </>
  );
}
