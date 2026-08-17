import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { SuperAdminHeader } from '../../components/superadmin/SuperAdminHeader';
import { SuperAdminStatCards } from '../../components/superadmin/SuperAdminStatCards';
import { SystemAlertsBanner } from '../../components/superadmin/SystemAlertsBanner';
import { QuickActionsGrid } from '../../components/superadmin/QuickActionsGrid';
import { BorrowingTrendsChart } from '../../components/superadmin/BorrowingTrendsChart';
import { InventoryBreakdownChart } from '../../components/superadmin/InventoryBreakdownChart';
import { AttendanceAnalyticsChart } from '../../components/superadmin/AttendanceAnalyticsChart';
import { UserGrowthChart } from '../../components/superadmin/UserGrowthChart';
import { PendingRequestsSummary } from '../../components/superadmin/PendingRequestsSummary';
import { PendingApprovalsWidget } from '../../components/superadmin/PendingApprovalsWidget';
import { SystemHealthWidget } from '../../components/superadmin/SystemHealthWidget';
import { RecentActivityAudit } from '../../components/superadmin/RecentActivityAudit';
import { RecentBookActivityTable } from '../../components/superadmin/RecentBookActivityTable';
import { RecentUsersTable } from '../../components/superadmin/RecentUsersTable';
import { BackupModal } from '../../components/superadmin/BackupModal';
import { UserDetailsModal } from '../../components/users/UserDetailsModal';
import { LibraryCardModal } from '../../components/users/LibraryCardModal';

import { useAuth } from '../../context/AuthContext';
import { useLibraryData } from '../../context/LibraryDataContext';
import { useToast } from '../../context/ToastContext';
import type { User } from '../../types';

export function SuperAdminDashboard() {
  const { currentUser } = useAuth();
  const { users, books, requests, attendanceRecords, setUserStatus } = useLibraryData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Modals & Active state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [cardUser, setCardUser] = useState<User | null>(null);
  const [showBackupModal, setShowBackupModal] = useState(false);

  const handleApproveUser = async (user: User) => {
    setUserStatus(user.id, 'active');
    showToast(`Approved ${user.name}! Membership activated and digital QR issued.`, 'success');
  };

  const handleRejectUser = (user: User) => {
    setUserStatus(user.id, 'suspended');
    showToast(`Application for ${user.name} marked as suspended.`, 'info');
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-10">
      {/* 1. Dashboard Header */}
      <SuperAdminHeader
        userName={currentUser?.name || 'Elena Cruz'}
        onAddBook={() => navigate('/super_admin/books')}
        onCreateUser={() => navigate('/super_admin/users')}
        onBackupNow={() => setShowBackupModal(true)}
      />

      {/* 2. System Alerts Banner */}
      <SystemAlertsBanner
        onNavigateToUsers={() => navigate('/super_admin/users')}
        onNavigateToOverdue={() => navigate('/super_admin/reports')}
        onNavigateToBackup={() => setShowBackupModal(true)}
      />

      {/* 3. High-Level Statistics Cards */}
      <SuperAdminStatCards
        users={users}
        books={books}
        requests={requests}
        attendanceRecords={attendanceRecords}
      />

      {/* 4. Quick Actions Grid */}
      <Card title="Super Admin Quick Actions" subtitle="Fast administrative shortcuts across library management modules">
        <QuickActionsGrid
          onAddBook={() => navigate('/super_admin/books')}
          onCreateUser={() => navigate('/super_admin/users')}
          onReviewRequests={() => navigate('/super_admin/requests')}
          onGenerateReport={() => navigate('/super_admin/reports')}
          onBackupDatabase={() => setShowBackupModal(true)}
          onViewAuditTrail={() => showToast('Displaying real-time system audit logs below.', 'info')}
        />
      </Card>

      {/* 5. Analytics Section - 2x2 Responsive Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Borrowing & Circulation Trends" subtitle="Checkout, return, and overdue circulation metrics">
          <BorrowingTrendsChart />
        </Card>

        <Card title="Book Catalog & Inventory Health" subtitle="Availability, maintenance, and condition breakdown">
          <InventoryBreakdownChart books={books} onManageBooks={() => navigate('/super_admin/books')} />
        </Card>

        <Card title="Visitor & Attendance Analytics" subtitle="Daily traffic distribution and peak library usage hours">
          <AttendanceAnalyticsChart />
        </Card>

        <Card title="User Growth & Membership Demographics" subtitle="Active vs pending registrations and student enrollments">
          <UserGrowthChart users={users} />
        </Card>
      </div>

      {/* 6. Operations & Approvals Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Pending Requests Overview */}
        <Card title="Centralized Request Overview" subtitle="Pending borrowing, archive, and acquisition submissions">
          <PendingRequestsSummary onViewAllRequests={() => navigate('/super_admin/requests')} />
        </Card>

        {/* Pending Member Approvals */}
        <Card title="Pending Member Approvals" subtitle="Newly registered students awaiting administrator activation">
          <PendingApprovalsWidget
            users={users}
            onApprove={handleApproveUser}
            onReject={handleRejectUser}
            onView={(u: User) => setSelectedUser(u)}
          />
        </Card>

        {/* System Health & Backup Panel */}
        <Card title="System Health & Infrastructure" subtitle="Real-time services, database status, and automated backups">
          <SystemHealthWidget
            onBackupNow={() => setShowBackupModal(true)}
            onViewLogs={() => showToast('System audit trail & error logs are active.', 'info')}
          />
        </Card>
      </div>

      {/* 7. Real-Time Audit Trail */}
      <Card title="Live System Audit Trail & Recent Activity" subtitle="Real-time chronological log of authentication, circulation, and administrative changes">
        <RecentActivityAudit />
      </Card>

      {/* 8. Recent Tables: Book Activity & Recent Users */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card title="Recent Book Management Activity" subtitle="Latest catalog additions, shelf updates, and archives">
              <RecentBookActivityTable onViewAllBooks={() => navigate('/super_admin/books')} />
        </Card>

        <Card title="Recent Users & Staff Directory" subtitle="Quick directory view with role and status management">
          <RecentUsersTable
            users={users}
            onViewUser={(u: User) => setSelectedUser(u)}
            onViewAllUsers={() => navigate('/super_admin/users')}
          />
        </Card>
      </div>

      {/* Modals */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onApprove={(u: User) => {
            handleApproveUser(u);
            setSelectedUser(null);
          }}
          onOpenCard={(u: User) => {
            setCardUser(u);
            setSelectedUser(null);
          }}
        />
      )}

      {cardUser && (
        <LibraryCardModal
          user={cardUser}
          onClose={() => setCardUser(null)}
        />
      )}

      <BackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
      />
    </div>
  );
}
