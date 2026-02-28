/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "oklch(var(--card) / <alpha-value>)",
          foreground: "oklch(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "oklch(var(--popover) / <alpha-value>)",
          foreground: "oklch(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground) / <alpha-value>)",
        },
        border: "oklch(var(--border) / <alpha-value>)",
        input: "oklch(var(--input) / <alpha-value>)",
        ring: "oklch(var(--ring) / <alpha-value>)",
        // Luxury palette
        "royal-gold": {
          DEFAULT: "#C6A75E",
          light: "#D4BC82",
          dark: "#A8893A",
        },
        "deep-black": "#111111",
        "ivory-white": "#F9F6F1",
        "burgundy": "#7A1E2C",
        "whatsapp": "#25D366",
      },
      fontFamily: {
        playfair: ["Playfair Display", "Georgia", "serif"],
        poppins: ["Poppins", "Inter", "sans-serif"],
        sans: ["Poppins", "Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        luxury: "0 4px 24px oklch(0.12 0.01 60 / 0.08), 0 1px 4px oklch(0.12 0.01 60 / 0.04)",
        "luxury-lg": "0 8px 40px oklch(0.12 0.01 60 / 0.12), 0 2px 8px oklch(0.12 0.01 60 / 0.06)",
        "gold-glow": "0 0 20px oklch(0.72 0.09 75 / 0.5), 0 0 40px oklch(0.72 0.09 75 / 0.2)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.7s ease-out forwards",
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};
