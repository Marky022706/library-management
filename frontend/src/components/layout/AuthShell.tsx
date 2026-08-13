import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import libraryLogo from '../../assets/library-logo.png';

interface AuthStat {
  value: string;
  label: string;
}

const STATS: AuthStat[] = [
  { value: '10K+', label: 'Books' },
  { value: '100%', label: 'Secure' },
  { value: '24/7', label: 'Access' },
];

interface AuthShellProps {
  /** Big headline on the decorative panel, e.g. "Welcome Back." */
  headline: string;
  tagline: string;
  /** Heading above the form itself, e.g. "Sign In" */
  title: string;
  subtitle: string;
  children: ReactNode;
  /** Small link/prompt rendered below the form, e.g. "Don't have an account? Sign up" */
  footer?: ReactNode;
}

/** Shared split-screen shell for the Sign In / Sign Up pages. */
export function AuthShell({ headline, tagline, title, subtitle, children, footer }: AuthShellProps) {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary-950 via-deep to-primary-900 px-4 py-10">
      {/* Full-page brand backdrop — same palette as the card's dark panel so the
          card reads as floating on top of it rather than sitting in a gray box. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 42px)' }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary-400/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-mint/10 blur-3xl" aria-hidden="true" />

      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
        {/* Decorative brand panel — hidden on small screens to keep the form full-width there. */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary-950 via-deep to-primary-900 px-10 py-12 text-white lg:flex">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 42px)' }}
            aria-hidden="true"
          />

          <div className="relative flex items-center gap-3">
            <img src={libraryLogo} alt="Balingasag Municipal Library seal" className="h-11 w-11 shrink-0 object-contain" />
            <span className="leading-tight">
              <span className="block text-xs font-bold uppercase tracking-wide text-primary-200">Balingasag Municipal</span>
              <span className="block text-sm font-bold text-white">Public Library</span>
            </span>
          </div>

          <div className="relative">
            <h1 className="text-4xl font-extrabold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl">
              {headline}
            </h1>
            <p className="mt-4 max-w-sm text-sm text-primary-100">{tagline}</p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-3 gap-4 border-t border-white/15 pt-6">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold text-mint">{stat.value}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-primary-200">{stat.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-primary-200/80">Serving Balingasag, Misamis Oriental since 1991</p>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:py-12">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mb-6 inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary-700 hover:text-primary-800"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Back to Home
          </button>

          <h2 className="text-2xl font-bold text-ink">{title}</h2>
          <p className="mt-1.5 text-sm text-muted">{subtitle}</p>

          <div className="mt-6">{children}</div>

          {footer && <div className="mt-6 border-t border-line pt-5 text-center text-sm text-muted">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
