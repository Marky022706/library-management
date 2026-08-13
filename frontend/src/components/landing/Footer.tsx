import { useNavigate } from 'react-router-dom';
import { Globe, MessageCircle, Share2 } from 'lucide-react';
import { scrollToSection } from './navConfig';
import libraryLogo from '../../assets/library-logo.png';

interface FooterLink {
  label: string;
  action: () => void;
}

export function Footer() {
  const navigate = useNavigate();
  const goToLogin = () => navigate('/login');
  const goToRegister = () => navigate('/register');

  const columns: { title: string; links: FooterLink[] }[] = [
    {
      title: 'Library',
      links: [
        { label: 'Home', action: () => scrollToSection('home') },
        { label: 'Catalog', action: () => scrollToSection('contact') },
        { label: 'Services', action: () => scrollToSection('services') },
        { label: 'About Us', action: () => scrollToSection('about') },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'How to Access', action: () => scrollToSection('how-to-access') },
        { label: 'FAQs', action: () => scrollToSection('contact') },
        { label: 'Contact Us', action: () => scrollToSection('contact') },
        { label: 'Help Center', action: () => scrollToSection('contact') },
      ],
    },
    {
      title: 'Account',
      links: [
        { label: 'Sign In', action: goToLogin },
        { label: 'Create Account', action: goToRegister },
        { label: 'My Library', action: goToLogin },
      ],
    },
  ];

  return (
    <footer className="bg-deep text-primary-50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-7">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src={libraryLogo} alt="Balingasag Municipal Library seal" className="h-11 w-11 shrink-0 object-contain" />
              <span className="text-base font-bold text-white">Balingasag Municipal Public Library</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-primary-100">Serving the Balingasag community since 1991.</p>
            <div className="mt-5 flex items-center gap-2">
              <a href="#contact" aria-label="Library social updates" onClick={(e) => e.preventDefault()} className="rounded-full p-2 hover:bg-white/10">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="#contact" aria-label="Library website" onClick={(e) => e.preventDefault()} className="rounded-full p-2 hover:bg-white/10">
                <Globe className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="#contact" aria-label="Share the library portal" onClick={(e) => e.preventDefault()} className="rounded-full p-2 hover:bg-white/10">
                <Share2 className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-sm font-bold uppercase tracking-wide text-white">{column.title}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <button type="button" onClick={link.action} className="text-sm text-primary-100 hover:text-mint">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 sm:flex-row">
          <p className="text-xs text-primary-100">© 2026 Balingasag Municipal Public Library. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#contact" onClick={(e) => e.preventDefault()} className="text-xs text-primary-100 hover:text-mint">
              Privacy Policy
            </a>
            <a href="#contact" onClick={(e) => e.preventDefault()} className="text-xs text-primary-100 hover:text-mint">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
