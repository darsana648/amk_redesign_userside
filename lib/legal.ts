/* Content for the policy pages (terms, privacy, returns, shipping) and FAQs.
   Wording is unchanged from the previous storefront. */
import { SITE as S } from "./site";

export type LegalBlock = { p: string } | { ul: string[] };
export type LegalPageContent = {
  breadcrumb: string;
  badge: string;
  title: string;
  lastUpdated: string;
  intro: string;
  sections: [string, LegalBlock[]][];
};

export const PAGES: Record<"terms" | "privacy" | "returns" | "shipping", LegalPageContent> = {
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

export const FAQ_GROUPS: [string, [string, string][]][] = [
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
