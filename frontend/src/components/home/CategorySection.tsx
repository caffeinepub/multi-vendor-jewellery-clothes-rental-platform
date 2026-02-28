import React, { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    name: "Bridal Jewellery",
    image: "/assets/generated/category-bridal-jewellery.dim_600x750.png",
    tag: "Most Popular",
    href: "/products?category=bridal-jewellery",
  },
  {
    name: "Wedding Lehenga",
    image: "/assets/generated/category-wedding-lehenga.dim_600x750.png",
    tag: "New Arrivals",
    href: "/products?category=wedding-lehenga",
  },
  {
    name: "Party Wear Jewellery",
    image: "/assets/generated/category-party-jewellery.dim_600x750.png",
    tag: "Trending",
    href: "/products?category=party-jewellery",
  },
  {
    name: "Designer Gowns",
    image: "/assets/generated/category-designer-gowns.dim_600x750.png",
    tag: "Premium",
    href: "/products?category=designer-gowns",
  },
];

export default function CategorySection() {
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
    <section ref={sectionRef} className="py-20 bg-ivory-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="animate-on-scroll text-center mb-12">
          <span className="text-royal-gold text-xs font-semibold uppercase tracking-widest">
            ✦ Curated Collections
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-deep-black mt-2 mb-3">
            Featured Categories
          </h2>
          <p className="text-deep-black/55 max-w-xl mx-auto font-poppins">
            Explore our handpicked luxury collections available for trial and rental at centers near you.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="animate-on-scroll group relative rounded-xl overflow-hidden luxury-shadow cursor-pointer border-2 border-transparent hover:border-royal-gold hover:gold-border-glow transition-all duration-300 hover:-translate-y-1"
              onClick={() => navigate({ to: "/products" })}
            >
              {/* Image */}
              <div className="relative overflow-hidden h-80">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-deep-black/70 via-deep-black/10 to-transparent" />

                {/* Tag */}
                <div className="absolute top-3 left-3">
                  <span className="gold-gradient text-deep-black text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {cat.tag}
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-playfair font-bold text-white text-lg mb-2">{cat.name}</h3>
                <button className="flex items-center gap-1.5 text-royal-gold text-sm font-semibold group-hover:gap-2.5 transition-all duration-200">
                  Explore Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
