// Shared domain types for the Admin/Super Admin panel.
// Kept framework-agnostic (plain interfaces + string unions, no enums — see
// tsconfig `erasableSyntaxOnly`) so this layer can be swapped for real API
// responses later without touching component code.

export type UserRole = 'member' | 'admin' | 'superadmin';

export type UserStatus = 'active' | 'pending' | 'suspended';

export interface User {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  username?: string;
  role: UserRole;
  status: UserStatus;
  registeredAt: string; // ISO date

  // Personal Information
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  contactNumber?: string;
  phone?: string;
  address?: string;
  created_at?: string;
  registered_at?: string;

  // Student Information
  studentId?: string;
  school?: string;
  course?: string;
  yearLevel?: string;

  // Identification & Documents
  schoolIdUrl?: string;
  profilePhotoUrl?: string;
  termsAgreed?: boolean;
  infoAccurateConfirmed?: boolean;

  // Library Card & QR Identification
  libraryCardNumber?: string;
  qrCodeData?: string;
  approvedAt?: string;
}

export type BookCondition = 'Excellent' | 'Good' | 'Fair' | 'Worn';

export type BookStatus = 'active' | 'archived';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  quantity: number;
  available: number;
  condition: BookCondition;
  status: BookStatus;
  coverColor: string; // placeholder cover tint, stands in for a real cover image
}

export type RequestType = 'borrowing' | 'acquisition' | 'archive';

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface BorrowRequest {
  id: string;
  type: RequestType;
  requesterId: string;
  bookId?: string;
  note: string; // book title for borrowing, free-text note for acquisition/archive
  date: string; // ISO date the request was made
  status: RequestStatus;
  approverId?: string;
  resolvedDate?: string;
  /** Only meaningful once an approved `borrowing` request is checked out. */
  dueDate?: string;
  /** Set once the borrowed copy has been returned. */
  returnedAt?: string;
}

export type AttendanceStatus = 'inside' | 'left';

export interface AttendanceRecord {
  id: string;
  memberId: string;
  date: string; // ISO date
  timeIn: string; // "HH:mm"
  timeOut?: string; // "HH:mm"
  status: AttendanceStatus;
}

export type AnnouncementStatus = 'draft' | 'published' | 'archived';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  status: AnnouncementStatus;
  date: string; // ISO date
}

export type NotificationType = 'success' | 'info' | 'warning' | 'danger';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalBooks: number;
  members: number;
  borrowed: number;
  overdue: number;
  pendingRequests: number;
  todaysVisitors: number;
}
