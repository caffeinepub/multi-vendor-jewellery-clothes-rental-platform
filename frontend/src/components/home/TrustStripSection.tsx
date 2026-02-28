import React, { useEffect, useRef } from "react";
import { ShieldCheck, Lock, Store, CreditCard } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Sanitized & Verified",
    desc: "Every item professionally cleaned and certified before each rental",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Lock,
    title: "Secure Deposit Protection",
    desc: "Your deposit is fully protected and refunded after safe return",
    color: "text-royal-gold-dark",
    bg: "bg-royal-gold/10",
  },
  {
    icon: Store,
    title: "Physical Trial Available",
    desc: "Visit our centers to try before you commit to any rental",
    color: "text-burgundy",
    bg: "bg-burgundy/10",
  },
  {
    icon: CreditCard,
    title: "Safe Payments",
    desc: "100% secure transactions with UPI, cards, and net banking",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
];

export default function TrustStripSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".animate-on-scroll").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 100);
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
    <section ref={sectionRef} className="bg-white border-y border-royal-gold/15 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="animate-on-scroll flex flex-col items-center text-center gap-3 p-5 rounded-xl hover:luxury-shadow transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <div>
                  <h3 className="font-playfair font-semibold text-deep-black text-base mb-1">
                    {item.title}
                  </h3>
                  <p className="text-deep-black/55 text-xs leading-relaxed font-poppins">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
