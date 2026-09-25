import Link from "next/link";
import { Suspense } from "react";
import { Icon } from "@/components/Icon";
import { PostRequirementButton } from "@/components/enquiry/buttons";
import { getCategoryTree } from "@/lib/api";
import { SITE } from "@/lib/site";
import { CategoryNav } from "./CategoryNav";
import { SearchForm } from "./SearchForm";

const TOP_LEFT = [
  { label: "About AMK", href: "/about" },
  { label: "Our Brands", href: "/about#partners" },
  { label: "Careers", href: "/about#careers" },
];
const TOP_RIGHT = [
  { label: "FAQs", href: "/faqs" },
  { label: "Contact", href: "/contact" },
];

/** Utility bar, header (logo / search / actions) and category navigation. */
export async function SiteHeader() {
  const tree = await getCategoryTree();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[300] focus:rounded focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      {/* Utility bar */}
      <div className="hidden border-b border-line bg-white text-[12.5px] text-ink-muted md:block">
        <div className="container-site flex h-9 items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5 text-ink">
              <Icon name="globe" className="h-3.5 w-3.5 text-accent" /> Welcome to {SITE.fullName}
            </span>
            <span className="h-3.5 w-px bg-line" />
            {TOP_LEFT.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-accent">
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-5">
            <a href={`mailto:${SITE.email}`} className="hidden items-center gap-1.5 hover:text-accent lg:inline-flex">
              <Icon name="mail" className="h-3.5 w-3.5" />
              {SITE.email}
            </a>
            {TOP_RIGHT.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-accent">
                {l.label}
              </Link>
            ))}
            <Link href="/contact#rfq" className="font-semibold text-accent hover:text-accent-dark">
              Request Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white">
        <div className="container-site flex h-[76px] items-center gap-4 lg:gap-8">
          <Link href="/" className="shrink-0" aria-label={SITE.fullName}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo.png" alt={SITE.fullName} width={515} height={264} className="h-10 w-auto md:h-12" />
          </Link>

          <Suspense fallback={<div className="relative hidden flex-1 md:block" />}>
            <SearchForm variant="desktop" />
          </Suspense>

          <div className="ml-auto flex items-center gap-1 md:ml-0 lg:gap-2">
            <a
              href={`tel:${SITE.phoneTel}`}
              className="hidden items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-canvas xl:flex"
              aria-label={`Sales hotline ${SITE.hotline}`}
            >
              <Icon name="phone-call" className="h-6 w-6 text-ink" />
              <span className="leading-tight">
                <span className="block text-[11.5px] text-ink-soft">{SITE.hotlineLabel}</span>
                <span className="block text-[13.5px] font-semibold text-ink">{SITE.hotline}</span>
              </span>
            </a>
            <PostRequirementButton className="hidden items-center gap-2.5 rounded-lg px-2 py-1.5 text-left hover:bg-canvas lg:flex">
              <Icon name="clipboard-list" className="h-6 w-6 text-ink" />
              <span className="leading-tight">
                <span className="block text-[11.5px] text-ink-soft">Can&apos;t find it?</span>
                <span className="block text-[13.5px] font-semibold text-ink">Post Requirement</span>
              </span>
            </PostRequirementButton>
            <Link href="/contact#rfq" className="btn btn-accent ml-1 hidden lg:inline-flex">
              <Icon name="file-text" className="h-4 w-4" /> Request Quote
            </Link>
            <a
              href={`tel:${SITE.phoneTel}`}
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink md:hidden"
              aria-label="Call sales"
            >
              <Icon name="phone" className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="container-site pb-3 md:hidden">
          <Suspense fallback={<div className="h-11" />}>
            <SearchForm variant="mobile" />
          </Suspense>
        </div>
      </header>

      <CategoryNav tree={tree} />
    </>
  );
}
