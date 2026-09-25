import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { Breadcrumb } from "@/components/ui";
import { SEGMENTS, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact AMK Industrial Trading · Request a Quote",
  description: "Project enquiries, technical questions, or strategic partnerships — our application engineers respond within 24 hours.",
};

const INFO: { icon: string; tone: string; label: string; value: string; sub: string; href?: string; external?: boolean }[] = [
  { icon: "map-pin", tone: "bg-accent-light text-accent", label: "Head office", value: "AMK Industrial Trading", sub: SITE.address },
  { icon: "phone", tone: "bg-accent-light text-accent", label: "Sales hotline", value: SITE.hotline, sub: SITE.hotlineLabel, href: `tel:${SITE.phoneTel}` },
  { icon: "message-square", tone: "bg-trust-light text-trust", label: "WhatsApp", value: SITE.hotline, sub: "Chat with sales", href: `https://wa.me/${SITE.whatsapp}`, external: true },
  { icon: "mail", tone: "bg-brand-light text-brand", label: "Sales email", value: SITE.email, sub: "Quotes & orders — replies within 24 hours", href: `mailto:${SITE.email}` },
  { icon: "mail", tone: "bg-brand-light text-brand", label: "General email", value: SITE.emailInfo, sub: "General enquiries", href: `mailto:${SITE.emailInfo}` },
  { icon: "clock", tone: "bg-navy-50 text-navy", label: "Quote turnaround", value: "< 24 hrs", sub: "Application engineers on standby" },
];

const CHANNELS = [
  { icon: "message-square", title: "Project enquiries", body: "Bill of materials, tendering, sizing assistance and on-site walk-throughs.", cta: "Send RFQ", href: "#rfq" },
  { icon: "headphones", title: "After-sales & technical", body: "Warranty claims, replacement parts and engineering troubleshooting.", cta: "Reach support", href: `mailto:${SITE.email}` },
  { icon: "building-2", title: "Channel & partners", body: "OEM, dealer and channel-partner programmes for the trading network.", cta: "Talk to channel", href: `mailto:${SITE.email}` },
];

const TRUST = [
  ["shield-check", "ISO 9001:2015"],
  ["award", "Authorised OEM partner"],
  ["truck", "Pan-India delivery"],
  ["circle-check", "Genuine, warranty-backed"],
];

export default function ContactPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Contact" }]} />

      {/* Hero */}
      <section className="container-site">
        <div className="bg-hero relative overflow-hidden rounded-2xl text-white">
          <div className="bg-dots pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative grid items-end gap-8 px-6 py-12 md:px-12 md:py-14 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <span className="chip bg-accent text-white">
                <Icon name="headset" className="h-3.5 w-3.5" /> Talk to AMK
              </span>
              <h1 className="mt-5 text-[32px] font-extrabold leading-[1.1] tracking-tight text-white md:text-[46px]">
                Let&apos;s scope your <span className="text-[#ff5c6c]">next project.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/80">
                Bill of materials, panel design, retrofit feasibility or a full-stack rollout — share the brief and an application engineer responds
                within 24 hours, with stock visibility and indicative landed pricing.
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-2.5 text-[13.5px] font-semibold">
              {TRUST.map(([icon, label]) => (
                <li key={label} className="flex items-center gap-2.5 rounded-xl bg-white/10 p-3.5 backdrop-blur">
                  <Icon name={icon} className="h-4 w-4 shrink-0 text-[#ff5c6c]" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Info cards */}
      <section className="container-site pt-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INFO.map((c) => {
            const inner = (
              <>
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${c.tone}`}>
                  <Icon name={c.icon} className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[12.5px] text-ink-soft">{c.label}</p>
                  <p className="font-semibold">{c.value}</p>
                  <p className="mt-0.5 text-[13px] text-ink-muted">{c.sub}</p>
                </div>
              </>
            );
            return c.href ? (
              <a
                key={c.label}
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="panel flex items-start gap-4 p-5 transition hover:border-accent"
              >
                {inner}
              </a>
            ) : (
              <div key={c.label} className="panel flex items-start gap-4 p-5">
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {/* Channels + RFQ */}
      <section className="container-site pt-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <p className="eyebrow">Talk to the right team</p>
            <h2 className="section-title mt-1">Three channels, one inbox.</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">Pick the route that fits — every enquiry is read by a human application engineer.</p>
            <div className="mt-6 space-y-3">
              {CHANNELS.map((c) => (
                <a key={c.title} href={c.href} className="card card-hover group flex items-start gap-4 p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy text-white group-hover:bg-accent group-hover:text-white">
                    <Icon name={c.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-[16px] font-bold">{c.title}</h3>
                    <p className="mt-1 text-[14px] text-ink-muted">{c.body}</p>
                    <span className="link-more mt-2 !text-accent">
                      {c.cta} <Icon name="chevron-right" className="h-4 w-4" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <form id="rfq" className="panel scroll-mt-20 p-6 shadow-lift md:p-8">
            <div className="flex items-start justify-between gap-3 border-b border-line pb-5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-accent-light text-accent">
                  <Icon name="file-text" className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-[19px] font-bold">Request for Quotation</h3>
                  <p className="text-[13px] text-ink-soft">Send us your brief</p>
                </div>
              </div>
              <span className="chip shrink-0 bg-trust-light text-trust">
                <Icon name="clock" className="h-3.5 w-3.5" />
                24-hr reply
              </span>
            </div>
            <div className="mt-5 grid gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="field-label">First name</span>
                  <input name="firstName" type="text" placeholder="First name" className="input" />
                </label>
                <label className="block">
                  <span className="field-label">Last name</span>
                  <input name="lastName" type="text" placeholder="Last name" className="input" />
                </label>
              </div>
              <label className="block">
                <span className="field-label">Company</span>
                <input name="company" type="text" placeholder="Company" className="input" />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="field-label">Work email</span>
                  <input name="email" type="email" placeholder="Work email" className="input" />
                </label>
                <label className="block">
                  <span className="field-label">Phone</span>
                  <input name="phone" type="text" placeholder="Phone" className="input" />
                </label>
              </div>
              <label className="block">
                <span className="field-label">Segment of interest</span>
                <select name="segment" className="input" defaultValue="">
                  <option value="" disabled>
                    Choose a segment…
                  </option>
                  {SEGMENTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.short}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="field-label">Project requirements</span>
                <textarea name="message" rows={5} placeholder="Tell us about the project — application, BOM, target dates." className="input" />
              </label>
              <label className="flex items-start gap-2.5 text-[13px] text-ink-muted">
                <input type="checkbox" className="mt-0.5 h-4 w-4 rounded accent-[#c8102e]" />I agree to be contacted by the AMK sales team regarding this
                enquiry.
              </label>
              <button type="submit" className="btn btn-accent btn-lg w-full">
                Submit RFQ <Icon name="arrow-right" className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
