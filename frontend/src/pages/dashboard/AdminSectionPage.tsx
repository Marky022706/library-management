import React from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  BookOpen,
  BookmarkCheck,
  CalendarCheck,
  CheckCircle2,
  Download,
  FileBarChart,
  Filter,
  PenLine,
  Plus,
  QrCode,
  Search,
  Settings,
  ShieldCheck,
  Tags,
  UsersRound,
  WalletCards,
} from 'lucide-react';
import './AdminSectionPage.css';

type SectionKey =
  | 'books'
  | 'categories'
  | 'authors'
  | 'members'
  | 'transactions'
  | 'reservations'
  | 'fines'
  | 'attendance'
  | 'reports'
  | 'notifications'
  | 'settings';

interface AdminSectionPageProps {
  section: SectionKey;
}

const sectionConfig = {
  books: {
    eyebrow: 'Collection Control',
    title: 'Books Management',
    description: 'Manage accession records, copy availability, shelf assignments, and public catalog visibility.',
    icon: BookOpen,
    primaryAction: 'Add New Book',
    secondaryAction: 'Import Records',
    stats: [
      ['Total Titles', '12,450', '+320 this week'],
      ['Available Copies', '9,842', '79% circulation ready'],
      ['Digital Editions', '416', '+18 uploaded'],
    ],
    columns: ['Accession', 'Title', 'Category', 'Copies', 'Status'],
    rows: [
      ['BPL-2026-1042', 'Introduction to Networking', 'Technology', '14 / 18', 'Available'],
      ['BPL-2026-0881', 'Philippine Literature Today', 'Literature', '7 / 10', 'Available'],
      ['BPL-2026-0714', 'Database Systems', 'Computer Science', '2 / 9', 'Low Stock'],
    ],
    tasks: ['Review damaged-copy reports', 'Assign QR labels to new arrivals', 'Publish new acquisitions list'],
  },
  categories: {
    eyebrow: 'Catalog Taxonomy',
    title: 'Categories',
    description: 'Organize titles into clean, public-friendly categories for browsing and reporting.',
    icon: Tags,
    primaryAction: 'Create Category',
    secondaryAction: 'Merge Duplicates',
    stats: [
      ['Active Categories', '42', '+3 this quarter'],
      ['Most Used', 'Technology', '2,184 titles'],
      ['Unassigned Books', '29', 'Needs review'],
    ],
    columns: ['Category', 'Books', 'Parent Group', 'Visibility', 'Status'],
    rows: [
      ['Technology', '2,184', 'Reference', 'Public', 'Active'],
      ['Children Stories', '1,203', 'Community', 'Public', 'Active'],
      ['Local History', '318', 'Archives', 'Staff Review', 'Draft'],
    ],
    tasks: ['Audit duplicate category names', 'Update public category descriptions', 'Map old Dewey tags'],
  },
  authors: {
    eyebrow: 'Bibliographic Records',
    title: 'Authors',
    description: 'Maintain author profiles, aliases, biographies, and title relationships.',
    icon: PenLine,
    primaryAction: 'Add Author',
    secondaryAction: 'Resolve Aliases',
    stats: [
      ['Author Records', '3,842', '+41 added'],
      ['Local Authors', '76', 'Featured shelf'],
      ['Unlinked Titles', '15', 'Needs matching'],
    ],
    columns: ['Author', 'Titles', 'Country', 'Last Updated', 'Status'],
    rows: [
      ['Jose Rizal', '18', 'Philippines', 'Aug 03, 2026', 'Verified'],
      ['Lualhati Bautista', '9', 'Philippines', 'Aug 01, 2026', 'Verified'],
      ['Unknown Contributors', '15', 'Mixed', 'Jul 29, 2026', 'Review'],
    ],
    tasks: ['Verify local author metadata', 'Attach author portraits', 'Resolve imported duplicate names'],
  },
  members: {
    eyebrow: 'Community Access',
    title: 'Members',
    description: 'Register patrons, verify IDs, monitor membership status, and issue QR library cards.',
    icon: UsersRound,
    primaryAction: 'Register Member',
    secondaryAction: 'Export List',
    stats: [
      ['Active Members', '1,245', '+48 this month'],
      ['Pending Verification', '31', 'ID review queue'],
      ['New Today', '12', 'Walk-in registrations'],
    ],
    columns: ['Member ID', 'Name', 'Type', 'Card Status', 'Last Visit'],
    rows: [
      ['MEM-10284', 'Juan Dela Cruz', 'Adult', 'Active', 'Aug 06, 2026'],
      ['MEM-10285', 'Maria Santos', 'Student', 'Active', 'Aug 05, 2026'],
      ['MEM-10286', 'Ana Villanueva', 'Senior', 'Pending', 'Aug 04, 2026'],
    ],
    tasks: ['Approve pending ID uploads', 'Print replacement library cards', 'Send renewal reminders'],
  },
  transactions: {
    eyebrow: 'Circulation Desk',
    title: 'Borrow Transactions',
    description: 'Track borrowing, returns, due dates, renewals, and staff-assisted circulation workflows.',
    icon: BookmarkCheck,
    primaryAction: 'Borrow / Return',
    secondaryAction: 'Scan Book QR',
    stats: [
      ['Borrowed Today', '84', '+12 vs yesterday'],
      ['Returned Today', '67', '91% on time'],
      ['Renewal Requests', '19', 'Awaiting approval'],
    ],
    columns: ['Transaction', 'Member', 'Book', 'Due Date', 'Status'],
    rows: [
      ['TXN-00124', 'Juan Dela Cruz', 'Introduction to Networking', 'Aug 12, 2026', 'Borrowed'],
      ['TXN-00125', 'Maria Santos', 'Database Systems', 'Aug 05, 2026', 'Returned'],
      ['TXN-00126', 'Pedro Reyes', 'Web Development Fundamentals', 'Jul 30, 2026', 'Overdue'],
    ],
    tasks: ['Process return bin', 'Approve renewal queue', 'Notify overdue borrowers'],
  },
  reservations: {
    eyebrow: 'Hold Queue',
    title: 'Reservations',
    description: 'Manage patron holds, pickup windows, queue priority, and expired reservations.',
    icon: CalendarCheck,
    primaryAction: 'Create Reservation',
    secondaryAction: 'Notify Queue',
    stats: [
      ['Pending Holds', '23', '-6 since yesterday'],
      ['Ready for Pickup', '11', 'Front desk shelf'],
      ['Expiring Today', '4', 'Needs SMS notice'],
    ],
    columns: ['Reservation', 'Member', 'Book', 'Pickup Until', 'Status'],
    rows: [
      ['RSV-00921', 'Ana Villanueva', 'Philippine Literature Today', 'Aug 08, 2026', 'Ready'],
      ['RSV-00922', 'Carlos Lim', 'Basic Electronics', 'Aug 09, 2026', 'Queued'],
      ['RSV-00923', 'Leah Gomez', 'Local History Reader', 'Aug 06, 2026', 'Expiring'],
    ],
    tasks: ['Prepare pickup shelf', 'Release expired holds', 'Reorder queue after returns'],
  },
  fines: {
    eyebrow: 'Payments',
    title: 'Fines',
    description: 'Monitor overdue fees, waived charges, payment collections, and municipal receipts.',
    icon: WalletCards,
    primaryAction: 'Record Payment',
    secondaryAction: 'Print Receipt',
    stats: [
      ['Collected', 'PHP 18,540', '+PHP 1,240 this week'],
      ['Outstanding', 'PHP 4,820', '17 accounts'],
      ['Waived Fees', 'PHP 920', 'Approved by admin'],
    ],
    columns: ['Receipt', 'Member', 'Reason', 'Amount', 'Status'],
    rows: [
      ['OR-2026-114', 'Pedro Reyes', 'Overdue return', 'PHP 180', 'Unpaid'],
      ['OR-2026-115', 'Maria Santos', 'Lost card', 'PHP 50', 'Paid'],
      ['OR-2026-116', 'Juan Dela Cruz', 'Damaged book', 'PHP 320', 'Review'],
    ],
    tasks: ['Reconcile cash drawer', 'Review waiver requests', 'Export finance summary'],
  },
  attendance: {
    eyebrow: 'QR Operations',
    title: 'Attendance',
    description: 'Scan member QR cards, track daily foot traffic, and support visitor log reporting.',
    icon: QrCode,
    primaryAction: 'Scan QR Attendance',
    secondaryAction: 'Manual Check-in',
    stats: [
      ['Visits Today', '386', '+44 vs yesterday'],
      ['Peak Hour', '10:00 AM', '72 visitors'],
      ['Active Scanner', 'Online', 'Front desk kiosk'],
    ],
    columns: ['Log ID', 'Visitor', 'Type', 'Check-in', 'Status'],
    rows: [
      ['ATT-7781', 'Juan Dela Cruz', 'Member', '08:24 AM', 'Checked In'],
      ['ATT-7782', 'Reading Program Group', 'Group', '09:15 AM', 'Checked In'],
      ['ATT-7783', 'Walk-in Visitor', 'Guest', '10:03 AM', 'Manual'],
    ],
    tasks: ['Test QR scanner kiosk', 'Export daily attendance', 'Flag duplicate scans'],
  },
  reports: {
    eyebrow: 'Insights',
    title: 'Reports',
    description: 'Generate operational, inventory, circulation, attendance, and compliance reports.',
    icon: FileBarChart,
    primaryAction: 'Generate Report',
    secondaryAction: 'Download PDF',
    stats: [
      ['Reports Generated', '128', '+9 this month'],
      ['Scheduled Reports', '6', 'Auto-send enabled'],
      ['Inventory Accuracy', '98.4%', 'Last audit'],
    ],
    columns: ['Report', 'Period', 'Owner', 'Generated', 'Status'],
    rows: [
      ['Monthly Circulation', 'July 2026', 'Admin Monica', 'Aug 01, 2026', 'Ready'],
      ['Attendance Summary', 'Week 31', 'Front Desk', 'Aug 05, 2026', 'Ready'],
      ['Inventory Audit', 'Q3 2026', 'Librarian', 'Scheduled', 'Pending'],
    ],
    tasks: ['Schedule August circulation report', 'Review inventory discrepancy list', 'Send mayor office summary'],
  },
  notifications: {
    eyebrow: 'Messaging Center',
    title: 'Notifications',
    description: 'Send reminders, announcements, due-date alerts, and reservation pickup notices.',
    icon: Bell,
    primaryAction: 'Compose Notice',
    secondaryAction: 'Send SMS Batch',
    stats: [
      ['Unread Alerts', '18', 'Needs action'],
      ['Sent Today', '246', 'SMS and email'],
      ['Failed Sends', '3', 'Retry queued'],
    ],
    columns: ['Message', 'Audience', 'Channel', 'Sent', 'Status'],
    rows: [
      ['Overdue reminder', '17 members', 'SMS', '08:30 AM', 'Sent'],
      ['Book Fair announcement', 'All members', 'Email', '09:00 AM', 'Sent'],
      ['Reservation pickup', '11 members', 'SMS', 'Queued', 'Pending'],
    ],
    tasks: ['Retry failed SMS notices', 'Approve public announcement', 'Update message templates'],
  },
  settings: {
    eyebrow: 'System Administration',
    title: 'Settings',
    description: 'Configure library policies, roles, borrowing rules, fines, and system preferences.',
    icon: Settings,
    primaryAction: 'Save Settings',
    secondaryAction: 'Audit Logs',
    stats: [
      ['Borrow Limit', '3 books', 'Per active member'],
      ['Loan Period', '7 days', 'Renewable once'],
      ['System Health', 'Good', 'Last sync online'],
    ],
    columns: ['Setting', 'Value', 'Scope', 'Updated By', 'Status'],
    rows: [
      ['Daily opening hours', '8:00 AM - 5:00 PM', 'Public', 'Admin Monica', 'Active'],
      ['Overdue fine', 'PHP 5 / day', 'Circulation', 'Super Admin', 'Active'],
      ['QR attendance', 'Enabled', 'Front Desk', 'Librarian', 'Active'],
    ],
    tasks: ['Review role permissions', 'Update holiday schedule', 'Backup policy configuration'],
  },
} satisfies Record<SectionKey, {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ElementType;
  primaryAction: string;
  secondaryAction: string;
  stats: string[][];
  columns: string[];
  rows: string[][];
  tasks: string[];
}>;

