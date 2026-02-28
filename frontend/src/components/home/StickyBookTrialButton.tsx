import React from "react";
import { useNavigate } from "@tanstack/react-router";

export default function StickyBookTrialButton() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-4 pb-4 pt-2 bg-gradient-to-t from-white/95 to-transparent">
      <button
        onClick={() => navigate({ to: "/products" })}
        className="w-full gold-gradient text-deep-black font-bold py-4 rounded-xl text-base shadow-luxury-lg hover:opacity-90 transition-opacity"
      >
        📅 Book Trial Now
      </button>
    </div>
  );
}
