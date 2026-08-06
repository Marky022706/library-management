import React from 'react';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowUpRight,
  BookOpen,
  BookmarkCheck,
  CalendarDays,
  Clock3,
  LibraryBig,
  PhilippinePeso,
  Plus,
  QrCode,
  RotateCcw,
  SearchCheck,
  ShieldCheck,
  UserPlus,
  UsersRound,
} from 'lucide-react';
import './DashboardPage.css';

const stats = [
  { label: 'Total Books', value: '12,450', compare: '+320 from last week', icon: LibraryBig },
  { label: 'Books Borrowed Today', value: '84', compare: '+12 vs yesterday', icon: BookmarkCheck },
  { label: 'Active Members', value: '1,245', compare: '+48 this month', icon: UsersRound },
  { label: 'Pending Reservations', value: '23', compare: '-6 since yesterday', icon: Clock3 },
  { label: 'Overdue Books', value: '17', compare: '4 resolved today', icon: SearchCheck },
  { label: 'Total Fines Collected', value: 'PHP 18,540', compare: '+PHP 1,240 this week', icon: PhilippinePeso },
];

const usageData = [
  { month: 'Jan', borrowed: 96, returned: 76 },
  { month: 'Feb', borrowed: 62, returned: 58 },
  { month: 'Mar', borrowed: 138, returned: 122 },
  { month: 'Apr', borrowed: 88, returned: 82 },
  { month: 'May', borrowed: 112, returned: 94 },
  { month: 'Jun', borrowed: 74, returned: 70 },
  { month: 'Jul', borrowed: 156, returned: 146 },
  { month: 'Aug', borrowed: 171, returned: 162 },
  { month: 'Sep', borrowed: 82, returned: 78 },
  { month: 'Oct', borrowed: 147, returned: 141 },
  { month: 'Nov', borrowed: 118, returned: 105 },
  { month: 'Dec', borrowed: 70, returned: 64 },
];

const transactions = [
  { id: 'TXN-00124', member: 'Juan Dela Cruz', book: 'Introduction to Networking', status: 'Borrowed', due: 'Aug 12, 2026' },
  { id: 'TXN-00125', member: 'Maria Santos', book: 'Database Systems', status: 'Returned', due: 'Aug 05, 2026' },
  { id: 'TXN-00126', member: 'Pedro Reyes', book: 'Web Development Fundamentals', status: 'Overdue', due: 'Jul 30, 2026' },
  { id: 'TXN-00127', member: 'Ana Villanueva', book: 'Philippine Literature Today', status: 'Reserved', due: 'Aug 09, 2026' },
];

const calendarDays = Array.from({ length: 35 }, (_, index) => index + 1);
const quickActions = [
  { label: 'Add New Book', icon: Plus },
  { label: 'Register Member', icon: UserPlus },
  { label: 'Borrow / Return', icon: RotateCcw },
  { label: 'Scan QR Attendance', icon: QrCode },
];

export const DashboardPage: React.FC = () => {
  return (
    <div className="library-dashboard">
      <motion.section
        className="dashboard-hero"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div>
          <p>Municipal Library Administration</p>
          <h2>Balingasag Public Library</h2>
        </div>
        <div className="hero-status">
          <ShieldCheck size={18} />
          <span>All systems operational</span>
        </div>
      </motion.section>

      <section className="dashboard-grid top-grid">
        <motion.article className="activity-card premium-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
          <div className="section-heading">
            <div>
              <p>Today</p>
              <h3>Today's Library Activity</h3>
            </div>
            <span className="live-badge">Open</span>
          </div>

          <div className="librarian-profile">
            <div className="librarian-avatar">
              <BookOpen size={44} />
              <span />
            </div>
            <div>
              <strong>Ms. Elena Ramos</strong>
              <p>Librarian on duty</p>
            </div>
          </div>

          <div className="activity-list">
            <div>
              <span>Opening hours</span>
              <strong>8:00 AM - 5:00 PM</strong>
            </div>
            <div>
              <span>Current active members</span>
              <strong>1,245</strong>
            </div>
            <div>
              <span>QR attendance status</span>
              <strong className="success-text">Scanning enabled</strong>
            </div>
          </div>
        </motion.article>

        <div className="stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.article
                key={stat.label}
                className="stat-card premium-card"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + index * 0.04 }}
                whileHover={{ y: -5 }}
              >
                <div>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                  <p>{stat.compare}</p>
                </div>
                <div className="stat-icon">
                  <Icon size={22} />
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="dashboard-grid analytics-grid">
        <motion.article className="chart-card premium-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
          <div className="section-heading chart-heading">
            <div>
              <p>Analytics</p>
              <h3>Library Usage Statistics</h3>
            </div>
            <div className="chart-legend">
              <span><i className="green-dot" />Books Borrowed</span>
              <span><i className="yellow-dot" />Books Returned</span>
            </div>
          </div>

          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData} barGap={7} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(107, 114, 128, 0.18)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'rgba(34, 139, 34, 0.07)' }} contentStyle={{ borderRadius: 14, border: '1px solid var(--border)' }} />
                <Bar dataKey="borrowed" fill="#228B22" radius={[8, 8, 0, 0]} animationDuration={900} />
                <Bar dataKey="returned" fill="#FACC15" radius={[8, 8, 0, 0]} animationDuration={1100} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.article>

        <motion.article className="calendar-card premium-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
          <div className="section-heading">
            <div>
              <p>Schedule</p>
              <h3>Library Calendar</h3>
            </div>
            <CalendarDays size={22} />
          </div>
          <div className="month-label">August 2026</div>
          <div className="weekdays">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="calendar-grid">
            {calendarDays.map((day) => <span key={day} className={day === 6 ? 'today' : ''}>{day <= 31 ? day : day - 31}</span>)}
          </div>
          <div className="events-list">
            <h4>Upcoming events</h4>
            <p><span />Book Fair</p>
            <p><span />Reading Program</p>
            <p><span />Inventory Audit</p>
          </div>
        </motion.article>
      </section>

      <section className="bottom-grid">
        <motion.article className="transactions-card premium-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
          <div className="section-heading">
            <div>
              <p>Monitoring</p>
              <h3>Recent Transactions</h3>
            </div>
            <button type="button" className="text-button">View all <ArrowUpRight size={16} /></button>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Member</th>
                  <th>Book Title</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.member}</td>
                    <td>{transaction.book}</td>
                    <td><span className={`status-badge ${transaction.status.toLowerCase()}`}>{transaction.status}</span></td>
                    <td>{transaction.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.article>

        <motion.article className="quick-card premium-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
          <div className="section-heading">
            <div>
              <p>Operations</p>
              <h3>Quick Actions</h3>
            </div>
          </div>
          <div className="quick-actions">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button type="button" key={action.label}>
                  <Icon size={20} />
                  <span>{action.label}</span>
                  <strong>Open</strong>
                </button>
              );
            })}
          </div>
        </motion.article>
      </section>
    </div>
  );
};
