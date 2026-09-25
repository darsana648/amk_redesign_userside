/* Shapes returned by the AMK backend (api.amktrading.com) and the UI shapes
   the components work with. */

export interface ApiBrand {
  id: number;
  name: string;
  slug: string;
  image?: string;
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
  order?: number;
  has_children?: boolean;
  children?: ApiCategory[];
}

export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: string | number;
  old_price?: string | number | null;
  stock: number;
  image: string;
  images?: { id: number; image: string; is_primary: boolean; sort_order: number }[];
  brands?: ApiBrand[];
  category_name?: string;
  category_slug?: string;
  category?: ApiCategory;
  features?: { id: number; key: string; value: string }[];
  tags?: { id: number; tag_name: string }[];
  is_hot?: boolean;
  is_new?: boolean;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  image?: string;
}

/** UI product — identical rules to the old mapper. */
export interface Product {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  brands: Brand[];
  category: string;
  categoryName: string;
  image: string;
  gallery?: string[];
  price: number;
  shortDescription?: string;
  description?: string;
  inStock: boolean;
  isHot: boolean;
  isNew: boolean;
  rating: { value: number; count: number };
  features: { id: number; key: string; value: string }[];
  tags: string[];
}

export interface CategoryNode {
  id?: number;
  name: string;
  slug: string;
  image: string;
  children?: CategoryNode[];
}

export interface HeroBanner {
  id: number;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  cta_label?: string;
}

export interface HomeSection {
  id: number;
  kind: "banner" | "product_grid";
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  config?: Record<string, unknown>;
  promo_slug?: string;
  view_all_href?: string;
  banner_image?: string;
  cta_label?: string;
  link?: string | null;
  products?: ApiProduct[];
  total_count?: number;
}

export interface CategoryPage {
  category: CategoryNode;
  path: CategoryNode[];
  children: CategoryNode[];
  is_leaf: boolean;
  products: ApiProduct[];
  segment_products: ApiProduct[];
  brands?: ApiBrand[];
}

export interface CollectionPage {
  block: { slug: string; kind: string; eyebrow: string; title: string; subtitle: string; banner_image: string };
  count: number;
  page: number;
  page_size: number;
  results: ApiProduct[];
}

export interface Popup {
  id: number;
  title: string;
  subtitle: string;
  body: string;
  image: string;
  link: string;
  cta_label: string;
  trigger: "immediate" | "delay" | "scroll" | "exit_intent";
  delay_seconds: number;
  scroll_pct: number;
  frequency: "every_visit" | "once_per_session" | "once_per_day" | "once_per_week" | "once_ever";
  dismissable: boolean;
  auto_close_seconds: number;
}

/* ---------- Spec form (GET /products/<slug>/spec-form/) ---------- */
export type SpecFieldType = "text" | "number" | "boolean" | "date" | "single_select" | "multi_select";

export interface SpecFormItem {
  id: number;
  field: {
    id: number;
    name: string;
    slug: string;
    field_type: SpecFieldType;
    render_as: string;
    unit: string;
    options?: string[];
  };
  is_required: boolean;
  default_value: string;
  sort_order: number;
}

export interface SpecFormPayload {
  product: { id: number; name: string; slug: string };
  groups: { id: number; name: string; description: string; items: SpecFormItem[] }[];
}

export interface InquirySpecAnswer {
  field_id: number;
  value?: string | number | boolean | null;
  values?: string[];
}

/** Minimal product info the enquiry form needs (safe to pass to client components). */
export interface EnquiryProduct {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  brands: { id: number; name: string }[];
  category: string;
  categoryName: string;
}
