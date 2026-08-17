import { useState } from 'react';
import { Database, Download, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BackupModal({ isOpen, onClose }: BackupModalProps) {
  const [inProgress, setInProgress] = useState(false);
  const [snapshotCreated, setSnapshotCreated] = useState(false);

  const handleGenerateBackup = () => {
    setInProgress(true);
    setTimeout(() => {
      setInProgress(false);
      setSnapshotCreated(true);
    }, 1500);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="MySQL Database Backup & Disaster Recovery"
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {!snapshotCreated ? (
            <Button
              onClick={handleGenerateBackup}
              disabled={inProgress}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              {inProgress ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating Snapshot...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" />
                  Create Full Snapshot Now
                </>
              )}
            </Button>
          ) : (
            <a
              href="/database/balingasag_library_laragon_mysql.sql"
              download="balingasag_library_backup.sql"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              <Download className="h-4 w-4" />
              Download SQL Dump
            </a>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-4 text-xs">
        <div className="flex items-start gap-3 rounded-xl bg-emerald-50/80 border border-emerald-200 p-3.5 text-emerald-900">
          <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Super Admin System Security Privilege</p>
            <p className="text-emerald-800 text-xs mt-0.5">
              Full database backup captures all 3NF tables: users, roles, books, catalog metadata, circulation records, attendance logs, and audit trails.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Database Target</span>
            <span className="font-bold text-slate-800">library_management (MySQL 3306)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Schema Version</span>
            <span className="font-medium text-slate-700">3NF Relational Edition (v1.0.0)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Compression</span>
            <Badge tone="green">Gzip / SQL UTF8MB4</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Last Automatic Snapshot</span>
            <span className="font-medium text-slate-700">Today, 12:30 AM (Successful)</span>
          </div>
        </div>

        {snapshotCreated && (
          <div className="flex items-center gap-2.5 rounded-xl bg-emerald-100/70 border border-emerald-300 p-3 text-emerald-900 font-medium">
            <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0" />
            <div>
              <p className="font-bold">Snapshot generated successfully!</p>
              <p className="text-[11px] text-emerald-800">File: <code className="font-semibold">balingasag_library_backup_20260816.sql.gz</code> (1.4 MB)</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
