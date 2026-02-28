import React, { useState, useEffect, useRef, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    avatar: "PS",
    rating: 5,
    text: "Absolutely stunning experience! I rented the Kundan bridal set for my wedding and it was perfect. The trial at the Bandra center was so helpful — I could try multiple sets before deciding. Fully sanitized and delivered on time!",
    product: "Kundan Bridal Necklace Set",
    type: "Bridal Review",
  },
  {
    id: 2,
    name: "Ananya Reddy",
    location: "Hyderabad",
    avatar: "AR",
    rating: 5,
    text: "The trial experience at Jubilee Hills center was exceptional. The staff was knowledgeable and helped me pick the perfect lehenga for my reception. The sanitization certificate gave me complete peace of mind.",
    product: "Designer Bridal Lehenga",
    type: "Trial Experience",
  },
  {
    id: 3,
    name: "Meera Patel",
    location: "Bangalore",
    avatar: "MP",
    rating: 5,
    text: "I was skeptical about renting jewellery but LuxeRent changed my mind completely. The Polki set was in pristine condition, beautifully packaged, and the deposit was refunded within 2 days of return. Highly recommend!",
    product: "Polki Party Wear Set",
    type: "Center Experience",
  },
  {
    id: 4,
    name: "Kavitha Nair",
    location: "Chennai",
    avatar: "KN",
    rating: 5,
    text: "Saved ₹2 lakhs by renting instead of buying! The Anarkali gown was exactly as shown, and the trial at T. Nagar center was a wonderful experience. The team was professional and the process was seamless.",
    product: "Anarkali Designer Gown",
    type: "Bridal Review",
  },
  {
    id: 5,
    name: "Deepika Singh",
    location: "Delhi",
    avatar: "DS",
    rating: 5,
    text: "The Connaught Place center has an amazing collection. I visited for a trial and ended up booking 3 different sets for my wedding functions. The sanitization process is thorough and transparent. 10/10!",
    product: "Silk Banarasi Lehenga",
    type: "Trial Experience",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const goTo = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setIsAnimating(false);
    }, 300);
  }, [isAnimating]);

  const next = useCallback(() => {
    goTo((current + 1) % TESTIMONIALS.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, [current, goTo]);

  useEffect(() => {
    intervalRef.current = setInterval(next, 4500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [next]);

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, 4500);
  };

  const handlePrev = () => { prev(); resetInterval(); };
  const handleNext = () => { next(); resetInterval(); };

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

  const testimonial = TESTIMONIALS[current];

  return (
    <section ref={sectionRef} className="py-20 bg-ivory-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="animate-on-scroll text-center mb-12">
          <span className="text-royal-gold text-xs font-semibold uppercase tracking-widest">
            ✦ Real Stories
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-deep-black mt-2 mb-3">
            What Our Brides Say
          </h2>
          <p className="text-deep-black/55 max-w-xl mx-auto font-poppins">
            Thousands of happy customers have trusted LuxeRent for their most special occasions.
          </p>
        </div>

        {/* Carousel */}
        <div className="animate-on-scroll relative">
          <div
            className={`bg-white rounded-2xl p-8 sm:p-12 luxury-shadow-lg border border-royal-gold/10 transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}
          >
            {/* Quote icon */}
            <Quote className="w-10 h-10 text-royal-gold/20 mb-6" />

            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-royal-gold text-royal-gold" />
              ))}
            </div>

            {/* Text */}
            <p className="text-deep-black/70 text-lg leading-relaxed font-poppins mb-8 italic">
              "{testimonial.text}"
            </p>

            {/* Author */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center">
                  <span className="font-playfair font-bold text-deep-black text-sm">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <p className="font-playfair font-bold text-deep-black">{testimonial.name}</p>
                  <p className="text-deep-black/50 text-sm">{testimonial.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-royal-gold-dark text-sm font-semibold">{testimonial.product}</p>
                <p className="text-deep-black/40 text-xs">{testimonial.type}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border-2 border-royal-gold/30 flex items-center justify-center text-royal-gold hover:bg-royal-gold hover:text-deep-black transition-all duration-200"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { goTo(i); resetInterval(); }}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-6 h-2.5 bg-royal-gold"
                      : "w-2.5 h-2.5 bg-royal-gold/30 hover:bg-royal-gold/60"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border-2 border-royal-gold/30 flex items-center justify-center text-royal-gold hover:bg-royal-gold hover:text-deep-black transition-all duration-200"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
