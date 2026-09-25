"""Refresh assets/data/snapshot.js from the live AMK API.

The snapshot is only used as a read-only fallback when the browser can't reach
the API (offline, or a local preview blocked by the API's CORS policy).

    python tools/snapshot.py
"""
import io
import json
import os
import urllib.request
from datetime import date

API = os.environ.get("AMK_API_BASE", "https://api.amktrading.com/api").rstrip("/")
ENDPOINTS = {
    "home": "/home/",
    "hero": "/hero/",
    "tree": "/categories/tree/",
    "categories": "/categories/",
    "brands": "/products/brands/",
    "products": "/products/",
    "popups": "/ad-popups/?path=/",
}


def get(path):
    req = urllib.request.Request(API + path, headers={"Accept": "application/json", "User-Agent": "amk-snapshot"})
    with urllib.request.urlopen(req, timeout=60) as res:
        return json.loads(res.read().decode("utf-8"))


def main():
    snap = {key: get(path) for key, path in ENDPOINTS.items()}
    out = os.path.join(os.path.dirname(__file__), "..", "assets", "data", "snapshot.js")
    body = (
        f"/* Offline snapshot of {API} taken {date.today().isoformat()}.\n"
        "   Used ONLY when the live API is unreachable (e.g. local preview blocked by CORS).\n"
        "   Regenerate with tools/snapshot.py. */\n"
        "window.AMK_SNAPSHOT = " + json.dumps(snap, ensure_ascii=False, separators=(",", ":")) + ";\n"
    )
    with io.open(out, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(body)
    print(f"Wrote {os.path.normpath(out)} ({len(body) // 1024} KB, {len(snap['products'])} products)")


if __name__ == "__main__":
    main()
