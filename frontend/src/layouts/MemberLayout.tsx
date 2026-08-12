import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { memberNavItems } from '@/components/layout/navConfig';

export function MemberLayout() {
  return <DashboardLayout navItems={memberNavItems} roleLabel="Member Portal" navbarTitle="Balingasag Public Library" />;
}
