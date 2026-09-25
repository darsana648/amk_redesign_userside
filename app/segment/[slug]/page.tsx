import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ShowMoreGrid } from "@/components/shop/ShowMoreGrid";
import { Breadcrumb, EmptyState, SectionHead } from "@/components/ui";
import { getCategoryChildren, getProducts, segmentBySlug } from "@/lib/api";
import { img } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seg = segmentBySlug((await params).slug);
  return { title: seg ? `${seg.short} · AMK` : "Segment · AMK", description: seg?.description };
}

export default async function SegmentPage({ params }: Props) {
  const seg = segmentBySlug((await params).slug);
  if (!seg) notFound();
  const [cats, products] = await Promise.all([getCategoryChildren(seg.root), getProducts({ segment: seg.id })]);

  return (
    <>
      <Breadcrumb items={[{ label: "Segments", href: "/segments" }, { label: seg.name }]} />
      <section className="container-site">
        <div className="m-stack relative overflow-hidden rounded-2xl bg-navy">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(seg.image, 1600)} alt={seg.name} className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060d1f]/95 via-[#0a1530]/70 to-transparent" />
          <div className="relative px-6 py-12 text-white md:px-12 md:py-16">
            <span className="chip bg-accent text-white">
              <Icon name={seg.icon} className="h-3.5 w-3.5" /> AMK Segment
            </span>
            <h1 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-white md:text-5xl">{seg.short}</h1>
            <p className="mt-3 max-w-xl text-[15px] text-white/80 md:text-base">{seg.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact#rfq" className="btn btn-accent btn-lg">
                Request Quote
              </Link>
              <a href="#products" className="btn btn-ghost-light btn-lg">
                Browse Products
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container-site pt-5">
        <div className="panel p-5">
          <SectionHead title={`Categories in ${seg.name}`} />
          <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
            {cats.length ? (
              cats.map((c) => (
                <Link key={c.slug} href={`/category/${c.slug}`} className="group flex flex-col items-center text-center">
                  <span className="block aspect-square w-full overflow-hidden rounded-xl border border-line bg-canvas transition group-hover:border-accent">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img(c.image, 240)} alt={c.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </span>
                  <span className="mt-2 line-clamp-2 text-[13.5px] font-semibold leading-tight text-ink group-hover:text-accent">{c.name}</span>
                </Link>
              ))
            ) : (
              <p className="col-span-full text-sm text-ink-soft">Categories are being set up.</p>
            )}
          </div>
        </div>
      </section>

      <section id="products" className="container-site scroll-mt-16 pt-5">
        <div className="panel p-5">
          <SectionHead title="Products" right={<span className="text-[13px] text-ink-soft">{products.length} products</span>} />
          {products.length ? (
            <ShowMoreGrid products={products} />
          ) : (
            <EmptyState title="Catalog being populated" body="Request a quote and we'll confirm availability." />
          )}
        </div>
      </section>

      <section className="container-site pt-5">
        <div className="bg-hero relative flex flex-col gap-5 overflow-hidden rounded-2xl p-8 text-white md:flex-row md:items-center md:justify-between md:p-10">
          <div className="bg-dots pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative">
            <h3 className="text-2xl font-bold text-white">Need a project quote for {seg.name}?</h3>
            <p className="mt-1 text-[15px] text-white/75">Our application engineers respond within 24 hours.</p>
          </div>
          <Link href="/contact#rfq" className="btn btn-accent btn-lg relative">
            Talk to AMK <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
