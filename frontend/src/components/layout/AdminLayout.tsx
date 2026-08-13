import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { navItems } from './navConfig';
import { useAuth } from '../../context/AuthContext';

/**
 * Shared shell for both `/admin/*` and `/superadmin/*`. Admin and Super Admin
 * render the exact same pages — only the sidebar identity/role label and the
 * dashboard heading (read from `currentUser` inside each page) differ.
 */
export function AdminLayout() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isSuperAdmin = location.pathname.startsWith('/superadmin');
  const basePath = isSuperAdmin ? '/superadmin' : '/admin';
  const roleLabel = isSuperAdmin ? 'Super Admin' : 'Administrator';
  const userName = currentUser?.name ?? '';

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar
        basePath={basePath}
        roleLabel={roleLabel}
        userName={userName}
        navItems={navItems}
        sectionLabel="ADMINISTRATION"
        isSuperAdmin={isSuperAdmin}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader userName={userName} onOpenMenu={() => setMobileNavOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-7 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
