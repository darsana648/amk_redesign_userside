import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalParts";

export const metadata: Metadata = {
  title: "Shipping & Delivery · AMK Industrial Trading",
  description: "How AMK Industrial Trading handles dispatch, delivery, freight and logistics for orders across India.",
};

export default function Page() {
  return <LegalPage pageKey="shipping" />;
}
