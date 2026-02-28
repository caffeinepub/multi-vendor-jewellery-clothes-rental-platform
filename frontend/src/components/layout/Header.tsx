import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Menu, X, MapPin, Phone, ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../backend";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CENTERS = [
  "Mumbai - Bandra",
  "Delhi - Connaught Place",
  "Bangalore - Koramangala",
  "Hyderabad - Jubilee Hills",
  "Chennai - T. Nagar",
];

const NAV_LINKS = [
  { label: "Jewellery", href: "/products" },
  { label: "Bridal Sets", href: "/products" },
  { label: "Party Wear", href: "/products" },
  { label: "Designer Dresses", href: "/products" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Centers", href: "/#centers" },
  { label: "Become Vendor", href: "/vendor" },
];

export default function Header() {
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { currentRole } = useAuth();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState("Choose Center");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const getDashboardPath = (): "/" | "/admin" | "/vendor" | "/center" | "/customer" => {
    switch (currentRole) {
      case UserRole.admin: return "/admin";
      case UserRole.vendor: return "/vendor";
      case UserRole.center: return "/center";
      case UserRole.customer: return "/customer";
      default: return "/";
    }
  };

  const handleSearch = () => {
    navigate({ to: "/products" });
    setSearchOpen(false);
  };

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate({ to: "/" });
      }
    } else if (href === "/products") {
      navigate({ to: "/products" });
    } else if (href === "/vendor") {
      navigate({ to: "/vendor" });
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-luxury-lg" : ""}`}>
      {/* Top Utility Bar */}
      <div className="bg-deep-black text-ivory-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-4">
            {/* Location Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 hover:text-royal-gold transition-colors">
                  <MapPin className="w-3 h-3" />
                  <span>{selectedCenter}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-deep-black border-royal-gold/30 text-ivory-white">
                {CENTERS.map((c) => (
                  <DropdownMenuItem
                    key={c}
                    onClick={() => setSelectedCenter(c)}
                    className="hover:bg-royal-gold/20 hover:text-royal-gold cursor-pointer"
                  >
                    {c}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <a href="tel:+919999999999" className="flex items-center gap-1 hover:text-royal-gold transition-colors">
              <Phone className="w-3 h-3" />
              <span>+91 99999 99999</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate({ to: "/vendor" })}
              className="text-royal-gold hover:text-royal-gold-light transition-colors font-medium"
            >
              Vendor Join
            </button>
            <span className="text-ivory-white/30">|</span>
            <button
              onClick={handleAuth}
              disabled={isLoggingIn}
              className="hover:text-royal-gold transition-colors disabled:opacity-50"
            >
              {isLoggingIn ? "Logging in..." : isAuthenticated ? "Logout" : "Login / Register"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-ivory-white/95 backdrop-blur-md border-b border-royal-gold/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => navigate({ to: "/" })}
              className="flex items-center gap-2 flex-shrink-0"
            >
              <img
                src="/assets/generated/logo-mark.dim_128x128.png"
                alt="LuxeRent"
                className="w-9 h-9 object-contain"
                loading="lazy"
              />
              <div className="flex flex-col leading-none">
                <span className="font-playfair font-bold text-lg text-deep-black tracking-wide">LuxeRent</span>
                <span className="text-[9px] text-royal-gold font-poppins tracking-widest uppercase">Premium Rentals</span>
              </div>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-md hover:text-royal-gold hover:bg-royal-gold/5 ${
                    link.label === "Become Vendor"
                      ? "text-burgundy font-semibold"
                      : "text-deep-black/80"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Search + Dashboard + Mobile Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full hover:bg-royal-gold/10 text-deep-black/70 hover:text-royal-gold transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => navigate({ to: getDashboardPath() })}
                  className="hidden md:flex items-center gap-2 gold-gradient text-deep-black text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Dashboard
                </button>
              )}
              <button
                className="lg:hidden p-2 rounded-md hover:bg-royal-gold/10 text-deep-black"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search Bar Dropdown */}
          {searchOpen && (
            <div className="pb-4 border-t border-royal-gold/10 pt-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-black/40" />
                  <input
                    type="text"
                    placeholder="Search jewellery, lehenga, gowns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-royal-gold/30 rounded-xl text-sm focus:outline-none focus:border-royal-gold bg-white"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-24 px-3 py-2 border border-royal-gold/30 rounded-xl text-sm focus:outline-none focus:border-royal-gold bg-white"
                  />
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-24 px-3 py-2 border border-royal-gold/30 rounded-xl text-sm focus:outline-none focus:border-royal-gold bg-white"
                  />
                  <button
                    onClick={handleSearch}
                    className="gold-gradient text-deep-black px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-1"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-royal-gold/20 bg-ivory-white">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left px-3 py-2.5 text-sm font-medium text-deep-black/80 hover:text-royal-gold hover:bg-royal-gold/5 rounded-lg transition-colors"
                >
                  {link.label}
                </button>
              ))}
              {isAuthenticated && (
                <button
                  onClick={() => { navigate({ to: getDashboardPath() }); setMobileOpen(false); }}
                  className="text-left px-3 py-2.5 text-sm font-medium text-deep-black/80 hover:text-royal-gold hover:bg-royal-gold/5 rounded-lg transition-colors"
                >
                  Dashboard
                </button>
              )}
              <div className="pt-2 border-t border-royal-gold/10 mt-1">
                <button
                  onClick={() => { handleAuth(); setMobileOpen(false); }}
                  disabled={isLoggingIn}
                  className="w-full gold-gradient text-deep-black font-semibold py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoggingIn ? "Logging in..." : isAuthenticated ? "Logout" : "Login / Register"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
