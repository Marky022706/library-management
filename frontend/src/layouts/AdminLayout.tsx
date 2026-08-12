import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { adminNavItems, superAdminOnlyNavItems } from '@/components/layout/navConfig';
import { useAuth } from '@/hooks/useAuth';

export function AdminLayout() {
  const { currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'superadmin';
  const navItems = isSuperAdmin ? [...adminNavItems, ...superAdminOnlyNavItems] : adminNavItems;

  return (
    <DashboardLayout
      navItems={navItems}
      roleLabel={isSuperAdmin ? 'Super Admin Panel' : 'Admin Panel'}
      navbarTitle="Balingasag Public Library"
    />
  );
}
