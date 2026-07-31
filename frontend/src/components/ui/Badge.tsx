import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'pill' | 'step';
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'pill', style }) => {
  if (variant === 'step') {
    return (
      <div
        style={{
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-primary)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '1rem',
          boxShadow: 'var(--shadow-sm)',
          flexShrink: 0,
          ...style,
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.25rem 0.75rem',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-soft-gray-border)',
        color: 'var(--color-primary)',
        fontWeight: 600,
        fontSize: '0.8125rem',
        letterSpacing: '0.025em',
        textTransform: 'uppercase',
        border: '1px solid rgba(21, 128, 61, 0.15)',
        ...style,
      }}
    >
      {children}
    </span>
  );
};
