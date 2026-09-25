"use client";

/* Category navigation — same behaviour as the live site:
     desktop: hovering a top item drops its categories below it; hovering an
     item with children opens the next level beside it (flips left near the
     right edge and slides up to stay on screen). "All Categories" pins the
     same cascade starting from every segment.
     mobile: "All Categories" opens a drill-down drawer.
   Every item links to /category/<slug>. */
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";
import { PostRequirementButton } from "@/components/enquiry/buttons";
import { rootIcon, SITE } from "@/lib/site";
import type { CategoryNode } from "@/lib/types";
import { shortLabel } from "@/lib/utils";

const COL_W = 270;
const UTILITY_LINKS = [
  { label: "About AMK", href: "/about", icon: "info" },
  { label: "Our Brands", href: "/about#partners", icon: "award" },
  { label: "Careers", href: "/about#careers", icon: "briefcase" },
  { label: "FAQs", href: "/faqs", icon: "circle-help" },
  { label: "Contact", href: "/contact", icon: "mail" },
];

type Level = { nodes: CategoryNode[]; left: number; top: number; withIcons: boolean };
type Cascade = { anchor: string; pinned: boolean; levels: Level[]; active: (number | null)[] };

export function CategoryNav({ tree }: { tree: CategoryNode[] }) {
  const [cascade, setCascade] = useState<Cascade | null>(null);
  const [drawer, setDrawer] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const navRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const close = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setCascade(null);
  }, []);
  const scheduleClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setCascade((c) => (c?.pinned ? c : null)), 200);
  }, []);
  const cancelClose = () => window.clearTimeout(closeTimer.current);

  const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

  const open = (nodes: CategoryNode[], anchorEl: HTMLElement, anchor: string, pinned: boolean) => {
    if (cascade && cascade.anchor === anchor) return cancelClose();
    cancelClose();
    const navBottom = navRef.current?.getBoundingClientRect().bottom ?? 0;
    const r = anchorEl.getBoundingClientRect();
    setCascade({
      anchor,
      pinned,
      levels: [{ nodes, left: Math.max(8, Math.min(r.left, window.innerWidth - COL_W - 8)), top: navBottom, withIcons: pinned }],
      active: [null],
    });
  };

  // Close on route change, scroll (unless pinned), resize, Escape and outside click.
  useEffect(() => {
    close();
    setDrawer(false);
  }, [pathname, close]);
  useEffect(() => {
    if (!cascade) return;
    const onScroll = () => setCascade((c) => (c?.pinned ? c : null));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest("#amk-mega") && !t.closest("#amk-menu-btn")) close();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", close);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", close);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [cascade, close]);

  const hoverItem = (depth: number, i: number, el: HTMLElement, ulEl: HTMLElement) => {
    setCascade((c) => {
      if (!c || c.active[depth] === i) return c;
      const node = c.levels[depth].nodes[i];
      const levels = c.levels.slice(0, depth + 1);
      const active = [...c.active.slice(0, depth), i];
      const kids = node.children || [];
      if (kids.length) {
        const ar = el.getBoundingClientRect();
        const ulr = ulEl.getBoundingClientRect();
        let left = ulr.right - 1;
        if (left + COL_W > window.innerWidth - 8) left = ulr.left - COL_W + 1;
        levels.push({ nodes: kids, left, top: ar.top - 5, withIcons: false });
        active.push(null);
      }
      return { ...c, levels, active };
    });
  };

  return (
    <>
      <nav
        id="amk-nav"
        ref={navRef}
        aria-label="Product categories"
        className="sticky top-0 z-40 border-y border-line bg-white shadow-[0_4px_12px_-10px_rgba(16,24,40,.35)]"
      >
        <div className="container-site flex h-12 items-center gap-2">
          <button
            ref={btnRef}
            type="button"
            id="amk-menu-btn"
            aria-label="All categories"
            aria-expanded={!!cascade?.pinned || drawer}
            onClick={() => {
              if (!isDesktop()) return setDrawer(true);
              if (cascade?.pinned) close();
              else if (btnRef.current) open(tree, btnRef.current, "all", true);
            }}
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-navy px-4 text-[13.5px] font-semibold text-white hover:bg-navy-900"
          >
            <Icon name="menu" className="h-4 w-4" />
            <span className="hidden sm:inline">All Categories</span>
          </button>
          <div className="relative min-w-0 flex-1">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent"
            />
            <ul id="amk-nav-list" className="no-scrollbar flex min-w-0 items-center overflow-x-auto whitespace-nowrap text-[14px] font-medium text-ink">
              {tree.length
                ? tree.map((root) => {
                    const on = cascade?.anchor === root.slug;
                    const openRoot = (el: HTMLElement) => {
                      if (!isDesktop()) return;
                      if (!(root.children || []).length) return close();
                      open(root.children || [], el, root.slug, false);
                    };
                    return (
                      <li key={root.slug} className="shrink-0">
                        <Link
                          href={`/category/${root.slug}`}
                          onMouseEnter={(e) => openRoot(e.currentTarget)}
                          onFocus={(e) => openRoot(e.currentTarget)}
                          onMouseLeave={scheduleClose}
                          className={`nav-root relative flex h-12 items-center gap-1 px-3 transition hover:text-accent ${on ? "!text-accent bg-canvas" : ""}`}
                        >
                          {shortLabel(root.name)}
                          {!!root.children?.length && <Icon name="chevron-down" className="hidden h-3.5 w-3.5 text-ink-soft lg:inline-block" />}
                        </Link>
                      </li>
                    );
                  })
                : Array.from({ length: 6 }, (_, i) => (
                    <li key={i} className="px-3">
                      <span className="skeleton block h-3 w-24" />
                    </li>
                  ))}
            </ul>
          </div>
          <Link
            href="/segments"
            className="hidden shrink-0 items-center gap-1.5 border-l border-line pl-4 text-[13.5px] font-semibold text-ink hover:text-accent 2xl:inline-flex"
          >
            <Icon name="layers" className="h-4 w-4 text-accent" /> Business Segments
          </Link>
        </div>
      </nav>

      {cascade &&
        createPortal(
          <div id="amk-mega" onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
            {cascade.levels.map((lvl, depth) => (
              <CascadeLevel
                key={`${depth}-${lvl.nodes[0]?.slug}`}
                level={lvl}
                depth={depth}
                active={cascade.active[depth]}
                onHover={hoverItem}
              />
            ))}
          </div>,
          document.body,
        )}

      {drawer && <MobileDrawer tree={tree} onClose={() => setDrawer(false)} />}
    </>
  );
}

