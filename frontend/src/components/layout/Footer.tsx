import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { SiFacebook, SiInstagram, SiX, SiLinkedin, SiYoutube } from "react-icons/si";
import { MapPin, Phone, Mail, Heart } from "lucide-react";

const FOOTER_LINKS = {
  platform: {
    title: "Collections",
    links: [
      { label: "Bridal Jewellery", href: "/products" },
      { label: "Bridal Sets", href: "/products" },
      { label: "Party Wear", href: "/products" },
      { label: "Designer Dresses", href: "/products" },
      { label: "Trending Products", href: "/products" },
    ],
  },
  business: {
    title: "For Business",
    links: [
      { label: "Become a Vendor", href: "/register" },
      { label: "Center Login", href: "/login" },
      { label: "Partner With Us", href: "/register" },
      { label: "Vendor Dashboard", href: "/dashboard" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/" },
      { label: "Refund Policy", href: "/" },
      { label: "Vendor Policy", href: "/" },
      { label: "Terms & Conditions", href: "/" },
    ],
  },
};

const SOCIAL_LINKS = [
  { icon: SiFacebook, href: "https://facebook.com", label: "Facebook" },
  { icon: SiInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: SiX, href: "https://x.com", label: "X (Twitter)" },
  { icon: SiLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: SiYoutube, href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const hostname = typeof window !== "undefined" ? window.location.hostname : "luxerent-app";

  return (
    <footer className="bg-deep-black text-ivory-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/assets/generated/logo-mark.dim_128x128.png"
                alt="LuxeRent"
                className="w-10 h-10 object-contain"
                loading="lazy"
              />
              <div>
                <p className="font-playfair font-bold text-xl text-ivory-white">LuxeRent</p>
                <p className="text-[10px] text-royal-gold uppercase tracking-widest">Premium Rentals</p>
              </div>
            </div>
            <p className="text-ivory-white/50 text-sm leading-relaxed mb-5 max-w-xs font-poppins">
              India's most trusted multi-vendor platform for luxury jewellery and designer wear rentals. Try before you rent. Fully sanitized. Zero compromise.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-royal-gold/20 hover:text-royal-gold flex items-center justify-center text-ivory-white/50 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(FOOTER_LINKS).map((section) => (
            <div key={section.title}>
              <h4 className="font-playfair font-semibold text-ivory-white text-base mb-4">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigate({ to: link.href })}
                      className="text-ivory-white/50 hover:text-royal-gold text-sm transition-colors font-poppins text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div>
            <h4 className="font-playfair font-semibold text-ivory-white text-base mb-4">
              Contact Us
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:support@luxerent.in"
                className="flex items-center gap-2 text-ivory-white/50 hover:text-royal-gold text-sm transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                support@luxerent.in
              </a>
              <a
                href="tel:+919999999999"
                className="flex items-center gap-2 text-ivory-white/50 hover:text-royal-gold text-sm transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                +91 99999 99999
              </a>
              <div className="flex items-start gap-2 text-ivory-white/50 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  LuxeRent India Pvt. Ltd.<br />
                  12, Luxury Lane, Bandra West<br />
                  Mumbai – 400050, India
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: Copyright + GST */}
            <div className="flex flex-col sm:flex-row items-center gap-3 text-ivory-white/40 text-xs text-center sm:text-left">
              <span>© {year} LuxeRent India Pvt. Ltd. All rights reserved.</span>
              <span className="hidden sm:inline">·</span>
              <span>GST: 27AABCL1234F1Z5</span>
            </div>

            {/* Center: Payment Icons */}
            <div className="flex items-center gap-2">
              {["VISA", "MC", "UPI", "RuPay", "GPay"].map((method) => (
                <span
                  key={method}
                  className="bg-white/10 text-ivory-white/60 text-[9px] font-bold px-2 py-1 rounded border border-white/10"
                >
                  {method}
                </span>
              ))}
            </div>

            {/* Right: Attribution */}
            <div className="text-ivory-white/40 text-xs flex items-center gap-1">
              Built with{" "}
              <Heart className="w-3 h-3 fill-royal-gold text-royal-gold mx-0.5" />
              {" "}using{" "}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-royal-gold hover:text-royal-gold-light transition-colors"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
