import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import type {
  Book,
  BookInput,
  User,
  UserRole,
  UserStatus,
  Borrowing,
  Reservation,
  AttendanceRecord,
  AppNotification,
  NotificationType,
  LibraryRequest,
  RequestType,
  Announcement,
  AnnouncementStatus,
  AuditLog,
  SystemLog,
  LogLevel,
  LibrarySettings,
  RecycleBinItem,
  BackupRecord,
  Favorite,
  ActivityLogEntry,
} from '@/types';
import {
  mockBooks,
  mockUsers,
  mockBorrowings,
  mockReservations,
  mockAttendance,
  mockNotifications,
  mockRequests,
  mockAnnouncements,
  mockAuditLogs,
  mockSystemLogs,
  mockSettings,
  mockRecycleBin,
  mockBackups,
  mockFavorites,
  mockActivity,
} from '@/mock';
import {
  bookService,
  userService,
  borrowingService,
  reservationService,
  attendanceService,
  requestService,
  notificationService,
} from '@/services';
import { generateId } from '@/utils/id';
import { isoDate, daysFromNow } from '@/utils/date';

export interface LibraryApi {
  books: Book[];
  users: User[];
  borrowings: Borrowing[];
  reservations: Reservation[];
  attendance: AttendanceRecord[];
  notifications: AppNotification[];
  requests: LibraryRequest[];
  announcements: Announcement[];
  auditLogs: AuditLog[];
  systemLogs: SystemLog[];
  settings: LibrarySettings;
  recycleBin: RecycleBinItem[];
  backups: BackupRecord[];
  favorites: Favorite[];
  activity: ActivityLogEntry[];

  getBookById: (id: string) => Book | undefined;
  getUserById: (id: string) => User | undefined;
  favoritesByUser: (userId: string) => Book[];
  isFavorite: (userId: string, bookId: string) => boolean;
  borrowingsByUser: (userId: string) => Borrowing[];
  reservationsByUser: (userId: string) => Reservation[];
  notificationsByUser: (userId: string) => AppNotification[];
  activityByUser: (userId: string) => ActivityLogEntry[];

  // Books
  addBook: (input: BookInput, actorId: string) => Promise<Book>;
  updateBook: (id: string, patch: Partial<BookInput>, actorId: string) => Promise<Book>;
  archiveBook: (id: string, actorId: string) => Promise<void>;
  restoreBook: (id: string, actorId: string) => Promise<void>;

  // Users
  updateUserStatus: (id: string, status: UserStatus, actorId: string) => Promise<void>;
  assignUserRole: (id: string, role: UserRole, actorId: string) => Promise<void>;
  updateProfile: (id: string, patch: Partial<User>) => Promise<void>;

  // Favorites
  toggleFavorite: (userId: string, bookId: string) => void;

  // Borrowing / reservation / requests
  submitBorrowRequest: (userId: string, bookId: string, idDocumentName?: string) => Promise<void>;
  submitReservation: (userId: string, bookId: string) => Promise<void>;
  cancelReservation: (reservationId: string, actorId: string) => Promise<void>;
  returnBorrowing: (borrowingId: string, actorId: string) => Promise<void>;
  submitAcquisitionRequest: (requesterId: string, bookTitle: string, details: string) => Promise<void>;
  submitArchiveRequest: (requesterId: string, bookId: string, details: string) => Promise<void>;
  approveRequest: (requestId: string, approverId: string) => Promise<void>;
  rejectRequest: (requestId: string, approverId: string) => Promise<void>;

  // Attendance
  simulateTimeIn: (userId: string, purpose?: string) => Promise<AttendanceRecord>;
  simulateTimeOut: (attendanceId: string) => Promise<void>;

  // Notifications
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: (userId: string) => Promise<void>;
  notifyUser: (userId: string, title: string, message: string, type?: NotificationType) => Promise<void>;

  // Announcements
  createAnnouncement: (input: { title: string; content: string }, authorId: string) => void;
  updateAnnouncement: (id: string, patch: { title: string; content: string }) => void;
  setAnnouncementStatus: (id: string, status: AnnouncementStatus) => void;

