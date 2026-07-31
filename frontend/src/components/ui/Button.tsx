import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  asAnchor?: boolean;
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  asAnchor = false,
  href,
  style,
  ...props
}) => {
  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontWeight: 600,
      borderRadius: 'var(--radius-md)',
      transition: 'all var(--transition-fast)',
      textDecoration: 'none',
      cursor: 'pointer',
      fontSize: size === 'sm' ? '0.875rem' : size === 'lg' ? '1.125rem' : '1rem',
      padding: size === 'sm' ? '0.5rem 1rem' : size === 'lg' ? '0.875rem 1.75rem' : '0.625rem 1.25rem',
    };

    if (variant === 'primary') {
      return {
        ...base,
        backgroundColor: 'var(--color-primary)',
        color: '#ffffff',
        border: '1px solid var(--color-primary)',
        boxShadow: 'var(--shadow-sm)',
        ...style,
      };
    }

    if (variant === 'outline') {
      return {
        ...base,
        backgroundColor: 'transparent',
        color: 'var(--color-primary)',
        border: '1.5px solid var(--color-primary)',
        ...style,
      };
    }

    // Subtle variant
    return {
      ...base,
      backgroundColor: 'transparent',
      color: 'var(--color-neutral-dark)',
      border: '1.5px solid var(--color-soft-gray-border)',
      ...style,
    };
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    if (variant === 'primary') {
      target.style.backgroundColor = 'var(--color-primary-hover)';
      target.style.borderColor = 'var(--color-primary-hover)';
    } else if (variant === 'outline') {
      target.style.backgroundColor = 'var(--color-soft-gray-bg)';
    } else {
      target.style.backgroundColor = 'var(--color-soft-gray-border)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    if (variant === 'primary') {
      target.style.backgroundColor = 'var(--color-primary)';
      target.style.borderColor = 'var(--color-primary)';
    } else if (variant === 'outline') {
      target.style.backgroundColor = 'transparent';
    } else {
      target.style.backgroundColor = 'transparent';
    }
  };

  if (asAnchor && href) {
    return (
      <a
        href={href}
        style={getStyles()}
        className={`btn btn-${variant} ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      style={getStyles()}
      className={`btn btn-${variant} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
};
