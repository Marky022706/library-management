export interface LandingNavItem {
  id: string;
  label: string;
}

// Module-level constant so the array reference is stable across renders —
// useActiveSection's IntersectionObserver setup depends on that.
export const LANDING_NAV_ITEMS: LandingNavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'how-to-access', label: 'How to Access' },
  { id: 'about', label: 'About Us' },
  { id: 'contact', label: 'Contact Us' },
];

export const LANDING_SECTION_IDS = LANDING_NAV_ITEMS.map((item) => item.id);

export function scrollToSection(id: string) {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}
