import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Breadcrumb, MoreLink } from "@/components/ui";
import { SEGMENTS, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About AMK Industrial Trading · Industrial Trading & Smart Solutions",
  description: "AMK is a B2B industrial trading and smart-solutions company. Direct OEM partnerships, six business segments, single-vendor coverage.",
};

const VALUES = [
  ["compass", "bg-accent-light text-accent", "Engineering-led", "We analyse your spec before quoting. Application engineers recommend the right product, not just the cheapest."],
  ["shield-check", "bg-trust-light text-trust", "Authorised trading", "Direct OEM partnerships ensure genuine, warranty-backed hardware delivered with full traceability."],
  ["building-2", "bg-brand-light text-brand", "Single-vendor coverage", "Six business segments under one roof — fewer suppliers, simpler logistics, faster project delivery."],
  ["truck", "bg-navy-50 text-navy", "Pan-India logistics", "Owned warehousing in three regions and a vetted carrier network for same-week dispatch nationwide."],
];
const TIMELINE = [
  ["2010", "Founded as an industrial trading desk", "Launched in Bengaluru focused on automation panel components for marine & FMCG."],
  ["2014", "Authorised OEM agreements", "Direct partnerships with Schneider, ABB, and Siemens distribution channels."],
  ["2018", "Expanded into solar & energy", "Added solar PV, battery storage and EV charging supply to serve sustainability customers."],
  ["2021", "Smart-factory practice launched", "Industrial PCs, edge gateways and IIoT platforms — turn-key digital infrastructure."],
  ["2024", "ISO 9001:2015 certified", "Quality management certification across procurement, warehousing and dispatch."],
];
const BRANDS = ["Inovance", "Schneider", "ABB", "Siemens", "Honeywell", "Philips", "Bosch", "Sungrow", "Huawei", "BYD", "Moxa", "Fortinet", "L&T", "Havells", "Crompton"];
const ROLES = [
  ["users", "Sales engineers"],
  ["wrench", "Automation specialists"],
  ["globe", "Solar project leads"],
  ["award", "IIoT consultants"],
];