  // Settings
  updateSettings: (patch: Partial<LibrarySettings>, actorId: string) => void;

  // Recycle bin
  restoreRecycleItem: (id: string, actorId: string) => void;
  deleteRecycleItemPermanently: (id: string) => void;

  // Backup & restore
  createBackup: (actorId: string) => Promise<BackupRecord>;
  restoreBackup: (id: string, actorId: string) => Promise<void>;

  // Logging
  logAudit: (userId: string, action: string, module: string, description: string) => void;
  logSystem: (level: LogLevel, module: string, message: string) => void;
}

export const LibraryContext = createContext<LibraryApi | undefined>(undefined);

const REQUEST_TYPE_LABEL: Record<RequestType, string> = {
  Borrowing: 'borrowing',
  Archive: 'archive',
  Acquisition: 'acquisition',
};

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [borrowings, setBorrowings] = useState<Borrowing[]>(mockBorrowings);
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);
  const [requests, setRequests] = useState<LibraryRequest[]>(mockRequests);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(mockSystemLogs);
  const [settings, setSettings] = useState<LibrarySettings>(mockSettings);
  const [recycleBin, setRecycleBin] = useState<RecycleBinItem[]>(mockRecycleBin);
  const [backups, setBackups] = useState<BackupRecord[]>(mockBackups);
  const [favorites, setFavorites] = useState<Favorite[]>(mockFavorites);
  const [activity, setActivity] = useState<ActivityLogEntry[]>(mockActivity);

  const getBookById = useCallback((id: string) => books.find((b) => b.id === id), [books]);
  const getUserById = useCallback((id: string) => users.find((u) => u.id === id), [users]);

  const logAudit = useCallback(
    (userId: string, action: string, module: string, description: string) => {
      const user = users.find((u) => u.id === userId);
      setAuditLogs((prev) => [
        { id: generateId('al'), userId, userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown User', action, module, description, date: isoDate(new Date()) },
        ...prev,
      ]);
    },
    [users],
  );

  const logSystem = useCallback((level: LogLevel, module: string, message: string) => {
    setSystemLogs((prev) => [{ id: generateId('sl'), timestamp: isoDate(new Date()), level, module, message }, ...prev]);
  }, []);

  const logActivity = useCallback((userId: string, type: ActivityLogEntry['type'], description: string) => {
    setActivity((prev) => [{ id: generateId('act'), userId, type, description, date: isoDate(new Date()) }, ...prev]);
  }, []);

  const notifyUser = useCallback(
    async (userId: string, title: string, message: string, type: NotificationType = 'info') => {
      const notification = await notificationService.create({ userId, title, message, type });
      setNotifications((prev) => [notification, ...prev]);
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Books
  // ---------------------------------------------------------------------------
  const addBook = useCallback(
    async (input: BookInput, actorId: string) => {
      const book = await bookService.add(input);
      setBooks((prev) => [book, ...prev]);
      logAudit(actorId, 'Added a new book', 'Book Management', `Added "${book.title}" to the catalog.`);
      return book;
    },
    [logAudit],
  );

  const updateBook = useCallback(
    async (id: string, patch: Partial<BookInput>, actorId: string) => {
      const book = await bookService.update(id, patch);
      setBooks((prev) => prev.map((b) => (b.id === id ? book : b)));
      logAudit(actorId, 'Updated book information', 'Book Management', `Updated details for "${book.title}".`);
      return book;
    },
    [logAudit],
  );

  const archiveBook = useCallback(
    async (id: string, actorId: string) => {
      const book = await bookService.setStatus(id, 'archived');
      setBooks((prev) => prev.map((b) => (b.id === id ? book : b)));
      logAudit(actorId, 'Archived a book', 'Book Management', `Archived "${book.title}".`);
    },
    [logAudit],
  );

  const restoreBook = useCallback(
    async (id: string, actorId: string) => {
      const book = await bookService.setStatus(id, 'active');
      setBooks((prev) => prev.map((b) => (b.id === id ? book : b)));
      logAudit(actorId, 'Restored a book', 'Book Management', `Restored "${book.title}" from the archive.`);
    },
    [logAudit],
  );

  // ---------------------------------------------------------------------------
  // Users
  // ---------------------------------------------------------------------------
  const updateUserStatus = useCallback(
    async (id: string, status: UserStatus, actorId: string) => {
      const previous = users.find((u) => u.id === id);
      const user = await userService.updateStatus(id, status);
      setUsers((prev) => prev.map((u) => (u.id === id ? user : u)));
      logAudit(actorId, `Set user status to ${status}`, 'User Management', `Updated ${user.firstName} ${user.lastName}'s account status to "${status}".`);
      if (previous?.status === 'pending' && status === 'active') {
        await notifyUser(id, 'Account approved', 'Your account has been approved. You may now borrow and reserve books.', 'success');
      }
    },
    [users, logAudit, notifyUser],
  );

  const assignUserRole = useCallback(
    async (id: string, role: UserRole, actorId: string) => {
      const user = await userService.assignRole(id, role);
      setUsers((prev) => prev.map((u) => (u.id === id ? user : u)));
      logAudit(actorId, 'Assigned a role', 'User Management', `Assigned the "${role}" role to ${user.firstName} ${user.lastName}.`);
    },
    [logAudit],
  );

  const updateProfile = useCallback(async (id: string, patch: Partial<User>) => {
    const user = await userService.update(id, patch);
    setUsers((prev) => prev.map((u) => (u.id === id ? user : u)));
    logActivity(id, 'Profile Updated', 'Updated profile information.');
  }, [logActivity]);

  // ---------------------------------------------------------------------------
  // Favorites
  // ---------------------------------------------------------------------------
  const toggleFavorite = useCallback(
    (userId: string, bookId: string) => {
      setFavorites((prev) => {
        const existing = prev.find((f) => f.userId === userId && f.bookId === bookId);
        if (existing) return prev.filter((f) => f.id !== existing.id);
        return [...prev, { id: generateId('fav'), userId, bookId, addedAt: isoDate(new Date()) }];
      });
      const book = getBookById(bookId);
      const alreadyFavorite = favorites.some((f) => f.userId === userId && f.bookId === bookId);
      if (!alreadyFavorite && book) logActivity(userId, 'Favorite Added', `Added "${book.title}" to favorites.`);
    },
    [favorites, getBookById, logActivity],
  );

  // ---------------------------------------------------------------------------
  // Borrowing / reservations / requests
  // ---------------------------------------------------------------------------
  const submitBorrowRequest = useCallback(
    async (userId: string, bookId: string, idDocumentName?: string) => {
      const book = getBookById(bookId);
      const dueDate = daysFromNow(settings.loanDurationDays);
      const borrowing = await borrowingService.create({ userId, bookId, dueDate, idDocumentName });
      setBorrowings((prev) => [borrowing, ...prev]);
      const request = await requestService.create({
        type: 'Borrowing',
        requesterId: userId,
        bookId,
        bookTitle: book?.title,
        borrowingId: borrowing.id,
        details: `Request to borrow "${book?.title ?? 'a book'}".`,
      });
      setRequests((prev) => [request, ...prev]);
      logActivity(userId, 'Borrow Request', `Requested to borrow "${book?.title ?? 'a book'}".`);
      logAudit(userId, 'Submitted a borrowing request', 'Borrowing', `Requested to borrow "${book?.title ?? 'a book'}".`);
    },
    [getBookById, settings.loanDurationDays, logActivity, logAudit],
  );

  const submitReservation = useCallback(
    async (userId: string, bookId: string) => {
      const book = getBookById(bookId);
      const reservation = await reservationService.create({ userId, bookId, durationDays: settings.reservationDurationDays });
      setReservations((prev) => [reservation, ...prev]);
      logActivity(userId, 'Reservation', `Reserved "${book?.title ?? 'a book'}".`);
      logAudit(userId, 'Submitted a reservation', 'Reservation', `Reserved "${book?.title ?? 'a book'}".`);
    },
    [getBookById, settings.reservationDurationDays, logActivity, logAudit],
  );

  const cancelReservation = useCallback(
    async (reservationId: string, actorId: string) => {
      const reservation = await reservationService.cancel(reservationId);
      setReservations((prev) => prev.map((r) => (r.id === reservationId ? reservation : r)));
      logAudit(actorId, 'Cancelled a reservation', 'Reservation', `Cancelled reservation ${reservationId}.`);
    },
    [logAudit],
  );

  const returnBorrowing = useCallback(
    async (borrowingId: string, actorId: string) => {
      const borrowing = await borrowingService.returnBook(borrowingId);
      setBorrowings((prev) => prev.map((b) => (b.id === borrowingId ? borrowing : b)));
      const book = await bookService.adjustAvailability(borrowing.bookId, 1);
      setBooks((prev) => prev.map((b) => (b.id === book.id ? book : b)));
      logActivity(borrowing.userId, 'Book Returned', `Returned "${book.title}".`);
      logAudit(actorId, 'Recorded a book return', 'Borrowing', `Marked "${book.title}" as returned.`);
    },
    [logActivity, logAudit],
  );

  const submitAcquisitionRequest = useCallback(
    async (requesterId: string, bookTitle: string, details: string) => {
      const request = await requestService.create({ type: 'Acquisition', requesterId, bookTitle, details });
      setRequests((prev) => [request, ...prev]);
      logAudit(requesterId, 'Submitted an acquisition request', 'Requests', `Suggested acquiring "${bookTitle}".`);
    },
    [logAudit],
  );

  const submitArchiveRequest = useCallback(
    async (requesterId: string, bookId: string, details: string) => {
      const book = getBookById(bookId);
      const request = await requestService.create({ type: 'Archive', requesterId, bookId, bookTitle: book?.title, details });
      setRequests((prev) => [request, ...prev]);
      logAudit(requesterId, 'Submitted an archive request', 'Requests', `Requested review for archiving "${book?.title ?? 'a book'}".`);
    },
    [getBookById, logAudit],
  );

  const approveRequest = useCallback(
    async (requestId: string, approverId: string) => {
      const target = requests.find((r) => r.id === requestId);
      if (!target) return;
      const updatedRequest = await requestService.approve(requestId, approverId);
      setRequests((prev) => prev.map((r) => (r.id === requestId ? updatedRequest : r)));

      if (target.type === 'Borrowing' && target.borrowingId) {
        const borrowing = await borrowingService.approve(target.borrowingId);
        setBorrowings((prev) => prev.map((b) => (b.id === borrowing.id ? borrowing : b)));
        const book = await bookService.adjustAvailability(borrowing.bookId, -1);
        setBooks((prev) => prev.map((b) => (b.id === book.id ? book : b)));
        logActivity(target.requesterId, 'Book Borrowed', `Borrowed "${book.title}" — due ${new Date(borrowing.dueDate).toLocaleDateString()}.`);
        await notifyUser(target.requesterId, 'Borrowing request approved', `Your borrowing request for "${book.title}" was approved.`, 'success');
      } else if (target.type === 'Archive' && target.bookId) {
        const book = await bookService.setStatus(target.bookId, 'archived');
        setBooks((prev) => prev.map((b) => (b.id === book.id ? book : b)));
      } else if (target.type === 'Acquisition') {
        await notifyUser(target.requesterId, 'Acquisition request approved', `Your suggestion to acquire "${target.bookTitle}" was approved.`, 'success');
      }

      logAudit(approverId, `Approved a(n) ${REQUEST_TYPE_LABEL[target.type]} request`, 'Requests', target.details);
    },
    [requests, logActivity, logAudit, notifyUser],
  );

  const rejectRequest = useCallback(
    async (requestId: string, approverId: string) => {
      const target = requests.find((r) => r.id === requestId);
      if (!target) return;
      const updatedRequest = await requestService.reject(requestId, approverId);
      setRequests((prev) => prev.map((r) => (r.id === requestId ? updatedRequest : r)));

      if (target.type === 'Borrowing' && target.borrowingId) {
        const borrowing = await borrowingService.reject(target.borrowingId);
        setBorrowings((prev) => prev.map((b) => (b.id === borrowing.id ? borrowing : b)));
        await notifyUser(target.requesterId, 'Borrowing request rejected', `Your borrowing request for "${target.bookTitle ?? 'a book'}" was declined.`, 'danger');
      } else if (target.type === 'Acquisition') {
        await notifyUser(target.requesterId, 'Acquisition request rejected', `Your suggestion to acquire "${target.bookTitle}" was declined.`, 'danger');
      }

      logAudit(approverId, `Rejected a(n) ${REQUEST_TYPE_LABEL[target.type]} request`, 'Requests', target.details);
    },
    [requests, logAudit, notifyUser],
  );

  // ---------------------------------------------------------------------------
  // Attendance
  // ---------------------------------------------------------------------------
  const simulateTimeIn = useCallback(
    async (userId: string, purpose?: string) => {
      const record = await attendanceService.timeIn(userId, purpose);
      setAttendance((prev) => [record, ...prev]);
      logActivity(userId, 'Attendance', 'Checked in at the library via QR scan.');
      logSystem('INFO', 'Attendance', `QR scan recorded time-in for user ${userId}.`);
      return record;
    },
    [logActivity, logSystem],
  );

  const simulateTimeOut = useCallback(
    async (attendanceId: string) => {
      const record = await attendanceService.timeOut(attendanceId);
      setAttendance((prev) => prev.map((a) => (a.id === attendanceId ? record : a)));
      logSystem('INFO', 'Attendance', `QR scan recorded time-out for user ${record.userId}.`);
    },
    [logSystem],
  );

  // ---------------------------------------------------------------------------
  // Notifications
  // ---------------------------------------------------------------------------
  const markNotificationRead = useCallback(async (id: string) => {
    const notification = await notificationService.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? notification : n)));
  }, []);

  const markAllNotificationsRead = useCallback(async (userId: string) => {
    await notificationService.markAllAsRead(userId);
    setNotifications((prev) => prev.map((n) => (n.userId === userId ? { ...n, read: true } : n)));
  }, []);

  // ---------------------------------------------------------------------------
  // Announcements
  // ---------------------------------------------------------------------------
  const createAnnouncement = useCallback(
    (input: { title: string; content: string }, authorId: string) => {
      const announcement: Announcement = {
        id: generateId('ann'),
        title: input.title,
        content: input.content,
        status: 'draft',
        authorId,
        createdAt: isoDate(new Date()),
      };
      setAnnouncements((prev) => [announcement, ...prev]);
      logAudit(authorId, 'Created an announcement', 'Announcements', `Created draft "${input.title}".`);
    },
    [logAudit],
  );

  const updateAnnouncement = useCallback((id: string, patch: { title: string; content: string }) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }, []);

  const setAnnouncementStatus = useCallback((id: string, status: AnnouncementStatus) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, publishedAt: status === 'published' ? isoDate(new Date()) : a.publishedAt } : a)),
    );
  }, []);

  // ---------------------------------------------------------------------------
  // Settings
  // ---------------------------------------------------------------------------
  const updateSettings = useCallback(
    (patch: Partial<LibrarySettings>, actorId: string) => {
      setSettings((prev) => ({ ...prev, ...patch }));
      logAudit(actorId, 'Updated system settings', 'Settings', `Changed: ${Object.keys(patch).join(', ')}.`);
    },
    [logAudit],
  );

  // ---------------------------------------------------------------------------
  // Recycle bin
  // ---------------------------------------------------------------------------
  const restoreRecycleItem = useCallback(
    (id: string, actorId: string) => {
      const item = recycleBin.find((r) => r.id === id);
      setRecycleBin((prev) => prev.filter((r) => r.id !== id));
      if (item) logAudit(actorId, 'Restored a record', 'Recycle Bin', `Restored "${item.name}" from the recycle bin.`);
    },
    [recycleBin, logAudit],
  );

  const deleteRecycleItemPermanently = useCallback((id: string) => {
    setRecycleBin((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // ---------------------------------------------------------------------------
  // Backup & restore
  // ---------------------------------------------------------------------------
  const createBackup = useCallback(
    async (actorId: string) => {
      const user = users.find((u) => u.id === actorId);
      const record: BackupRecord = {
        id: generateId('bk'),
        createdAt: isoDate(new Date()),
        sizeMb: Math.round(380 + Math.random() * 60),
        createdBy: user ? `${user.firstName} ${user.lastName}` : 'System',
        status: 'completed',
      };
      setBackups((prev) => [record, ...prev]);
      logAudit(actorId, 'Created a backup', 'Backup & Restore', 'Manually triggered a full system backup.');
      return record;
    },
    [users, logAudit],
  );

  const restoreBackup = useCallback(
    async (id: string, actorId: string) => {
      const backup = backups.find((b) => b.id === id);
      logAudit(actorId, 'Restored a backup', 'Backup & Restore', `Restored system state from backup created ${backup ? new Date(backup.createdAt).toLocaleString() : ''}.`);
    },
    [backups, logAudit],
  );

  // ---------------------------------------------------------------------------
  // Derived selectors
  // ---------------------------------------------------------------------------
  const favoritesByUser = useCallback(
    (userId: string) => {
      const bookIds = favorites.filter((f) => f.userId === userId).map((f) => f.bookId);
      return books.filter((b) => bookIds.includes(b.id));
    },
    [favorites, books],
  );

  const isFavorite = useCallback((userId: string, bookId: string) => favorites.some((f) => f.userId === userId && f.bookId === bookId), [favorites]);

  const borrowingsByUser = useCallback((userId: string) => borrowings.filter((b) => b.userId === userId), [borrowings]);
  const reservationsByUser = useCallback((userId: string) => reservations.filter((r) => r.userId === userId), [reservations]);
  const notificationsByUser = useCallback((userId: string) => notifications.filter((n) => n.userId === userId), [notifications]);
  const activityByUser = useCallback((userId: string) => activity.filter((a) => a.userId === userId), [activity]);

  const value = useMemo<LibraryApi>(
    () => ({
      books,
      users,
      borrowings,
      reservations,
      attendance,
      notifications,
      requests,
      announcements,
      auditLogs,
      systemLogs,
      settings,
      recycleBin,
      backups,
      favorites,
      activity,
      getBookById,
      getUserById,
      favoritesByUser,
      isFavorite,
      borrowingsByUser,
      reservationsByUser,
      notificationsByUser,
      activityByUser,
      addBook,
      updateBook,
      archiveBook,
      restoreBook,
      updateUserStatus,
      assignUserRole,
      updateProfile,
      toggleFavorite,
      submitBorrowRequest,
      submitReservation,
      cancelReservation,
      returnBorrowing,
      submitAcquisitionRequest,
      submitArchiveRequest,
      approveRequest,
      rejectRequest,
      simulateTimeIn,
      simulateTimeOut,
      markNotificationRead,
      markAllNotificationsRead,
      notifyUser,
      createAnnouncement,
      updateAnnouncement,
      setAnnouncementStatus,
      updateSettings,
      restoreRecycleItem,
      deleteRecycleItemPermanently,
      createBackup,
      restoreBackup,
      logAudit,
      logSystem,
    }),
    [
      books,
      users,
      borrowings,
      reservations,
      attendance,
      notifications,
      requests,
      announcements,
      auditLogs,
      systemLogs,
      settings,
      recycleBin,
      backups,
      favorites,
      activity,
      getBookById,
      getUserById,
      favoritesByUser,
      isFavorite,
      borrowingsByUser,
      reservationsByUser,
      notificationsByUser,
      activityByUser,
      addBook,
      updateBook,
      archiveBook,
      restoreBook,
      updateUserStatus,
      assignUserRole,
      updateProfile,
      toggleFavorite,
      submitBorrowRequest,
      submitReservation,
      cancelReservation,
      returnBorrowing,
      submitAcquisitionRequest,
      submitArchiveRequest,
      approveRequest,
      rejectRequest,
      simulateTimeIn,
      simulateTimeOut,
      markNotificationRead,
      markAllNotificationsRead,
      notifyUser,
      createAnnouncement,
      updateAnnouncement,
      setAnnouncementStatus,
      updateSettings,
      restoreRecycleItem,
      deleteRecycleItemPermanently,
      createBackup,
      restoreBackup,
      logAudit,
      logSystem,
    ],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}
