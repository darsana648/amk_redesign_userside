import type { ReactNode } from "react";
import { Icon } from "@/components/Icon";
import { Breadcrumb } from "@/components/ui";
import { PAGES } from "@/lib/legal";
import { SITE } from "@/lib/site";

export const anchor = (s: string) => s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export function LegalHero({
  breadcrumb,
  badge,
  badgeIcon = "scroll-text",
  title,
  intro,
  lastUpdated,
}: {
  breadcrumb: string;
  badge: string;
  badgeIcon?: string;
  title: ReactNode;
  intro: string;
  lastUpdated?: string;
}) {
  return (
    <>
      <Breadcrumb items={[{ label: breadcrumb }]} />
      <section className="container-site">
        <div className="bg-hero relative overflow-hidden rounded-2xl text-white">
          <div className="bg-dots pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative px-6 py-10 md:px-12 md:py-14">
            <span className="chip bg-accent text-white">
              <Icon name={badgeIcon} className="h-3.5 w-3.5" /> {badge}
            </span>
            <h1 className="mt-4 max-w-3xl text-[30px] font-extrabold leading-[1.12] tracking-tight text-white md:text-[42px]">{title}</h1>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/80">{intro}</p>
            {lastUpdated && (
              <p className="mt-5 inline-flex items-center gap-1.5 text-[13px] text-white/70">
                <Icon name="calendar" className="h-4 w-4 text-[#ff5c6c]" /> Last updated: {lastUpdated}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export function OnThisPage({ label, items }: { label: string; items: string[] }) {
  return (
    <aside className="lg:sticky lg:top-20 lg:self-start">
      <div className="panel p-5">
        <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-ink-soft">{label}</p>
        <ul className="mt-3 space-y-0.5 text-[14px]">
          {items.map((t) => (
            <li key={t}>
              <a href={`#${anchor(t)}`} className="flex items-start gap-2 rounded-md px-2 py-1.5 font-medium text-ink hover:bg-accent-light hover:text-accent">
                <Icon name="chevron-right" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                {t}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export function ContactCta({ eyebrow, title, body, primary }: { eyebrow: string; title: string; body: string; primary: ReactNode }) {
  return (
    <section className="container-site pt-5">
      <div className="panel grid items-center gap-6 !border-accent-soft bg-accent-light p-6 md:p-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="section-title mt-1">{title}</h2>
          <p className="mt-2 max-w-xl text-[15px] text-ink-muted">{body}</p>
        </div>
        <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-col">
          {primary}
          <a href={`tel:${SITE.phoneTel}`} className="btn btn-outline">
            <Icon name="phone" className="h-4 w-4" /> {SITE.hotline}
          </a>
        </div>
      </div>
    </section>
  );
}

/** Full policy page (terms / privacy / returns / shipping). */
export function LegalPage({ pageKey }: { pageKey: keyof typeof PAGES }) {
  const page = PAGES[pageKey];
  return (
    <>
      <LegalHero {...page} />
      <section className="container-site pt-5">
        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <OnThisPage label="On this page" items={page.sections.map(([h]) => h)} />
          <div className="panel space-y-7 p-6 md:p-8">
            {page.sections.map(([heading, blocks], i) => (
              <div key={heading} id={anchor(heading)} className="scroll-mt-20 border-b border-line pb-7 last:border-0 last:pb-0">
                <h2 className="flex items-center gap-3 text-[19px] font-bold">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-light text-[14px] text-accent">{i + 1}</span>
                  {heading}
                </h2>
                <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-muted md:pl-11">
                  {blocks.map((b, j) =>
                    "ul" in b ? (
                      <ul key={j} className="list-disc space-y-1.5 pl-5 marker:text-accent">
                        {b.ul.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    ) : (
                      <p key={j}>{b.p}</p>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ContactCta
        eyebrow="Questions about this policy?"
        title="Talk to the AMK team."
        body="If anything here is unclear, or you'd like a copy for your records, reach out and we'll be glad to help."
        primary={
          <a href={`mailto:${SITE.emailInfo}`} className="btn btn-accent">
            <Icon name="mail" className="h-4 w-4" /> {SITE.emailInfo}
          </a>
        }
      />
    </>
  );
}
