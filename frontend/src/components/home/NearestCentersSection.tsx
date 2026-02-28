import React, { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MapPin, Package, Calendar, ArrowRight } from "lucide-react";

const DEMO_CENTERS = [
  {
    id: 1,
    name: "LuxeRent Mumbai – Bandra",
    address: "Shop 12, Linking Road, Bandra West, Mumbai – 400050",
    products: 145,
    slots: 18,
    timing: "10 AM – 8 PM",
    rating: 4.9,
  },
  {
    id: 2,
    name: "LuxeRent Delhi – CP",
    address: "Block A, Connaught Place, New Delhi – 110001",
    products: 132,
    slots: 12,
    timing: "10 AM – 9 PM",
    rating: 4.8,
  },
  {
    id: 3,
    name: "LuxeRent Bangalore – Koramangala",
    address: "5th Block, Koramangala, Bangalore – 560095",
    products: 98,
    slots: 15,
    timing: "11 AM – 8 PM",
    rating: 4.7,
  },
  {
    id: 4,
    name: "LuxeRent Hyderabad – Jubilee Hills",
    address: "Road No. 36, Jubilee Hills, Hyderabad – 500033",
    products: 110,
    slots: 20,
    timing: "10 AM – 8 PM",
    rating: 4.9,
  },
];

export default function NearestCentersSection() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".animate-on-scroll").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 120);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="centers" ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="animate-on-scroll text-center mb-12">
          <span className="text-royal-gold text-xs font-semibold uppercase tracking-widest">
            ✦ Visit Us
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-deep-black mt-2 mb-3">
            Nearest Rental Centers
          </h2>
          <p className="text-deep-black/55 max-w-xl mx-auto font-poppins">
            Walk in, try on, and fall in love. Our centers are equipped with expert stylists and sanitized collections.
          </p>
        </div>

        {/* Centers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {DEMO_CENTERS.map((center) => (
            <div
              key={center.id}
              className="animate-on-scroll bg-ivory-white rounded-xl p-6 luxury-shadow hover:luxury-shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-royal-gold/10 hover:border-royal-gold/30"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-playfair font-bold text-deep-black text-lg mb-1">
                    {center.name}
                  </h3>
                  <div className="flex items-start gap-1.5 text-sm text-deep-black/55">
                    <MapPin className="w-4 h-4 text-royal-gold mt-0.5 flex-shrink-0" />
                    <span>{center.address}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 bg-royal-gold/10 rounded-xl px-3 py-1.5 text-center">
                  <p className="text-royal-gold-dark font-bold text-lg leading-none">{center.rating}</p>
                  <p className="text-deep-black/40 text-[10px]">Rating</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-white rounded-lg p-3 text-center">
                  <Package className="w-4 h-4 text-royal-gold mx-auto mb-1" />
                  <p className="font-bold text-deep-black text-sm">{center.products}</p>
                  <p className="text-deep-black/40 text-[10px]">Products</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <Calendar className="w-4 h-4 text-burgundy mx-auto mb-1" />
                  <p className="font-bold text-deep-black text-sm">{center.slots}</p>
                  <p className="text-deep-black/40 text-[10px]">Slots Today</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <span className="text-emerald-500 text-xs block mb-1">🕐</span>
                  <p className="font-bold text-deep-black text-[11px]">{center.timing}</p>
                  <p className="text-deep-black/40 text-[10px]">Timings</p>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => navigate({ to: "/products" })}
                className="w-full flex items-center justify-center gap-2 border-2 border-royal-gold text-royal-gold-dark font-semibold py-2.5 rounded-xl text-sm hover:bg-royal-gold/10 transition-colors"
              >
                Visit Center
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
