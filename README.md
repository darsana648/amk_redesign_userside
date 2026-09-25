# AMK Industrial Trading — storefront (Next.js)

The redesigned AMK storefront (dark navy & red, marketplace-style layout, white
"Amazon-style" phone view) built with **Next.js 16 (App Router), React 19,
TypeScript and Tailwind CSS 3**. It keeps the pages, routes, data sources and
enquiry workflow of <https://www.amktrading.com/>.

The earlier plain HTML/JS version of this design is kept in [`static-html/`](static-html/)
for reference only — it is not part of the Next.js build.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```

Node 20.9+ is required (Next.js 16).

## Routes

| Route | Page | Data (AMK backend) |
|---|---|---|
| `/` | Home: category rail, carousel, promo cards, segments, staff-managed sections, brands | `GET /hero/`, `/home/`, `/products/brands/` |
| `/shop?q=&sort=` | Catalogue with brand filter, sort and pagination | `GET /products/`, `/categories/`, `/products/brands/` |
| `/category/[slug]` | Brands, sub-categories or leaf stock | `GET /categories/<slug>/page/` |
| `/product/[slug]` | Gallery, attributes, enquiry / WhatsApp / call, similar products | `GET /products/<slug>/`, `/products/?limit=5` |
| `/collection/[slug]?page=` | Staff promo collection ("View more") | `GET /collections/<slug>/?page=` |
| `/segments`, `/segment/[slug]` | Six business segments | `GET /categories/<root>/children/`, `/products/?segment=` |
| `/about`, `/contact`, `/faqs` | Static content | — |
| `/terms`, `/privacy`, `/returns`, `/shipping` | Policy pages | — |

The URLs are the same as the live site, so links stored in the staff portal
(banner links like `/collection/clean-energy`) work unchanged. `/products` redirects to `/shop`.

## Workflow (unchanged)

- **Product enquiry** — every "Request Quote" / "Enquire Now" opens the enquiry form with the
  brand multi-select ("Add …" for unlisted brands), the product's dynamic spec fields
  (`GET /products/<slug>/spec-form/`) and the 120-character description → `POST /inquiries/`.
- **Buy requirement** — header "Post Requirement", the floating "Post your need / Need help?"
  button, the home "Request for Quotation" box and the "Can't find…" boxes → `POST /inquiries/`.
- **WhatsApp / call** — the product page's WhatsApp button sends the product name, SKU and page link.
- **Popup ads** — `GET /ad-popups/?path=` with the same trigger and frequency rules.
- **Category menu** — built from `GET /categories/tree/`: cascading flyouts on desktop,
  drill-down drawer on phones.

## How data flows

- Pages are **server components**; they call the backend on the server (`lib/api.ts`), so the
  backend's CORS policy never gets in the way — the site works on `localhost` against live data.
- Browser-side calls (brand list, spec forms, popups, enquiry submissions) go through the proxy
  route `app/api/amk/[...path]/route.ts`, which only forwards the endpoints the storefront uses.
- If the server can't reach the API, read-only data falls back to `lib/data/snapshot.json`
  (refresh it with `npm run snapshot`). Enquiries are never faked — they always go to the live API.

## Configuration

| What | Where |
|---|---|
| API base URL | `AMK_API_BASE` env var (default `https://api.amktrading.com/api`) |
| Disable snapshot fallback | `AMK_SNAPSHOT_FALLBACK=false` |
| Contacts, segments, built-in carousel slides | `lib/site.ts` |
| Colours, fonts, shadows, radii | `tailwind.config.ts` |
| Component classes, phone "white" layout, carousel & popup styles | `app/globals.css` |
| Policy page & FAQ text | `lib/legal.ts` |

## Project layout

```
app/                    routes (App Router) + api/amk proxy + globals.css
components/layout/      header, search, category menu + drawer, footer, floating button, popups
components/enquiry/     enquiry provider/modal, forms, brand picker, spec fields, buttons
components/home/        hero carousel
components/shop/        catalogue client (filters, sort, pagination), "show more" grid
components/product/     product gallery
components/ui/          product card, grids, breadcrumb, headings, brand slider, empty/404 states
components/legal/       policy page + FAQ building blocks
lib/                    site config, API client, snapshot resolver, types, helpers, legal text
public/img/logo.png     logo
scripts/snapshot.mjs    refreshes lib/data/snapshot.json
static-html/            previous static HTML version (reference only)
```
