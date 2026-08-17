import { useState, useMemo } from 'react';
import { Card } from '../../components/common/Card';
import { MemberWelcomeCard } from '../../components/member/MemberWelcomeCard';
import { MemberStatCards } from '../../components/member/MemberStatCards';
import { DueSoonAlert } from '../../components/member/DueSoonAlert';
import { MyBooksSummary, type MemberLoanItem } from '../../components/member/MyBooksSummary';
import { RecommendedBooks } from '../../components/member/RecommendedBooks';
import { MemberReservations, type MemberReservationItem } from '../../components/member/MemberReservations';
import { MemberNotifications } from '../../components/member/MemberNotifications';
import { MemberRecentActivity } from '../../components/member/MemberRecentActivity';
import { MemberLibraryCardWidget } from '../../components/member/MemberLibraryCardWidget';
import { AttendanceSummaryCard } from '../../components/member/AttendanceSummaryCard';
import { BookDetailsModal } from '../../components/member/BookDetailsModal';
import { BookRequestModal } from '../../components/member/BookRequestModal';
import { MemberProfileModal } from '../../components/member/MemberProfileModal';
import { LibraryCardModal } from '../../components/users/LibraryCardModal';

import { useAuth } from '../../context/AuthContext';
import { useLibraryData } from '../../context/LibraryDataContext';
import { useToast } from '../../context/ToastContext';
import type { Book } from '../../types';