const statusClass = (value: string) => value.toLowerCase().replace(/\s+/g, '-');

export const AdminSectionPage: React.FC<AdminSectionPageProps> = ({ section }) => {
  const config = sectionConfig[section];
  const Icon = config.icon;

  return (
    <div className="admin-section-page">
      <motion.section
        className="section-banner"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="section-banner-icon">
          <Icon size={30} />
        </div>
        <div className="section-banner-copy">
          <p>{config.eyebrow}</p>
          <h2>{config.title}</h2>
          <span>{config.description}</span>
        </div>
        <div className="section-actions">
          <button type="button" className="section-secondary-button">
            <Download size={17} />
            <span>{config.secondaryAction}</span>
          </button>
          <button type="button" className="section-primary-button">
            <Plus size={18} />
            <span>{config.primaryAction}</span>
          </button>
        </div>
      </motion.section>

      <section className="section-stat-grid">
        {config.stats.map(([label, value, helper], index) => (
          <motion.article
            className="section-stat-card"
            key={label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <p>{label}</p>
            <strong>{value}</strong>
            <span>{helper}</span>
          </motion.article>
        ))}
      </section>

      <section className="section-content-grid">
        <article className="section-table-card">
          <div className="section-card-header">
            <div>
              <p>Records</p>
              <h3>{config.title} Overview</h3>
            </div>
            <div className="section-tools">
              <button type="button" aria-label="Search records"><Search size={17} /></button>
              <button type="button" aria-label="Filter records"><Filter size={17} /></button>
            </div>
          </div>

          <div className="section-table-wrap">
            <table className="section-table">
              <thead>
                <tr>
                  {config.columns.map((column) => <th key={column}>{column}</th>)}
                </tr>
              </thead>
              <tbody>
                {config.rows.map((row) => (
                  <tr key={row.join('-')}>
                    {row.map((cell, index) => (
                      <td key={`${cell}-${index}`}>
                        {index === row.length - 1 ? <span className={`section-status ${statusClass(cell)}`}>{cell}</span> : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <aside className="section-side-card">
          <div className="section-card-header compact">
            <div>
              <p>Priority</p>
              <h3>Today&apos;s Work</h3>
            </div>
            <CheckCircle2 size={22} />
          </div>
          <div className="task-list">
            {config.tasks.map((task, index) => (
              <div key={task}>
                <span>{index + 1}</span>
                <p>{task}</p>
              </div>
            ))}
          </div>
          <div className="workflow-card">
            <div>
              <ShieldCheck size={19} />
              <strong>Admin Ready</strong>
            </div>
            <p>Module controls are prepared for API-backed actions, approvals, and audit tracking.</p>
          </div>
        </aside>
      </section>
    </div>
  );
};
