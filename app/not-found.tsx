import type { Metadata } from "next";
import { NotFoundBlock } from "@/components/ui";

export const metadata: Metadata = { title: "Page not found · AMK Industrial Trading", robots: { index: false } };

export default function NotFound() {
  return <NotFoundBlock what="page" />;
}
