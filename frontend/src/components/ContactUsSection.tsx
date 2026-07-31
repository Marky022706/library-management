import React, { useState } from 'react';
import { Container } from './ui/Container';
import { Button } from './ui/Button';
import { ScrollReveal } from './ui/ScrollReveal';

export const ContactUsSection: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <section
      id="contact"
      style={{
        paddingTop: '5.5rem',
        paddingBottom: '5.5rem',
        backgroundColor: 'var(--color-soft-gray-bg)',
        borderTop: '1px solid var(--color-soft-gray-border)',
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
              Get In Touch
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
                fontWeight: 800,
                color: 'var(--color-neutral-dark)',
                letterSpacing: '-0.02em',
              }}
            >
              Contact Balingasag Municipal Public Library
            </h2>
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'var(--color-neutral-dark)',
                opacity: 0.82,
                lineHeight: 1.65,
              }}
            >
              Have questions regarding book reservations, library cards, or visiting hours? Reach out to our municipal desk.
            </p>
          </div>
        </ScrollReveal>

        {/* 2-Column Contact Info & Form */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Official Contact Information Cards */}
          <ScrollReveal direction="left" delay={100}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.75rem',
                  border: '1.5px solid var(--color-soft-gray-border)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-neutral-dark)' }}>
                  Library Information & Location
                </h3>

                {/* Address */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-soft-gray-bg)',
                      border: '1px solid var(--color-soft-gray-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-primary)',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-neutral-dark)' }}>
                      Physical Address
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.8, lineHeight: 1.5 }}>
                      Municipal Hall Compound, Balingasag, Misamis Oriental, 9005 Philippines
                    </div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-soft-gray-bg)',
                      border: '1px solid var(--color-soft-gray-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-primary)',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-neutral-dark)' }}>
                      Operating Hours
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.8, lineHeight: 1.5 }}>
                      Monday – Friday: 8:00 AM – 5:00 PM<br />
                      <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Closed on Weekends & Public Holidays</span>
                    </div>
                  </div>
                </div>

                {/* Email & Phone */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-soft-gray-bg)',
                      border: '1px solid var(--color-soft-gray-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-primary)',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-neutral-dark)' }}>
                      Contact Channels
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.8, lineHeight: 1.5 }}>
                      Email: <strong>library@balingasag.gov.ph</strong><br />
                      Phone: <strong>(088) 858-1234</strong> / <strong>+63 917 123 4567</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Municipal Official Badge Box */}
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#ffffff',
                  border: '1px dashed var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <img
                  src="/library-logo.png"
                  alt="Official Seal"
                  style={{ width: '3rem', height: '3rem', borderRadius: '50%' }}
                />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-neutral-dark)' }}>
                    Official Municipal Public Desk
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-dark)', opacity: 0.75 }}>
                    Prompt responses within 24 working hours.
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Contact Inquiry Form */}
          <ScrollReveal direction="right" delay={150}>
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '2.25rem',
                border: '1.5px solid var(--color-soft-gray-border)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {submitted ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '2.5rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: '3.5rem',
                      height: '3.5rem',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-neutral-dark)' }}>
                    Message Sent Successfully!
                  </h3>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--color-neutral-dark)', opacity: 0.8, maxWidth: '400px' }}>
                    Thank you for reaching out to Balingasag Municipal Library. Our staff will get back to you shortly.
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ fullName: '', email: '', subject: 'General Inquiry', message: '' });
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-neutral-dark)' }}>
                    Send Us a Message
                  </h3>

                  {/* Full Name Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <label
                      htmlFor="fullName"
                      style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-dark)' }}
                    >
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      placeholder="e.g. Juan Dela Cruz"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--color-soft-gray-border)',
                        fontSize: '0.9375rem',
                        fontFamily: 'var(--font-ui)',
                        color: 'var(--color-neutral-dark)',
                        backgroundColor: 'var(--color-soft-gray-bg)',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Email Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <label
                      htmlFor="email"
                      style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-dark)' }}
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="e.g. juan@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--color-soft-gray-border)',
                        fontSize: '0.9375rem',
                        fontFamily: 'var(--font-ui)',
                        color: 'var(--color-neutral-dark)',
                        backgroundColor: 'var(--color-soft-gray-bg)',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Subject Dropdown */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <label
                      htmlFor="subject"
                      style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-dark)' }}
                    >
                      Inquiry Type
                    </label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--color-soft-gray-border)',
                        fontSize: '0.9375rem',
                        fontFamily: 'var(--font-ui)',
                        color: 'var(--color-neutral-dark)',
                        backgroundColor: 'var(--color-soft-gray-bg)',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Book Reservation">Book Hold / Reservation</option>
                      <option value="Library Card">Library Card Application</option>
                      <option value="School Tour">School / Group Visit</option>
                    </select>
                  </div>

                  {/* Message Textarea */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <label
                      htmlFor="message"
                      style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-dark)' }}
                    >
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      placeholder="Type your inquiry or message here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--color-soft-gray-border)',
                        fontSize: '0.9375rem',
                        fontFamily: 'var(--font-ui)',
                        color: 'var(--color-neutral-dark)',
                        backgroundColor: 'var(--color-soft-gray-bg)',
                        outline: 'none',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button variant="primary" size="lg" type="submit" style={{ marginTop: '0.5rem' }}>
                    Send Message →
                  </Button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
};
