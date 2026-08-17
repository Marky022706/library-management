import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type {
  Announcement,
  AttendanceRecord,
  Book,
  BorrowRequest,
  DashboardStats,
  User,
  UserStatus,
} from '../types';
import { books as initialBooks } from '../data/books';
import { users as initialUsers } from '../data/users';
import { requests as initialRequests } from '../data/requests';
import { attendance as initialAttendance } from '../data/attendance';
import { announcements as initialAnnouncements } from '../data/announcements';
import { MOCK_TODAY, minutesBetween } from '../utils/date';
import { makeId } from '../utils/id';
import { bookService } from '../services/bookService';
import { userService } from '../services/userService';
import { borrowingService } from '../services/borrowingService';
import { attendanceService } from '../services/attendanceService';
import { announcementService } from '../services/announcementService';
import { bookRequestService } from '../services/bookRequestService';

export type NewBookInput = Omit<Book, 'id' | 'available' | 'status'>;
export type NewAnnouncementInput = Pick<Announcement, 'title' | 'content'>;
export interface NewMemberInput {
  name: string;
  email: string;
  password?: string;
  username?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  contactNumber?: string;
  address?: string;
  studentId?: string;
  school?: string;
  course?: string;
  yearLevel?: string;
  schoolIdUrl?: string;
  profilePhotoUrl?: string;
  termsAgreed?: boolean;
  infoAccurateConfirmed?: boolean;
}

interface RegisterResult {
  ok: boolean;
  error?: string;
}

interface CategorySlice {
  category: string;
  count: number;
  percent: number;
}

interface LibraryDataContextValue {
  books: Book[];
  users: User[];
  requests: BorrowRequest[];
  attendanceRecords: AttendanceRecord[];
  announcements: Announcement[];

  stats: DashboardStats;
  categoryBreakdown: CategorySlice[];
  avgVisitMinutes: number;
  currentlyInside: AttendanceRecord[];

  // Books
  addBook: (input: NewBookInput) => void;
  updateBook: (id: string, patch: Partial<Book>) => void;
  setBookStatus: (id: string, status: Book['status']) => void;

  // Users
  setUserStatus: (id: string, status: UserStatus) => void;
  registerMember: (input: NewMemberInput) => RegisterResult;

  // Requests
  createBorrowRequest: (bookId: string, note: string, requesterId?: string) => void;
  approveRequest: (id: string, approverId: string) => void;
  rejectRequest: (id: string, approverId: string) => void;
  returnLoan: (requestId: string) => void;

  // Attendance
  checkIn: (memberId: string) => void;
  checkOut: (memberId: string) => void;

  // Sync
  refreshUsers: () => Promise<void>;
  refreshBooks: () => Promise<void>;

  // Announcements
  addAnnouncement: (input: NewAnnouncementInput) => void;
  updateAnnouncement: (id: string, patch: Partial<Announcement>) => void;
  setAnnouncementStatus: (id: string, status: Announcement['status']) => void;
}

const LibraryDataContext = createContext<LibraryDataContextValue | undefined>(undefined);

function nowTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function LibraryDataProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [requests, setRequests] = useState<BorrowRequest[]>(initialRequests);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendance);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);

  // Refresh functions for live backend API sync
  const refreshUsers = async () => {
    const token = localStorage.getItem('balingasag_session_token');
    if (!token) return;
    try {
      const usersRes = await userService.getUsers({ status: 'all' });
      if (usersRes.success && usersRes.data?.users?.length) {
        setUsers(usersRes.data.users);
      }
    } catch (err) {}
  };

  const refreshBooks = async () => {
    try {
      const booksRes = await bookService.getBooks({ status: 'all' });
      if (booksRes.success && booksRes.data?.books?.length) {
        setBooks(booksRes.data.books);
      }
    } catch (err) {}
  };

  // Load initial public catalog on mount
  useEffect(() => {
    refreshBooks();
    refreshUsers();
  }, []);

  const addBook = async (input: NewBookInput) => {
    try {
      const res = await bookService.createBook(input as any);
      if (res.success && res.data?.book) {
        const newBook = res.data.book;
        setBooks((prev) => [newBook, ...prev.filter((b) => b.id !== newBook.id && b.isbn !== newBook.isbn)]);
        return;
      }
    } catch (e) {}

    const book: Book = { ...input, id: makeId('bk'), available: input.quantity, status: 'active' };
    setBooks((prev) => [book, ...prev]);
  };

  const updateBook = async (id: string, patch: Partial<Book>) => {
    try {
      await bookService.updateBook(id, patch as any);
    } catch (e) {}
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  const setBookStatus = async (id: string, status: Book['status']) => {
    try {
      if (status === 'archived') {
        await bookService.archiveBook(id);
      } else if (status === 'active') {
        await bookService.restoreBook(id);
      } else {
        await bookService.updateBook(id, { status } as any);
      }
    } catch (e) {}
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const setUserStatus = async (id: string, status: UserStatus) => {
    try {
      await userService.setUserStatus(id, status);
    } catch (e) {}

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id && u.user_id !== id) return u;
        const uid = u.id || u.user_id || 'U';
        const cardNumber = u.libraryCardNumber || `LIB-${uid.toUpperCase()}-2026`;
        const qrCodeData = u.qrCodeData || cardNumber;
        return {
          ...u,
          status,
          ...(status === 'active'
            ? {
                libraryCardNumber: cardNumber,
                qrCodeData,
                approvedAt: MOCK_TODAY,
              }
            : {}),
        };
      }),
    );
  };

  const registerMember = (input: NewMemberInput): RegisterResult => {
    const name = input.name.trim();
    const email = input.email.trim();
    if (!name || !email) return { ok: false, error: 'Name and email are required.' };

    // Fire asynchronous registration API call to PHP Backend
    userService.register(input).then((res) => {
      if (res.success && res.data?.user) {
        setUsers((prev) => [res.data!.user, ...prev.filter((u) => u.email.toLowerCase() !== email.toLowerCase())]);
      }
    }).catch(() => {});

    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with that email address already exists.' };
    }

    const userId = makeId('u');
    const user: User = {
      ...input,
      id: userId,
      name,
      email,
      role: 'member',
      status: 'pending',
      registeredAt: MOCK_TODAY,
    };
    setUsers((prev) => [user, ...prev]);
    return { ok: true };
  };

  const createBorrowRequest = (bookId: string, note: string, requesterId: string = 'u-3') => {
    const newReq: BorrowRequest = {
      id: makeId('req'),
      type: 'borrowing',
      requesterId,
      bookId,
      note,
      date: MOCK_TODAY,
      status: 'pending',
    };
    setRequests((prev) => [newReq, ...prev]);

    // Backend sync
    bookRequestService.create({
      book_id: bookId,
      title: note || 'Borrow Request',
      reason: note,
      request_type: 'borrowing',
    }).catch(() => {});
  };

  const approveRequest = (id: string, approverId: string) => {
    const target = requests.find((r) => r.id === id);
    if (!target) return;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'approved',
              approverId,
              resolvedDate: MOCK_TODAY,
              ...(r.type === 'borrowing' ? { dueDate: addDays(MOCK_TODAY, 14) } : {}),
            }
          : r,
      ),
    );

    if (target.type === 'borrowing' && target.bookId) {
      const bookId = target.bookId;
      setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, available: Math.max(0, b.available - 1) } : b)));
      borrowingService.borrowBook(bookId, target.requesterId).catch(() => {});
    }
    if (target.type === 'archive' && target.bookId) {
      setBookStatus(target.bookId, 'archived');
    }
  };

  const rejectRequest = (id: string, approverId: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected', approverId, resolvedDate: MOCK_TODAY } : r)),
    );
    bookRequestService.process(id, 'rejected').catch(() => {});
  };

  const returnLoan = (requestId: string) => {
    const target = requests.find((r) => r.id === requestId);
    if (!target) return;
    setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, returnedAt: MOCK_TODAY } : r)));
    if (target.bookId) {
      const bookId = target.bookId;
      setBooks((prev) =>
        prev.map((b) => (b.id === bookId ? { ...b, available: Math.min(b.quantity, b.available + 1) } : b)),
      );
    }
    borrowingService.returnBook(requestId).catch(() => {});
  };

  const checkIn = (memberId: string) => {
    setAttendanceRecords((prev) => [
      { id: makeId('att'), memberId, date: MOCK_TODAY, timeIn: nowTime(), status: 'inside' },
      ...prev,
    ]);
    attendanceService.checkIn(memberId).catch(() => {});
  };

  const checkOut = (memberId: string) => {
    setAttendanceRecords((prev) => {
      const openIndex = prev.findIndex((a) => a.memberId === memberId && a.date === MOCK_TODAY && a.status === 'inside');
      if (openIndex === -1) return prev;
      const next = [...prev];
      next[openIndex] = { ...next[openIndex], timeOut: nowTime(), status: 'left' };
      return next;
    });
    attendanceService.checkOut(memberId).catch(() => {});
  };

  const addAnnouncement = (input: NewAnnouncementInput) => {
    const announcement: Announcement = { ...input, id: makeId('ann'), status: 'draft', date: MOCK_TODAY };
    setAnnouncements((prev) => [announcement, ...prev]);
    announcementService.create(input).catch(() => {});
  };

  const updateAnnouncement = (id: string, patch: Partial<Announcement>) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    announcementService.update(id, patch).catch(() => {});
  };

  const setAnnouncementStatus = (id: string, status: Announcement['status']) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    announcementService.update(id, { status }).catch(() => {});
  };

  const stats: DashboardStats = useMemo(() => {
    const activeBooks = books.filter((b) => b.status === 'active');
    const activeLoans = requests.filter((r) => r.type === 'borrowing' && r.status === 'approved' && !r.returnedAt);
    return {
      totalBooks: activeBooks.length,
      members: users.filter((u) => u.role === 'member' && u.status === 'active').length,
      borrowed: activeLoans.length,
      overdue: activeLoans.filter((r) => r.dueDate && r.dueDate < MOCK_TODAY).length,
      pendingRequests: requests.filter((r) => r.status === 'pending').length,
      todaysVisitors: attendanceRecords.filter((a) => a.date === MOCK_TODAY).length,
    };
  }, [books, users, requests, attendanceRecords]);

  const categoryBreakdown: CategorySlice[] = useMemo(() => {
    const activeBooks = books.filter((b) => b.status === 'active');
    const total = activeBooks.length || 1;
    const counts = new Map<string, number>();
    for (const b of activeBooks) counts.set(b.category, (counts.get(b.category) ?? 0) + 1);
    return [...counts.entries()]
      .map(([category, count]) => ({ category, count, percent: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count);
  }, [books]);

  const avgVisitMinutes = useMemo(() => {
    const completed = attendanceRecords.filter((a) => a.timeOut);
    if (completed.length === 0) return 0;
    const total = completed.reduce((sum, a) => sum + minutesBetween(a.timeIn, a.timeOut!), 0);
    return total / completed.length;
  }, [attendanceRecords]);

  const currentlyInside = useMemo(
    () => attendanceRecords.filter((a) => a.date === MOCK_TODAY && a.status === 'inside'),
    [attendanceRecords],
  );

  const value: LibraryDataContextValue = {
    books,
    users,
    requests,
    attendanceRecords,
    announcements,
    stats,
    categoryBreakdown,
    avgVisitMinutes,
    currentlyInside,
    refreshUsers,
    refreshBooks,
    addBook,
    updateBook,
    setBookStatus,
    setUserStatus,
    registerMember,
    createBorrowRequest,
    approveRequest,
    rejectRequest,
    returnLoan,
    checkIn,
    checkOut,
    addAnnouncement,
    updateAnnouncement,
    setAnnouncementStatus,
  };

  return <LibraryDataContext.Provider value={value}>{children}</LibraryDataContext.Provider>;
}

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function useLibraryData(): LibraryDataContextValue {
  const ctx = useContext(LibraryDataContext);
  if (!ctx) throw new Error('useLibraryData must be used within a LibraryDataProvider');
  return ctx;
}
