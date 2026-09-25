import Link from "next/link";
import { Icon } from "@/components/Icon";
import { SEGMENTS, SITE } from "@/lib/site";

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
const SOCIALS = [
  { label: "LinkedIn", icon: "linkedin", href: "#" },
  { label: "YouTube", icon: "youtube", href: "#" },
  { label: "WhatsApp", icon: "message-circle", href: `https://wa.me/${SITE.whatsapp}` },
  { label: "Email", icon: "mail", href: `mailto:${SITE.email}` },
];

function Col({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-[14px] font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-[13.5px] text-slate-400">
        {links.map((l) => (
          <li key={`${l.label}-${l.href}`}>
            <Link href={l.href} className="transition hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Trust band + footer. */
export function SiteFooter() {
  return (
    <>
      <section className="mt-12 border-t border-line bg-white">
        <div className="container-site grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t.title} className="flex items-center gap-3.5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent-light text-accent">
                <Icon name={t.icon} className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[14px] font-semibold text-ink">{t.title}</span>
                <span className="block text-[12.5px] text-ink-soft">{t.sub}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <footer className="m-light bg-[#070f24] text-slate-400">
        <div className="container-site grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="inline-block rounded-lg bg-white px-3 py-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/logo.png" alt={SITE.fullName} className="h-10 w-auto" loading="lazy" />
            </Link>
            <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed">{SITE.tagline}.</p>
            <div className="mt-5 flex gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-slate-300 transition hover:bg-accent hover:text-white"
                >
                  <Icon name={s.icon} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <Col title="Business Segments" links={SEGMENTS.map((s) => ({ label: s.name, href: `/segment/${s.slug}` }))} />
          <Col title="Company" links={COMPANY_LINKS} />
          <Col title="Customer Support" links={SUPPORT_LINKS} />
          <div>
            <h3 className="text-[14px] font-semibold text-white">Get in touch</h3>
            <ul className="mt-4 space-y-3 text-[13.5px]">
              <li>
                <a href={`tel:${SITE.phoneTel}`} className="flex items-start gap-2.5 hover:text-white">
                  <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>
                    <span className="block text-white">{SITE.hotline}</span>
                    {SITE.hotlineLabel}
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-start gap-2.5 hover:text-white">
                  <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>
                    <span className="block text-white">{SITE.email}</span>
                    {SITE.emailInfo}
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="map-pin" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <address className="not-italic leading-relaxed">{SITE.address}</address>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container-site flex flex-col items-center justify-between gap-3 py-5 text-[12.5px] md:flex-row">
            <span>
              © {new Date().getFullYear()} {SITE.fullName}. All rights reserved.
            </span>
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {LEGAL_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}
