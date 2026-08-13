import type { HTMLAttributes } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { cn } from '../../utils/cn';

type RevealDirection = 'up' | 'left' | 'right';

const HIDDEN_TRANSFORM: Record<RevealDirection, string> = {
  up: 'translate-y-6',
  left: '-translate-x-6',
  right: 'translate-x-6',
};

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  /** Stagger multiple Reveals (e.g. cards in a grid) by passing index * ~80. */
  delayMs?: number;
  direction?: RevealDirection;
}

/** Fades + slides an element in the first time it scrolls into view. A transparent
 *  wrapper — extra props (role, aria-label, id, ...) pass straight through to the div. */
export function Reveal({ children, className, delayMs = 0, direction = 'up', style, ...rest }: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        visible ? 'translate-x-0 translate-y-0 opacity-100' : cn('opacity-0', HIDDEN_TRANSFORM[direction]),
        className,
      )}
      style={{ ...style, ...(visible && delayMs ? { transitionDelay: `${delayMs}ms` } : undefined) }}
      {...rest}
    >
      {children}
    </div>
  );
}
