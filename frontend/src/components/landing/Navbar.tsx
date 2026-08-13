import { useEffect, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../common/Button';
import { cn } from '../../utils/cn';
import { LANDING_NAV_ITEMS, LANDING_SECTION_IDS, scrollToSection } from './navConfig';
import { useActiveSection } from '../../hooks/useActiveSection';
import { MobileMenu } from './MobileMenu';
import libraryLogo from '../../assets/library-logo.png';

export function Navbar() {
  const navigate = useNavigate();
  const activeId = useActiveSection(LANDING_SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    scrollToSection(id);
    setMobileOpen(false);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-line bg-white transition-shadow',
        scrolled ? 'shadow-sm' : 'shadow-none',
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-[height] duration-200 sm:px-7',
          scrolled ? 'h-16' : 'h-20',
        )}
      >
        <a href="#home" onClick={handleNavClick('home')} className="flex min-w-0 items-center gap-3">
          <img src={libraryLogo} alt="Balingasag Municipal Library seal" className="h-11 w-11 shrink-0 object-contain" />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-xs font-bold uppercase tracking-wide text-primary-700 sm:text-sm">
              Balingasag Municipal
            </span>
            <span className="block truncate text-sm font-bold text-ink sm:text-base">Public Library</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {LANDING_NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={handleNavClick(item.id)}
              aria-current={activeId === item.id ? 'page' : undefined}
              className={cn(
                'relative px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary-600 after:transition-transform after:content-[""]',
                activeId === item.id
                  ? 'text-primary-700 after:scale-x-100'
                  : 'text-muted after:scale-x-0 hover:text-primary-700 hover:after:scale-x-100',
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="outline" onClick={() => navigate('/login')}>
            Sign In
          </Button>
          <Button onClick={() => navigate('/register')}>Create Account</Button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          className="rounded-lg p-2 text-ink hover:bg-gray-100 lg:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </div>

      <MobileMenu open={mobileOpen} activeId={activeId} onNavigate={handleNavClick} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
