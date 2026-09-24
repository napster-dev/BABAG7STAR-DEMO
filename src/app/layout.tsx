import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { StoreProvider } from "@/store/StoreContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import QuickView from "@/components/QuickView";
import Toast from "@/components/Toast";

export const metadata: Metadata = {
  title: {
    default: "BabaG7Star — Premium Electronics, Gadgets & Lifestyle",
    template: "%s | BabaG7Star",
  },
  description:
    "Shop premium smartphones, audio, smart gadgets, home electronics & accessories at BabaG7Star. Fast shipping, secure checkout, 12-month warranty, 30-day returns.",
  keywords: ["BabaG7Star", "electronics", "gadgets", "smartphone", "earbuds", "smartwatch", "drone", "accessories", "online shopping"],
  authors: [{ name: "BabaG7Star" }],
  openGraph: {
    title: "BabaG7Star — Premium Electronics & Gadgets",
    description: "Fast. Premium. Trusted. Shop trending tech with free express shipping over $75.",
    type: "website",
    siteName: "BabaG7Star",
  },
  twitter: { card: "summary_large_image", title: "BabaG7Star", description: "Premium tech, streetwear energy. Shop the drop." },
  metadataBase: new URL("https://babag7star.com"),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "BabaG7Star",
              slogan: "Premium. Fast. Trusted.",
              sameAs: [],
            }),
          }}
        />
      </head>
      <body className="bg-[#0B0B0B] text-white antialiased min-h-screen flex flex-col">
        <StoreProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <QuickView />
          <Toast />
        </StoreProvider>
      </body>
    </html>
  );
}
