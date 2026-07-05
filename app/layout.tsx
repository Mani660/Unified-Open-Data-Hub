import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Unified Open Data Hub (India-Focused) | Open Dataset Search Platform",
  description:
    "A centralized platform for students and researchers to search, preview, download, and track Indian open datasets from data.gov.in, CPCB, ICMR, NFHS, and state portals.",
  keywords: [
    "open data India",
    "Indian open datasets",
    "dataset search platform",
    "government datasets India",
    "student research datasets",
    "Unified Open Data Hub"
  ],
  openGraph: {
    title: "Unified Open Data Hub (India-Focused)",
    description:
      "A centralized, beginner-friendly platform for Indian open dataset discovery, preview, download, and tracking.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
