import React from "react";
import { SiWhatsapp } from "react-icons/si";

export default function WhatsAppFAB() {
  return (
    <a
      href="https://wa.me/919999999999?text=Hi%2C%20I%20want%20to%20book%20a%20trial%20for%20luxury%20rental"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 md:bottom-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-luxury-lg hover:scale-110 transition-transform duration-200"
      style={{ backgroundColor: "#25D366" }}
      aria-label="Chat on WhatsApp"
    >
      <SiWhatsapp className="w-7 h-7 text-white" />
    </a>
  );
}
