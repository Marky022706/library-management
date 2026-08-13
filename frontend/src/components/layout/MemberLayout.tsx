import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { memberNavItems } from './navConfig';
import { useAuth } from '../../context/AuthContext';

/** Shell for `/member/*` — same chrome as the admin shell, scoped to a member's own nav. */
export function MemberLayout() {
  const { currentUser } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const userName = currentUser?.name ?? '';

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar
        basePath="/member"
        roleLabel="Member"
        userName={userName}
        navItems={memberNavItems}
        sectionLabel="MY LIBRARY"
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
