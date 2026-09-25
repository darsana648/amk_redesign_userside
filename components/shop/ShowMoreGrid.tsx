"use client";

import { useState } from "react";
import { ProductGrid } from "@/components/ui";
import type { Product } from "@/lib/types";

/** Product grid that reveals 20 more cards per click. */
export function ShowMoreGrid({ products, step = 20 }: { products: Product[]; step?: number }) {
  const [shown, setShown] = useState(step);
  const left = products.length - shown;
  return (
    <>
      <ProductGrid products={products.slice(0, shown)} />
      {left > 0 && (
        <div className="mt-6 text-center">
          <button type="button" onClick={() => setShown((n) => n + step)} className="btn btn-outline-accent">
            Show more · {left} remaining
          </button>
        </div>
      )}
    </>
  );
}
