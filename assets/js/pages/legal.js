/* Shared template for policy pages + FAQs. Each page calls AMK.renderLegal("<key>"). */
(function () {
  const AMK = window.AMK;
  const E = AMK.esc;
  const I = AMK.i;
  const S = AMK.SITE;
  const slug = (s) => s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const PAGES = {
    terms: {
      breadcrumb: "Terms & Conditions", badge: "Legal", title: "Terms & Conditions", lastUpdated: "31 August 2026",
      intro: `These terms govern your use of the ${S.fullName} website and the catalogue, enquiry and quotation services offered through it. Please read them carefully.`,
      sections: [
        ["Introduction & Acceptance", [
          { p: `Welcome to ${S.fullName} ("AMK", "we", "us" or "our"). These Terms and Conditions ("Terms") govern your access to and use of our website and the catalogue, enquiry and quotation services made available through it (together, the "Website").` },
          { p: `By accessing or using the Website, you confirm that you have read, understood and agree to be bound by these Terms. If you do not agree, please do not use the Website.` }]],
        ["About Us & Our Services", [
          { p: `AMK is an industrial and electrical goods trading company supplying products across our business segments to businesses, contractors and project clients. The Website is an informational and enquiry platform: it presents our product catalogue and allows you to request quotations.` },
          { p: `The Website does not currently offer online checkout or online payment. Orders are concluded offline: you submit an enquiry or request for quotation ("RFQ"), we respond with a quotation, and a binding order is formed only once it is confirmed in writing and a tax invoice is raised.` }]],
        ["Eligibility", [{ ul: [
          `You must be at least 18 years of age and legally capable of entering into a binding contract.`,
          `The Website is intended primarily for business and professional buyers. Where we quote to individual buyers, these Terms apply equally.`,
          `Staff and portal accounts are provided only to authorised AMK personnel and must not be shared.`] }]],
        ["Product Information & Specifications", [{ ul: [
          `Product names, descriptions, images, specifications and technical data are provided for general guidance and may be updated or corrected without notice.`,
          `Images are indicative; actual products are supplied to the relevant manufacturer or OEM specification and may differ in appearance, packaging or revision.`,
          `Genuine OEM products are supplied with the manufacturer's standard warranty and documentation.`,
          `We make reasonable efforts to keep information accurate but do not warrant that it is complete, current or error-free.`] }]],
        ["Pricing & Quotations", [{ ul: [
          `Prices are provided on enquiry. Any price, discount or estimate shown or communicated is indicative until confirmed in a written quotation or proforma invoice.`,
          `Quotations are valid only for the period stated on them and are subject to stock availability at the time of order confirmation.`,
          `Unless stated otherwise, prices are exclusive of applicable taxes (including GST), freight, insurance and other charges, which are shown separately on the quotation or invoice.`,
          `We reserve the right to correct pricing or specification errors at any time before an order is confirmed.`] }]],
        ["Enquiries & Orders", [{ ul: [
          `Submitting an enquiry or RFQ does not create a binding order or oblige AMK to supply.`,
          `A contract is formed only when AMK accepts your order in writing and/or raises a tax invoice against it.`,
          `We may decline, limit or cancel any enquiry or order at our discretion, including where products are unavailable or where we suspect misuse.`] }]],
        ["Intellectual Property", [
          { p: `All content on the Website — including text, graphics, layout, and the AMK name and logo — is owned by or licensed to AMK and is protected by applicable intellectual property laws. You may not copy, reproduce or reuse it without our prior written consent.` },
          { p: `Third-party brand names, trademarks and logos referenced on the Website remain the property of their respective owners. Their appearance does not imply any partnership or endorsement beyond what is expressly stated.` }]],
        ["Acceptable Use", [
          { p: `You agree to use the Website lawfully and not to:` },
          { ul: [`use it for any fraudulent or unlawful purpose;`, `attempt to gain unauthorised access to any part of the Website, its systems or accounts;`,
            `introduce malware, or scrape, harvest or copy data by automated means without permission;`, `submit false, misleading or infringing information through our forms.`] }]],
        ["Third-Party Links", [{ p: `The Website may contain links to third-party websites or resources. We provide these for convenience only and are not responsible for their content, products or privacy practices.` }]],
        ["Limitation of Liability", [
          { p: `The Website and its content are provided on an "as is" and "as available" basis. To the fullest extent permitted by law, AMK is not liable for any indirect, incidental or consequential loss, or for any loss of profit, data or business arising from your use of, or inability to use, the Website.` },
          { p: `Nothing in these Terms excludes or limits any liability that cannot be excluded or limited under applicable law, including liability relating to genuine defects in goods actually supplied under a confirmed order.` }]],
        ["Indemnity", [{ p: `You agree to indemnify and hold AMK harmless from any claim, loss or expense arising out of your misuse of the Website or your breach of these Terms.` }]],
        ["Governing Law & Jurisdiction", [{ p: `These Terms are governed by the laws of India. Subject to any mandatory consumer rights, the courts at Ernakulam, Kerala shall have exclusive jurisdiction over any dispute arising from or in connection with the Website or these Terms.` }]],
        ["Changes to These Terms", [{ p: `We may update these Terms from time to time. The version published on the Website, with the "Last updated" date shown above, is the version in force. Your continued use of the Website after any change constitutes acceptance of the revised Terms.` }]],
        ["Contact Us", [{ p: `For any questions about these Terms, contact us at ${S.emailInfo} or ${S.hotline}, or write to ${S.fullName}, ${S.address}.` }]],
      ],
    },

    privacy: {
      breadcrumb: "Privacy Policy", badge: "Legal", title: "Privacy Policy", lastUpdated: "31 August 2026",
      intro: `This policy explains how ${S.fullName} collects, uses, shares and protects the personal information you provide through our website.`,
      sections: [
        ["Introduction", [
          { p: `${S.fullName} ("AMK", "we", "us" or "our") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains what we collect through our website (the "Website"), how we use it, and the choices available to you.` },
          { p: `We handle personal information in accordance with applicable Indian law, including the Information Technology Act, 2000 and the rules made under it.` }]],
        ["Information We Collect", [
          { p: `We collect information in two ways:` },
          { ul: [`Information you provide — when you submit an enquiry, request a quotation or contact us, we collect your name, company, email address, phone number and the details of your requirement or message.`,
            `Information collected automatically — basic technical data such as your browser type, device and pages visited, gathered through cookies necessary to operate the Website.`] }]],
        ["How We Use Your Information", [
          { ul: [`to respond to your enquiries and prepare quotations;`, `to process, fulfil and support any order you place with us;`,
            `to communicate with you about the products and services you have requested;`, `to operate, maintain and improve the Website;`, `to comply with our legal and regulatory obligations.`] },
          { p: `We do not use your information for automated decision-making, and we do not sell your personal information.` }]],
        ["Cookies", [{ p: `Our Website uses only the cookies necessary for it to function correctly. We do not currently use advertising or cross-site tracking cookies. If we introduce analytics in future, we will update this Policy accordingly. You can control cookies through your browser settings.` }]],
        ["Sharing & Disclosure", [
          { p: `We treat your information as confidential and share it only where necessary:` },
          { ul: [`with service providers who host our Website or help us deliver our services (for example, hosting and logistics partners), under appropriate confidentiality obligations;`,
            `with manufacturers or suppliers, only where needed to source or fulfil the product you have enquired about;`, `where required by law, regulation or a valid legal request.`] }]],
        ["Data Storage & Security", [{ p: `Your information is stored on secure servers, and we apply reasonable technical and organisational measures to protect it against unauthorised access, alteration or disclosure. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.` }]],
        ["Data Retention", [{ p: `We retain personal information only for as long as necessary to fulfil the purposes described in this Policy, including any period required to meet legal, accounting or reporting obligations.` }]],
        ["Your Rights", [{ p: `You may request access to, correction of, or deletion of the personal information we hold about you, and you may withdraw any consent you have given, by contacting us using the details below. We will respond in accordance with applicable law.` }]],
        ["Children's Privacy", [{ p: `The Website is intended for business users and is not directed at children under 18. We do not knowingly collect personal information from children.` }]],
        ["Third-Party Links", [{ p: `The Website may link to external sites we do not control. This Policy does not apply to those sites, and we encourage you to review their own privacy policies.` }]],
        ["Changes to This Policy", [{ p: `We may update this Privacy Policy from time to time. The current version, with the "Last updated" date above, applies. Material changes will be reflected on this page.` }]],
        ["Contact & Grievances", [{ p: `If you have any questions, requests or complaints about this Policy or your personal information, please contact our Grievance Officer at ${S.emailInfo} or ${S.hotline}, or write to ${S.fullName}, ${S.address}. We aim to acknowledge and address grievances within the timeframes required by applicable law.` }]],
      ],
    },

    returns: {
      breadcrumb: "Returns & Refunds", badge: "Policy", title: "Returns, Refunds & Warranty", lastUpdated: "31 August 2026",
      intro: `How we handle returns, refunds and manufacturer warranty claims for industrial and electrical goods supplied by ${S.fullName}.`,
      sections: [
        ["Overview", [{ p: `This policy applies to goods supplied by ${S.fullName} ("AMK") against a confirmed order and tax invoice. As AMK operates on an enquiry-and-quotation basis, the specific commercial terms for your order — including any agreed return or warranty terms — are those stated on your quotation and invoice. Where they differ from this policy, the invoice terms prevail.` }]],
        ["Manufacturer / OEM Warranty", [{ ul: [
          `Genuine products are covered by the original manufacturer's or OEM's warranty, for the period and on the terms specified by that manufacturer.`,
          `Warranty typically covers manufacturing defects and excludes damage from misuse, incorrect installation, unauthorised modification, or normal wear and tear.`,
          `AMK will assist you in coordinating a valid warranty claim with the manufacturer and, where feasible, provide a replacement from stock.`] }]],
        ["Checking Your Delivery", [{ ul: [
          `Please inspect all goods at the time of delivery.`,
          `Visible transit damage or shortages should be noted with the carrier and reported to us within 48 hours of delivery.`,
          `Defects, incorrect items or discrepancies against the invoice should be reported within 7 (seven) days of delivery.`,
          `Please retain the original packaging, the invoice and, where possible, photographs to support your report.`] }]],
        ["Eligibility for Return", [
          { p: `To be eligible for a return, an item must generally be:` },
          { ul: [`unused, in resaleable condition and in its original packaging;`, `accompanied by the original invoice or proof of purchase;`, `reported within the timeframes set out above.`] }]],
        ["Non-Returnable Items", [
          { p: `Some items cannot be returned except where they are defective or incorrectly supplied, including:` },
          { ul: [`custom-built, made-to-order, cut-to-length or specially imported items;`, `products that have been commissioned, installed or energised;`, `clearance or final-sale items identified as such at the time of quotation.`] }]],
        ["Return Process", [{ ul: [
          `Contact our team at ${S.email} or ${S.hotline} to report the issue and request a return authorisation.`,
          `We will confirm whether the item is eligible and provide return instructions.`,
          `Return the goods as instructed. We will inspect them on receipt and confirm the resolution.`] }]],
        ["Refunds", [{ ul: [
          `Where a return or claim is approved, we will offer a replacement, a repair, or a refund / credit note, as appropriate.`,
          `Approved refunds are processed to the original payment method or by bank transfer, normally within 7-10 business days of us confirming the resolution.`,
          `For returns of non-defective items accepted at our discretion, freight costs and a reasonable restocking charge may apply.`] }]],
        ["Order Cancellation", [{ p: `Orders may be cancelled before dispatch, subject to any costs already incurred. Custom, made-to-order and specially imported items may not be cancellable once processing has begun.` }]],
        ["Contact Us", [{ p: `For any return, refund or warranty request, contact ${S.fullName} at ${S.email} or ${S.hotline}, or write to ${S.address}.` }]],
      ],
    },

    shipping: {
      breadcrumb: "Shipping & Delivery", badge: "Delivery", title: "Shipping & Delivery", lastUpdated: "31 August 2026",
      intro: `How ${S.fullName} handles dispatch, delivery, freight and logistics for orders across our business segments.`,
      sections: [
        ["Order Processing", [{ ul: [
          `Orders are processed once your order is confirmed and any agreed payment or credit terms are in place.`,
          `Stocked items are typically dispatched within 24-72 hours of order confirmation.`,
          `Imported or project items are dispatched per the lead time confirmed on your quotation, usually 2-6 weeks depending on the supplier.`] }]],
        ["Delivery Coverage", [{ p: `We deliver across India through reputed transport and courier partners. Delivery timelines depend on your location, the carrier and the nature of the goods. For large or project orders, delivery is scheduled in coordination with your site.` }]],
        ["Freight & Charges", [{ ul: [
          `Freight, handling and insurance charges (where applicable) are shown on your quotation or invoice.`,
          `For certain orders, delivery may be arranged ex-works or on a to-pay basis, as agreed at the quotation stage.`] }]],
        ["Transit, Risk & Inspection", [{ ul: [
          `Please inspect goods on arrival and note any visible damage or shortage with the carrier at the time of delivery.`,
          `Report transit damage or shortages to us within 48 hours so we can assist with a claim (see our Returns, Refunds & Warranty policy).`] }]],
        ["Tracking & Support", [{ p: `For dispatch status or tracking details, contact our team at ${S.email} or ${S.hotline} with your order or invoice reference, and we will keep you updated.` }]],
        ["Delays", [{ p: `While we work to meet all committed timelines, delivery dates are estimates and are not guaranteed. AMK is not liable for delays caused by carriers, customs, force majeure or other circumstances beyond our reasonable control.` }]],
      ],
    },
  };

  function hero({ breadcrumb, badge, badgeIcon = "scroll-text", title, intro, lastUpdated }) {
    return `${AMK.ui.breadcrumb([{ label: breadcrumb }])}
    <section class="container-site">
      <div class="bg-hero relative overflow-hidden rounded-2xl text-white">
        <div class="bg-dots pointer-events-none absolute inset-0 opacity-40"></div>
        <div class="relative px-6 py-10 md:px-12 md:py-14">
          <span class="chip bg-accent text-white">${I(badgeIcon, "h-3.5 w-3.5")} ${E(badge)}</span>
          <h1 class="mt-4 max-w-3xl text-[30px] font-extrabold leading-[1.12] tracking-tight text-white md:text-[42px]">${title}</h1>
          <p class="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/80">${E(intro)}</p>
          ${lastUpdated ? `<p class="mt-5 inline-flex items-center gap-1.5 text-[13px] text-white/70">${I("calendar", "h-4 w-4 text-[#ffb07a]")} Last updated: ${E(lastUpdated)}</p>` : ""}
        </div>
      </div>
    </section>`;
  }

  function contactCta(eyebrow, title, body, primary) {
    return `<section class="container-site pt-5">
      <div class="panel grid items-center gap-6 !border-accent-soft bg-accent-light p-6 md:p-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p class="eyebrow">${E(eyebrow)}</p>
          <h2 class="section-title mt-1">${E(title)}</h2>
          <p class="mt-2 max-w-xl text-[15px] text-ink-muted">${E(body)}</p>
        </div>
        <div class="flex flex-col gap-2.5 sm:flex-row lg:flex-col">${primary}
          <a href="tel:${S.phoneTel}" class="btn btn-outline">${I("phone", "h-4 w-4")} ${E(S.hotline)}</a>
        </div>
      </div>
    </section>`;
  }

  function aside(label, items) {
    return `<aside class="lg:sticky lg:top-20 lg:self-start">
      <div class="panel p-5">
        <p class="text-[13px] font-bold uppercase tracking-[0.06em] text-ink-soft">${E(label)}</p>
        <ul class="mt-3 space-y-0.5 text-[14px]">${items.map((t) => `<li><a href="#${slug(t)}" class="flex items-start gap-2 rounded-md px-2 py-1.5 font-medium text-ink hover:bg-accent-light hover:text-accent">${I("chevron-right", "mt-0.5 h-3.5 w-3.5 shrink-0 text-accent")}${E(t)}</a></li>`).join("")}</ul>
      </div>
    </aside>`;
  }

  AMK.renderLegal = function (key) {
    const page = PAGES[key];
    const body = page.sections.map(([heading, blocks], i) => `
      <div id="${slug(heading)}" class="scroll-mt-20 border-b border-line pb-7 last:border-0 last:pb-0">
        <h2 class="flex items-center gap-3 text-[19px] font-bold"><span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-light text-[14px] text-accent">${i + 1}</span>${E(heading)}</h2>
        <div class="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-muted md:pl-11">
          ${blocks.map((b) => (b.ul ? `<ul class="list-disc space-y-1.5 pl-5 marker:text-accent">${b.ul.map((t) => `<li>${E(t)}</li>`).join("")}</ul>` : `<p>${E(b.p)}</p>`)).join("")}
        </div>
      </div>`).join("");

    document.currentScript.insertAdjacentHTML("afterend", `
      ${hero({ ...page, title: E(page.title) })}
      <section class="container-site pt-5">
        <div class="grid gap-5 lg:grid-cols-[280px_1fr]">
          ${aside("On this page", page.sections.map(([h]) => h))}
          <div class="panel space-y-7 p-6 md:p-8">${body}</div>
        </div>
      </section>
      ${contactCta("Questions about this policy?", "Talk to the AMK team.",
        "If anything here is unclear, or you'd like a copy for your records, reach out and we'll be glad to help.",
        `<a href="mailto:${S.emailInfo}" class="btn btn-accent">${I("mail", "h-4 w-4")} ${E(S.emailInfo)}</a>`)}`);
  };

  const FAQ_GROUPS = [
    ["Ordering", [
      ["Do you sell to individuals or only businesses?", "AMK primarily serves businesses, contractors and project clients. Retail / Consumer segment items can be quoted for individual buyers as well — please contact our sales team."],
      ["How does the quote process work?", "Click Enquire / Request Quote on any product (or post your buy requirement from the home page), share your specs and quantity, and an AMK application engineer responds within 24 hours with project-scoped pricing, lead times and substitutions if required."],
      ["What are typical lead times?", "Stocked items ship within 24–72 hours. Imported / project items typically 2–6 weeks depending on supplier. Lead time is confirmed at quote stage."]]],
    ["Products & warranty", [
      ["Are products genuine OEM stock?", "Yes — AMK is an authorised trading partner of the brands we list. Every order ships with manufacturer warranty and full traceability."],
      ["Do you provide installation or commissioning?", "Yes, for Industrial, Commercial, Energy and Smart Solutions segments we provide installation supervision, commissioning and on-site support through our engineering team."],
      ["What happens if a product fails under warranty?", "Reach out via the after-sales channel on the contact page. We coordinate the manufacturer claim and provide a replacement from stock wherever feasible."]]],
    ["Projects", [
      ["Can AMK handle multi-segment projects?", "Yes — we routinely bundle Industrial automation, Commercial switchgear, Solar and Smart IT under a single project quote. One vendor, one PO, one delivery schedule."],
      ["Do you handle imports and customs?", "For project orders we manage end-to-end import logistics including HS code declaration, customs clearance and last-mile delivery to your site."],
      ["Can you supply against a tender specification?", "Yes. Share the tender document — our application engineers respond with compliant SKUs, alternates and compliance statements within 48 hours."]]],
  ];

  AMK.renderFaqs = function () {
    const groups = FAQ_GROUPS.map(([title, faqs]) => `
      <div id="${slug(title)}" class="scroll-mt-20">
        <h2 class="section-title">${E(title)}</h2>
        <div class="panel mt-4 divide-y divide-line">
          ${faqs.map(([q, a], i) => `<details class="group px-5 py-4" ${i === 0 ? "open" : ""}>
            <summary class="flex cursor-pointer items-start justify-between gap-4 text-[15.5px] font-semibold text-ink group-open:text-accent">
              ${E(q)}<span class="faq-icon grid h-7 w-7 shrink-0 place-items-center rounded-full bg-canvas text-ink transition-transform group-open:bg-accent group-open:text-white">${I("plus", "h-4 w-4")}</span>
            </summary>
            <p class="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink-muted">${E(a)}</p>
          </details>`).join("")}
        </div>
      </div>`).join("");

    document.currentScript.insertAdjacentHTML("afterend", `
      ${hero({ breadcrumb: "FAQs", badge: "Frequently asked", badgeIcon: "circle-help",
        title: `Everything you need to know <span class="text-[#ffb07a]">before you raise a PO.</span>`,
        intro: "Ordering, pricing, warranty, lead times and multi-segment project delivery — clearly answered." })}
      <section class="container-site pt-5">
        <div class="grid gap-5 lg:grid-cols-[280px_1fr]">
          ${aside("In this section", FAQ_GROUPS.map(([t]) => t))}
          <div class="space-y-8">${groups}</div>
        </div>
      </section>
      ${contactCta("Still got questions?", "Talk to an application engineer.",
        "If something isn't answered above, send us the brief. We read every email and reply within 24 hours.",
        `<a href="contact.html#rfq" class="btn btn-accent">${I("message-square", "h-4 w-4")} Send an RFQ</a>
         <a href="mailto:${S.email}" class="btn btn-outline">${I("mail", "h-4 w-4")} ${E(S.email)}</a>`)}`);
  };
})();
