import React, { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import CountdownTimer from "./CountdownTimer";

export default function HeroSection() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".animate-on-scroll").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 150);
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
      className="min-h-screen flex items-center bg-ivory-white pt-28 pb-12 overflow-hidden relative"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #C6A75E 0%, transparent 70%)" }} />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-8"
          style={{ background: "radial-gradient(circle, #7A1E2C 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            {/* Badge */}
            <div className="animate-on-scroll">
              <span className="inline-flex items-center gap-2 bg-royal-gold/10 border border-royal-gold/30 text-royal-gold-dark text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest">
                ✦ Premium Rental Platform
              </span>
            </div>

            {/* Headline */}
            <div className="animate-on-scroll">
              <h1 className="font-playfair text-4xl sm:text-5xl xl:text-6xl font-bold text-deep-black leading-tight">
                Try Before You Rent –{" "}
                <span className="gold-gradient-text">Luxury Jewellery</span>{" "}
                & Designer Wear
              </h1>
            </div>

            {/* Subheading */}
            <div className="animate-on-scroll">
              <p className="text-deep-black/60 text-lg leading-relaxed font-poppins">
                Book a trial at your nearest center. Fully sanitized. Zero compromise.
              </p>
            </div>

            {/* Countdown Timer */}
            <div className="animate-on-scroll">
              <CountdownTimer />
            </div>

            {/* CTA Buttons */}
            <div className="animate-on-scroll flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate({ to: "/products" })}
                className="gold-gradient text-deep-black font-bold px-8 py-4 rounded-xl text-base hover:opacity-90 transition-all duration-200 shadow-luxury hover:shadow-gold-glow hover:-translate-y-0.5"
              >
                Book Trial
              </button>
              <button
                onClick={() => navigate({ to: "/products" })}
                className="border-2 border-royal-gold text-royal-gold-dark font-bold px-8 py-4 rounded-xl text-base hover:bg-royal-gold/10 transition-all duration-200"
              >
                Explore Collection
              </button>
            </div>

            {/* Trust indicators */}
            <div className="animate-on-scroll flex flex-wrap gap-4 pt-2">
              {["100% Sanitized", "Physical Trial", "Secure Deposit", "5000+ Products"].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-sm text-deep-black/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-royal-gold inline-block" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-3xl overflow-hidden luxury-shadow-lg">
              {/* Gold gradient background */}
              <div
                className="absolute inset-0 z-0"
                style={{
                  background: "linear-gradient(135deg, #C6A75E22 0%, #F9F6F1 40%, #C6A75E33 100%)",
                }}
              />
              <img
                src="/assets/generated/hero-banner.dim_1440x800.png"
                alt="Luxury Jewellery and Designer Wear"
                className="relative z-10 w-full h-[420px] sm:h-[520px] object-cover object-top"
                loading="lazy"
              />
              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 z-20 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 luxury-shadow">
                <div className="flex items-center gap-2">
                  <img
                    src="/assets/generated/sanitization-badge.dim_400x400.png"
                    alt="Sanitized"
                    className="w-8 h-8 object-contain"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-xs font-bold text-deep-black">100% Sanitized</p>
                    <p className="text-[10px] text-deep-black/50">Every rental, every time</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative ring */}
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full border-2 border-royal-gold/20 pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full border border-royal-gold/30 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
