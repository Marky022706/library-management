import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { cn } from '../../utils/cn';
import { LANDING_NAV_ITEMS } from './navConfig';

interface MobileMenuProps {
  open: boolean;
  activeId: string;
  onNavigate: (id: string) => (e: MouseEvent) => void;
  onClose: () => void;
}

export function MobileMenu({ open, activeId, onNavigate, onClose }: MobileMenuProps) {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        'grid overflow-hidden border-t border-line bg-white transition-[grid-template-rows] duration-300 ease-out lg:hidden',
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
      )}
    >
      <div className="min-h-0">
        <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile primary">
          {LANDING_NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={onNavigate(item.id)}
              aria-current={activeId === item.id ? 'page' : undefined}
              className={cn(
                'rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-wide',
                activeId === item.id ? 'bg-primary-50 text-primary-700' : 'text-muted hover:bg-gray-50 hover:text-ink',
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-col gap-2 border-t border-line px-4 py-4">
          <Button
            variant="outline"
            className="w-full justify-center"
            onClick={() => {
              onClose();
              navigate('/login');
            }}
          >
            Sign In
          </Button>
          <Button
            className="w-full justify-center"
            onClick={() => {
              onClose();
              navigate('/register');
            }}
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
}
