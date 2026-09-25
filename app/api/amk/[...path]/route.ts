/* Proxy for browser-side calls to the AMK backend.
     GET  /api/amk/<path>  → GET  <API_BASE>/<path>  (falls back to the snapshot)
     POST /api/amk/<path>  → POST <API_BASE>/<path>  (enquiries; never faked)
   Only the endpoints the storefront uses are allowed through. */
import { NextResponse, type NextRequest } from "next/server";
import { API_BASE } from "@/lib/site";
import { apiGet } from "@/lib/api";

export const dynamic = "force-dynamic";

const GET_ALLOWED = [/^products\/brands\/$/, /^products\/[^/]+\/spec-form\/$/, /^ad-popups\/$/, /^categories\/tree\/$/];
const POST_ALLOWED = [/^inquiries\/$/];

type Ctx = { params: Promise<{ path: string[] }> };

const toPath = (parts: string[]) => `${parts.map(encodeURIComponent).join("/")}/`;

export async function GET(req: NextRequest, { params }: Ctx) {
  const path = toPath((await params).path);
  if (!GET_ALLOWED.some((re) => re.test(path))) return NextResponse.json({ detail: "Not found" }, { status: 404 });
  const data = await apiGet(`/${path}${req.nextUrl.search}`);
  if (data === null) return NextResponse.json({ detail: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const path = toPath((await params).path);
  if (!POST_ALLOWED.some((re) => re.test(path))) return NextResponse.json({ detail: "Not found" }, { status: 404 });
  try {
    const res = await fetch(`${API_BASE}/${path}`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: await req.text(),
      cache: "no-store",
    });
    const text = await res.text();
    return new NextResponse(text || "{}", {
      status: res.status,
      headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
    });
  } catch {
    return NextResponse.json({ detail: "Backend unreachable" }, { status: 502 });
  }
}
