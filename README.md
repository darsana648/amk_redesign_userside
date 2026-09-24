# AMK Industrial Trading — new frontend (HTML + Tailwind CSS)

A redesign of the storefront currently live at <https://www.amktrading.com/>, styled
like a global B2B marketplace (in the spirit of Alibaba.com and IndiaMART). The pages, navigation, data sources and enquiry
workflow are the same as the Next.js site (`../amk-trading-frontend`). Only the
visual layer has changed.

## Run it

It's plain HTML, so there's no build step. Serve the folder with any static server:

```bash
cd amk_new_design
python -m http.server 5500      # then open http://localhost:5500
# or: npx serve .
```

> Opening the files directly with `file://` works too. A server is still better,
> because some browsers restrict scripts on `file://` pages.

## How it maps to the current site

| Current route (Next.js)   | New page                        | Data (same backend)                     |
|---------------------------|---------------------------------|-----------------------------------------|
| `/`                       | `index.html`                    | `GET /hero/`, `GET /home/`              |
| `/shop?q=&sort=`          | `shop.html?q=&sort=`            | `GET /products/`, `/categories/`, `/products/brands/` |
| `/category/<slug>`        | `category.html?slug=<slug>`     | `GET /categories/<slug>/page/`          |
| `/product/<slug>`         | `product.html?slug=<slug>`      | `GET /products/<slug>/`, `/spec-form/`  |
| `/collection/<slug>`      | `collection.html?slug=<slug>`   | `GET /collections/<slug>/?page=`        |
| `/segments`, `/segment/<slug>` | `segments.html`, `segment.html?slug=` | `GET /categories/<root>/children/`, `/products/?segment=` |
| `/about`, `/contact`, `/faqs` | `about.html`, `contact.html`, `faqs.html` | static |
| `/terms`, `/privacy`, `/returns`, `/shipping` | same names `.html` | static |

Links that the staff portal stores in the old format (for example `/collection/clean-energy`
on a banner) are rewritten automatically by `AMK.url()` in `assets/js/core.js`.

The workflow is unchanged:
- **Product enquiry**: every "Request Quote" / "Enquire Now" button opens the same form. It includes the brand multi-select with "Add …", the dynamic spec fields and the 120-character description, and it posts the same payload to `POST /inquiries/`.
- **Buy requirement**: this covers the home banner, the floating "Post your need" button and the "Can't find…" box on category pages. It posts to `POST /inquiries/` without a product.
- **WhatsApp / call**: the product page's WhatsApp button sends the product name, SKU and page link.
- **Popup ads**: these come from `GET /ad-popups/?path=`, with the same trigger and frequency rules.
- **Category menu**: the navigation bar is built from `GET /categories/tree/`, with nested flyouts on desktop and a drill-down drawer on mobile.

## Project layout

```
index.html … 404.html        one file per page
assets/css/styles.css        shared component classes (buttons, inputs, cards, type)
assets/js/tailwind-config.js design tokens: colours, fonts, shadows
assets/js/config.js          API base URL, contact details, six segments
assets/js/core.js            routing, API client + snapshot fallback, product card, breadcrumb…
assets/js/layout.js          top bar, header, category nav, footer, FAB, popups
assets/js/enquiry.js         enquiry modals, brand picker, spec fields, WhatsApp
assets/js/pages/*.js         page scripts (home, shop, category, product, legal/FAQ)
assets/data/snapshot.js      offline copy of the catalogue (fallback only)
tools/snapshot.py            refreshes snapshot.js from the live API
```

## Configuration

- **API**: set `API_BASE` in `assets/js/config.js`. You can also define `window.AMK_API_BASE`
  before `config.js` loads.
- **Contacts and segments**: these are in `AMK.SITE` and `AMK.SEGMENTS` in the same file.
- **Colours and fonts**: these are in `assets/js/tailwind-config.js` and `assets/css/styles.css`.
  The palette is AMK navy `#0b2b5c`, action orange `#ff6a00` for every call to action, and
  trust green `#0a8f5b`, with white cards on a light grey `#f4f5f7` background. All text uses Inter.

### CORS and the offline snapshot

`api.amktrading.com` only accepts browser requests from `https://www.amktrading.com`.
On `localhost` the live API is therefore blocked, and read-only pages fall back to
`assets/data/snapshot.js` automatically. Enquiry submissions still go to the live API, so
they fail locally with "Could not submit right now". They work once the site is served from
the production domain, or after the backend adds your preview origin to its CORS allow-list.
To refresh the snapshot, run `python tools/snapshot.py`.

## Going to production

The Tailwind Play CDN is convenient but not intended for production. To compile a static CSS
file, run the following. It uses the same theme values as `tailwind-config.js`:

```bash
npx tailwindcss@3 -c tailwind.config.cjs -o assets/css/tailwind.css --minify
```

Then replace the two Tailwind `<script>` tags in each page's `<head>` with
`<link rel="stylesheet" href="assets/css/tailwind.css">`.
