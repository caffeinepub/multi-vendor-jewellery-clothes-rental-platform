import React, { useEffect } from "react";
import HeroSection from "../components/home/HeroSection";
import TrustStripSection from "../components/home/TrustStripSection";
import CategorySection from "../components/home/CategorySection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import TrendingProductsSection from "../components/home/TrendingProductsSection";
import NearestCentersSection from "../components/home/NearestCentersSection";
import VendorPromotionSection from "../components/home/VendorPromotionSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import StickyBookTrialButton from "../components/home/StickyBookTrialButton";
import WhatsAppFAB from "../components/home/WhatsAppFAB";
import RecentlyBookedToast from "../components/home/RecentlyBookedToast";

// JSON-LD structured data for SEO
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "LuxeRent – Luxury Jewellery & Designer Wear Rentals",
  "url": "https://luxerent.in",
  "description": "India's most trusted multi-vendor platform for luxury jewellery and designer wear rentals. Try before you rent. Fully sanitized.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://luxerent.in/products?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "INR",
    "lowPrice": "500",
    "highPrice": "5000",
    "offerCount": "5000",
  },
};

export default function Home() {
  // Update document title and meta tags
  useEffect(() => {
    document.title = "LuxeRent – Try Before You Rent Luxury Jewellery & Designer Wear";

    const setMeta = (name: string, content: string, property?: boolean) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", "India's most trusted platform for luxury jewellery and designer wear rentals. Book a trial at your nearest center. Fully sanitized. Zero compromise.");
    setMeta("og:title", "LuxeRent – Try Before You Rent Luxury Jewellery & Designer Wear", true);
    setMeta("og:description", "Book a trial at your nearest center. Fully sanitized. Zero compromise.", true);
    setMeta("og:image", "/assets/generated/hero-banner.dim_1440x800.png", true);
    setMeta("og:type", "website", true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", "LuxeRent – Luxury Jewellery & Designer Wear Rentals");
    setMeta("twitter:description", "Try before you rent. Fully sanitized. Zero compromise.");

    // JSON-LD
    let ldScript = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement | null;
    if (!ldScript) {
      ldScript = document.createElement("script");
      ldScript.type = "application/ld+json";
      document.head.appendChild(ldScript);
    }
    ldScript.textContent = JSON.stringify(JSON_LD);

    return () => {
      document.title = "LuxeRent";
    };
  }, []);

  return (
    <>
      <main>
        <HeroSection />
        <TrustStripSection />
        <CategorySection />
        <HowItWorksSection />
        <TrendingProductsSection />
        <NearestCentersSection />
        <VendorPromotionSection />
        <TestimonialsSection />
      </main>

      {/* Conversion Optimization Elements */}
      <StickyBookTrialButton />
      <WhatsAppFAB />
      <RecentlyBookedToast />
    </>
  );
}
