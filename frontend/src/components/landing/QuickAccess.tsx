import { ArrowRight, Bookmark, BookOpen, CreditCard, Library, type LucideIcon } from 'lucide-react';
import { scrollToSection } from './navConfig';
import { Reveal } from './Reveal';

interface QuickAccessCard {
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  targetId: string;
}

const CARDS: QuickAccessCard[] = [
  {
    icon: BookOpen,
    title: 'Browse Books',
    description: 'Explore our growing collection of books and learning resources.',
    cta: 'Browse Catalog',
    targetId: 'contact',
  },
  {
    icon: Bookmark,
    title: 'Reserve a Book',
    description: 'Find a title and place a borrowing request online.',
    cta: 'Reserve Now',
    targetId: 'contact',
  },
  {
    icon: CreditCard,
    title: 'Library Membership',
    description: 'Create and manage your digital library membership.',
    cta: 'Become a Member',
    targetId: 'contact',
  },
  {
    icon: Library,
    title: 'My Library',
    description: 'Track borrowed books, due dates, requests, and notifications.',
    cta: 'Open My Library',
    targetId: 'contact',
  },
];

export function QuickAccess() {
  return (
    <section aria-labelledby="quick-access-heading" className="mx-auto max-w-7xl px-4 py-20 sm:px-7">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 id="quick-access-heading" className="text-3xl font-extrabold text-ink sm:text-4xl">
          Everything You Need, All in One Place
        </h2>
        <p className="mt-3 text-lg text-muted">Access essential library services anytime, anywhere.</p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card, index) => (
          <Reveal key={card.title} delayMs={index * 80}>
            <div className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                <card.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-ink">{card.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">{card.description}</p>
              <button
                type="button"
                onClick={() => scrollToSection(card.targetId)}
                className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-primary-700 transition-transform group-hover:gap-2.5 hover:text-primary-800"
              >
                {card.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
