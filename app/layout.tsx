import type { Metadata, Viewport } from "next";
import { EnquiryProvider } from "@/components/enquiry/EnquiryProvider";
import { Fab } from "@/components/layout/Fab";
import { PopupAds } from "@/components/layout/PopupAds";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "AMK Industrial Trading · One vendor for every industrial brand",
  description:
    "Switchgear, automation, panel materials, solar, batteries and smart solutions — sourced direct from Schneider, ABB, Siemens, L&T, Havells and 30+ authorised brands.",
  icons: { icon: "/img/logo.png" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://amk-trading-media.s3.ap-south-1.amazonaws.com" />
      </head>
      <body className="flex min-h-screen flex-col">
        <EnquiryProvider>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <Fab />
          <PopupAds />
        </EnquiryProvider>
      </body>
    </html>
  );
}
