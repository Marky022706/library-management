import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Container: React.FC<ContainerProps> = ({ children, className = '', style }) => {
  return (
    <div
      className={`container ${className}`}
      style={{
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
