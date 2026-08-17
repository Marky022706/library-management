import { useState } from 'react';
import { CheckCircle2, Database, FileText, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button';

interface SystemHealthWidgetProps {
  onBackupNow?: () => void;
  onViewLogs?: () => void;
}

export function SystemHealthWidget({ onBackupNow, onViewLogs }: SystemHealthWidgetProps) {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupNotice, setBackupNotice] = useState<string | null>(null);

  const services = [
    { name: 'Database (MySQL 3306)', status: 'Operational', latency: '12ms', ok: true },
    { name: 'REST API Gateway', status: 'Operational', latency: '24ms', ok: true },
    { name: 'Authentication / RBAC', status: 'Operational', latency: '8ms', ok: true },
    { name: 'QR Code Generator', status: 'Operational', latency: '15ms', ok: true },
    { name: 'Automated Daily Backup', status: 'Up to date', latency: '12:30 AM', ok: true },
  ];

  const handleTriggerBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      setBackupNotice('MySQL snapshot successfully generated: library_backup_latest.sql.gz');
      if (onBackupNow) onBackupNow();
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Services List */}
      <div className="flex flex-col divide-y divide-slate-100 rounded-xl border border-slate-200/80 bg-white">
        {services.map((svc, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50"></span>
              <span className="font-semibold text-slate-800">{svc.name}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <span>{svc.latency}</span>
              <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                {svc.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Backup notification if triggered */}
      {backupNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{backupNotice}</span>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-slate-500">Last Backup: <strong>Today, 12:30 AM</strong></span>
        <div className="flex items-center gap-2">
          {onViewLogs && (
            <Button
              size="sm"
              variant="outline"
              onClick={onViewLogs}
              className="h-8 gap-1.5 text-xs text-slate-700 hover:bg-slate-50"
            >
              <FileText className="h-3.5 w-3.5" />
              View Logs
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleTriggerBackup}
            disabled={isBackingUp}
            className="h-8 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            {isBackingUp ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Backing up...
              </>
            ) : (
              <>
                <Database className="h-3.5 w-3.5" />
                Backup Now
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
