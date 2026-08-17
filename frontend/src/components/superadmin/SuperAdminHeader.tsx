import { useState } from 'react';
import { ShieldCheck, Calendar, Search, PlusCircle, Database } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface SuperAdminHeaderProps {
  userName: string;
  onAddBook?: () => void;
  onCreateUser?: () => void;
  onBackupNow?: () => void;
}

export function SuperAdminHeader({
  userName,
  onAddBook,
  onCreateUser,
  onBackupNow,
}: SuperAdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showActionMenu, setShowActionMenu] = useState(false);

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const firstName = userName ? userName.split(' ')[0] : 'Super Admin';

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left identity & titles */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Super Admin Dashboard</h1>
              <Badge tone="green" dot className="bg-emerald-50 text-emerald-700 border-emerald-200">
                SUPER PRIVILEGE
              </Badge>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mt-0.5">
              System Overview & Administration
            </p>
            <p className="text-sm text-slate-500 mt-0.5">
              Welcome back, <span className="font-semibold text-slate-800">{firstName}</span>. Monitor and manage the entire Balingasag Public Library system.
            </p>
          </div>
        </div>

        {/* Right actions: Date & Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-600">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>{todayFormatted}</span>
          </div>

          <div className="relative">
            <Button
              onClick={() => setShowActionMenu(!showActionMenu)}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-semibold text-sm"
            >
              <PlusCircle className="h-4 w-4" />
              Quick Actions
            </Button>

            {showActionMenu && (
              <div
                className="absolute right-0 z-30 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
                onClick={() => setShowActionMenu(false)}
              >
                {onAddBook && (
                  <button
                    onClick={onAddBook}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                  >
                    <PlusCircle className="h-4 w-4 text-emerald-600" />
                    Add New Book
                  </button>
                )}
                {onCreateUser && (
                  <button
                    onClick={onCreateUser}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                  >
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    Create Staff / Member
                  </button>
                )}
                {onBackupNow && (
                  <button
                    onClick={onBackupNow}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                  >
                    <Database className="h-4 w-4 text-purple-600" />
                    Backup Database Now
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Quick Search Bar */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Global search across users, books, accession numbers, requests, and system logs..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
        />
      </div>
    </div>
  );
}
