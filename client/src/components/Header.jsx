import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import BestSellerProducts from "./BestSellerProducts";
import Newsletter from "./Newsletter";
import CollectionsSection from "./CollectionsSection";
import couple from "../assets/couple.jpg";
import img from "../assets/header.png";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Header() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      image: img,
      title: "Image1",
    },
    {
      image: couple,
      title: "Image2",
    },
  ];

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const [showUp, setShowUp] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("#hero-section");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowUp(!entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <section className="min-h-screen sm:min-h-[80vh] lg:min-h-screen flex justify-center items-center p-2 sm:p-4 md:p-8 relative">
        <div
          className="relative inline-block w-full mt-2 sm:mt-2 lg:mt-2 max-w-7xl"
          id="hero-section"
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`transition-opacity duration-500 ${
                index === currentIndex
                  ? "opacity-100"
                  : "opacity-0 absolute inset-0"
              }`}
            >
              <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen">
                <img
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  className="object-cover w-full h-full"
                />

                <div
                  className={`absolute inset-0 flex flex-col justify-center items-center text-center px-3 sm:px-4 md:px-6 ${
                    index === 1 ? "text-white" : ""
                  }`}
                >
                  <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 md:mb-6">
                    Modern Essentials. Timeless Elegance.
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base lg:text-xl font-light px-2 sm:px-4">
                    Modern essentials, thoughtfully curated for the conscious
                    wardrobe.
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute text-white left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1 sm:p-2 transition-all z-10 hover:bg-black/20 rounded-full"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white p-1 sm:p-2 transition-all z-10 hover:bg-black/20 rounded-full"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>

          {/* Indicator Dots */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 sm:w-2 sm:h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-white w-6 sm:w-8"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      <CollectionsSection />
      {/* Best Sellers */}
      <BestSellerProducts />
      {/* Newsletter */}
      <Newsletter />

      {showUp && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="fixed right-6 bottom-20 text-white bg-black py-2 px-4 rounded-full"
        >
          &#8593;
        </button>
      )}
    </main>
  );
}
