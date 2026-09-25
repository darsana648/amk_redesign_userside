/* =========================================================================
   Site configuration — edit here to re-point the site or change contacts.
   ========================================================================= */

/** Same backend the current storefront uses. Override with AMK_API_BASE. */
export const API_BASE = (
  process.env.AMK_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.amktrading.com/api"
).replace(/\/$/, "");

/** When the live API can't be reached, read-only pages fall back to the bundled
 *  snapshot in lib/data/snapshot.json. Enquiry submissions always go live. */
export const SNAPSHOT_FALLBACK = process.env.AMK_SNAPSHOT_FALLBACK !== "false";

export const SITE = {
  name: "AMK",
  fullName: "AMK Industrial Trading",
  tagline: "Industrial trading & smart solutions across six business segments",
  hotline: "+91 80898 19555",
  hotlineLabel: "Sales 24/7",
  phoneTel: "+918089819555",
  whatsapp: "918089819555",
  email: "sales@amkindia.com",
  emailInfo: "info@amkindia.com",
  address:
    "2nd floor, City Point Building, 69/2100, Jos Junction, Pallimukku, Ernakulam, Kerala 682016",
} as const;

export type Segment = {
  id: "industrial" | "commercial" | "retail" | "energy" | "mro" | "smart";
  slug: string;
  name: string;
  short: string;
  tagline: string;
  description: string;
  icon: string;
  root: string;
  image: string;
};

/** Six business segments — drives the segments pages, footer and filters. */
export const SEGMENTS: Segment[] = [
  {
    id: "industrial", slug: "industrial", name: "Industrial", short: "Industrial Segment",
    tagline: "Marine, Oil & Gas, FMCG and heavy industries",
    description: "Automation hardware, drives, panels and accessories for process and discrete manufacturing across Marine, Oil & Gas, FMCG and other heavy industries.",
    icon: "factory", root: "industrial-segment",
    image: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1200&q=80",
  },
  {
    id: "commercial", slug: "commercial", name: "Commercial", short: "Commercial Segment",
    tagline: "Buildings, small businesses and contractors",
    description: "Power distribution, switchgear, lighting and HVAC solutions for commercial buildings, contractors and small businesses.",
    icon: "building-2", root: "commercial-segment",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
  },
  {
    id: "retail", slug: "retail", name: "Retail / Consumer", short: "Retail / Consumer Segment",
    tagline: "Everyday electrical for homes and shops",
    description: "Fans, lights, switches, sockets and home electrical accessories — quality consumer products from leading brands.",
    icon: "lamp", root: "retail-consumer-segment",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&q=80",
  },
  {
    id: "energy", slug: "energy", name: "Energy & Sustainability", short: "Energy & Sustainability Segment",
    tagline: "Solar, battery storage and clean power",
    description: "Solar PV systems, inverters, battery energy storage and EV charging infrastructure for residential, commercial and industrial use.",
    icon: "sun", root: "energy-sustainability-segment",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80",
  },
  {
    id: "mro", slug: "mro", name: "MRO / General Trading", short: "MRO / General Trading Segment",
    tagline: "Maintenance, Retail and Operations consumables",
    description: "Fasteners, hand tools, lubricants, safety wear, hoses, fittings — every consumable required to keep operations running.",
    icon: "wrench", root: "mro-general-trading-segment",
    image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=1200&q=80",
  },
  {
    id: "smart", slug: "smart-solutions", name: "Industrial IT & Smart Solutions", short: "Industrial IT & Smart Solutions",
    tagline: "Automation IT, IoT and smart factory",
    description: "Industrial PCs, edge gateways, SCADA, IIoT platforms, networking and cybersecurity solutions for the smart factory.",
    icon: "cpu", root: "industrial-it-smart-solutions-segment",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
  },
];

