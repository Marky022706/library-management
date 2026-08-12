import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { LibraryProvider } from '@/context/LibraryContext';
import { ToastProvider } from '@/context/ToastContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { RoleGuard } from '@/components/RoleGuard';

import { AuthLayout } from '@/layouts/AuthLayout';
import { MemberLayout } from '@/layouts/MemberLayout';
import { AdminLayout } from '@/layouts/AdminLayout';

import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';

import { Dashboard as MemberDashboard } from '@/pages/member/Dashboard';
import { BookCatalog } from '@/pages/member/BookCatalog';
import { BookDetails } from '@/pages/member/BookDetails';
import { MyBooks } from '@/pages/member/MyBooks';
import { ActivityHistory } from '@/pages/member/ActivityHistory';
import { Notifications } from '@/pages/member/Notifications';
import { Favorites } from '@/pages/member/Favorites';
import { Profile } from '@/pages/member/Profile';

import { Dashboard as AdminDashboard } from '@/pages/admin/Dashboard';
import { Books } from '@/pages/admin/Books';
import { Users } from '@/pages/admin/Users';
import { Requests } from '@/pages/admin/Requests';
import { Attendance } from '@/pages/admin/Attendance';
import { Reports } from '@/pages/admin/Reports';
import { Announcements } from '@/pages/admin/Announcements';

import { Settings } from '@/pages/superadmin/Settings';
import { AuditLogs } from '@/pages/superadmin/AuditLogs';
import { SystemLogs } from '@/pages/superadmin/SystemLogs';
import { RecycleBin } from '@/pages/superadmin/RecycleBin';
import { BackupRestore } from '@/pages/superadmin/BackupRestore';

import { RootRedirect } from '@/pages/RootRedirect';
import { Unauthorized } from '@/pages/Unauthorized';
import { NotFound } from '@/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LibraryProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<RootRedirect />} />

              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>

              <Route path="/unauthorized" element={<Unauthorized />} />

              <Route element={<ProtectedRoute allowedRoles={['member']} />}>
                <Route path="/member" element={<MemberLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<MemberDashboard />} />
                  <Route path="catalog" element={<BookCatalog />} />
                  <Route path="catalog/:bookId" element={<BookDetails />} />
                  <Route path="my-books" element={<MyBooks />} />
                  <Route path="activity" element={<ActivityHistory />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="favorites" element={<Favorites />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="books" element={<Books />} />
                  <Route path="users" element={<Users />} />
                  <Route path="requests" element={<Requests />} />
                  <Route path="attendance" element={<Attendance />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="announcements" element={<Announcements />} />
                  <Route
                    path="settings"
                    element={
                      <RoleGuard role="superadmin">
                        <Settings />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="audit-logs"
                    element={
                      <RoleGuard role="superadmin">
                        <AuditLogs />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="system-logs"
                    element={
                      <RoleGuard role="superadmin">
                        <SystemLogs />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="recycle-bin"
                    element={
                      <RoleGuard role="superadmin">
                        <RecycleBin />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="backup-restore"
                    element={
                      <RoleGuard role="superadmin">
                        <BackupRestore />
                      </RoleGuard>
                    }
                  />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </ToastProvider>
        </LibraryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
