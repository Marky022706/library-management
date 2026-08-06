import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { AdminSectionPage } from './pages/dashboard/AdminSectionPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="catalog" element={<AdminSectionPage section="books" />} />
              <Route path="categories" element={<AdminSectionPage section="categories" />} />
              <Route path="authors" element={<AdminSectionPage section="authors" />} />
              <Route path="members" element={<AdminSectionPage section="members" />} />
              <Route path="transactions" element={<AdminSectionPage section="transactions" />} />
              <Route path="reservations" element={<AdminSectionPage section="reservations" />} />
              <Route path="fines" element={<AdminSectionPage section="fines" />} />
              <Route path="attendance" element={<AdminSectionPage section="attendance" />} />
              <Route path="reports" element={<AdminSectionPage section="reports" />} />
              <Route path="notifications" element={<AdminSectionPage section="notifications" />} />
              <Route path="settings" element={<AdminSectionPage section="settings" />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;



