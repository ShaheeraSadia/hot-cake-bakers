import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroSlide } from '../data/menuData';
import { MenuCategory } from '../types/bakery';
import { ResilientImage } from './ResilientImage';

interface HeroCarouselProps {
  slides: HeroSlide[];
  intervalMs?: number;
  onSelectCategory?: (category: MenuCategory) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides,
  intervalMs = 5000,
  onSelectCategory,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slideCount = slides.length;

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  useEffect(() => {
    if (slideCount <= 1 || isPaused) return;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const timer = window.setInterval(goToNext, intervalMs);
    return () => window.clearInterval(timer);
  }, [slideCount, isPaused, intervalMs, goToNext]);

  if (slideCount === 0) return null;

  const currentSlide = slides[activeIndex];

  return (
    <div
      className="relative h-full min-h-[320px] sm:min-h-[380px] lg:min-h-[430px] aspect-[4/3] lg:aspect-auto rounded-xl overflow-hidden border border-[#E5E1DA] dark:border-[#342D28] bg-[#1C1815] group"
      role="region"
      aria-roledescription="carousel"
      aria-label="Hot Cake Bakers specialty showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      {slides.map((slide, idx) => {
        const isActive = idx === activeIndex;
        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-500 ease-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <ResilientImage
              src={slide.image}
              alt={slide.alt}
              fallbackTitle={slide.title}
              loading={idx === 0 ? 'eager' : 'lazy'}
              className="w-full h-full object-cover"
            />
          </div>
        );
      })}

      {/* Measured contrast scrim for overlaid typography */}
      <div
        className="absolute inset-x-0 bottom-0 h-44 sm:h-48 bg-gradient-to-t from-black/85 via-black/45 to-transparent z-20 pointer-events-none"
        aria-hidden="true"
      />

      {/* Previous / Next controls */}
      <div className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 z-30 flex items-center gap-1.5">
        <button
          type="button"
          onClick={goToPrev}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-black/55 hover:bg-black/75 text-white border border-white/15 backdrop-blur-xs flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Previous specialty photo"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={goToNext}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-black/55 hover:bg-black/75 text-white border border-white/15 backdrop-blur-xs flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Next specialty photo"
        >
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Bottom caption & slide indicators */}
      <div className="absolute inset-x-0 bottom-0 z-30 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-4 text-white">
        <div className="space-y-0.5 sm:space-y-1 min-w-0">
          <p className="text-xs text-white/85 truncate">{currentSlide.kicker}</p>
          {onSelectCategory ? (
            <a
              href="#menu"
              onClick={() => onSelectCategory(currentSlide.category)}
              className="inline-block font-display text-lg sm:text-2xl font-semibold text-white hover:underline underline-offset-4 leading-snug focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {currentSlide.title}
            </a>
          ) : (
            <p className="font-display text-lg sm:text-2xl font-semibold text-white leading-snug">
              {currentSlide.title}
            </p>
          )}
          <p className="font-urdu text-xs sm:text-sm text-white/90" dir="rtl" lang="ur">
            {currentSlide.urduTitle}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-medium text-white/85 tabular-nums">
            {String(activeIndex + 1).padStart(2, '0')} / {String(slideCount).padStart(2, '0')}
          </span>
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Choose specialty photo">
            {slides.map((slide, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`Show ${slide.title}`}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    isSelected ? 'w-6 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/75'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
