import React, { useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Archive,
  Bell,
  BookOpen,
  BookmarkCheck,
  CalendarCheck,
  ChevronDown,
  CreditCard,
  FileBarChart,
  Languages,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PenLine,
  Search,
  Settings,
  Sun,
  Tags,
  UserRound,
  UsersRound,
  WalletCards,
  X,
} from 'lucide-react';
import './DashboardLayout.css';

const adminNavItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Books', path: '/dashboard/catalog', icon: BookOpen },
  { name: 'Categories', path: '/dashboard/categories', icon: Tags },
  { name: 'Authors', path: '/dashboard/authors', icon: PenLine },
  { name: 'Members', path: '/dashboard/members', icon: UsersRound },
  { name: 'Borrow Transactions', path: '/dashboard/transactions', icon: BookmarkCheck },
  { name: 'Reservations', path: '/dashboard/reservations', icon: CalendarCheck },
  { name: 'Fines', path: '/dashboard/fines', icon: WalletCards },
  { name: 'Attendance', path: '/dashboard/attendance', icon: Archive },
  { name: 'Reports', path: '/dashboard/reports', icon: FileBarChart },
  { name: 'Notifications', path: '/dashboard/notifications', icon: Bell },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const adminName = useMemo(() => {
    const fullName = `${user?.first_name || 'Monica'} ${user?.last_name || ''}`.trim();
    return fullName || 'Monica';
  }, [user?.first_name, user?.last_name]);

  const role = user?.role?.role_name || 'Super Admin';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className={`admin-shell ${isDarkMode ? 'dark' : 'light'}`}>
      <button
        type="button"
        className="mobile-menu-button"
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Open navigation"
      >
        <Menu size={22} />
      </button>

      {isMobileMenuOpen && <button type="button" className="sidebar-scrim" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close navigation" />}

      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'is-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">
            <img src="/library-logo.png" alt="Balingasag Public Library logo" />
          </div>
          <div>
            <h1>Balingasag Public Library</h1>
            <p>Municipal Library System</p>
          </div>
          <button type="button" className="sidebar-close" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close navigation">
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Admin navigation">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="system-card">
            <CreditCard size={18} />
            <div>
              <strong>Library Card QR</strong>
              <span>Ready for scans</span>
            </div>
          </div>
          <button type="button" className="logout-button" onClick={() => setIsLogoutModalOpen(true)}>
            <LogOut size={17} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-search">
            <Search size={18} />
            <input type="search" placeholder="Search books, members, transactions..." aria-label="Search dashboard" />
          </div>

          <div className="topbar-actions">
            <button type="button" className="icon-button notification-button" aria-label="Notifications">
              <Bell size={19} />
              <span>3</span>
            </button>

            <button
              type="button"
              className="icon-button"
              onClick={() => setIsDarkMode((value) => !value)}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            <button type="button" className="language-button">
              <Languages size={17} />
              <span>ENG</span>
              <ChevronDown size={15} />
            </button>

            <motion.div className="admin-profile" whileHover={{ y: -1 }} transition={{ duration: 0.18 }}>
              <div className="profile-avatar">
                <UserRound size={20} />
              </div>
              <div>
                <strong>Admin {adminName.split(' ')[0]}</strong>
                <span>{role}</span>
              </div>
              <ChevronDown size={16} />
            </motion.div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet context={{ isDarkMode }} />
        </main>
      </div>

      {isLogoutModalOpen && (
        <div className="logout-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="logout-modal-title">
          <motion.div
            className="logout-modal"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="logout-modal-icon">
              <LogOut size={24} />
            </div>
            <h2 id="logout-modal-title">Are you sure to log out?</h2>
            <p>You will be signed out of the Balingasag Public Library admin dashboard. Save any unfinished changes before leaving.</p>
            <div className="logout-modal-actions">
              <button type="button" className="logout-cancel-button" onClick={() => setIsLogoutModalOpen(false)} disabled={isLoggingOut}>
                Cancel
              </button>
              <button type="button" className="logout-confirm-button" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};





