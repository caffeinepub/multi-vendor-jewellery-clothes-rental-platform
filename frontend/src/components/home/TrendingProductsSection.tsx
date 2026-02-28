import React, { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MapPin, Clock, Star, TrendingUp } from "lucide-react";

const DEMO_PRODUCTS = [
  {
    id: 1,
    name: "Kundan Bridal Necklace Set",
    image: "/assets/generated/category-bridal-jewellery.dim_600x750.png",
    rentalPrice: 1200,
    deposit: 8000,
    center: "Mumbai - Bandra",
    lastSanitized: "2 days ago",
    mostBooked: true,
    rating: 4.9,
    reviews: 128,
  },
  {
    id: 2,
    name: "Designer Bridal Lehenga",
    image: "/assets/generated/category-wedding-lehenga.dim_600x750.png",
    rentalPrice: 2500,
    deposit: 15000,
    center: "Delhi - Connaught Place",
    lastSanitized: "1 day ago",
    mostBooked: true,
    rating: 4.8,
    reviews: 96,
  },
  {
    id: 3,
    name: "Polki Party Wear Set",
    image: "/assets/generated/category-party-jewellery.dim_600x750.png",
    rentalPrice: 800,
    deposit: 5000,
    center: "Bangalore - Koramangala",
    lastSanitized: "3 days ago",
    mostBooked: false,
    rating: 4.7,
    reviews: 64,
  },
  {
    id: 4,
    name: "Anarkali Designer Gown",
    image: "/assets/generated/category-designer-gowns.dim_600x750.png",
    rentalPrice: 1800,
    deposit: 10000,
    center: "Hyderabad - Jubilee Hills",
    lastSanitized: "1 day ago",
    mostBooked: true,
    rating: 4.9,
    reviews: 112,
  },
  {
    id: 5,
    name: "Temple Gold Necklace",
    image: "/assets/generated/category-bridal-jewellery.dim_600x750.png",
    rentalPrice: 950,
    deposit: 6000,
    center: "Chennai - T. Nagar",
    lastSanitized: "4 days ago",
    mostBooked: false,
    rating: 4.6,
    reviews: 48,
  },
  {
    id: 6,
    name: "Silk Banarasi Lehenga",
    image: "/assets/generated/category-wedding-lehenga.dim_600x750.png",
    rentalPrice: 3200,
    deposit: 20000,
    center: "Mumbai - Bandra",
    lastSanitized: "2 days ago",
    mostBooked: true,
    rating: 5.0,
    reviews: 87,
  },
];

export default function TrendingProductsSection() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".animate-on-scroll").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 80);
            });
          }
        });
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-ivory-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="animate-on-scroll flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <span className="text-royal-gold text-xs font-semibold uppercase tracking-widest">
              ✦ Most Rented
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-deep-black mt-1">
              Trending Products
            </h2>
          </div>
          <button
            onClick={() => navigate({ to: "/products" })}
            className="text-royal-gold-dark font-semibold text-sm border border-royal-gold/40 px-5 py-2 rounded-xl hover:bg-royal-gold/10 transition-colors"
          >
            View All →
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="animate-on-scroll bg-white rounded-xl overflow-hidden luxury-shadow hover:luxury-shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-56">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {product.mostBooked && (
                  <div className="absolute top-3 left-3">
                    <span className="flex items-center gap-1 bg-burgundy text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                      <TrendingUp className="w-3 h-3" />
                      Most Booked
                    </span>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-deep-black text-[10px] font-semibold px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-royal-gold text-royal-gold" />
                    {product.rating} ({product.reviews})
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-playfair font-semibold text-deep-black text-base mb-2 line-clamp-1">
                  {product.name}
                </h3>

                {/* Price Row */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-royal-gold-dark font-bold text-lg">
                      ₹{product.rentalPrice.toLocaleString()}
                    </span>
                    <span className="text-deep-black/40 text-xs">/day</span>
                  </div>
                  <div className="text-right">
                    <span className="text-deep-black/50 text-xs">Deposit</span>
                    <p className="text-deep-black/70 text-sm font-semibold">
                      ₹{product.deposit.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Center & Sanitized */}
                <div className="flex flex-col gap-1.5 mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-deep-black/55">
                    <MapPin className="w-3.5 h-3.5 text-royal-gold" />
                    {product.center}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    Last Sanitized: {product.lastSanitized}
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => navigate({ to: "/products" })}
                  className="w-full gold-gradient text-deep-black font-bold py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
                >
                  Book Trial
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
