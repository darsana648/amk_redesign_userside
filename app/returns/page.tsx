import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalParts";

export const metadata: Metadata = {
  title: "Returns, Refunds & Warranty · AMK Industrial Trading",
  description: "How AMK handles returns, refunds and manufacturer warranty claims.",
};

export default function Page() {
  return <LegalPage pageKey="returns" />;
}
