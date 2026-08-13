import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CarouselProps {
  images: string[];
  alt: string;
  intervalMs?: number;
  className?: string;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Auto-advancing photo slideshow — pauses on hover/focus, always keyboard/dot navigable. */
export function Carousel({ images, alt, intervalMs = 4000, className }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((next: number) => setIndex((next + images.length) % images.length), [images.length]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    if (paused || prefersReducedMotion() || images.length <= 1) return;
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % images.length), intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, images.length, intervalMs]);

  if (images.length === 0) return null;

  return (
    <div
      className={cn('group relative overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label={alt}
    >
      <div className="relative aspect-[4/3] w-full">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${alt} — photo ${i + 1} of ${images.length}`}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out',
              i === index ? 'opacity-100' : 'opacity-0',
            )}
            aria-hidden={i !== index}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={goPrev}
        aria-label="Previous photo"
        className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-white"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={goNext}
        aria-label="Next photo"
        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-white"
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to photo ${i + 1}`}
            aria-current={i === index}
            className={cn('h-1.5 rounded-full transition-all', i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/80')}
          />
        ))}
      </div>
    </div>
  );
}
