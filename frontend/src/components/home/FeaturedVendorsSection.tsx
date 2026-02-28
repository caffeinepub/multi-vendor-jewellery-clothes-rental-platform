import React from 'react';
import { Link } from '@tanstack/react-router';
import { Star, Package, ArrowRight, BadgeCheck } from 'lucide-react';

const vendors = [
  { id: 1, name: 'Meera Jewels', specialty: 'Kundan & Polki', rating: 4.9, products: 45, verified: true },
  { id: 2, name: 'Bridal Couture', specialty: 'Bridal Lehengas', rating: 4.8, products: 32, verified: true },
  { id: 3, name: 'Diamond Dreams', specialty: 'Diamond Jewellery', rating: 4.7, products: 28, verified: true },
  { id: 4, name: 'Ethnic Elegance', specialty: 'Designer Sarees', rating: 4.6, products: 55, verified: false },
];

export default function FeaturedVendorsSection() {
  return (
    <section className="py-20 bg-emerald-dark/5">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-gold-DEFAULT text-sm font-medium tracking-widest uppercase mb-2">Partners</p>
            <h2 className="font-display text-4xl font-bold text-foreground">Featured Vendors</h2>
            <p className="text-muted-foreground mt-2">Trusted vendors with premium collections</p>
          </div>
          <Link to="/products" className="hidden md:flex items-center gap-1 text-emerald-DEFAULT hover:text-emerald-light font-medium text-sm">
            All vendors <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-card rounded-xl border border-border p-6 hover:border-gold/40 hover:shadow-luxury transition-all duration-200 text-center group"
            >
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-DEFAULT to-emerald-light flex items-center justify-center mx-auto mb-4">
                <span className="font-display text-xl font-bold text-ivory-DEFAULT">
                  {vendor.name.charAt(0)}
                </span>
              </div>

              <div className="flex items-center justify-center gap-1 mb-1">
                <h3 className="font-display font-semibold text-foreground group-hover:text-emerald-DEFAULT transition-colors">
                  {vendor.name}
                </h3>
                {vendor.verified && (
                  <BadgeCheck className="h-4 w-4 text-emerald-DEFAULT" />
                )}
              </div>

              <p className="text-muted-foreground text-sm mb-3">{vendor.specialty}</p>

              <div className="flex items-center justify-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-gold-DEFAULT fill-gold-DEFAULT" />
                  <span className="font-medium">{vendor.rating}</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Package className="h-3.5 w-3.5" />
                  <span>{vendor.products} items</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
