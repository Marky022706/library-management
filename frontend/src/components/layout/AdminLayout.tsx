import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { navItems, superAdminNavItems } from './navConfig';
import { useAuth } from '../../context/AuthContext';

/**
 * Shell for `/admin/*` and `/super_admin/*`.
 */
export function AdminLayout() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isSuperAdmin = location.pathname.startsWith('/super_admin');
  const basePath = isSuperAdmin ? '/super_admin' : '/admin';
  const roleLabel = isSuperAdmin ? 'Super Admin' : 'Administrator';
  const userName = currentUser?.name ?? '';
  const currentNavItems = isSuperAdmin ? superAdminNavItems : navItems;
  const sectionLabel = isSuperAdmin ? 'SUPER ADMIN' : 'ADMINISTRATION';

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar
        basePath={basePath}
        roleLabel={roleLabel}
        userName={userName}
        navItems={currentNavItems}
        sectionLabel={sectionLabel}
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
