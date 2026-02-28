import React, { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Package, CalendarCheck, CreditCard, Sparkles } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Package,
    title: "Vendor Sends to Center",
    desc: "Vendors dispatch their premium collection to our verified rental centers.",
  },
  {
    number: "02",
    icon: CalendarCheck,
    title: "Book Trial at Center",
    desc: "Schedule a visit to your nearest center and try the items in person.",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Select & Pay",
    desc: "Choose what you love, pay the rental fee and refundable deposit securely.",
  },
  {
    number: "04",
    icon: Sparkles,
    title: "Sanitized & Delivered",
    desc: "Your rental is professionally sanitized and delivered to your doorstep.",
  },
];

export default function HowItWorksSection() {
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
    <section id="how-it-works" ref={sectionRef} className="py-20 bg-deep-black">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="animate-on-scroll text-center mb-16">
          <span className="text-royal-gold text-xs font-semibold uppercase tracking-widest">
            ✦ Simple Process
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-ivory-white mt-2 mb-3">
            How It Works
          </h2>
          <p className="text-ivory-white/50 max-w-xl mx-auto font-poppins">
            From browsing to wearing — our seamless 4-step process makes luxury accessible.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-royal-gold/40 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="animate-on-scroll flex flex-col items-center text-center gap-4 relative"
                >
                  {/* Step circle */}
                  <div className="relative z-10">
                    <div className="w-24 h-24 rounded-full gold-gradient flex items-center justify-center luxury-shadow-lg">
                      <Icon className="w-10 h-10 text-deep-black" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-burgundy flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">{step.number}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="font-playfair font-bold text-ivory-white text-lg mb-2">
                      {step.title}
                    </h3>
                    <p className="text-ivory-white/50 text-sm leading-relaxed font-poppins">
                      {step.desc}
                    </p>
                  </div>

                  {/* Mobile connector */}
                  {index < STEPS.length - 1 && (
                    <div className="lg:hidden w-px h-8 bg-royal-gold/30" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="animate-on-scroll text-center mt-14">
          <button
            onClick={() => navigate({ to: "/products" })}
            className="gold-gradient text-deep-black font-bold px-10 py-4 rounded-xl text-base hover:opacity-90 transition-all duration-200 shadow-luxury hover:shadow-gold-glow hover:-translate-y-0.5"
          >
            Book Your Trial Today
          </button>
        </div>
      </div>
    </section>
  );
}
