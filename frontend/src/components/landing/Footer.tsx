import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, MessageCircle, Share2 } from 'lucide-react';
import { scrollToSection } from './navConfig';
import { SupportModals, type SupportModalType } from './SupportModals';
import libraryLogo from '../../assets/library-logo.png';

interface FooterLink {
  label: string;
  action: () => void;
}

export function Footer() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<SupportModalType>(null);

  const goToLogin = () => navigate('/login');
  const goToRegister = () => navigate('/register');

  const columns: { title: string; links: FooterLink[] }[] = [
    {
      title: 'Library',
      links: [
        { label: 'Home', action: () => scrollToSection('home') },
        { label: 'Catalog', action: () => scrollToSection('books') },
        { label: 'Services', action: () => scrollToSection('services') },
        { label: 'About Us', action: () => scrollToSection('about') },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'How to Access', action: () => setActiveModal('how-to-access') },
        { label: 'FAQs', action: () => setActiveModal('faqs') },
        { label: 'Contact Us', action: () => setActiveModal('contact') },
        { label: 'Help Center', action: () => setActiveModal('help') },
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
    <>
      <footer className="border-t border-slate-800 bg-[#0f172a] text-slate-300">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-7">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <img src={libraryLogo} alt="Balingasag Municipal Library seal" className="h-11 w-11 shrink-0 object-contain" />
                <span className="text-base font-bold text-white tracking-tight">Balingasag Municipal Public Library</span>
              </div>
              <p className="mt-4 max-w-xs text-sm text-slate-400">Serving the Balingasag community since 1991.</p>
              <div className="mt-5 flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Library contact chat"
                  onClick={() => setActiveModal('contact')}
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                </button>
                <a
                  href="https://balingasag.gov.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Municipality of Balingasag official website"
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <Globe className="h-4 w-4" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  aria-label="Share library portal"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: 'Balingasag Public Library', url: window.location.href }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">{column.title}</h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <button
                        type="button"
                        onClick={link.action}
                        className="text-sm text-slate-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-6 sm:flex-row text-xs text-slate-500">
            <p>© 2026 Balingasag Municipal Public Library. All rights reserved.</p>
            <div className="flex gap-5">
              <button
                type="button"
                onClick={() => setActiveModal('privacy')}
                className="text-slate-400 transition-colors hover:text-white"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('terms')}
                className="text-slate-400 transition-colors hover:text-white"
              >
                Terms of Use
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Support Modals */}
      <SupportModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </>
  );
}
