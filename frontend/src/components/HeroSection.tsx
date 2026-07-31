import React from 'react';
import { Container } from './ui/Container';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { ScrollReveal } from './ui/ScrollReveal';

export const HeroSection: React.FC = () => {
  return (
    <section
      id="home"
      style={{
        paddingTop: '6rem',
        paddingBottom: '6.5rem',
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff',
      }}
    >
      {/* Blurred Background Image Layer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url('/library-hero-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          transform: 'scale(1.08)',
          zIndex: 0,
        }}
      />

      {/* Dark & Green Overlay Gradient */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(21, 128, 61, 0.84) 100%)',
          zIndex: 1,
        }}
      />

      {/* Foreground Hero Content Container */}
      <Container style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            maxWidth: '720px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1.75rem',
          }}
        >
          <ScrollReveal direction="up" delay={0}>
            <Badge
              variant="pill"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.35)',
                backdropFilter: 'blur(6px)',
              }}
            >
              🏛️ Balingasag Municipal Public Library • Est. 1991
            </Badge>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
              }}
            >
              Borrow. Read. Grow. — <span style={{ color: '#86efac' }}>All in One Place</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <p
              style={{
                fontSize: '1.2rem',
                color: '#f8fafc',
                opacity: 0.95,
                lineHeight: 1.65,
                maxWidth: '640px',
              }}
            >
              Welcome to the official digital portal of Balingasag Municipal Public Library. Explore thousands of books, reserve physical titles online, manage your membership card, and access municipal learning resources.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                gap: '1.25rem',
                paddingTop: '0.5rem',
              }}
            >
              <Button variant="primary" size="lg" asAnchor href="#register">
                Get Started
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
            </div>
          </ScrollReveal>

          {/* Micro stats under CTAs */}
          <ScrollReveal direction="up" delay={400} style={{ width: '100%' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '2.5rem',
                paddingTop: '1.75rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.22)',
                marginTop: '1rem',
                width: '100%',
                maxWidth: '560px',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.5rem', color: '#86efac' }}>5,000+</div>
                <div style={{ fontSize: '0.875rem', color: '#f8fafc', opacity: 0.85 }}>Titles Available</div>
              </div>
              <div style={{ width: '1px', height: '2.25rem', backgroundColor: 'rgba(255, 255, 255, 0.22)' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.5rem', color: '#86efac' }}>Free</div>
                <div style={{ fontSize: '0.875rem', color: '#f8fafc', opacity: 0.85 }}>Municipal Access</div>
              </div>
              <div style={{ width: '1px', height: '2.25rem', backgroundColor: 'rgba(255, 255, 255, 0.22)' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.5rem', color: '#86efac' }}>Instant</div>
                <div style={{ fontSize: '0.875rem', color: '#f8fafc', opacity: 0.85 }}>Book Holds</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
};
