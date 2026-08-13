import { ArrowRight, Landmark } from 'lucide-react';
import { Button } from '../common/Button';
import { scrollToSection } from './navConfig';
import heroCollage from '../../assets/hero-collage.jpg';

const STATS = [
  { value: '5,000+', label: 'Titles Available' },
  { value: 'Free', label: 'Municipal Access' },
  { value: 'Instant', label: 'Book Holds' },
];

// Diagonal seam echoing the source photo's own green/photo split.
const BLUR_CLIP = 'polygon(0 0, 58% 0, 42% 100%, 0 100%)';

export function Hero() {
  return (
    <section id="home" aria-label="Welcome" className="relative overflow-hidden pb-16 pt-14 sm:pb-20 sm:pt-20">
      {/* Real event photography — sharp on the right; a blurred, tinted duplicate
          clipped over the left where the headline text sits, for legibility. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroCollage})` }}
        role="img"
        aria-label="Photos of Balingasag Municipal Public Library programs and community events"
      />
      {/* Mobile/tablet: no side-by-side photo column, so blur the whole backdrop for legibility. */}
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl lg:hidden"
        style={{ backgroundImage: `url(${heroCollage})` }}
        aria-hidden="true"
      />
      {/* Desktop: only blur the left side where the text sits, keeping the right photos sharp. */}
      <div
        className="absolute inset-0 hidden scale-110 bg-cover bg-center blur-2xl lg:block"
        style={{ backgroundImage: `url(${heroCollage})`, clipPath: BLUR_CLIP }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-deep/90 via-deep/60 to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-deep/50 via-transparent to-transparent" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-7 lg:grid-cols-2">
        <div className="max-w-[620px]">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
            <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
            BALINGASAG MUNICIPAL PUBLIC LIBRARY • EST. 1991
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-[64px]">
            Borrow. Read. Grow.
            <br />
            <span className="text-mint">All in One Place.</span>
          </h1>

          <p className="mt-5 max-w-[570px] text-lg leading-relaxed text-primary-50">
            Welcome to the official digital portal of Balingasag Municipal Public Library. Explore thousands of
            books, reserve physical titles online, manage your membership card, and access municipal learning
            resources.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button
              size="lg"
              icon={<ArrowRight className="h-5 w-5" aria-hidden="true" />}
              className="shadow-lg shadow-primary-950/20 transition-transform hover:-translate-y-0.5"
              onClick={() => scrollToSection('services')}
            >
              Get Started
            </Button>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="text-sm font-semibold text-white underline-offset-4 hover:text-mint hover:underline"
            >
              Explore Library →
            </button>
          </div>

          <dl className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/15 pt-6 sm:gap-10">
            {STATS.map((stat, index) => (
              <div key={stat.label} className={index > 0 ? 'border-l border-white/15 pl-6 sm:pl-10' : ''}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-2xl font-extrabold text-mint sm:text-3xl">{stat.value}</dd>
                <dd className="text-xs text-primary-50 sm:text-sm">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right column stays empty so the sharp photo shows through. */}
        <div aria-hidden="true" />
      </div>
    </section>
  );
}
