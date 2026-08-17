import { BookOpen, Check, BookmarkPlus, MapPin, Hash, Sparkles } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import type { Book } from '../../types';

interface BookDetailsModalProps {
  book: Book | null;
  onClose: () => void;
  onBorrow: (book: Book) => void;
  onReserve: (book: Book) => void;
}

export function BookDetailsModal({
  book,
  onClose,
  onBorrow,
  onReserve,
}: BookDetailsModalProps) {
  if (!book) return null;

  const isAvail = book.available > 0;

  return (
    <Modal
      open={Boolean(book)}
      onClose={onClose}
      title="Book Information & Availability"
      footer={
        <div className="flex items-center justify-between w-full gap-2">
          <Button variant="outline" onClick={onClose} className="text-xs">
            Close
          </Button>

          <div className="flex items-center gap-2">
            {isAvail ? (
              <Button
                onClick={() => {
                  onBorrow(book);
                  onClose();
                }}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
              >
                <Check className="h-4 w-4" />
                Submit Borrow Request
              </Button>
            ) : (
              <Button
                onClick={() => {
                  onReserve(book);
                  onClose();
                }}
                className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"
              >
                <BookmarkPlus className="h-4 w-4" />
                Place Hold / Reserve
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 text-xs">
        <div className="flex items-start gap-4">
          <div
            style={{ backgroundColor: book.coverColor || '#16a34a' }}
            className="flex h-24 w-18 shrink-0 items-center justify-center rounded-xl text-white shadow-md font-bold text-2xl"
          >
            {book.title.slice(0, 1).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <Badge tone="neutral" className="text-[10px] mb-1">
              {book.category}
            </Badge>
            <h2 className="text-base font-bold text-slate-900 leading-snug">{book.title}</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">By {book.author}</p>

            <div className="mt-2.5 flex items-center gap-2">
              <Badge tone={isAvail ? 'green' : 'amber'} dot>
                {isAvail ? `${book.available} COPIES AVAILABLE` : 'ALL COPIES CHECKED OUT'}
              </Badge>
              <Badge tone="neutral">Condition: {book.condition}</Badge>
            </div>
          </div>
        </div>

        {/* Shelf & Catalog Details */}
        <div className="grid grid-cols-2 gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400">ISBN</p>
              <p className="font-semibold text-slate-800">{book.isbn}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400">Shelf Location</p>
              <p className="font-semibold text-slate-800">Stack A &bull; Shelf #{book.id.slice(-2)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400">Total Holdings</p>
              <p className="font-semibold text-slate-800">{book.quantity} physical copies</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400">Circulation Policy</p>
              <p className="font-semibold text-emerald-800">7 Days Standard Loan</p>
            </div>
          </div>
        </div>

        {/* Synopsis / Description */}
        <div>
          <h4 className="font-semibold text-slate-800 text-xs mb-1">Catalog Description</h4>
          <p className="text-slate-600 leading-relaxed bg-white rounded-xl border border-slate-100 p-3">
            Official Balingasag Public Library academic collection. Available for verified library cardholders for standard reading room study or approved home circulation loan.
          </p>
        </div>
      </div>
    </Modal>
  );
}
