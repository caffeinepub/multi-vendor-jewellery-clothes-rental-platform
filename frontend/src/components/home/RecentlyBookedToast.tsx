import React, { useState, useEffect } from "react";
import { X, MapPin } from "lucide-react";

const BOOKINGS = [
  { name: "Priya S.", product: "Kundan Bridal Set", center: "Mumbai – Bandra", time: "2 min ago" },
  { name: "Ananya R.", product: "Designer Lehenga", center: "Delhi – CP", time: "5 min ago" },
  { name: "Meera P.", product: "Polki Jewellery Set", center: "Bangalore", time: "8 min ago" },
  { name: "Kavitha N.", product: "Anarkali Gown", center: "Chennai", time: "12 min ago" },
];

export default function RecentlyBookedToast() {
  const [visible, setVisible] = useState(false);
  const [booking, setBooking] = useState(BOOKINGS[0]);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setBooking(BOOKINGS[Math.floor(Math.random() * BOOKINGS.length)]);
      setVisible(true);
    }, 5000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (visible) {
      const hideTimer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(hideTimer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-4 z-50 max-w-xs animate-fade-in-up">
      <div className="bg-white rounded-xl luxury-shadow-lg border border-royal-gold/20 p-4 flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
          <span className="font-playfair font-bold text-deep-black text-xs">
            {booking.name.split(" ").map((n) => n[0]).join("")}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-deep-black text-sm font-semibold leading-tight">
            {booking.name} just booked a trial!
          </p>
          <p className="text-royal-gold-dark text-xs font-medium mt-0.5 truncate">
            {booking.product}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-deep-black/40" />
            <span className="text-deep-black/40 text-[10px]">{booking.center} · {booking.time}</span>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={() => setVisible(false)}
          className="text-deep-black/30 hover:text-deep-black/60 transition-colors flex-shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
