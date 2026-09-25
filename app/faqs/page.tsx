import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { anchor, ContactCta, LegalHero, OnThisPage } from "@/components/legal/LegalParts";
import { FAQ_GROUPS } from "@/lib/legal";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQs · AMK Industrial Trading",
  description: "Common questions about trading with AMK — pricing, lead times, warranty, commissioning and multi-segment projects.",
};

export default function FaqsPage() {
  return (
    <>
      <LegalHero
        breadcrumb="FAQs"
        badge="Frequently asked"
        badgeIcon="circle-help"
        title={
          <>
            Everything you need to know <span className="text-[#ff5c6c]">before you raise a PO.</span>
          </>
        }
        intro="Ordering, pricing, warranty, lead times and multi-segment project delivery — clearly answered."
      />
      <section className="container-site pt-5">
        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <OnThisPage label="In this section" items={FAQ_GROUPS.map(([t]) => t)} />
          <div className="space-y-8">
            {FAQ_GROUPS.map(([title, faqs]) => (
              <div key={title} id={anchor(title)} className="scroll-mt-20">
                <h2 className="section-title">{title}</h2>
                <div className="panel mt-4 divide-y divide-line">
                  {faqs.map(([q, a], i) => (
                    <details key={q} className="group px-5 py-4" open={i === 0}>
                      <summary className="flex cursor-pointer items-start justify-between gap-4 text-[15.5px] font-semibold text-ink group-open:text-accent">
                        {q}
                        <span className="faq-icon grid h-7 w-7 shrink-0 place-items-center rounded-full bg-canvas text-ink transition-transform group-open:bg-accent group-open:text-white">
                          <Icon name="plus" className="h-4 w-4" />
                        </span>
                      </summary>
                      <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink-muted">{a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ContactCta
        eyebrow="Still got questions?"
        title="Talk to an application engineer."
        body="If something isn't answered above, send us the brief. We read every email and reply within 24 hours."
        primary={
          <>
            <Link href="/contact#rfq" className="btn btn-accent">
              <Icon name="message-square" className="h-4 w-4" /> Send an RFQ
            </Link>
            <a href={`mailto:${SITE.email}`} className="btn btn-outline">
              <Icon name="mail" className="h-4 w-4" /> {SITE.email}
            </a>
          </>
        }
      />
    </>
  );
}
