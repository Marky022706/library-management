import React, { useState } from 'react';

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText?: string;
  linkHref?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  linkText = 'Learn more →',
  linkHref = '#',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#ffffff',
        border: `1.5px solid ${isHovered ? 'var(--color-primary)' : 'var(--color-soft-gray-border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        boxShadow: isHovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transition: 'all var(--transition-normal)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Icon Container */}
      <div
        style={{
          width: '3rem',
          height: '3rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-soft-gray-bg)',
          border: '1px solid var(--color-soft-gray-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-primary)',
          transition: 'all var(--transition-fast)',
        }}
      >
        {icon}
      </div>

      {/* Card Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
        <h3
          style={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'var(--color-neutral-dark)',
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-neutral-dark)',
            opacity: 0.8,
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </div>

      {/* Action Link */}
      <a
        href={linkHref}
        style={{
          fontSize: '0.875rem',
          fontWeight: 700,
          color: 'var(--color-primary)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          textDecoration: 'none',
          marginTop: '0.5rem',
        }}
      >
        {linkText}
      </a>
    </div>
  );
};
