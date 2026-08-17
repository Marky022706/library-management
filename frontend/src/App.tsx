import { Navigate, Route, Routes } from 'react-router-dom';
import { LibraryDataProvider } from './context/LibraryDataContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ToastViewport } from './components/common/ToastViewport';
import { RequireAuth } from './components/layout/RequireAuth';
import { AdminLayout } from './components/layout/AdminLayout';
import { MemberLayout } from './components/layout/MemberLayout';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { NotFound } from './pages/NotFound';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { BookManagement } from './pages/admin/BookManagement';
import { UserManagement } from './pages/admin/UserManagement';
import { RequestManagement } from './pages/admin/RequestManagement';
import { Attendance } from './pages/admin/Attendance';
import { Reports } from './pages/admin/Reports';
import { Announcements } from './pages/admin/Announcements';
import { MemberDashboard } from './pages/member/MemberDashboard';
import { SuperAdminDashboard } from './pages/superadmin/SuperAdminDashboard';

function adminSectionRoutes() {
  return (
    <>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="books" element={<BookManagement />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="requests" element={<RequestManagement />} />
      <Route path="attendance" element={<Attendance />} />
      <Route path="reports" element={<Reports />} />
      <Route path="announcements" element={<Announcements />} />
    </>
  );
}

function superAdminSectionRoutes() {
  return (
    <>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<SuperAdminDashboard />} />
      <Route path="books" element={<BookManagement />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="requests" element={<RequestManagement />} />
      <Route path="attendance" element={<Attendance />} />
      <Route path="reports" element={<Reports />} />
      <Route path="announcements" element={<Announcements />} />
      <Route path="settings" element={<SuperAdminDashboard />} />
      <Route path="logs" element={<SuperAdminDashboard />} />
      <Route path="backup" element={<SuperAdminDashboard />} />
      <Route path="recycle-bin" element={<BookManagement />} />
      <Route path="profile" element={<UserManagement />} />
    </>
  );
}

function App() {
  return (
    <LibraryDataProvider>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<RequireAuth role="admin" />}>
              <Route path="/admin" element={<AdminLayout />}>
                {adminSectionRoutes()}
              </Route>
            </Route>

            <Route element={<RequireAuth role="superadmin" />}>
              <Route path="/super_admin" element={<AdminLayout />}>
                {superAdminSectionRoutes()}
              </Route>
            </Route>

            <Route element={<RequireAuth role="member" />}>
              <Route path="/member" element={<MemberLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<MemberDashboard />} />
                <Route path="catalog" element={<MemberDashboard />} />
                <Route path="my-books" element={<MemberDashboard />} />
                <Route path="reservations" element={<MemberDashboard />} />
                <Route path="favorites" element={<MemberDashboard />} />
                <Route path="history" element={<MemberDashboard />} />
                <Route path="notifications" element={<MemberDashboard />} />
                <Route path="profile" element={<MemberDashboard />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastViewport />
        </ToastProvider>
      </AuthProvider>
    </LibraryDataProvider>
  );
}

export default App;