export default function AboutPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "About" }]} />

      {/* Hero */}
      <section className="container-site">
        <div className="bg-hero relative overflow-hidden rounded-2xl text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=60&auto=format&fit=crop"
            alt=""
            className="absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover opacity-35 lg:block [mask-image:linear-gradient(90deg,transparent,black_40%)]"
          />
          <div className="bg-dots pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative px-6 py-12 md:px-12 md:py-16">
            <span className="chip bg-accent text-white">
              <Icon name="building-2" className="h-3.5 w-3.5" /> About AMK
            </span>
            <h1 className="mt-5 max-w-3xl text-[32px] font-extrabold leading-[1.1] tracking-tight text-white md:text-[46px]">
              Procurement infrastructure for <span className="text-[#ff5c6c]">serious operators.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/80">
              AMK Industrial Trading is a B2B industrial trading and smart-solutions company. We source, stock and supply hardware across six business
              segments — selling directly to clients, not through resellers. From a single drive on a shop floor to a multi-MW solar plant or a
              smart-factory rollout, we are your single point of contact across the full industrial lifecycle.
            </p>
          </div>
        </div>
        {/* Stats */}
        <ul className="relative z-10 mx-4 -mt-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-white shadow-lift md:mx-10 md:grid-cols-4">
          <li className="border-b border-r border-line p-5 text-center md:border-b-0">
            <p className="text-[30px] font-extrabold tracking-tight text-accent">15+</p>
            <p className="text-[13px] text-ink-muted">Years in industrial trading</p>
          </li>
          <li className="border-b border-line p-5 text-center md:border-b-0 md:border-r">
            <p className="text-[30px] font-extrabold tracking-tight text-accent">30+</p>
            <p className="text-[13px] text-ink-muted">Authorised OEM brands</p>
          </li>
          <li className="border-r border-line p-5 text-center">
            <p className="text-[30px] font-extrabold tracking-tight text-accent">6</p>
            <p className="text-[13px] text-ink-muted">Business segments</p>
          </li>
          <li className="p-5 text-center">
            <p className="text-[30px] font-extrabold tracking-tight text-accent">800+</p>
            <p className="text-[13px] text-ink-muted">Projects delivered</p>
          </li>
        </ul>
      </section>

      {/* Values */}
      <section className="container-site pt-10">
        <div className="mb-6 max-w-2xl">
          <p className="eyebrow">How we operate</p>
          <h2 className="section-title mt-1">Built for procurement teams that can&apos;t afford to be let down.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(([icon, tone, t, body]) => (
            <div key={t} className="panel p-6">
              <span className={`grid h-12 w-12 place-items-center rounded-xl ${tone}`}>
                <Icon name={icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-[16px] font-bold">{t}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="container-site pt-10">
        <div className="panel grid gap-10 p-6 md:p-10 lg:grid-cols-[1fr_1.5fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="eyebrow">Our story</p>
            <h2 className="section-title mt-1">Fifteen years on the trade floor.</h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-muted">
              We grew with the people we supply — from one warehouse and a whiteboard of part numbers to a national operation servicing marine, FMCG,
              solar farms and smart-factory rollouts.
            </p>
          </div>
          <ol className="relative space-y-5 border-l-2 border-accent-soft pl-7">
            {TIMELINE.map(([y, t, b]) => (
              <li key={y} className="relative">
                <span className="absolute -left-[37px] top-1 grid h-4 w-4 place-items-center rounded-full bg-accent ring-4 ring-white" />
                <p className="text-[13px] font-bold text-accent">{y}</p>
                <h3 className="mt-0.5 text-[16px] font-bold">{t}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-muted">{b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Segments */}
      <section className="container-site pt-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="eyebrow">What we trade</p>
            <h2 className="section-title mt-1">Six business segments.</h2>
            <p className="mt-1.5 text-[14.5px] text-ink-muted">
              Complete coverage across the industrial supply spectrum — from heavy automation to consumer electrical.
            </p>
          </div>
          <MoreLink href="/segments">View all segments</MoreLink>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SEGMENTS.map((s) => (
            <Link key={s.slug} href={`/segment/${s.slug}`} className="card card-hover group flex items-start gap-4 p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy text-white group-hover:bg-accent group-hover:text-white">
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[15.5px] font-bold group-hover:text-accent">{s.short}</span>
                <span className="mt-1 block text-[13.5px] leading-relaxed text-ink-muted">{s.tagline}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="container-site scroll-mt-16 pt-10">
        <div className="panel p-6 md:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Authorised partners</p>
            <h2 className="section-title mt-1">30+ OEMs trust us as their channel.</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
              We are authorised partners and trade-channel customers of leading global manufacturers across automation, power, lighting and clean
              energy.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {BRANDS.map((b) => (
              <div
                key={b}
                className="flex h-20 items-center justify-center rounded-xl border border-line bg-paper text-[17px] font-bold tracking-tight text-ink-soft transition hover:border-accent hover:bg-white hover:text-ink"
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers */}
      <section id="careers" className="container-site scroll-mt-16 pt-10">
        <div className="bg-hero relative grid items-center gap-8 overflow-hidden rounded-2xl p-6 text-white md:p-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="bg-dots pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative">
            <span className="chip bg-accent text-white">
              <Icon name="briefcase" className="h-3.5 w-3.5" /> Careers
            </span>
            <h2 className="mt-4 text-[26px] font-extrabold tracking-tight text-white md:text-[32px]">We&apos;re hiring engineers who care about the work.</h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">
              Sales engineers, automation specialists, solar project managers and IIoT consultants. Reach out — we read every email.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href={`mailto:${SITE.email}`} className="btn btn-accent btn-lg">
                <Icon name="mail" className="h-4 w-4" /> {SITE.email}
              </a>
              <Link href="/contact" className="btn btn-ghost-light btn-lg">
                Talk to our team <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <ul className="relative grid grid-cols-2 gap-3">
            {ROLES.map(([icon, label]) => (
              <li key={label} className="flex items-center gap-3 rounded-xl bg-white/10 p-4 text-[14px] font-semibold backdrop-blur">
                <Icon name={icon} className="h-5 w-5 text-[#ff5c6c]" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
