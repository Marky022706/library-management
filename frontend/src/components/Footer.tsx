import React from 'react';
import { Container } from './ui/Container';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-neutral-dark)',
        borderTop: '4px solid var(--color-primary)',
        paddingTop: '4.5rem',
        paddingBottom: '2.75rem',
        color: '#ffffff',
      }}
    >
      <Container>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            paddingBottom: '3.5rem',
            borderBottom: '1px solid rgba(226, 232, 240, 0.15)',
          }}
        >
          {/* Col 1: Brand & Mission */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div
                style={{
                  padding: '3px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '50%',
                  display: 'inline-flex',
                }}
              >
                <img
                  src="/library-logo.png"
                  alt="Balingasag Municipal Library Logo"
                  style={{
                    width: '2.75rem',
                    height: '2.75rem',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Balingasag Municipal
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.0625rem', color: '#ffffff' }}>
                  PUBLIC LIBRARY
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#f8fafc', opacity: 0.85, lineHeight: 1.65 }}>
              Providing free, equitable access to literature, educational resources, research facilities, and digital learning tools for the citizens of Balingasag.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#86efac',
                  backgroundColor: 'rgba(10, 147, 60, 0.25)',
                  padding: '0.25rem 0.625rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(134, 239, 172, 0.3)',
                }}
              >
                🏛️ ESTABLISHED 1991
              </span>
            </div>
          </div>

          {/* Col 2: Quick Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#86efac', letterSpacing: '0.02em' }}>
              Quick Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <a
                href="#home"
                style={{ fontSize: '0.875rem', color: '#f8fafc', opacity: 0.85, textDecoration: 'none', transition: 'color var(--transition-fast)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#86efac'; e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.opacity = '0.85'; }}
              >
                → Home
              </a>
              <a
                href="#catalog"
                style={{ fontSize: '0.875rem', color: '#f8fafc', opacity: 0.85, textDecoration: 'none', transition: 'color var(--transition-fast)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#86efac'; e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.opacity = '0.85'; }}
              >
                → Services & Catalog
              </a>
              <a
                href="#how-it-works"
                style={{ fontSize: '0.875rem', color: '#f8fafc', opacity: 0.85, textDecoration: 'none', transition: 'color var(--transition-fast)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#86efac'; e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.opacity = '0.85'; }}
              >
                → How to Access
              </a>
              <a
                href="#about"
                style={{ fontSize: '0.875rem', color: '#f8fafc', opacity: 0.85, textDecoration: 'none', transition: 'color var(--transition-fast)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#86efac'; e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.opacity = '0.85'; }}
              >
                → About Us Gallery
              </a>
              <a
                href="#contact"
                style={{ fontSize: '0.875rem', color: '#f8fafc', opacity: 0.85, textDecoration: 'none', transition: 'color var(--transition-fast)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#86efac'; e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.opacity = '0.85'; }}
              >
                → Contact Us
              </a>
            </div>
          </div>

          {/* Col 3: Hours & Official Contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#86efac', letterSpacing: '0.02em' }}>
              Library Information
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#f8fafc', opacity: 0.88 }}>
              <div>
                <span style={{ color: '#86efac', fontWeight: 700 }}>🕒 Operating Hours:</span><br />
                Mon – Fri: 8:00 AM – 5:00 PM
              </div>
              <div>
                <span style={{ color: '#86efac', fontWeight: 700 }}>📍 Location:</span><br />
                Municipal Hall Compound, Balingasag, Misamis Oriental
              </div>
              <div>
                <span style={{ color: '#86efac', fontWeight: 700 }}>📧 Email:</span><br />
                library@balingasag.gov.ph
              </div>
            </div>
          </div>

          {/* Col 4: Interactive Find Us Map Location for Balingasag Library */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#86efac', letterSpacing: '0.02em' }}>
              📍 Find Us Map
            </h4>
            <div
              style={{
                width: '100%',
                height: '160px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1.5px solid rgba(134, 239, 172, 0.35)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <iframe
                title="Balingasag Municipal Public Library Map"
                src="https://maps.google.com/maps?q=Balingasag%20Municipal%20Public%20Library%2C%20Balingasag%2C%20Misamis%20Oriental&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href="https://maps.google.com/?q=Balingasag+Municipal+Public+Library+Misamis+Oriental"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#86efac',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              Open Balingasag Library Map ↗
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            paddingTop: '2rem',
            fontSize: '0.8125rem',
            color: '#f8fafc',
            opacity: 0.75,
          }}
        >
          <div>
            © 1991 - 2026 Balingasag Municipal Public Library. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a
              href="#privacy"
              style={{ textDecoration: 'none', color: '#f8fafc' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#86efac')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#f8fafc')}
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              style={{ textDecoration: 'none', color: '#f8fafc' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#86efac')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#f8fafc')}
            >
              Terms of Service
            </a>
            <a
              href="#accessibility"
              style={{ textDecoration: 'none', color: '#f8fafc' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#86efac')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#f8fafc')}
            >
              Accessibility Statement
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};
