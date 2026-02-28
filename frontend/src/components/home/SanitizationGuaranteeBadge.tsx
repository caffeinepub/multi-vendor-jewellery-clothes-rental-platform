import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

export default function SanitizationGuaranteeBadge() {
  return (
    <section className="py-16 bg-emerald-dark">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-10 max-w-4xl mx-auto">
          {/* Badge Image */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src="/assets/generated/sanitization-badge.dim_256x256.png"
                alt="Sanitization Guaranteed"
                className="w-40 h-40 object-contain drop-shadow-lg"
              />
              <div className="absolute inset-0 rounded-full border-2 border-gold/30 animate-pulse" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
              <ShieldCheck className="h-5 w-5 text-gold-DEFAULT" />
              <span className="text-gold-DEFAULT text-sm font-medium tracking-widest uppercase">
                Our Promise
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ivory-DEFAULT mb-4">
              Sanitization Guaranteed
            </h2>
            <p className="text-ivory-DEFAULT/70 text-base leading-relaxed mb-6 max-w-lg">
              Every item undergoes a rigorous sanitization process before and after each rental. We use professional-grade cleaning agents and UV sterilization to ensure your safety.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: '🧪', label: 'Chemical Cleaned' },
                { icon: '☀️', label: 'UV Sterilized' },
                { icon: '✅', label: 'QC Verified' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-ivory-DEFAULT/60 text-xs font-medium">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
