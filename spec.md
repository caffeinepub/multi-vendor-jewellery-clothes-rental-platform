# Specification

## Summary
**Goal:** Rebuild the public home page of LuxeRent Platform with a premium 10-section layout, redesigned header/footer, and conversion optimization elements using a luxury design system.

**Planned changes:**
- Redesign `frontend/src/pages/Home.tsx` with a full 10-section layout: Hero, Trust Strip, Featured Categories, How It Works, Trending Products, Nearest Centers, Vendor CTA, Testimonials, Footer — in that order
- Apply design system: Royal Gold (#C6A75E), Deep Black (#111111), Ivory White (#F9F6F1), Burgundy (#7A1E2C), Playfair Display headings, Poppins/Inter body, rounded-xl cards, soft shadows, gold gradient buttons, fade-in scroll animations
- Redesign header with a top utility bar (Choose Center selector, Contact Support, Become a Vendor button, Login/Register) and main nav (Jewellery, Bridal Sets, Party Wear, Designer Dresses, How It Works, Centers, Become Vendor) plus integrated search bar with product, center, and price range filters; sticky with mobile hamburger collapse
- Build Hero section as two-column layout with headline "Try Before You Rent - Luxury Jewellery & Designer Wear", subheading, Book Trial and Explore Collection CTAs, hero banner image on gold gradient right side, and a countdown timer for limited-time offer
- Build Trust Strip as 4-column icon row: Sanitized & Verified, Secure Deposit Protection, Physical Trial Available, Safe Payments
- Build Featured Categories as 4-column card grid (Bridal Jewellery, Wedding Lehenga, Party Wear Jewellery, Designer Gowns) with hover zoom and gold border glow
- Build How It Works as 4-step horizontal timeline with connector lines (Vendor Sends to Center → Book Trial at Center → Select & Pay → Sanitized & Delivered) and a "Book Your Trial Today" CTA
- Build Trending Products grid (3–4 columns) with product image, rental price/day, deposit, center name, Book Trial button, Last Sanitized date, and Most Booked badge; seeded with mock data
- Build Nearest Centers card grid showing at least 4 demo centers with name, address, available products count, trial slots count, and Visit Center button
- Build Vendor Promotion full-width panel with headline "Own Premium Collection? Earn with Us.", Become Vendor and Learn More CTAs, and three benefit highlights (Commission Benefits, Secure Inventory Management, Transparent Payout)
- Build Customer Testimonials auto-playing carousel with 4+ demo slides (avatar, name, star rating, testimonial text, product name) and prev/next controls
- Redesign footer with five link columns (About Us, Platform, For Business, Legal, Contact Us), bottom bar with payment icons, GST info, company address, and social media icons
- Add conversion elements: sticky Book Trial floating button (mobile), WhatsApp FAB (bottom-right), Recently Booked toast notification (appears ~5s after load), and hero countdown timer
- Apply mobile-first responsive layouts, lazy loading on all images, SEO meta tags (title, description, Open Graph), and JSON-LD product schema structured data

**User-visible outcome:** Visitors see a fully redesigned luxury home page with a premium header, ten content sections, and conversion elements including a countdown timer, floating buttons, and a social-proof toast notification, all fully responsive across mobile, tablet, and desktop.
