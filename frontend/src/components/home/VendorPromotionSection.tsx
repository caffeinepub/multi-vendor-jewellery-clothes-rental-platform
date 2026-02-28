import React, { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { TrendingUp, Shield, BarChart3, ArrowRight } from "lucide-react";

const BENEFITS = [
  {
    icon: TrendingUp,
    title: "Commission Benefits",
    desc: "Earn up to 70% revenue share on every successful rental from your collection.",
  },
  {
    icon: Shield,
    title: "Secure Inventory Management",
    desc: "Real-time tracking of your items across all centers with full audit trail.",
  },
  {
    icon: BarChart3,
    title: "Transparent Payout",
    desc: "Weekly payouts with detailed reports. No hidden fees, no surprises.",
  },
];

export default function VendorPromotionSection() {
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
    <section
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #111111 0%, #1a1208 50%, #111111 100%)" }}
    >
      {/* Decorative gold elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #C6A75E 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #C6A75E 0%, transparent 70%)" }}
        />
        {/* Gold border top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-royal-gold to-transparent opacity-40" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-royal-gold to-transparent opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="animate-on-scroll text-center mb-14">
          <span className="text-royal-gold text-xs font-semibold uppercase tracking-widest">
            ✦ Partner With Us
          </span>
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-ivory-white mt-3 mb-4">
            Own Premium Collection?{" "}
            <span className="gold-gradient-text">Earn with Us.</span>
          </h2>
          <p className="text-ivory-white/50 max-w-2xl mx-auto font-poppins text-lg">
            Join 500+ vendors who are monetizing their luxury collections through our trusted platform.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="animate-on-scroll bg-white/5 backdrop-blur-sm border border-royal-gold/20 rounded-xl p-6 hover:border-royal-gold/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-deep-black" />
                </div>
                <h3 className="font-playfair font-bold text-ivory-white text-lg mb-2">
                  {benefit.title}
                </h3>
                <p className="text-ivory-white/50 text-sm leading-relaxed font-poppins">
                  {benefit.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="animate-on-scroll flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate({ to: "/vendor" })}
            className="gold-gradient text-deep-black font-bold px-10 py-4 rounded-xl text-base hover:opacity-90 transition-all duration-200 shadow-luxury hover:shadow-gold-glow hover:-translate-y-0.5 flex items-center gap-2"
          >
            Become Vendor
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate({ to: "/" })}
            className="border-2 border-royal-gold/50 text-royal-gold font-bold px-10 py-4 rounded-xl text-base hover:border-royal-gold hover:bg-royal-gold/10 transition-all duration-200"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
