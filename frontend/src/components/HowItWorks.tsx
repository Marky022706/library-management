import React from 'react';
import { Container } from './ui/Container';
import { Badge } from './ui/Badge';
import { ScrollReveal } from './ui/ScrollReveal';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '1',
      title: 'Create Your Account',
      description: 'Register online with your resident or student details to instantly generate your digital library membership ID.',
      direction: 'left' as const,
    },
    {
      number: '2',
      title: 'Browse & Reserve Titles',
      description: 'Explore the digital catalog, select your desired physical books, and reserve them with a single click.',
      direction: 'zoom' as const,
    },
    {
      number: '3',
      title: 'Visit & Collect',
      description: 'Drop by the Balingasag Municipal Library counter during operating hours to collect your reserved books.',
      direction: 'right' as const,
    },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        paddingTop: '5.5rem',
        paddingBottom: '5.5rem',
        backgroundColor: 'var(--color-soft-gray-bg)',
      }}
    >
      <Container>
        {/* Section Header */}
        <ScrollReveal direction="down" delay={0}>
          <div
            style={{
              textAlign: 'center',
              maxWidth: '640px',
              margin: '0 auto 4rem auto',
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
              Simple Onboarding
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                fontWeight: 800,
                color: 'var(--color-neutral-dark)',
                letterSpacing: '-0.02em',
              }}
            >
              How to Access Municipal Library Services
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--color-neutral-dark)',
                opacity: 0.8,
                lineHeight: 1.6,
              }}
            >
              Get started in 3 simple steps — no complicated paperwork required.
            </p>
          </div>
        </ScrollReveal>

        {/* 3-Step Stepper Flow with Dynamic Scroll Animations */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            position: 'relative',
          }}
        >
          {steps.map((step, idx) => (
            <ScrollReveal key={idx} direction={step.direction} delay={100 * idx}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1.5px solid var(--color-soft-gray-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative',
                  height: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Badge variant="step">{step.number}</Badge>
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      backgroundColor: 'var(--color-soft-gray-bg)',
                      padding: '0.25rem 0.625rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-soft-gray-border)',
                    }}
                  >
                    STEP 0{step.number}
                  </span>
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'var(--color-neutral-dark)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.9375rem',
                      color: 'var(--color-neutral-dark)',
                      opacity: 0.8,
                      lineHeight: 1.6,
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
};