export function MemberDashboard() {
  const { currentUser } = useAuth();
  const { books, createBorrowRequest } = useLibraryData();
  const { showToast } = useToast();

  // Active Loans Mock/State for logged-in member
  const [loans] = useState<MemberLoanItem[]>([
    {
      id: 'loan-1',
      bookId: 'b-1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      borrowDate: 'Aug 13, 2026',
      dueDate: 'Aug 20, 2026',
      daysRemaining: 2,
      totalDays: 7,
      status: 'due_soon',
      coverColor: '#059669',
    },
    {
      id: 'loan-2',
      bookId: 'b-2',
      title: 'Introduction to Python & Data Science',
      author: 'John V. Guttag',
      borrowDate: 'Aug 10, 2026',
      dueDate: 'Aug 24, 2026',
      daysRemaining: 6,
      totalDays: 14,
      status: 'active',
      coverColor: '#2563eb',
    },
    {
      id: 'loan-3',
      bookId: 'b-3',
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      borrowDate: 'Aug 15, 2026',
      dueDate: 'Aug 22, 2026',
      daysRemaining: 6,
      totalDays: 7,
      status: 'active',
      coverColor: '#7c3aed',
    },
  ]);

  // Reservations State
  const [reservations] = useState<MemberReservationItem[]>([
    {
      id: 'res-1',
      bookTitle: 'Atomic Habits',
      author: 'James Clear',
      reservedDate: 'Aug 14, 2026',
      status: 'pending',
    },
    {
      id: 'res-2',
      bookTitle: 'Database System Concepts (7th Ed)',
      author: 'Abraham Silberschatz',
      reservedDate: 'Aug 12, 2026',
      status: 'ready_for_pickup',
      pickupDeadline: 'Aug 18, 2026',
    },
  ]);

  // Favorites State
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['b-1', 'b-3', 'b-5']);

  // Modals
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Due Soon calculation
  const urgentLoan = useMemo(() => {
    return loans.find((l) => l.daysRemaining <= 3);
  }, [loans]);

  const handleToggleFavorite = (bookId: string) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(bookId);
      if (exists) {
        showToast('Removed book from your saved favorites.', 'info');
        return prev.filter((id) => id !== bookId);
      } else {
        showToast('Added book to your personal favorites reading list!', 'success');
        return [...prev, bookId];
      }
    });
  };

  const handleBorrowBook = (book: Book) => {
    createBorrowRequest(book.id, `Borrow request for "${book.title}"`);
    showToast(`Borrow request submitted for "${book.title}". Staff will review your loan!`, 'success');
  };

  const handleReserveBook = (book: Book) => {
    createBorrowRequest(book.id, `Reservation hold for "${book.title}"`);
    showToast(`Hold placed for "${book.title}". You will be notified when a copy is ready for pickup.`, 'info');
  };

  const handleAcquisitionSubmit = (data: { title: string; author: string; publisher?: string }) => {
    showToast(`Acquisition request for "${data.title}" submitted to library administration.`, 'success');
  };

  return (
    <div className="flex flex-col gap-6 max-w-375 mx-auto pb-12">
      {/* 1. Welcome Card */}
      <MemberWelcomeCard
        fullName={currentUser?.name || 'Juan Dela Cruz'}
        onBrowseBooks={() => {
          const el = document.getElementById('recommended-books-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenCard={() => setShowCardModal(true)}
        onRequestBook={() => setShowRequestModal(true)}
      />

      {/* 2. Urgent Due Soon Alert (If applicable) */}
      {urgentLoan && (
        <DueSoonAlert
          bookTitle={urgentLoan.title}
          daysRemaining={urgentLoan.daysRemaining}
          dueDate={urgentLoan.dueDate}
          onViewBook={() => {
            const matchedBook = books.find((b) => b.title === urgentLoan.title);
            if (matchedBook) setSelectedBook(matchedBook);
            else showToast(`Due date for ${urgentLoan.title} is ${urgentLoan.dueDate}.`, 'info');
          }}
        />
      )}

      {/* 3. Personal Statistics */}
      <MemberStatCards
        borrowedCount={loans.length}
        reservationsCount={reservations.length}
        dueSoonCount={urgentLoan ? 1 : 0}
        favoritesCount={favoriteIds.length}
        onViewBorrowed={() => {
          const el = document.getElementById('my-books-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onViewReservations={() => {
          const el = document.getElementById('reservations-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onViewDueSoon={() => {
          if (urgentLoan) showToast(`${urgentLoan.title} is due on ${urgentLoan.dueDate}.`, 'info');
        }}
        onViewFavorites={() => {
          const el = document.getElementById('recommended-books-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 4. My Books Circulation Summary */}
      <div id="my-books-section">
        <Card
          title="My Borrowed Books"
          subtitle="Currently checked-out books and remaining loan period"
        >
          <MyBooksSummary
            loans={loans}
            onViewDetails={(l) => {
              const matchedBook = books.find((b) => b.title === l.title);
              if (matchedBook) setSelectedBook(matchedBook);
              else showToast(`Loan details for "${l.title}" — Due on ${l.dueDate}.`, 'info');
            }}
          />
        </Card>
      </div>

      {/* 5. Recommended Books & Catalog Discovery */}
      <div id="recommended-books-section">
        <Card
          title="Discover & Explore Books"
          subtitle="Search library collection, check real-time availability, and submit borrow requests"
        >
          <RecommendedBooks
            books={books}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            onSelectBook={(b) => setSelectedBook(b)}
            onBorrowBook={handleBorrowBook}
            onReserveBook={handleReserveBook}
          />
        </Card>
      </div>

      {/* 6. Active Reservations & Notifications Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div id="reservations-section">
          <Card title="My Reservations & Holds" subtitle="Active holds waiting for copy return or ready for desk pickup">
            <MemberReservations reservations={reservations} />
          </Card>
        </div>

        <div>
          <Card title="Library Notifications & Announcements" subtitle="Due date reminders, reservation notices, and library updates">
            <MemberNotifications />
          </Card>
        </div>
      </div>

      {/* 7. Recent Activity & Digital Pass Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <Card title="My Recent Activity" subtitle="Personal borrowing, return, reservation, and attendance timeline">
            <MemberRecentActivity />
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <MemberLibraryCardWidget
            user={currentUser}
            onOpenCard={() => setShowCardModal(true)}
          />

          <AttendanceSummaryCard
            lastVisit="August 15, 2026 — 2:34 PM"
            monthlyVisits={12}
            onViewHistory={() => showToast('Displaying your monthly attendance check-ins.', 'info')}
          />
        </div>
      </div>

      {/* Interactive Modals */}
      {selectedBook && (
        <BookDetailsModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onBorrow={handleBorrowBook}
          onReserve={handleReserveBook}
        />
      )}

      {showCardModal && currentUser && (
        <LibraryCardModal
          user={currentUser}
          onClose={() => setShowCardModal(false)}
        />
      )}

      <BookRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSubmit={handleAcquisitionSubmit}
      />

      <MemberProfileModal
        isOpen={showProfileModal}
        user={currentUser}
        onClose={() => setShowProfileModal(false)}
        onOpenCard={() => {
          setShowProfileModal(false);
          setShowCardModal(true);
        }}
      />
    </div>
  );
}
