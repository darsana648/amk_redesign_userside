import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Breadcrumb, PageHeader } from "@/components/ui";
import { SEGMENTS } from "@/lib/site";
import { img } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Business Segments · AMK",
  description: "AMK is structured around six business segments — from heavy industrial automation to retail electrical and smart-factory IT.",
};

export default function SegmentsPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Segments" }]} />
      <PageHeader
        eyebrow="What we trade"
        title="Our Six Business Segments"
        sub="AMK is structured around six segments — covering everything from heavy industrial automation to retail electrical and smart-factory IT."
        image="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1400&q=60"
      />
      <section className="container-site pt-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {SEGMENTS.map((s) => (
            <Link key={s.slug} href={`/segment/${s.slug}`} className="card card-hover group flex flex-col overflow-hidden">
              <div className="relative aspect-[16/9] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(s.image, 700)} alt={s.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060d1f]/80 to-transparent" />
                <span className="absolute bottom-3 left-4 inline-flex items-center gap-2 text-[17px] font-bold text-white">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-white">
                    <Icon name={s.icon} className="h-4 w-4" />
                  </span>
                  {s.name}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-accent">{s.tagline}</p>
                <h2 className="mt-1 text-[17px] font-bold">{s.short}</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">{s.description}</p>
                <span className="link-more mt-auto pt-4 !text-accent">
                  Explore segment <Icon name="chevron-right" className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
