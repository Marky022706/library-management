import React, { useState, useEffect } from 'react';
import { Container } from './ui/Container';
import { ScrollReveal } from './ui/ScrollReveal';

export const AboutUsSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      image: '/about-slide-1.jpg',
      tag: 'Collaborative Learning',
      title: 'Group Study & Reference Space',
      description: 'Students and researchers utilizing our extensive reference collections, quiet reading tables, and study resources.',
    },
    {
      image: '/about-slide-2.jpg',
      tag: 'Community Outreach',
      title: 'Outdoor Park Storytelling Sessions',
      description: 'Bringing literacy directly to children and families through interactive outdoor reading sessions in the municipal park.',
    },
    {
      image: '/about-slide-3.jpg',
      tag: 'Academic Collections',
      title: 'Comprehensive Reference & Research Library',
      description: 'Housing thousands of titles spanning philosophy, social sciences, generalities, fiction, and municipal archives.',
    },
    {
      image: '/about-slide-4.jpg',
      tag: "Children's Corner",
      title: 'Interactive Youth Reading Zone',
      description: 'A vibrant, welcoming space equipped with child-friendly mats, storybooks, and early literacy materials.',
    },
    {
      image: '/about-slide-5.jpg',
      tag: 'Tutorial Services',
      title: 'Guided Reading & Youth Tutorials',
      description: 'Dedicated library staff and volunteers mentoring students through structured reading assistance and study support.',
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, currentSlide]);

  return (
    <section
      id="about"
      style={{
        paddingTop: '5.5rem',
        paddingBottom: '5.5rem',
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--color-soft-gray-border)',
      }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <Container>
        {/* Section Header */}
        <ScrollReveal direction="down" delay={0}>
          <div
            style={{
              textAlign: 'center',
              maxWidth: '720px',
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
              About Us & Community Life
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
                fontWeight: 800,
                color: 'var(--color-neutral-dark)',
                letterSpacing: '-0.02em',
              }}
            >
              Serving Balingasag Since 1991
            </h2>
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'var(--color-neutral-dark)',
                opacity: 0.82,
                lineHeight: 1.65,
              }}
            >
              Balingasag Municipal Public Library is a vibrant hub for learning, community engagement, and youth literacy. Explore our facility and daily activities below.
            </p>
          </div>
        </ScrollReveal>

        {/* Main Slide Presentation Container with Zoom Scroll Reveal */}
        <ScrollReveal direction="zoom" delay={120}>
          <div
            style={{
              maxWidth: '1000px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            {/* Main Slide Viewer Frame */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '480px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '1.5px solid var(--color-soft-gray-border)',
                backgroundColor: 'var(--color-neutral-dark)',
              }}
            >
              {/* Slide Image */}
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'opacity 0.4s ease-in-out',
                }}
              />

              {/* Dark Gradient Overlay for Caption */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '2rem 2.25rem 1.75rem 2.25rem',
                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.5) 70%, transparent 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#86efac',
                      backgroundColor: 'rgba(10, 147, 60, 0.3)',
                      padding: '0.25rem 0.625rem',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid rgba(134, 239, 172, 0.4)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {slides[currentSlide].tag}
                  </span>

                  <span style={{ fontSize: '0.8125rem', opacity: 0.8, fontWeight: 600 }}>
                    {currentSlide + 1} / {slides.length}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginTop: '0.25rem' }}>
                  {slides[currentSlide].title}
                </h3>

                <p style={{ fontSize: '0.9375rem', color: '#f8fafc', opacity: 0.9, lineHeight: 1.5, maxWidth: '750px' }}>
                  {slides[currentSlide].description}
                </p>
              </div>

              {/* Left Prev Arrow Button */}
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                style={{
                  position: 'absolute',
                  left: '1.25rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  color: 'var(--color-neutral-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all var(--transition-fast)',
                  zIndex: 10,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
                  e.currentTarget.style.color = 'var(--color-neutral-dark)';
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Right Next Arrow Button */}
              <button
                onClick={nextSlide}
                aria-label="Next slide"
                style={{
                  position: 'absolute',
                  right: '1.25rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  color: 'var(--color-neutral-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all var(--transition-fast)',
                  zIndex: 10,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
                  e.currentTarget.style.color = 'var(--color-neutral-dark)';
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Thumbnail Strip Selection */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '0.875rem',
                marginTop: '0.5rem',
              }}
            >
              {slides.map((slide, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    style={{
                      height: '80px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: isActive ? '3px solid var(--color-primary)' : '2px solid var(--color-soft-gray-border)',
                      opacity: isActive ? 1 : 0.65,
                      transition: 'all var(--transition-fast)',
                      padding: 0,
                      cursor: 'pointer',
                      boxShadow: isActive ? 'var(--shadow-md)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.opacity = '0.65';
                    }}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
};
