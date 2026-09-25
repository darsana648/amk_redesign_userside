// Refresh lib/data/snapshot.json from the live AMK API.
// The snapshot is only used as a read-only fallback when the server can't
// reach the API (offline development, API outage).
//
//   npm run snapshot
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const API = (process.env.AMK_API_BASE || "https://api.amktrading.com/api").replace(/\/$/, "");
const ENDPOINTS = {
  home: "/home/",
  hero: "/hero/",
  tree: "/categories/tree/",
  categories: "/categories/",
  brands: "/products/brands/",
  products: "/products/",
  popups: "/ad-popups/?path=/",
};

const snap = {};
for (const [key, path] of Object.entries(ENDPOINTS)) {
  const res = await fetch(API + path, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`);
  snap[key] = await res.json();
}

const out = fileURLToPath(new URL("../lib/data/snapshot.json", import.meta.url));
await writeFile(out, JSON.stringify(snap));
console.log(`Wrote ${out} (${snap.products.length} products)`);
