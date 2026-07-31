import React from 'react';
import { Container } from './ui/Container';
import { FeatureCard } from './FeatureCard';
import { ScrollReveal } from './ui/ScrollReveal';

export const FeatureCards: React.FC = () => {
  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
      title: 'Online Catalog & Search',
      description: 'Search municipal collections by title, author, category, or ISBN. Check real-time shelf availability before visiting.',
      linkHref: '#catalog',
      direction: 'left' as const,
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ),
      title: 'Book Reservation System',
      description: 'Place holds on physical titles online. Receive instant notifications when your books are ready for counter pickup.',
      linkHref: '#how-it-works',
      direction: 'up' as const,
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="7" y1="8" x2="17" y2="8" />
          <line x1="7" y1="12" x2="13" y2="12" />
        </svg>
      ),
      title: 'Digital Library Card',
      description: 'Access your official municipal borrower barcode directly on your mobile device for fast, paperless checkouts.',
      linkHref: '#register',
      direction: 'up' as const,
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      title: 'Community Announcements',
      description: 'Stay informed on municipal literacy programs, book clubs, holiday operating schedules, and local history archives.',
      linkHref: '#about',
      direction: 'right' as const,
    },
  ];

  return (
    <section
      id="catalog"
      style={{
        paddingTop: '5.5rem',
        paddingBottom: '5.5rem',
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--color-soft-gray-border)',
        borderBottom: '1px solid var(--color-soft-gray-border)',
      }}
    >
      <Container>
        {/* Section Header */}
        <ScrollReveal direction="down" delay={0}>
          <div
            style={{
              textAlign: 'center',
              maxWidth: '680px',
              margin: '0 auto 3.5rem auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Digital Services
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                fontWeight: 800,
                color: 'var(--color-neutral-dark)',
                letterSpacing: '-0.02em',
              }}
            >
              Empowering Balingasag Readers & Learners
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--color-neutral-dark)',
                opacity: 0.8,
                lineHeight: 1.6,
              }}
            >
              Designed to make public library access effortless, reliable, and accessible to every citizen of Balingasag.
            </p>
          </div>
        </ScrollReveal>

        {/* 4-Card Grid with Dynamic Multi-Directional Scroll Reveal */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {features.map((feature, idx) => (
            <ScrollReveal key={idx} direction={feature.direction} delay={80 * idx}>
              <FeatureCard {...feature} />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
};
