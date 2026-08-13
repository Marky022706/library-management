import { ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';
import { Carousel } from './Carousel';
import { Reveal } from './Reveal';
import { scrollToSection } from './navConfig';

import about1 from '../../assets/about/about-1.jpg';
import about2 from '../../assets/about/about-2.jpg';
import about3 from '../../assets/about/about-3.jpg';
import about4 from '../../assets/about/about-4.jpg';
import about5 from '../../assets/about/about-5.jpg';
import about6 from '../../assets/about/about-6.jpg';
import about7 from '../../assets/about/about-7.jpg';
import about8 from '../../assets/about/about-8.jpg';

const ABOUT_PHOTOS = [about1, about2, about3, about4, about5, about6, about7, about8];

export function AboutLibrary() {
  return (
    <section id="about" aria-labelledby="about-heading" className="mx-auto max-w-7xl px-4 py-20 sm:px-7">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <Reveal direction="left" className="order-2 lg:order-1">
          <Carousel images={ABOUT_PHOTOS} alt="Balingasag Municipal Public Library programs and community activities" />
        </Reveal>

        <Reveal direction="right" delayMs={120} className="order-1 lg:order-2">
          <h2 id="about-heading" className="text-3xl font-extrabold text-ink sm:text-4xl">
            A Library for the Balingasag Community
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            For over three decades, Balingasag Municipal Public Library has provided residents with accessible
            educational resources, reading materials, and community learning opportunities. From students and
            teachers to researchers and lifelong learners, our doors — and now our digital portal — are open to
            everyone in the municipality.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            This digital service extends that same mission online: browse the catalog, manage your membership, and
            stay connected with what's happening at the library, wherever you are.
          </p>
          <Button
            variant="outline"
            icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
            className="mt-6"
            onClick={() => scrollToSection('contact')}
          >
            Learn More About Us
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