function CascadeLevel({
  level,
  depth,
  active,
  onHover,
}: {
  level: Level;
  depth: number;
  active: number | null;
  onHover: (depth: number, i: number, el: HTMLElement, ul: HTMLElement) => void;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const [top, setTop] = useState(level.top);

  // Keep the list inside the viewport vertically.
  useLayoutEffect(() => {
    const h = ref.current?.offsetHeight ?? 0;
    setTop(Math.max(8, Math.min(level.top, window.innerHeight - h - 8)));
  }, [level.top, level.nodes]);

  return (
    <ul
      ref={ref}
      role="menu"
      data-level={depth}
      className="fixed z-[95] overflow-y-auto border border-line bg-white py-1 shadow-pop"
      style={{ width: COL_W, maxHeight: "calc(100vh - 16px)", left: level.left, top }}
    >
      {level.nodes.map((n, i) => {
        const kids = (n.children || []).length;
        const on = active === i;
        return (
          <li key={n.slug} role="none">
            <Link
              role="menuitem"
              href={`/category/${n.slug}`}
              onMouseEnter={(e) => ref.current && onHover(depth, i, e.currentTarget, ref.current)}
              className={`cas-item flex items-center gap-3 px-4 py-2.5 text-[14px] text-ink hover:bg-canvas hover:text-accent ${on ? "is-active bg-canvas !text-accent" : ""}`}
            >
              {level.withIcons && depth === 0 && <Icon name={rootIcon(n.slug)} className="h-4 w-4 shrink-0 text-ink-soft" />}
              <span className="min-w-0 flex-1">{depth === 0 && level.withIcons ? shortLabel(n.name) : n.name}</span>
              {kids > 0 && <Icon name="chevron-right" className="h-4 w-4 shrink-0 text-ink-soft" />}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function DrawerNode({ n, depth, onNavigate }: { n: CategoryNode; depth: number; onNavigate: () => void }) {
  const [openKids, setOpenKids] = useState(false);
  const kids = n.children || [];
  return (
    <li>
      <div className="flex items-stretch" style={{ paddingLeft: depth * 14 }}>
        <Link
          href={`/category/${n.slug}`}
          onClick={onNavigate}
          className={`flex flex-1 items-center gap-3 py-3 pl-4 pr-2 text-[14.5px] ${depth ? "text-ink-muted" : "font-semibold text-ink"} hover:text-accent`}
        >
          {depth === 0 && <Icon name={rootIcon(n.slug)} className="h-4 w-4 text-accent" />}
          {depth === 0 ? shortLabel(n.name) : n.name}
        </Link>
        {kids.length > 0 && (
          <button
            type="button"
            className="dr-toggle grid w-12 place-items-center text-ink-soft hover:bg-canvas"
            aria-expanded={openKids}
            aria-label={`Expand ${n.name}`}
            onClick={() => setOpenKids((v) => !v)}
          >
            <Icon name="chevron-down" className={`h-4 w-4 transition-transform ${openKids ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>
      {kids.length > 0 && openKids && (
        <ul className="bg-paper">
          {kids.map((c) => (
            <DrawerNode key={c.slug} n={c} depth={depth + 1} onNavigate={onNavigate} />
          ))}
        </ul>
      )}
    </li>
  );
}

function MobileDrawer({ tree, onClose }: { tree: CategoryNode[]; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div id="amk-drawer">
      <button type="button" onClick={onClose} className="fixed inset-0 z-[60] cursor-default bg-navy-950/50" aria-label="Close menu" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Categories"
        className="fade-up fixed inset-y-0 left-0 z-[70] flex w-[86%] max-w-[360px] flex-col bg-white text-ink shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/logo.png" alt={SITE.fullName} className="h-9 w-auto" />
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-canvas hover:bg-line" aria-label="Close menu">
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 border-b border-line p-3">
          <PostRequirementButton className="btn btn-accent btn-sm" onOpen={onClose}>
            <Icon name="clipboard-list" className="h-4 w-4" /> Post Need
          </PostRequirementButton>
          <a href={`tel:${SITE.phoneTel}`} className="btn btn-outline btn-sm">
            <Icon name="phone" className="h-4 w-4" /> Call Sales
          </a>
        </div>
        <div className="flex-1 overflow-y-auto">
          <p className="px-4 pb-1 pt-4 text-[11.5px] font-bold uppercase tracking-[0.08em] text-ink-soft">All Categories</p>
          <ul className="divide-y divide-line">
            {tree.length ? (
              tree.map((n) => <DrawerNode key={n.slug} n={n} depth={0} onNavigate={onClose} />)
            ) : (
              <li className="px-4 py-4 text-sm text-ink-soft">Loading categories…</li>
            )}
          </ul>
          <p className="border-t border-line px-4 pb-1 pt-4 text-[11.5px] font-bold uppercase tracking-[0.08em] text-ink-soft">Information</p>
          <ul>
            {UTILITY_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 text-[14.5px] text-ink hover:text-accent">
                  <Icon name={l.icon} className="h-4 w-4 text-ink-soft" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="p-4">
            <Link href="/contact#rfq" onClick={onClose} className="btn btn-primary w-full">
              <Icon name="file-text" className="h-4 w-4" /> Request a Quote
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
