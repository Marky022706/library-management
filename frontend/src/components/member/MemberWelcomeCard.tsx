import { BookOpen, QrCode } from 'lucide-react';
import { Button } from '../common/Button';

interface MemberWelcomeCardProps {
  fullName: string;
  onBrowseBooks: () => void;
  onOpenCard: () => void;
  onRequestBook?: () => void;
}

export function MemberWelcomeCard({
  fullName,
  onBrowseBooks,
  onOpenCard,
  onRequestBook,
}: MemberWelcomeCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-emerald-800/10 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Member Portal</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-xs font-medium text-slate-500">Balingasag Public Library</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Welcome back, {fullName}! 👋
        </h1>
        <p className="mt-1 max-w-xl text-sm text-slate-500">
          Find your next book, manage your borrowed books, and keep track of your library activities.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
        <Button
          onClick={onBrowseBooks}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs"
        >
          <BookOpen className="h-4 w-4" />
          Browse Books
        </Button>
        <Button
          variant="outline"
          onClick={onOpenCard}
          className="gap-2 border-emerald-300 text-emerald-800 hover:bg-emerald-50 text-xs font-semibold"
        >
          <QrCode className="h-4 w-4 text-emerald-700" />
          Digital Card & QR
        </Button>
        {onRequestBook && (
          <Button
            variant="outline"
            onClick={onRequestBook}
            className="text-xs text-slate-600 hover:bg-slate-50"
          >
            Request a Book
          </Button>
        )}
      </div>
    </div>
  );
}
