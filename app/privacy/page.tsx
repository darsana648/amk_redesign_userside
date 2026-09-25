import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalParts";

export const metadata: Metadata = {
  title: "Privacy Policy · AMK Industrial Trading",
  description: "How AMK Industrial Trading collects, uses, shares and protects your personal information.",
};

export default function Page() {
  return <LegalPage pageKey="privacy" />;
}
