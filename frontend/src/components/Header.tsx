import React, { useState, useEffect } from 'react';
import { Container } from './ui/Container';
import { Button } from './ui/Button';

export const Header: React.FC = () => {
  const [activeTab, setActiveTab] = useState('HOME');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'HOME', href: '#home' },
    { name: 'SERVICES', href: '#catalog' },
    { name: 'HOW TO ACCESS', href: '#how-it-works' },
    { name: 'ABOUT US', href: '#about' },
    { name: 'CONTACT US', href: '#contact' },
  ];

  // Scroll spy effect to update active tab based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for header height

      // Find which section is currently in view
      for (const item of navItems) {
        const section = document.querySelector(item.href) as HTMLElement;
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveTab(item.name);
            break;
          }
        }
      }
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--color-soft-gray-border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <Container>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '5.5rem',
          }}
        >
          {/* Left: Official Circular Seal Logo + Title */}
          <a
            href="#home"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              textDecoration: 'none',
            }}
          >
            <img
              src="/library-logo.png"
              alt="Balingasag Municipal Library Logo"
              style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '50%',
                objectFit: 'cover',
                boxShadow: 'var(--shadow-sm)',
              }}
            />
            <div>
              <div
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  lineHeight: 1.1,
                }}
              >
                Balingasag Municipal
              </div>
              <div
                style={{
                  fontSize: '1.1875rem',
                  fontWeight: 800,
                  color: 'var(--color-neutral-dark)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                PUBLIC LIBRARY
              </div>
            </div>
          </a>

          {/* Center: Navigation Links (Desktop) */}
          <nav
            aria-label="Main Navigation"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2.25rem',
            }}
            className="desktop-nav"
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setActiveTab(item.name)}
                  style={{
                    position: 'relative',
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: isActive ? 'var(--color-primary)' : 'var(--color-neutral-dark)',
                    padding: '0.5rem 0',
                    transition: 'color var(--transition-fast)',
                    textDecoration: 'none',
                  }}
                >
                  {item.name}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        left: 0,
                        right: 0,
                        height: '3px',
                        backgroundColor: 'var(--color-primary)',
                        borderRadius: 'var(--radius-full)',
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right: Auth Buttons & Hamburger Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <Button variant="outline" size="md" asAnchor href="#login">
              Sign In
            </Button>
            <Button variant="primary" size="md" asAnchor href="#register">
              Create Account
            </Button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              className="mobile-hamburger-btn"
              style={{
                display: 'none',
                padding: '0.625rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-soft-gray-border)',
                color: 'var(--color-neutral-dark)',
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                {isMobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            style={{
              borderTop: '1px solid var(--color-soft-gray-border)',
              padding: '1.25rem 0',
              backgroundColor: '#ffffff',
            }}
            className="mobile-menu-drawer"
          >
            <nav
              aria-label="Mobile Navigation"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
              }}
            >
              {navItems.map((item) => {
                const isActive = activeTab === item.name;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => {
                      setActiveTab(item.name);
                      setIsMobileMenuOpen(false);
                    }}
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: isActive ? 'var(--color-primary)' : 'var(--color-neutral-dark)',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isActive ? 'var(--color-soft-gray-bg)' : 'transparent',
                      borderLeft: isActive ? '4px solid var(--color-primary)' : '4px solid transparent',
                    }}
                  >
                    {item.name}
                  </a>
                );
              })}
            </nav>
          </div>
        )}
      </Container>

      {/* Responsive Styles Injection */}
      <style>{`
        @media (max-width: 960px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-hamburger-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};
