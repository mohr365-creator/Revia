import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { site } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: "Revia | The way, revived.",
    template: "%s | Revia",
  },
  description: site.thesis,
  openGraph: {
    title: "Revia | The way, revived.",
    description: site.thesis,
    type: "website",
  },
  robots: {
    // Pre–Series A: keep the site out of search indexes until launch.
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AnalyticsProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
