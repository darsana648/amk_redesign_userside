import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PostRequirementButton } from "@/components/enquiry/buttons";
import { BrandSlider } from "@/components/ui/BrandSlider";
import { Breadcrumb, EmptyState, MoreLink, PageHeader, ProductGrid, SectionHead, StatChip } from "@/components/ui";
import { getCategoryPage, mapProducts } from "@/lib/api";
import type { CategoryNode } from "@/lib/types";
import { img, leafCount, titleCase } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${titleCase(slug)} - AMK` };
}

function ChildCard({ n }: { n: CategoryNode }) {
  const kids = n.children || [];
  const href = `/category/${n.slug}`;
  return (
    <div className="card card-hover group flex flex-col overflow-hidden">
      <Link href={href} className="block">
        <div className="aspect-[4/3] overflow-hidden bg-canvas">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(n.image, 400)} alt={n.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-3.5">
        <Link href={href} className="line-clamp-2 text-[14.5px] font-semibold leading-snug text-ink hover:text-accent">
          {n.name}
        </Link>
        <p className="mt-0.5 text-[12.5px] text-ink-soft">{kids.length ? `${leafCount(kids)} items` : "Product group"}</p>
        {kids.length > 0 && (
          <ul className="mt-2 space-y-1 text-[12.5px] text-ink-muted">
            {kids.slice(0, 3).map((k) => (
              <li key={k.slug}>
                <Link href={`/category/${k.slug}`} className="block truncate hover:text-accent">
                  • {k.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link href={href} className="link-more mt-auto pt-3 !text-[12.5px] !text-accent">
          {kids.length ? "Browse all" : "View products"} <Icon name="chevron-right" className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const d = await getCategoryPage(slug);
  if (!d) notFound();

  const cat = d.category;
  const children = d.children || [];
  const brands = d.brands || [];
  const products = mapProducts(d.products);
  const featured = mapProducts(d.segment_products);
  const trail = (d.path || []).slice(0, -1).map((n) => ({ label: n.name, href: `/category/${n.slug}` }));
  const parent = (d.path || []).length > 1 ? d.path[d.path.length - 2] : null;

  return (
    <>
      <Breadcrumb items={[...trail, { label: cat.name }]} />
      <PageHeader
        eyebrow={parent ? parent.name : "Product category"}
        title={cat.name}
        image={cat.image}
        meta={
          <div className="mt-5 flex flex-wrap gap-2">
            <StatChip icon={d.is_leaf ? "package" : "layout-grid"}>
              {d.is_leaf ? `${products.length} product${products.length === 1 ? "" : "s"} listed` : `${children.length} sub-categories`}
            </StatChip>
            {brands.length > 0 && <StatChip icon="award">{brands.length} brands</StatChip>}
            <StatChip icon="shield-check">Genuine OEM stock</StatChip>
            <StatChip icon="clock">Quotes within 24 hours</StatChip>
          </div>
        }
      />

      {brands.length > 0 && (
        <section className="container-site pt-5">
          <div className="panel p-5">
            <SectionHead
              title={`Brands available in ${cat.name}`}
              sub="Looking for a brand not listed? We trade many more — just mention it in your enquiry and we'll source it for you."
            />
            <BrandSlider brands={brands} variant="gallery" />
          </div>
        </section>
      )}

      {!d.is_leaf ? (
        <>
          <section className="container-site pt-5">
            <div className="panel p-5">
              <SectionHead title={`Categories under ${cat.name}`} right={<span className="text-[13px] text-ink-soft">{children.length} listed</span>} />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                {children.map((n) => (
                  <ChildCard key={n.slug} n={n} />
                ))}
              </div>
            </div>
          </section>
          {featured.length > 0 && (
            <section className="container-site pt-5">
              <div className="panel p-5">
                <SectionHead
                  eyebrow={`Popular in ${cat.name}`}
                  title="Featured products"
                  sub={`Top trading SKUs across ${cat.name.toLowerCase()}.`}
                  right={<MoreLink href="/shop">View Full Catalog</MoreLink>}
                />
                <ProductGrid products={featured.slice(0, 10)} />
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="container-site pt-5">
          {products.length ? (
            <div className="panel p-5">
              <SectionHead title="Available stock" right={<span className="text-[13px] text-ink-soft">{products.length} listed</span>} />
              <ProductGrid products={products} />
            </div>
          ) : (
            <EmptyState
              title="Catalog being populated"
              body="Stock for this product group is currently being uploaded. Request a quote and we'll get back with availability."
              cta={
                <Link href="/contact#rfq" className="btn btn-accent mt-6">
                  Request a quote <Icon name="arrow-right" className="h-4 w-4" />
                </Link>
              }
            />
          )}
        </section>
      )}

      <section className="container-site pt-5">
        <div className="panel flex flex-col gap-5 !border-accent-soft bg-accent-light p-6 md:flex-row md:items-center md:justify-between md:p-7">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent text-white">
              <Icon name="sparkles" className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-[18px] font-bold">Can&apos;t find what you&apos;re looking for in {cat.name}?</h3>
              <p className="mt-1 max-w-xl text-[14px] text-ink-muted">
                We trade thousands of items beyond our catalogue. Tell us the product, brand or model — we&apos;ll source it and quote within 24 hours.
              </p>
            </div>
          </div>
          <PostRequirementButton category={cat.name} className="btn btn-accent btn-lg shrink-0">
            <Icon name="clipboard-list" className="h-4 w-4" /> Post requirement
          </PostRequirementButton>
        </div>
      </section>
    </>
  );
}
