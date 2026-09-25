import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Breadcrumb, EmptyState, PageHeader, ProductGrid, SectionHead, StatChip } from "@/components/ui";
import { getCollection, mapProducts } from "@/lib/api";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const d = await getCollection(slug);
  return {
    title: d ? `${d.block.title || "Collection"} · ${SITE.fullName}` : `Collection · ${SITE.fullName}`,
    description: d?.block.subtitle || d?.block.title,
  };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const d = await getCollection(slug, page);
  if (!d) notFound();

  const b = d.block;
  const products = mapProducts(d.results);
  const pages = Math.max(1, Math.ceil(d.count / d.page_size));
  const pageHref = (n: number) => `/collection/${encodeURIComponent(slug)}?page=${n}`;

  return (
    <>
      <Breadcrumb items={[{ label: b.title || "Collection" }]} />
      <PageHeader
        eyebrow={b.eyebrow || "Collection"}
        title={b.title}
        sub={b.subtitle}
        image={b.banner_image}
        meta={
          <div className="mt-5">
            <StatChip icon="package">{d.count} products</StatChip>
          </div>
        }
      />
      <section className="container-site pt-5">
        <div className="panel p-5">
          <SectionHead title="All products" right={<span className="text-[13px] text-ink-soft">Page {page} of {pages}</span>} />
          {products.length ? <ProductGrid products={products} /> : <EmptyState title="No products yet" body="No products in this collection yet." />}
        </div>
        {pages > 1 && (
          <nav className="panel mt-5 flex items-center justify-center gap-3 px-5 py-4">
            {page > 1 && (
              <Link href={pageHref(page - 1)} className="btn btn-outline btn-sm">
                <Icon name="chevron-left" className="h-4 w-4" /> Previous
              </Link>
            )}
            <span className="text-sm text-ink-soft">
              Page <b className="text-ink">{page}</b> of <b className="text-ink">{pages}</b>
            </span>
            {page < pages && (
              <Link href={pageHref(page + 1)} className="btn btn-accent btn-sm">
                Next <Icon name="chevron-right" className="h-4 w-4" />
              </Link>
            )}
          </nav>
        )}
      </section>
    </>
  );
}
