import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopClient } from "@/components/shop/ShopClient";
import { Breadcrumb } from "@/components/ui";
import { getBrands, getCategories, getProducts } from "@/lib/api";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string; sort?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q} · ${SITE.fullName}` : `Catalogue · ${SITE.fullName}`,
    description: "Browse the AMK catalogue — switchgear, automation, cabling, solar, MRO and smart-factory products from 30+ authorised brands.",
  };
}

export default async function ShopPage({ searchParams }: Props) {
  const { q = "", sort = "default" } = await searchParams;
  const [products, categories, brands] = await Promise.all([getProducts({ q, sort }), getCategories(), getBrands()]);

  return (
    <>
      <Breadcrumb items={q ? [{ label: "Catalog", href: "/shop" }, { label: `“${q}”` }] : [{ label: "Catalog" }]} />
      <Suspense>
        <ShopClient key={`${q}|${sort}`} products={products} categories={categories} brands={brands} q={q} sort={sort} />
      </Suspense>
    </>
  );
}
