import { BookOpen, Bookmark, AlertTriangle, Heart } from 'lucide-react';

interface MemberStatCardsProps {
  borrowedCount: number;
  reservationsCount: number;
  dueSoonCount: number;
  favoritesCount: number;
  onViewBorrowed?: () => void;
  onViewReservations?: () => void;
  onViewDueSoon?: () => void;
  onViewFavorites?: () => void;
}

export function MemberStatCards({
  borrowedCount,
  reservationsCount,
  dueSoonCount,
  favoritesCount,
  onViewBorrowed,
  onViewReservations,
  onViewDueSoon,
  onViewFavorites,
}: MemberStatCardsProps) {
  const cards = [
    {
      label: 'Currently Borrowed',
      value: borrowedCount,
      subtitle: 'Books checked out',
      icon: BookOpen,
      tone: 'text-emerald-700 bg-emerald-50 border-emerald-100',
      iconBg: 'bg-emerald-100 text-emerald-700',
      onClick: onViewBorrowed,
    },
    {
      label: 'Active Reservations',
      value: reservationsCount,
      subtitle: 'Hold queue & pickup',
      icon: Bookmark,
      tone: 'text-blue-700 bg-blue-50 border-blue-100',
      iconBg: 'bg-blue-100 text-blue-700',
      onClick: onViewReservations,
    },
    {
      label: 'Due Soon',
      value: dueSoonCount,
      subtitle: 'Within 3 days',
      icon: AlertTriangle,
      tone: 'text-amber-800 bg-amber-50 border-amber-200/80',
      iconBg: 'bg-amber-100 text-amber-700',
      onClick: onViewDueSoon,
    },
    {
      label: 'Saved Books',
      value: favoritesCount,
      subtitle: 'Personal reading list',
      icon: Heart,
      tone: 'text-rose-700 bg-rose-50 border-rose-100',
      iconBg: 'bg-rose-100 text-rose-700',
      onClick: onViewFavorites,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            onClick={c.onClick}
            className={`flex flex-col justify-between rounded-2xl border p-5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs cursor-pointer ${c.tone}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider">{c.label}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.iconBg}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-bold tracking-tight">{c.value}</p>
              <p className="mt-1 text-[11px] opacity-80">{c.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
