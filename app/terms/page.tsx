import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalParts";

export const metadata: Metadata = {
  title: "Terms & Conditions · AMK Industrial Trading",
  description: "Terms governing use of the AMK Industrial Trading website and its catalogue, enquiry and quotation services.",
};

export default function Page() {
  return <LegalPage pageKey="terms" />;
}