export const COUNTRY_CODES: [string, string][] = [
  ["+91", "IN India"], ["+971", "AE UAE"], ["+966", "SA Saudi Arabia"], ["+974", "QA Qatar"],
  ["+973", "BH Bahrain"], ["+968", "OM Oman"], ["+965", "KW Kuwait"], ["+65", "SG Singapore"],
  ["+60", "MY Malaysia"], ["+66", "TH Thailand"], ["+86", "CN China"], ["+44", "GB UK"],
  ["+1", "US USA / Canada"], ["+49", "DE Germany"], ["+33", "FR France"], ["+61", "AU Australia"],
];

/** Icons for the root categories (the segment roots in the category tree). */
export const ROOT_ICONS: Record<string, string> = {
  "industrial-segment": "factory",
  "commercial-segment": "building-2",
  "retail-consumer-segment": "lamp",
  "energy-sustainability-segment": "sun",
  "mro-general-trading-segment": "wrench",
  "industrial-it-smart-solutions-segment": "cpu",
  "project-engineering-solutions-segment": "hard-hat",
};
export const rootIcon = (slug: string) => ROOT_ICONS[slug] || "layout-grid";

export type HeroSlide = {
  id?: number;
  tab?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  cta_label?: string;
};

/* Built-in home carousel slides. They play after the staff-managed slides
   from GET /hero/ (and alone if the staff portal has none). `tab` is the
   short label on the slide tabs. Edit, reorder or remove freely. */
const UNSPLASH = (id: string) => `https://images.unsplash.com/photo-${id}?w=1600&q=70&auto=format&fit=crop`;
export const HERO_SLIDES: HeroSlide[] = [
  {
    tab: "AMK Trading",
    eyebrow: "Since 2008 · Authorised OEM channel",
    title: "Powering India's industries since 2008",
    subtitle: "One vendor for every industrial brand: 25,000+ SKUs across switchgear, automation, cabling, solar and MRO.",
    image: UNSPLASH("1586528116311-ad8dd3c8310d"),
    link: "/shop", cta_label: "Browse catalogue",
  },
  {
    tab: "Switchgear",
    eyebrow: "Switchgear & power distribution",
    title: "Genuine switchgear from the brands you trust",
    subtitle: "MCB, MCCB, ACB and contactors from Schneider, ABB, Siemens, L&T and Havells, quoted within 24 hours.",
    image: UNSPLASH("1621905251918-48416bd8575a"),
    link: "/category/switchgear", cta_label: "Explore switchgear",
  },
  {
    tab: "Automation",
    eyebrow: "Industrial automation",
    title: "PLCs, drives & controls for every production line",
    subtitle: "VFDs, servo drives, HMIs, sensors and communication modules for Marine, Oil & Gas and FMCG plants.",
    image: UNSPLASH("1581092918056-0c4c3acd3789"),
    link: "/category/automation-and-control", cta_label: "Shop automation",
  },
  {
    tab: "Solar & Energy",
    eyebrow: "Energy & sustainability",
    title: "Solar, storage & EV charging from one partner",
    subtitle: "PV modules, inverters, lithium battery storage and EV infrastructure for homes, businesses and industry.",
    image: UNSPLASH("1508514177221-188b1cf16e9d"),
    link: "/segment/energy", cta_label: "Explore energy",
  },
  {
    tab: "MRO & Safety",
    eyebrow: "MRO / general trading",
    title: "Tools, safety & MRO supplies for every plant",
    subtitle: "Hand tools, PPE, fasteners, lubricants and fittings, with bulk and project pricing on request.",
    image: UNSPLASH("1504917595217-d4dc5ebe6122"),
    link: "/segment/mro", cta_label: "Browse MRO",
  },
  {
    tab: "Smart IT",
    eyebrow: "Industrial IT & smart solutions",
    title: "Connect your plant with industrial IoT",
    subtitle: "Industrial PCs, edge gateways, SCADA, networking and cybersecurity for the smart factory.",
    image: UNSPLASH("1518770660439-4636190af475"),
    link: "/segment/smart-solutions", cta_label: "Explore smart solutions",
  },
];
